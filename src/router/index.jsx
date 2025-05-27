import React from 'react';
import {Navigate} from "react-router-dom";

import ErrorPage from '../pages/ErrorPage.jsx'
import HomePage from '../pages/HomePage.jsx'
import RegisterPage from '../pages/RegisterPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import ProfilePage from "../pages/ProfilePage.jsx";
import {useAuth} from "../contexts/AuthContext.jsx";
import SeriesPage from "../pages/SeriesPage.jsx";
import FindAddPage from "../pages/FindAddPage.jsx";
import CompilationPage from "../pages/CompilationPage.jsx";
import AdminSeriesPage from "../pages/AdminSeriesPage.jsx";
import EditSeriesPage from "../pages/EditSeriesPage.jsx";


// eslint-disable-next-line react-refresh/only-export-components
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <></>
    if (!user) return <Navigate to="/login" />;
    return children;
};

// eslint-disable-next-line react-refresh/only-export-components
const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <></>;
    if (!user) return <Navigate to="/login" />;
    if (user.Role.Role !== 'admin') return <Navigate to="/" />;
    return children;
};

export const routes = [
    {
        path: '/',
        element: <HomePage/>
    },
    {
        path: '/error',
        element: <ErrorPage/>
    },
    {
        path: '/register',
        element: <RegisterPage/>
    },
    {
        path: '/login',
        element: <LoginPage/>
    },
    {
        path: '/profile',
        element:
            <ProtectedRoute>
                <ProfilePage/>
            </ProtectedRoute>
    },
    {
        path: '/serial/:id',
        element: <SeriesPage/>
    },
    {
        path: '/search',
        element:
            <ProtectedRoute>
                <FindAddPage/>
            </ProtectedRoute>
    },
    {
        path: "/compilation",
        element: <CompilationPage/>
    },
    {
        path: "/admin/series",
        element:
            <AdminRoute>
                <AdminSeriesPage/>
            </AdminRoute>
    },
    {
        path: "/admin/series/edit/:id",
        element:
            <AdminRoute>
                <EditSeriesPage/>
            </AdminRoute>
    }
];