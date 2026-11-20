"use client";

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type ChartDatum = { label: string; value: number };

/**
 * Simple single-series bar chart (one hue: the theme's teal).
 * The bar labels on the axis carry identity, so colour is never the only cue.
 * A visually hidden table gives screen readers the same numbers.
 */
export function BarChartCard({ title, data, currency = false }: { title: string; data: ChartDatum[]; currency?: boolean }) {
  const format = (v: number) => (currency ? `$${v.toLocaleString()}` : v.toLocaleString());

  return (
    <section className="glass rounded-2xl p-6" aria-labelledby={`${title}-heading`}>
      <h2 id={`${title}-heading`} className="text-lg font-semibold">
        {title}
      </h2>
      <div className="mt-6 h-64" aria-hidden>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} interval={0} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickFormatter={format} width={48} />
            <Tooltip
              cursor={{ fill: "var(--accent)" }}
              formatter={(v) => [format(Number(v)), currency ? "Amount" : "Count"]}
              contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--popover-foreground)" }}
              labelStyle={{ color: "var(--popover-foreground)", fontWeight: 600 }}
            />
            <Bar dataKey="value" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={44}>
              <LabelList dataKey="value" position="top" formatter={(v: unknown) => (Number(v) > 0 ? format(Number(v)) : "")} fill="var(--muted-foreground)" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>{title}</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <th scope="row">{d.label}</th>
              <td>{format(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}