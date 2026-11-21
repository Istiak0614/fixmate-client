/**
 * PDF invoice (optional feature) with jsPDF + jspdf-autotable.
 * The data always comes from the server (GET /api/payments/:id, owner only), never from the page,
 * so the PDF shows exactly what Stripe charged. The libraries are loaded only when a user
 * clicks "Invoice", so they don't slow down the first page load.
 */
import { api } from "@/lib/api";
import type { Payment } from "@/lib/types";

const TEAL: [number, number, number] = [15, 118, 110]; // --primary (light theme)
const INK: [number, number, number] = [15, 23, 42];
const MUTED: [number, number, number] = [100, 116, 139];

/** Short, readable invoice number made from the payment id, e.g. FM-6A1F09C2 */
export const invoiceNumber = (paymentId: string) => `FM-${paymentId.slice(-8).toUpperCase()}`;

const money = (n: number) => `$${n.toFixed(2)}`; // plain ASCII: the built-in PDF font has no fancy symbols
const dateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export async function downloadInvoice(paymentId: string) {
  const [payment, { jsPDF }, { default: autoTable }] = await Promise.all([
    api<Payment>(`/payments/${paymentId}`),
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const left = 18;
  const right = pageWidth - 18;
  const number = invoiceNumber(payment._id);

  // Header band
  doc.setFillColor(...TEAL);
  doc.rect(0, 0, pageWidth, 34, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold").setFontSize(22).text("FixMate", left, 20);
  doc.setFont("helvetica", "normal").setFontSize(10).text("Smart device & home appliance repair", left, 27);
  doc.setFont("helvetica", "bold").setFontSize(16).text("INVOICE", right, 20, { align: "right" });
  doc.setFont("helvetica", "normal").setFontSize(10).text(number, right, 27, { align: "right" });

  // Billed to / Technician / Payment info
  let y = 48;
  const block = (x: number, title: string, lines: string[]) => {
    doc.setTextColor(...MUTED).setFont("helvetica", "bold").setFontSize(9).text(title, x, y);
    doc.setTextColor(...INK).setFont("helvetica", "normal").setFontSize(10);
    lines.forEach((line, i) => doc.text(line, x, y + 6 + i * 5));
  };
  block(left, "BILLED TO", [payment.customerName, payment.customerEmail]);
  block(left + 62, "TECHNICIAN", [payment.technicianName, payment.technicianEmail]);
  block(left + 124, "PAYMENT", [`Paid ${dateTime(payment.paidAt)}`, "Card via Stripe"]);

  // Line items
  autoTable(doc, {
    startY: y + 22,
    head: [["Description", { content: "Qty", styles: { halign: "center" } }, { content: "Amount", styles: { halign: "right" } }]],
    body: [[`Repair service: ${payment.serviceTitle}`, "1", money(payment.amount)]],
    theme: "striped",
    headStyles: { fillColor: TEAL, textColor: 255, fontStyle: "bold" },
    styles: { font: "helvetica", fontSize: 10, cellPadding: 4, textColor: INK },
    columnStyles: { 1: { halign: "center", cellWidth: 20 }, 2: { halign: "right", cellWidth: 35 } },
    margin: { left, right: 18 },
  });

  // Total
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  doc.setDrawColor(...TEAL).setLineWidth(0.6).line(right - 70, y - 4, right, y - 4);
  doc.setTextColor(...INK).setFont("helvetica", "bold").setFontSize(12);
  doc.text("Total paid (USD)", right - 70, y + 3);
  doc.text(money(payment.amount), right, y + 3, { align: "right" });

  // Paid stamp + references
  doc.setTextColor(...TEAL).setFontSize(11).text("PAID", left, y + 3);
  doc.setTextColor(...MUTED).setFont("helvetica", "normal").setFontSize(9);
  doc.text(`Transaction ID: ${payment.transactionId}`, left, y + 18);
  if (payment.bookingId) doc.text(`Booking reference: ${payment.bookingId}`, left, y + 23);

  // Footer
  const bottom = doc.internal.pageSize.getHeight() - 14;
  doc.setDrawColor(226, 232, 240).setLineWidth(0.3).line(left, bottom - 6, right, bottom - 6);
  doc.text("Thank you for choosing FixMate. Questions? support@fixmate.com", left, bottom);
  doc.text(`Generated ${dateTime(new Date().toISOString())}`, right, bottom, { align: "right" });

  doc.save(`FixMate-Invoice-${number}.pdf`);
}