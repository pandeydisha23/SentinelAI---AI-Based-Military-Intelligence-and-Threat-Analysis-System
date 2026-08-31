import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

import "./ThreatChart.css";

function ThreatChart({ missions = [] }) {

    const chartData = missions
        .filter((mission) => mission)
        .map((mission, index) => {

            const score = Math.max(
                0,
                Math.min(
                    100,
                    Number(
                        mission?.threat_score ?? 0
                    )
                )
            );

            return {
                index: index + 1,
                mission:
                    mission?.mission_id ||
                    `MISSION-${index + 1}`,
                threat: score
            };
        })
        .slice(-12);

    return (
        <div className="chart-card">

            <div className="threat-chart-header">

                <div>
                    <span className="threat-chart-kicker">
                        ANALYTICS // THREAT MONITORING
                    </span>

                    <h3>
                        Threat Timeline
                    </h3>

                    <p>
                        Historical threat score across recent missions
                    </p>
                </div>

                <div className="threat-chart-status">
                    <span className="threat-chart-dot"></span>
                    LIVE DATA
                </div>

            </div>

            <div className="threat-chart-summary">

                <div className="threat-summary-item">

                    <span>
                        MISSIONS
                    </span>

                    <strong>
                        {chartData.length}
                    </strong>

                </div>

                <div className="threat-summary-item">

                    <span>
                        CURRENT
                    </span>

                    <strong>
                        {chartData.length
                            ? chartData[chartData.length - 1].threat
                            : 0}
                    </strong>

                </div>

                <div className="threat-summary-item">

                    <span>
                        PEAK
                    </span>

                    <strong>
                        {chartData.length
                            ? Math.max(
                                ...chartData.map(
                                    (item) =>
                                        item.threat
                                )
                            )
                            : 0}
                    </strong>

                </div>

            </div>

            <div className="threat-chart-container">

                {chartData.length > 0 ? (

                    <ResponsiveContainer
                        width="100%"
                        height={300}
                    >

                        <LineChart
                            data={chartData}
                            margin={{
                                top: 10,
                                right: 15,
                                left: -10,
                                bottom: 5
                            }}
                        >

                            <CartesianGrid
                                stroke="#243629"
                                strokeDasharray="3 3"
                                vertical={false}
                            />

                            <XAxis
                                dataKey="index"
                                stroke="#7fa38b"
                                tick={{
                                    fill: "#7fa38b",
                                    fontSize: 10
                                }}
                                axisLine={{
                                    stroke: "#243629"
                                }}
                                tickLine={false}
                                label={{
                                    value: "Recent Missions",
                                    position: "insideBottom",
                                    offset: -2,
                                    fill: "#587363",
                                    fontSize: 9
                                }}
                            />

                            <YAxis
                                domain={[0, 100]}
                                stroke="#7fa38b"
                                tick={{
                                    fill: "#7fa38b",
                                    fontSize: 10
                                }}
                                axisLine={false}
                                tickLine={false}
                                label={{
                                    value: "Threat Score",
                                    angle: -90,
                                    position: "insideLeft",
                                    fill: "#587363",
                                    fontSize: 9
                                }}
                            />

                            <Tooltip
                                content={({ active, payload }) => {

                                    if (
                                        !active ||
                                        !payload ||
                                        !payload.length
                                    ) {
                                        return null;
                                    }

                                    const item =
                                        payload[0]?.payload;

                                    return (
                                        <div className="threat-chart-tooltip">

                                            <span className="tooltip-kicker">
                                                MISSION INTELLIGENCE
                                            </span>

                                            <strong>
                                                {item?.mission ||
                                                    "UNKNOWN"}
                                            </strong>

                                            <div>
                                                Threat Score:
                                                <span>
                                                    {item?.threat ?? 0}
                                                </span>
                                            </div>

                                        </div>
                                    );
                                }}
                            />

                            <Line
                                type="monotone"
                                dataKey="threat"
                                stroke="#55ff91"
                                strokeWidth={3}
                                dot={{
                                    r: 4,
                                    fill: "#55ff91",
                                    stroke: "#0b1711",
                                    strokeWidth: 2
                                }}
                                activeDot={{
                                    r: 6
                                }}
                                isAnimationActive={true}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                ) : (

                    <div className="threat-chart-empty">

                        <div className="empty-icon">
                            ◈
                        </div>

                        <strong>
                            No Mission Intelligence
                        </strong>

                        <span>
                            Threat analytics will appear
                            after mission data is received.
                        </span>

                    </div>

                )}

            </div>

            <div className="threat-scale">

                <span>0 LOW</span>

                <span>25</span>

                <span>50 MEDIUM</span>

                <span>75 HIGH</span>

                <span>100 CRITICAL</span>

            </div>

        </div>
    );
}

export default ThreatChart;