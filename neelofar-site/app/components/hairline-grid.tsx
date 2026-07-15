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

export function HairlineFlex({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`hairline-flex ${className}`}>{children}</div>;
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
