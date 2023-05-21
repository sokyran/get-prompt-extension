import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import re
import requests
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration

app = Flask(__name__)
CORS(app)

openai.api_key = os.environ.get('OPENAI_API_KEY')

models_path = 'models/'

processor = BlipProcessor.from_pretrained(models_path + 'processor', local_files_only=True)
model = BlipForConditionalGeneration.from_pretrained(models_path + 'model', local_files_only=True)

chatPrompt = """Act as a professional prompt engineer, who does the best prompts for Midjourney.
Your prompts should short and concise. Different modifications for image should be separated with a comma.
Your prompts should be in a style of the following prompts: 
- a person in a boat in the middle of a forest, a detailed matte painting by Cyril Rolando, cgsociety, fantasy art, matte painting, mystical, nightscape
- a cat wearing a suit and tie with green eyes, pexels, furry art, stockphoto, creative commons attribution, quantum wavetracing
- a man riding on the back of a white horse through a forest, a detailed matte painting, cgsociety, space art, matte painting, redshift, concept art.
- The Moon Knight dissolving into swirling sand, volumetric dust, cinematic lighting, close up portrait
- Hyper detailed movie still that fuses the iconic tea party scene from Alice in Wonderland showing the hatter and an adult alice. a wooden table is filled with teacups and cannabis plants. The scene is surrounded by flying weed. Some playcards flying around in the air. Captured with a Hasselblad medium format camera.
- a Shakespeare stage play, yellow mist, atmospheric, set design by Michel Crête, Aerial acrobatics design by André Simard, hyperrealistic
- venice in a carnival picture 3, in the style of fantastical compositions, colorful, eye-catching compositions, symmetrical arrangements, navy and aquamarine, distinctive noses, gothic references, spiral group

Describe prompt for picture that will include: "{image_desc}".

Generated prompt:
"""


@app.route('/describe', methods=['POST'])
def query():
    # parse the request body
    data = request.get_json()
    img_url = data['url']

    raw_image = Image.open(requests.get(img_url, stream=True).raw).convert('RGB')

    inputs = processor(raw_image, return_tensors="pt")

    out = model.generate(**inputs)
    
    image_desc = processor.decode(out[0], skip_special_tokens=True)

    messages = [
      { "role": "user", "content": chatPrompt.format(image_desc=image_desc) },
    ]

    response = openai.ChatCompletion.create(
      model="gpt-4",
      messages=messages,
      max_tokens=512,
    )

    return jsonify({ "value": response['choices'][0]['message']['content'] })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(debug=False, host='0.0.0.0', port=port)
