from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserCreate, UserLogin
import core

# --- Create User Logic ---
def create_radiologist_user(db: Session, request: UserCreate) -> User:
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Invalid credentials."
        )
    
    hashed_pass = core.hash_password(request.password)
    new_user = User(
        email=request.email,
        hashed_password=hashed_pass,
        first_name=request.first_name,
        last_name=request.last_name,
        license_number=request.license_number
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def authenticate_radiologist(db: Session, request: UserLogin) -> User:
    radiologist = db.query(User).filter(User.email == request.email).first()
    
    if not radiologist or not core.verify_password(request.password, radiologist.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid credentials."
        )
        
    return radiologist
