"use server";

import { headers } from "next/headers";
import { site } from "@/content/site";
import { readContactForm, validateContact, type ContactState } from "@/lib/contact";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Sends a contact message through Resend's REST API.
 *
 * Required env: RESEND_API_KEY, CONTACT_TO_EMAIL
 * Optional env: CONTACT_FROM_EMAIL (a sender on a domain verified in Resend)
 *
 * Without configuration the action reports that honestly instead of
 * pretending the message was delivered.
 */
export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = readContactForm(formData);

  // Honeypot: real visitors never see or fill this field.
  if (typeof formData.get("website") === "string" && formData.get("website") !== "") {
    return { status: "success", message: "Thanks! Your message is on its way." };
  }

  const fieldErrors = validateContact(values);
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors, values };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (!rateLimit(`contact:${ip}`).ok) {
    return {
      status: "error",
      message: "You've sent several messages in a short time. Please try again in a few minutes.",
      values,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.warn("[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set; message not sent.");
    return {
      status: "error",
      message: `The contact form isn't connected to an email service yet. Please email me directly at ${site.email}.`,
      values,
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
        to: [to],
        reply_to: values.email,
        subject: `[Portfolio] ${values.subject}`,
        text: `From: ${values.name} <${values.email}>\n\n${values.message}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      console.error("[contact] Resend responded with", res.status, await res.text().catch(() => ""));
      throw new Error(`Resend error ${res.status}`);
    }
  } catch (error) {
    console.error("[contact] Failed to send message:", error);
    return {
      status: "error",
      message: `Something went wrong while sending. Please try again, or email me at ${site.email}.`,
      values,
    };
  }

  return { status: "success", message: "Thanks! Your message has been sent. I'll get back to you soon." };
}
