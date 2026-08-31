from app.services.groq_service import generate_ai_report

threat = {
    "risk_level": "HIGH",
    "priority": "High Alert",
    "recommended_action": "Investigate immediately.",
    "threat_score": 82,
    "confidence": 94
}

detections = [
    {
        "object": "person",
        "confidence": 0.94
    },
    {
        "object": "truck",
        "confidence": 0.88
    }
]

print(generate_ai_report(threat, detections))