import * as React from 'react';
import { Search, ChevronDown, Plus, Calendar, Edit2, X, RefreshCw, Clock, User, Stethoscope } from 'lucide-react';
import './appointments.css';

const appointments = [
  { id: 1, patient: 'John Doe', doctor: 'Dr. Smith', date: 'Mar 24, 2026', time: '10:00 AM', status: 'Confirmed', avatar: '👨' },
  { id: 2, patient: 'Jane Smith', doctor: 'Dr. Lee', date: 'Mar 24, 2026', time: '11:30 AM', status: 'Pending', avatar: '👩' },
  { id: 3, patient: 'Mike Johnson', doctor: 'Dr. Williams', date: 'Mar 24, 2026', time: '02:00 PM', status: 'Confirmed', avatar: '👨' },
  { id: 4, patient: 'Sarah Williams', doctor: 'Dr. Brown', date: 'Mar 24, 2026', time: '03:30 PM', status: 'Cancelled', avatar: '👩' },
  { id: 5, patient: 'Robert Chen', doctor: 'Dr. Smith', date: 'Mar 25, 2026', time: '09:00 AM', status: 'Pending', avatar: '👨' },
  { id: 6, patient: 'Emily Davis', doctor: 'Dr. Lee', date: 'Mar 25, 2026', time: '01:00 PM', status: 'Confirmed', avatar: '👩' },
];

const calendarDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const calendarDates = [
  [17, 18, 19, 20, 21, 22, 23],
  [24, 25, 26, 27, 28, 29, 30],
  [31, 1, 2, 3, 4, 5, 6],
];

const Appointments: React.FC = () => {
  const [selectedAppointment, setSelectedAppointment] = React.useState(appointments[0]);
  const [calendarView, setCalendarView] = React.useState<'Day' | 'Week' | 'Month'>('Week');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('All');

  const filtered = appointments.filter((a) => {
    const matchSearch =
      a.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="appt-container">
      {/* Header */}
      <div className="appointment-header">
        <h1 className="appointment-title">Appointments</h1>
        <p className="appointment-subtitle">Manage and schedule patient appointments</p>
      </div>

      {/* Toolbar */}
      <div className="appt-toolbar">
        <div className="appt-toolbar-left">
          <div className="appt-search">
            <Search size={16} className="appt-search-icon" />
            <input
              type="text"
              placeholder="Search patient or doctor..."
              className="appt-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="appt-filters">
            <div className="appt-filter">
              <Calendar size={14} /> Date <ChevronDown size={14} />
            </div>
            <div className="appt-filter">
              <Stethoscope size={14} /> Doctor <ChevronDown size={14} />
            </div>
            <div className="appt-filter-select">
              {['All', 'Confirmed', 'Pending', 'Cancelled'].map((s) => (
                <button
                  key={s}
                  className={`appt-status-filter ${statusFilter === s ? 'active' : ''}`}
                  onClick={() => setStatusFilter(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button className="appt-book-btn">
          <Plus size={16} /> Book New Appointment
        </button>
      </div>

      {/* Main Split View */}
      <div className="appt-split">
        {/* Calendar */}
        <div className="appt-calendar-panel">
          <div className="appt-calendar-header">
            <span className="appt-calendar-month">March 2026</span>
            <div className="appt-view-toggle">
              {(['Day', 'Week', 'Month'] as const).map((v) => (
                <button
                  key={v}
                  className={`appt-view-btn ${calendarView === v ? 'active' : ''}`}
                  onClick={() => setCalendarView(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="appt-calendar-grid">
            {calendarDays.map((d) => (
              <div key={d} className="appt-cal-day-label">{d}</div>
            ))}
            {calendarDates.flat().map((date, i) => {
              const hasAppt = appointments.some((a) => a.date.includes(`Mar ${date}`));
              const isToday = date === 24;
              return (
                <div
                  key={i}
                  className={`appt-cal-date ${isToday ? 'today' : ''} ${hasAppt ? 'has-appt' : ''} ${date < 10 && i > 14 ? 'other-month' : ''}`}
                >
                  {date}
                  {hasAppt && <span className="appt-cal-dot" />}
                </div>
              );
            })}
          </div>

          {/* Today's slots */}
          <div className="appt-time-slots">
            <p className="appt-slots-label">Today's Schedule</p>
            {appointments.filter((a) => a.date === 'Mar 24, 2026').map((a) => (
              <div
                key={a.id}
                className={`appt-slot ${selectedAppointment?.id === a.id ? 'selected' : ''}`}
                onClick={() => setSelectedAppointment(a)}
              >
                <span className="appt-slot-time">{a.time}</span>
                <span className="appt-slot-name">{a.patient}</span>
                <span className={`appt-slot-badge ${a.status.toLowerCase()}`}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="appt-detail-panel">
          {selectedAppointment ? (
            <>
              <div className="appt-detail-header">
                <span className="appt-detail-label">Appointment Detail</span>
                <span className={`appt-detail-status ${selectedAppointment.status.toLowerCase()}`}>
                  {selectedAppointment.status}
                </span>
              </div>
              <div className="appt-detail-avatar">{selectedAppointment.avatar}</div>
              <h3 className="appt-detail-name">{selectedAppointment.patient}</h3>
              <div className="appt-detail-rows">
                <div className="appt-detail-row">
                  <User size={15} />
                  <span className="appt-detail-row-label">Doctor</span>
                  <span className="appt-detail-row-value">{selectedAppointment.doctor}</span>
                </div>
                <div className="appt-detail-row">
                  <Calendar size={15} />
                  <span className="appt-detail-row-label">Date</span>
                  <span className="appt-detail-row-value">{selectedAppointment.date}</span>
                </div>
                <div className="appt-detail-row">
                  <Clock size={15} />
                  <span className="appt-detail-row-label">Time</span>
                  <span className="appt-detail-row-value">{selectedAppointment.time}</span>
                </div>
              </div>
              <div className="appt-detail-actions">
                <button className="appt-action-btn edit"><Edit2 size={14} /> Edit</button>
                <button className="appt-action-btn reschedule"><RefreshCw size={14} /> Reschedule</button>
                <button className="appt-action-btn cancel"><X size={14} /> Cancel</button>
              </div>
            </>
          ) : (
            <div className="appt-detail-empty">Select an appointment to view details</div>
          )}
        </div>
      </div>

      {/* Appointment List Table */}
      <div className="appt-table-card">
        <div className="appt-table-header">
          <h2 className="appt-table-title">All Appointments</h2>
          <span className="appt-table-count">{filtered.length} records</span>
        </div>
        <div className="appt-table-wrapper">
          <table className="appt-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((apt) => (
                <tr key={apt.id} onClick={() => setSelectedAppointment(apt)} className="appt-table-row">
                  <td>
                    <div className="appt-patient-cell">
                      <span className="appt-patient-avatar">{apt.avatar}</span>
                      <span className="appt-patient-name">{apt.patient}</span>
                    </div>
                  </td>
                  <td className="appt-doctor-cell">{apt.doctor}</td>
                  <td>{apt.date}</td>
                  <td>
                    <div className="appt-time-cell">
                      <Clock size={13} /> {apt.time}
                    </div>
                  </td>
                  <td>
                    <span className={`appt-badge ${apt.status.toLowerCase()}`}>{apt.status}</span>
                  </td>
                  <td>
                    <div className="appt-actions-cell">
                      <button className="appt-icon-btn" title="Edit"><Edit2 size={14} /></button>
                      <button className="appt-icon-btn" title="Reschedule"><RefreshCw size={14} /></button>
                      <button className="appt-icon-btn danger" title="Cancel"><X size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Appointments;