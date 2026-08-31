from app.services.gemini_service import generate_ai_report

threat = {
    "risk_level": "HIGH",
    "priority": "High Alert",
    "recommended_action": "Investigate immediately.",
    "threat_score": 75,
    "confidence": 91
}

detections = [
    {
        "object": "person",
        "confidence": 0.91
    },
    {
        "object": "car",
        "confidence": 0.88
    }
]

print(generate_ai_report(threat, detections))