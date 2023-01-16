import json
import os
from PIL import Image


def get_color_code(color_counts, palette, index):
    try:
        palette_index = color_counts[index][1]
    except IndexError:
        palette_index = color_counts[0][1]

    r, g, b = palette[palette_index * 3 : palette_index * 3 + 3]
    rHex = "%0.2X" % r
    gHex = "%0.2X" % g
    bHex = "%0.2X" % b
    return f"#{rHex}{gHex}{bHex}"


## main from here
with open("app/digital/release_source.json", "r") as f:
    releases = json.load(f)

image_dir = "app/digital/images"
for release in releases:
    record_id = release["id"]
    filename = f"{record_id}-small.jpg"
    infile = os.path.join(image_dir, filename)
    with Image.open(infile) as img:
        img.thumbnail((100, 100))
        palette_size = 4
        paletted = img.convert("P", palette=Image.Palette.ADAPTIVE, colors=palette_size)
        palette = paletted.getpalette()
        color_counts = sorted(paletted.getcolors(), reverse=True)

        print(record_id)
        color_1 = get_color_code(color_counts, palette, 0)
        color_2 = get_color_code(color_counts, palette, 1)
        release["colors"] = [color_1, color_2]

with open("app/digital/release_source.json", "w") as f:
    json.dump(releases, f)
