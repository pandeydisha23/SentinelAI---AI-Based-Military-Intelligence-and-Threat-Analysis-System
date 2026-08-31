import { createContext, useState } from "react";

export const HeartbeatContext = createContext();

export function HeartbeatProvider({ children }) {

    const [backendStatus, setBackendStatus] = useState("ONLINE");
    const [latency, setLatency] = useState(0);

    return (

        <HeartbeatContext.Provider
            value={{
                backendStatus,
                setBackendStatus,
                latency,
                setLatency
            }}
        >

            {children}

        </HeartbeatContext.Provider>

    );

}