"use client";

import { useMemo, useState } from "react";

type Book = {
  title: string;
  author: string;
  translator: string;
  genre: string;
  country: string;
};

export default function RecommendationsClient({ books }: { books: Book[] }) {
  const [genre, setGenre] = useState("همه");
  const [country, setCountry] = useState("همه");

  const genres = useMemo(() => ["همه", ...Array.from(new Set(books.map((book) => book.genre)))], [books]);
  const countries = useMemo(() => ["همه", ...Array.from(new Set(books.map((book) => book.country)))], [books]);

  const visibleBooks = useMemo(
    () =>
      books.filter((book) => {
        const matchesGenre = genre === "همه" || book.genre === genre;
        const matchesCountry = country === "همه" || book.country === country;
        return matchesGenre && matchesCountry;
      }),
    [books, genre, country]
  );

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold">توصیه‌های ما</h1>
        <p className="mt-4 text-lg leading-8 text-[#4a4a4a]">
          در زمانه‌ای که صنعت چاپ بی‌وقفه و بی‌توجه به کیفیت اثر، مدام کتاب چاپ می‌کند، تفکیک رمان/مجموعه داستان
          درخشان از اثر معمولی به هنر دشواری تبدیل شده است.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-6 border-b border-[var(--hairline)] pb-6 text-sm">
        <label className="flex items-center gap-2">
          <span className="font-medium">ژانر</span>
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

      {visibleBooks.length === 0 ? (
        <div className="mt-16 border border-dashed border-[var(--hairline)] py-16 text-center text-[#6b6b6b]">
          <p className="text-lg font-semibold text-[#111111]">به‌زودی</p>
          <p className="mt-2 text-sm">فهرست کتاب‌های پیشنهادی نیلوفر به‌زودی اینجا منتشر می‌شود.</p>
        </div>
      ) : (
        <div className="hairline-grid mt-8 grid-cols-1 md:grid-cols-2">
          {visibleBooks.map((book) => (
            <div key={book.title} className="hairline-cell bg-white">
              <h2 className="text-xl font-bold">{book.title}</h2>
              <p className="mt-3 text-sm text-[#4a4a4a]">نویسنده: {book.author}</p>
              <p className="mt-2 text-sm text-[#4a4a4a]">مترجم: {book.translator}</p>
              <p className="mt-2 text-sm text-[#4a4a4a]">ژانر: {book.genre}</p>
              <p className="mt-2 text-sm text-[#4a4a4a]">کشور: {book.country}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
