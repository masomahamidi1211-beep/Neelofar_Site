import fs from "fs";
import path from "path";
import matter from "gray-matter";

const dir = path.join(process.cwd(), "content", "articles");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

const sectionNames = {
  sarsokhan: "سرسخن",
  hasht: "هشت گفتگو: هزار زندگی",
  alexievich: "پرونده‌ای برای سوتلانا الکسیویچ",
  tarjomeha: "ترجمه‌ها و گفتگو",
};

const rows = files.map((file) => {
  const raw = fs.readFileSync(path.join(dir, file), "utf8");
  const { data, content } = matter(raw);
  const wordCount = content
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ").length;
  return {
    order: data.order,
    title: data.title,
    author: data.author,
    section: sectionNames[data.section] ?? data.section,
    wordCount,
    footnotes: (data.footnotes ?? []).length,
    images: (content.match(/<figure class="article-figure">/g) ?? []).length,
    hasCover: Boolean(data.image),
  };
});

rows.sort((a, b) => a.order - b.order);

console.log("piece title | on site? | complete? | word count | footnotes | inline images | cover image");
for (const r of rows) {
  console.log(
    `${r.order}. ${r.title} | yes | complete | ${r.wordCount} | ${r.footnotes} | ${r.images} | ${r.hasCover ? "yes" : "no"}`
  );
}
console.log(
  "\nTOTAL articles:", rows.length,
  "TOTAL footnotes:", rows.reduce((n, r) => n + r.footnotes, 0),
  "TOTAL inline images:", rows.reduce((n, r) => n + r.images, 0),
  "TOTAL words:", rows.reduce((n, r) => n + r.wordCount, 0)
);
