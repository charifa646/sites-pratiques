type P = { className?: string };

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const ArrowRight = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...line}>
    <path d="M4.5 12h14M13 6.5l5.5 5.5-5.5 5.5" />
  </svg>
);

export const ArrowDown = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...line}>
    <path d="M12 4.5v14M6.5 13l5.5 5.5 5.5-5.5" />
  </svg>
);

export const WhatsApp = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...line} strokeWidth={1.7}>
    <path d="M3.6 20.4l1.2-4.1a8.4 8.4 0 1 1 3.1 3z" />
    <path
      d="M9.1 8.6c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .4-.1.6l-.5.6c-.1.2-.1.4 0 .5.6 1 1.4 1.8 2.4 2.4.2.1.4.1.5 0l.6-.5c.2-.1.4-.2.6-.1l1.7.7c.3.1.4.3.4.5v.5c0 .3-.1.6-.6.8-.6.3-1.3.4-2 .2-2.6-.7-4.6-2.7-5.3-5.3-.2-.7-.1-1.4.2-2z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

export const Phone = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...line}>
    <path d="M6.6 3.8h2.6l1.4 4.1-2 1.4a11.5 11.5 0 0 0 6.1 6.1l1.4-2 4.1 1.4v2.6c0 1.1-.9 2-2 2A15.9 15.9 0 0 1 4.6 5.8c0-1.1.9-2 2-2z" />
  </svg>
);

export const Mail = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...line}>
    <rect x="3.2" y="5.5" width="17.6" height="13" rx="2.4" />
    <path d="M4 7.2l8 5.8 8-5.8" />
  </svg>
);

export const Pin = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...line}>
    <path d="M12 21s-6.8-6.1-6.8-11.2a6.8 6.8 0 0 1 13.6 0C18.8 14.9 12 21 12 21z" />
    <circle cx="12" cy="9.8" r="2.5" />
  </svg>
);

export const Check = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...line} strokeWidth={2.4}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const Plus = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...line} strokeWidth={2.2}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Close = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...line} strokeWidth={2.1}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const Menu = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...line} strokeWidth={2.1}>
    <path d="M4 7.5h16M4 16.5h16" />
  </svg>
);

export const Bag = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...line}>
    <path d="M5.5 8h13l-1 12.2H6.5z" />
    <path d="M9 10.5V7a3 3 0 0 1 6 0v3.5" />
  </svg>
);
