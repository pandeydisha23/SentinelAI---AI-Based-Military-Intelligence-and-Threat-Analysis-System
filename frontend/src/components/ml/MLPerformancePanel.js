import "./MLPerformancePanel.css";

function MLPerformancePanel({ performance }) {

    if (!performance) {
        return (
            <section className="ml-performance-panel">

                <div className="ml-performance-header">
                    <div>
                        <span className="ml-performance-kicker">
                            MACHINE LEARNING
                        </span>

                        <h2>
                            Model Performance
                        </h2>
                    </div>

                    <span className="ml-status">
                        ● LOADING
                    </span>
                </div>

                <div className="ml-loading">
                    Loading ML evaluation results...
                </div>

            </section>
        );
    }

    if (performance.available === false) {
        return (
            <section className="ml-performance-panel">

                <div className="ml-performance-header">
                    <div>
                        <span className="ml-performance-kicker">
                            MACHINE LEARNING
                        </span>

                        <h2>
                            Model Performance
                        </h2>
                    </div>

                    <span className="ml-status ml-offline">
                        ● UNAVAILABLE
                    </span>
                </div>

                <div className="ml-error">
                    {performance.message ||
                        "ML evaluation results are unavailable."}
                </div>

            </section>
        );
    }

    const results =
        performance.results || performance;

    const metrics =
        results.metrics || {};

    const classDistribution =
        results.class_distribution || {};

    const featureImportance =
        results.feature_importance || {};

    const classificationReport =
        results.classification_report || {};

    const confusionMatrix =
        results.confusion_matrix || [];

    const metricCards = [
        {
            label: "ACCURACY",
            value: metrics.accuracy
        },
        {
            label: "PRECISION",
            value: metrics.precision
        },
        {
            label: "RECALL",
            value: metrics.recall
        },
        {
            label: "F1 SCORE",
            value: metrics.f1_score
        }
    ];

    return (
        <section className="ml-performance-panel">

            <div className="ml-performance-header">

                <div>

                    <span className="ml-performance-kicker">
                        MACHINE LEARNING // MODEL EVALUATION
                    </span>

                    <h2>
                        Threat Classification Performance
                    </h2>

                    <p>
                        Random Forest threat classification
                        evaluated on historical mission data.
                    </p>

                </div>

                <span className="ml-status">
                    ● MODEL READY
                </span>

            </div>


            <div className="ml-model-info">

                <div>
                    <span>MODEL</span>
                    <strong>
                        {results.model || "RandomForestClassifier"}
                    </strong>
                </div>

                <div>
                    <span>TOTAL SAMPLES</span>
                    <strong>
                        {results.samples ?? 0}
                    </strong>
                </div>

                <div>
                    <span>TRAINING</span>
                    <strong>
                        {results.training_samples ?? 0}
                    </strong>
                </div>

                <div>
                    <span>TESTING</span>
                    <strong>
                        {results.testing_samples ?? 0}
                    </strong>
                </div>

            </div>


            <div className="ml-metrics-grid">

                {metricCards.map((metric) => (

                    <div
                        className="ml-metric-card"
                        key={metric.label}
                    >

                        <span>
                            {metric.label}
                        </span>

                        <strong>
                            {(Number(metric.value || 0) * 100).toFixed(2)}
                            %
                        </strong>

                    </div>

                ))}

            </div>


            <div className="ml-analysis-grid">


                <div className="ml-subpanel">

                    <div className="ml-subpanel-header">

                        <span>
                            THREAT CLASS DISTRIBUTION
                        </span>

                    </div>

                    <div className="ml-class-list">

                        {Object.entries(
                            classDistribution
                        ).map(([level, count]) => (

                            <div
                                className="ml-class-row"
                                key={level}
                            >

                                <span>
                                    {level}
                                </span>

                                <strong>
                                    {count}
                                </strong>

                            </div>

                        ))}

                    </div>

                </div>


                <div className="ml-subpanel">

                    <div className="ml-subpanel-header">

                        <span>
                            FEATURE IMPORTANCE
                        </span>

                    </div>

                    <div className="ml-feature-list">

                        {Object.entries(
                            featureImportance
                        )
                            .sort(
                                ([, a], [, b]) =>
                                    Number(b) - Number(a)
                            )
                            .map(
                                ([feature, importance]) => {

                                    const percentage =
                                        Number(importance) * 100;

                                    return (

                                        <div
                                            className="ml-feature-row"
                                            key={feature}
                                        >

                                            <div className="ml-feature-name">
                                                <span>
                                                    {feature.replace(
                                                        /_/g,
                                                        " "
                                                    )}
                                                </span>

                                                <strong>
                                                    {percentage.toFixed(2)}%
                                                </strong>
                                            </div>

                                            <div className="ml-feature-track">

                                                <div
                                                    className="ml-feature-fill"
                                                    style={{
                                                        width:
                                                            `${percentage}%`
                                                    }}
                                                />

                                            </div>

                                        </div>

                                    );
                                }
                            )}

                    </div>

                </div>

            </div>


            <div className="ml-evaluation-section">

                <div className="ml-section-title">
                    CLASSIFICATION REPORT
                </div>

                <div className="ml-report-table-wrapper">

                    <table className="ml-report-table">

                        <thead>

                            <tr>
                                <th>CLASS</th>
                                <th>PRECISION</th>
                                <th>RECALL</th>
                                <th>F1 SCORE</th>
                                <th>SUPPORT</th>
                            </tr>

                        </thead>

                        <tbody>

                            {["HIGH", "MEDIUM", "LOW"].map(
                                (level) => {

                                    const report =
                                        classificationReport[level];

                                    if (!report) {
                                        return null;
                                    }

                                    return (

                                        <tr key={level}>

                                            <td>
                                                {level}
                                            </td>

                                            <td>
                                                {(Number(
                                                    report.precision
                                                ) * 100).toFixed(2)}%
                                            </td>

                                            <td>
                                                {(Number(
                                                    report.recall
                                                ) * 100).toFixed(2)}%
                                            </td>

                                            <td>
                                                {(Number(
                                                    report["f1-score"]
                                                ) * 100).toFixed(2)}%
                                            </td>

                                            <td>
                                                {report.support}
                                            </td>

                                        </tr>

                                    );
                                }
                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            <div className="ml-evaluation-section">

                <div className="ml-section-title">
                    CONFUSION MATRIX
                </div>

                <div className="ml-confusion-wrapper">

                    <div className="ml-confusion-labels">
                        <span>ACTUAL</span>
                        <span>HIGH</span>
                        <span>LOW</span>
                        <span>MEDIUM</span>
                    </div>

                    <div className="ml-confusion-grid">

                        {confusionMatrix.map(
                            (row, rowIndex) =>

                                row.map(
                                    (value, columnIndex) => (

                                        <div
                                            className="ml-confusion-cell"
                                            key={
                                                `${rowIndex}-${columnIndex}`
                                            }
                                        >

                                            {value}

                                        </div>

                                    )
                                )
                        )}

                    </div>

                    <div className="ml-confusion-predicted">
                        PREDICTED
                    </div>

                </div>

            </div>


            <div className="ml-performance-footer">

                <span>
                    EVALUATION DATASET
                </span>

                <strong>
                    {results.samples ?? 0} MISSIONS
                </strong>

                <span>
                    MODEL
                </span>

                <strong>
                    {results.model || "RandomForestClassifier"}
                </strong>

            </div>

        </section>
    );
}

export default MLPerformancePanel;