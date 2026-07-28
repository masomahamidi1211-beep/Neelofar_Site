"use client";

import { ReactNode, useEffect, useState } from "react";

/**
 * A brief fade between route changes instead of an instant hard cut.
 * Mount this keyed by pathname (see SiteShell) so React remounts it --
 * and retriggers the fade -- on every navigation.
 */
export default function PageFade({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return <div className={`transition-opacity duration-200 ease-out ${visible ? "opacity-100" : "opacity-0"}`}>{children}</div>;
}
