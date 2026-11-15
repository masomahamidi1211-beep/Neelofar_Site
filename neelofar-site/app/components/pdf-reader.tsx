"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";

/**
 * Shows a PDF inside the page itself: every page is drawn onto a <canvas>
 * with PDF.js (pdfjs-dist), so it looks the same on every browser and
 * phone -- unlike an <iframe>, which Android Chrome can't show inline and
 * iOS shows as a single page, and unlike <object>/<embed>, which the site's
 * CSP (object-src 'none') blocks. The PDF file itself is untouched.
 *
 * Pages are drawn only when they scroll near the viewport, so a long PDF
 * doesn't render all at once. The worker script is served from
 * /pdfjs/pdf.worker.min.mjs (copied from node_modules/pdfjs-dist/build).
 */
export default function PdfReader({ src, title }: { src: string; title: string }) {
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [ratio, setRatio] = useState(595 / 411); // height / width of page 1
  const [error, setError] = useState(false);
  const [current, setCurrent] = useState(1);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    let loaded: PDFDocumentProxy | null = null;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
        // disableFontFace: draw glyphs straight from the PDF's embedded fonts.
        // Without it the browser rejects these Persian font subsets and
        // PDF.js falls back to a system font letter by letter, so the text
        // comes out with unjoined (isolated) letter forms.
        loaded = await pdfjs.getDocument({
          url: src,
          isEvalSupported: false,
          disableFontFace: true,
          useSystemFonts: false,
        }).promise;
        const first = await loaded.getPage(1);
        const vp = first.getViewport({ scale: 1 });
        if (cancelled) return;
        setRatio(vp.height / vp.width);
        setDoc(loaded);
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
      loaded?.destroy();
    };
  }, [src]);

  if (error) {
    return (
      <p className="rounded-lg border border-[#e2d8c9] bg-[#f3ede2] px-5 py-6 text-center text-base text-[#4a4a4a]">
        نمایش این فایل ممکن نشد. لطفاً صفحه را دوباره بارگذاری کنید.
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-[#e2d8c9] bg-[#f3ede2] shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-[#d8ccbc] px-4 py-3 text-sm text-[#4a4a4a]">
        <span className="font-bold text-[#2a2421]">{title}</span>
        <span aria-live="polite" className="shrink-0 tabular-nums">
          {doc ? `صفحه‌ی ${toFa(current)} از ${toFa(doc.numPages)}` : "در حال بارگذاری…"}
        </span>
      </div>
      <div
        ref={scrollerRef}
        role="document"
        aria-label={title}
        tabIndex={0}
        className="max-h-[85vh] overflow-y-auto overscroll-contain p-3 sm:p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <div className="mx-auto flex max-w-[720px] flex-col gap-4 sm:gap-6">
          {doc
            ? Array.from({ length: doc.numPages }, (_, i) => (
                <PdfPage
                  key={i}
                  doc={doc}
                  pageNumber={i + 1}
                  ratio={ratio}
                  scroller={scrollerRef}
                  onVisible={setCurrent}
                />
              ))
            : <div className="w-full animate-pulse bg-white/70 shadow" style={{ aspectRatio: `1 / ${ratio}` }} />}
        </div>
      </div>
    </div>
  );
}

function PdfPage({
  doc,
  pageNumber,
  ratio,
  scroller,
  onVisible,
}: {
  doc: PDFDocumentProxy;
  pageNumber: number;
  ratio: number;
  scroller: React.RefObject<HTMLDivElement | null>;
  onVisible: (n: number) => void;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [near, setNear] = useState(false);
  const [drawn, setDrawn] = useState(false);

  // Start drawing once the page comes within ~1.5 screens of view, and
  // report which page is in the middle of the reader for the counter.
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const lazy = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          lazy.disconnect();
        }
      },
      { root: scroller.current, rootMargin: "150% 0px" }
    );
    const current = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) onVisible(pageNumber);
      },
      { root: scroller.current, rootMargin: "-50% 0px -50% 0px" }
    );
    lazy.observe(box);
    current.observe(box);
    return () => {
      lazy.disconnect();
      current.disconnect();
    };
  }, [pageNumber, scroller, onVisible]);

  useEffect(() => {
    if (!near) return;
    let task: { cancel: () => void; promise: Promise<void> } | null = null;
    let cancelled = false;
    (async () => {
      const page = await doc.getPage(pageNumber);
      const canvas = canvasRef.current;
      const box = boxRef.current;
      if (cancelled || !canvas || !box) return;
      // Draw at the displayed width x screen density (capped), so text
      // stays sharp on phones without huge canvases.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const base = page.getViewport({ scale: 1 });
      const scale = (box.clientWidth / base.width) * dpr;
      const vp = page.getViewport({ scale });
      canvas.width = Math.floor(vp.width);
      canvas.height = Math.floor(vp.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      task = page.render({ canvasContext: ctx, viewport: vp });
      try {
        await task.promise;
        if (!cancelled) setDrawn(true);
      } catch {
        /* cancelled on unmount */
      }
    })();
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [near, doc, pageNumber]);

  return (
    <div
      ref={boxRef}
      className={`relative w-full bg-white shadow ${drawn ? "" : "animate-pulse"}`}
      style={{ aspectRatio: `1 / ${ratio}` }}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        role="img"
        aria-label={`صفحه‌ی ${toFa(pageNumber)}`}
      />
    </div>
  );
}

function toFa(n: number) {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}
