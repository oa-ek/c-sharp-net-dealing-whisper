import axios from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getAuthTokenFromDB, clearAuthData } from "./db";

const agent = axios.create({
    baseURL: "http://26.205.72.169:5055",
});

agent.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    try {
        const token = await getAuthTokenFromDB();
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log(`📡 [Axios Send] ${config.method?.toUpperCase()} -> ${config.url}`);
        } else {
            console.warn(" [Axios Warning] Токен не знайдено!");
        }
    } catch (error) {
        console.error(error);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

agent.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            await clearAuthData();
            localStorage.clear();
            window.location.replace("/auth/login");
        }
        return Promise.reject(error);
    }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => agent.get<T>(url).then(responseBody),
    post: <T>(url: string, body: object) => agent.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: object) => agent.put<T>(url, body).then(responseBody),
    delete: <T>(url: string) => agent.delete<T>(url).then(responseBody),
};

const Auth = {
    login: (body: any) => requests.post<any>("/api/v1/Auth/login", body),
    register: (body: any) => requests.post<any>("/api/v1/Auth/register", body),
    logout: () => requests.post("/api/v1/Auth/logout", {}),
    refresh: (token: string) => requests.post<any>("/api/v1/Auth/refresh", { refreshToken: token }),
    changePassword: (body: any) => requests.post("/api/v1/Auth/change-password", body),
};

const Chats = {
    list: () => requests.get<any[]>("/api/v1/Chats/list"), 
    messages: (chatId: string) => 
        requests.get<any[]>(`/api/v1/Chats/${chatId}/messages?limit=50&offset=0`),
    create: (receiverId: string, name: string) => 
        requests.post<any>(`/api/v1/Chats/create/${receiverId}`, { 
            name: name, 
            isGroup: false 
        }),
    sendMessage: (body: any) => 
        requests.post<any>("/api/v1/Chats/messages", body),
};

const Users = {
    search: (username: string) => 
        requests.get<any[]>(`/api/v1/Users/search-user/${username}`),
    getMe: () => requests.get<any>("/api/v1/Users/me"),
    deleteDevice: (deviceId: string) => requests.delete(`/api/v1/Users/devices/${deviceId}`),
};

const agentService = { Chats, Users, Auth };

export default agentService;