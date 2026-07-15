import fitz
import re

path = r"e:\Web\WLP website\madaran-wa-dokhtaran.pdf"
doc = fitz.open(path)
out = open(r"C:\Users\DELL\AppData\Local\Temp\claude\e--Web-WLP-website\1cd0673d-e43b-4e73-b486-1cd33e221790\scratchpad\pdf_fixed.txt", "w", encoding="utf-8")
def p(*a): print(*a, file=out)


def extract_page_lines(page, y_tol=3.0):
    """Reconstruct reading-order lines purely by Y-position clustering
    (ignoring PyMuPDF's own block/line indices, which don't reliably group
    an embedded Latin/number run into the same line as its surrounding
    Persian words in this PDF). Within each Y-band, sort by X descending
    (RTL primary direction)."""
    words = page.get_text("words")  # (x0,y0,x1,y1,text,block,line,word_no)
    items = [(w[0], (w[1] + w[3]) / 2, w[4]) for w in words]  # (x0, y_center, text)
    items.sort(key=lambda t: t[1])  # top to bottom first

    lines = []
    current = []
    current_y = None
    for x0, yc, text in items:
        if current_y is None or abs(yc - current_y) <= y_tol:
            current.append((x0, text))
            current_y = yc if current_y is None else current_y
        else:
            lines.append(current)
            current = [(x0, text)]
            current_y = yc
    if current:
        lines.append(current)

    out_lines = []
    for line in lines:
        ordered = sorted(line, key=lambda t: -t[0])  # x descending = RTL order
        out_lines.append(" ".join(t[1] for t in ordered))
    return out_lines


def fix_known_ligatures(text):
    # ابوالفضل هللا دادی -> ابوالفضل الله‌داد  (character-order-corrupted Allah ligature)
    text = text.replace("هللا", "الله")
    return text


page = doc[66]
lines = extract_page_lines(page)
p("=== reconstructed via Y-cluster + X-descending sort ===\n")
full_text = "\n".join(lines)
full_text = fix_known_ligatures(full_text)
p(full_text)
