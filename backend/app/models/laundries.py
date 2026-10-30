from typing import TYPE_CHECKING
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
if TYPE_CHECKING:
    from app.models.machines import Machine
    from app.models.users import User

class Laundry(Base):
    __tablename__ = "laundries"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))

    machines: Mapped[list["Machine"]] = relationship(back_populates="laundry")
    users: Mapped[list["User"]] = relationship(back_populates="laundry")