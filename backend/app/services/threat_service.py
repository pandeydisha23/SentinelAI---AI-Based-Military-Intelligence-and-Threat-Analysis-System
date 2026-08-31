THREAT_RULES = {

    "person": {
        "score": 35,
        "risk": "MEDIUM",
        "priority": "Monitor",
        "action": "Continue monitoring the individual."
    },

    "car": {
        "score": 30,
        "risk": "MEDIUM",
        "priority": "Monitor",
        "action": "Track vehicle movement."
    },

    "truck": {
        "score": 45,
        "risk": "HIGH",
        "priority": "High Alert",
        "action": "Investigate immediately."
    },

    "bus": {
        "score": 40,
        "risk": "HIGH",
        "priority": "High Alert",
        "action": "Monitor passenger activity."
    },

    "dog": {
        "score": 5,
        "risk": "LOW",
        "priority": "Routine",
        "action": "No immediate action required."
    },

    "chair": {
        "score": 2,
        "risk": "LOW",
        "priority": "Routine",
        "action": "Furniture detected."
    },

    "dining table": {
        "score": 2,
        "risk": "LOW",
        "priority": "Routine",
        "action": "Furniture detected."
    },

    "bowl": {
        "score": 1,
        "risk": "LOW",
        "priority": "Routine",
        "action": "Kitchen object detected."
    },

    "vase": {
        "score": 1,
        "risk": "LOW",
        "priority": "Routine",
        "action": "Decorative object detected."
    }

}

RISK_LEVELS = {
    "LOW": 1,
    "MEDIUM": 2,
    "HIGH": 3,
    "CRITICAL": 4
}


def analyze_threat(detections):

    total_score = 0

    highest_risk = "LOW"

    highest_priority = "Routine"

    recommended_action = "No immediate action required."

    confidence = 0

    detected_objects = []

    for detection in detections:

        obj = detection["object"]

        conf = detection["confidence"]

        detected_objects.append(obj)

        confidence = max(confidence, int(conf * 100))

        if obj in THREAT_RULES:

            rule = THREAT_RULES[obj]

            total_score += rule["score"]

            if RISK_LEVELS[rule["risk"]] > RISK_LEVELS[highest_risk]:

                highest_risk = rule["risk"]

                highest_priority = rule["priority"]

                recommended_action = rule["action"]

       


    if "person" in detected_objects and "car" in detected_objects:

        total_score += 20

        if RISK_LEVELS["HIGH"] > RISK_LEVELS[highest_risk]:
            highest_risk = "HIGH"
            highest_priority = "High Alert"
            recommended_action = "Person detected near vehicle. Monitor closely."


    if "person" in detected_objects and "truck" in detected_objects:

        total_score += 40

        if RISK_LEVELS["HIGH"] > RISK_LEVELS[highest_risk]:
            highest_risk = "HIGH"
            highest_priority = "Emergency"
            recommended_action = (
                "Potential military logistics activity detected. Immediate investigation required."
            )

        
    return {

        "risk_level": highest_risk,

        "priority": highest_priority,

        "recommended_action": recommended_action,

        "threat_score": total_score,

        "confidence": confidence,

        "objects_detected": detected_objects

}