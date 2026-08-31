import "./ActivityTable.css";

function ActivityTable({ missions }) {
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "-";

        const date = new Date(
            String(timestamp).replace(" UTC", "Z")
        );

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return (
            date.toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: "UTC"
            }) + " UTC"
        );
    };

    return (
        <div className="activity-card">

            
            <div className="activity-heading">

                <div>
                    <span className="activity-kicker">
                        MISSION INTELLIGENCE
                    </span>

                    <h2>
                        Recent Mission Activity
                    </h2>
                </div>

                <span className="activity-live">
                    ● LIVE FEED
                </span>

            </div>


            
            <div className="activity-table-wrapper">

                <table>

                    <thead>

                        <tr>
                            <th>Timestamp</th>
                            <th>Mission</th>
                            <th>Threat</th>
                            <th>Status</th>
                            <th>Confidence</th>
                        </tr>

                    </thead>


                    <tbody>

                        {!Array.isArray(missions) ||
                        missions.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="5"
                                    className="no-missions"
                                >
                                    No missions available.
                                </td>

                            </tr>

                        ) : (

                            missions.map((mission) => {

                                const threatLevel =
                                    String(
                                        mission?.threat_level ||
                                        "unknown"
                                    ).toLowerCase();

                                return (

                                    <tr
                                        key={
                                            mission?.id ||
                                            mission?.mission_id
                                        }
                                    >

                                       
                                        <td className="activity-timestamp">
                                            {formatTimestamp(
                                                mission?.timestamp
                                            )}
                                        </td>


                                        
                                        <td className="activity-mission-id">
                                            {mission?.mission_id ||
                                                "UNKNOWN"}
                                        </td>


                                        
                                        <td
                                            className={`activity-threat ${threatLevel}`}
                                        >

                                            <span className="threat-dot"></span>

                                            <span>
                                                {mission?.threat_level ||
                                                    "UNKNOWN"}
                                            </span>

                                        </td>


                                        
                                        <td className="activity-status">
                                            {mission?.priority ||
                                                "UNKNOWN"}
                                        </td>


                                     
                                        <td className="activity-confidence">

                                            {mission?.confidence !==
                                                undefined &&
                                            mission?.confidence !==
                                                null
                                                ? `${mission.confidence}%`
                                                : "—"}

                                        </td>

                                    </tr>

                                );
                            })

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default ActivityTable;