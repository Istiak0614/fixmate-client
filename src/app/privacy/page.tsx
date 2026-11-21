export const metadata = { title: "Privacy Policy — FixMate" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 space-y-4">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p>FixMate collects only what it needs to run the service: your name, email, profile photo, phone and address for repair requests, and payment records from Stripe.</p>
      <p>If you sign in with Google, we receive your name, email and profile photo. We never see your Google password.</p>
      <p>Card details are handled by Stripe and never stored on our servers.</p>
      <p>Your data is not sold or shared with third parties. To delete your account, contact support@fixmate.com.</p>
    </main>
  );
}