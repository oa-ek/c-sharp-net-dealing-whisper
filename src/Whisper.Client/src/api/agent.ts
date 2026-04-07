import axios from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getAuthTokenFromDB } from "./db";

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
            console.warn("⚠️ [Axios Warning] Токен не знайдено в IndexedDB!");
        }
    } catch (error) {
        console.error("❌ [Axios Interceptor Error]", error);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => agent.get<T>(url).then(responseBody),
    post: <T>(url: string, body: object) => agent.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: object) => agent.put<T>(url, body).then(responseBody),
    delete: <T>(url: string) => agent.delete<T>(url).then(responseBody),
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
};

const agentService = { Chats, Users };

export default agentService;