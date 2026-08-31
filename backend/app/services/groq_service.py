from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")

if not API_KEY:
    raise ValueError("GROQ_API_KEY not found in .env file")

client = Groq(api_key=API_KEY)


def generate_ai_report(
    threat,
    detections,
    mission_id,
    timestamp
):

    detected_objects = "\n".join(
        [
            f"- {d['object'].title()} ({int(d['confidence'] * 100)}%)"
            for d in detections
        ]
    )

    prompt = f"""
You are SentinelAI, an AI-powered Defence Surveillance Intelligence Assistant.

Generate ONLY the following sections.

1. Executive Summary
2. Threat Assessment
3. Operational Recommendation
4. Overall Assessment

Rules:

- Never invent facts.
- Never assume criminal activity.
- Never speculate.
- Only describe what can be inferred from the detected objects.
- Keep the report professional.
- Do NOT generate mission IDs, timestamps, tables, or markdown.

Threat Information

Risk Level:
{threat["risk_level"]}

Priority:
{threat["priority"]}

Threat Score:
{threat["threat_score"]}

Detection Confidence:
{threat["confidence"]}%

Recommended Action:
{threat["recommended_action"]}

Detected Objects

{detected_objects}
"""

    try:

        print("Calling Groq...")

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2,
            max_tokens=700,
        )

        ai_report = completion.choices[0].message.content

        print("✓ Groq completed")

        final_report = f"""
============================================================
                     SENTINELAI
             Military Intelligence Report
============================================================

Mission ID:
{mission_id}

Timestamp:
{timestamp}

Threat Level:
{threat["risk_level"]}

Priority:
{threat["priority"]}

Threat Score:
{threat["threat_score"]}/100

Detection Confidence:
{threat["confidence"]}%

Detected Objects:
"""

        for detection in detections:
            final_report += (
                f"\n• {detection['object'].title()} "
                f"({int(detection['confidence'] * 100)}%)"
            )

        final_report += f"""

============================================================

{ai_report}

============================================================
End of Report
============================================================
"""

        return final_report

    except Exception as e:
        return f"AI Report Generation Failed: {str(e)}"