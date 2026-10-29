from datetime import datetime
from enum import StrEnum
from sqlalchemy import CheckConstraint, DateTime, Enum, ForeignKey, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base

class Booking(Base):
    __tablename__ = "bookings"
    __table_args__ = (
        UniqueConstraint("machine_id", "start_at", name="uq_bookings_machine_start"),
        CheckConstraint("end_at > start_at", name="ck_bookings_interval"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    machine_id: Mapped[int] = mapped_column(ForeignKey("machines.id", ondelete="CASCADE"))
    start_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    end_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped[User] = relationship(back_populates="bookings")
    machine: Mapped[Machine] = relationship(back_populates="bookings")