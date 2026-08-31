import React, { useEffect, useState } from "react";
import axios from "axios";


const API_BASE_URL = "http://127.0.0.1:8000";


function ThreatAnalysis({ missionId }) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {

        if (!missionId) {
            return;
        }

        const fetchAnalysis = async () => {

            try {

                setLoading(true);
                setError(null);

                const response = await axios.get(
                    `${API_BASE_URL}/analytics/mission/${missionId}`
                );

                setData(response.data);

            } catch (err) {

                console.error(
                    "Threat analysis error:",
                    err
                );

                setError(
                    "Unable to load threat analysis."
                );

            } finally {

                setLoading(false);

            }
        };


        fetchAnalysis();

    }, [missionId]);


    if (loading) {

        return (
            <div className="p-6 text-center">
                Loading threat analysis...
            </div>
        );
    }


    if (error) {

        return (
            <div className="p-6 text-red-600">
                {error}
            </div>
        );
    }


    if (!data) {

        return (
            <div className="p-6">
                No analysis available.
            </div>
        );
    }


    const mission = data.mission;
    const rule = data.rule_analysis;
    const ml = data.ml_analysis;


    return (

        <div className="space-y-6 p-6">

            {/* Header */}

            <div>

                <h1 className="text-3xl font-bold">
                    Threat Intelligence Analysis
                </h1>

                <p className="text-gray-500">
                    Mission #{mission.id}
                </p>

            </div>


            {/* Summary Cards */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

                {/* Risk */}

                <div className="rounded-xl bg-white p-5 shadow">

                    <p className="text-sm text-gray-500">
                        Threat Level
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        {rule.risk_level}
                    </h2>

                </div>


                {/* Threat Score */}

                <div className="rounded-xl bg-white p-5 shadow">

                    <p className="text-sm text-gray-500">
                        Threat Score
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        {rule.threat_score}
                    </h2>

                </div>


                {/* ML Confidence */}

                <div className="rounded-xl bg-white p-5 shadow">

                    <p className="text-sm text-gray-500">
                        AI Confidence
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        {ml.confidence}%
                    </h2>

                </div>


                {/* Priority */}

                <div className="rounded-xl bg-white p-5 shadow">

                    <p className="text-sm text-gray-500">
                        Priority
                    </p>

                    <h2 className="mt-2 text-2xl font-bold">
                        {rule.priority}
                    </h2>

                </div>

            </div>


            {/* Mission Information */}

            <div className="rounded-xl bg-white p-6 shadow">

                <h2 className="mb-4 text-xl font-semibold">
                    Mission Information
                </h2>


                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <div>
                        <p className="text-sm text-gray-500">
                            Detected Objects
                        </p>

                        <p className="font-medium">
                            {mission.detected_objects || "None"}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-gray-500">
                            Detection Confidence
                        </p>

                        <p className="font-medium">
                            {mission.confidence}%
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-gray-500">
                            Rule-Based Risk
                        </p>

                        <p className="font-medium">
                            {rule.risk_level}
                        </p>
                    </div>


                    <div>
                        <p className="text-sm text-gray-500">
                            ML Prediction
                        </p>

                        <p className="font-medium">
                            {ml.prediction}
                        </p>
                    </div>

                </div>

            </div>


            {/* Recommended Action */}

            <div className="rounded-xl bg-white p-6 shadow">

                <h2 className="mb-3 text-xl font-semibold">
                    Recommended Action
                </h2>

                <p className="text-gray-700">
                    {rule.recommended_action}
                </p>

            </div>


            {/* Explainable AI */}

            <div className="rounded-xl bg-white p-6 shadow">

                <div className="mb-5">

                    <h2 className="text-xl font-semibold">
                        Explainable AI
                    </h2>

                    <p className="text-sm text-gray-500">
                        SHAP-based feature contributions
                    </p>

                </div>


                <div className="space-y-4">

                    {ml.contributions.map(
                        (item, index) => {

                            const impact =
                                Math.abs(
                                    item.impact
                                );

                            const width =
                                Math.min(
                                    impact * 100,
                                    100
                                );


                            return (

                                <div
                                    key={index}
                                    className="space-y-1"
                                >

                                    <div className="flex justify-between">

                                        <span className="font-medium">
                                            {item.feature}
                                        </span>

                                        <span className="text-sm text-gray-500">
                                            {item.impact}
                                        </span>

                                    </div>


                                    <div className="h-3 w-full rounded-full bg-gray-200">

                                        <div
                                            className="h-3 rounded-full bg-blue-600"
                                            style={{
                                                width:
                                                    `${width}%`
                                            }}
                                        />

                                    </div>

                                </div>

                            );

                        }
                    )}

                </div>

            </div>


            {/* Model Information */}

            <div className="rounded-xl bg-gray-900 p-6 text-white">

                <h2 className="text-xl font-semibold">
                    AI Model
                </h2>

                <p className="mt-2 text-gray-300">
                    {ml.model}
                </p>

            </div>

        </div>

    );
}


export default ThreatAnalysis;