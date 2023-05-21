import os
from transformers import BlipProcessor, BlipForConditionalGeneration

models_path = 'models/'

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base", local_files_only=True)
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base", local_files_only=True)

processor.save_pretrained(models_path + 'processor')
model.save_pretrained(models_path + 'model')
