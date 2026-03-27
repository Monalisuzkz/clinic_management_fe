import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Lock,
  Bell,
  Camera,
  Check,
} from "lucide-react";
import "./Profile.css";

const Profile: React.FC = () => {
  const [profilePhoto, setProfilePhoto] = useState("default-avatar.png");
  const [name, setName] = useState("Dr. Admin");
  const [email, setEmail] = useState("admin@example.com");
  const [contact, setContact] = useState("123-456-7890");
  const [role, setRole] = useState("Administrator");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("English");

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePhoto(reader.result as string);
        showToast("Profile photo updated successfully");
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSaveProfile = () => {
    // Validate password change if fields are filled
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        showToast("Please enter your current password");
        return;
      }
      if (newPassword !== confirmPassword) {
        showToast("New password and confirmation do not match");
        return;
      }
      if (newPassword.length < 6) {
        showToast("New password must be at least 6 characters long");
        return;
      }
      showToast("Password changed successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      return;
    }

    showToast("Profile updated successfully");
  };

  return (
    <div className="profile-wrapper">
      {/* Toast Notification */}
      {toast && (
        <div className="profile-toast">
          <Check size={15} /> {toast}
        </div>
      )}

      {/* LEFT SIDEBAR - Redesigned */}
      <div className="profile-left">
        <div className="avatar-container">
          <div className="avatar-wrapper">
            <img src={profilePhoto} alt="Avatar" className="avatar-large" />
            <label className="change-photo-on">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                hidden
              />
            </label>
          </div>
          <label className="change-photo-btn">
            <Camera size={16} />
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              hidden
            />
          </label>
        </div>

        <div className="sidebar-info">
          <div className="info-item">
            <div className="info-icon">
              <User size={18} />
            </div>
            <div className="info-content">
              <span className="info-label">Full Name</span>
              <span className="info-value">{name}</span>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">
              <Mail size={18} />
            </div>
            <div className="info-content">
              <span className="info-label">Email Address</span>
              <span className="info-value">{email}</span>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">
              <Phone size={18} />
            </div>
            <div className="info-content">
              <span className="info-label">Contact Number</span>
              <span className="info-value">{contact}</span>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">
              <Briefcase size={18} />
            </div>
            <div className="info-content">
              <span className="info-label">Role</span>
              <span className="info-value">{role}</span>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">
              <Lock size={18} />
            </div>
            <div className="info-content">
              <span className="info-label">Password</span>
              <span className="info-value">••••••••</span>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">
              <Bell size={18} />
            </div>
            <div className="info-content">
              <span className="info-label">Notifications</span>
              <span
                className={`info-value ${notifications ? "active" : "inactive"}`}
              >
                {notifications ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="profile-right">
        {/* PERSONAL INFORMATION */}
        <section className="section-box">
          <h3>Personal Information</h3>
          <div className="row">
            <label>Name:</label>
            <input
              value={name}
              placeholder="Enter full name"
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || /^[a-zA-Z\s.'-]*$/.test(v)) setName(v);
              }}
            />
          </div>
          <div className="row">
            <label>Email:</label>
            <input
              value={email}
              placeholder="Enter email address"
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || /^[a-zA-Z0-9@._+-]*$/.test(v)) setEmail(v);
              }}
            />
          </div>
          <div className="row">
            <label>Contact:</label>
            <input
              value={contact}
              placeholder="Enter contact number"
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || /^[0-9+\s-]*$/.test(v)) setContact(v);
              }}
            />
          </div>
          <div className="row">
            <label>Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option>Administrator</option>
              <option>Doctor</option>
              <option>Nurse</option>
              <option>Receptionist</option>
              <option>Pharmacist</option>
              <option>Lab Technician</option>
              <option>Billing Staff</option>
              <option>Medical Records Staff</option>
            </select>
          </div>
        </section>
        {/* CHANGE PASSWORD */}
        <section className="section-box">
          <h3>Change Password</h3>
          <div className="row">
            <label>Current Password:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>
          <div className="row">
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div className="row">
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
        </section>

        {/* PREFERENCES */}
        <section className="section-box">
          <h3>Preferences</h3>
          <div className="row">
            <label>Notifications:</label>
            <div className="toggle-wrapper">
              <button
                className={`toggle-btn ${notifications ? "active" : ""}`}
                onClick={() => setNotifications(true)}
              >
                On
              </button>
              <button
                className={`toggle-btn ${!notifications ? "active" : ""}`}
                onClick={() => setNotifications(false)}
              >
                Off
              </button>
            </div>
          </div>
          <div className="row">
            <label>Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>English</option>
              <option>Tagalog</option>
            </select>
          </div>
          <button className="save-btn" onClick={handleSaveProfile}>
            Save Changes
          </button>
        </section>
      </div>
    </div>
  );
};

export default Profile;
