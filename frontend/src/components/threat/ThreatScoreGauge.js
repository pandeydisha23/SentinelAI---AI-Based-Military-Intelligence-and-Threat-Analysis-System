import "./ThreatScoreGauge.css";

function ThreatScoreGauge({ score = 0, level = "UNKNOWN" }) {
    const numericScore = Math.max(
        0,
        Math.min(100, Number(score) || 0)
    );

    const getClassName = () => {
        switch (String(level).toUpperCase()) {
            case "CRITICAL":
                return "critical";

            case "HIGH":
                return "high";

            case "MEDIUM":
                return "medium";

            case "LOW":
                return "low";

            default:
                return "unknown";
        }
    };

    return (
        <div className={`threat-gauge ${getClassName()}`}>

            <div className="threat-gauge-header">
                <div>
                    <span className="threat-gauge-label">
                        THREAT SCORE
                    </span>

                    <h3>Threat Assessment</h3>
                </div>

                <span className="threat-gauge-status">
                    {level}
                </span>
            </div>

            <div className="gauge-wrapper">

                <div
                    className="gauge-ring"
                    style={{
                        "--score": `${numericScore * 3.6}deg`
                    }}
                >
                    <div className="gauge-inner">

                        <strong>
                            {Math.round(numericScore)}
                        </strong>

                        <span>
                            / 100
                        </span>

                    </div>
                </div>

            </div>

            <div className="gauge-scale">

                <span>LOW</span>
                <span>MEDIUM</span>
                <span>HIGH</span>
                <span>CRITICAL</span>

            </div>

        </div>
    );
}

export default ThreatScoreGauge;