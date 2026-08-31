def generate_report(detections, threat):

    report = ""

    report += "=====================================\n"
    report += "      MISSION ANALYSIS REPORT\n"
    report += "=====================================\n\n"

    report += "Detected Objects\n"
    report += "-------------------------\n"

    if len(detections) == 0:

        report += "No objects detected.\n\n"

    else:

        for detection in detections:

            obj = detection["object"]

            confidence = round(
                detection["confidence"] * 100
            )

            report += f"- {obj.upper()} ({confidence}% confidence)\n"

        report += "\n"

    report += "Threat Intelligence\n"
    report += "-------------------------\n"

    report += f"Risk Level : {threat['risk_level']}\n"

    report += f"Priority : {threat['priority']}\n"

    report += f"Threat Score : {threat['threat_score']}\n"

    report += f"Confidence : {threat['confidence']}%\n\n"

    report += "Recommended Action\n"
    report += "-------------------------\n"

    report += f"{threat['recommended_action']}\n\n"

    report += "Objects Identified\n"
    report += "-------------------------\n"

    for obj in threat["objects_detected"]:

        report += f"• {obj}\n"

    report += "\n"

    report += "=====================================\n"

    report += "End of Mission Report"

    return report