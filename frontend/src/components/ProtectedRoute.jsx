import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAuthStatus } from '../api/auth';

const ProtectedRoute = () => {
    const [authData, setAuthData] = useState({ isLoading: true, isAuthenticated: false, role: null });
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            const status = await getAuthStatus();
            setAuthData({ isLoading: false, isAuthenticated: status.is_authenticated, role: status.user?.role });
        };
        checkAuth();
    }, []);

    if (authData.isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Inter, sans-serif' }}>Verifying Secure Session...</div>;
    }

    if (!authData.isAuthenticated || (authData.role !== 'ADMIN' && authData.role !== 'OWNER')) {
        return <Navigate to="/owner-login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
