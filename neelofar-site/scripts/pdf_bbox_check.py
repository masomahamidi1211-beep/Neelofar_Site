import fitz

path = r"e:\Web\WLP website\madaran-wa-dokhtaran.pdf"
doc = fitz.open(path)
out = open(r"C:\Users\DELL\AppData\Local\Temp\claude\e--Web-WLP-website\1cd0673d-e43b-4e73-b486-1cd33e221790\scratchpad\bbox_check.txt", "w", encoding="utf-8")
def p(*a): print(*a, file=out)

page = doc[66]
words = page.get_text("words")
# the target line is around y ~ 170-190 based on the crop (clip started at y0+60, target text near y0+120 in a 100px window at 4x zoom -> roughly y0+90 to +100 in original coords)
for w in words:
    x0, y0, x1, y1, text, block_no, line_no, word_no = w
    if 140 < y0 < 168:
        p(f"x0={x0:.1f} x1={x1:.1f} y0={y0:.1f} y1={y1:.1f} block={block_no} line={line_no} word={word_no} text={text!r}")
