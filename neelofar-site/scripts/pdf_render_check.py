import fitz

path = r"e:\Web\WLP website\madaran-wa-dokhtaran.pdf"
doc = fitz.open(path)
page = doc[66]
pix = page.get_pixmap(matrix=fitz.Matrix(2.5, 2.5))
pix.save(r"C:\Users\DELL\AppData\Local\Temp\claude\e--Web-WLP-website\1cd0673d-e43b-4e73-b486-1cd33e221790\scratchpad\page67_full.png")

# also crop just the top ~200px (where the "1980s" sentence is) at higher zoom
clip = fitz.Rect(page.rect.x0, page.rect.y0 + 60, page.rect.x1, page.rect.y0 + 160)
pix2 = page.get_pixmap(matrix=fitz.Matrix(4, 4), clip=clip)
pix2.save(r"C:\Users\DELL\AppData\Local\Temp\claude\e--Web-WLP-website\1cd0673d-e43b-4e73-b486-1cd33e221790\scratchpad\page67_top_crop.png")
print("saved")
