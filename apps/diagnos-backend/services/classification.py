import io
import os
import uuid
import numpy as np
from PIL import Image
import tensorflow as tf
from repositories.classification import DiagnosRepository
from core.engine import ai_engine

LABELS = ["Glioma", "Meningioma", "Normal Anatomy", "Pituitary Tumor"]

class PhotoUploadService:
    def __init__(self, db_session):
        self.repository = DiagnosRepository(db_session)

    async def stage_and_persist_photo(self, file_bytes: bytes, original_filename: str) -> dict:
        photo_id = str(uuid.uuid4())
        storage_dir = "storage/mris"
        os.makedirs(storage_dir, exist_ok=True)
        anonymized_path = f"{storage_dir}/{photo_id}.png"
        
        with open(anonymized_path, "wb") as f:
            f.write(file_bytes)
        
        self.repository.create_initial_photo_record(
            photo_id=photo_id, 
            file_path=anonymized_path
        )
        
        return {
            "photo_id": photo_id,
            "status": "Photo successfully persisted to storage and database layers"
        }


class ClassificationService:
    def __init__(self, db_session):
        self.repository = DiagnosRepository(db_session)

    def _preprocess_image(self, image: Image.Image) -> np.ndarray:
        image = image.resize((224, 224))
        img_array = tf.keras.utils.img_to_array(image)
        img_array = np.expand_dims(img_array, axis=0)
        return tf.keras.applications.densenet.preprocess_input(img_array)

    async def execute_densenet_inference(self, photo_id: str) -> dict:
        photo_record = self.repository.get_photo_by_id(photo_id)
        if not photo_record:
            raise ValueError(f"No active record found matching target reference ID: {photo_id}")
            
        with open(photo_record.file_path, "rb") as f:
            file_bytes = f.read()
            
        image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
        input_data = self._preprocess_image(image)

        probabilities = ai_engine.predict(input_data)

        confidence_vectors = {LABELS[i]: round(prob, 4) for i, prob in enumerate(probabilities)}
        primary_idx = probabilities.index(max(probabilities))
        
        evaluation_data = {
            "primary_diagnosis": LABELS[primary_idx],
            "confidence_score": round(probabilities[primary_idx], 4),
            "confidence_vectors": confidence_vectors
        }

        self.repository.update_photo_with_classification(photo_id, evaluation_data)

        return {
            "photo_id": photo_id,
            **evaluation_data
        }
