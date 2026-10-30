from collections.abc import Sequence
from sqlalchemy import exists, select
from sqlalchemy.orm import Session
from app.core.errors import ConflictError
from app.models import Laundry, Machine
from app.schemas import LaundryCreate, LaundryUpdate
from app.services.common import apply_patch, get_or_404

def list_laundries(db: Session) -> Sequence[Laundry]:
  return db.scalars(select(Laundry).order_by(Laundry.id)).all()

def get_laundry(db: Session, laundry_id: int) -> Laundry:
  return get_or_404(db, Laundry, laundry_id, f"Прачечная {laundry_id} не найдена")

def create_laundry(db: Session, data: LaundryCreate) -> Laundry:
  laundry = Laundry(**data.model_dump())
  db.add(laundry)
  db.commit()
  db.refresh(laundry)
  return laundry

def update_laundry(db: Session, laundry_id: int, data: LaundryUpdate) -> Laundry:
  laundry = get_laundry(db, laundry_id)
  apply_patch(laundry, data.model_dump(exclude_unset=True, exclude_none=True))
  db.commit()
  db.refresh(laundry)
  return laundry

def delete_laundry(db: Session, laundry_id: int) -> None:
  laundry = get_laundry(db, laundry_id)
  if db.scalar(select(exists().where(Machine.laundry_id == laundry_id))):
    raise ConflictError("В прачечной есть машины. Сначала удалите их")
  # У жильцов этой прачечной laundry_id станет NULL (ondelete="SET NULL")
  db.delete(laundry)
  db.commit()