from fastapi import APIRouter, status
from app.api.deps import DbSession
from app.schemas import MachineCreate, MachineRead, MachineUpdate
from app.services import machines

router = APIRouter(prefix="/machines", tags=["Машины"])

@router.get("", response_model=list[MachineRead])
def list_machines(db: DbSession, laundry_id: int | None = None):
  return machines.list_machines(db, laundry_id)

@router.post("", response_model=MachineRead, status_code=status.HTTP_201_CREATED)
def create_machine(data: MachineCreate, db: DbSession):
  return machines.create_machine(db, data)

@router.get("/{machine_id}", response_model=MachineRead)
def get_machine(machine_id: int, db: DbSession):
  return machines.get_machine(db, machine_id)

@router.patch("/{machine_id}", response_model=MachineRead)
def update_machine(machine_id: int, data: MachineUpdate, db: DbSession):
  return machines.update_machine(db, machine_id, data)

@router.delete("/{machine_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_machine(machine_id: int, db: DbSession) -> None:
  machines.delete_machine(db, machine_id)