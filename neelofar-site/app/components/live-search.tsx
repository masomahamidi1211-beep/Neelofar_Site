"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useId, useMemo, useState } from "react";
import { searchDocs, type SearchDoc } from "../lib/search";
import { toPersianDigits } from "../lib/date";

const MAX_RESULTS = 8;

// Loaded once per page visit and shared by every open of the modal.
let indexPromise: Promise<SearchDoc[]> | null = null;
function loadIndex(): Promise<SearchDoc[]> {
  if (!indexPromise) {
    indexPromise = fetch("/search-index.json")
      .then((res) => {
        if (!res.ok) throw new Error(`search index ${res.status}`);
        return res.json() as Promise<SearchDoc[]>;
      })
      .catch((error) => {
        indexPromise = null; // let the next open retry
        throw error;
      });
  }
  return indexPromise;
}

/**
 * The live search inside the header's search modal: filters every article
 * (title, author, keywords, text) on each keystroke and shows rich result
 * cards. Arrow keys move through results, Enter opens the highlighted one,
 * or the full /search page when nothing is highlighted.
 */
export function LiveSearch({ query, setQuery, onClose }: {
  query: string;
  setQuery: (value: string) => void;
  onClose: () => void;
}) {
  const router = useRouter();
  const listId = useId();
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    let cancelled = false;
    loadIndex()
      .then((index) => !cancelled && setDocs(index))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, []);

  // Typing stays instant; filtering runs right after at lower priority.
  const deferredQuery = useDeferredValue(query);
  const allHits = useMemo(() => (docs ? searchDocs(docs, deferredQuery) : []), [docs, deferredQuery]);
  const hits = allHits.slice(0, MAX_RESULTS);
  const trimmed = query.trim();
  const activeIndex = active < hits.length ? active : -1;

  const goTo = (href: string) => {
    onClose();
    router.push(href);
  };
  const fullResultsHref = `/search?q=${encodeURIComponent(trimmed)}`;

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && hits.length > 0) {
      event.preventDefault();
      setActive((activeIndex + 1) % hits.length);
    } else if (event.key === "ArrowUp" && hits.length > 0) {
      event.preventDefault();
      setActive(activeIndex <= 0 ? hits.length - 1 : activeIndex - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex >= 0) goTo(`/notes/${hits[activeIndex].doc.slug}`);
      else if (trimmed) goTo(fullResultsHref);
    }
  };

  return (
    <div className="w-full">
      <input
        autoFocus
        type="search"
        enterKeyHint="search"
        role="combobox"
        aria-label="جست‌وجو در مقاله‌ها"
        aria-expanded={hits.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(-1);
        }}
        onKeyDown={onKeyDown}
        className="w-full rounded-lg border-2 border-[#1e293b] bg-white px-5 py-4 text-center text-2xl font-medium text-black shadow-md outline-none transition focus:border-[#8c2222] focus:ring-2 focus:ring-[#8c2222]/20 sm:text-3xl"
        placeholder="عنوان، نویسنده یا کلیدواژه..."
      />

      <div className="mt-5" aria-live="polite">
        {!trimmed ? (
          <p className="text-center text-sm text-[var(--muted)]">
            با تایپ هر حرف، نتیجه‌ها همین‌جا نمایش داده می‌شوند.
          </p>
        ) : failed ? (
          <p className="text-center text-sm text-[var(--muted)]">
            جست‌وجوی سریع در دسترس نیست.{" "}
            <Link href={fullResultsHref} onClick={onClose} className="underline underline-offset-4">
              نمایش نتیجه‌ها در صفحه‌ی جست‌وجو
            </Link>
          </p>
        ) : !docs ? (
          <p className="text-center text-sm text-[var(--muted)]">در حال جست‌وجو…</p>
        ) : hits.length === 0 ? (
          <p className="rounded-lg border border-[var(--line)] bg-white px-5 py-6 text-center text-base text-[var(--muted)]">
            مقاله‌ای یافت نشد.
          </p>
        ) : (
          <>
            <ul id={listId} role="listbox" aria-label="نتیجه‌های جست‌وجو" className="divide-y divide-[var(--line)] overflow-hidden rounded-lg border border-[var(--line)] bg-white shadow-sm">
              {hits.map(({ doc, snippet }, i) => (
                <li key={doc.slug} id={`${listId}-${i}`} role="option" aria-selected={i === activeIndex}>
                  <Link
                    href={`/notes/${doc.slug}`}
                    onClick={onClose}
                    onMouseEnter={() => setActive(i)}
                    className={`group flex items-start gap-4 p-3 transition-colors sm:p-4 ${
                      i === activeIndex ? "bg-[var(--panel)]" : "hover:bg-[var(--panel)]"
                    }`}
                  >
                    <div className="h-[72px] w-24 shrink-0 overflow-hidden rounded bg-[#f3ede2] sm:h-[90px] sm:w-[120px]">
                      {doc.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={doc.image}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                          style={{ objectPosition: doc.imagePosition ?? "50% 20%" }}
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 text-right">
                      <h3 className="line-clamp-2 text-base font-bold leading-snug text-black group-hover:text-[var(--accent)] sm:text-lg">
                        {doc.title}
                      </h3>
                      {doc.author && <p className="mt-1 text-sm text-[var(--muted)]">{doc.author}</p>}
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#4a4a4a]">{snippet}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between text-sm text-[var(--muted)]">
              <span>{toPersianDigits(String(allHits.length))} نتیجه</span>
              {allHits.length > MAX_RESULTS && (
                <Link href={fullResultsHref} onClick={onClose} className="font-semibold text-[var(--accent)] underline-offset-4 hover:underline">
                  نمایش همه‌ی نتیجه‌ها ←
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
