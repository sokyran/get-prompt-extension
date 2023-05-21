# from transformers import pipeline

# image_to_text = pipeline("image-to-text", model="nlpconnect/vit-gpt2-image-captioning")

# text = image_to_text("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/11869cf4-6729-4083-9b0f-285dedeb5810/dfe4pu1-e5e53663-7d85-4c18-aac9-68493f24a655.png/v1/fit/w_375,h_250,q_70,strp/realm_of_dark_10_by_skorble_dfe4pu1-375w.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODU0IiwicGF0aCI6IlwvZlwvMTE4NjljZjQtNjcyOS00MDgzLTliMGYtMjg1ZGVkZWI1ODEwXC9kZmU0cHUxLWU1ZTUzNjYzLTdkODUtNGMxOC1hYWM5LTY4NDkzZjI0YTY1NS5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.toEgKeb9t_9j6sStoaSOl2ppWFUGX4JPy1tMSUz8JBM")

# print(text)

# # [{'generated_text': 'a soccer game with a player jumping to catch the ball '}]

import requests
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

img_url = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/a7b4ce9c-b9a9-465f-84a7-babfc4501385/dfkaf6p-60a443d8-603d-4144-9701-e383d7df8bcb.png/v1/fit/w_828,h_554,q_70,strp/time_traveller_2_by_bap_de_la_bap_dfkaf6p-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODU3IiwicGF0aCI6IlwvZlwvYTdiNGNlOWMtYjlhOS00NjVmLTg0YTctYmFiZmM0NTAxMzg1XC9kZmthZjZwLTYwYTQ0M2Q4LTYwM2QtNDE0NC05NzAxLWUzODNkN2RmOGJjYi5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19._NJjC48BeL72daslY-2O1BYSLfOLCo8CCrGjuvyvRNE"
raw_image = Image.open(requests.get(img_url, stream=True).raw).convert('RGB')

# unconditional image captioning
inputs = processor(raw_image, return_tensors="pt")

out = model.generate(**inputs)
print(processor.decode(out[0], skip_special_tokens=True))
# >>> a woman sitting on the beach with her dog
