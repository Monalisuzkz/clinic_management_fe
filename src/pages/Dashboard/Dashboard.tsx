import * as React from 'react';
import { Users, Calendar, FileText, DollarSign, TrendingUp, Clock, Activity } from 'lucide-react';
import './dashboard.css';


const stats = [
  { title: 'Total Patients', value: '1,245', icon: Users, color: '#3B82F6', trend: '+12%' },
  { title: 'Appointments Today', value: '32', icon: Calendar, color: '#10B981', trend: '+5%' },
  { title: 'Pending Bills', value: '$18.5K', icon: DollarSign, color: '#F59E0B', trend: '-3%' },
  { title: 'Available Doctors', value: '12', icon: FileText, color: '#8B5CF6', trend: 'All' },
];

const recentActivity = [
  { id: 1, text: 'Patient John Doe checked in', type: 'success', time: '5 mins ago' },
  { id: 2, text: 'New appointment scheduled', type: 'info', time: '15 mins ago' },
  { id: 3, text: 'Prescription created', type: 'highlight', time: '1 hour ago' },
  { id: 4, text: 'Billing completed', type: 'warning', time: '2 hours ago' },
];

const appointments = [
  { id: 1, patient: 'John Doe', time: '10:00 AM', doctor: 'Dr. Smith', status: 'Confirmed', avatar: '👨' },
  { id: 2, patient: 'Jane Smith', time: '11:30 AM', doctor: 'Dr. Lee', status: 'Pending', avatar: '👩' },
  { id: 3, patient: 'Mike Johnson', time: '02:00 PM', doctor: 'Dr. Williams', status: 'Confirmed', avatar: '👨' },
  { id: 4, patient: 'Sarah Williams', time: '03:30 PM', doctor: 'Dr. Brown', status: 'Pending', avatar: '👩' },
];

const Dashboard: React.FC = () => {
  return (
    <>
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Clinic Management Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back! Here's your clinic overview.</p>
      </div>

      {/* Stats Grid - Small Compact Cards */}
      <div className="stats-grid">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div key={stat.title} className="stat-card" style={{ borderLeftColor: stat.color }}>
              <div className="stat-header">
                <div className="stat-icon-wrapper" style={{ backgroundColor: `${stat.color}15` }}>
                  <IconComponent size={20} color={stat.color} />
                </div>
                <div className="stat-info">
                  <p className="stat-label">{stat.title}</p>
                  <h3 className="stat-value">{stat.value}</h3>
                </div>
                <div className="stat-trend-badge" style={{ color: stat.color }}>
                  <TrendingUp size={14} /> {stat.trend}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Recent Activity */}
        <div className="card activity-card">
          <div className="card-header">
            <h2 className="card-title">
              <Activity size={20} /> Recent Activity
            </h2>
          </div>
          <div className="activity-container">
            {recentActivity.map((activity) => (
              <div key={activity.id} className={`activity-item activity-${activity.type}`}>
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <p className="activity-text">{activity.text}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinic Status */}
        <div className="card status-card">
          <div className="card-header">
            <h2 className="card-title">Clinic Status</h2>
          </div>
          <div className="status-grid">
            <div className="status-item">
              <span className="status-label">Open Status</span>
              <span className="status-badge open">🟢 Open</span>
            </div>
            <div className="status-item">
              <span className="status-label">Doctors Available</span>
              <span className="status-value">12/15</span>
            </div>
            <div className="status-item">
              <span className="status-label">Pending Appointments</span>
              <span className="status-value">8</span>
            </div>
            <div className="status-item">
              <span className="status-label">Today's Revenue</span>
              <span className="status-value">$4,250</span>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="card appointments-card">
        <div className="card-header">
          <h2 className="card-title">Today's Appointments</h2>
          <a href="#" className="view-all-link">View All →</a>
        </div>
        <div className="table-container">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Time</th>
                <th>Doctor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id}>
                  <td>
                    <div className="patient-info">
                      <span className="patient-avatar">{apt.avatar}</span>
                      <span>{apt.patient}</span>
                    </div>
                  </td>
                  <td>
                    <div className="time-info">
                      <Clock size={14} /> {apt.time}
                    </div>
                  </td>
                  <td>{apt.doctor}</td>
                  <td>
                    <span className={`status-badge ${apt.status.toLowerCase()}`}>
                      {apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;