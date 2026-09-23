import { site } from "./site";

export type Brief = {
  name: string;
  email: string;
  need: string;
  budget: string;
  idea: string;
};

/** Plain-text brief, readable in WhatsApp and in a mail client. */
export function composeBrief(b: Brief) {
  const lines = [
    "Bonjour Ghostdesignco,",
    "",
    `Je m'appelle ${b.name.trim()}${b.email.trim() ? ` (${b.email.trim()})` : ""}.`,
    "",
    `Besoin : ${b.need}`,
    `Budget envisagé : ${b.budget}`,
    "",
    "Mon projet :",
    b.idea.trim(),
  ];
  return lines.join("\n");
}

export function whatsappHref(message: string) {
  const number = site.whatsapp.replace(/\D/g, "");
  const base = number ? `https://wa.me/${number}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function mailHref(message: string, need: string) {
  const subject = `Nouveau projet : ${need}`;
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
