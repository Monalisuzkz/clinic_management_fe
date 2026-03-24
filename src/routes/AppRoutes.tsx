import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import Appointments from '../pages/Appointments/Appointments';
import HealthRecords from '../pages/HealthRecords/HealthRecords';
import Billing from '../pages/Billing/Billing';
import EPrescribing from '../pages/EPrescribing/EPrescribing';
import Reports from '../pages/Reports/Reports';
import Inventory from '../pages/Inventory/Inventory';
// Layout wrapper for pages that need Sidebar + Navbar
const LayoutWrapper: React.FC = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes (No Layout) */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes (With Layout) */}
        <Route element={<LayoutWrapper />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/health-records" element={<HealthRecords />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/e-prescribing" element={<EPrescribing />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/inventory" element={<Inventory />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;