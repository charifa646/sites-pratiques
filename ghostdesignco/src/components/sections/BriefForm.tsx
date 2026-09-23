"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { contact } from "@/lib/copy";
import { composeBrief, isEmail, mailHref, whatsappHref, type Brief } from "@/lib/brief";
import { useIntent } from "@/components/ui/Providers";
import { Arrow } from "@/components/ui/Button";
import { EXPO, cx } from "@/components/ui/motion";

const field =
  "w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3.5 text-[15px] text-bone placeholder:text-white/30 outline-none transition-[border-color,background-color,box-shadow] duration-300 focus:border-acid/70 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(182,255,59,0.12)]";

function Label({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-[13px] font-medium text-bone/85">
      {children}
    </label>
  );
}

function Select({ id, value, onChange, options }: { id: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={cx(field, "appearance-none pr-10")}>
        {options.map((o) => (
          <option key={o} value={o} className="bg-void-800 text-bone">
            {o}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fog"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="m5 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/**
 * Brief composer (no backend): the visitor fills a few fields, reviews the
 * generated message, then sends it from WhatsApp or their mail client.
 */
export function BriefForm() {
  const uid = useId();
  const { need: intentNeed } = useIntent();
  const [brief, setBrief] = useState<Brief>({
    name: "",
    email: "",
    need: contact.needs[0],
    budget: contact.budgets[2],
    idea: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Brief, string>>>({});
  const [step, setStep] = useState<"form" | "review">("form");
  const [message, setMessage] = useState("");

  // A service card picked earlier pre-selects the need.
  useEffect(() => {
    if (intentNeed) {
      setBrief((b) => ({ ...b, need: intentNeed }));
      setStep("form");
    }
  }, [intentNeed]);

  const set = (k: keyof Brief) => (v: string) => {
    setBrief((b) => ({ ...b, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!brief.name.trim()) next.name = contact.errors.name;
    if (!brief.idea.trim()) next.idea = contact.errors.idea;
    if (brief.email.trim() && !isEmail(brief.email)) next.email = contact.errors.email;
    setErrors(next);
    if (Object.keys(next).length) return;
    setMessage(composeBrief(brief));
    setStep("review");
  };

  const f = contact.fields;
  const id = (k: string) => `${uid}-${k}`;

  return (
    <div data-portal className="glass relative overflow-hidden rounded-[32px] p-6 sm:p-9">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(182,255,59,0.22),transparent_65%)]"
      />
      <AnimatePresence mode="wait" initial={false}>
        {step === "form" ? (
          <motion.form
            key="form"
            onSubmit={submit}
            noValidate
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: EXPO }}
            className="relative grid gap-5 sm:grid-cols-2"
          >
            <div>
              <Label htmlFor={id("name")}>{f.name.label}</Label>
              <input
                id={id("name")}
                className={field}
                placeholder={f.name.placeholder}
                autoComplete="name"
                value={brief.name}
                onChange={(e) => set("name")(e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? id("name-err") : undefined}
              />
              {errors.name && (
                <p id={id("name-err")} className="mt-1.5 text-[12px] text-acid">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor={id("email")}>{f.email.label}</Label>
              <input
                id={id("email")}
                type="email"
                className={field}
                placeholder={f.email.placeholder}
                autoComplete="email"
                inputMode="email"
                value={brief.email}
                onChange={(e) => set("email")(e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? id("email-err") : undefined}
              />
              {errors.email && (
                <p id={id("email-err")} className="mt-1.5 text-[12px] text-acid">
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor={id("need")}>{f.need.label}</Label>
              <Select id={id("need")} value={brief.need} onChange={set("need")} options={contact.needs} />
            </div>
            <div>
              <Label htmlFor={id("budget")}>{f.budget.label}</Label>
              <Select id={id("budget")} value={brief.budget} onChange={set("budget")} options={contact.budgets} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor={id("idea")}>{f.idea.label}</Label>
              <textarea
                id={id("idea")}
                rows={4}
                className={cx(field, "resize-y")}
                placeholder={f.idea.placeholder}
                value={brief.idea}
                onChange={(e) => set("idea")(e.target.value)}
                aria-invalid={!!errors.idea}
                aria-describedby={errors.idea ? id("idea-err") : undefined}
              />
              {errors.idea && (
                <p id={id("idea-err")} className="mt-1.5 text-[12px] text-acid">
                  {errors.idea}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="group flex w-full items-center justify-between rounded-full bg-acid px-6 py-4 text-[15px] font-medium text-acid-ink shadow-[0_12px_50px_-10px_rgba(182,255,59,0.7)] transition-shadow duration-500 hover:shadow-[0_16px_70px_-8px_rgba(182,255,59,0.95)]"
              >
                {contact.submit}
                <Arrow className="h-5 w-5 -rotate-45 transition-transform duration-500 ease-expo group-hover:rotate-0" />
              </button>
              <p className="mt-4 text-[13px] leading-relaxed text-fog">{contact.note}</p>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: EXPO }}
            className="relative"
          >
            <p className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.2em] text-acid">
              <span className="h-1.5 w-1.5 rounded-full bg-acid shadow-[0_0_12px_2px_rgba(182,255,59,0.7)]" />
              {contact.review.title}
            </p>
            <p className="mt-3 text-[15px] text-fog">{contact.review.text}</p>
            <label htmlFor={id("msg")} className="sr-only">
              {contact.review.title}
            </label>
            <textarea
              id={id("msg")}
              rows={9}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={cx(field, "mt-5 resize-y font-mono text-[13px] leading-relaxed")}
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <a
                href={whatsappHref(message)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-full bg-acid px-5 py-3.5 text-[15px] font-medium text-acid-ink shadow-[0_12px_50px_-10px_rgba(182,255,59,0.7)]"
              >
                {contact.review.whatsapp}
                <Arrow className="h-5 w-5 -rotate-45 transition-transform duration-500 ease-expo group-hover:rotate-0" />
              </a>
              <a
                href={mailHref(message, brief.need)}
                className="group flex items-center justify-between rounded-full border border-white/15 px-5 py-3.5 text-[15px] text-bone transition-colors duration-300 hover:border-acid/60 hover:text-acid"
              >
                {contact.review.email}
                <Arrow className="h-5 w-5 -rotate-45 transition-transform duration-500 ease-expo group-hover:rotate-0" />
              </a>
            </div>
            <button
              type="button"
              onClick={() => setStep("form")}
              className="mt-4 text-[13px] text-fog underline-offset-4 transition-colors hover:text-bone hover:underline"
            >
              ← {contact.review.edit}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
