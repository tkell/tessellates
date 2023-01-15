import os
from PIL import Image

small_size = (350, 350)
image_dir = "tessellates/app/digital/images"
for filename in os.listdir(image_dir):
    record_id = filename.split(".")[0]
    file_format = filename.split(".")[1]

    if file_format == "jpg" and "-small" not in filename:
        record_id = filename.split(".")[0]
        outfile = os.path.join(image_dir, f"{record_id}-small.jpg")
        if os.path.isfile(outfile):
            print(filename, "- exists, skipping")
            continue

        infile = os.path.join(image_dir, filename)
        outfile = os.path.join(image_dir, f"{record_id}-small.jpg")
        print("converting ", infile)
        try:
            with Image.open(infile) as im:
                im.thumbnail(small_size)
                im.save(outfile, "JPEG")
                print(im.format, im.size, im.mode)
        except Exception:
            print(f"Failed on {infile} --!")
