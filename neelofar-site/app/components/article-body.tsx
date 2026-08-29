"use client";

import { createRoot, type Root } from "react-dom/client";
import { useEffect, useRef } from "react";
import InlineFootnote from "./inline-footnote";

type Footnote = {
  id: string;
  text: string;
  title?: string;
  url?: string;
};

export default function ArticleBody({ bodyHtml, footnotes }: { bodyHtml: string; footnotes: Footnote[] }) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const roots: Root[] = [];
    const footnoteById = new Map(footnotes.map((footnote) => [footnote.id, footnote]));

    bodyRef.current?.querySelectorAll<HTMLElement>("[data-footnote-id]").forEach((placeholder) => {
      const footnote = footnoteById.get(placeholder.dataset.footnoteId ?? "");
      if (!footnote) return;

      const root = createRoot(placeholder);
      root.render(
        <InlineFootnote
          id={footnote.id}
          number={placeholder.dataset.footnoteNumber ?? footnote.id}
          title={footnote.title}
          url={footnote.url}
          description={footnote.text}
        />
      );
      roots.push(root);
    });

    return () => roots.forEach((root) => root.unmount());
  }, [bodyHtml, footnotes]);

  return (
    <div
      ref={bodyRef}
      className="article-body prose prose-neutral mt-10 max-w-none text-justify text-xl leading-9 [&_p]:mb-6 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold"
      dangerouslySetInnerHTML={{ __html: bodyHtml }}
    />
  );
}