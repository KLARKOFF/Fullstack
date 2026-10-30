from fastapi import APIRouter, status
from app.api.deps import DbSession
from app.schemas import LaundryCreate, LaundryRead, LaundryUpdate
from app.services import laundries

router = APIRouter(prefix="/laundries", tags=["Прачечные"])

@router.get("", response_model=list[LaundryRead])
def list_laundries(db: DbSession):
  return laundries.list_laundries(db)

@router.post("", response_model=LaundryRead, status_code=status.HTTP_201_CREATED)
def create_laundry(data: LaundryCreate, db: DbSession):
  return laundries.create_laundry(db, data)

@router.get("/{laundry_id}", response_model=LaundryRead)
def get_laundry(laundry_id: int, db: DbSession):
  return laundries.get_laundry(db, laundry_id)

@router.patch("/{laundry_id}", response_model=LaundryRead)
def update_laundry(laundry_id: int, data: LaundryUpdate, db: DbSession):
  return laundries.update_laundry(db, laundry_id, data)

@router.delete("/{laundry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_laundry(laundry_id: int, db: DbSession) -> None:
  laundries.delete_laundry(db, laundry_id)