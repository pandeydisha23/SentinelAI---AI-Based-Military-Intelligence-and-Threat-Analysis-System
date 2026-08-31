import "./ThreatAnalytics.css";
import { useMemo } from "react";

function ThreatAnalytics({ missions = [] }) {

    const analytics = useMemo(() => {

        if (!Array.isArray(missions) || missions.length === 0) {
            return {
                averageThreat: 0,
                peakThreat: 0,
                minimumThreat: 0,
                highThreatPercentage: 0,
                averageConfidence: 0,
                trend: 0
            };
        }

        const threatScores = missions
            .map((mission) =>
                Number(mission?.threat_score ?? 0)
            )
            .filter((score) => !Number.isNaN(score));

        const confidenceScores = missions
            .map((mission) =>
                Number(mission?.confidence ?? 0)
            )
            .filter((score) => !Number.isNaN(score));

        const averageThreat =
            threatScores.length
                ? Math.round(
                    threatScores.reduce(
                        (sum, score) =>
                            sum + score,
                        0
                    ) / threatScores.length
                )
                : 0;

        const peakThreat =
            threatScores.length
                ? Math.max(...threatScores)
                : 0;

        const minimumThreat =
            threatScores.length
                ? Math.min(...threatScores)
                : 0;

        const averageConfidence =
            confidenceScores.length
                ? Math.round(
                    confidenceScores.reduce(
                        (sum, score) =>
                            sum + score,
                        0
                    ) / confidenceScores.length
                )
                : 0;

        const highThreatMissions =
            missions.filter((mission) => {

                const level = String(
                    mission?.threat_level || ""
                ).toUpperCase();

                return (
                    level === "HIGH" ||
                    level === "CRITICAL"
                );
            }).length;

        const highThreatPercentage =
            missions.length
                ? Math.round(
                    (highThreatMissions /
                        missions.length) *
                    100
                )
                : 0;

        let trend = 0;

        if (threatScores.length >= 2) {

            const midpoint =
                Math.floor(
                    threatScores.length / 2
                );

            const previous =
                threatScores
                    .slice(0, midpoint);

            const recent =
                threatScores
                    .slice(midpoint);

            const previousAverage =
                previous.length
                    ? previous.reduce(
                        (sum, value) =>
                            sum + value,
                        0
                    ) / previous.length
                    : 0;

            const recentAverage =
                recent.length
                    ? recent.reduce(
                        (sum, value) =>
                            sum + value,
                        0
                    ) / recent.length
                    : 0;

            if (previousAverage > 0) {

                trend = Math.round(
                    (
                        (
                            recentAverage -
                            previousAverage
                        ) /
                        previousAverage
                    ) * 100
                );
            }
        }

        return {
            averageThreat,
            peakThreat,
            minimumThreat,
            highThreatPercentage,
            averageConfidence,
            trend
        };

    }, [missions]);


    const getTrendClass = () => {

        if (analytics.trend > 0) {
            return "trend-up";
        }

        if (analytics.trend < 0) {
            return "trend-down";
        }

        return "trend-stable";
    };


    const getTrendLabel = () => {

        if (analytics.trend > 0) {
            return "RISING";
        }

        if (analytics.trend < 0) {
            return "DECLINING";
        }

        return "STABLE";
    };


    return (
        <section className="threat-analytics">

            <div className="threat-analytics-header">

                <div>

                    <span className="analytics-kicker">
                        DATA ANALYTICS // THREAT INTELLIGENCE
                    </span>

                    <h2>
                        Threat Analytics
                    </h2>

                    <p>
                        Historical analysis of SentinelAI mission intelligence
                    </p>

                </div>

                <span className="analytics-status">
                    ● ANALYTICS ACTIVE
                </span>

            </div>


            <div className="threat-analytics-grid">

                <div className="threat-analytics-card">

                    <span>
                        AVG THREAT SCORE
                    </span>

                    <strong>
                        {analytics.averageThreat}
                    </strong>

                    <small>
                        Across all missions
                    </small>

                </div>


                <div className="threat-analytics-card">

                    <span>
                        PEAK THREAT
                    </span>

                    <strong>
                        {analytics.peakThreat}
                    </strong>

                    <small>
                        Highest recorded score
                    </small>

                </div>


                <div className="threat-analytics-card">

                    <span>
                        MIN THREAT
                    </span>

                    <strong>
                        {analytics.minimumThreat}
                    </strong>

                    <small>
                        Lowest recorded score
                    </small>

                </div>


                <div className="threat-analytics-card">

                    <span>
                        HIGH RISK
                    </span>

                    <strong>
                        {analytics.highThreatPercentage}%
                    </strong>

                    <small>
                        High / Critical missions
                    </small>

                </div>


                <div className="threat-analytics-card">

                    <span>
                        AVG AI CONFIDENCE
                    </span>

                    <strong>
                        {analytics.averageConfidence}%
                    </strong>

                    <small>
                        Detection confidence
                    </small>

                </div>


                <div className="threat-analytics-card trend-card">

                    <span>
                        THREAT TREND
                    </span>

                    <strong
                        className={getTrendClass()}
                    >
                        {analytics.trend > 0
                            ? "+"
                            : ""}
                        {analytics.trend}%
                    </strong>

                    <small
                        className={getTrendClass()}
                    >
                        {getTrendLabel()}
                    </small>

                </div>

            </div>

        </section>
    );
}

export default ThreatAnalytics;