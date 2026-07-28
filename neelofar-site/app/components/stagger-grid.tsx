"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

/**
 * Wraps a card grid/row so its direct children fade + slide up with an
 * incremental stagger as the whole block enters the viewport -- one
 * IntersectionObserver on the container (not one per card), the actual
 * per-child delay is pure CSS (see .stagger-grid in globals.css). Pass
 * through whatever grid/layout classes the wrapped block already used
 * (grid-cols-*, divide-y, etc.) via className; this only adds the reveal
 * behavior, never touches layout.
 */
export default function StaggerGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`stagger-grid ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}
