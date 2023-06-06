import argparse
import json
import os
import sys
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


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("collection_type")
    args = parser.parse_args()
    collection_type = args.collection_type.strip().lower()
    if collection_type not in ["vinyl", "digital"]:
        print("collection type must be one of vinyl or digital")
        sys.exit()

    release_source_path = f"tessellates/app/{collection_type}/release_source.json"
    image_dir = f"tessellates/app/{collection_type}/images"

    with open(release_source_path, "r") as f:
        releases = json.load(f)

    for release in releases:
        record_id = release["id"]
        filename = f"{record_id}-small.jpg"
        infile = os.path.join(image_dir, filename)
        with Image.open(infile) as img:
            img.thumbnail((100, 100))
            palette_size = 4
            paletted = img.convert(
                "P", palette=Image.Palette.ADAPTIVE, colors=palette_size
            )
            palette = paletted.getpalette()
            color_counts = sorted(paletted.getcolors(), reverse=True)
            color_1 = get_color_code(color_counts, palette, 0)
            color_2 = get_color_code(color_counts, palette, 1)
            release["colors"] = [color_1, color_2]

    with open(release_source_path, "w") as f:
        json.dump(releases, f)
