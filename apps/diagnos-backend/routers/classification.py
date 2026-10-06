from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas.photo import PhotoResponse
from schemas.classification import ClassificationResponse
from services.classification import PhotoUploadService, ClassificationService
from database import get_db

router = APIRouter(prefix="/api/v1", tags=["Diagnos Core Diagram Flow"])

@router.post("/photos/upload", response_model=PhotoResponse, status_code=status.HTTP_201_CREATED)
async def upload_mri_photo(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid image layout structure configuration.")
        
    upload_service = PhotoUploadService(db)
    try:
        file_bytes = await file.read()
        result = await upload_service.stage_and_persist_photo(file_bytes, file.filename)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File persistence failure: {str(e)}")


@router.post("/classification/evaluate/{photo_id}", response_model=ClassificationResponse)
async def evaluate_mri_photo(
    photo_id: str, 
    db: Session = Depends(get_db)
):
    classification_service = ClassificationService(db)
    try:
        analysis_result = await classification_service.execute_densenet_inference(photo_id)
        return analysis_result
    except ValueError as val_err:
        raise HTTPException(status_code=404, detail=str(val_err))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model evaluation pipeline dropped: {str(e)}")
