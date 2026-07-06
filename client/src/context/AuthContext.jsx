import { createContext, useEffect, useState, useContext } from "react";
import api from "../api/axios";

const defaultAuthValue = {
    user: null,
    token: null,
    loading: false,
    login: async () => null,
    logout: async () => {},
    refreshSession: async () => {},
};

const AuthContext = createContext(defaultAuthValue);

export function AuthProvider({ children }) {
    const [user, setuser] = useState(null);
    const [token, settoken] = useState(localStorage.getItem("token"));
    const [loading, setloading] = useState(true);

    const refreshSession = async () => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            setuser(null);
            settoken(null);
            setloading(false);
            return;
        }

        try {
            const { data } = await api.get("/auth/session");
            setuser(data.user);
        } catch (error) {
            localStorage.removeItem("token");
            setuser(null);
            settoken(null);
        } finally {
            setloading(false);
        }
    };

    const login = async (email, password, role_type) => {
        const { data } = await api.post("/auth/login", { email, password, role_type });
        if (data?.token) {
            localStorage.setItem("token", data.token);
            settoken(data.token);
            setuser(data.user || null);
            return data.user;
        }
        throw new Error("No token received from server");
    };

    const logout = async () => {
        localStorage.removeItem("token");
        settoken(null);
        setuser(null);
    };

    useEffect(() => {
        refreshSession();
    }, []);

    const value = { user, token, loading, login, logout, refreshSession };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
} 