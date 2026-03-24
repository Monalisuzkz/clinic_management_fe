import * as React from 'react';
import {useNavigate } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import LogoutModal from '../modals/LogoutModal';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    // Clear any auth tokens/data if needed
    localStorage.removeItem('authToken'); // Example
    setShowLogoutModal(false);
    navigate('/login', { replace: true });
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Mock notifications
  const notifications = [
    { id: 1, message: 'New appointment scheduled', time: '5 mins ago' },
    { id: 2, message: 'Lab results ready for review', time: '30 mins ago' },
    { id: 3, message: 'Inventory low stock alert', time: '1 hour ago' },
  ];

  const currentUser = {
    name: 'Dr. Admin',
    role: 'Administrator',
    avatar: '👨‍⚕️',
  };

  return (
    <nav className="navbar">
      {/* Right Section - Actions */}
      <div className="navbar-right">
        {/* Notifications */}
        <div className="navbar-item notification-item">
          <button
            className="navbar-button"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            <span className="notification-badge">
              {notifications.length > 9 ? '9+' : notifications.length}
            </span>
          </button>

          {showNotifications && (
            <div className="dropdown notification-dropdown">
              <div className="dropdown-header">
                <h3>Notifications</h3>
              </div>
              <div className="notification-list">
                {notifications.map((notif) => (
                  <div key={notif.id} className="notification-item-content">
                    <p>{notif.message}</p>
                    <span className="notification-time">{notif.time}</span>
                  </div>
                ))}
              </div>
              <div className="dropdown-footer">
                <a href="#" className="view-all-link">
                  View All →
                </a>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="navbar-item user-menu">
          <button
            className="navbar-button user-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <span className="user-avatar">{currentUser.avatar}</span>
            <div className="user-info">
              <span className="user-name">{currentUser.name}</span>
              <span className="user-role">{currentUser.role}</span>
            </div>
          </button>

          {showUserMenu && (
            <div className="dropdown user-dropdown">
              <a href="/profile" className="dropdown-item">
                <User size={16} /> Profile
              </a>
              <hr className="dropdown-divider" />
                <a onClick={handleLogoutClick} className="dropdown-item logout">
                Logout
              </a>
            </div>    
          )}
            {/* Logout Modal */}
            <LogoutModal
                isOpen={showLogoutModal}
                onConfirm={handleConfirmLogout}
                onCancel={handleCancelLogout}
                />
        </div>
      </div>  
    </nav>
  );
};

export default Navbar;