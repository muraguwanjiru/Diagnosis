from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models.user import User
from schemas.user import HiddenLoginResponse, UserCreate, UserLogin
from database import get_db  
import repositories.user as user_repo  
import core

router = APIRouter(prefix="/users",
    tags=["Users"]
)

@router.post("/register", status_code=status.HTTP_201_CREATED)
def create_radiologist_user(request: UserCreate, db: Session = Depends(get_db)):
    existing_user = user_repo.get_user_by_email(db, request.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Invalid credentials."
        )
    
    hashed_pass = core.hash_password(request.password)
    user_repo.save_new_user(db, request, hashed_pass)
    
    return {
        "status": "Account created successfully"
    }

@router.post("/login", response_model=HiddenLoginResponse, status_code=status.HTTP_200_OK)
def authenticate_radiologist(
    request: UserLogin, 
    db: Session = Depends(get_db)
):
    radiologist = user_repo.get_user_by_email(db, request.email)
    
    if not radiologist or not core.verify_password(request.password, radiologist.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid credentials."
        )
        
    access_token = core.create_access_token(data={"sub": radiologist.email})
        
    return {
        "access_token": access_token, 
        "token_type": "bearer"
    }
