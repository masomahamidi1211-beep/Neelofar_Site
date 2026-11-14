// Shared search logic for the live search modal (client) and the /search
// results page (server), so both always rank and match the same way.
// No server-only imports here -- this file ships to the browser.

export type SearchDoc = {
  slug: string;
  title: string;
  author: string;
  tags: string[];
  /** Plain article text (HTML stripped, entities decoded). */
  text: string;
  image: string | null;
  imagePosition: string | null;
};

export type SearchHit = {
  doc: SearchDoc;
  score: number;
  /** A short piece of the article text around the first match, or its opening. */
  snippet: string;
};

const STOP_WORDS = new Set(["و", "در", "به", "از", "که", "را", "هم", "با", "این", "آن", "یا", "تا"]);

/** Strip HTML tags and decode the entities marked emits. */
export function htmlToText(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fold the many ways the same Persian/Dari word can be typed into one form:
 * Arabic ي/ى/ك → Persian ی/ک, hamza-carrying alefs → ا, ة → ه, and
 * half-spaces (ZWNJ), diacritics and kashida dropped -- so «سلطان‌زاده»,
 * «سلطانزاده» and (as two partial terms) «سلطان زاده» all find each other.
 * Persian and Arabic-Indic digits map to Latin so «۱۴۰۴», «١٤٠٤» and «1404»
 * match too.
 */
export function normalize(input: string): string {
  if (!input) return "";
  return input
    .toLowerCase()
    .replace(/[\u064A\u0649]/g, "\u06CC") // Arabic yeh / alef maksura → Persian yeh
    .replace(/\u0643/g, "\u06A9") // Arabic kaf → Persian kaf
    .replace(/[\u0623\u0625\u0622\u0671]/g, "\u0627") // hamza/madda alefs → alef
    .replace(/[\u0629\u06C0]/g, "\u0647") // teh marbuta, heh with yeh → heh
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "") // harakat, superscript alef, kashida
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0)) // Persian digits
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660)) // Arabic-Indic digits
    .replace(/[\u200C\u200D\u200E\u200F]/g, "") // half-space and direction marks
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Query → normalized terms. Stop words are dropped unless they're all there is. */
export function queryTerms(query: string): string[] {
  const words = normalize(query).split(" ").filter(Boolean);
  const meaningful = words.filter((w) => !STOP_WORDS.has(w));
  return meaningful.length > 0 ? meaningful : words;
}

type Prepared = { doc: SearchDoc; title: string; author: string; tags: string; text: string };

const preparedCache = new WeakMap<SearchDoc[], Prepared[]>();

function prepare(docs: SearchDoc[]): Prepared[] {
  let prepared = preparedCache.get(docs);
  if (!prepared) {
    prepared = docs.map((doc) => ({
      doc,
      title: ` ${normalize(doc.title)} `,
      author: ` ${normalize(doc.author)} `,
      tags: ` ${normalize(doc.tags.join(" "))} `,
      text: ` ${normalize(doc.text)} `,
    }));
    preparedCache.set(docs, prepared);
  }
  return prepared;
}

/** Score one field: whole word > word start > anywhere inside a word. */
function fieldScore(field: string, term: string, weight: number): number {
  if (field.includes(` ${term} `)) return weight * 3;
  if (field.includes(` ${term}`)) return weight * 2;
  // Single letters only count at the start of a word -- otherwise one
  // keystroke would match nearly every article.
  if (term.length > 1 && field.includes(term)) return weight;
  return 0;
}

/** The text around the first matched term, cut on word boundaries. */
function makeSnippet(text: string, terms: string[], length = 160): string {
  const norm = normalize(text);
  let hit = -1;
  for (const term of terms) {
    const i = norm.indexOf(term);
    if (i !== -1 && (hit === -1 || i < hit)) hit = i;
  }
  if (hit === -1) return text.length > length ? `${text.slice(0, length).trim()}…` : text;

  // The normalized string is roughly the same length as the original, so the
  // position is close enough to cut a readable window from the original.
  const ratio = text.length / Math.max(norm.length, 1);
  const center = Math.round(hit * ratio);
  let start = Math.max(0, center - Math.round(length / 3));
  let end = Math.min(text.length, start + length);
  if (start > 0) start = text.indexOf(" ", start) + 1 || start;
  if (end < text.length) end = text.lastIndexOf(" ", end) > start ? text.lastIndexOf(" ", end) : end;
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}

/**
 * Every term has to appear somewhere (title, author, keywords or text), so
 * adding words narrows the results. Partial words match, so «الکسی» finds
 * «الکسیویچ». Title matches rank highest, then keywords, author, body.
 */
export function searchDocs(docs: SearchDoc[], query: string, limit = Infinity): SearchHit[] {
  const terms = queryTerms(query);
  if (terms.length === 0) return [];
  const fullPhrase = normalize(query);

  const hits: SearchHit[] = [];
  for (const p of prepare(docs)) {
    let score = 0;
    let allMatched = true;
    for (const term of terms) {
      // A lone letter only matches word starts in title/author/keywords --
      // in the full text it would match every article.
      const s =
        fieldScore(p.title, term, 12) +
        fieldScore(p.tags, term, 6) +
        fieldScore(p.author, term, 6) +
        (term.length > 1 ? fieldScore(p.text, term, 1) : 0);
      if (s === 0) {
        allMatched = false;
        break;
      }
      score += s;
    }
    if (!allMatched) continue;
    if (terms.length > 1 && p.title.includes(fullPhrase)) score += 40;
    else if (terms.length > 1 && p.text.includes(fullPhrase)) score += 10;
    hits.push({ doc: p.doc, score, snippet: makeSnippet(p.doc.text, terms) });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}
