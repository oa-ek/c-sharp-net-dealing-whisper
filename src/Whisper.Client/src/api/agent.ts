import axios from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getAuthTokenFromDB, clearAuthData } from "./db";
import type { UpdateUserDto, UserDto } from "../types/user";

const agent = axios.create({
    baseURL: "https://26.205.72.169:7055",
});

agent.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    try {
        const token = await getAuthTokenFromDB();
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log(`[Axios Send] ${config.method?.toUpperCase()} -> ${config.url}`);
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
    forgotPassword: (email: string) => requests.post("/api/v1/Auth/forgot-password", { email }),
    resetPassword: (body: { email: string, code: string, newPassword: string }) => requests.post("/api/v1/Auth/reset-password", body),
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
    getMembers: (chatId: string) => requests.get<string[]>(`/api/v1/Chats/${chatId}/get-members`),
};

const Users = {
    search: (username: string) => 
        requests.get<any[]>(`/api/v1/Users/search-user/${username}`),

    me: () =>
        requests.get<UserDto>(`/api/v1/Users/me`),

    mePut: (body: UpdateUserDto) =>
        requests.put<UserDto>('/api/v1/Users/me', body),
    getMe: () => requests.get<any>("/api/v1/Users/me"),
    deleteDevice: (deviceId: string) => requests.delete(`/api/v1/Users/devices/${deviceId}`),
};

const Keys = {
    getBundle: (deviceId: string) => 
        requests.get<any>(`/api/v1/Keys/bundle/${deviceId}`),
    
    postBundle: (deviceId: string, keys: string[]) => 
        requests.post(`/api/v1/Keys/bundle/${deviceId}`, keys),
    
    getStatus: (deviceId: string) => 
        requests.get<any>(`/api/v1/Keys/status/${deviceId}`),
};

const agentService = { Chats, Users, Auth, Keys };

export default agentService;