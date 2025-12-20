'use client';

import { useEffect, useState } from 'react';

export default function Matrix() {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 21 }).map((_, i) => ({
      left: `${(i / 21) * 100}%`,
      duration: `${20 + Math.random() * 10}s`,
      delay: `-${Math.random() * 20}s`,
    }));
    setLines(generated);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {lines.map((l, i) => (
        <span
          key={i}
          className="absolute top-0 h-full w-px"
          style={{
            left: l.left,
            opacity: 0.25,
            animation: `ls-matrix ${l.duration} linear infinite`,
            animationDelay: l.delay,
          }}
        />
      ))}
    </div>
  );
}