from collections.abc import Sequence
from datetime import UTC, datetime
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.core.errors import ConflictError
from app.models import Booking, Laundry, Machine
from app.schemas import MachineCreate, MachineUpdate
from app.services.common import apply_patch, commit_or_conflict, get_or_404

DUPLICATE_NUMBER = "Машина с таким номером уже есть в этой прачечной"

def list_machines(db: Session, laundry_id: int | None = None) -> Sequence[Machine]:
    query = select(Machine).order_by(Machine.laundry_id, Machine.number)
    if laundry_id is not None:
        query = query.where(Machine.laundry_id == laundry_id)
    return db.scalars(query).all()

def get_machine(db: Session, machine_id: int) -> Machine:
    return get_or_404(db, Machine, machine_id, f"Машина {machine_id} не найдена")

def create_machine(db: Session, data: MachineCreate) -> Machine:
    get_or_404(db, Laundry, data.laundry_id, f"Прачечная {data.laundry_id} не найдена")
    machine = Machine(**data.model_dump())
    db.add(machine)
    commit_or_conflict(db, DUPLICATE_NUMBER)
    db.refresh(machine)
    return machine

def update_machine(db: Session, machine_id: int, data: MachineUpdate) -> Machine:
    machine = get_machine(db, machine_id)
    apply_patch(machine, data.model_dump(exclude_unset=True, exclude_none=True))
    commit_or_conflict(db, DUPLICATE_NUMBER)
    db.refresh(machine)
    return machine

def delete_machine(db: Session, machine_id: int) -> None:
    machine = get_machine(db, machine_id)
    future = db.scalar(
        select(func.count())
        .select_from(Booking)
        .where(Booking.machine_id == machine_id, Booking.end_at > datetime.now(UTC))
    )
    if future:
        raise ConflictError(
            f"У машины №{machine.number} есть будущие брони ({future}). "
            "Отмените их или переведите машину на обслуживание"
        )
    # Прошедшие брони удаляются каскадно
    db.delete(machine)
    db.commit()