import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const api = axios.create({
        baseURL: 'http://localhost:8080/api',
        headers: { 'Content-Type': 'application/json' }
    });

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            fetchUser(storedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (token) => {
        try {
            const response = await api.get('/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (err) {
            setError(err.response?.data)
            await logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/login', { email, password });
            localStorage.setItem('token', response.data.token);
            await fetchUser(response.data.token);
        } catch (err) {
            setError(err.response?.data);
            throw new Error(err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const register = async (username, email, password) => {
        setLoading(true);
        setError(null);
        try {
            await api.post('/register', { name: username, email, password });
            await login(email, password);
        } catch (err) {
            setError(err.response?.data);
            throw Error(err.response?.data)
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Отсутствует токен");

            await api.delete('/logout', {
                headers: { Authorization:  token }
            });

            setUser(null);
            localStorage.removeItem('token');
        } catch (error) {
            console.error("Ошибка при выходе:", error);
        }
    };


    const value = {
        user, setUser,
        login,
        register,
        logout,
        loading,
        error
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};