import fitz

path = r"e:\Web\WLP website\madaran-wa-dokhtaran.pdf"
doc = fitz.open(path)

out = open(r"C:\Users\DELL\AppData\Local\Temp\claude\e--Web-WLP-website\1cd0673d-e43b-4e73-b486-1cd33e221790\scratchpad\pdf_diagnose.txt", "w", encoding="utf-8")
def p(*a): print(*a, file=out)

mid = 66
page = doc[mid]

p("=== get_text('text', sort=True) ===")
p(page.get_text("text", sort=True))

p("\n=== raw dict spans (font info) for a footnote-marker area ===")
d = page.get_text("dict")
for block in d["blocks"]:
    if "lines" not in block:
        continue
    for line in block["lines"]:
        for span in line["spans"]:
            if "[" in span["text"] or span.get("flags", 0) & 1:  # superscript flag bit sometimes
                p(f"font={span['font']!r} size={span['size']:.1f} flags={span['flags']} text={span['text']!r}")

p("\n=== search for 'الله' vs 'هللا' ===")
p("count 'الله':", len(page.search_for("الله")))
p("count 'هللا':", len(page.search_for("هللا")))

p("\n=== raw chars around a footnote bracket, page words with bbox ===")
words = page.get_text("words")
for w in words:
    if "[" in w[4] or "]" in w[4]:
        p(w)
