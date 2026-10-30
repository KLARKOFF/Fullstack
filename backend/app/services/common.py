from typing import Any, TypeVar
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.core.errors import ConflictError, NotFoundError
from app.db.database import Base

ModelT = TypeVar("ModelT", bound=Base)

def get_or_404(db: Session, model: type[ModelT], obj_id: int, message: str) -> ModelT:
  obj = db.get(model, obj_id)
  if obj is None:
    raise NotFoundError(message)
  return obj

def apply_patch(obj: Base, changes: dict[str, Any]) -> None:
  for field, value in changes.items():
    setattr(obj, field, value)

def commit_or_conflict(db: Session, message: str) -> None:
  """Коммит, при котором нарушение ограничения БД (например, уникальности) превращается в 409."""
  try:
    db.commit()
  except IntegrityError:
    db.rollback()
    raise ConflictError(message) from None