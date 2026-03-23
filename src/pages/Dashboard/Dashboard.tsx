import * as React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p>Welcome to the clinic management system!</p>
    </DashboardLayout>
  );
};

export default Dashboard;