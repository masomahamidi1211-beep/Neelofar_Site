import variants from "./image-variants.json";

type Entry = { w: number; h: number; v: number[] };
const table = variants as Record<string, Entry>;

/**
 * Extra <img> attributes for a site photo: a srcset of the smaller WebP
 * copies made by scripts/make-image-variants.mjs (so phones download a small
 * file), plus the photo's own width/height (so the browser reserves its
 * space). Unknown images (e.g. uploaded after the last build) get nothing
 * extra and load as before.
 */
export function imgAttrs(src: string | null | undefined, sizes: string) {
  if (!src) return {};
  const e = table[src];
  if (!e) return {};
  const vurl = (w: number) => `/_v${src.replace(/\.(jpe?g|png|webp)$/i, `-${w}.webp`)}`;
  const set = [...e.v.map((w) => `${vurl(w)} ${w}w`), `${src} ${e.w}w`].join(", ");
  return { srcSet: set, sizes, width: e.w, height: e.h };
}

/** The srcset alone, for <link rel="preload" imageSrcSet>. */
export function srcSetOf(src: string): string | undefined {
  return (imgAttrs(src, "") as { srcSet?: string }).srcSet;
}

/**
 * Same for photos inside article text (raw HTML from the markdown): adds
 * srcset/sizes and lazy loading to each <img src="/...">. No width/height
 * here: the .article-figure CSS sizes these, and a height attribute would
 * override it.
 */
export function enhanceBodyImages(html: string): string {
  return html.replace(/<img\b([^>]*?)\ssrc="([^"]+)"([^>]*)>/g, (all, pre: string, src: string, post: string) => {
    const a = imgAttrs(src, "(min-width: 1024px) 700px, 100vw") as Record<string, string | number>;
    if (!a.srcSet) return all.includes("loading=") ? all : all.replace("<img", '<img loading="lazy" decoding="async"');
    const rest = `${pre}${post}`;
    const extra = [
      `srcset="${a.srcSet}"`,
      `sizes="${a.sizes}"`,
      /\bloading=/.test(rest) ? "" : 'loading="lazy" decoding="async"',
    ]
      .filter(Boolean)
      .join(" ");
    return `<img${pre} src="${src}" ${extra}${post}>`;
  });
}
