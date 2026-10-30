from fastapi import APIRouter, status
from pydantic import AwareDatetime
from app.api.deps import DbSession
from app.schemas import BookingCreate, BookingRead, BookingUpdate
from app.services import bookings

router = APIRouter(prefix="/bookings", tags=["Брони"])

@router.get("", response_model=list[BookingRead])
def list_bookings(
    db: DbSession,
    machine_id: int | None = None,
    user_id: int | None = None,
    date_from: AwareDatetime | None = None,
    date_to: AwareDatetime | None = None,
):
    """Брони, пересекающиеся с интервалом [date_from, date_to). Все фильтры необязательны."""
    return bookings.list_bookings(db, machine_id, user_id, date_from, date_to)

@router.post("", response_model=BookingRead, status_code=status.HTTP_201_CREATED)
def create_booking(data: BookingCreate, db: DbSession):
    return bookings.create_booking(db, data)

@router.get("/{booking_id}", response_model=BookingRead)
def get_booking(booking_id: int, db: DbSession):
    return bookings.get_booking(db, booking_id)

@router.patch("/{booking_id}", response_model=BookingRead)
def update_booking(booking_id: int, data: BookingUpdate, db: DbSession):
    return bookings.update_booking(db, booking_id, data)

@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(booking_id: int, db: DbSession) -> None:
    bookings.delete_booking(db, booking_id)