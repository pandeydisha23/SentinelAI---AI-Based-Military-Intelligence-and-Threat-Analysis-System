import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "leaflet/dist/leaflet.css";
import "react-toastify/dist/ReactToastify.css";
import { HeartbeatProvider } from "./context/HeartbeatContext";
import App from "./App";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(

    <React.StrictMode>

        <HeartbeatProvider>

            <App />

        </HeartbeatProvider>

    </React.StrictMode>

);