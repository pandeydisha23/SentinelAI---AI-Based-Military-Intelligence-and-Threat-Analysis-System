import "./LiveCamera.css";

import {
    FaVideo,
    FaExpand,
    FaCircle
} from "react-icons/fa";

function LiveCamera({ imagePath, missionId }) {

    // Build the complete image URL from FastAPI
    const imageUrl = imagePath
        ? `http://127.0.0.1:8000${imagePath}`
        : null;

    return (

        <div className="camera-card">

            <div className="camera-header">

                <div className="camera-title">

                    <FaVideo />

                    <span>LIVE SURVEILLANCE</span>

                </div>

                <div className="camera-right">

                    <span className="live-status">

                        <FaCircle />

                        LIVE

                    </span>

                    <FaExpand className="expand" />

                </div>

            </div>

            <div className="camera-screen">

                {imageUrl ? (

                    <img
                        src={imageUrl}
                        alt="Latest YOLO Detection"
                        className="camera-image"
                    />

                ) : (

                    <div className="camera-placeholder">

                        <h3>No Live Feed Available</h3>

                        <p>
                            Upload an image and run a mission to display
                            the latest YOLO detection.
                        </p>

                    </div>

                )}

            </div>

            <div className="camera-footer">

                <div>

                    Camera ID

                    <strong>

                        CAM-07

                    </strong>

                </div>

                <div>

                    Mission

                    <strong>

                        {missionId || "N/A"}

                    </strong>

                </div>

            </div>

        </div>

    );

}

export default LiveCamera;