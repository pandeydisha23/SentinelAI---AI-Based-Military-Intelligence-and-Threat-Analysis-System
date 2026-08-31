from sqlalchemy import Column, Integer, String, Text
from app.database import Base


class Mission(Base):
    __tablename__ = "missions"

    id = Column(Integer, primary_key=True, index=True)

    mission_id = Column(String, unique=True, index=True)

    timestamp = Column(String)

    threat_level = Column(String)

    priority = Column(String)

    threat_score = Column(Integer)

    confidence = Column(Integer)

    detected_objects = Column(Text)

    recommendation = Column(Text)

    report = Column(Text)

    output_image = Column(String)