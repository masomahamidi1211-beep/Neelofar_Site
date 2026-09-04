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

  // 1. First Article: سرسخن
  const heroArticle = findArticle("سرسخن", "کوچه‌ی ما", "کوچه ما");

  // 2. Featured Focus: حسین فخری
  const secondaryHero = findArticle("فخری");

  // 3. Main Grid (3 Columns)
  const mainGridArticles = [
    findArticle("الکسیویچ‌خوانی"),
    findArticle("ضرورت"),
    findArticle("سلطان‌زاده", "سلطان‌ازده"),
  ].filter((a): a is Article => Boolean(a));

  // 4. Wide Feature Rows
  const wideRowArticles = [
    findArticle("شاه‌کار", "شاهکار", "تابوت‌های رویین"),
    findArticle("بامیان"),
  ].filter((a): a is Article => Boolean(a));

  // 5. Interviews & Profiles Grid
  const interviewArticles = [
    findArticle("مریم"),
    findArticle("همل"),
    findArticle("سارا"),
  ].filter((a): a is Article => Boolean(a));

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      {/* SECTION 1: سرسخن (Top Hero Banner) */}
      {heroArticle && (
        <section className="px-4 pt-8 pb-4 sm:px-6 lg:px-8 border-b border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto">
            <span className="inline-block bg-[#1a1a1a] text-white text-xs font-bold px-3 py-1 mb-4 rounded-sm tracking-wider">
              سرسخن
            </span>
            <StaggerGrid className="bg-[#fcfbf9] p-6 lg:p-10 border border-[#e0dad1] shadow-sm rounded-lg">
              <WideRow article={toBaru(heroArticle, [160, 300])} />
            </StaggerGrid>
          </div>
        </section>
      )}

      {/* SECTION 2: چرا حسین فخری ... */}
      {secondaryHero && (
        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <StaggerGrid className="divide-y divide-[#d4d4d4] bg-[#f5f3ef] rounded-md overflow-hidden border border-[#e0dad1]">
              <WideRow article={toBaru(secondaryHero, [140, 260])} />
            </StaggerGrid>
          </div>
        </section>
      )}

      {/* SECTION 3: 3-Column Literary Analysis Grid */}
      {mainGridArticles.length > 0 && (
        <section className="px-4 py-10 sm:px-6 lg:px-8 bg-[#fdfdfd]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-bold mb-6 pb-2 border-b-2 border-[#1a1a1a] w-fit">
              ادبیات و نقد
            </h2>
            <StaggerGrid className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {mainGridArticles.map((a) => (
                <ArticleBox
                  key={a.slug}
                  article={toBaru(a, [90, 150])}
                  variant="photo-top"
                />
              ))}
            </StaggerGrid>
          </div>
        </section>
      )}

      {/* SECTION 4: Wide Highlight Rows */}
      {wideRowArticles.length > 0 && (
        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <StaggerGrid className="divide-y divide-[#d4d4d4] bg-[#f5f3ef] rounded-md overflow-hidden border border-[#e0dad1]">
              {wideRowArticles.map((a) => (
                <WideRow key={a.slug} article={toBaru(a, [100, 180])} />
              ))}
            </StaggerGrid>
          </div>
        </section>
      )}

      {/* SECTION 5: Interviews & Narratives */}
      {interviewArticles.length > 0 && (
        <section className="px-4 py-12 sm:px-6 lg:px-8 bg-[#f9f8f6] border-t border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-bold mb-6 pb-2 border-b-2 border-[#1a1a1a] w-fit">
              گفتگوها و روایت‌ها
            </h2>
            <StaggerGrid className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {interviewArticles.map((a, i) => (
                <ArticleBox
                  key={a.slug}
                  article={toBaru(a, [90, 160])}
                  variant="photo-top"
                  tone={i % 2 === 0 ? "tan" : "cream"}
                  authorFirst
                />
              ))}
            </StaggerGrid>
          </div>
        </section>
      )}
    </div>
  );
}