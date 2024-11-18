
import base64


def convert_blob_to_base64(blob):
    base64_encoded = base64.b64encode(blob).decode('utf-8')
    return base64_encoded
