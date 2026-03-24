import * as React from 'react';
import './appointments.css';


const Appointment: React.FC = () => {
  return (
    <>
      {/* Header */}
      <div className="appointment-header">
        <h1 className="appointment-title">Appointments</h1>
        <p className="appointment-subtitle">Manage and schedule patient appointments</p>
      </div>
    </>
  );
};

export default Appointment;