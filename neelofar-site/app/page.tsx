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

  // Flexible title finder that ignores special quotes and extra spaces
  const findArticle = (...keywords: string[]) => {
    return articles.find((a) => {
      if (!a || !a.title) return false;
      const cleanTitle = a.title.replace(/['"«»]/g, "");
      return keywords.some((kw) => cleanTitle.includes(kw));
    });
  };

  // 1. فخری
  const preMosaicWideRow = findArticle("فخری");

  // 2. الکسیویچ‌خوانی در مزار | 3. آصف سلطان‌زاده | 4. شاهکار
  const mosaic = [
    findArticle("الکسیویچ"),
    findArticle("سلطان‌زاده", "سلطان‌ازده"),
    findArticle("شاهکار"),
  ].filter((a): a is Article => Boolean(a));

  // 5. یادداشت‌هایی از بامیان
  const wideRows = [
    findArticle("بامیان"),
  ].filter((a): a is Article => Boolean(a));

  // 6. قصه مریم | 7. گفتگو با همل‌غایش | 8. گفتگو با سارا راخفوس
  const portrait = [
    findArticle("مریم"),
    findArticle("همل"),
    findArticle("سارا"),
  ].filter((a): a is Article => Boolean(a));

  // Fallback: If title search fails, display the first 8 articles directly
  const displayMosaic = mosaic.length > 0 ? mosaic : articles.slice(1, 4);
  const displayWideRows = wideRows.length > 0 ? wideRows : articles.slice(4, 5);
  const displayPortrait = portrait.length > 0 ? portrait : articles.slice(5, 8);
  const displayHero = preMosaicWideRow || articles[0];

  return (
    <div className="bg-[var(--bg)]">
      {/* 1. فخری */}
      {displayHero && (
        <section className="px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14">
          <StaggerGrid className="divide-y divide-[#d4d4d4] bg-[#f0f0f0]">
            <WideRow article={toBaru(displayHero, [140, 260])} />
          </StaggerGrid>
        </section>
      )}

      {/* 2. الکسیویچ‌خوانی | 3. آصف سلطان‌زاده | 4. شاهکار */}
      {displayMosaic.length > 0 && (
        <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {displayMosaic.map((a) => (
              <ArticleBox
                key={a.slug}
                article={toBaru(a, [90, 160])}
                variant="photo-top"
              />
            ))}
          </StaggerGrid>
        </section>
      )}

      {/* 5. یادداشت‌هایی از بامیان */}
      {displayWideRows.length > 0 && (
        <section className="px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14">
          <StaggerGrid className="divide-y divide-[#d4d4d4] bg-[#f0f0f0]">
            {displayWideRows.map((a) => (
              <WideRow key={a.slug} article={toBaru(a, [90, 160])} />
            ))}
          </StaggerGrid>
        </section>
      )}

      {/* 6. قصه مریم | 7. گفتگو با همل‌غایش | 8. گفتگو با سارا راخفوس */}
      {displayPortrait.length > 0 && (
        <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {displayPortrait.map((a, i) => (
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