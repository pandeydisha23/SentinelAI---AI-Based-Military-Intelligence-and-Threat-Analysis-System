import "./IntelligenceMap.css";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from "react-leaflet";

function IntelligenceMap(){

    return(

        <div className="map-card">

            <div className="map-header">

                🛰️ Mission Intelligence Map

            </div>

            <MapContainer
                center={[28.6139, 77.2090]}
                zoom={5}
                scrollWheelZoom={false}
            >

                <TileLayer
                    attribution="OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={[28.6139,77.2090]}>

                    <Popup>

                        🛰️ Delhi Command Center

                    </Popup>

                </Marker>

            </MapContainer>

        </div>

    )

}

export default IntelligenceMap;