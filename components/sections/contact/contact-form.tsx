"use client";

import { AnimatePresence, motion } from "motion/react";
import { useActionState, useState, type FocusEvent, type FormEvent } from "react";
import { CircleAlert, CircleCheck, LoaderCircle, Send } from "lucide-react";
import { sendContactMessage } from "@/app/actions/contact";
import {
  contactFields,
  readContactForm,
  validateContact,
  validateField,
  type ContactField,
  type ContactState,
  type FieldErrors,
} from "@/lib/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EASE_OUT_EXPO } from "@/components/motion/reveal";

const initialState: ContactState = { status: "idle" };

function FieldError({ id, error }: { id: string; error?: string }) {
  return (
    <AnimatePresence initial={false}>
      {error && (
        <motion.p
          id={id}
          className="flex items-center gap-1.5 text-[13px] text-destructive"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
        >
          <CircleAlert className="size-3.5 shrink-0" />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function ContactFormInner({ onReset }: { onReset: () => void }) {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [lastState, setLastState] = useState(state);

  // Server results replace client-side errors (state derived during render, no effect needed).
  if (state !== lastState) {
    setLastState(state);
    setClientErrors(state.fieldErrors ?? {});
  }
  const errors = clientErrors;

  function onBlur(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const field = e.target.name as ContactField;
    if (!contactFields.includes(field)) return;
    // Only validate on blur once the visitor has typed something.
    if (!e.target.value && !errors[field]) return;
    setClientErrors((prev) => ({ ...prev, [field]: validateField(field, e.target.value) }));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    const next = validateContact(readContactForm(new FormData(e.currentTarget)));
    setClientErrors(next);
    const first = contactFields.find((f) => next[f]);
    if (first) {
      e.preventDefault();
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
  }

  if (state.status === "success") {
    return (
      <motion.div
        role="status"
        className="flex min-h-[480px] flex-col items-center justify-center text-center"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      >
        <motion.span
          className="grid size-16 place-items-center rounded-full bg-success/15 text-success"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
        >
          <CircleCheck className="size-8" />
        </motion.span>
        <h3 className="mt-6 text-2xl font-semibold tracking-tight">Message sent</h3>
        <p className="mt-2 max-w-sm text-muted-foreground">{state.message}</p>
        <Button variant="outline" className="mt-8" onClick={onReset}>
          Send another message
        </Button>
      </motion.div>
    );
  }

  const v = state.values;
  const field = (name: ContactField) => ({
    id: `contact-${name}`,
    name,
    defaultValue: v?.[name],
    onBlur,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
  });

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input {...field("name")} autoComplete="name" placeholder="Jane Doe" required maxLength={80} />
          <FieldError id="contact-name-error" error={errors.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            {...field("email")}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="jane@company.com"
            required
          />
          <FieldError id="contact-email-error" error={errors.email} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-subject">Subject</Label>
        <Input {...field("subject")} placeholder="A new web platform for…" required maxLength={120} />
        <FieldError id="contact-subject-error" error={errors.subject} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          {...field("message")}
          placeholder="Tell me about the project, timeline and what success looks like."
          required
          maxLength={5000}
          rows={6}
        />
        <FieldError id="contact-message-error" error={errors.message} />
      </div>

      {/* Honeypot, hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col-reverse gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <div aria-live="polite" className="min-h-5 text-[13px]">
          {state.status === "error" && state.message && !pending && (
            <p className="flex items-start gap-1.5 text-destructive">
              <CircleAlert className="mt-0.5 size-3.5 shrink-0" />
              {state.message}
            </p>
          )}
        </div>
        <Button type="submit" size="lg" variant="brand" disabled={pending} className="group min-w-44">
          {pending ? (
            <>
              <LoaderCircle className="animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Send message
              <Send className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

/** Remounting with a new key resets the action state for "send another". */
export function ContactForm() {
  const [key, setKey] = useState(0);
  return <ContactFormInner key={key} onReset={() => setKey((k) => k + 1)} />;
}
