from typing import TYPE_CHECKING
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
if TYPE_CHECKING:
    from app.models.machine import Machine
    from app.models.user import User

class Machine(Base):
    __tablename__ = "machines"
    __table_args__ = (
        UniqueConstraint("laundry_id", "number", name="uq_machines_laundry_number"),
        CheckConstraint("number BETWEEN 1 AND 999", name="ck_machines_number"),
        CheckConstraint("capacity BETWEEN 1 AND 30", name="ck_machines_capacity"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    laundry_id: Mapped[int] = mapped_column(ForeignKey("laundries.id", ondelete="RESTRICT"))
    number: Mapped[int]
    type: Mapped[MachineType] = mapped_column(Enum(MachineType, name="machine_type"))
    capacity: Mapped[int]
    is_under_maintenance: Mapped[bool] = mapped_column(default=False)

    laundry: Mapped[Laundry] = relationship(back_populates="machines")
    bookings: Mapped[list["Booking"]] = relationship(
        back_populates="machine", cascade="all, delete-orphan", passive_deletes=True
    )
