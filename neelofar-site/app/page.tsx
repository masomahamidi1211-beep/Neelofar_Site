import { getAllArticles, longExcerptOf, type Article } from "./lib/content-server";
import { toPersianDigits } from "./lib/date";
import { ArticleBox, type BaruArticle } from "./components/article-box";
import { WideRow } from "./components/wide-row";
import StaggerGrid from "./components/stagger-grid";

function toBaru(
  article: Pick<Article, "slug" | "title" | "author" | "jalaliDate" | "image" | "imagePosition" | "imageAlt" | "body">,
  excerptBounds: [number, number] = [90, 160],
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

  // Helper function to match articles safely by title keywords
  const findArticle = (...keywords: string[]) => {
    return articles.find((a) => {
      if (!a || !a.title) return false;
      const cleanTitle = a.title.replace(/['"«»؟?!]/g, "");
      return keywords.some((kw) => cleanTitle.includes(kw));
    });
  };

  // 1. چرا حسین فخری حافظه‌ی ادبیات افغانستان است؟
  const heroArticle = findArticle("فخری");

  // 2. الکسیویچ‌خوانی در مزار
  // 3. افغانستان بدون الکسیویچ و ضرورت «ادبیات مستند»
  // 4. آیا آصف سلطان‌زاده الکسیویچ افغانستان است؟
  const groupOne = [
    findArticle("الکسیویچ‌خوانی"),
    findArticle("ضرورت"),
    findArticle("سلطان‌زاده", "سلطان‌ازده"),
  ].filter((a): a is Article => Boolean(a));

  // 5. شاه‌کار یا دروغ‌پردازی؟
  // 6. یادداشت‌هایی از بامیان
  const wideRows = [
    findArticle("شاه‌کار", "شاهکار", "تابوت‌های رویین"),
    findArticle("بامیان"),
  ].filter((a): a is Article => Boolean(a));

  // 7. قصه مریم
  // 8. بیست و پنج سال در خدمت صداهای جنوب جهانی (یوتا هِمِل‌غایش)
  // 9. گفتگو با سارا راخفوس
  // 10. سرسخن / «کوچه‌ی ما»
  const groupTwo = [
    findArticle("مریم"),
    findArticle("همل"),
    findArticle("سارا"),
    findArticle("کوچه‌ی ما", "کوچه ما", "سرسخن"),
  ].filter((a): a is Article => Boolean(a));

  return (
    <div className="bg-[var(--bg)]">
      {/* Hero Section: حسین فخری */}
      {heroArticle && (
        <section className="px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14">
          <StaggerGrid className="divide-y divide-[#d4d4d4] bg-[#f0f0f0]">
            <WideRow article={toBaru(heroArticle, [140, 260])} />
          </StaggerGrid>
        </section>
      )}

      {/* Grid 1: الکسیویچ‌خوانی, ضرورت ادبیات مستند, آصف سلطان‌زاده */}
      {groupOne.length > 0 && (
        <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {groupOne.map((a) => (
              <ArticleBox
                key={a.slug}
                article={toBaru(a, [90, 160])}
                variant="photo-top"
              />
            ))}
          </StaggerGrid>
        </section>
      )}

      {/* Wide Rows: شاهکار / تابوت‌های رویین + یادداشت‌هایی از بامیان */}
      {wideRows.length > 0 && (
        <section className="px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14">
          <StaggerGrid className="divide-y divide-[#d4d4d4] bg-[#f0f0f0]">
            {wideRows.map((a) => (
              <WideRow key={a.slug} article={toBaru(a, [90, 160])} />
            ))}
          </StaggerGrid>
        </section>
      )}

      {/* Grid 2: قصه مریم, گفتگو با همِل‌غایش, گفتگو با سارا راخفوس, سرسخن / کوچه‌ی ما */}
      {groupTwo.length > 0 && (
        <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <StaggerGrid className={`grid grid-cols-1 gap-4 ${groupTwo.length === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
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