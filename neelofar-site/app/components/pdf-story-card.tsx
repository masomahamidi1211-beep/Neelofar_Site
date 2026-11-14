"use client";

import { useState } from "react";
import { FileText, Download } from "lucide-react";

export type PdfStory = {
  title: string;
  author: string;
  excerpt: string;
  /** Public path of the PDF, e.g. /docs/x.pdf */
  pdf: string;
  /** File name offered when the reader downloads the PDF. */
  downloadName: string;
  pageCount: number;
  image: string;
  imagePosition?: string;
  /** Shown instead of `image` if that one fails to load. */
  fallbackImage?: string;
  fallbackImagePosition?: string;
};

/**
 * A wide homepage feature for a story that lives as a PDF rather than an
 * article page: landscape photo, title, author and opening lines. The photo
 * and text open the PDF in a new tab; a separate button downloads it.
 */
export function PdfStoryCard({ story }: { story: PdfStory }) {
  const [useFallback, setUseFallback] = useState(false);
  const src = useFallback && story.fallbackImage ? story.fallbackImage : story.image;
  const position = useFallback ? story.fallbackImagePosition : story.imagePosition;

  return (
    <div className="flex w-full flex-col gap-6 md:flex-row md:items-stretch md:gap-8">
      {/* Photo + text: one link that opens the PDF to read. */}
      <a
        href={story.pdf}
        target="_blank"
        rel="noopener"
        className="group flex w-full flex-col gap-6 md:flex-row md:items-center md:gap-8 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8c2222]"
      >
        <div className="order-1 flex w-full flex-col md:w-7/12">
          <h2 className="mb-2 text-2xl font-bold leading-snug transition-colors group-hover:text-[#8c2222] md:text-3xl">
            {story.title}
          </h2>
          <p className="mb-4 text-sm text-[#786e65]">{story.author}</p>
          <p className="text-justify leading-relaxed text-[#4a423c] line-clamp-6">{story.excerpt}</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8c2222] underline-offset-4 group-hover:underline">
            <FileText size={16} strokeWidth={1.75} aria-hidden="true" />
            خواندن متن کامل ←
          </span>
        </div>

        <div className="order-2 w-full shrink-0 md:w-5/12">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-md shadow-[0_10px_20px_rgba(42,36,33,0.15)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              onError={() => setUseFallback(true)}
              className="h-full w-full object-cover transition duration-300 ease-out group-hover:scale-[1.03]"
              style={{ objectPosition: position ?? "50% 50%" }}
            />
          </div>
        </div>
      </a>
    </div>
  );
}

/** Footer row under the card: PDF details and a download button. */
export function PdfStoryActions({ story }: { story: PdfStory }) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#d8ccbc] pt-4 text-xs font-sans text-[#786e65]">
      <span>متن کامل · {story.pageCount.toLocaleString("fa-IR")} صفحه</span>
      <a
        href={story.pdf}
        download={story.downloadName}
        className="inline-flex items-center gap-2 rounded-md border border-[#d8ccbc] bg-white px-3 py-1.5 text-sm font-semibold text-[#2a2421] transition-colors hover:border-[#8c2222] hover:text-[#8c2222]"
      >
        <Download size={16} strokeWidth={1.75} aria-hidden="true" />
        دانلود PDF
      </a>
    </div>
  );
}
