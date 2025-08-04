import axios from "axios";
import { getToken } from "../auth";

const userApi = axios.create({
    baseURL: "http://localhost:8080/api", // User Service
});

const tournamentApi = axios.create({
    baseURL: "http://localhost:8082", // Tournament Service
});

const teamApi = axios.create({
    baseURL: "http://localhost:8083", // Team Service
});

const schedulerApi = axios.create({
    baseURL: "http://localhost:8084", // Replace with the actual SchedulerService base URL
});

[userApi, tournamentApi, teamApi, schedulerApi].forEach((api) => {
    api.interceptors.request.use((config) => {
        const token = getToken();
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });
});

export { userApi, tournamentApi, teamApi, schedulerApi };