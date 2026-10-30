from datetime import datetime
from pydantic import AwareDatetime, BaseModel, Field
from app.schemas.base import ReadModel

class BookingCreate(BaseModel):
    user_id: int
    machine_id: int
    start_at: AwareDatetime = Field(description="Начало слота с часовым поясом")

class BookingUpdate(BaseModel):
    start_at: AwareDatetime

class BookingRead(ReadModel):
    id: int
    user_id: int
    machine_id: int
    start_at: datetime
    end_at: datetime
    created_at: datetime