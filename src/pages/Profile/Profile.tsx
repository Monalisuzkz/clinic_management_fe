import React, { useState } from 'react';
import './Profile.css';

const Profile: React.FC = () => {
  const [profilePhoto, setProfilePhoto] = useState<string | ArrayBuffer | null>('default-avatar.png');
  const [name, setName] = useState('Dr. Admin');
  const [email, setEmail] = useState('admin@example.com');
  const [contact, setContact] = useState('123-456-7890');
  const [role, setRole] = useState('Administrator');
  const [theme, setTheme] = useState('Light');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = () => {
    // Save logic here
    alert('Profile updated!');
  };

  return (
    <div className="profile-container">
      {/* Profile Header with Avatar and Personal Info */}
      <div className="profile-header">
        <div className="avatar-section">
          <img src={profilePhoto as string} alt="Profile" className="avatar" />
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </div>
        <div className="personal-info">
          <div>
            <label>Name:</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label>Email:</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label>Contact:</label>
            <input value={contact} onChange={(e) => setContact(e.target.value)} />
          </div>
          <div>
            <label>Role:</label>
            <input value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <div>
            <label>Theme:</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option>Light</option>
              <option>Dark</option>
            </select>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="change-password-section">
        <h3>Change Password</h3>
        <div>
          <label>Current:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div>
          <label>New:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Confirm:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      {/* Preferences Section */}
      <div className="preferences-section">
        <h3>Preferences</h3>
        <div className="preference-item">
          <label>Notifications</label>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
          />
        </div>
        <div className="preference-item">
          <label>Language:</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            {/* Add more languages as needed */}
          </select>
        </div>
        <button onClick={handleSave} className="save-button">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;