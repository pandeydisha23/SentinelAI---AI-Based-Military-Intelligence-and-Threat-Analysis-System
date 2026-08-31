import "./Topbar.css";
import { useEffect, useState, useContext } from "react";

import {
  FaBell,
  FaUserCircle,
  FaDatabase,
  FaRobot,
  FaSatellite,
} from "react-icons/fa";

import { HeartbeatContext } from "../../context/HeartbeatContext";

function Topbar() {

  const [utcTime, setUtcTime] = useState("");

  const {

      backendStatus,

      latency

  } = useContext(HeartbeatContext);

  useEffect(() => {

    const updateClock = () => {

      const now = new Date();

      const time = now.toLocaleTimeString("en-GB", {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      setUtcTime(time);
    };

    
    updateClock();

    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);

  }, []);

  return (
    <header className="topbar">

      <div className="topbar-left">

        <div className="page-title">

          <FaSatellite />

          <div>
            <h2>MISSION CONTROL</h2>
            <p>
              SentinelAI Defence 
              <br />
              Intelligence Platform
            </p>
          </div>

        </div>

      </div>

      <div className="topbar-right">

        <div className="status online">
          <FaRobot />
          AI ONLINE
        </div>

        <div className="status online">
          <FaDatabase />
          DATABASE
        </div>

        <div
          className={`status ${
            backendStatus === "ONLINE" ? "online" : "offline"
          }`}
        >
          {backendStatus === "ONLINE"
            ? `BACKEND • ${latency} ms`
            : "BACKEND OFFLINE"}
        </div>

        <div className="utc-time">
          UTC {utcTime}
        </div>

        <FaBell className="icon" />

        <FaUserCircle className="profile" />

      </div>

    </header>
  );
}

export default Topbar;