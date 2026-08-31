import api from "./api";

export const getLatestMission = async () => {
    const response = await api.get("/fire/latest");
    return response.data;
};

export const getAllMissions = async () => {
    const response = await api.get("/fire/missions");
    return response.data;
};

export const getMLPerformance = async () => {
    try {
        const response = await fetch(
            "http://127.0.0.1:8000/ml/performance"
        );

        if (!response.ok) {
            throw new Error(
                `ML performance request failed: ${response.status}`
            );
        }

        return await response.json();

    } catch (error) {
        console.error(
            "ML performance error:",
            error
        );

        throw error;
    }
};

export const getThreatExplanation = async (missionId) => {
    try {
        console.log(
            "Requesting ML explanation for mission:",
             missionId
            );

            const response = await api.get(
                `/analytics/mission/${missionId}`
            );

            console.log(
                "ML explanation response:",
                 response.data
                );

                return response.data;
        
                
        } catch (error) {

            console.error(
                "Threat explanation API error:",
                error
            );

            console.error(
                "Status:",
                error?.response?.status
            );

            console.error(
                "Response:",
                error?.response?.data
            );

            throw error;
    }
};