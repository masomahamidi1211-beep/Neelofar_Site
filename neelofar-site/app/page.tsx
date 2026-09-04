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

  // 1. Standalone Top Section (سرسخن)
  const heroArticle = findArticle("سرسخن", "کوچه‌ی ما", "کوچه ما");

  // 2. Upper 3 Grid Titles
  const upperGridArticles = [
    findArticle("فخری"),
    findArticle("الکسیویچ‌خوانی"),
    findArticle("ضرورت"),
  ].filter((a): a is Article => Boolean(a));

  // 3. Middle Horizontal Divider Feature (قصه‌ی مریم و هم باغش)
  const middleHorizontalArticle = findArticle("مریم");

  // 4. Lower 3 Grid Titles
  const lowerGridArticles = [
    findArticle("سلطان‌زاده", "سلطان‌ازده"),
    findArticle("شاه‌کار", "شاهکار", "تابوت‌های رویین"),
    findArticle("بامیان"),
  ].filter((a): a is Article => Boolean(a));

  return (
    <div className="bg-[#faf7f2] min-h-screen text-[#2a2421] font-serif dir-rtl">
      <div className="max-w-[1360px] mx-auto px-4 md:px-8 py-8 space-y-12">

        {/* 1. TOP SECTION: سرسخن (ALONE AT THE VERY TOP) */}
        {heroArticle && (
          <section className="border-b border-[#e5ded4] pb-10">
            <div className="bg-[#f3ede2] p-8 rounded-xl border border-[#e2d8c9] shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#d8ccbc]">
                <span className="bg-[#8c2222] text-[#faf7f2] text-xs font-sans font-bold px-3 py-1 rounded-sm tracking-widest">
                  سرمقاله نیلوفر
                </span>
                <span className="text-xs text-[#786e65] font-sans">یادداشت نخست</span>
              </div>
              <WideRow article={toBaru(heroArticle, [220, 380])} />
            </div>
          </section>
        )}

        {/* 2. UPPER SECTION: 3 CARDS */}
        {upperGridArticles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 pb-2 border-b-2 border-[#2a2421]">
              <h2 className="text-xl font-bold tracking-tight">یادداشت‌ها و نقد ادبی</h2>
            </div>

            <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {upperGridArticles.map((a, i) => (
                <div
                  key={a.slug}
                  className="bg-white p-6 rounded-xl border border-[#e2d8c9] shadow-xs flex flex-col justify-between h-full hover:shadow-md transition-all duration-300"
                >
                  <ArticleBox
                    article={toBaru(a, [100, 170])}
                    variant="photo-top"
                    tone={i % 2 === 0 ? "tan" : "cream"}
                  />
                </div>
              ))}
            </StaggerGrid>
          </section>
        )}

        {/* 3. MIDDLE HORIZONTAL SECTION: قصه‌ی مریم و هم باغش */}
        {middleHorizontalArticle && (
          <section className="my-10">
            <div className="bg-[#f3ede2] p-6 md:p-8 rounded-xl border border-[#e2d8c9] shadow-sm">
              <div className="mb-4 pb-2 border-b border-[#d8ccbc]">
                <span className="text-xs font-sans font-bold text-[#8c2222] tracking-widest uppercase">
                  روایت ویژه
                </span>
              </div>
              <WideRow article={toBaru(middleHorizontalArticle, [160, 300])} />
            </div>
          </section>
        )}

        {/* 4. LOWER SECTION: 3 CARDS */}
        {lowerGridArticles.length > 0 && (
          <section className="pb-12">
            <div className="flex items-center justify-between mb-8 pb-2 border-b-2 border-[#2a2421]">
              <h2 className="text-xl font-bold tracking-tight">داستان‌ها و گفتگوها</h2>
            </div>

            <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {lowerGridArticles.map((a, i) => (
                <div
                  key={a.slug}
                  className="bg-white p-6 rounded-xl border border-[#e2d8c9] shadow-xs flex flex-col justify-between h-full hover:shadow-md transition-all duration-300"
                >
                  <ArticleBox
                    article={toBaru(a, [100, 170])}
                    variant="photo-top"
                    tone={i % 2 === 0 ? "cream" : "tan"}
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