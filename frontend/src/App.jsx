import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import RaiseComplaint from './pages/RaiseComplaint';
import Home from './pages/Home';

import ComplaintDetail from './pages/ComplaintDetail';

import ProtectedRoute from './components/ProtectedRoute';
import OwnerLogin from './pages/OwnerLogin';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/raise-complaint" element={<RaiseComplaint />} />
        <Route path="/owner-login" element={<OwnerLogin />} />

        {/* Both Owner URLs protect the dashboard using ProtectedRoute */}
        <Route path="/owner_dashbord" element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Route>

        {/* Owner/Admin Routes - With Sidebar */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="complaints/:id" element={<ComplaintDetail />} />
          </Route>
        </Route>

        <Route path="/complaints/:id" element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<ComplaintDetail />} />
          </Route>
        </Route>

        {/* Catch-all redirect to Welcome page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
