from pydantic import BaseModel
from typing import Dict

class UploadResponse(BaseModel):
    photo_id: str
    status: str

class ClassificationResponse(BaseModel):
    photo_id: str
    primary_diagnosis: str
    confidence_score: float
    confidence_vectors: Dict[str, float]
