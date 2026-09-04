import { getAllArticles, longExcerptOf, type Article } from "./lib/content-server";
import { toPersianDigits } from "./lib/date";
import { ArticleBox, type BaruArticle } from "./components/article-box";
import { WideRow } from "./components/wide-row";
import StaggerGrid from "./components/stagger-grid";

function toBaru(
  article: Pick<Article, "slug" | "title" | "author" | "jalaliDate" | "image" | "imagePosition" | "imageAlt" | "body">,
  excerptBounds: [number, number] = [100, 200],
  imagePositionOverride?: string
): BaruArticle {
  return {
    slug: article.slug,
    title: article.title,
    author: article.author,
    excerpt: longExcerptOf(article, excerptBounds[0], excerptBounds[1]),
    date: toPersianDigits(article.jalaliDate.replace(/-/g, "/")),
    image: article.image,
    imagePosition: imagePositionOverride ?? article.imagePosition,
    imageAlt: article.imageAlt,
  };
}

export default function HomePage() {
  const articles = getAllArticles();

  const findArticle = (...keywords: string[]) => {
    return articles.find((a) => {
      if (!a || !a.title) return false;
      const cleanTitle = a.title.replace(/['"«»؟?!]/g, "");
      return keywords.some((kw) => cleanTitle.includes(kw));
    });
  };

  // 1. Hero Pin (سرسخن)
  const heroArticle = findArticle("سرسخن", "کوچه‌ی ما", "کوچه ما");

  // 2. Main Grid Pins
  const pinArticles = [
    findArticle("فخری"),
    findArticle("الکسیویچ‌خوانی"),
    findArticle("ضرورت"),
    findArticle("سلطان‌زاده", "سلطان‌ازده"),
    findArticle("شاه‌کار", "شاهکار", "تابوت‌های رویین"),
    findArticle("بامیان"),
    findArticle("مریم"),
    findArticle("همل"),
    findArticle("سارا"),
  ].filter((a): a is Article => Boolean(a));

  return (
    <div className="bg-[#f8f6f2] min-h-screen py-8 text-[#1c1917]">
      <div className="max-w-[1400px] mx-auto px-4 space-y-8">

        {/* FEATURED PIN: سرسخن */}
        {heroArticle && (
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#e7e5e4] hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#1c1917] text-white text-xs font-bold px-3 py-1 rounded-full">
                📌 سرسخن
              </span>
              <span className="text-xs text-[#78716c]">یادداشت ویژه</span>
            </div>
            <WideRow article={toBaru(heroArticle, [180, 320])} />
          </section>
        )}

        {/* PINTEREST STAGGERED GRID */}
        {pinArticles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#e7e5e4]">
              <h2 className="text-xl font-bold">پیشنهاد خواندن</h2>
              <span className="text-xs text-[#78716c]">{pinArticles.length} مطلب</span>
            </div>

            <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {pinArticles.map((a, i) => (
                <div
                  key={a.slug}
                  className="bg-white rounded-2xl overflow-hidden border border-[#e7e5e4] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5"
                >
                  <ArticleBox
                    article={toBaru(a, [90, 160])}
                    variant="photo-top"
                    tone={i % 2 === 0 ? "tan" : "cream"}
                    authorFirst
                  />
                </div>
              ))}
            </StaggerGrid>
          </section>
        )}

      </div>
    </div>
  );
}