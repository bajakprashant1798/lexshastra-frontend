"use client";
import { useMemo } from "react";

/**
 * Animated vertical lines background (hero).
 * Uses CSS keyframes defined inside this component to avoid global pollution.
 */
export default function Matrix() {
  const lines = useMemo(() => Array.from({ length: 22 }), []);
  return (
    <>
      <style>{`
        @keyframes ls-matrix {
          from { transform: translateY(-100%); }
          to   { transform: translateY(100%); }
        }
      `}</style>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[var(--bg)]"
      >
        {lines.map((_, i) => {
          const left = `${(i / (lines.length - 1)) * 100}%`;
          const delay = `${Math.random() * -20}s`;
          const duration = `${20 + Math.random() * 10}s`;
          return (
            <span
              key={i}
              className="absolute top-0 h-full w-px"
              style={{
                left,
                background:
                  "color-mix(in oklab, var(--border) 100%, transparent)",
                opacity: 0.25,
                animation: `ls-matrix ${duration} linear infinite`,
                animationDelay: delay,
              }}
            />
          );
        })}
      </div>
    </>
  );
}
