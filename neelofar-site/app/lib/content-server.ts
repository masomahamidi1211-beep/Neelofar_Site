import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const contentDir = path.join(process.cwd(), "content");

export type Footnote = { id: string; text: string };

export type Article = {
  slug: string;
  title: string;
  author: string;
  section: string;
  order: number;
  jalaliDate: string;
  footnotes: Footnote[];
  body: string;
  wordCount: number;
  readingTimeMinutes: number;
  image: string | null;
  /** CSS object-position for the image, e.g. "50% 42%" -- overrides the card
   * components' default top-biased crop for images where that would cut off
   * something essential (a book cover's title text, for example). */
  imagePosition: string | null;
  /** Meaningful alt text override. Card thumbnails default to alt="" (the
   * card's own title text already describes the link), but some images --
   * e.g. a book cover that IS the subject of the article -- need real
   * alt text of their own. */
  imageAlt: string | null;
  tags: string[];
};

export type SpecialIssueSection = {
  key: string;
  title: string;
  description: string;
  articleSlugs: string[];
  /** Optional lead image for the section itself (not tied to a single
   * article) -- shown beside the section's title/description on the
   * homepage and the ویژه‌نامه page. */
  image?: string | null;
  imagePosition?: string | null;
  imageAlt?: string | null;
  /** "grid" (default) is the standard hairline ArticleGrid. "wide-row"
   * renders the section's articles as full-width WideRow entries instead
   * -- e.g. a single-piece section meant to read as one editorial row
   * rather than a grid cell. */
  layout?: "grid" | "wide-row";
};

export type SpecialIssue = {
  slug: string;
  title: string;
  subtitle: string;
  credit: string;
  sections: SpecialIssueSection[];
};

export type SpecialIssueSectionResolved = Omit<SpecialIssueSection, "articleSlugs"> & {
  articles: Article[];
};

export type SpecialIssueResolved = Omit<SpecialIssue, "sections"> & {
  sections: SpecialIssueSectionResolved[];
};

function normalizeDate(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") return String(value);
  return "";
}

function countWords(html: string): number {
  const plain = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!plain) return 0;
  return plain.split(" ").length;
}

/**
 * The real opening text of an article, verbatim. Accumulates whole
 * paragraphs until at least `minWords` are reached (so a short opening line,
 * e.g. a line of dialogue, pulls in the next paragraph rather than reading
 * as a stub). If that still runs past `maxWords` -- some opening paragraphs
 * in the source run 300+ words -- it's cut at the nearest real sentence
 * boundary at or before the cap; text is never altered, only cut and
 * (when the cut wasn't already a sentence end) marked with an ellipsis.
 */
export function longExcerptOf(article: Pick<Article, "body">, minWords = 140, maxWords = 220): string {
  const cleanBody = article.body
    .replace(/<figure[\s\S]*?<\/figure>/g, "")
    .replace(/<div class="telegram-placeholder">[\s\S]*?<\/div>/g, "");
  const paragraphs = [...cleanBody.matchAll(/<p>([\s\S]*?)<\/p>/g)]
    .map((m) => m[1].replace(/<[^>]+>/g, "").replace(/\\-/g, "-").trim())
    .filter(Boolean);

  let text = "";
  let words: string[] = [];
  for (const p of paragraphs) {
    text = text ? `${text} ${p}` : p;
    words = text.split(/\s+/).filter(Boolean);
    if (words.length >= minWords) break;
  }

  if (words.length <= maxWords) return text;

  const capped = words.slice(0, maxWords).join(" ");
  const sentenceEnd = Math.max(
    capped.lastIndexOf("."),
    capped.lastIndexOf("؟"),
    capped.lastIndexOf("!"),
    capped.lastIndexOf("۔")
  );
  if (sentenceEnd > capped.length * 0.4) {
    return capped.slice(0, sentenceEnd + 1);
  }
  return capped.trim() + "…";
}

function articleFromFile(slug: string, fullPath: string): Article {
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const body = marked.parse(content) as string;
  const wordCount = countWords(body);
  return {
    slug,
    title: data.title ?? "",
    author: data.author ?? "",
    section: data.section ?? "",
    order: typeof data.order === "number" ? data.order : 0,
    jalaliDate: normalizeDate(data.jalaliDate),
    footnotes: Array.isArray(data.footnotes) ? data.footnotes : [],
    body,
    wordCount,
    readingTimeMinutes: Math.max(1, Math.round(wordCount / 200)),
    image: typeof data.image === "string" ? data.image : null,
    imagePosition: typeof data.imagePosition === "string" ? data.imagePosition : null,
    imageAlt: typeof data.imageAlt === "string" ? data.imageAlt : null,
    tags: Array.isArray(data.tags) ? data.tags : [],
  };
}

export function getAllArticles(): Article[] {
  const directory = path.join(contentDir, "articles");
  const files = fs.readdirSync(directory).filter((file) => file.endsWith(".md"));

  return files
    .map((file) => articleFromFile(file.replace(/\.md$/, ""), path.join(directory, file)))
    .sort((a, b) => a.order - b.order);
}

export function getArticleBySlug(slug: string): Article | null {
  const fullPath = path.join(contentDir, "articles", `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  return articleFromFile(slug, fullPath);
}

export function getBooks() {
  const file = fs.readFileSync(path.join(contentDir, "books.json"), "utf8");
  return JSON.parse(file);
}

export type BookRecommendation = {
  title: string;
  author: string;
  translator: string;
  country: string;
  genre: string;
  note: string;
  section: string;
  editorialNote: string;
};

/**
 * The real, extracted راهنمای انتخاب رمان catalog -- distinct from the
 * fabricated getBooks()/books.json, which this doesn't touch. Country/genre
 * are exactly what's in the source PDF (genre is really "shape of work" --
 * رمان/داستان/مجموعه داستان -- not a Western genre system; see the UI's
 * "شکل اثر" label instead of "ژانر").
 */
export function getBookRecommendations(): BookRecommendation[] {
  const file = fs.readFileSync(path.join(process.cwd(), "data", "book-recommendations.json"), "utf8");
  return JSON.parse(file);
}

export function getArticlesByTag(tag: string): Article[] {
  return getAllArticles().filter((article) => article.tags.includes(tag));
}

export type PodcastEpisode = { title: string; description: string; url: string; date: string };
export type MultimediaItem = { title: string; description: string; url: string; date: string };

export function getPodcastEpisodes(): PodcastEpisode[] {
  const file = fs.readFileSync(path.join(contentDir, "podcast.json"), "utf8");
  return JSON.parse(file);
}

export function getMultimediaItems(): MultimediaItem[] {
  const file = fs.readFileSync(path.join(contentDir, "multimedia.json"), "utf8");
  return JSON.parse(file);
}

export function getForms() {
  const file = fs.readFileSync(path.join(contentDir, "forms.json"), "utf8");
  return JSON.parse(file);
}

export function getSpecialIssues(): SpecialIssue[] {
  const file = fs.readFileSync(path.join(contentDir, "special-issues.json"), "utf8");
  return JSON.parse(file);
}

export function getSpecialIssue(slug: string): SpecialIssueResolved | null {
  const issue = getSpecialIssues().find((item) => item.slug === slug);
  if (!issue) return null;

  const articlesBySlug = new Map(getAllArticles().map((article) => [article.slug, article]));

  return {
    ...issue,
    sections: issue.sections.map((section) => ({
      key: section.key,
      title: section.title,
      description: section.description,
      image: section.image ?? null,
      imagePosition: section.imagePosition ?? null,
      imageAlt: section.imageAlt ?? null,
      layout: section.layout,
      articles: section.articleSlugs
        .map((slug) => articlesBySlug.get(slug))
        .filter((article): article is Article => Boolean(article)),
    })),
  };
}
