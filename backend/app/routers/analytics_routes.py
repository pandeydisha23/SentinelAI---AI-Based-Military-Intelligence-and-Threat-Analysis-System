from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Mission
from app.services.threat_service import analyze_threat

from app.services.threat_ml_service import (
    train_threat_model,
    explain_mission
)


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("/overview")
def analytics_overview(
    db: Session = Depends(get_db)
):

    missions = db.query(Mission).all()

    total_missions = len(missions)

    low = 0
    medium = 0
    high = 0
    critical = 0

    for mission in missions:

        level = str(
            mission.threat_level or ""
        ).upper()

        if level == "LOW":
            low += 1

        elif level == "MEDIUM":
            medium += 1

        elif level == "HIGH":
            high += 1

        elif level == "CRITICAL":
            critical += 1

    return {
        "total_missions": total_missions,
        "low": low,
        "medium": medium,
        "high": high,
        "critical": critical
    }


@router.post("/train-threat-model")
def train_model(
    db: Session = Depends(get_db)
):

    try:

        result = train_threat_model(db)

        return {
            "success": True,
            "message": "Threat ML model trained successfully.",
            "training": result
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Model training failed: {str(e)}"
        )


@router.get("/threat-prediction/{mission_id}")
def threat_prediction(
    mission_id: int,
    db: Session = Depends(get_db)
):

    mission = (
        db.query(Mission)
        .filter(Mission.id == mission_id)
        .first()
    )

    if mission is None:

        raise HTTPException(
            status_code=404,
            detail="Mission not found."
        )

    try:

        result = explain_mission(mission)

        return {
            "success": True,
            "mission_id": mission_id,
            "prediction": result["prediction"],
            "confidence": result["confidence"],
            "features": result["features"],
            "contributions": result["contributions"],
            "model": result["model"]
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Threat prediction failed: {str(e)}"
        )
@router.get("/mission/{mission_id}")
def complete_mission_analysis(
    mission_id: int,
    db: Session = Depends(get_db)
):

    mission = (
        db.query(Mission)
        .filter(Mission.id == mission_id)
        .first()
    )

    if mission is None:
        raise HTTPException(
            status_code=404,
            detail="Mission not found."
        )
    

    detections = []

    detected_objects = mission.detected_objects

    if detected_objects:

        text = str(detected_objects)

        import re

        parts = text.split(",")

        for item in parts:

            item = item.strip()

            if not item:
                continue

            match = re.match(
                r"(.+?)\s*\((\d+(?:\.\d+)?)%\)",
                item
            )

            if match:

                object_name = match.group(1).strip()

                confidence = (
                    float(match.group(2)) / 100
                )

                detections.append({
                    "object": object_name,
                    "confidence": confidence
                })

            else:

                detections.append({
                    "object": item,
                    "confidence": 0.0
                })

    if detections:

        rule_analysis = analyze_threat(
            detections
        )

    else:

        rule_analysis = {
            "risk_level": str(
                mission.threat_level or "LOW"
            ).upper(),

            "priority": (
                mission.priority
                or "Routine"
            ),

            "recommended_action":
                "No immediate action required.",

            "threat_score":
                int(mission.threat_score or 0),

            "confidence":
                int(mission.confidence or 0),

            "objects_detected": []
        }

    try:

        ml_analysis = explain_mission(
            mission
        )

    except ValueError:

        ml_analysis = {
            "prediction": None,
            "confidence": 0,
            "features": {},
            "contributions": [],
            "model": "RandomForest + SHAP"
        }


    return {

        "success": True,

        "mission": {

            "id": mission.id,

            "threat_level":
                mission.threat_level,

            "priority":
                mission.priority,

            "threat_score":
                mission.threat_score,

            "confidence":
                mission.confidence,

            "detected_objects":
                mission.detected_objects
        },

        "rule_analysis": {

            "risk_level":
                rule_analysis["risk_level"],

            "priority":
                rule_analysis["priority"],

            "recommended_action":
                rule_analysis[
                    "recommended_action"
                ],

            "threat_score":
                rule_analysis["threat_score"],

            "confidence":
                rule_analysis["confidence"],

            "objects_detected":
                rule_analysis[
                    "objects_detected"
                ]
        },

        "ml_analysis": {

            "prediction":
                ml_analysis["prediction"],

            "confidence":
                ml_analysis["confidence"],

            "features":
                ml_analysis["features"],

            "contributions":
                ml_analysis["contributions"],

            "model":
                ml_analysis["model"]
        }
    }