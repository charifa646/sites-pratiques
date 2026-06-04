import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Ambient image with a navy+gold duotone treatment for visual cohesion
 * (agency-grade consistency). Grayscale base + navy shadows + warm gold highlights.
 */
export function Duotone({
  src,
  alt,
  className,
  imgClassName,
  position,
  sizes = "100vw",
  priority,
  intensity = "medium",
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  position?: string;
  sizes?: string;
  priority?: boolean;
  intensity?: "soft" | "medium" | "strong";
}) {
  const navy =
    intensity === "strong"
      ? "opacity-[0.8]"
      : intensity === "soft"
        ? "opacity-[0.45]"
        : "opacity-[0.62]";

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover grayscale", imgClassName)}
        style={position ? { objectPosition: position } : undefined}
      />
      {/* Navy shadows */}
      <div className={cn("absolute inset-0 bg-navy-deep mix-blend-multiply", navy)} />
      {/* Warm gold highlights */}
      <div className="absolute inset-0 bg-gold/25 mix-blend-overlay" />
      {/* Cool base unify */}
      <div className="absolute inset-0 bg-navy/30 mix-blend-color" />
    </div>
  );
}
