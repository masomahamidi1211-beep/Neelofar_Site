"""
Extracts the "مادران و دختران" special issue from the clean, tracked-changes-free
مادران و دختران.docx into content/articles/*.md + content/special-issues.json.

Uses python-docx for paragraph/run walking (safe here because the source docx has
zero <w:ins>/<w:del> tracked-changes markup -- verified separately), plus raw XML
access for footnotes.xml, which python-docx doesn't expose directly.

Images are placed INLINE at their original position in the article, using the
document's own 'Caption'-styled paragraphs where present (verified against the
docx: 5 explicit Caption-styled paragraphs), with a short-text fallback for the
few images whose caption sits in the same paragraph as the image itself.
"""
import json
import re
import zipfile
from pathlib import Path

from docx import Document
from lxml import etree

PROJECT_ROOT = Path(r"e:\Web\WLP website")
SRC = PROJECT_ROOT / "مادران و دختران.docx"
SITE_DIR = PROJECT_ROOT / "neelofar-site"
CONTENT_DIR = SITE_DIR / "content"
ARTICLES_DIR = CONTENT_DIR / "articles"
IMAGES_DIR = SITE_DIR / "public" / "images" / "madaran"
LOG_PATH = Path(__file__).resolve().parent / "extract-log.txt"

W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
NSMAP = {"w": W_NS}

PERSIAN_DIGITS = str.maketrans("0123456789", "۰۱۲۳۴۵۶۷۸۹")


def fa_digits(value) -> str:
    return str(value).translate(PERSIAN_DIGITS)


SECTIONS = {
    "sarsokhan": "سرسخن",
    "hasht": "هشت گفتگو: هزار زندگی",
    "alexievich": "پرونده‌ای برای سوتلانا الکسیویچ",
    "tarjomeha": "ترجمه‌ها و گفتگو",
}

# (paragraph_index_of_heading, section_key, is_section_intro_not_article, author_override)
HEADINGS = [
    (4, "sarsokhan", False, "تیم برنامه ادبیات جهان"),
    (20, "hasht", False, None),
    (35, "hasht", False, None),
    (78, "hasht", False, None),
    (124, "hasht", False, None),
    (149, "hasht", False, None),
    (180, "hasht", False, None),
    (211, "hasht", False, None),
    (250, "hasht", False, None),
    (298, "hasht", False, None),
    (349, "alexievich", True, None),
    (353, "alexievich", False, None),
    (365, "alexievich", False, None),
    (383, "alexievich", False, None),
    (394, "alexievich", False, None),
    (476, "alexievich", False, "اشتراک‌کنندگان برنامه ادبیات جهان"),
    (503, "tarjomeha", False, None),
    (562, "tarjomeha", False, None),
    (700, "tarjomeha", False, "یوتا هِمِل‌غایش"),
]

JALALI_DATE = "1404-05-01"


def slugify(text: str) -> str:
    text = text.strip()
    # long titles use "Lead؛ Subtitle" -- keep just the lead clause for a sane URL
    text = re.split(r"[؛:]", text, maxsplit=1)[0]
    text = text.replace("«", "").replace("»", "")
    text = text.replace("‌", "")
    text = re.sub(r"[؟،\"'!]", "", text)
    text = re.sub(r"\s+", "-", text.strip())
    if len(text) > 60:
        text = text[:60].rsplit("-", 1)[0]
    return text


def wrap_emphasis(text: str, bold: bool, italic: bool) -> str:
    if not text or not (bold or italic):
        return text
    leading = re.match(r"^\s*", text).group()
    trailing = re.search(r"\s*$", text).group()
    core = text[len(leading): len(text) - len(trailing)] if trailing else text[len(leading):]
    if not core:
        return text
    marker = "***" if bold and italic else ("**" if bold else "*")
    return f"{leading}{marker}{core}{marker}{trailing}"


def normalize_zwnj(text: str) -> str:
    # Genuine نیم‌فاصله (ZWNJ) is meaningful and must be kept, but a doubled ZWNJ or a
    # ZWNJ sitting directly next to whitespace is a broken invisible-character artifact
    # in the source, not real typography -- collapsing it is a technical fix, not a wording change.
    text = re.sub(r"‌{2,}", "‌", text)
    text = re.sub(r"\s+‌", " ", text)
    text = re.sub(r"‌\s+", " ", text)
    return text


def escape_markdown_leading(text: str) -> str:
    # Dialogue paragraphs often start with a literal "-" (an em/en dash quote marker in
    # the source), which markdown would otherwise render as a bullet list item.
    if re.match(r"^[-*+]\s", text) or re.match(r"^#{1,6}\s", text) or re.match(r"^\d+\.\s", text) or text.startswith(">"):
        return "\\" + text
    return text


def load_footnotes(zf: zipfile.ZipFile):
    fn_xml = zf.read("word/footnotes.xml")
    root = etree.fromstring(fn_xml)
    notes = {}
    for note in root.findall(".//w:footnote", NSMAP):
        fid = note.get(f"{{{W_NS}}}id")
        if fid in ("-1", "0"):
            continue
        texts = note.findall(".//w:t", NSMAP)
        joined = normalize_zwnj("".join(t.text or "" for t in texts).strip())
        notes[fid] = joined
    return notes


def paragraph_has_drawing(paragraph):
    return paragraph._p.find(f".//{{{W_NS}}}drawing") is not None


def extract_image_from_paragraph(paragraph, doc):
    """Returns (rId, blob, content_type) for the first raster image found, or None."""
    drawing_els = paragraph._p.findall(f".//{{{W_NS}}}drawing")
    for drawing in drawing_els:
        blips = drawing.findall(
            ".//{http://schemas.openxmlformats.org/drawingml/2006/main}blip"
        )
        for blip in blips:
            rid = blip.get(
                "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed"
            )
            if not rid:
                continue
            try:
                part = doc.part.related_parts[rid]
            except KeyError:
                continue
            return rid, part.blob, part.content_type
    return None


def find_caption_for_image(paragraphs, image_index, consumed):
    """Locate the caption for an image, preferring the document's own 'Caption'
    paragraph style (verified: 5 such paragraphs exist), with a short-text
    fallback for images whose caption is typed directly into their own paragraph."""
    for offset in (1, 2, 0, -1):
        j = image_index + offset
        if 0 <= j < len(paragraphs) and j not in consumed:
            if paragraphs[j].style.name == "Caption":
                text = normalize_zwnj(paragraphs[j].text.strip())
                if text:
                    return text, j
    own_text = normalize_zwnj(paragraphs[image_index].text.strip())
    if own_text and len(own_text.split()) <= 12:
        return own_text, image_index
    return None, None


FN_SENTINEL = "\x00FN{fid}\x00"
FN_SENTINEL_RE = re.compile(r"\x00FN(\d+)\x00")
FIGURE_SENTINEL = "\x00FIGURE:{n}\x00"
FIGURE_SENTINEL_RE = re.compile(r"\x00FIGURE:(\d+)\x00")


def paragraph_body_text(paragraph):
    parts = []
    for run in paragraph.runs:
        fn_ref = run._element.find(f"{{{W_NS}}}footnoteReference")
        if fn_ref is not None:
            fid = fn_ref.get(f"{{{W_NS}}}id")
            # doc-global footnote id -- resolved to a per-article sequential number
            # later, once we know every footnote's first-appearance order in THIS article
            parts.append(FN_SENTINEL.format(fid=fid))
            continue
        text = (run.text or "").replace("\xa0", " ")
        if not text:
            continue
        parts.append(wrap_emphasis(text, bool(run.bold), bool(run.italic)))
    return "".join(parts).strip()


def build_article(doc, paragraphs, start, end, section_key, is_intro, author_override,
                   footnotes_map, image_caption_map, consumed, log):
    heading_para = paragraphs[start]
    title = normalize_zwnj(re.sub(r"^[\s‌]+", "", heading_para.text).strip())

    body_start = start + 1
    author = author_override
    if author is None:
        for i in range(body_start, min(body_start + 3, end)):
            t = paragraphs[i].text.strip()
            if t:
                author = t
                body_start = i + 1
                break

    used_footnote_ids = []
    images_in_order = []
    body_lines = []
    skip_qr = section_key == "sarsokhan"

    for i in range(body_start, end):
        para = paragraphs[i]
        is_image_anchor = i in image_caption_map

        if is_image_anchor and not skip_qr:
            img = extract_image_from_paragraph(para, doc)
            if img:
                rid, blob, content_type = img
                ext = "png" if "png" in content_type else ("jpg" if "jpe" in content_type else "gif")
                caption = image_caption_map[i] or ""
                images_in_order.append({"blob": blob, "ext": ext, "caption": caption})
                body_lines.append(FIGURE_SENTINEL.format(n=len(images_in_order) - 1))

        if i in consumed:
            # this whole paragraph's text is a caption already attached to a figure above
            continue

        text = normalize_zwnj(paragraph_body_text(para))
        if not text:
            continue

        for m in FN_SENTINEL_RE.finditer(text):
            used_footnote_ids.append(m.group(1))

        text = escape_markdown_leading(text)
        body_lines.append(text)

    body = "\n\n".join(body_lines)
    body = re.sub(r"[ \t]{2,}", " ", body)  # collapse doubled spaces (technical artifact)

    seen_order = []
    for fid in used_footnote_ids:
        if fid not in seen_order:
            seen_order.append(fid)
    display_number = {fid: i + 1 for i, fid in enumerate(seen_order)}

    def substitute(match):
        fid = match.group(1)
        n = display_number[fid]
        return f'<sup class="fn-ref"><a id="fnref-{n}" href="#fn-{n}">{fa_digits(n)}</a></sup>'

    body = FN_SENTINEL_RE.sub(substitute, body)

    footnotes = [
        {"id": str(display_number[fid]), "text": footnotes_map.get(fid, "")}
        for fid in seen_order
    ]

    log.append(
        f"{title} | author={author} | section={SECTIONS[section_key]} | "
        f"paras={end - start} | footnotes={len(footnotes)} | images={len(images_in_order)}"
    )

    return {
        "title": title,
        "author": author or "",
        "section": section_key,
        "is_intro": is_intro,
        "footnotes": footnotes,
        "images": images_in_order,
        "body": body,
    }


def main():
    doc = Document(SRC)
    paragraphs = doc.paragraphs
    total = len(paragraphs)

    with zipfile.ZipFile(SRC) as zf:
        footnotes_map = load_footnotes(zf)

    # Global scan: locate every image and its best-matching caption once, up front,
    # so consumed caption paragraphs aren't double-claimed across article boundaries.
    consumed = set()
    image_caption_map = {}
    for i, para in enumerate(paragraphs):
        if paragraph_has_drawing(para):
            caption_text, caption_idx = find_caption_for_image(paragraphs, i, consumed)
            if caption_idx is not None:
                consumed.add(caption_idx)
            image_caption_map[i] = caption_text

    ARTICLES_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    for old in IMAGES_DIR.glob("*"):
        old.unlink()

    boundaries = [h[0] for h in HEADINGS] + [total]
    log = []
    articles = []

    for idx, (start, section_key, is_intro, author_override) in enumerate(HEADINGS):
        end = boundaries[idx + 1]
        article = build_article(
            doc, paragraphs, start, end, section_key, is_intro, author_override,
            footnotes_map, image_caption_map, consumed, log,
        )
        articles.append(article)

    order = 0
    section_order = {"sarsokhan": [], "hasht": [], "alexievich": [], "tarjomeha": []}
    section_intro_body = {}
    written = []

    for article in articles:
        if article["is_intro"]:
            section_intro_body[article["section"]] = re.sub(r"\s+", " ", article["body"]).strip()
            continue
        order += 1
        slug = slugify(article["title"])
        section_order[article["section"]].append(slug)

        cover_image = None
        body = article["body"]

        def substitute_figure(match, slug=slug, images=article["images"]):
            nonlocal cover_image
            n = int(match.group(1))
            img = images[n]
            filename = f"{slug}-{n + 1}.{img['ext']}"
            (IMAGES_DIR / filename).write_bytes(img["blob"])
            web_path = f"/images/madaran/{filename}"
            if cover_image is None:
                cover_image = web_path
            caption = img["caption"] or f"تصویری از «{article['title']}»"
            alt = caption.replace('"', "'")
            fig = f'<figure class="article-figure"><img src="{web_path}" alt="{alt}" />'
            fig += f"<figcaption>{caption}</figcaption>"
            fig += "</figure>"
            return fig

        body = FIGURE_SENTINEL_RE.sub(substitute_figure, body)

        if article["section"] == "sarsokhan":
            body += (
                '\n\n<div class="telegram-placeholder">'
                '<a href="#" data-telegram-link-pending="true">پیوستن به کانال تلگرام «نیلوفر» ↗</a>'
                "</div>"
            )

        yaml_lines = [
            "---",
            f'title: {json.dumps(article["title"], ensure_ascii=False)}',
            f'author: {json.dumps(article["author"], ensure_ascii=False)}',
            f'section: {article["section"]}',
            f"order: {order}",
            f'jalaliDate: "{JALALI_DATE}"',
        ]
        if cover_image:
            yaml_lines.append(f'image: "{cover_image}"')
        yaml_lines.append("footnotes:")
        if article["footnotes"]:
            for fn in article["footnotes"]:
                yaml_lines.append(f'  - id: "{fn["id"]}"')
                yaml_lines.append(f'    text: {json.dumps(fn["text"], ensure_ascii=False)}')
        else:
            yaml_lines[-1] = "footnotes: []"
        yaml_lines.append("---")
        yaml_lines.append("")
        yaml_lines.append(body)

        (ARTICLES_DIR / f"{slug}.md").write_text("\n".join(yaml_lines), encoding="utf-8")
        written.append((slug, article["title"], article["author"], article["section"], order, len(article["images"])))

    def plain(text: str) -> str:
        text = re.sub(r"<[^>]+>", "", text)
        text = re.sub(r"\\?\*{1,3}", "", text)
        return text.strip()

    section_meta = [
        {"key": "sarsokhan", "title": SECTIONS["sarsokhan"], "description": ""},
        {"key": "hasht", "title": SECTIONS["hasht"], "description": ""},
        {
            "key": "alexievich",
            "title": SECTIONS["alexievich"],
            "description": plain(section_intro_body.get("alexievich", "")),
        },
        {"key": "tarjomeha", "title": SECTIONS["tarjomeha"], "description": ""},
    ]
    for sm in section_meta:
        sm["articleSlugs"] = section_order[sm["key"]]

    issue = [
        {
            "slug": "مادران-و-دختران",
            "title": "مادران و دختران: زندگی در جنگ و زندگی در فرار از جنگ",
            "subtitle": "زندگی در جنگ و زندگی در فرار از جنگ",
            "credit": "کاری از برنامه ادبیات جهان",
            "sections": section_meta,
        }
    ]
    (CONTENT_DIR / "special-issues.json").write_text(
        json.dumps(issue, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    LOG_PATH.write_text("\n".join(log), encoding="utf-8")
    print(f"Wrote {len(written)} articles.")
    total_images = sum(w[5] for w in written)
    print(f"Total images placed: {total_images}")
    print(f"Log: {LOG_PATH}")


if __name__ == "__main__":
    main()
