from typing import Annotated
from app.models import MachineType
from pydantic import BaseModel, StringConstraints
from app.schemas.base import ReadModel

LaundryName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]

class LaundryCreate(BaseModel):
    name: LaundryName

class LaundryUpdate(BaseModel):
    name: LaundryName | None = None

class LaundryRead(ReadModel):
    id: int
    name: str