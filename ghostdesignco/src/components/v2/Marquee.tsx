import { offer } from "@/lib/copy";
import { GhostMark } from "@/components/ui/Logo";
import { cx } from "@/components/ui/motion";

/** The three services running by in big type, outlined and solid in turn. */
export function Marquee() {
  const words = offer.items.map((i) => i.title);
  const run = (key: string) => (
    <span key={key} className="flex shrink-0 items-center">
      {words.map((w, i) => (
        <span key={w} className="flex items-center">
          <span className={cx("px-6 font-display text-[clamp(2.6rem,7vw,6rem)] font-semibold leading-none tracking-[-0.04em] sm:px-10", i % 2 === 1 && "v2-outline")}>
            {w}
          </span>
          <GhostMark className="h-[clamp(1.6rem,3.6vw,3rem)] w-auto text-acid-deep" />
        </span>
      ))}
    </span>
  );
  return (
    <div aria-hidden className="relative overflow-hidden border-y border-line bg-white py-8 sm:py-10">
      <div className="v2-marquee flex w-max">
        {run("a")}
        {run("b")}
      </div>
    </div>
  );
}
