/**
 * The 48px circular "continue reading" mark that sits at a text card's
 * bottom corner. Purely decorative -- the whole card is already the link,
 * so this never renders its own <a>/<button> and is hidden from the
 * accessibility tree to avoid a redundant stop.
 */
export function ReadMoreCircle({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`read-more-circle flex h-12 w-12 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--bg)] shadow-[0_1px_4px_rgb(30_30_28_/_8%)] ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 6l-6 6 6 6" />
      </svg>
    </span>
  );
}
