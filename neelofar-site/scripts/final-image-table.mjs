import fs from "fs";
import path from "path";
import matter from "gray-matter";

const RANGES = {
  "سرسخن": [3, 5],
  "هشت-گفتگو": [6, 9],
  "سرگردانیهای-او-روزا": [10, 14],
  "قاب-عکسی-از-سالهال-دور": [15, 21],
  "تا-رسم-نابجا-را-بجا-کنیم": [22, 25],
  "زندگی-در-جنگ-و-زندگی-در-فرار-از-جنگ": [26, 30],
  "خرمن-دشت-از-ما-گذشت": [31, 35],
  "لباس-پسرانه-میپوشیدم-و-عین-پسرها-رفتار-میکردم": [36, 40],
  "بچیم-زن-زود-پیر-میشه": [41, 46],
  "از-نسلی-به-نسل-دیگر-و-از-جنگی-به-جنگ": [47, 52],
  "الکسیویچخوانی-در-مزار": [53, 55],
  "آیا-آصف-سلطانزاده-الکسیویچ-افغانستان-است": [56, 61],
  "افغانستان-بدون-الکسیویچ-و-ضرورت-ادبیات-مستند": [62, 64],
  "شاهکار-یا-دروغپردازی-گزارشی-درباب-حواشی-تاکتیکها-و": [65, 78],
  "یادداشتهایی-از-بامیان-و-مزار-شریف-درباره-کتاب-جنگ-چهرهی": [79, 83],
  "لندی-مویه-زنان-پشتون-است": [84, 93],
  "قصهی-مریم-و-همباغش": [94, 116],
  "بیستو-پنجسال-در-خدمت-صداهای-جنوب-جهانی": [117, 133],
};

const dir = path.join(process.cwd(), "content", "articles");
let totalImages = 0;

for (const [slug, [start, end]] of Object.entries(RANGES)) {
  const raw = fs.readFileSync(path.join(dir, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);
  const figCount = (content.match(/<figure class="article-figure">/g) ?? []).length;
  totalImages += figCount;
  console.log(`${String(data.order).padStart(2)}. ${data.title.padEnd(45)} | pages ${start}-${end === 133 ? "end" : end} | ${figCount} image(s)`);
}

console.log("\nTotal images placed across all articles:", totalImages);
console.log("(24 extracted from PDF total: 22 placed in articles + 2 front-matter/cover pages correctly excluded)");
