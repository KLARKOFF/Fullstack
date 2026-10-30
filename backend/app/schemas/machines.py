from typing import Annotated
from pydantic import BaseModel, StringConstraints
from app.schemas.base import ReadModel

MachineNumber = Annotated[int, Field(ge=1, le=999)]
Capacity = Annotated[int, Field(ge=1, le=30, description="Загрузка, кг")]

class MachineCreate(BaseModel):
    laundry_id: int
    number: MachineNumber
    type: MachineType
    capacity: Capacity
    is_under_maintenance: bool = False

class MachineUpdate(BaseModel):
    number: MachineNumber | None = None
    type: MachineType | None = None
    capacity: Capacity | None = None
    is_under_maintenance: bool | None = None

class MachineRead(ReadModel):
    id: int
    laundry_id: int
    number: int
    type: MachineType
    capacity: int
    is_under_maintenance: bool