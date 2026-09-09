from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr = Field(..., description="The clinical email address of the radiologist")
    password: str = Field(..., min_length=8, description="Password must be a minimum of 8 characters")
    first_name: str = Field(..., min_length=1, description="Radiologist's first name")
    last_name: str = Field(..., min_length=1, description="Radiologist's last name")
    license_number: Optional[str] = Field(None, description="Medical or radiology board registration number")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str
    license_number: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
