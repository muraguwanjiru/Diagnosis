import base64
from io import BytesIO
from fastapi import UploadFile
from sqlalchemy.orm import Session
from PIL import Image, ImageOps
import repositories.photo as photo_repo

def run_image_cleanup_pipeline(file_bytes: bytes) -> str:
   
    with Image.open(BytesIO(file_bytes)) as img:
        grayscale_img = ImageOps.grayscale(img)
        resized_img = grayscale_img.resize((512, 512))
        
        buffered = BytesIO()
        resized_img.save(buffered, format="PNG")
        
 
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

async def save_and_process_photo(db: Session, file: UploadFile):
  
    file_bytes = await file.read()
    
  
    raw_base64_str = base64.b64encode(file_bytes).decode('utf-8')
    photo_record = photo_repo.create_photo_record(db, file.filename, raw_base64_str)

   
    cleaned_base64_str = run_image_cleanup_pipeline(file_bytes)

    return photo_repo.update_cleaned_photo(db, photo_record.id, cleaned_base64_str)
