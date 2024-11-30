import base64
import numpy as np
import cv2
import pytesseract
import requests
import json
import os

from PIL import Image

OPEN_ROUTER_API_KEY = os.environ.get("OPEN_ROUTER_API_KEY")


def convert_blob_to_base64(blob):
    return base64.b64encode(blob).decode('utf-8')


def convert_llm_output_to_json(text):
    lines = text.split('\n')
    json_data = dict()

    for line in lines:
        if ' - ' in line:
            key, value = line.split(' - ', 1)
            key = key.split('. ')[1]
            json_data[key] = value.strip()

    json_output = json.dumps(json_data, ensure_ascii=False, indent=4)
    return json_output


def read_data_from_img(img):
    try:
        file_bytes = np.frombuffer(img.read(), np.uint8)
        cv_img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        if cv_img is None:
            raise ValueError(
                "Failed to decode the image. Ensure it is a valid image format.")

        gray_img = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
        _, thresholded = cv2.threshold(
            gray_img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        pytess_config = r'--psm 6'

        text = pytesseract.image_to_string(
            Image.fromarray(thresholded), config=pytess_config)
        text = text.strip()

        if not text:
            raise ValueError("No text could be extracted from the image.")

        content = f"""
        Imagine this is a document from a car repair shop, extract following infromation:
        {text}

        Extract (Text might be in polish so keep that in mind):
        1. action (Action that was made for the car? Like changing oil).
        2. details (More info about the action. For example if it was an oil change then which model one etc.).
        3. service_station_name (If there are any. Name of the cair repair shop)
        4. date (Look for the date).
        
        Return data in just 4 points in format:
        action - [...] <- This part in POLISH ONLY without anything additional, capitalize first letter
        """

        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {OPEN_ROUTER_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "nousresearch/hermes-3-llama-3.1-405b:free",
            "messages": [{"role": "user", "content": content}]
        }

        response = requests.post(url, headers=headers,
                                 data=json.dumps(payload))
        response.raise_for_status()

        data = response.json()
        response_content = data["choices"][0]["message"]["content"]

        response_content_json = convert_llm_output_to_json(response_content)
        return response_content_json

    except ValueError as ve:
        print(f"ValueError: {ve}")
        return {"error": str(ve)}

    except requests.exceptions.RequestException as re:
        print(f"RequestException: {re}")
        return {"error": "Failed to communicate with the external API."}

    except Exception as e:
        print(f"Exception: {e}")
        return {"error": "Unexpected error, please try to enter values yourself"}
