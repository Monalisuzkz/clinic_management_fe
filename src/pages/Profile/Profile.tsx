import * as React from 'react';
import './profile.css';


const Profile: React.FC = () => {
  return (
    <>
      {/* Header */}
      <div className="profile-header">
        <h1 className="profile-title">Profile</h1>
        <p className="profile-subtitle">Manage your personal information and settings</p>
      </div>
    </>
  );
};

export default Profile;