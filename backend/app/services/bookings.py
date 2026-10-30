from collections.abc import Sequence
from datetime import UTC, datetime, timedelta
from zoneinfo import ZoneInfo
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.errors import BusinessRuleError, ConflictError
from app.models import Booking, Machine, User
from app.schemas import BookingCreate, BookingUpdate
from app.services.common import commit_or_conflict, get_or_404

SLOT_TAKEN = "Этот слот уже занят"

def _slot_end(start_at: datetime) -> datetime:
    """Проверяет, что start_at — начало слота из сетки в допустимом диапазоне дат. Возвращает конец слота."""
    tz = ZoneInfo(settings.timezone)
    local = start_at.astimezone(tz)
    first = local.replace(hour=settings.first_slot_hour, minute=0, second=0, microsecond=0)
    last = local.replace(hour=settings.last_slot_hour, minute=0, second=0, microsecond=0)
    offset_minutes = (local - first).total_seconds() / 60

    if local < first or local > last or offset_minutes % settings.slot_minutes:
        raise BusinessRuleError(
            f"Слоты начинаются каждые {settings.slot_minutes} мин с {settings.first_slot_hour}:00 "
            f"до {settings.last_slot_hour}:00 по времени {settings.timezone}"
        )

    end_at = start_at + timedelta(minutes=settings.slot_minutes)
    now = datetime.now(UTC)
    if end_at <= now:
        raise BusinessRuleError("Нельзя забронировать время, которое уже прошло")
    if (local.date() - now.astimezone(tz).date()).days > settings.booking_days_ahead:
        raise BusinessRuleError(f"Бронировать можно не дальше чем на {settings.booking_days_ahead} дн. вперёд")
    return end_at

def _check_machine_available(machine: Machine) -> None:
    if machine.is_under_maintenance:
        raise ConflictError(f"Машина №{machine.number} на обслуживании")

def _check_slot_free(
    db: Session, machine_id: int, start_at: datetime, end_at: datetime, exclude_id: int | None = None
) -> None:
    query = select(Booking.id).where(
        Booking.machine_id == machine_id,
        Booking.start_at < end_at,
        Booking.end_at > start_at,
    )
    if exclude_id is not None:
        query = query.where(Booking.id != exclude_id)
    if db.scalar(query) is not None:
        raise ConflictError(SLOT_TAKEN)

def list_bookings(
    db: Session,
    machine_id: int | None = None,
    user_id: int | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
) -> Sequence[Booking]:
    query = select(Booking).order_by(Booking.start_at)
    if machine_id is not None:
        query = query.where(Booking.machine_id == machine_id)
    if user_id is not None:
        query = query.where(Booking.user_id == user_id)
    if date_from is not None:
        query = query.where(Booking.end_at > date_from)
    if date_to is not None:
        query = query.where(Booking.start_at < date_to)
    return db.scalars(query).all()

def get_booking(db: Session, booking_id: int) -> Booking:
    return get_or_404(db, Booking, booking_id, f"Бронь {booking_id} не найдена")

def create_booking(db: Session, data: BookingCreate) -> Booking:
    get_or_404(db, User, data.user_id, f"Пользователь {data.user_id} не найден")
    machine = get_or_404(db, Machine, data.machine_id, f"Машина {data.machine_id} не найдена")
    _check_machine_available(machine)
    end_at = _slot_end(data.start_at)
    _check_slot_free(db, machine.id, data.start_at, end_at)

    booking = Booking(user_id=data.user_id, machine_id=machine.id, start_at=data.start_at, end_at=end_at)
    db.add(booking)
    commit_or_conflict(db, SLOT_TAKEN)
    db.refresh(booking)
    return booking


def update_booking(db: Session, booking_id: int, data: BookingUpdate) -> Booking:
    """Перенос брони на другой слот той же машины."""
    booking = get_booking(db, booking_id)
    if booking.start_at <= datetime.now(UTC):
        raise BusinessRuleError("Начавшуюся или прошедшую бронь нельзя перенести")
    _check_machine_available(booking.machine)
    end_at = _slot_end(data.start_at)
    _check_slot_free(db, booking.machine_id, data.start_at, end_at, exclude_id=booking.id)

    booking.start_at = data.start_at
    booking.end_at = end_at
    commit_or_conflict(db, SLOT_TAKEN)
    db.refresh(booking)
    return booking

def delete_booking(db: Session, booking_id: int) -> None:
    booking = get_booking(db, booking_id)
    now = datetime.now(UTC)
    if booking.start_at <= now < booking.end_at:
        raise BusinessRuleError("Начавшуюся бронь нельзя отменить")
    db.delete(booking)
    db.commit()