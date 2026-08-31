from fastapi import APIRouter
from app.database import SessionLocal
from app.models import Mission

router = APIRouter()


@router.get("/missions")
def get_all_missions():

    db = SessionLocal()

    missions = db.query(Mission).all()

    data = []

    for mission in missions:
        data.append({
            "mission_id": mission.mission_id,
            "timestamp": mission.timestamp,
            "risk_level": mission.risk_level,
            "priority": mission.priority,
            "threat_score": mission.threat_score,
            "objects_detected": mission.objects_detected,
            "confidence": mission.confidence
        })

    db.close()

    return data