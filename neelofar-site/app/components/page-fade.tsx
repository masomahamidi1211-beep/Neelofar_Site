"use client";

import { ReactNode, useEffect, useState } from "react";

export default function PageFade({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className={`transition duration-500 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      {children}
    </div>
  );
}
