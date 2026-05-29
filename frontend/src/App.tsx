import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom' 
import { useAuthStore } from './store/authStore'
import { Login } from './pages/Login'
import { Register } from './pages/Register' 
import { Dashboard } from './pages/Dashboard'

const App: React.FC = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (isAuthenticated) {
        return <Dashboard />;
    }

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default App;