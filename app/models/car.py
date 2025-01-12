from sqlalchemy import String, Integer, BLOB
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from .base import Base


class Car(Base):
    __tablename__ = "Cars"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(20))
    model: Mapped[str] = mapped_column(String(20))
    plate_number: Mapped[str] = mapped_column(String(10), unique=True)
    year: Mapped[int] = mapped_column(Integer)
    car_image: Mapped[BLOB] = mapped_column(BLOB, nullable=True, default=None)
    
    def __repr__(self) -> str:
        return f"Car(id={self.id!r}, name={self.name!r}, model={self.model!r}, year={self.year!r})"
