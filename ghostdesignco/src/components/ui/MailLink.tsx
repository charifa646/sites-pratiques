"use client";

import { useEffect, useState, type ReactNode } from "react";
import { site } from "@/lib/site";

/**
 * Writes to the agency: Gmail's new message window on computers, where a
 * mailto link often finds no mail app and does nothing; the mail app on
 * phones and tablets.
 */
export function MailLink({ className, children }: { className?: string; children: ReactNode }) {
  const [touch, setTouch] = useState(false);
  useEffect(() => setTouch(window.matchMedia("(hover: none) and (pointer: coarse)").matches), []);
  if (touch) {
    return (
      <a href={`mailto:${site.email}`} className={className}>
        {children}
      </a>
    );
  }
  return (
    <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.email)}`} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}
