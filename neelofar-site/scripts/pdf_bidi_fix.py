import fitz
import re

path = r"e:\Web\WLP website\madaran-wa-dokhtaran.pdf"
doc = fitz.open(path)
out = open(r"C:\Users\DELL\AppData\Local\Temp\claude\e--Web-WLP-website\1cd0673d-e43b-4e73-b486-1cd33e221790\scratchpad\pdf_bidi_fixed.txt", "w", encoding="utf-8")
def p(*a): print(*a, file=out)

ZWNJ = "‌"
NARROW_SPACE_MAX = 2.6  # pt; real word-spaces measured ~3.2pt, collapsed ZWNJ ~1.8-2.2pt


def char_class(ch):
    cp = ord(ch)
    if 0x06F0 <= cp <= 0x06F9:
        return "digit"
    if 0x0600 <= cp <= 0x06FF or 0x200c <= cp <= 0x200f or 0xFB50 <= cp <= 0xFEFF:
        return "rtl"
    if ch.isdigit() or (0x30 <= cp <= 0x39):
        return "digit"
    if ch.isalpha():
        return "ltr"
    return "neutral"


def extract_page_lines(page, y_tol=3.0):
    d = page.get_text("rawdict")
    chars = []
    for block in d["blocks"]:
        if "lines" not in block:
            continue
        for line in block["lines"]:
            for span in line["spans"]:
                for ch in span.get("chars", []):
                    c = ch["c"]
                    if not c or c == "\n":
                        continue
                    bbox = ch["bbox"]
                    yc = (bbox[1] + bbox[3]) / 2
                    chars.append((bbox[0], bbox[2], yc, c))

    chars.sort(key=lambda t: t[2])
    lines = []
    current = []
    current_y = None
    for x0, x1, yc, c in chars:
        if current_y is None or abs(yc - current_y) <= y_tol:
            current.append((x0, x1, c))
            current_y = yc if current_y is None else current_y
        else:
            lines.append(current)
            current = [(x0, x1, c)]
            current_y = yc
    if current:
        lines.append(current)

    out_lines = []
    for line_chars in lines:
        line_chars.sort(key=lambda t: t[0])

        runs = []
        cur_run = []
        cur_class = None
        for x0, x1, c in line_chars:
            cls = char_class(c)
            effective = "ltr" if cls in ("digit", "ltr") else ("rtl" if cls == "rtl" else cur_class or "rtl")
            if cur_class is None or effective == cur_class:
                cur_run.append((x0, x1, c))
                cur_class = effective
            else:
                runs.append((cur_class, cur_run))
                cur_run = [(x0, x1, c)]
                cur_class = effective
        if cur_run:
            runs.append((cur_class, cur_run))

        runs.sort(key=lambda r: -max(c[1] for c in r[1]))

        pieces = []
        for cls, run_chars in runs:
            if cls == "ltr":
                run_chars.sort(key=lambda t: t[0])
            else:
                run_chars.sort(key=lambda t: -t[0])
            pieces.append("".join(c for _, _, c in run_chars))
        out_lines.append("".join(pieces))

    return out_lines


def fix_ligatures(text):
    text = re.sub(r"ه\s*ل\s*ل\s*ا", "الله", text)
    return text


page = doc[66]
lines = extract_page_lines(page)
p("=== character-level bidi-aware reconstruction, ZWNJ-by-width + ligature fix ===\n")
p("\n".join(fix_ligatures(line) for line in lines))
