import fitz

path = r"e:\Web\WLP website\madaran-wa-dokhtaran.pdf"
doc = fitz.open(path)
out = open(r"C:\Users\DELL\AppData\Local\Temp\claude\e--Web-WLP-website\1cd0673d-e43b-4e73-b486-1cd33e221790\scratchpad\pdf_diagnose2.txt", "w", encoding="utf-8")
def p(*a): print(*a, file=out)

page = doc[66]
d = page.get_text("rawdict")

# find the first "[ [[ " span's bbox, then dump every span on the page sorted by
# reading order (top-to-bottom, then right-to-left) to see full context around it
def span_text(span):
    return "".join(ch["c"] for ch in span.get("chars", []))

target_bbox = None
for block in d["blocks"]:
    if "lines" not in block:
        continue
    for line in block["lines"]:
        for span in line["spans"]:
            if span_text(span).strip() == "[ [[":
                target_bbox = span["bbox"]
                break

p("target bbox:", target_bbox)

# dump every char in that line with its unicode codepoint, in stream order
for block in d["blocks"]:
    if "lines" not in block:
        continue
    for line in block["lines"]:
        for span in line["spans"]:
            if target_bbox and abs(span["bbox"][1] - target_bbox[1]) < 3:
                chars = span.get("chars", [])
                p(f"span text={span_text(span)!r} font={span['font']} size={span['size']:.1f} bbox={span['bbox']}")
                for ch in chars:
                    p(f"   char={ch['c']!r} codepoint={hex(ord(ch['c']))} bbox={ch['bbox']}")

p("\n=== full page 'text' preserving spaces, page.get_text('rawtext') if available ===")
try:
    p(page.get_text("rawtext"))
except Exception as e:
    p("rawtext not supported:", e)
