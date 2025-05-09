import json
import os

from PIL import Image

with open("tessellates/app/digital/release_source.json") as f:
    release_data = json.load(f)

for release in release_data:
    id_string = release["id"]
    image_source_path = release["image_path"]
    image_target_path = f"tessellates/app/digital/images/{id_string}.jpg"
    if not os.path.isfile(image_target_path):
        print("copying: ", id_string, image_source_path)

        im = Image.open(image_source_path)
        master_size = (900, 900)
        im.thumbnail(master_size)
        rgb_im = im.convert("RGB")
        rgb_im.save(image_target_path)
    else:
        print("file already copied: ", id_string, image_source_path)
