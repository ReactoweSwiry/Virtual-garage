from sqlalchemy import Float, String, ForeignKey, DateTime, BLOB
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from datetime import datetime


from .base import Base
from .car import Car


class Action(Base):
    __tablename__ = "Actions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    car_id: Mapped[int] = mapped_column(ForeignKey("Cars.id"))
    action: Mapped[str] = mapped_column(String(50))  # e.g., 'Changed brakes'
    type: Mapped[str] = mapped_column(String(50), nullable=True)  # e.g., 'repair'
    cost: Mapped[float] = mapped_column(Float, nullable=True)  # e.g., 100.0
    details: Mapped[str] = mapped_column(
        String(200), nullable=True)  # Additional info
    service_station_name: Mapped[str] = mapped_column(
        String(50), nullable=True)
    car_image: Mapped[BLOB] = mapped_column(BLOB, nullable=True, default=None)
    date: Mapped[DateTime] = mapped_column(
        DateTime, default=datetime.utcnow)  # Use callable
    car = relationship("Car", back_populates="actions")

    
    def to_dict(self):
        """Converts the Action object to a dictionary."""
        return {
            "id": self.id,
            "car_id": self.car_id,
            "action": self.action,
            "type": self.type,
            "cost": self.cost,
            "details": self.details,
            "service_station_name": self.service_station_name,
            "car_image": self.car_image.decode('utf-8') if self.car_image else None,  # Handle BLOB if needed
            "date": self.date.isoformat() if self.date else None,
        }

Car.actions = relationship(
    "Action", back_populates="car", cascade="all, delete-orphan")
