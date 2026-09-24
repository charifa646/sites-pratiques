"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { catalogueItems, nb, type Item } from "@/lib/catalogue";
import { listMessage, mail, wa } from "@/lib/links";
import { Bag, Check, Close, Mail, Plus, WhatsApp } from "@/components/ui/Icons";

type Ctx = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const SelectionContext = createContext<Ctx | null>(null);
const KEY = "valo-selection";

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(saved)) setIds(saved.filter((id) => typeof id === "string" && id in catalogueItems));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {}
  }, [ids, ready]);

  const toggle = useCallback((id: string) => setIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])), []);
  const remove = useCallback((id: string) => setIds((s) => s.filter((x) => x !== id)), []);
  const clear = useCallback(() => setIds([]), []);
  const value = useMemo(() => ({ ids, has: (id: string) => ids.includes(id), toggle, remove, clear, open, setOpen }), [ids, toggle, remove, clear, open]);

  return (
    <SelectionContext.Provider value={value}>
      {children}
      <SelectionDock />
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection outside SelectionProvider");
  return ctx;
}

/** « Ajouter à ma sélection »: the same id wherever it appears on the page. */
export function SelectToggle({ id, tone = "light", compact = false, className }: { id: string; tone?: "light" | "dark"; compact?: boolean; className?: string }) {
  const { has, toggle } = useSelection();
  const on = has(id);
  const item = catalogueItems[id];
  const base =
    tone === "dark"
      ? on
        ? "border-sun bg-sun text-navy"
        : "border-white/45 text-white hover:border-white hover:bg-white/10"
      : on
        ? "border-electric bg-electric text-white"
        : "border-line bg-white text-navy hover:border-electric hover:text-electric";
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={`Ajouter à ma sélection : ${item.title}`}
      onClick={() => toggle(id)}
      className={`inline-flex min-h-[44px] items-center justify-center gap-1.5 whitespace-nowrap rounded-full border text-[14px] font-bold transition duration-300 ${compact ? "w-11 px-0" : "px-3.5"} ${base} ${className ?? ""}`}
    >
      {on ? <Check className="h-[17px] w-[17px]" /> : <Plus className="h-[17px] w-[17px]" />}
      {!compact && <span>Ma sélection</span>}
    </button>
  );
}

function SelectionDock() {
  const { ids, remove, clear, open, setOpen } = useSelection();
  const items = ids.map((id) => catalogueItems[id]).filter(Boolean) as Item[];
  const count = items.length;
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    if (count) setBump((b) => b + 1);
  }, [count]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    panel.current?.focus();
    const back = trigger.current;
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      back?.focus({ preventScroll: true });
    };
  }, [open, setOpen]);

  useEffect(() => {
    if (open && count === 0) setOpen(false);
  }, [open, count, setOpen]);

  const message = listMessage(items);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-hidden={count === 0}
        tabIndex={count === 0 ? -1 : 0}
        className={`fixed bottom-[max(16px,env(safe-area-inset-bottom))] left-1/2 z-40 flex h-14 -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-full bg-navy pl-5 pr-2 text-white shadow-[0_18px_40px_-12px_rgba(4,11,82,0.6)] transition duration-500 sm:left-auto sm:right-6 sm:translate-x-0 ${
          count ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"
        }`}
      >
        <Bag className="h-5 w-5" />
        <span className="text-[15px] font-bold">Ma sélection</span>
        <span key={bump} className="pop grid h-10 min-w-10 place-items-center rounded-full bg-sun px-2 text-[15px] font-extrabold text-navy">
          {count}
        </span>
      </button>

      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`scrim fixed inset-0 z-50 bg-night/55 backdrop-blur-[2px] ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Ma sélection"
        tabIndex={-1}
        data-open={open}
        className={`sheet fixed inset-x-0 bottom-0 z-50 flex max-h-[88svh] flex-col rounded-t-[28px] bg-white shadow-2xl outline-none sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[440px] sm:rounded-none ${
          open ? "visible translate-y-0 sm:translate-x-0" : "invisible translate-y-full sm:translate-x-full sm:translate-y-0"
        }`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <p className="eyebrow text-electric">Ma sélection</p>
            <p className="mt-1 text-[22px] font-extrabold tracking-[-0.02em] text-navy">
              {count} {count > 1 ? "éléments" : "élément"}
            </p>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full border border-line text-navy hover:border-electric hover:text-electric" aria-label="Fermer">
            <Close className="h-5 w-5" />
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto px-6 py-2">
          {items.map((it) => (
            <li key={it.id} className="flex items-start justify-between gap-4 border-b border-line py-4 last:border-0">
              <div>
                <p className="eyebrow text-body/70">{it.kind}</p>
                <p className="mt-1 text-[16px] font-bold leading-snug text-navy">{it.title}</p>
                <p className="price mt-1 text-[15px]">{nb(it.price)}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(it.id)}
                className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full text-body hover:bg-mist hover:text-electric"
                aria-label={`Retirer ${it.title}`}
              >
                <Close className="h-[18px] w-[18px]" />
              </button>
            </li>
          ))}
        </ul>

        <div className="grid gap-3 border-t border-line px-6 pb-[max(20px,env(safe-area-inset-bottom))] pt-5">
          <a href={wa(message)} target="_blank" rel="noopener noreferrer" className="btn btn-sun w-full">
            <WhatsApp />
            Envoyer sur WhatsApp
          </a>
          <a href={mail("Demande d’informations", message)} className="btn btn-line w-full">
            <Mail />
            Envoyer par e-mail
          </a>
          <button type="button" onClick={clear} className="mx-auto mt-1 text-[14px] font-semibold text-body underline decoration-line underline-offset-4 hover:text-electric">
            Vider la sélection
          </button>
        </div>
      </div>
    </>
  );
}
