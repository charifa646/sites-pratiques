"use client";

// Adapted from Magic UI "dotted-map" — KORA palette (navy dots, gold markers).
import * as React from "react";
import { createMap } from "svg-dotted-map";
import { cn } from "@/lib/utils";

export interface Marker {
  lat: number;
  lng: number;
  size?: number;
  pulse?: boolean;
}

interface Region {
  lat: { min: number; max: number };
  lng: { min: number; max: number };
}

export interface DottedMapProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  mapSamples?: number;
  markers?: Marker[];
  dotColor?: string;
  markerColor?: string;
  dotRadius?: number;
  pulse?: boolean;
  region?: Region;
}

export function DottedMap({
  width = 150,
  height = 75,
  mapSamples = 3000,
  markers = [],
  dotColor = "#37506F",
  markerColor = "#C9A84C",
  dotRadius = 0.2,
  pulse = true,
  region,
  className,
  style,
  ...svgProps
}: DottedMapProps) {
  const { points, processedMarkers } = React.useMemo(() => {
    const { points, addMarkers } = createMap({
      width,
      height,
      mapSamples,
      ...(region ? { region } : {}),
    });
    return {
      points,
      processedMarkers: addMarkers(markers) as Array<{
        x: number;
        y: number;
        size?: number;
        pulse?: boolean;
      }>,
    };
  }, [width, height, mapSamples, region, markers]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn(className)}
      style={{ width: "100%", height: "100%", ...style }}
      {...svgProps}
    >
      {points.map((point, index) => (
        <circle
          cx={point.x}
          cy={point.y}
          r={dotRadius}
          fill={dotColor}
          key={`${point.x}-${point.y}-${index}`}
        />
      ))}

      {processedMarkers.map((marker, index) => {
        const r = marker.size ?? dotRadius;
        const shouldPulse = pulse ? marker.pulse !== false : marker.pulse === true;
        const pulseTo = r * 3;
        return (
          <g key={`m-${index}`}>
            <circle cx={marker.x} cy={marker.y} r={r} fill={markerColor} />
            {shouldPulse && (
              <circle
                cx={marker.x}
                cy={marker.y}
                r={r}
                fill="none"
                stroke={markerColor}
                strokeWidth={0.35}
              >
                <animate attributeName="r" values={`${r};${pulseTo}`} dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0" dur="1.8s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        );
      })}
    </svg>
  );
}
