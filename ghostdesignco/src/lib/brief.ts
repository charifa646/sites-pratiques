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
    ...(b.budget.trim() ? [`Budget envisagé : ${b.budget.trim()}`] : []),
    "",
    "Mon projet :",
    b.idea.trim(),
  ];
  return lines.join("\n");
}

/**
 * Where the WhatsApp button goes. With a number the brief travels in the
 * link; with a Business link (no text parameter) it has to be pasted.
 */
export function whatsappTarget(message: string): { href: string; prefilled: boolean } {
  const number = site.whatsapp.replace(/\D/g, "");
  if (number) return { href: `https://wa.me/${number}?text=${encodeURIComponent(message)}`, prefilled: true };
  if (site.whatsappLink) return { href: site.whatsappLink, prefilled: false };
  return { href: `https://wa.me/?text=${encodeURIComponent(message)}`, prefilled: true };
}

/** Direct chat, without a brief (contact shortcuts, footer). */
export const whatsappDirect = () => (site.whatsapp ? `https://wa.me/${site.whatsapp.replace(/\D/g, "")}` : site.whatsappLink);

export function mailHref(message: string, need: string) {
  const subject = `Nouveau projet : ${need}`;
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

/**
 * Gmail's new message window, filled in. On computers a mailto link often
 * finds no mail app and does nothing; phones open their mail app with mailto.
 */
export function gmailHref(message: string, need: string) {
  const subject = `Nouveau projet : ${need}`;
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
