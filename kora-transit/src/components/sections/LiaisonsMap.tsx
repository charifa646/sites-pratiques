"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/animations";

const VIEWPORT = { once: true, margin: "-80px" };

interface City {
  id: string;
  x: number;
  y: number;
  label: string;
  labelDx: number;
  labelDy: number;
  labelAnchor: "start" | "middle" | "end";
  pulseDelay: number;
}

// Geographic coordinates projected onto 800×500 viewBox
// x = 80 + (lon + 20) / 25 * 640   (lon range: -20° to +5°)
// y = 60 + (18 - lat) / 14 * 380   (lat range: 4° to 18°)
const CITIES: City[] = [
  { id: "dakar",   x: 145, y: 149, label: "Dakar",          labelDx: -9,  labelDy: -13, labelAnchor: "end",    pulseDelay: 0.0 },
  { id: "bamako",  x: 388, y: 205, label: "Bamako",          labelDx:  0,  labelDy: -13, labelAnchor: "middle", pulseDelay: 0.4 },
  { id: "ouaga",   x: 552, y: 213, label: "Ouagadougou",     labelDx: 10,  labelDy:   0, labelAnchor: "start",  pulseDelay: 0.7 },
  { id: "bobo",    x: 481, y: 245, label: "Bobo-Dioulasso",  labelDx:  0,  labelDy: -13, labelAnchor: "middle", pulseDelay: 0.2 },
  { id: "abidjan", x: 490, y: 400, label: "Abidjan",         labelDx: -9,  labelDy:  15, labelAnchor: "end",    pulseDelay: 0.5 },
  { id: "accra",   x: 586, y: 395, label: "Accra",           labelDx:  8,  labelDy:  15, labelAnchor: "start",  pulseDelay: 0.9 },
  { id: "lome",    x: 620, y: 382, label: "Lomé",            labelDx:  8,  labelDy:  -9, labelAnchor: "start",  pulseDelay: 0.3 },
  { id: "cotonou", x: 654, y: 372, label: "Cotonou",         labelDx: 10,  labelDy:  -3, labelAnchor: "start",  pulseDelay: 0.6 },
];

const cityById: Record<string, City> = Object.fromEntries(CITIES.map((c) => [c.id, c]));

const ROUTES = [
  { from: "ouaga",   to: "bobo"    },
  { from: "ouaga",   to: "abidjan" },
  { from: "ouaga",   to: "bamako"  },
  { from: "ouaga",   to: "accra"   },
  { from: "bobo",    to: "abidjan" },
  { from: "bamako",  to: "dakar"   },
  { from: "abidjan", to: "lome"    },
  { from: "lome",    to: "cotonou" },
];

export function LiaisonsMap() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line/50 bg-navy-deep">
      <svg
        viewBox="0 0 800 500"
        className="w-full"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* Background gradient */}
          <radialGradient id="mapBg" cx="55%" cy="48%" r="60%">
            <stop offset="0%" stopColor="#111F35" />
            <stop offset="100%" stopColor="#070F1C" />
          </radialGradient>

          {/* City glow radial */}
          <radialGradient id="cityGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
          </radialGradient>

          {/* Traveling dot glow filter */}
          <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* City node glow */}
          <filter id="nodeGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Dot grid pattern */}
          <pattern id="mapGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="0.5" cy="0.5" r="0.9" fill="#1E2E45" opacity="0.9" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width="800" height="500" fill="url(#mapBg)" />
        <rect width="800" height="500" fill="url(#mapGrid)" opacity="0.7" />

        {/* Subtle gold atmosphere around the network center */}
        <circle cx="490" cy="300" r="220" fill="url(#cityGlow)" opacity="0.2" />

        {/* ─── Route lines ─── */}
        {ROUTES.map((route, i) => {
          const from = cityById[route.from];
          const to = cityById[route.to];
          return (
            <motion.path
              key={`route-line-${i}`}
              d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
              stroke="#C9A84C"
              strokeWidth={1.5}
              strokeOpacity={0.55}
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 1.1, ease: EASE, delay: 0.3 + i * 0.14 }}
            />
          );
        })}

        {/* ─── Traveling dots ─── */}
        {ROUTES.map((route, i) => {
          const from = cityById[route.from];
          const to = cityById[route.to];
          return (
            <motion.circle
              key={`route-dot-${i}`}
              r={3}
              fill="#E0C674"
              filter="url(#dotGlow)"
              initial={{ opacity: 0 }}
              animate={{
                cx: [from.x, to.x],
                cy: [from.y, to.y],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2.8,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 3.5,
                delay: 2.2 + i * 0.55,
                times: [0, 0.08, 0.92, 1],
              }}
            />
          );
        })}

        {/* ─── City nodes ─── */}
        {CITIES.map((city) => (
          <g key={city.id}>
            {/* Pulse ring */}
            <motion.circle
              cx={city.x}
              cy={city.y}
              r={6}
              fill="none"
              stroke="#C9A84C"
              strokeWidth={1}
              animate={{ r: [6, 18], opacity: [0.55, 0] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeOut",
                delay: city.pulseDelay,
              }}
            />
            {/* Outer glow halo */}
            <circle
              cx={city.x}
              cy={city.y}
              r={7}
              fill="#C9A84C"
              opacity={0.18}
              filter="url(#nodeGlow)"
            />
            {/* Main dot */}
            <circle cx={city.x} cy={city.y} r={4.5} fill="#C9A84C" filter="url(#nodeGlow)" />
            {/* Inner core */}
            <circle cx={city.x} cy={city.y} r={2} fill="#0B1628" />

            {/* Label */}
            <text
              x={city.x + city.labelDx}
              y={city.y + city.labelDy}
              textAnchor={city.labelAnchor}
              fill="#F5F5F0"
              fontSize={9.5}
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight={500}
              opacity={0.75}
              letterSpacing="0.04em"
            >
              {city.label}
            </text>
          </g>
        ))}

        {/* Corner label */}
        <text
          x={24}
          y={480}
          fill="#A0A8B8"
          fontSize={8.5}
          fontFamily="Inter, system-ui, sans-serif"
          opacity={0.4}
          letterSpacing="0.1em"
        >
          AFRIQUE DE L&apos;OUEST — RÉSEAU KORA TRANSIT
        </text>
      </svg>
    </div>
  );
}
