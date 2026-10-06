from sqlalchemy import Column, String, Float, JSON, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
import datetime

Base = declarative_base()

class MRIScan(Base):
    __tablename__ = "mri_scans"

    photo_id = Column(String, primary_key=True, index=True)
    file_path = Column(String, nullable=False)
    is_photo_persisted = Column(Boolean, default=False)
    
    is_classified = Column(Boolean, default=False)
    primary_diagnosis = Column(String, nullable=True)
    confidence_score = Column(Float, nullable=True)
    confidence_vectors = Column(JSON, nullable=True)
    
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
