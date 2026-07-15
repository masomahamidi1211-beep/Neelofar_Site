import { ReactNode } from "react";

export function HairlineGrid({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`hairline-grid ${className}`}>{children}</div>;
}

export function HairlineCell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`hairline-cell ${className}`}>{children}</div>;
}

/**
 * For a CSS grid with a fixed column count, an item total that doesn't
 * divide evenly leaves a blank trailing cell in the last row. Rather than
 * switching to flex-wrap (which breaks equal-height rows -- flex only
 * stretches items within the same line, not across the whole grid), widen
 * just the last item to close the gap: e.g. 5 items in a 3-column grid
 * leaves row 2 with [item4, item5] and one empty slot, so item5 spans the
 * remaining 2 columns instead of 1, filling the row exactly.
 */
export function gridSpanFor(index: number, total: number, cols: number): number {
  const remainder = total % cols;
  if (remainder !== 0 && index === total - 1) {
    return cols - remainder + 1;
  }
  return 1;
}
