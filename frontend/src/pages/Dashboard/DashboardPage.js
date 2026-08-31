import "./DashboardPage.css";

import {
    useEffect,
    useState,
    useContext,
    useCallback
} from "react";

import StatusCard from "../../components/cards/StatusCard";
import ThreatChart from "../../components/charts/ThreatChart";
import IntelligenceMap from "../../components/maps/IntelligenceMap";
import ActivityTable from "../../components/activity/ActivityTable";
import AIAnalysisPanel from "../../components/analysis/AIAnalysisPanel";
import MissionAnalytics from "../../components/analytics/MissionAnalytics";
import LiveCamera from "../../components/camera/LiveCamera";
import ThreatScoreGauge from "../../components/threat/ThreatScoreGauge";
import LiveEventFeed from "../../components/events/LiveEventFeed";
import ThreatIntelligencePanel from "../../components/intelligence/ThreatIntelligencePanel";
import ThreatAnalytics from "../../components/analytics/ThreatAnalytics";
import ExplainableThreatAnalysis from "../../components/intelligence/ExplainableThreatAnalysis";
import MLPerformancePanel from "../../components/ml/MLPerformancePanel";

import { toast } from "react-toastify";

import {
    FaExclamationTriangle,
    FaSatellite,
    FaRobot,
    FaCrosshairs,
    FaShieldAlt
} from "react-icons/fa";

import { HeartbeatContext } from "../../context/HeartbeatContext";

import {
    getLatestMission,
    getAllMissions,
    getMLPerformance
} from "../../services/missionService";

import {
    connectWebSocket,
    disconnectWebSocket
} from "../../services/websocket";

function DashboardPage() {
    const [latestMission, setLatestMission] = useState(null);
    const [missions, setMissions] = useState([]);
    const [mlPerformance, setMLPerformance] = useState(null);
    const [, setLastUpdated] = useState(new Date());

    const {
        setBackendStatus,
        setLatency
    } = useContext(HeartbeatContext);

    const loadDashboard = useCallback(async () => {
        const startTime = performance.now();

        try {
            const latest = await getLatestMission();

            const history = await getAllMissions();

            const mlResults = await getMLPerformance();

            setLatestMission(latest);
            setMissions(
                Array.isArray(history)
                    ? history
                    : []
            );

            setMLPerformance(mlResults);

            setLastUpdated(new Date());

            if (
                typeof Notification !== "undefined" &&
                Notification.permission === "granted" &&
                latest &&
                (
                    String(latest.threat_level).toUpperCase() === "HIGH" ||
                    String(latest.threat_level).toUpperCase() === "CRITICAL"
                )
            ) {
                new Notification(
                    "SentinelAI Threat Alert",
                    {
                        body:
                            `${latest.detected_objects || "Unknown objects"}\n` +
                            `Threat Score: ${latest.threat_score ?? 0}`
                    }
                );
            }

            setLatency(
                Math.round(
                    performance.now() - startTime
                )
            );

            setBackendStatus("ONLINE");
        } catch (error) {
            console.error(
                "Dashboard loading error:",
                error
            );

            setBackendStatus("OFFLINE");
        }
    }, [
        setBackendStatus,
        setLatency
    ]);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    useEffect(() => {
        connectWebSocket((message) => {
            console.log(
                "SentinelAI WebSocket:",
                message
            );

            if (
                message?.type === "NEW_MISSION"
            ) {
                toast.success(
                    "NEW MISSION INTELLIGENCE RECEIVED",
                    {
                        position: "top-right",
                        autoClose: 3000
                    }
                );

                loadDashboard();
            }
        });

        return () => {
            disconnectWebSocket();
        };
    }, [loadDashboard]);

    useEffect(() => {
        if (
            typeof Notification !== "undefined" &&
            Notification.permission === "default"
        ) {
            Notification.requestPermission();
        }
    }, []);

    const threatLevel =
        String(
            latestMission?.threat_level || "UNKNOWN"
        ).toUpperCase();

    const threatScore =
        Math.max(
            0,
            Math.min(
                100,
                Number(
                    latestMission?.threat_score ?? 0
                )
            )
        );

    const confidence =
        Math.max(
            0,
            Math.min(
                100,
                Number(
                    latestMission?.confidence ?? 0
                )
            )
        );

    const priority =
        String(
            latestMission?.priority || "STANDBY"
        ).toUpperCase();

    const recommendation =
        latestMission?.recommendation ||
        "Awaiting mission intelligence.";

    const highThreatCount =
        missions.filter((mission) => {
            const level =
                String(
                    mission?.threat_level || ""
                ).toUpperCase();

            return (
                level === "HIGH" ||
                level === "CRITICAL"
            );
        }).length;

    return (
        <div className="dashboard-page">

            <div className="dashboard-heading">
                <div>
                    <span className="dashboard-kicker">
                        SENTINELAI // COMMAND CENTER
                    </span>

                    <h1>
                        Military Intelligence
                        & Threat Analysis
                    </h1>

                    <p>
                        AI-powered operational
                        surveillance and threat
                        intelligence system.
                    </p>
                </div>

                <div className="dashboard-status">
                    <span className="status-pulse"></span>
                    SYSTEM MONITORING
                </div>
            </div>

            <div className="mission-status-strip">

                <div className="mission-status-item">
                    <span>
                        MISSION ID
                    </span>

                    <strong>
                        {
                            latestMission?.mission_id ||
                            "STANDBY"
                        }
                    </strong>
                </div>

                <div className="mission-status-item">
                    <span>
                        PRIORITY
                    </span>

                    <strong
                        className={
                            priority
                                .toLowerCase()
                                .replace(/\s/g, "-")
                        }
                    >
                        {priority}
                    </strong>
                </div>

                <div className="mission-status-item">
                    <span>
                        THREAT STATUS
                    </span>

                    <strong
                        className={
                            threatLevel.toLowerCase()
                        }
                    >
                        {threatLevel}
                    </strong>
                </div>

                <div className="mission-status-item">
                    <span>
                        ACTIVE ALERTS
                    </span>

                    <strong>
                        {highThreatCount}
                    </strong>
                </div>

                <div className="mission-status-item">
                    <span>
                        AI ENGINE
                    </span>

                    <strong className="online">
                        ONLINE
                    </strong>
                </div>

            </div>

            <div className="cards-grid">

                <StatusCard
                    icon={
                        <FaExclamationTriangle />
                    }
                    title="Threat Level"
                    value={threatLevel}
                    subtitle={
                        `Score: ${threatScore}`
                    }
                    color="#ff5b5b"
                />

                <StatusCard
                    icon={
                        <FaSatellite />
                    }
                    title="Total Missions"
                    value={missions.length}
                    subtitle="Mission Database"
                    color="#5cff7b"
                />

                <StatusCard
                    icon={
                        <FaRobot />
                    }
                    title="AI Confidence"
                    value={
                        latestMission
                            ? `${confidence}%`
                            : "..."
                    }
                    subtitle="Latest Analysis"
                    color="#55b9ff"
                />

                <StatusCard
                    icon={
                        <FaCrosshairs />
                    }
                    title="High Threat"
                    value={highThreatCount}
                    subtitle="High / Critical"
                    color="#ffd54a"
                />

            </div>

            <div className="dashboard-main-layout">

                <div className="dashboard-left-column">

                    <div className="dashboard-chart-row">

                        <div className="dashboard-panel dashboard-chart">
                            <ThreatChart
                                missions={missions}
                            />
                        </div>

                        <div className="dashboard-panel dashboard-map">

                            <div className="tactical-panel-header">

                                <div>
                                    <span>
                                        GEOINT
                                    </span>

                                    <h3>
                                        Intelligence Map
                                    </h3>
                                </div>

                                <span className="panel-live">
                                    LIVE
                                </span>

                            </div>

                            <IntelligenceMap />

                        </div>

                    </div>

                    <div className="dashboard-panel dashboard-table">
                        <ActivityTable
                            missions={missions}
                        />
                    </div>

                    <div className="dashboard-panel">

                        <ThreatAnalytics
                            missions={missions}
                        />

                    </div>
                    
                    <div className="dashboard-panel">
                        <ExplainableThreatAnalysis
                            mission={latestMission}
                        />
                    </div>

                    <div className="dashboard-panel">

                        <MLPerformancePanel 
                            performance={mlPerformance}
                        />

                    </div>


                    <div className="dashboard-panel">
                        <AIAnalysisPanel
                            report={
                                latestMission?.report ||
                                recommendation
                            }
                            threatLevel={
                                latestMission?.threat_level ||
                                ""
                            }
                        />
                    </div>

                    <ThreatIntelligencePanel
                        mission={latestMission}
                    />

                </div>

                <div className="dashboard-right-column">

                    <ThreatScoreGauge
                        score={threatScore}
                        level={threatLevel}
                    />

                    <LiveEventFeed
                        events={missions}
                    />

                    <div className="dashboard-panel dashboard-side-card">
                        <MissionAnalytics />
                    </div>

                    <div className="dashboard-panel dashboard-side-card">
                        <LiveCamera
                            imagePath={
                                latestMission?.output_image ||
                                ""
                            }
                            missionId={
                                latestMission?.mission_id ||
                                ""
                            }
                        />
                    </div>

                    <div className="system-intelligence-panel">

                        <div className="system-intelligence-header">
                            <FaShieldAlt />

                            <span>
                                AI INTELLIGENCE STATUS
                            </span>
                        </div>

                        <div className="system-intelligence-body">

                            <div>
                                <span>
                                    Detection Engine
                                </span>

                                <strong>
                                    ONLINE
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Threat Engine
                                </span>

                                <strong>
                                    ACTIVE
                                </strong>
                            </div>

                            <div>
                                <span>
                                    WebSocket
                                </span>

                                <strong>
                                    CONNECTED
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Recommendation
                                </span>

                                <strong>
                                    {priority}
                                </strong>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default DashboardPage;