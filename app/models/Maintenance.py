from sqlalchemy import String, Integer, ForeignKey, Float, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.car import Car
from .base import Base

class MaintenanceEvent(Base):
    __tablename__ = "MaintenanceEvents"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    car_id: Mapped[int] = mapped_column(ForeignKey("Cars.id"), nullable=False)
    event_date: Mapped[str] = mapped_column(String(10))  # Alternatively, use Date type
    event_type: Mapped[str] = mapped_column(String(50))
    description: Mapped[str] = mapped_column(String(255))
    cost: Mapped[float] = mapped_column(Float)
    # Relationship back to Car
    car: Mapped["Car"] = relationship("Car", back_populates="maintenance_events")

    def __repr__(self) -> str:
        return (
            f"MaintenanceEvent(id={self.id!r}, car_id={self.car_id!r}, "
            f"event_date={self.event_date!r}, event_type={self.event_type!r}, cost={self.cost!r})"
        )
