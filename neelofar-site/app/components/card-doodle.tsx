/**
 * A small hand-drawn flower mark that sits in a card's otherwise-empty
 * bottom corner -- the gap that appears under a short excerpt when CSS
 * grid stretches it to match a taller sibling in the same row. Purely
 * decorative (the whole card is already the link), hidden from the
 * accessibility tree, and hidden below sm: since single-column mobile
 * cards size to their own content and don't get stretched this way.
 */
export function CardDoodle({ className = "" }: { className?: string }) {
  return (
    <img
      src="/images/logo-03.jpg"
      alt="نشان تزئینی نیلوفر"
      aria-hidden="true"
      // -z-10 keeps it behind the card's own text: when an excerpt is long
      // enough to reach the corner after all, the (static-positioned, so
      // normally-stacked) text paints over it instead of crossing it out.
      // Needs the parent to be an explicit stacking context (relative +
      // z-0) or this would drop behind the card's own white background too.
      className={`pointer-events-none absolute -z-10 hidden h-16 w-16 object-contain opacity-60 sm:block ${className}`}
    />
  );
}
