/**
 * Form validation rules shared by Sign Up, Sign In and (later) other forms.
 * The SAME password rule is enforced on the server in src/lib/auth.ts.
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const PASSWORD_RULES = [
  { id: "length", label: "At least 6 characters", test: (value: string) => value.length >= 6 },
  { id: "upper", label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { id: "lower", label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
] as const;

export const isValidPassword = (value: string) => PASSWORD_RULES.every((rule) => rule.test(value));

/** Same rule as the server: 01712345678, +880 1712-345678 ... */
export const PHONE_REGEX = /^\+?[0-9][0-9\s-]{6,18}$/;

/** Today's date as "YYYY-MM-DD" in the user's own time zone (for <input type="date" min=...>). */
export function todayLocal(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}