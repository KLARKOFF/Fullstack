from fastapi import APIRouter, status
from app.api.deps import DbSession
from app.schemas import UserCreate, UserRead, UserUpdate
from app.services import users

router = APIRouter(prefix="/users", tags=["Пользователи"])

@router.get("", response_model=list[UserRead])
def list_users(db: DbSession):
    return users.list_users(db)

@router.post("", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(data: UserCreate, db: DbSession):
    return users.create_user(db, data)

@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: int, db: DbSession):
    return users.get_user(db, user_id)

@router.patch("/{user_id}", response_model=UserRead)
def update_user(user_id: int, data: UserUpdate, db: DbSession):
    return users.update_user(db, user_id, data)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: DbSession) -> None:
    users.delete_user(db, user_id)