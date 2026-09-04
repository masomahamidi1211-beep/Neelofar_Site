import { getAllArticles, longExcerptOf, type Article } from "./lib/content-server";
import { toPersianDigits } from "./lib/date";
import { ArticleBox, type BaruArticle } from "./components/article-box";
import { WideRow } from "./components/wide-row";
import StaggerGrid from "./components/stagger-grid";

function toBaru(
  article: Pick<Article, "slug" | "title" | "author" | "jalaliDate" | "image" | "imagePosition" | "imageAlt" | "body">,
  excerptBounds: [number, number] = [120, 240],
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
    <div className="bg-[#faf8f5] text-[#1c1917] min-h-screen">
      {/* 1. HERO: سرسخن */}
      {heroArticle && (
        <section className="max-w-6xl mx-auto px-4 pt-10 pb-8 border-b border-[#e7e5e4]">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-2 w-2 rounded-full bg-[#991b1b]" />
            <h2 className="text-sm tracking-widest font-bold uppercase text-[#78716c]">سرسخن</h2>
          </div>
          <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-[#e7e5e4]">
            <WideRow article={toBaru(heroArticle, [180, 320])} />
          </div>
        </section>
      )}

      {/* 2. FEATURED: حسین فخری */}
      {secondaryHero && (
        <section className="max-w-6xl mx-auto px-4 py-12 border-b border-[#e7e5e4]">
          <div className="bg-[#f5f2eb] p-6 md:p-8 rounded-xl border border-[#e7e5e4]">
            <WideRow article={toBaru(secondaryHero, [140, 260])} />
          </div>
        </section>
      )}

      {/* 3. ESSAYS & CRITICISM */}
      {groupOne.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-14">
          <div className="flex items-center justify-between mb-8 pb-3 border-b-2 border-[#1c1917]">
            <h3 className="text-2xl font-bold font-serif">ادبیات و نقد</h3>
            <span className="text-xs text-[#78716c]">گزیده نوشتارها</span>
          </div>
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {groupOne.map((a) => (
              <ArticleBox key={a.slug} article={toBaru(a, [100, 160])} variant="photo-top" />
            ))}
          </StaggerGrid>
        </section>
      )}

      {/* 4. LONG READS */}
      {wideRows.length > 0 && (
        <section className="bg-[#f0ebe1] py-14 border-y border-[#e7e5e4]">
          <div className="max-w-6xl mx-auto px-4">
            <StaggerGrid className="space-y-6">
              {wideRows.map((a) => (
                <div key={a.slug} className="bg-white p-6 rounded-lg shadow-sm">
                  <WideRow article={toBaru(a, [100, 180])} />
                </div>
              ))}
            </StaggerGrid>
          </div>
        </section>
      )}

      {/* 5. INTERVIEWS */}
      {groupTwo.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8 pb-3 border-b-2 border-[#1c1917]">
            <h3 className="text-2xl font-bold font-serif">گفتگوها و روایت‌ها</h3>
          </div>
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-8">
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