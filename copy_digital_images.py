import json
import requests
import shutil
import os.path
import time

with open("app/digital/digital.json") as f:
    release_data = json.load(f)

for release in release_data:
    id_string = release["id"]
    image_source_path = release["image_path"]
    image_extension = image_source_path.split(".")[-1]
    path = f"app/digital/images/{id_string}.{image_extension}"
    if not os.path.isfile(path):
        print("copying: ", id_string, image_source_path)
        shutil.copyfile(image_source_path, path)
    else:
        print("file already copied: ", id_string, image_source_path)
