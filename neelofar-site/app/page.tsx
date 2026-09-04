import { getAllArticles, longExcerptOf, type Article } from "./lib/content-server";
import { toPersianDigits } from "./lib/date";
import { ArticleBox, type BaruArticle } from "./components/article-box";
import { WideRow } from "./components/wide-row";
import StaggerGrid from "./components/stagger-grid";

function toBaru(
  article: Pick<Article, "slug" | "title" | "author" | "jalaliDate" | "image" | "imagePosition" | "imageAlt" | "body">,
  excerptBounds: [number, number] = [120, 240]
): BaruArticle {
  return {
    slug: article.slug,
    title: article.title,
    author: article.author,
    excerpt: longExcerptOf(article, excerptBounds[0], excerptBounds[1]),
    date: toPersianDigits(article.jalaliDate.replace(/-/g, "/")),
    image: article.image,
    imagePosition: article.imagePosition,
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

  const heroArticle = findArticle("سرسخن", "کوچه‌ی ما", "کوچه ما");
  const secondaryHero = findArticle("فخری");
  const groupOne = [
    findArticle("الکسیویچ‌خوانی"),
    findArticle("ضرورت"),
    findArticle("سلطان‌زاده", "سلطان‌ازده"),
  ].filter((a): a is Article => Boolean(a));

  const wideRows = [
    findArticle("شاه‌کار", "شاهکار", "تابوت‌های رویین"),
    findArticle("بامیان"),
  ].filter((a): a is Article => Boolean(a));

  const groupTwo = [
    findArticle("مریم"),
    findArticle("همل"),
    findArticle("سارا"),
  ].filter((a): a is Article => Boolean(a));

  return (
    <div className="bg-[#fcfbf9] min-h-screen">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-10 border-b border-[#e2e8f0]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {heroArticle && (
            <div className="lg:col-span-8 bg-[#f4f1ea] p-8 rounded-2xl border border-[#e2e8f0]">
              <span className="text-xs font-bold text-[#b91c1c] tracking-widest uppercase mb-3 inline-block">
                ★ سرسخن
              </span>
              <WideRow article={toBaru(heroArticle, [160, 280])} />
            </div>
          )}
          {secondaryHero && (
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#e2e8f0]">
              <ArticleBox article={toBaru(secondaryHero, [100, 180])} variant="photo-top" />
            </div>
          )}
        </div>
      </section>

      {/* ARTICLES GRID */}
      {groupOne.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-xl font-bold mb-6 text-[#0f172a] border-r-4 border-[#0f172a] pr-3">
            ادبیات و تحلیل
          </h2>
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {groupOne.map((a) => (
              <ArticleBox key={a.slug} article={toBaru(a, [90, 150])} variant="photo-top" />
            ))}
          </StaggerGrid>
        </section>
      )}

      {/* WIDE ROWS */}
      {wideRows.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <StaggerGrid className="space-y-6">
            {wideRows.map((a) => (
              <div key={a.slug} className="bg-[#f8f6f0] p-6 rounded-xl border border-[#e2e8f0]">
                <WideRow article={toBaru(a, [100, 180])} />
              </div>
            ))}
          </StaggerGrid>
        </section>
      )}

      {/* INTERVIEWS */}
      {groupTwo.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12 border-t border-[#e2e8f0]">
          <h2 className="text-xl font-bold mb-6 text-[#0f172a] border-r-4 border-[#0f172a] pr-3">
            گفتگوها
          </h2>
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {groupTwo.map((a, i) => (
              <ArticleBox
                key={a.slug}
                article={toBaru(a)}
                variant="photo-top"
                tone={i % 2 === 0 ? "tan" : "cream"}
                authorFirst
              />
            ))}
          </StaggerGrid>
        </section>
      )}
    </div>
  );
}