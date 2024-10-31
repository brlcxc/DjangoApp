import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

// HTTP request interceptor
api.interceptors.request.use(
    (config)=>{
        // Retrieve access token from local storage
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            // If token exists, add it to header of request
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default api;