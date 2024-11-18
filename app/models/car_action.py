from sqlalchemy import String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from datetime import datetime


from .base import Base
from .car import Car


class Car_Action(Base):
    __tablename__ = "Car_Actions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    car_id: Mapped[int] = mapped_column(ForeignKey("Cars.id"))
    action: Mapped[str] = mapped_column(String(50))  # e.g., 'Changed brakes'
    details: Mapped[str] = mapped_column(
        String(200), nullable=True)  # Additional info
    date: Mapped[DateTime] = mapped_column(
        DateTime, default=datetime.utcnow)  # Use callable
    car = relationship("Car", back_populates="actions")


Car.actions = relationship(
    "Car_Action", back_populates="car", cascade="all, delete-orphan")
