import fs from "fs";
import path from "path";
import matter from "gray-matter";

const dir = path.join(process.cwd(), "content", "articles");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

let withCover = 0;
let withoutCover = 0;
let totalInlineFigures = 0;

const rows = [];
for (const file of files) {
  const raw = fs.readFileSync(path.join(dir, file), "utf8");
  const { data, content } = matter(raw);
  const figCount = (content.match(/<figure class="article-figure">/g) ?? []).length;
  totalInlineFigures += figCount;
  rows.push({ order: data.order, title: data.title, hasCover: Boolean(data.image), figCount });
  if (data.image) withCover++;
  else withoutCover++;
}

rows.sort((a, b) => a.order - b.order);
for (const r of rows) {
  console.log(`${r.order}. ${r.hasCover ? "COVER" : "no-cover"} figs=${r.figCount}  ${r.title}`);
}

console.log("\ntotal articles:", files.length);
console.log("with cover image:", withCover);
console.log("without cover image:", withoutCover);
console.log("total inline figures across all articles:", totalInlineFigures);
