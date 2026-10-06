from sqlalchemy.orm import Session
from models.photo import Photo

def create_photo_record(db: Session, filename: str, raw_base64: str) -> Photo:
    db_photo = Photo(filename=filename, raw_base64=raw_base64)
    db.add(db_photo)
    db.commit()
    db.refresh(db_photo)
    return db_photo

def update_cleaned_photo(db: Session, photo_id: int, cleaned_base64: str) -> Photo:
    db_photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if db_photo:
        db_photo.cleaned_base64 = cleaned_base64
        db.commit()
        db.refresh(db_photo)
    return db_photo
