from PIL import Image

import io
import base64


def compress_image(fs, quality, max_width):
    image = Image.open(fs)

    if max_width and image.width > max_width:
        new_height = int(max_width * image.height / image.width)
        image = image.resize((max_width, new_height))

    compressed_image = io.BytesIO()
    image.save(compressed_image, format="JPEG", quality=quality, optimize=True)
    compressed_image.seek(0)  # Move pointer to the start of the BytesIO object

    return compressed_image


def process_image(fs):
    compressed_image = compress_image(
        fs, quality=50, max_width=800)

    compressed_image_blob = compressed_image.read()

    return compressed_image_blob


def convert_blob_to_base64(blob):
    return base64.b64encode(blob).decode('utf-8')
