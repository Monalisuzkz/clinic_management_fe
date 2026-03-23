import * as React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-lg font-bold mb-4">Menu</h2>
      <ul className="flex flex-col gap-2">
        <li>
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        </li>
        <li>
          <Link to="/appointments" className="hover:underline">Appointments</Link>
        </li>
        <li>
          <Link to="/health-records" className="hover:underline">Health Records</Link>
        </li>
        <li>
          <Link to="/billing" className="hover:underline">Billing</Link>
        </li>
        <li>
          <Link to="/e-prescribing" className="hover:underline">E-Prescribing</Link>
        </li>
                <li>
          <Link to="/reports" className="hover:underline">Reports</Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;