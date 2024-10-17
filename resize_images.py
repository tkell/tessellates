import os
import sys
from PIL import Image

def resize_file(filename, image_dir, size_tuple):
    record_id = filename.split(".")[0]
    file_format = filename.split(".")[1]

    if file_format == "jpg" and "-small" not in filename:
        record_id = filename.split(".")[0]
        outfile = os.path.join(image_dir, f"{record_id}-small.jpg")
        if os.path.isfile(outfile):
            print(filename, "- exists, skipping")
            return None

        infile = os.path.join(image_dir, filename)
        outfile = os.path.join(image_dir, f"{record_id}-small.jpg")
        print("converting ", infile)
        try:
            with Image.open(infile) as im:
                im.thumbnail(size_tuple)
                im.save(outfile, "JPEG")
                print(im.format, im.size, im.mode)
        except Exception:
            print(f"Failed on {infile} --!")
        return outfile

def resize_images(image_dir, size_tuple):
    for filename in os.listdir(image_dir):
        resize_file(filename, image_dir, size_tuple)

small_size = (350, 350)
if __name__ == "__main__":
    image_dir = sys.argv[1]
    resize_images(image_dir, small_size)

