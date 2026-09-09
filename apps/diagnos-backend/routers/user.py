from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserCreate, UserLogin

import repositories.user as user_repo  
import core

def create_radiologist_user(db: Session, request: UserCreate) -> User:

    existing_user = user_repo.get_user_by_email(db, request.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Account already exists."
        )
    
    hashed_pass = core.hash_password(request.password)
   
    return user_repo.save_new_user(db, request, hashed_pass)

def authenticate_radiologist(db: Session, request: UserLogin) -> User:
    
    radiologist = user_repo.get_user_by_email(db, request.email)
    
    if not radiologist or not core.verify_password(request.password, radiologist.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid credentials."
        )
        
    return radiologist
