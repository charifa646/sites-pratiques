"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { bookingForm, site } from "@/lib/data";
import { fadeUp, VIEWPORT } from "@/lib/animations";

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

export function BookingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const f = bookingForm.fields;

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
      <div className="shell grid gap-8 lg:grid-cols-3 lg:gap-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="lg:col-span-2"
        >
          <form onSubmit={onSubmit} className="glass rounded-2xl p-6 sm:p-9">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="nom" required>
                  {f.nom}
                </Label>
                <input id="nom" name="nom" type="text" required className={inputCls} />
              </div>
              <div>
                <Label htmlFor="telephone" required>
                  {f.telephone}
                </Label>
                <input id="telephone" name="telephone" type="tel" required className={inputCls} />
              </div>
              <div>
                <Label htmlFor="passagers" required>
                  {f.passagers}
                </Label>
                <input id="passagers" name="passagers" type="number" min={1} defaultValue={1} required className={inputCls} />
              </div>
              <div>
                <Label htmlFor="depart" required>
                  {f.depart}
                </Label>
                <input id="depart" name="ville_depart" type="text" required className={inputCls} />
              </div>
              <div>
                <Label htmlFor="arrivee" required>
                  {f.arrivee}
                </Label>
                <input id="arrivee" name="ville_arrivee" type="text" required className={inputCls} />
              </div>
              <div>
                <Label htmlFor="date" required>
                  {f.date}
                </Label>
                <input id="date" name="date" type="date" required className={`${inputCls} [color-scheme:dark]`} />
              </div>
              <div>
                <Label htmlFor="classe">{f.classe}</Label>
                <select id="classe" name="classe" defaultValue="Standard" className={inputCls}>
                  {bookingForm.classes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="message">{f.message}</Label>
                <textarea id="message" name="message" rows={4} className={`${inputCls} resize-none`} />
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xs text-xs leading-relaxed text-muted">
                {bookingForm.note}
              </p>
              <Button type="submit" size="lg" disabled={status === "submitting"}>
                {status === "submitting" ? "Envoi en cours…" : bookingForm.cta}
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
                    {status === "success" ? bookingForm.success : bookingForm.error}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        <motion.aside
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="flex flex-col gap-5"
        >
          <div className="glass rounded-2xl p-7">
            <h3 className="font-display text-lg font-semibold text-ink">
              {bookingForm.reassurance.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {bookingForm.reassurance.text}
            </p>
          </div>
          <div className="glass flex items-start gap-4 rounded-2xl p-7">
            <Clock className="mt-0.5 h-6 w-6 shrink-0 text-gold" />
            <div>
              <p className="text-sm font-semibold text-ink">Réponse sous 30 minutes</p>
              <p className="mt-1 text-sm text-muted">{site.horaires}</p>
            </div>
          </div>
          <div className="glass flex items-start gap-4 rounded-2xl p-7">
            <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-gold" />
            <div>
              <p className="text-sm font-semibold text-ink">Données protégées</p>
              <p className="mt-1 text-sm text-muted">
                Confidentialité garantie, aucun partage avec des tiers.
              </p>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
