from sqlalchemy.orm import Session
from models.classification import MRIScan

class DiagnosRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_photo_by_id(self, photo_id: str) -> MRIScan:
        return self.db.query(MRIScan).filter(MRIScan.photo_id == photo_id).first()

    def create_initial_photo_record(self, photo_id: str, file_path: str) -> MRIScan:
        scan_record = MRIScan(
            photo_id=photo_id,
            file_path=file_path,
            is_photo_persisted=True
        )
        self.db.add(scan_record)
        self.db.commit()
        return scan_record

    def update_photo_with_classification(self, photo_id: str, results: dict) -> MRIScan:
        scan_record = self.get_photo_by_id(photo_id)
        if scan_record:
            scan_record.is_classified = True
            scan_record.primary_diagnosis = results["primary_diagnosis"]
            scan_record.confidence_score = results["confidence_score"]
            scan_record.confidence_vectors = results["confidence_vectors"]
            self.db.commit()
            self.db.refresh(scan_record)
        return scan_record
