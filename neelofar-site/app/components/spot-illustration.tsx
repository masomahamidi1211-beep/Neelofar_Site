/**
 * Quiet decorative pauses dropped into gaps in the mosaic grid -- small
 * black-and-white line drawings, never a photo. "lotus" (نیلوفر) is the
 * site's own signature mark; moon/bird are the other two variants called
 * for by the design spec, for occasional variety.
 */
const PATHS: Record<"lotus" | "moon" | "bird", React.ReactNode> = {
  lotus: (
    <>
      <path d="M32 54c0-12 6-20 6-20s6 8 6 20" />
      <path d="M20 46c4-10 12-14 18-12" />
      <path d="M44 46c-4-10-12-14-18-12" />
      <path d="M14 40c6-8 16-10 24-6" />
      <path d="M50 40c-6-8-16-10-24-6" />
      <path d="M38 54h-4" />
    </>
  ),
  moon: <path d="M40 14a20 20 0 1 0 10 36 16 16 0 0 1-10-36z" />,
  bird: (
    <>
      <path d="M12 38c8-6 16-6 22 0 6-10 16-12 24-8-8 2-12 8-14 14-10 4-22 2-32-6z" />
      <path d="M34 38l4 12" />
    </>
  ),
};

export function SpotIllustration({
  kind = "lotus",
  className = "",
}: {
  kind?: "lotus" | "moon" | "bird";
  className?: string;
}) {
  return (
    <div className={`article-box flex items-center justify-center bg-[var(--gutter)] ${className}`}>
      <svg
        aria-hidden="true"
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        stroke="var(--muted)"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {PATHS[kind]}
      </svg>
    </div>
  );
}
