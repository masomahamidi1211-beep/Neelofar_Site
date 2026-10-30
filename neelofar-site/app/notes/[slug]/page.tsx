import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getArticleBySlug,
  getAllArticles,
  getOtherArticlesByAuthor,
  getOtherArticlesInSameIssue,
  getSpecialIssueContainingArticle,
  inlineFootnotes,
} from "../../lib/content-server";
import { formatJalaliDate, toPersianDigits } from "../../lib/date";
import { ArticleSidebar } from "../../components/article-sidebar";
import { ShareIcons } from "../../components/share-icons";
import ArticleBody from "../../components/article-body";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://neelofar-placeholder.example";

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug.includes("%") ? decodeURIComponent(rawSlug) : rawSlug;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const showCoverAtTop = Boolean(article.image) && !article.body.includes(article.image as string);

  const authorArticles = getOtherArticlesByAuthor(article.author, slug);
  const issue = getSpecialIssueContainingArticle(slug);
  const issueRelated = getOtherArticlesInSameIssue(slug, 5);
  const relatedArticles =
    issueRelated.length > 0
      ? issueRelated
      : getAllArticles()
          .filter((a) => a.slug !== slug && a.author !== article.author)
          .slice(0, 5);
  const relatedHeading = issue ? "از متن‌های ویژه‌نامه" : "سایر یادداشت‌ها";
  const hasSidebarContent = authorArticles.length > 0 || relatedArticles.length > 0;
  const bodyWithFootnotes = inlineFootnotes(article.body, article.footnotes);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className={hasSidebarContent ? "grid grid-cols-1 gap-12 lg:grid-cols-[7fr_3fr] lg:gap-16" : ""}>
        <article className={`min-w-0 max-w-[70ch] ${hasSidebarContent ? "" : "mx-auto"}`}>
          <h1 className="article-title text-4xl leading-[1.6] sm:text-5xl">{article.title}</h1>
          {article.subtitle && (
            <div className="article-author mt-3 space-y-1 text-lg text-[#6b6b6b]">
              {article.subtitle.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-[#6b6b6b]">
            <span className="article-author text-[#111111]">{article.author}</span>
            <span>·</span>
            <span>{formatJalaliDate(article.jalaliDate)}</span>
            <span>·</span>
            <span>{toPersianDigits(String(article.readingTimeMinutes))} دقیقه زمان مطالعه</span>
          </div>

          {showCoverAtTop && (
            <img
              src={article.image as string}
              alt={`${article.imageAlt ?? article.title} — مادران و دختران`}
              className="mx-auto mt-8 block max-h-[60vh] w-auto max-w-full"
            />
          )}

          <ArticleBody
            bodyHtml={bodyWithFootnotes}
            footnotes={article.footnotes}
          />

          {/* Clickable Aasoo-style Hashtags at the bottom */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-[var(--hairline)] pt-6 text-sm">
              <span className="text-[#6b6b6b] font-medium">کلیدواژه‌ها:</span>
              {article.tags.map((tag, index) => (
                <Link
                  key={index}
                  href={`/tag/${encodeURIComponent(tag)}`}
                  className="text-[#4b5563] transition-colors hover:text-[#dc2626]"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-14 flex items-center justify-end border-t border-[var(--hairline)] pt-6">
            <ShareIcons url={`${SITE_URL}/notes/${slug}`} title={article.title} />
          </div>
        </article>

        <ArticleSidebar
          authorName={article.author}
          authorArticles={authorArticles}
          relatedHeading={relatedHeading}
          relatedArticles={relatedArticles}
        />
      </div>
    </div>
  );
}