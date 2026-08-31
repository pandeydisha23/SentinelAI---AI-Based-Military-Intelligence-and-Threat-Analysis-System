from collections import Counter
from datetime import datetime, timedelta
import re

from app.database import SessionLocal
from app.models import Mission



def save_mission(
    mission_id,
    timestamp,
    filename,
    output_image,
    detections,
    threat,
    ai_report
):
    db = SessionLocal()

    try:
        objects = ", ".join(
            [
                f"{d['object']} ({int(d['confidence'] * 100)}%)"
                for d in detections
            ]
        )

        mission = Mission(
            mission_id=mission_id,
            timestamp=timestamp,

            threat_level=threat["risk_level"],
            priority=threat["priority"],
            threat_score=threat["threat_score"],
            confidence=threat["confidence"],

            detected_objects=objects,

            recommendation=threat["recommended_action"],

            report=ai_report,

            output_image=output_image
        )

        db.add(mission)
        db.commit()
        db.refresh(mission)

        print("✓ Mission saved successfully.")
        print("Mission ID:", mission_id)
        print("Timestamp :", timestamp)

        return mission

    except Exception as error:
        db.rollback()

        print("✗ Failed to save mission:")
        print(error)

        raise

    finally:
        db.close()



def get_all_missions():
    """
    Returns all missions from the database.
    """

    db = SessionLocal()

    try:
        missions = (
            db.query(Mission)
            .order_by(Mission.timestamp.desc())
            .all()
        )

        return missions

    finally:
        db.close()


def get_mission_analytics():
    """
    Generates analytics for the SentinelAI dashboard.

    Uses the existing Mission database table.
    Does NOT interfere with YOLO or WebSocket functionality.
    """

    db = SessionLocal()

    try:

        missions = (
            db.query(Mission)
            .order_by(Mission.timestamp.desc())
            .all()
        )


        total_missions = len(missions)

        total_objects = 0

        total_confidence = 0

        total_threat_score = 0

        for mission in missions:

            total_confidence += float(
                mission.confidence or 0
            )

            total_threat_score += float(
                mission.threat_score or 0
            )

            if mission.detected_objects:

                objects = [
                    obj.strip()
                    for obj in
                    mission.detected_objects.split(",")
                    if obj.strip()
                ]

                total_objects += len(objects)

        if total_missions > 0:

            average_confidence = (
                total_confidence /
                total_missions
            )

            average_threat_score = (
                total_threat_score /
                total_missions
            )

        else:

            average_confidence = 0

            average_threat_score = 0


        risk_categories = {
            "LOW": 0,
            "MEDIUM": 0,
            "HIGH": 0,
            "CRITICAL": 0
        }

        for mission in missions:

            risk = str(
                mission.threat_level or "LOW"
            ).upper()

            if risk in risk_categories:

                risk_categories[risk] += 1


        object_counter = Counter()

        for mission in missions:

            if not mission.detected_objects:
                continue

            objects = mission.detected_objects.split(",")

            for obj in objects:

                obj = obj.strip()

                if not obj:
                    continue


                match = re.match(
                    r"^(.*?)\s*\(\d+%\)",
                    obj
                )

                if match:

                    object_name = (
                        match.group(1).strip()
                    )

                else:

                    object_name = obj

                if object_name:

                    object_counter[
                        object_name
                    ] += 1


        top_objects = [
            {
                "object": object_name,
                "count": count
            }
            for object_name, count
            in object_counter.most_common(5)
        ]


        today = datetime.now().date()

        weekly_threat = []

        for days_ago in range(6, -1, -1):

            current_date = (
                today -
                timedelta(days=days_ago)
            )

            daily_threat_score = 0

            daily_missions = 0

            for mission in missions:

                if not mission.timestamp:
                    continue

                try:

                    timestamp = mission.timestamp

                    
                    if isinstance(
                        timestamp,
                        datetime
                    ):

                        mission_date = (
                            timestamp.date()
                        )

                    else:

                        mission_datetime = (
                            datetime.fromisoformat(
                                str(timestamp)
                            )
                        )

                        mission_date = (
                            mission_datetime.date()
                        )

                except Exception:

                    continue

                if mission_date == current_date:

                    daily_threat_score += float(
                        mission.threat_score or 0
                    )

                    daily_missions += 1


            weekly_threat.append(
                {
                    "date":
                        current_date.strftime("%a"),

                    "threat_score":
                        round(
                            daily_threat_score,
                            2
                        ),

                    "missions":
                        daily_missions
                }
            )


        # ----------------------------------------------------
        # RECENT MISSIONS
        # ----------------------------------------------------

        recent_missions = []

        for mission in missions[:10]:

            recent_missions.append(
                {
                    "mission_id":
                        mission.mission_id,

                    "timestamp":
                        str(
                            mission.timestamp
                        ),

                    "threat_level":
                        mission.threat_level,

                    "priority":
                        mission.priority,

                    "threat_score":
                        mission.threat_score,

                    "confidence":
                        mission.confidence,

                    "detected_objects":
                        mission.detected_objects,

                    "recommendation":
                        mission.recommendation,

                    "output_image":
                        mission.output_image
                }
            )


        return {

            "summary": {

                "total_missions":
                    total_missions,

                "total_objects":
                    total_objects,

                "average_confidence":
                    round(
                        average_confidence,
                        2
                    ),

                "average_threat_score":
                    round(
                        average_threat_score,
                        2
                    )
            },

            "risk_categories":
                risk_categories,

            "top_objects":
                top_objects,

            "weekly_threat":
                weekly_threat,

            "recent_missions":
                recent_missions
        }

    finally:

        db.close()