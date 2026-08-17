import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getAllArticles,
  getOtherArticlesByAuthor,
  getOtherArticlesInSameIssue,
  getSpecialIssueContainingArticle,
  inlineFootnotes,
} from "../../lib/content-server";
import { formatJalaliDate, toPersianDigits } from "../../lib/date";
import GiscusComments from "../../components/giscus-comments";
import { ArticleSidebar } from "../../components/article-sidebar";
import { ShareIcons } from "../../components/share-icons";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://neelofar-placeholder.example";

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  // Turbopack's dev router hands this segment still percent-encoded for
  // non-ASCII (Persian) slugs instead of decoding it -- decode defensively.
  const slug = rawSlug.includes("%") ? decodeURIComponent(rawSlug) : rawSlug;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Only show a cover image at the top if it isn't already embedded inline
  // in the body -- illustrated articles (شاه‌کار, قصه‌ی مریم, ...) already
  // place their first image at its natural position in the text, so
  // showing the cover again up top would duplicate it.
  const showCoverAtTop = Boolean(article.image) && !article.body.includes(article.image as string);

  const authorArticles = getOtherArticlesByAuthor(article.author, slug);
  const issue = getSpecialIssueContainingArticle(slug);
  const issueRelated = getOtherArticlesInSameIssue(slug, 5);
  // Falls back to a general "سایر یادداشت‌ها" pool (other pieces on the
  // site, not by this same author -- that list is already covered above)
  // when the article isn't part of any ویژه‌نامه. This is what keeps the
  // sidebar from ever being genuinely empty for a standalone piece like
  // «چرا حسین فخری...» or «کوچه‌ی ما...». Sized at 5 (not 4) so the sidebar
  // carries a bit more content for long articles -- it still won't match a
  // very long article's height 1:1, which is why the sidebar is sticky
  // (see ArticleSidebar) rather than trying to pad it out further.
  const relatedArticles =
    issueRelated.length > 0
      ? issueRelated
      : getAllArticles()
          .filter((a) => a.slug !== slug && a.author !== article.author)
          .slice(0, 5);
  const relatedHeading = issue ? "از متن‌های ویژه‌نامه" : "سایر یادداشت‌ها";
  // Mirrors ArticleSidebar's own null-check: when it has nothing to render,
  // the two-column grid still reserved a blank 3fr track for it, pinning
  // the article to the 7fr side instead of letting it center in the full
  // width. Compute the same condition here so the wrapper can drop the
  // grid entirely instead of rendering an empty second column.
  const hasSidebarContent = authorArticles.length > 0 || relatedArticles.length > 0;
  // Matches the source .docx's own footnote placement (near the reference,
  // divider line, smaller type) instead of bundling every note into one
  // end-of-article list -- see inlineFootnotes for the full rationale.
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

          <div
            className="article-body prose prose-neutral mt-10 max-w-none text-justify text-xl leading-9 [&_p]:mb-6 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold"
            dangerouslySetInnerHTML={{ __html: bodyWithFootnotes }}
          />

          <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-[var(--hairline)] pt-6">
            <p className="text-base text-[#6b6b6b]">
              نویسنده: <span className="font-semibold text-[#111111]">{article.author}</span>
            </p>
            <ShareIcons url={`${SITE_URL}/notes/${slug}`} title={article.title} />
          </div>

          <GiscusComments />
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
