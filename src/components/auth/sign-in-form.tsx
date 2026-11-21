"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleButton, OrDivider } from "@/components/auth/google-button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/auth/form-field";
import { PasswordInput } from "@/components/auth/password-input";
import { signIn } from "@/lib/auth-client";
import { createJwtCookie } from "@/lib/jwt";
import { dashboardPath } from "@/lib/roles";
import { EMAIL_REGEX } from "@/lib/validation";

type Errors = Partial<Record<"email" | "password", string>>;

export function SignInForm({ callbackUrl }: { callbackUrl: string | null }) {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  function validate(): Errors {
    const next: Errors = {};
    if (!form.email.trim()) next.email = "Email is required";
    else if (!EMAIL_REGEX.test(form.email.trim())) next.email = "Enter a valid email address";
    if (!form.password) next.password = "Password is required";
    return next;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    const email = form.email.trim().toLowerCase();
    const { data, error } = await signIn.email({ email, password: form.password });

    if (error || !data) {
      // Wrong email/password -> BetterAuth answers "Invalid email or password"
      toast.error(error?.message ?? "Sign in failed. Please try again.");
      setLoading(false);
      return;
    }

    const jwtOk = await createJwtCookie(email);
    if (!jwtOk) {
      toast.error("Signed in, but we couldn't start your session. Please try again.");
      setLoading(false);
      return;
    }

    toast.success(`Welcome back, ${data.user.name}!`);
    // Assignment: go back to the page the user was trying to open, otherwise to their dashboard
    router.replace(callbackUrl ?? dashboardPath(data.user.role));
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <GoogleButton callbackUrl={callbackUrl} />
      <OrDivider />
      <FormField id="email" label="Email" error={errors.email}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={update("email")}
          aria-invalid={!!errors.email}
          className="h-11"
        />
      </FormField>

      <FormField id="password" label="Password" error={errors.password}>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="Your password"
          value={form.password}
          onChange={update("password")}
          aria-invalid={!!errors.password}
        />
      </FormField>

      <Button type="submit" size="lg" className="h-11 w-full text-base" disabled={loading}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        {loading ? "Signing in..." : "Sign in"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New to FixMate?{" "}
        <Link
          href={callbackUrl ? `/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/sign-up"}
          className="font-semibold text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}