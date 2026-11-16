import { getAllArticles, getHomepage, longExcerptOf } from "../lib/content-server";
import { toPersianDigits } from "../lib/date";
import { ArticleBox } from "../components/article-box";
import StaggerGrid from "../components/stagger-grid";

export default function NotesPage() {
  // Texts listed under "notesPage.hidden" in content/homepage.json (editable
  // at /admin) are left out of this listing; they remain published.
  const hidden = new Set(getHomepage().notesPage?.hidden ?? []);
  const articles = getAllArticles().filter((a) => !hidden.has(a.slug));

  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold">یادداشت‌ها</h1>
      <p className="mt-2 text-lg text-[#4a4a4a]">تمام مقاله‌های نیلوفر، به ترتیب ویژه‌نامه.</p>

      {/* Same card as the homepage rows: white padded frame with a soft
          cream border and rounded corners, holding the photo-top ArticleBox
          (cream/tan photo mat, navy headline, fading excerpt, round
          read-more button). Here with a 2px border and a 2rem gap. */}
      <StaggerGrid className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
        {articles.map((a, i) => (
          <div
            key={a.slug}
            className="flex h-full flex-col rounded-xl border-2 border-[#e2d8c9] bg-white p-6 shadow-xs transition-all duration-300 hover:shadow-md"
          >
            <ArticleBox
              article={{
                slug: a.slug,
                title: a.title,
                author: a.author,
                excerpt: longExcerptOf(a, 100, 170),
                date: toPersianDigits(a.jalaliDate.replace(/-/g, "/")),
                image: a.image,
                imagePosition: a.imagePosition,
                imageAlt: a.imageAlt,
              }}
              variant="photo-top"
              excerptMinHeight="12rem"
              alignStart
              className="flex-1"
              tone={i % 2 === 0 ? "tan" : "cream"}
            />
          </div>
        ))}
      </StaggerGrid>
    </div>
  );
}
