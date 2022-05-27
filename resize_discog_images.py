import os
from PIL import Image

small_size = (350, 350)
image_dir = "app/images"
for filename in os.listdir(image_dir):
    # These are bad files, unsure what they're doing
    if "2374743" in filename or "9682091" in filename:
        continue

    if ".jpg" in filename and "-small" not in filename:
        record_id = filename.split(".")[0]
        outfile = image_dir + os.path.sep + f"{record_id}-small.jpg"
        if os.path.isfile(outfile):
            print(filename, "- exists, skipping")
            continue

        infile = image_dir + os.path.sep + filename
        outfile = image_dir + os.path.sep + f"{record_id}-small.jpg"
        print("converting ", infile)
        with Image.open(infile) as im:
            im.thumbnail(small_size)
            im.save(outfile, "JPEG")
            print(im.format, im.size, im.mode)
