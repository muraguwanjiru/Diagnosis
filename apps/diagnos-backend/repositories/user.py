from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserCreate

def get_user_by_email(db: Session, email: str) -> User:
    """Pure read operation to find a user by email."""
    return db.query(User).filter(User.email == email).first()

def save_new_user(db: Session, request: UserCreate, hashed_pass: str) -> User:
    """Pure write operation to commit a new user record."""
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
