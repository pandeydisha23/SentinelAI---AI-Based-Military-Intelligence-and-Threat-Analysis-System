const API_BASE_URL = "http://127.0.0.1:8000";

export const getAnalyticsOverview = async () => {
    const response = await fetch(
        `${API_BASE_URL}/analytics/analytics/overview`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch analytics overview");
    }

    return await response.json();
};


export const getRecentAnalyticsMissions = async () => {
    const response = await fetch(
        `${API_BASE_URL}/analytics/analytics/recent`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch recent missions");
    }

    return await response.json();
};


export const getThreatDistribution = async () => {
    const response = await fetch(
        `${API_BASE_URL}/analytics/analytics/threat-distribution`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch threat distribution");
    }

    return await response.json();
};