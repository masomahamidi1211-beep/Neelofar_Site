"use client";

import { useEffect, useId, useRef, useState } from "react";

type InlineFootnoteProps = {
  id: string;
  number: string;
  title?: string;
  url?: string;
  description?: string;
  content?: string;
};

export default function InlineFootnote({
  id,
  number,
  title,
  url,
  description,
  content,
}: InlineFootnoteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, arrowLeft: 24, above: false });
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const popoverId = useId();
  const text = description ?? content ?? "";
  const visible = isOpen || isHovered;

  const updatePosition = () => {
    const trigger = wrapperRef.current?.querySelector("button");
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const cardWidth = Math.min(320, viewportWidth - 32);
    const cardHeight = 180;
    const gap = 12;
    const above = rect.top >= cardHeight + gap + 8 && rect.bottom + cardHeight + gap > viewportHeight;
    const top = above ? rect.top - gap - cardHeight : rect.bottom + gap;
    const left = Math.max(16, Math.min(rect.right - cardWidth, viewportWidth - cardWidth - 16));
    const arrowLeft = Math.max(16, Math.min(rect.left + rect.width / 2 - left, cardWidth - 16));

    setPosition({ top, left, arrowLeft, above });
  };

  useEffect(() => {
    if (!visible) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const handleViewportChange = () => updatePosition();

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleViewportChange);
    window.visualViewport?.addEventListener("resize", handleViewportChange);
    updatePosition();
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleViewportChange);
      window.visualViewport?.removeEventListener("resize", handleViewportChange);
    };
  }, [visible]);

  return (
    <span
      ref={wrapperRef}
      className="inline-footnote relative mx-0.5 inline-flex align-baseline"
      onMouseEnter={() => {
        setIsHovered(true);
        updatePosition();
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        id={`fnref-${id}`}
        className="inline-flex min-w-[1.35rem] items-center justify-center rounded bg-[var(--cream)] px-1.5 py-0.5 text-xs font-bold text-[var(--title)] underline decoration-[var(--tan)] underline-offset-2 transition-colors hover:bg-[var(--tan)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--title)]"
        aria-expanded={isOpen}
        aria-describedby={isOpen ? popoverId : undefined}
        aria-label={`پاورقی ${number}`}
        onClick={() => setIsOpen((open) => !open)}
      >
        {number}
      </button>

      <span
        id={popoverId}
        role="tooltip"
        className={`inline-footnote-popover fixed z-50 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-[var(--line)] bg-[var(--cream)] p-4 text-right text-sm leading-7 text-[var(--ink)] shadow-xl transition duration-150 ${
          position.above ? "inline-footnote-popover-above" : "inline-footnote-popover-below"
        } ${visible ? "visible translate-y-0 opacity-100" : "invisible translate-y-1 opacity-0"}`}
        style={{ top: position.top, left: position.left, "--footnote-arrow-left": `${position.arrowLeft}px` } as React.CSSProperties}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {title && (
          <span className="mb-1 block font-bold text-[var(--title)]">
            {url ? (
              <a href={url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                {title}
              </a>
            ) : (
              title
            )}
          </span>
        )}
        <span className="block text-[var(--ink)]">{text}</span>
      </span>
    </span>
  );
}