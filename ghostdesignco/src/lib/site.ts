/**
 * Contact channels and profiles.
 * - whatsapp: number in international format, digits only (e.g. "33612345678").
 *   When set, the brief opens in WhatsApp already written.
 * - whatsappLink: the WhatsApp Business link. Used when no number is set: the
 *   brief is copied to the clipboard and the conversation opens.
 * - email: address that receives the briefs (TODO(client): to fill in). While
 *   empty, the mail client opens with an empty "To" field.
 */
export const site = {
  whatsapp: "",
  whatsappLink: "https://wa.me/message/ZB4H33YT3YJRJ1",
  email: "",
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ouedraogo-charifa-5b26632a1" },
    { label: "Facebook", href: "https://www.facebook.com/share/1BiLCFtdhz/" },
  ],
};
