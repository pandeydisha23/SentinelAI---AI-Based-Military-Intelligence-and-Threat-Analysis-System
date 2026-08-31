import "./ExplainableThreatAnalysis.css";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    getThreatExplanation
} from "../../services/missionService";

import {
    FaBrain,
    FaChartBar,
    FaCheckCircle,
    FaExclamationTriangle
} from "react-icons/fa";


function ExplainableThreatAnalysis({
    mission
}) {

    const missionId =
    mission?.mission_id ??
    mission?.id;

    const [explanation, setExplanation] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    useEffect(() => {

    let mounted = true;

    const loadExplanation = async () => {

        console.log(
            "ExplainableThreatAnalysis mission:",
            mission
        );

        console.log(
            "Resolved mission ID:",
            missionId
        );

        if (!missionId) {

            console.warn(
                "No mission ID available."
            );

            setExplanation(null);
            setError("No mission selected.");

            return;
        }

        setLoading(true);
        setError("");

        try {

            const data =
                await getThreatExplanation(
                    missionId
                );

            console.log(
                "Complete mission analysis:",
                data
            );

            console.log(
                "ML analysis:",
                data?.ml_analysis
            );

            if (mounted) {

                if (data?.ml_analysis) {

                    setExplanation(
                        data.ml_analysis
                    );

                    setError("");

                } else {

                    console.warn(
                        "ml_analysis missing from API response:",
                        data
                    );

                    setExplanation(null);

                    setError(
                        "ML analysis data not found."
                    );
                }
            }

        } catch (err) {

            console.error(
                "Explainable ML error:",
                err
            );

            if (mounted) {

                setExplanation(null);

                setError(
                    "ML explanation unavailable."
                );
            }

        } finally {

            if (mounted) {
                setLoading(false);
            }

        }
    };

    loadExplanation();

    return () => {
        mounted = false;
    };

}, [missionId]);


    const contributions =
        useMemo(() => {

            const values =
                explanation?.contributions;

            if (!Array.isArray(values)) {

                return [];

            }

            return [...values]
                .sort(
                    (a, b) =>
                        Math.abs(
                            Number(b?.impact || 0)
                        ) -
                        Math.abs(
                            Number(a?.impact || 0)
                        )
                )
                .slice(0, 6);

        }, [explanation]);


    const formatFeatureName =
        (feature) => {

            if (!feature) {
                return "Unknown Feature";
            }

            return String(feature)
                .replace(/_/g, " ")
                .replace(/\b\w/g, letter =>
                    letter.toUpperCase()
                );
        };


    const formatFeatureValue =
        (feature, value) => {

            const numeric =
                Number(value);

            if (!Number.isFinite(numeric)) {
                return String(value ?? "-");
            }


            if (
                feature ===
                    "ai_confidence" ||
                feature ===
                    "average_detection_confidence" ||
                feature ===
                    "maximum_detection_confidence"
            ) {

                return `${(
                    numeric * 100
                ).toFixed(1)}%`;

            }


            if (
                feature ===
                "priority_score"
            ) {

                return numeric.toFixed(2);

            }


            if (
                feature ===
                "threat_score"
            ) {

                return numeric.toFixed(0);

            }


            return numeric.toFixed(2);

        };


    const getImpactClass =
        (impact) => {

            const value =
                Number(impact || 0);

            if (value > 0) {
                return "impact-positive";
            }

            if (value < 0) {
                return "impact-negative";
            }

            return "impact-neutral";

        };


    const getThreatClass =
        (prediction) => {

            switch (
                String(
                    prediction || ""
                ).toUpperCase()
            ) {

                case "LOW":
                    return "ml-low";

                case "MEDIUM":
                    return "ml-medium";

                case "HIGH":
                    return "ml-high";

                case "CRITICAL":
                    return "ml-critical";

                default:
                    return "ml-unknown";

            }

        };


    if (!mission) {

        return (
            <section className="explainable-threat-analysis">

                <div className="xai-empty">

                    <FaBrain />

                    <span>
                        Select a mission to view
                        ML explainability.
                    </span>

                </div>

            </section>
        );

    }


    return (

        <section
            className={`explainable-threat-analysis ${
                getThreatClass(
                    explanation?.prediction
                )
            }`}
        >

            <div className="xai-header">

                <div className="xai-heading">

                    <span className="xai-kicker">
                        MACHINE LEARNING
                        EXPLAINABILITY
                    </span>

                    <h2>
                        AI Threat Reasoning
                    </h2>

                    <p>
                        SHAP-based explanation of
                        the ML threat prediction.
                    </p>

                </div>


                <div className="xai-model">

                    <FaBrain />

                    <span>
                        {explanation?.model ||
                            "ML MODEL"}
                    </span>

                </div>

            </div>


            {loading && (

                <div className="xai-loading">

                    <div className="xai-loader"></div>

                    <span>
                        Running ML explanation...
                    </span>

                </div>

            )}


            {!loading && error && (

                <div className="xai-error">

                    <FaExclamationTriangle />

                    <span>
                        {error}
                    </span>

                </div>

            )}


            {!loading &&
                !error &&
                explanation && (

                <>

                    <div className="xai-prediction">

                        <div>

                            <span>
                                ML PREDICTION
                            </span>

                            <strong>
                                {String(
                                    explanation.prediction ||
                                    "UNKNOWN"
                                ).toUpperCase()}
                            </strong>

                        </div>


                        <div className="xai-confidence">

                            <span>
                                MODEL CONFIDENCE
                            </span>

                            <strong>
                                {Number(
                                    explanation.confidence ||
                                    0
                                ).toFixed(2)}
                                %
                            </strong>

                        </div>

                    </div>


                    <div className="xai-section">

                        <div className="xai-section-header">

                            <div>

                                <FaChartBar />

                                <span>
                                    FEATURE CONTRIBUTIONS
                                </span>

                            </div>

                            <small>
                                SHAP
                            </small>

                        </div>


                        {contributions.length === 0 ? (

                            <div className="xai-no-data">

                                No SHAP contribution
                                data available.

                            </div>

                        ) : (

                            <div className="xai-features">

                                {contributions.map(
                                    (item, index) => {

                                        const impact =
                                            Number(
                                                item?.impact ||
                                                0
                                            );

                                        const magnitude =
                                            Math.min(
                                                100,
                                                Math.abs(
                                                    impact
                                                ) * 100
                                            );


                                        return (

                                            <div
                                                className="xai-feature"
                                                key={`${item.feature}-${index}`}
                                            >

                                                <div className="xai-feature-top">

                                                    <span className="xai-feature-name">

                                                        {formatFeatureName(
                                                            item.feature
                                                        )}

                                                    </span>

                                                    <span className="xai-feature-value">

                                                        {formatFeatureValue(
                                                            item.feature,
                                                            item.value
                                                        )}

                                                    </span>

                                                </div>


                                                <div className="xai-impact-row">

                                                    <div className="xai-impact-track">

                                                        <div
                                                            className={`xai-impact-fill ${getImpactClass(
                                                                impact
                                                            )}`}
                                                            style={{
                                                                width:
                                                                    `${magnitude}%`
                                                            }}
                                                        />

                                                    </div>


                                                    <strong
                                                        className={getImpactClass(
                                                            impact
                                                        )}
                                                    >

                                                        {impact >= 0
                                                            ? "+"
                                                            : ""}

                                                        {impact.toFixed(
                                                            3
                                                        )}

                                                    </strong>

                                                </div>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        )}

                    </div>


                    <div className="xai-section">

                        <div className="xai-section-header">

                            <div>

                                <FaCheckCircle />

                                <span>
                                    INPUT FEATURES
                                </span>

                            </div>

                        </div>


                        <div className="xai-input-grid">

                            {Object.entries(
                                explanation.features ||
                                {}
                            ).map(
                                ([feature, value]) => (

                                    <div
                                        className="xai-input"
                                        key={feature}
                                    >

                                        <span>
                                            {formatFeatureName(
                                                feature
                                            )}
                                        </span>

                                        <strong>
                                            {formatFeatureValue(
                                                feature,
                                                value
                                            )}
                                        </strong>

                                    </div>

                                )
                            )}

                        </div>

                    </div>


                    <div className="xai-footer">

                        <span>
                            MISSION
                        </span>

                        <strong>
                            {missionId}
                        </strong>

                        <span>
                            EXPLANATION GENERATED
                            FROM MODEL OUTPUT
                        </span>

                    </div>

                </>
            )}

        </section>

    );

}


export default ExplainableThreatAnalysis;