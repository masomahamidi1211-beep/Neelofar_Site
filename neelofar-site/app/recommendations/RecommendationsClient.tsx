"use client";

import { useMemo, useState } from "react";
import { toPersianDigits } from "../lib/date";
import type { BookRecommendation } from "../lib/content-server";

const ALL = "همه";

/** Normalizes Arabic/Persian letter variants and diacritics/ZWNJ so search
 * matches regardless of which keyboard/typeface produced the source text
 * (e.g. ي vs ی, ك vs ک) -- without this, a perfectly correct query can miss
 * entries whose Persian text happens to use the Arabic presentation form. */
function normalize(value: string): string {
  return value
    .replace(/[‌‏ً-ٟ]/g, "")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/آ/g, "ا")
    .toLowerCase()
    .trim();
}

export default function RecommendationsClient({ books }: { books: BookRecommendation[] }) {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState(ALL);
  const [country, setCountry] = useState(ALL);

  const genres = useMemo(
    () => [ALL, ...Array.from(new Set(books.map((book) => book.genre).filter(Boolean))).sort()],
    [books]
  );
  const countries = useMemo(
    () => [ALL, ...Array.from(new Set(books.map((book) => book.country).filter(Boolean))).sort()],
    [books]
  );

  const normalizedQuery = normalize(query);

  const visibleBooks = useMemo(
    () =>
      books.filter((book) => {
        const matchesGenre = genre === ALL || book.genre === genre;
        const matchesCountry = country === ALL || book.country === country;
        const matchesQuery =
          !normalizedQuery ||
          normalize(book.title).includes(normalizedQuery) ||
          normalize(book.author).includes(normalizedQuery) ||
          normalize(book.translator).includes(normalizedQuery);
        return matchesGenre && matchesCountry && matchesQuery;
      }),
    [books, genre, country, normalizedQuery]
  );

  const hasActiveFilters = query.trim() !== "" || genre !== ALL || country !== ALL;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold">توصیه‌های ما</h1>
        <p className="mt-4 text-lg leading-8 text-[#4a4a4a]">
          در زمانه‌ای که صنعت چاپ بی‌وقفه و بی‌توجه به کیفیت اثر، مدام کتاب چاپ می‌کند، تفکیک رمان/مجموعه داستان
          درخشان از اثر معمولی به هنر دشواری تبدیل شده است. فهرست زیر، برگرفته از راهنمای انتخاب رمان نیلوفر، قابل
          جستجو و فیلتر است.
        </p>
        <a
          href="/docs/rahnama-entekhab-roman.pdf"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm text-[#6b6b6b] underline decoration-[var(--hairline)] underline-offset-4 transition duration-150 hover:text-[var(--accent)]"
        >
          مشاهدهٔ نسخهٔ کامل راهنما (PDF)
        </a>
      </div>

      {books.length === 0 ? (
        <div className="mt-16 border border-dashed border-[var(--hairline)] py-16 text-center text-[#6b6b6b]">
          <p className="text-lg font-semibold text-[#111111]">به‌زودی</p>
          <p className="mt-2 text-sm">فهرست کتاب‌های پیشنهادی نیلوفر به‌زودی اینجا منتشر می‌شود.</p>
        </div>
      ) : (
        <>
          <div className="mt-8 border-b border-[var(--hairline)] pb-6">
            <label className="relative block">
              <span className="sr-only">جستجوی کتاب، نویسنده یا مترجم</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="جستجو در عنوان، نویسنده یا مترجم…"
                className="w-full border border-[var(--hairline)] bg-white px-4 py-3 text-base outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
              />
            </label>

            <div className="mt-4 flex flex-wrap gap-6 text-sm">
              <label className="flex items-center gap-2">
                <span className="font-medium">شکل اثر</span>
                <select
                  value={genre}
                  onChange={(event) => setGenre(event.target.value)}
                  className="border border-[var(--hairline)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                >
                  {genres.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2">
                <span className="font-medium">کشور</span>
                <select
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  className="border border-[var(--hairline)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                >
                  {countries.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <p className="mt-4 text-sm text-[#6b6b6b]" aria-live="polite">
            {toPersianDigits(String(visibleBooks.length))} کتاب یافت شد
          </p>

          {visibleBooks.length === 0 ? (
            <div className="mt-8 border border-dashed border-[var(--hairline)] py-16 text-center text-[#6b6b6b]">
              <p className="text-lg font-semibold text-[#111111]">نتیجه‌ای پیدا نشد</p>
              <p className="mt-2 text-sm">
                {hasActiveFilters
                  ? "با این جستجو یا فیلترها کتابی یافت نشد. عبارت جستجو یا فیلترها را تغییر دهید."
                  : "کتابی برای نمایش وجود ندارد."}
              </p>
            </div>
          ) : (
            <div className="hairline-grid mt-2 grid-cols-1 md:grid-cols-2">
              {visibleBooks.map((book, index) => {
                const isLastOdd = index === visibleBooks.length - 1 && visibleBooks.length % 2 === 1;
                return (
                <div
                  key={`${book.section}-${book.title}-${index}`}
                  className={`hairline-cell bg-white ${isLastOdd ? "md:col-span-2" : ""}`}
                >
                  <h2 className="text-xl font-bold">{book.title}</h2>
                  <p className="mt-3 text-sm text-[#4a4a4a]">نویسنده: {book.author}</p>
                  {book.translator && <p className="mt-1 text-sm text-[#4a4a4a]">مترجم: {book.translator}</p>}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {book.genre && (
                      <span className="border border-[var(--hairline)] px-2 py-0.5 text-xs text-[#4a4a4a]">
                        {book.genre}
                      </span>
                    )}
                    {book.country && (
                      <span className="border border-[var(--hairline)] px-2 py-0.5 text-xs text-[#4a4a4a]">
                        {book.country}
                      </span>
                    )}
                  </div>

                  {book.note && <p className="mt-3 text-xs text-[#6b6b6b]">{book.note}</p>}

                  {book.editorialNote && (
                    <p className="mt-3 border-r-2 border-[var(--accent)] pr-3 text-xs leading-6 text-[var(--accent)]">
                      یادداشت ویراستاری: {book.editorialNote}
                    </p>
                  )}
                </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
