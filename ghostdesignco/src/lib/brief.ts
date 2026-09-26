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
 * Sends the brief to the agency's inbox from the site itself (FormSubmit): no
 * mail app needed, and it works inside the Facebook and Instagram browsers,
 * where mail links do nothing. The very first message asks the agency to
 * confirm its address once (a link in an e-mail from FormSubmit). `trap` is
 * the hidden field only robots fill in.
 */
export async function sendBrief(b: Brief, message: string, trap = ""): Promise<boolean> {
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${site.email}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: `Nouveau projet : ${b.need} (${b.name.trim()})`,
        _replyto: b.email.trim(),
        _template: "box",
        _captcha: "false",
        _honey: trap,
        Nom: b.name.trim(),
        "E-mail": b.email.trim(),
        Besoin: b.need,
        Message: message,
      }),
    });
    const data = (await res.json().catch(() => null)) as { success?: boolean | string } | null;
    return res.ok && (data?.success === true || data?.success === "true");
  } catch {
    return false;
  }
}

/**
 * Gmail's new message window, filled in (a way out when the sending fails). On computers a mailto link often
 * finds no mail app and does nothing; phones open their mail app with mailto.
 */
export function gmailHref(message: string, need: string) {
  const subject = `Nouveau projet : ${need}`;
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
