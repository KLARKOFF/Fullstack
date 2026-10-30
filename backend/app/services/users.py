from collections.abc import Sequence
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models import Laundry, User
from app.schemas import UserCreate, UserUpdate
from app.services.common import apply_patch, commit_or_conflict, get_or_404

def list_users(db: Session) -> Sequence[User]:
  return db.scalars(select(User).order_by(User.id)).all()

def get_user(db: Session, user_id: int) -> User:
  return get_or_404(db, User, user_id, f"Пользователь {user_id} не найден")

def _check_laundry(db: Session, laundry_id: int | None) -> None:
  if laundry_id is not None:
    get_or_404(db, Laundry, laundry_id, f"Прачечная {laundry_id} не найдена")

def create_user(db: Session, data: UserCreate) -> User:
  _check_laundry(db, data.laundry_id)
  values = data.model_dump()
  values["email"] = values["email"].lower()
  values["room"] = values["room"] or None
  user = User(**values)
  db.add(user)
  commit_or_conflict(db, f"Пользователь с email {user.email} уже существует")
  db.refresh(user)
  return user

def update_user(db: Session, user_id: int, data: UserUpdate) -> User:
  user = get_user(db, user_id)
  changes = data.model_dump(exclude_unset=True, exclude_none=True)
  _check_laundry(db, changes.get("laundry_id"))
  if "room" in changes:
    changes["room"] = changes["room"] or None
  apply_patch(user, changes)
  db.commit()
  db.refresh(user)
  return user

def delete_user(db: Session, user_id: int) -> None:
  db.delete(get_user(db, user_id))
  db.commit()