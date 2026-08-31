import "./AIAnalysisPanel.css";

function AIAnalysisPanel({ report, threatLevel }) {
    const level = String(threatLevel || "UNKNOWN").toUpperCase();

    const getThreatClass = () => {
        switch (level) {
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

    return (
        <section className="ai-analysis-panel">

            <div className="ai-analysis-header">

                <div className="ai-analysis-title">

                    <span className="ai-analysis-kicker">
                        ARTIFICIAL INTELLIGENCE
                    </span>

                    <h2>
                        AI Threat Analysis
                    </h2>

                    <p>
                        Automated intelligence assessment
                    </p>

                </div>

                <div className="ai-analysis-status">
                    <span className="ai-status-dot"></span>
                    AI ONLINE
                </div>

            </div>


            <div className="ai-threat-section">

                <div className="ai-threat-label">
                    <span>THREAT ASSESSMENT</span>

                    <span
                        className={`ai-threat-badge ${getThreatClass()}`}
                    >
                        {level}
                    </span>
                </div>


                <div className="threat-indicator">

                    <div className="threat-indicator-track">

                        <div
                            className={`threat-indicator-fill ${getThreatClass()}`}
                        ></div>

                    </div>

                    <div className="threat-scale">

                        <span>LOW</span>
                        <span>MEDIUM</span>
                        <span>HIGH</span>
                        <span>CRITICAL</span>

                    </div>

                </div>

            </div>


            <div className="ai-report-section">

                <div className="ai-report-header">

                    <span className="report-icon">
                        ◈
                    </span>

                    <span>
                        INTELLIGENCE REPORT
                    </span>

                </div>


                <div className="ai-report-content">

                    {report ? (
                        <p>
                            {report}
                        </p>
                    ) : (
                        <p className="ai-report-empty">
                            Awaiting AI-generated mission intelligence...
                        </p>
                    )}

                </div>

            </div>


            <div className="ai-analysis-footer">

                <div>
                    <span className="footer-label">
                        ANALYSIS ENGINE
                    </span>

                    <strong>
                        SentinelAI
                    </strong>
                </div>

                <div>
                    <span className="footer-label">
                        STATUS
                    </span>

                    <strong className="footer-online">
                        OPERATIONAL
                    </strong>
                </div>

            </div>

        </section>
    );
}

export default AIAnalysisPanel;