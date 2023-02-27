import json
import requests
import shutil
import os.path
import time

with open("app/vinyl/release_source.json") as f:
    vinyl_data = json.load(f)

for release in vinyl_data:
    discogs_id = release["id"]
    discogs_cover_url = release["cover_image"]
    path = f"app/vinyl/images/{discogs_id}.jpg"
    if not os.path.isfile(path):
        print("downloading: ", discogs_id, discogs_cover_url)
        headers = {"user-agent": "DiscogsOrganize +http://tide-pool.ca"}
        response = requests.get(discogs_cover_url, headers=headers, stream=True)

        with open(path, "wb") as out_file:
            shutil.copyfileobj(response.raw, out_file)
        del response
        time.sleep(1)
    else:
        pass
        print("file already exists: ", discogs_id, discogs_cover_url)
