import { contact, type Item } from "./catalogue";

export const wa = (text: string) => `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`;

export const mail = (subject: string, body: string) =>
  `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const hello = "Bonjour VALO DIGITAL, je souhaite en savoir plus sur vos formations et solutions de croissance.";

export const askAbout = (item: Pick<Item, "title" | "price">) =>
  `Bonjour VALO DIGITAL, je souhaite des informations sur « ${item.title} » (${item.price}).`;

export const listMessage = (items: Pick<Item, "title" | "price">[]) =>
  ["Bonjour VALO DIGITAL, je souhaite des informations sur :", ...items.map((i) => `- ${i.title} (${i.price})`), "", "Merci."].join("\n");
