from datetime import datetime
from enum import StrEnum
from sqlalchemy import CheckConstraint, DateTime, Enum, ForeignKey, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base

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
    # Заполняется, когда появится авторизация
    password_hash: Mapped[str | None] = mapped_column(String(255))

    laundry: Mapped[Laundry | None] = relationship(back_populates="users")
    bookings: Mapped[list["Booking"]] = relationship(
        back_populates="user", cascade="all, delete-orphan", passive_deletes=True
    )