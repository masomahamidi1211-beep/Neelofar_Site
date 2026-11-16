import { getAllArticles, getHomepage, longExcerptOf, type Article } from "../lib/content-server";
import { HomeCardGrid, articleCard } from "../components/home-card-grid";
import { WideRow } from "../components/wide-row";

/**
 * Repeating pattern: a row of three cards, then one wide card (image beside
 * the text), then three, then one ... -- with 11 articles: 3 · 1 · 3 · 1 · 3.
 */
function patternRows(articles: Article[]) {
  const rows: { kind: "three" | "one"; items: Article[] }[] = [];
  let i = 0;
  while (i < articles.length) {
    rows.push({ kind: "three", items: articles.slice(i, i + 3) });
    i += 3;
    if (i < articles.length) {
      rows.push({ kind: "one", items: [articles[i]] });
      i += 1;
    }
  }
  return rows;
}

export default function NotesPage() {
  // Texts listed under "notesPage.hidden" in content/homepage.json (editable
  // at /admin) are left out of this listing; they remain published.
  const hidden = new Set(getHomepage().notesPage?.hidden ?? []);
  const articles = getAllArticles().filter((a) => !hidden.has(a.slug));

  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold">یادداشت‌ها</h1>
      <p className="mt-2 text-lg text-[#4a4a4a]">تمام مقاله‌های نیلوفر، به ترتیب ویژه‌نامه.</p>

      <div className="mt-6 flex flex-col gap-8">
        {patternRows(articles).map((row) =>
          row.kind === "three" ? (
            <HomeCardGrid key={row.items[0].slug} articles={row.items} />
          ) : (
            // One wide card: same white card, 2px soft border and rounded
            // corners as the others, with the image beside the text.
            <div
              key={row.items[0].slug}
              className="rounded-xl border-2 border-[#e2d8c9] bg-white p-6 shadow-xs transition-all duration-300 hover:shadow-md md:p-8"
            >
              <WideRow article={{ ...articleCard(row.items[0]), excerpt: longExcerptOf(row.items[0], 160, 300) }} />
            </div>
          )
        )}
      </div>
    </div>
  );
}
