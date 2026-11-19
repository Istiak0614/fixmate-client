"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Loader2, UserRound, Wrench, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/password-input";
import { signUp } from "@/lib/auth-client";
import { createJwtCookie } from "@/lib/jwt";
import { dashboardPath } from "@/lib/roles";
import { EMAIL_REGEX, PASSWORD_RULES, isValidPassword } from "@/lib/validation";
import { cn } from "@/lib/utils";

type SignUpRole = "customer" | "technician";
type Errors = Partial<Record<"name" | "email" | "password", string>>;

// Admin is intentionally NOT an option (and the server turns any other value into "customer").
const ROLE_OPTIONS = [
  { value: "customer", title: "Customer", text: "I need something repaired", Icon: UserRound },
  { value: "technician", title: "Technician", text: "I offer repair services", Icon: Wrench },
] as const;

export function SignUpForm({ callbackUrl }: { callbackUrl: string | null }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [role, setRole] = useState<SignUpRole>("customer");
  const [errors, setErrors] = useState<Errors>({});
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined })); // clear the error while typing
  };

  function validate(): Errors {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Please enter your full name";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!EMAIL_REGEX.test(form.email.trim())) next.email = "Enter a valid email address";
    if (!isValidPassword(form.password)) next.password = "Password doesn't meet all the rules above";
    return next;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordTouched(true);
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return; // invalid -> never sent

    setLoading(true);
    const email = form.email.trim().toLowerCase();
    const { data, error } = await signUp.email({
      name: form.name.trim(),
      email,
      password: form.password,
      role,
    });

    if (error || !data) {
      // e.g. "User already exists. Use another email."
      toast.error(error?.message ?? "Sign up failed. Please try again.");
      setLoading(false);
      return;
    }

    // BetterAuth signed the user in (autoSignIn). Now get the Express JWT cookie.
    const jwtOk = await createJwtCookie(email);
    if (!jwtOk) {
      toast.error("Account created, but we couldn't start your session. Please sign in.");
      router.push("/sign-in");
      return;
    }

    toast.success(`Welcome to FixMate, ${data.user.name}!`);
    router.replace(callbackUrl ?? dashboardPath(data.user.role));
    router.refresh(); // re-render server components (navbar etc.) with the new session
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Role selection: native radio inputs inside cards (keyboard + screen-reader friendly) */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium">I am joining as</legend>
        <div className="grid grid-cols-2 gap-3">
          {ROLE_OPTIONS.map(({ value, title, text, Icon }) => {
            const selected = role === value;
            return (
              <label
                key={value}
                className={cn(
                  "relative flex cursor-pointer flex-col gap-2 rounded-xl border p-4 transition-colors",
                  "has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50",
                  selected ? "border-primary bg-accent" : "border-border hover:border-primary/40"
                )}
              >
                <input
                  type="radio"
                  name="role"
                  value={value}
                  checked={selected}
                  onChange={() => setRole(value)}
                  className="sr-only"
                />
                <Icon className={cn("size-5", selected ? "text-primary" : "text-muted-foreground")} />
                <span className="font-semibold">{title}</span>
                <span className="text-xs text-muted-foreground">{text}</span>
                {selected && (
                  <span className="absolute top-3 right-3 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" />
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </fieldset>

      <Field id="name" label="Full name" error={errors.name}>
        <Input id="name" autoComplete="name" placeholder="e.g. Nusrat Jahan" value={form.name} onChange={update("name")} aria-invalid={!!errors.name} className="h-11" />
      </Field>

      <Field id="email" label="Email" error={errors.email}>
        <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={update("email")} aria-invalid={!!errors.email} className="h-11" />
      </Field>

      <Field id="password" label="Password" error={errors.password}>
        <PasswordInput
          id="password"
          autoComplete="new-password"
          placeholder="Create a password"
          value={form.password}
          onChange={update("password")}
          onBlur={() => setPasswordTouched(true)}
          aria-invalid={!!errors.password}
          aria-describedby="password-rules"
        />
        {/* Live rule checklist under the field (assignment: show the errors under the field) */}
        <ul id="password-rules" className="mt-2 space-y-1 text-sm">
          {PASSWORD_RULES.map((rule) => {
            const passed = rule.test(form.password);
            const showFail = passwordTouched && !passed;
            return (
              <li
                key={rule.id}
                className={cn(
                  "flex items-center gap-2",
                  passed ? "text-green-600 dark:text-green-400" : showFail ? "text-destructive" : "text-muted-foreground"
                )}
              >
                {passed ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                {rule.label}
              </li>
            );
          })}
        </ul>
      </Field>

      <Button type="submit" size="lg" className="h-11 w-full text-base" disabled={loading}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        {loading ? "Creating your account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={callbackUrl ? `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/sign-in"}
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

/** Label + input + error message under it. */
function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}