import uuid
from datetime import datetime

from fastapi import APIRouter, UploadFile, File

from app.database import SessionLocal
from app.models import Mission

from app.utils.file_handler import save_upload_file
from app.services.fire_service import detect_objects
from app.services.threat_service import analyze_threat
from app.services.groq_service import generate_ai_report
from app.services.mission_service import save_mission
from app.websocket_manager import manager

print("fire_routes.py imported successfully")

router = APIRouter()


@router.get("/predict")
def predict():
    return {
        "message": "Prediction endpoint is working."
    }


@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):

    print("\nUPLOAD IMAGE API CALLED\n")

    
    file_path = await save_upload_file(file)
    print("✓ File saved")
  
    result = detect_objects(file_path)
    print("✓ Detection completed")

    threat = analyze_threat(result["detections"])
    print("✓ Threat analysis completed")

    mission_id = (
        "SAT-"
        + datetime.utcnow().strftime("%Y%m%d-")
        + uuid.uuid4().hex[:6].upper()
    )

    timestamp = datetime.utcnow().strftime(
        "%Y-%m-%d %H:%M:%S UTC"
    )

   
    report = generate_ai_report(
        threat=threat,
        detections=result["detections"],
        mission_id=mission_id,
        timestamp=timestamp
    )

    
    save_mission(
        mission_id=mission_id,
        timestamp=timestamp,
        filename=file.filename,
        output_image=result["output_image"],
        detections=result["detections"],
        threat=threat,
        ai_report=report
    )

    await manager.broadcast({
        "type": "NEW_MISSION"
})

    print("✓ Mission saved successfully.")
    print(f"Mission ID : {mission_id}")
    print(f"Timestamp  : {timestamp}")

    print("\n" + "=" * 80)
    print("MISSION REPORT")
    print("=" * 80)
    print(report)
    print("=" * 80)

    return {
        "mission_id": mission_id,
        "filename": file.filename,
        "detections": result["detections"],
        "threat": threat,
        "mission_report": report,
        "output_image": result["output_image"]
    }


@router.get("/missions")
def get_all_missions():

    db = SessionLocal()

    missions = (
        db.query(Mission)
        .order_by(Mission.id.desc())
        .all()
    )

    data = []

    for mission in missions:

        data.append({
            "id": mission.id,
            "mission_id": mission.mission_id,
            "timestamp": mission.timestamp,
            "threat_level": mission.threat_level,
            "priority": mission.priority,
            "threat_score": mission.threat_score,
            "confidence": mission.confidence,
            "detected_objects": mission.detected_objects,
            "recommendation": mission.recommendation,
            "report": mission.report,
            "output_image": mission.output_image
        })

    db.close()

    return data

@router.get("/latest")
def get_latest_mission():

    db = SessionLocal()

    mission = (
        db.query(Mission)
        .order_by(Mission.id.desc())
        .first()
    )

    db.close()

    if mission is None:
        return {
            "message": "No missions found."
        }

    return {
        "id": mission.id,
        "mission_id": mission.mission_id,
        "timestamp": mission.timestamp,
        "threat_level": mission.threat_level,
        "priority": mission.priority,
        "threat_score": mission.threat_score,
        "confidence": mission.confidence,
        "detected_objects": mission.detected_objects,
        "recommendation": mission.recommendation,
        "report": mission.report,
        "output_image": mission.output_image
    }
