from typing import Annotated
from pydantic import BaseModel, EmailStr, Field, StringConstraints
from app.models import UserRole
from app.schemas.base import ReadModel

UserName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=50)]
Room = Annotated[str, StringConstraints(strip_whitespace=True, max_length=10)]

class UserCreate(BaseModel):
    name: UserName
    email: EmailStr
    room: Room | None = None
    laundry_id: int | None = None
    role: UserRole = UserRole.user

class UserUpdate(BaseModel):
    name: UserName | None = None
    room: Room | None = Field(default=None, description="Пустая строка очищает номер комнаты")
    laundry_id: int | None = None
    role: UserRole | None = None

class UserRead(ReadModel):
    id: int
    name: str
    email: str
    room: str | None
    laundry_id: int | None
    role: UserRole