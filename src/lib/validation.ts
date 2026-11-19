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