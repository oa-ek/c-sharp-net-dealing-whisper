import { jwtDecode } from "jwt-decode";

export const getDecodedToken = (token: string | null) => {
    if (!token) return null;
    try {
        return jwtDecode<any>(token);
    } catch {
        return null;
    }
};

export const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;
    try {
        const decoded = jwtDecode<any>(token);
        if (!decoded.exp) return false;
        const now = Date.now() / 1000;
        return decoded.exp < now;
    } catch {
        return true;
    }
};