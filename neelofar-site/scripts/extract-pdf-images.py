"""
Extracts every real image (>=200x200px) from madaran-wa-dokhtaran.pdf at
original embedded quality, maps each to its article by PDF page number
(using the PDF's own table of contents), and rewrites each article's
frontmatter + body to place the images at proportional positions in the
text. This fully replaces the earlier docx-sourced images (which numbered
only 13 vs. this PDF's 24) as the site's image source, per the PDF being
the source of truth for images and order.
"""
import json
import re
from pathlib import Path

import fitz

PDF_PATH = Path(r"e:\Web\WLP website\madaran-wa-dokhtaran.pdf")
SITE_DIR = Path(r"e:\Web\WLP website\neelofar-site")
ARTICLES_DIR = SITE_DIR / "content" / "articles"
IMAGES_DIR = SITE_DIR / "public" / "images" / "madaran"
LOG_PATH = Path(__file__).resolve().parent / "pdf-image-log.txt"

MIN_SIZE = 200

# (slug, title, start_page, end_page) -- end_page inclusive, derived directly
# from the PDF's own "فهرست مطالب" (table of contents) on page 3, matching
# the already-established article order and slugs used across the site.
ARTICLE_PAGE_RANGES = [
    ("سرسخن", 3, 5),
    ("هشت-گفتگو", 6, 9),
    ("سرگردانیهای-او-روزا", 10, 14),
    ("قاب-عکسی-از-سالهال-دور", 15, 21),
    ("تا-رسم-نابجا-را-بجا-کنیم", 22, 25),
    ("زندگی-در-جنگ-و-زندگی-در-فرار-از-جنگ", 26, 30),
    ("خرمن-دشت-از-ما-گذشت", 31, 35),
    ("لباس-پسرانه-میپوشیدم-و-عین-پسرها-رفتار-میکردم", 36, 40),
    ("بچیم-زن-زود-پیر-میشه", 41, 46),
    ("از-نسلی-به-نسل-دیگر-و-از-جنگی-به-جنگ", 47, 52),
    ("الکسیویچخوانی-در-مزار", 53, 55),
    ("آیا-آصف-سلطانزاده-الکسیویچ-افغانستان-است", 56, 61),
    ("افغانستان-بدون-الکسیویچ-و-ضرورت-ادبیات-مستند", 62, 64),
    ("شاهکار-یا-دروغپردازی-گزارشی-درباب-حواشی-تاکتیکها-و", 65, 78),
    ("یادداشتهایی-از-بامیان-و-مزار-شریف-درباره-کتاب-جنگ-چهرهی", 79, 83),
    ("لندی-مویه-زنان-پشتون-است", 84, 93),
    ("قصهی-مریم-و-همباغش", 94, 116),
    ("بیستو-پنجسال-در-خدمت-صداهای-جنوب-جهانی", 117, 999),
]

TITLE_BY_SLUG = {
    "سرسخن": "سرسخن",
    "هشت-گفتگو": "هشت گفتگو: هزار زندگی",
    "سرگردانیهای-او-روزا": "«سرگردانی‌های او روزا»",
    "قاب-عکسی-از-سالهال-دور": "قاب عکسی از سال‌هال دور",
    "تا-رسم-نابجا-را-بجا-کنیم": "«تا رسم نابجا را بجا کنیم»",
    "زندگی-در-جنگ-و-زندگی-در-فرار-از-جنگ": "زندگی در جنگ و زندگی در فرار از جنگ",
    "خرمن-دشت-از-ما-گذشت": "«خرمن دشت از ما گذشت»",
    "لباس-پسرانه-میپوشیدم-و-عین-پسرها-رفتار-میکردم": "«لباس پسرانه می‌پوشیدم و عین پسرها رفتار می‌کردم»",
    "بچیم-زن-زود-پیر-میشه": "«بچیم زن زود پیر میشه»",
    "از-نسلی-به-نسل-دیگر-و-از-جنگی-به-جنگ": "از نسلی به نسل دیگر و از جنگی به جنگ",
    "الکسیویچخوانی-در-مزار": "الکسیویچ‌خوانی در مزار",
    "آیا-آصف-سلطانزاده-الکسیویچ-افغانستان-است": "آیا آصف سلطان‌زاده الکسیویچ افغانستان است؟",
    "افغانستان-بدون-الکسیویچ-و-ضرورت-ادبیات-مستند": "افغانستان بدون الکسیویچ و ضرورت «ادبیات مستند»",
    "شاهکار-یا-دروغپردازی-گزارشی-درباب-حواشی-تاکتیکها-و": "شاه‌کار یا دروغ‌پردازی؟",
    "یادداشتهایی-از-بامیان-و-مزار-شریف-درباره-کتاب-جنگ-چهرهی": "یادداشت‌هایی از بامیان و مزار شریف",
    "لندی-مویه-زنان-پشتون-است": "لندی، مویه زنان پشتون است",
    "قصهی-مریم-و-همباغش": "قصه‌ی مریم و هم‌باغش",
    "بیستو-پنجسال-در-خدمت-صداهای-جنوب-جهانی": "گفتگو با «یوتا هِمِل‌غایش»",
}


def article_for_page(page_num):
    for slug, start, end in ARTICLE_PAGE_RANGES:
        if start <= page_num <= end:
            return slug, start, end
    return None, None, None


def main():
    doc = fitz.open(PDF_PATH)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    for old in IMAGES_DIR.glob("*"):
        old.unlink()

    log = []
    seen_xrefs = set()
    # slug -> list of (page_num, filename, ext)
    images_by_slug = {}
    unassigned = []

    for pno in range(doc.page_count):
        page = doc[pno]
        page_num = pno + 1
        for img_idx, img in enumerate(page.get_images(full=True), start=1):
            xref = img[0]
            if xref in seen_xrefs:
                continue
            try:
                base = doc.extract_image(xref)
            except Exception:
                continue
            w, h = base.get("width", 0), base.get("height", 0)
            if w < MIN_SIZE or h < MIN_SIZE:
                continue
            seen_xrefs.add(xref)
            ext = base.get("ext", "png")
            slug, start, end = article_for_page(page_num)
            if slug is None:
                unassigned.append((page_num, w, h))
                continue
            n = len(images_by_slug.get(slug, [])) + 1
            filename = f"page-{page_num:03d}-img-{n}.{ext}"
            (IMAGES_DIR / filename).write_bytes(base["image"])
            images_by_slug.setdefault(slug, []).append(
                {"page": page_num, "filename": filename, "ext": ext, "w": w, "h": h}
            )
            log.append(f"page {page_num}: -> {slug} :: {filename} ({w}x{h})")

    for page_num, w, h in unassigned:
        log.append(f"page {page_num}: UNASSIGNED (front matter, {w}x{h}) - not placed in any article")

    # --- rewrite each article's markdown: strip old <figure> blocks, insert
    # new ones at proportional positions, set cover image ---
    rewritten = []
    for slug, start, end in ARTICLE_PAGE_RANGES:
        md_path = ARTICLES_DIR / f"{slug}.md"
        if not md_path.exists():
            log.append(f"WARNING: no markdown file for slug {slug}")
            continue

        raw = md_path.read_text(encoding="utf-8")
        fm_match = re.match(r"^---\n(.*?)\n---\n(.*)$", raw, re.DOTALL)
        if not fm_match:
            log.append(f"WARNING: could not parse frontmatter for {slug}")
            continue
        frontmatter_block, body = fm_match.group(1), fm_match.group(2)

        # strip previously-embedded docx-sourced figures and the telegram
        # placeholder (re-appended after, if this is سرسخن)
        has_telegram = '<div class="telegram-placeholder">' in body
        body = re.sub(r"<figure class=\"article-figure\">.*?</figure>", "", body, flags=re.DOTALL)
        body = re.sub(r'<div class="telegram-placeholder">.*?</div>', "", body, flags=re.DOTALL)
        body = re.sub(r"\n{3,}", "\n\n", body).strip()

        imgs = images_by_slug.get(slug, [])
        cover_image = None
        if imgs:
            paragraphs = [p for p in body.split("\n\n") if p.strip()]
            n_paras = max(len(paragraphs), 1)
            span = max(end - start, 1)

            # build (insert_after_paragraph_index -> figure html) then splice
            insertions = {}
            for n, img in enumerate(imgs, start=1):
                web_path = f"/images/madaran/{img['filename']}"
                if cover_image is None:
                    cover_image = web_path
                clean_title = TITLE_BY_SLUG.get(slug, slug).strip("«»")
                alt = f"تصویری از «{clean_title}»"
                fig = (
                    f'<figure class="article-figure"><img src="{web_path}" alt="{alt}" />'
                    f"<figcaption>{alt}</figcaption></figure>"
                )
                rel = (img["page"] - start) / span
                idx = min(int(rel * n_paras), n_paras - 1)
                insertions.setdefault(idx, []).append(fig)

            new_paragraphs = []
            for i, para in enumerate(paragraphs):
                new_paragraphs.append(para)
                for fig in insertions.get(i, []):
                    new_paragraphs.append(fig)
            body = "\n\n".join(new_paragraphs)

        if has_telegram:
            body += (
                '\n\n<div class="telegram-placeholder">'
                '<a href="#" data-telegram-link-pending="true">پیوستن به کانال تلگرام «نیلوفر» ↗</a>'
                "</div>"
            )

        # rewrite the `image:` frontmatter line
        fm_lines = frontmatter_block.split("\n")
        fm_lines = [ln for ln in fm_lines if not ln.startswith("image:")]
        if cover_image:
            # insert right after jalaliDate line for stable placement
            for i, ln in enumerate(fm_lines):
                if ln.startswith("jalaliDate:"):
                    fm_lines.insert(i + 1, f'image: "{cover_image}"')
                    break
            else:
                fm_lines.append(f'image: "{cover_image}"')

        new_raw = "---\n" + "\n".join(fm_lines) + "\n---\n" + body + "\n"
        md_path.write_text(new_raw, encoding="utf-8")
        rewritten.append((slug, len(imgs), cover_image is not None))

    LOG_PATH.write_text("\n".join(log), encoding="utf-8")

    print(f"Extracted {len(seen_xrefs)} unique images (>= {MIN_SIZE}x{MIN_SIZE}) from {doc.page_count} pages")
    print(f"Unassigned (front-matter) images: {len(unassigned)}")
    print(f"Articles updated: {len(rewritten)}")
    print(f"Log written to {LOG_PATH}")


if __name__ == "__main__":
    main()
