import base64
import numpy as np
import cv2
import pytesseract

from PIL import Image


def convert_blob_to_base64(blob):
    base64_encoded = base64.b64encode(blob).decode('utf-8')
    return base64_encoded


def read_data_from_img(img):
    file_bytes = np.frombuffer(img.read(), np.uint8)
    cv_img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    gray_img = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
    _, thresholded = cv2.threshold(
        gray_img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    text = pytesseract.image_to_string(
        Image.fromarray(thresholded), config='--psm 11')
    text = text.strip()

    return text
