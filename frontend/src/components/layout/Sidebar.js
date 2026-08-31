import "./Sidebar.css";

import {
    FaShieldAlt,
    FaHome,
    FaCrosshairs,
    FaSatellite,
    FaChartBar,
    FaCog
} from "react-icons/fa";

function Sidebar(){

    return(

        <div className="sidebar">

            <div>

                <div className="logo-section">

                    <div className="logo-title">

                        🛡 SentinelAI

                    </div>

                    <div className="logo-subtitle">

                        Military Intelligence System

                    </div>

                </div>

                <div className="menu">

                    <div className="menu-item">

                        <FaHome className="menu-icon"/>

                        Dashboard

                    </div>

                    <div className="menu-item">

                        <FaCrosshairs className="menu-icon"/>

                        Missions

                    </div>

                    <div className="menu-item">

                        <FaSatellite className="menu-icon"/>

                        Intelligence

                    </div>

                    <div className="menu-item">

                        <FaChartBar className="menu-icon"/>

                        Analytics

                    </div>

                    <div className="menu-item">

                        <FaCog className="menu-icon"/>

                        Settings

                    </div>

                </div>

            </div>

            <div className="system-status">

                <div className="system-status-title">

                    <span className="system-status-dot"></span>

                    System Status

                </div>

                All Systems Operational

            </div>

        </div>

    )

}

export default Sidebar;