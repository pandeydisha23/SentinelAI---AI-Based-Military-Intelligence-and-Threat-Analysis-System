import "./ThreatIntelligencePanel.css";

function ThreatIntelligencePanel({ mission }) {
    const threatLevel = String(
        mission?.threat_level || "UNKNOWN"
    ).toUpperCase();

    const threatScore = Math.max(
        0,
        Math.min(
            100,
            Number(mission?.threat_score ?? 0)
        )
    );

    const confidence = Math.max(
        0,
        Math.min(
            100,
            Number(mission?.confidence ?? 0)
        )
    );

    const priority = String(
        mission?.priority || "UNKNOWN"
    ).toUpperCase();

    const detectedObjects =
        mission?.detected_objects ||
        "No objects detected";

    const recommendation =
        mission?.recommendation ||
        "No recommendation available.";

    const getThreatClass = () => {
        switch (threatLevel) {
            case "LOW":
                return "threat-low";

            case "MEDIUM":
                return "threat-medium";

            case "HIGH":
                return "threat-high";

            case "CRITICAL":
                return "threat-critical";

            default:
                return "threat-unknown";
        }
    };

    const getThreatDescription = () => {
        switch (threatLevel) {
            case "LOW":
                return "LOW RISK — Continue routine monitoring.";

            case "MEDIUM":
                return "MODERATE RISK — Enhanced monitoring recommended.";

            case "HIGH":
                return "HIGH RISK — Immediate intelligence review required.";

            case "CRITICAL":
                return "CRITICAL RISK — Immediate operational attention required.";

            default:
                return "Threat assessment unavailable.";
        }
    };

    return (
        <section
            className={`threat-intelligence-panel ${getThreatClass()}`}
        >
            {/* HEADER */}
            <div className="threat-intelligence-header">

                <div className="threat-intelligence-title">

                    <span className="threat-intelligence-kicker">
                        AI THREAT INTELLIGENCE
                    </span>

                    <h2>
                        Threat Assessment
                    </h2>

                </div>

                <div className="threat-live-status">
                    <span className="threat-live-dot"></span>
                    LIVE
                </div>

            </div>


            <div className="threat-status-row">

                <div className="threat-status-info">

                    <span className="threat-label">
                        CURRENT THREAT
                    </span>

                    <span className="threat-level">
                        {threatLevel}
                    </span>

                </div>

                <div className="threat-score-box">

                    <span className="threat-score">
                        {threatScore}
                    </span>

                    <span className="threat-score-label">
                        / 100
                    </span>

                </div>

            </div>

            <div className="threat-score-section">

                <div className="threat-score-header">

                    <span>
                        THREAT SCORE
                    </span>

                    <strong>
                        {threatScore}%
                    </strong>

                </div>

                <div className="threat-score-track">

                    <div
                        className="threat-score-fill"
                        style={{
                            width: `${threatScore}%`
                        }}
                    />

                </div>

                <div className="threat-scale">

                    <span>LOW</span>
                    <span>MEDIUM</span>
                    <span>HIGH</span>
                    <span>CRITICAL</span>

                </div>

            </div>

            <div className="threat-description">

                <span className="threat-description-icon">
                    !
                </span>

                <span>
                    {getThreatDescription()}
                </span>

            </div>

            <div className="intelligence-metrics">

                <div className="intelligence-metric">

                    <span className="metric-label">
                        AI CONFIDENCE
                    </span>

                    <strong>
                        {confidence}%
                    </strong>

                </div>


                <div className="intelligence-metric">

                    <span className="metric-label">
                        PRIORITY
                    </span>

                    <strong>
                        {priority}
                    </strong>

                </div>


                <div className="intelligence-metric">

                    <span className="metric-label">
                        DETECTED
                    </span>

                    <strong>
                        {detectedObjects}
                    </strong>

                </div>

            </div>


            <div className="recommendation-section">

                <div className="recommendation-header">

                    <span className="recommendation-icon">
                        ◈
                    </span>

                    <span>
                        RECOMMENDED ACTION
                    </span>

                </div>

                <p>
                    {recommendation}
                </p>

            </div>

            <div className="mission-intelligence-footer">

                <span>
                    MISSION
                </span>

                <strong>
                    {mission?.mission_id || "NO ACTIVE MISSION"}
                </strong>

            </div>

        </section>
    );
}

export default ThreatIntelligencePanel;