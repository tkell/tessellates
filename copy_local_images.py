import argparse
import json
import os

from PIL import Image

if __name__ == "__main__":
    arg_parser = argparse.ArgumentParser()
    arg_parser.add_argument(
        "collection_name", type=str, help="The collection to copy images for"
    )
    args = arg_parser.parse_args()
    collection_name = args.collection_name.strip().lower()
    release_path = f"tessellates/app/{collection_name}/release_source.json"

    with open(release_path) as f:
        release_data = json.load(f)

    for release in release_data:
        id_string = release["id"]
        image_source_path = release["image_path"]
        image_target_path = f"tessellates/app/{collection_name}/images/{id_string}.jpg"
        if not os.path.isfile(image_target_path):
            print("copying: ", id_string, image_source_path)

            im = Image.open(image_source_path)
            master_size = (900, 900)
            im.thumbnail(master_size)
            rgb_im = im.convert("RGB")
            rgb_im.save(image_target_path)
        else:
            print("file already copied: ", id_string, image_source_path)
