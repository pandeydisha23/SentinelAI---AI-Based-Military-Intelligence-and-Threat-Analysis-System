import "./MissionAnalytics.css";

import {
    useMemo
} from "react";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";


function MissionAnalytics({
    analytics,
    threatDistribution,
    missions
}) {


    const distribution = {

        low:
            threatDistribution?.low ??
            analytics?.threat_distribution?.low ??
            0,

        medium:
            threatDistribution?.medium ??
            analytics?.threat_distribution?.medium ??
            0,

        high:
            threatDistribution?.high ??
            analytics?.threat_distribution?.high ??
            0,

        critical:
            threatDistribution?.critical ??
            analytics?.threat_distribution?.critical ??
            0

    };


    const weeklyTrend = useMemo(() => {

        const days = [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun"
        ];


        const result = days.map((day) => ({

            day,

            missions: 0

        }));


        (missions || []).forEach((mission) => {

            const timestamp =
                mission?.timestamp ??
                mission?.created_at ??
                mission?.createdAt;


            if (!timestamp) return;


            const date = new Date(
                timestamp.replace?.(" UTC", "Z") ||
                timestamp
            );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return;

            }


            const day =
                date.getDay();


            const index =
                day === 0
                    ? 6
                    : day - 1;


            if (result[index]) {

                result[index].missions++;

            }

        });


        return result;

    }, [missions]);


    const objectDistribution = useMemo(() => {

        const objectMap = {};


        (missions || []).forEach(
            (mission) => {

                const objects =
                    mission?.detected_objects ??
                    mission?.detectedObjects ??
                    "";


                if (!objects) return;


                let values = [];


                if (
                    Array.isArray(objects)
                ) {

                    values = objects;

                } else {

                    values =
                        String(objects)
                            .split(",");

                }


                values.forEach(
                    (object) => {

                        const cleanObject =
                            String(object)
                                .trim()
                                .split("(")[0]
                                .trim()
                                .toLowerCase();


                        if (!cleanObject) {
                            return;
                        }


                        objectMap[cleanObject] =
                            (
                                objectMap[cleanObject] ||
                                0
                            ) + 1;

                    }
                );

            }
        );


        return Object.entries(
            objectMap
        )
            .map(
                ([name, value]) => ({

                    name:
                        name
                            .charAt(0)
                            .toUpperCase() +
                        name.slice(1),

                    value

                })
            )
            .sort(
                (a, b) =>
                    b.value - a.value
            )
            .slice(0, 5);

    }, [missions]);


    const threatData = [

        {
            name: "Low",
            value: distribution.low
        },

        {
            name: "Medium",
            value: distribution.medium
        },

        {
            name: "High",
            value: distribution.high
        },

        {
            name: "Critical",
            value: distribution.critical
        }

    ].filter(
        (item) =>
            item.value > 0
    );


    const PIE_COLORS = [

        "#39ff88",
        "#55b9ff",
        "#ffd54a",
        "#ff5b5b"

    ];

    const CustomTooltip = ({
        active,
        payload,
        label
    }) => {

        if (
            !active ||
            !payload ||
            !payload.length
        ) {

            return null;

        }


        return (

            <div className="analytics-tooltip">

                {label && (

                    <div className="tooltip-label">
                        {label}
                    </div>

                )}

                <div className="tooltip-value">
                    {payload[0].value}
                </div>

            </div>

        );

    };


    return (

        <section className="mission-analytics">


            <div className="analytics-header">

                <div className="analytics-heading">

                    <span className="analytics-icon">
                        ◈
                    </span>

                    <div>

                        <h2>
                            Mission Analytics
                        </h2>

                        <p>
                            Operational intelligence overview
                        </p>

                    </div>

                </div>


                <span className="analytics-live">

                    <span></span>

                    LIVE

                </span>

            </div>


            <div className="analytics-grid">



                <div className="analytics-card trend-card">

                    <div className="analytics-card-title">

                        <h3>
                            Mission Activity
                        </h3>

                        <span>
                            7 DAYS
                        </span>

                    </div>


                    <div className="chart-container">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <BarChart
                                data={weeklyTrend}
                                margin={{
                                    top: 12,
                                    right: 5,
                                    left: -20,
                                    bottom: 0
                                }}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#183126"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="day"
                                    tick={{
                                        fill: "#7f9d8d",
                                        fontSize: 10
                                    }}
                                    axisLine={{
                                        stroke: "#274336"
                                    }}
                                    tickLine={false}
                                />

                                <YAxis
                                    allowDecimals={false}
                                    tick={{
                                        fill: "#7f9d8d",
                                        fontSize: 10
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <Tooltip
                                    cursor={{
                                        fill:
                                            "rgba(85,255,145,0.04)"
                                    }}
                                    content={
                                        <CustomTooltip />
                                    }
                                />

                                <Bar
                                    dataKey="missions"
                                    fill="#55ff91"
                                    radius={[
                                        4,
                                        4,
                                        0,
                                        0
                                    ]}
                                    maxBarSize={24}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                <div className="analytics-card object-card">

                    <div className="analytics-card-title">

                        <h3>
                            Threat Distribution
                        </h3>

                        <span>
                            LIVE
                        </span>

                    </div>


                    <div className="pie-container">

                        {threatData.length > 0 ? (

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <PieChart>

                                    <Pie
                                        data={threatData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius="70%"
                                        innerRadius="42%"
                                        paddingAngle={3}
                                    >

                                        {threatData.map(
                                            (_, index) => (

                                                <Cell
                                                    key={index}
                                                    fill={
                                                        PIE_COLORS[
                                                            index %
                                                            PIE_COLORS.length
                                                        ]
                                                    }
                                                />

                                            )
                                        )}

                                    </Pie>


                                    <Tooltip
                                        content={
                                            <CustomTooltip />
                                        }
                                    />

                                </PieChart>

                            </ResponsiveContainer>

                        ) : (

                            <div className="analytics-empty">

                                No threat data

                            </div>

                        )}

                    </div>


                    <div className="object-legend">

                        {threatData.map(
                            (item, index) => (

                                <div
                                    className="legend-item"
                                    key={item.name}
                                >

                                    <span
                                        className="legend-dot"
                                        style={{
                                            background:
                                                PIE_COLORS[
                                                    index %
                                                    PIE_COLORS.length
                                                ]
                                        }}
                                    />

                                    <span>
                                        {item.name}
                                    </span>

                                    <strong>
                                        {item.value}
                                    </strong>

                                </div>

                            )
                        )}

                    </div>

                </div>


                <div className="analytics-card success-card">

                    <div className="analytics-card-title">

                        <h3>
                            AI Confidence
                        </h3>

                        <span>
                            AVERAGE
                        </span>

                    </div>


                    <div className="success-content">

                        <div className="success-ring">

                            <svg
                                viewBox="0 0 120 120"
                                className="success-svg"
                            >

                                <circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    className="success-background"
                                />


                                <circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    className="success-progress"
                                    strokeDasharray={
                                        `${
                                            (
                                                analytics?.average_confidence ??
                                                0
                                            ) *
                                            3.14
                                        } 314`
                                    }
                                />

                            </svg>


                            <div className="success-value">

                                {
                                    analytics?.average_confidence ??
                                    0
                                }%

                            </div>

                        </div>

                    </div>


                    <p className="success-caption">

                        Average AI detection confidence

                    </p>

                </div>


                <div className="analytics-card threat-card">

                    <div className="analytics-card-title">

                        <h3>
                            Threat Categories
                        </h3>

                        <span>
                            {analytics?.total_missions ?? 0}
                            {" "}MISSIONS
                        </span>

                    </div>


                    <div className="threat-list">


                        <div className="threat-item">

                            <span className="threat-indicator low"></span>

                            <span>
                                Low
                            </span>

                            <strong>
                                {distribution.low}
                            </strong>

                        </div>


                        <div className="threat-item">

                            <span className="threat-indicator medium"></span>

                            <span>
                                Medium
                            </span>

                            <strong>
                                {distribution.medium}
                            </strong>

                        </div>


                        <div className="threat-item">

                            <span className="threat-indicator high"></span>

                            <span>
                                High
                            </span>

                            <strong>
                                {distribution.high}
                            </strong>

                        </div>


                        <div className="threat-item">

                            <span className="threat-indicator critical"></span>

                            <span>
                                Critical
                            </span>

                            <strong>
                                {distribution.critical}
                            </strong>

                        </div>


                    </div>

                </div>

            </div>

        </section>

    );

}


export default MissionAnalytics;