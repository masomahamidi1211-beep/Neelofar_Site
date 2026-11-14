import { getAllArticles } from "../lib/content-server";
import { htmlToText, type SearchDoc } from "../lib/search";

// Built once at deploy time into a static JSON file. The search modal loads
// it the first time it opens and filters it in the browser as the reader types.
export const dynamic = "force-static";

export function GET() {
  const docs: SearchDoc[] = getAllArticles().map((article) => ({
    slug: article.slug,
    title: article.title,
    author: article.author,
    tags: article.tags ?? [],
    text: htmlToText(article.body),
    image: article.image ?? null,
    imagePosition: article.imagePosition ?? null,
  }));
  return Response.json(docs);
}
