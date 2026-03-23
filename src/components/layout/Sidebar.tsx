import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, FileText, CreditCard, File, Box, BarChart, LogOut } from 'lucide-react';
import './Sidebar.css';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: <Home size={18} /> },
  { name: 'Appointments', path: '/appointments', icon: <Calendar size={18} /> },
  { name: 'Health Records', path: '/health-records', icon: <FileText size={18} /> },
  { name: 'E-Prescribing', path: '/e-prescribing', icon: <File size={18} /> },
  { name: 'Billing', path: '/billing', icon: <CreditCard size={18} /> },
  { name: 'Inventory', path: '/inventory', icon: <Box size={18} /> },
  { name: 'Reports', path: '/reports', icon: <BarChart size={18} /> },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  const handleLogout = () => {
    console.log('Logout clicked');
    // Add logout logic here
  };

  return (
    <aside className="sidebar">
      <h2>Clinic System</h2>
      <ul className="menu-main">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <li key={item.name}>
              <Link
                to={item.path}
                className={isActive ? 'active' : ''}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <ul className="menu-bottom">
        <li>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;