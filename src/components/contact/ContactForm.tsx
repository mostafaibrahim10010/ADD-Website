"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { services } from "@/data/content";
import { site } from "@/data/site";
import { ArrowCircle } from "@/components/ui/ArrowCircle";

const field =
  "peer w-full border-0 border-b border-ink/30 bg-transparent px-0 pt-6 pb-2.5 text-[17px] text-ink outline-none transition-colors duration-300 placeholder:text-transparent focus:border-brand";
const label =
  "pointer-events-none absolute top-6 left-0 origin-left text-[15px] text-muted transition-all duration-300 " +
  "peer-focus:top-0 peer-focus:text-xs peer-focus:text-brand peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs";

/**
 * Project enquiry form. There is no backend yet, so submitting composes an
 * email to the studio in the visitor's mail app with everything pre-filled.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const serviceRef = useRef<HTMLSelectElement>(null);

  // "Discuss Your Project" buttons link here with ?service=<slug>; pre-select it.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("service");
    const match = services.find((s) => s.slug === slug);
    if (match && serviceRef.current) serviceRef.current.value = match.title;
  }, []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const subject = `Project enquiry — ${get("service") || "General"} — ${get("name")}`;
    const lines = [`Name: ${get("name")}`, `Email: ${get("email")}`];
    if (get("phone")) lines.push(`Phone: ${get("phone")}`);
    lines.push(`Service: ${get("service") || "General"}`, "", get("message"));
    const body = lines.join("\n");
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
      <div className="relative">
        <input id="name" name="name" required autoComplete="name" placeholder="Full name" className={field} />
        <label htmlFor="name" className={label}>Full name *</label>
      </div>
      <div className="relative">
        <input id="email" name="email" type="email" required autoComplete="email" placeholder="Email" className={field} />
        <label htmlFor="email" className={label}>Email *</label>
      </div>
      <div className="relative">
        <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="Phone" className={field} />
        <label htmlFor="phone" className={label}>Phone</label>
      </div>
      <div className="relative">
        <select
          ref={serviceRef}
          id="service"
          name="service"
          defaultValue=""
          className={`${field} cursor-pointer appearance-none`}
          aria-label="Service"
        >
          <option value="">Service of interest</option>
          {services.map((s) => (
            <option key={s.slug} value={s.title}>
              {s.title}
            </option>
          ))}
        </select>
        <svg viewBox="0 0 12 8" aria-hidden className="pointer-events-none absolute right-1 bottom-4 w-3 fill-none stroke-ink">
          <path d="M1 1.5 6 6.5l5-5" strokeWidth="1.4" />
        </svg>
      </div>
      <div className="relative sm:col-span-2">
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us about your project"
          className={`${field} resize-none`}
        />
        <label htmlFor="message" className={label}>Tell us about your project *</label>
      </div>

      <div className="flex flex-col items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted" role="status">
          {sent
            ? "Your email app should now be open with the message ready to send."
            : `Sends to ${site.email} through your email app.`}
        </p>
        <button
          type="submit"
          className="group relative inline-flex h-[52px] shrink-0 items-center gap-3 overflow-hidden rounded-[28px] bg-ink pr-3 pl-6 text-[15px] whitespace-nowrap text-white"
        >
          <span
            aria-hidden
            className="absolute inset-0 translate-y-full bg-brand transition-transform duration-500 ease-out-expo group-hover:translate-y-0"
          />
          <span className="relative">Send enquiry</span>
          <span className="relative flex size-8 items-center justify-center">
            <ArrowCircle tone="light" />
          </span>
        </button>
      </div>
    </form>
  );
}
