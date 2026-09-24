import { contact } from "./content";

export const wa = (text: string) => `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`;

export const mail = (subject: string, body: string) =>
  `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

/** Prices in messages read plainly, whatever spaces the page uses. */
const plain = (s: string) => s.replace(/[  ]/g, " ");

export const hello = "Bonjour VALO DIGITAL, j’aimerais parler de mon projet.";

export const enrol = (title: string, price: string) => plain(`Bonjour VALO DIGITAL, je souhaite m’inscrire à la formation « ${title} » (${price}).`);

export const ask = (title: string, price?: string) =>
  plain(`Bonjour VALO DIGITAL, je suis intéressé(e) par « ${title} »${price ? ` (${price})` : ""}. Pouvons-nous en parler ?`);
