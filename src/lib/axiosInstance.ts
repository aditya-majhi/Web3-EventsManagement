import axios from "axios";

const API_BASE = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_BASE_URL : "http://localhost:3000";

export const axiosInstance = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized access");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;