from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PhotoResponse(BaseModel):
    id: int
    filename: str
    raw_base64: str
    cleaned_base64: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
