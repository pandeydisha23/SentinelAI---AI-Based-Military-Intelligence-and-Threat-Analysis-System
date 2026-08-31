import "./LiveEventFeed.css";

function LiveEventFeed({ events = [] }) {

    const getSeverityClass = (level) => {

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

    const formatTime = (timestamp) => {

        if (!timestamp) {
            return "--:--:--";
        }

        const date = new Date(
            String(timestamp).replace(" UTC", "Z")
        );

        if (Number.isNaN(date.getTime())) {
            return "--:--:--";
        }

        return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
            timeZone: "UTC"
        });
    };

    return (
        <div className="live-event-feed">

            <div className="event-feed-header">

                <div>
                    <span className="event-kicker">
                        REAL-TIME INTELLIGENCE
                    </span>

                    <h3>
                        Live Event Feed
                    </h3>
                </div>

                <div className="event-live-indicator">
                    <span></span>
                    LIVE
                </div>

            </div>

            <div className="event-list">

                {events.length === 0 ? (

                    <div className="event-empty">
                        <span>NO RECENT EVENTS</span>
                        <small>
                            Awaiting intelligence telemetry...
                        </small>
                    </div>

                ) : (

                    events.slice(0, 8).map((mission, index) => (

                        <div
                            className={`event-item ${getSeverityClass(
                                mission.threat_level
                            )}`}
                            key={
                                mission.id ||
                                mission.mission_id ||
                                index
                            }
                        >

                            <div className="event-marker">
                                <span></span>
                            </div>

                            <div className="event-content">

                                <div className="event-top">

                                    <strong>
                                        {mission.mission_id}
                                    </strong>

                                    <time>
                                        {formatTime(
                                            mission.timestamp
                                        )}
                                    </time>

                                </div>

                                <div className="event-middle">

                                    <span>
                                        {mission.threat_level}
                                    </span>

                                    <span>
                                        Score {mission.threat_score ?? 0}
                                    </span>

                                </div>

                                <p>
                                    {mission.detected_objects ||
                                        "No objects detected"}
                                </p>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}

export default LiveEventFeed;