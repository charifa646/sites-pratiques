"use client";

// Adapted from Magic UI "globe" — framer-motion import + KORA palette + West
// Africa city markers (the network served by KORA TRANSIT).
import { useEffect, useRef } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

const MOVEMENT_DAMPING = 1400;

// KORA network — West African cities [lat, lon].
const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.25,
  dark: 1,
  diffuse: 1.1,
  mapSamples: 16000,
  mapBrightness: 6,
  baseColor: [0.23, 0.31, 0.43], // navy land (brighter for visible dots)
  markerColor: [0.85, 0.69, 0.3], // gold
  glowColor: [0.22, 0.17, 0.08], // warm gold glow
  markers: [
    { location: [12.37, -1.53], size: 0.11 }, // Ouagadougou
    { location: [11.18, -4.3], size: 0.08 }, // Bobo-Dioulasso
    { location: [5.36, -4.01], size: 0.09 }, // Abidjan
    { location: [12.64, -8.0], size: 0.08 }, // Bamako
    { location: [5.6, -0.19], size: 0.08 }, // Accra
    { location: [14.69, -17.44], size: 0.08 }, // Dakar
    { location: [6.13, 1.22], size: 0.07 }, // Lomé
    { location: [6.37, 2.43], size: 0.07 }, // Cotonou
  ],
};

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string;
  config?: COBEOptions;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const widthRef = useRef(0);
  const pointerInteracting = useRef<number | null>(null);

  const r = useMotionValue(0);
  const rs = useSpring(r, { mass: 1, damping: 30, stiffness: 100 });

  const updatePointer = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
  };
  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) widthRef.current = canvasRef.current.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    onResize();

    // Start oriented on West Africa.
    phiRef.current = 3.6;

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      onRender: (state) => {
        if (!pointerInteracting.current) phiRef.current += 0.0035;
        state.phi = phiRef.current + rs.get();
        state.width = widthRef.current * 2;
        state.height = widthRef.current * 2;
      },
    });

    const t = setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1";
    }, 0);
    return () => {
      clearTimeout(t);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [rs, config]);

  return (
    <div className={cn("mx-auto aspect-square w-full max-w-[600px]", className)}>
      <canvas
        className="size-full opacity-0 transition-opacity duration-700 [contain:layout_paint_size]"
        ref={canvasRef}
        onPointerDown={(e) => updatePointer(e.clientX)}
        onPointerUp={() => updatePointer(null)}
        onPointerOut={() => updatePointer(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) => e.touches[0] && updateMovement(e.touches[0].clientX)}
      />
    </div>
  );
}
