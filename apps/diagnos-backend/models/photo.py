from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, JSON
from sqlalchemy.sql import func
from database import Base

class Photo(Base):
    __tablename__ = "photos"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    raw_base64 = Column(String, nullable=False)
    cleaned_base64 = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    photo_id = Column(String, unique=True, index=True, nullable=True)
    file_path = Column(String, nullable=True)
    is_photo_persisted = Column(Boolean, default=False)
    is_classified = Column(Boolean, default=False)
    primary_diagnosis = Column(String, nullable=True)
    confidence_score = Column(Float, nullable=True)
    confidence_vectors = Column(JSON, nullable=True)
