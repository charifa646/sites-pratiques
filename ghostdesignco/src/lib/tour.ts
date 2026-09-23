import { cancelScroll, scrollState, scrollToY, stationSpan } from "./scroll";

/**
 * Guided tour: the ghost walks the visitor through the page on its own.
 * Each step dives to a station, sweeps through its pinned part when the
 * section tells a story while scrolling, holds while the ghost speaks, then
 * moves on. It always ends on the brief form.
 */
type Step = {
  id: string;
  line: string;
  /** seconds spent scrolling through the pinned part of the section */
  sweep?: number;
  /** where to stop in the pinned part when there is no sweep (0 → 1) */
  at?: number;
};

export const TOUR_STEPS: Step[] = [
  { id: "hero", line: "Bonjour ! Je suis votre guide. Suivez-moi, je vous fais visiter." },
  { id: "proof", line: "Plus de 15 projets réalisés en 3 ans. Tous sur mesure.", at: 0.2 },
  { id: "problem", line: "Un bon site fait comprendre, inspire confiance et donne envie. Regardez.", sweep: 6 },
  { id: "offer-1", line: "Le site vitrine : votre activité, vos services, votre univers.", at: 0.3 },
  { id: "offer-2", line: "La landing page : une seule action, aucune distraction.", at: 0.3 },
  { id: "offer-3", line: "La page de vente : elle accompagne la décision d'achat.", at: 0.3 },
  { id: "work", line: "Quelques projets récents… et une place pour le vôtre.", sweep: 6.5 },
  { id: "voices", line: "Nos clients racontent leur projet, en vidéo.", at: 0.3 },
  { id: "method", line: "Trois étapes, et votre site est en ligne en 5 à 15 jours.", sweep: 5.5 },
  { id: "pricing", line: "Pas de prix standard : une proposition faite pour votre projet.", at: 0.3 },
  { id: "faq", line: "Les questions qu'on nous pose le plus souvent.", at: 0 },
  { id: "contact", line: "À vous ! Quelques mots suffisent pour commencer." },
];

export type TourState = { active: boolean; index: number; paused: boolean; done: boolean };

let state: TourState = { active: false, index: 0, paused: false, done: false };
const listeners = new Set<(s: TourState) => void>();
let timer = 0;
let token = 0;

const emit = () => listeners.forEach((l) => l(state));
const set = (patch: Partial<TourState>) => {
  state = { ...state, ...patch };
  emit();
};
const holdFor = (line: string) => 2.2 + line.length * 0.045;
const linear = (t: number) => t;

function clear() {
  window.clearTimeout(timer);
  timer = 0;
  token += 1;
  cancelScroll();
}

function run(index: number) {
  clear();
  if (index >= TOUR_STEPS.length) return tour.stop();
  const step = TOUR_STEPS[index];
  const mine = token;
  set({ active: true, index, paused: false, done: false });

  const { top, range } = stationSpan(step.id);
  const start = top + (step.sweep ? 0 : (step.at ?? 0) * range);
  const distance = Math.abs(start - window.scrollY) / Math.max(1, scrollState.vh);
  const dive = Math.min(3.2, Math.max(1.1, 0.9 + distance * 0.45));

  const hold = () => {
    if (mine !== token) return;
    if (step.id === "contact") {
      document.querySelector<HTMLInputElement>("#contact input")?.focus({ preventScroll: true });
      set({ done: true });
      timer = window.setTimeout(() => mine === token && tour.stop(), 7000);
      return;
    }
    timer = window.setTimeout(() => mine === token && run(index + 1), holdFor(step.line) * 1000);
  };

  scrollToY(start, {
    duration: dive,
    onComplete: () => {
      if (mine !== token) return;
      if (step.sweep && range > 0) {
        scrollToY(top + range * 0.97, { duration: step.sweep, easing: linear, onComplete: hold });
      } else hold();
    },
  });
}

export const tour = {
  get: () => state,
  subscribe(fn: (s: TourState) => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  start() {
    run(0);
  },
  stop() {
    clear();
    set({ active: false, paused: false, done: false });
  },
  pause() {
    if (!state.active || state.paused) return;
    clear();
    set({ paused: true });
  },
  resume() {
    if (state.active) run(state.index);
  },
  next() {
    if (state.active) run(state.index + 1);
  },
};
