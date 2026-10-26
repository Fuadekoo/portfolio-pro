/** Contact form schema shared by the client (instant feedback) and the server (authoritative). */

export const contactFields = ["name", "email", "subject", "message"] as const;
export type ContactField = (typeof contactFields)[number];
export type ContactValues = Record<ContactField, string>;
export type FieldErrors = Partial<Record<ContactField, string>>;

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: FieldErrors;
  /** Echoed back so a failed submission doesn't wipe what the visitor typed. */
  values?: ContactValues;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const limits = {
  name: { min: 2, max: 80 },
  subject: { min: 3, max: 120 },
  message: { min: 20, max: 5000 },
} as const;

export function validateField(field: ContactField, raw: string): string | undefined {
  const value = raw.trim();
  switch (field) {
    case "email":
      if (!value) return "Please enter your email address.";
      if (value.length > 254 || !EMAIL_RE.test(value)) return "That email address doesn't look right.";
      return;
    default: {
      const { min, max } = limits[field];
      const label = field === "name" ? "Your name" : field === "subject" ? "The subject" : "Your message";
      if (!value) return `${label} is required.`;
      if (value.length < min) return `${label} should be at least ${min} characters.`;
      if (value.length > max) return `${label} should be under ${max} characters.`;
    }
  }
}

export function validateContact(values: ContactValues): FieldErrors {
  const errors: FieldErrors = {};
  for (const field of contactFields) {
    const error = validateField(field, values[field]);
    if (error) errors[field] = error;
  }
  return errors;
}

export function readContactForm(formData: FormData): ContactValues {
  const get = (k: string) => {
    const v = formData.get(k);
    return typeof v === "string" ? v.trim() : "";
  };
  return { name: get("name"), email: get("email"), subject: get("subject"), message: get("message") };
}
