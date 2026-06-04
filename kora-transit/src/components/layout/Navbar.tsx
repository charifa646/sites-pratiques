"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/data";
import { EASE } from "@/lib/animations";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="font-display text-lg font-extrabold tracking-tight"
    >
      <span className="text-gold">KORA</span>{" "}
      <span className="text-ink">TRANSIT</span>
    </Link>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-line/60 bg-navy/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="shell flex h-[72px] items-center justify-between">
        <Logo />

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "relative py-1 text-sm font-medium transition-colors hover:text-ink",
                    active ? "text-ink" : "text-muted",
                  )}
                >
                  {l.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-1 left-0 h-px w-full bg-gold"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:block">
          <ButtonLink href="/reservation">Réserver</ButtonLink>
        </div>

        <button
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          className="grid h-11 w-11 place-items-center rounded-full border border-line/70 text-ink transition-colors hover:border-gold/60 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-navy-deep/95 backdrop-blur-xl" />
            <motion.div
              className="relative flex h-full flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: EASE, duration: 0.42 }}
            >
              <div className="shell flex h-[72px] items-center justify-between">
                <Logo onClick={() => setOpen(false)} />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Fermer le menu"
                  className="grid h-11 w-11 place-items-center rounded-full border border-line/70 text-ink transition-colors hover:border-gold/60"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <motion.ul
                className="shell mt-6 flex flex-1 flex-col gap-1"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
              >
                {navLinks.map((l) => {
                  const active = pathname === l.href;
                  return (
                    <motion.li
                      key={l.href}
                      variants={{
                        hidden: { opacity: 0, x: 28 },
                        visible: { opacity: 1, x: 0 },
                      }}
                    >
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "block border-b border-line/50 py-4 font-display text-2xl font-semibold transition-colors",
                          active ? "text-gold" : "text-ink hover:text-gold",
                        )}
                      >
                        {l.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </motion.ul>

              <div className="shell pb-10">
                <ButtonLink
                  href="/reservation"
                  size="lg"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Réserver
                </ButtonLink>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
