from sqlalchemy import String, Integer, ForeignKey, DateTime, BLOB
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from datetime import datetime


class Base(DeclarativeBase):
    pass


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


class CarAction(Base):
    __tablename__ = "CarActions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    car_id: Mapped[int] = mapped_column(ForeignKey("Cars.id"))
    action: Mapped[str] = mapped_column(String(50))  # e.g., 'Changed brakes'
    details: Mapped[str] = mapped_column(String(200), nullable=True)  # Additional info
    date: Mapped[DateTime] = mapped_column(DateTime, default=datetime.utcnow)  # Use callable
    car = relationship("Car", back_populates="actions")


Car.actions = relationship("CarAction", back_populates="car", cascade="all, delete-orphan")
