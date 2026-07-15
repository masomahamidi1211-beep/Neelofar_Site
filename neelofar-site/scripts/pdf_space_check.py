import fitz

path = r"e:\Web\WLP website\madaran-wa-dokhtaran.pdf"
doc = fitz.open(path)
out = open(r"C:\Users\DELL\AppData\Local\Temp\claude\e--Web-WLP-website\1cd0673d-e43b-4e73-b486-1cd33e221790\scratchpad\space_check.txt", "w", encoding="utf-8")
def p(*a): print(*a, file=out)

page = doc[66]
d = page.get_text("rawdict")
widths = []
for block in d["blocks"]:
    if "lines" not in block:
        continue
    for line in block["lines"]:
        for span in line["spans"]:
            for ch in span.get("chars", []):
                if ch["c"] == " ":
                    w = ch["bbox"][2] - ch["bbox"][0]
                    widths.append(w)

widths.sort()
p("total spaces:", len(widths))
p("min:", widths[0] if widths else None)
p("max:", widths[-1] if widths else None)
p("distribution (rounded to 1 decimal):")
from collections import Counter
c = Counter(round(w, 1) for w in widths)
for w, count in sorted(c.items()):
    p(f"  width={w} count={count}")
