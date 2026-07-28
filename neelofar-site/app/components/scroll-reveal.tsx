"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

export default function ScrollReveal({
  children,
  delayMs = 0,
  className = "",
}: {
  children: ReactNode;
  delayMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      // threshold: 0, not a fraction -- see the identical fix + explanation
      // in stagger-grid.tsx. A non-zero threshold requires that fraction of
      // the element's *entire* height visible at once, which silently never
      // fires once whatever this wraps is taller than ~6x a viewport.
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition duration-[450ms] ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-[18px] opacity-0"
      } ${className}`}
      style={{ transitionDelay: visible ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
