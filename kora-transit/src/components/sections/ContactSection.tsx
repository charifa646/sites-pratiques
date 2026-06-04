"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { contactForm, site } from "@/lib/data";
import { slideInLeft, slideInRight, VIEWPORT } from "@/lib/animations";

const inputCls =
  "w-full rounded-xl border border-line bg-navy-light/40 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/50 focus:border-gold/70 focus:bg-navy-light/70";
const labelCls =
  "mb-2 block text-xs font-medium uppercase tracking-wider text-muted";

type Status = "idle" | "submitting" | "success" | "error";

function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className={labelCls}>
      {children}
      {required && <span className="text-gold"> *</span>}
    </label>
  );
}

const coordinates = [
  { icon: MapPin, label: "Siège social", value: site.siege },
  { icon: MapPin, label: "Agence Bobo-Dioulasso", value: site.agence },
  { icon: Phone, label: "Téléphone", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
  { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: Clock, label: "Horaires", value: site.horaires },
];

export function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");
  const f = contactForm.fields;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    try {
      const res = await fetch(site.formspreeEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="section">
      <div className="shell grid gap-10 lg:grid-cols-5 lg:gap-16">
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="lg:col-span-2"
        >
          <h2 className="text-2xl font-bold">Nos coordonnées</h2>
          <ul className="mt-8 flex flex-col gap-6">
            {coordinates.map((c) => (
              <li key={c.label} className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                  <c.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted">
                    {c.label}
                  </p>
                  {c.href ? (
                    <a href={c.href} className="mt-1 block text-ink transition-colors hover:text-gold">
                      {c.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-ink">{c.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          variants={slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="lg:col-span-3"
        >
          <form onSubmit={onSubmit} className="glass rounded-2xl p-6 sm:p-9">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="c-nom" required>
                  {f.nom}
                </Label>
                <input id="c-nom" name="nom" type="text" required className={inputCls} />
              </div>
              <div>
                <Label htmlFor="c-email" required>
                  {f.email}
                </Label>
                <input id="c-email" name="email" type="email" required className={inputCls} />
              </div>
              <div>
                <Label htmlFor="c-tel">{f.telephone}</Label>
                <input id="c-tel" name="telephone" type="tel" className={inputCls} />
              </div>
              <div>
                <Label htmlFor="c-sujet" required>
                  {f.sujet}
                </Label>
                <input id="c-sujet" name="sujet" type="text" required className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="c-message" required>
                  {f.message}
                </Label>
                <textarea id="c-message" name="message" rows={5} required className={`${inputCls} resize-none`} />
              </div>
            </div>

            <div className="mt-7">
              <Button type="submit" size="lg" disabled={status === "submitting"}>
                {status === "submitting" ? "Envoi en cours…" : contactForm.cta}
              </Button>
            </div>

            <AnimatePresence>
              {(status === "success" || status === "error") && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-6 flex items-start gap-3 rounded-xl border p-4 text-sm ${
                    status === "success"
                      ? "border-gold/40 bg-gold/10 text-gold"
                      : "border-red-400/30 bg-red-500/10 text-red-300"
                  }`}
                >
                  {status === "success" ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  )}
                  <span>
                    {status === "success" ? contactForm.success : contactForm.error}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
