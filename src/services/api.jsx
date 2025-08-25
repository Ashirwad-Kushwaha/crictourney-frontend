import axios from "axios";
import { getToken } from "../auth";

const BASE_URL = "http://localhost:8765";

const userApi = axios.create({
    baseURL: `${BASE_URL}/api`,
});

const tournamentApi = axios.create({
    baseURL: BASE_URL,
});

const teamApi = axios.create({
    baseURL: BASE_URL,
});

const schedulerApi = axios.create({
    baseURL: BASE_URL,
});

[userApi, tournamentApi, teamApi, schedulerApi].forEach((api) => {
    api.interceptors.request.use((config) => {
        const token = getToken();
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });
});

export { userApi, tournamentApi, teamApi, schedulerApi };