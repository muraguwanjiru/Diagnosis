from fastapi import APIRouter, UploadFile, File, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
from schemas.photo import PhotoResponse
import services.photo as photo_service
import jwt
import core

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

def verify_access_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, core.SECRET_KEY, algorithms=[core.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
        return email
    except (jwt.PyJWTError, AttributeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

router = APIRouter(
    prefix="/photos",
    tags=["Photo Module"]
)

@router.post("/upload", response_model=PhotoResponse, status_code=status.HTTP_201_CREATED)
async def upload_and_clean_photo(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_access_token)
):
    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Unsupported asset format. Please use a PNG, JPG, or JPEG file format."
        )
    return await photo_service.save_and_process_photo(db, file)
