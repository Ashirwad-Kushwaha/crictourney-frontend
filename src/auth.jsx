import { jwtDecode } from "jwt-decode";

export const saveToken = (token) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const removeToken = () => localStorage.removeItem("token");

export const getUser = () => {
    const token = getToken();
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
            removeToken();
            return null;
        }
        return decoded;
    } catch {
        removeToken();
        return null;
    }
};

export const isLoggedIn = () => !!getUser();
