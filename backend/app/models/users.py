from enum import StrEnum
from typing import TYPE_CHECKING, Optional
from sqlalchemy import Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
if TYPE_CHECKING:
    from app.models.bookings import Booking
    from app.models.laundries import Laundry

class UserRole(StrEnum):
    user = "user"
    admin = "admin"

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    laundry_id: Mapped[int | None] = mapped_column(ForeignKey("laundries.id", ondelete="SET NULL"))
    name: Mapped[str] = mapped_column(String(50))
    email: Mapped[str] = mapped_column(String(255), unique=True)
    room: Mapped[str | None] = mapped_column(String(10))
    role: Mapped[UserRole] = mapped_column(Enum(UserRole, name="user_role"), default=UserRole.user)
    # Сделаю на 4 лабе
    password_hash: Mapped[str | None] = mapped_column(String(255))

    laundry: Mapped[Optional["Laundry"]] = relationship(back_populates="users")
    bookings: Mapped[list["Booking"]] = relationship(
        back_populates="user", cascade="all, delete-orphan", passive_deletes=True
    )