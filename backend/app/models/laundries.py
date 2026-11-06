from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base

class Laundry(Base):
    __tablename__ = "laundries"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))

    machines: Mapped[list["Machine"]] = relationship(back_populates="laundry")
    users: Mapped[list["User"]] = relationship(back_populates="laundry")