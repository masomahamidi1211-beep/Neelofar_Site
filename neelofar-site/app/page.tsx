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

  // Helper function to find article by matching part of the title
  const findByTitle = (keyword: string) =>
    articles.find((a) => a.title && a.title.includes(keyword));

  // 1. فخری
  const preMosaicWideRow = findByTitle("فخری");

  // 2. الکسیویچ‌خوانی در مزار, 3. آصف سلطان‌زاده, 4. شاهکار
  const mosaic = [
    findByTitle("الکسیویچ"),
    findByTitle("سلطان‌زاده"),
    findByTitle("شاهکار"),
  ].filter((a): a is Article => Boolean(a));

  // 5. یادداشت‌هایی از بامیان
  const wideRows = [
    findByTitle("بامیان"),
  ].filter((a): a is Article => Boolean(a));

  // 6. قصه مریم, 7. گفتگو با همل‌غایش, 8. گفتگو با سارا راخفوس
  const portrait = [
    findByTitle("مریم"),
    findByTitle("همل"),
    findByTitle("سارا"),
  ].filter((a): a is Article => Boolean(a));

  return (
    <div className="bg-[var(--bg)]">
      {/* 1. حسین فخری */}
      {preMosaicWideRow && (
        <section className="px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14">
          <StaggerGrid className="divide-y divide-[#d4d4d4] bg-[#f0f0f0]">
            <WideRow article={toBaru(preMosaicWideRow, [140, 260])} />
          </StaggerGrid>
        </section>
      )}

      {/* 2. الکسیویچ‌خوانی در مزار | 3. آصف سلطان‌زاده | 4. شاهکار */}
      {mosaic.length > 0 && (
        <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {mosaic.map((a) => (
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
      {wideRows.length > 0 && (
        <section className="px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14">
          <StaggerGrid className="divide-y divide-[#d4d4d4] bg-[#f0f0f0]">
            {wideRows.map((a) => (
              <WideRow key={a.slug} article={toBaru(a, [90, 160])} />
            ))}
          </StaggerGrid>
        </section>
      )}

      {/* 6. قصه مریم | 7. گفتگو با همل‌غایش | 8. گفتگو با سارا راخفوس */}
      {portrait.length > 0 && (
        <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {portrait.map((a, i) => (
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