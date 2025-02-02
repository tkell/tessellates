import argparse
import os


if __name__ == "__main__":
    arg_parser = argparse.ArgumentParser()
    arg_parser.add_argument("external_id", type=str, help="The release ID to delete")
    arg_parser.add_argument(
        "collection_name", type=str, help="The collection to delete from"
    )
    args = arg_parser.parse_args()
    external_id = args.external_id.strip()
    collection_name = args.collection_name.strip().lower()

    image_path = f"tessellates/app/{collection_name}/images/"
    big_image = f"{image_path}{external_id}.jpg"
    small_image = f"{image_path}{external_id}-small.jpg"
    print("About to remove images from tessellates, y/n:")
    print(big_image, small_image)

    choice = input()
    if choice == "y":
        print("Removing images")
        os.remove(big_image)
        os.remove(big_image)
    else:
        print("Not removing images!")
