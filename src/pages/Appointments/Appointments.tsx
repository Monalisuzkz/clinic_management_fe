import * as React from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Calendar,
  Edit2,
  X,
  RefreshCw,
  Clock,
  User,
  Check,
} from "lucide-react";
import "./appointments.css";

// ── Types ────────────────────────────────────────────────
type Status = "Confirmed" | "Pending" | "Cancelled";

interface Appointment {
  id: number;
  patient: string;
  doctor: string;
  date: Date;
  time: string;
  status: Status;
  avatar: string;
  notes?: string;
}

// ── Mock Data ────────────────────────────────────────────
const DOCTORS = [
  "Dr. Smith",
  "Dr. Lee",
  "Dr. Williams",
  "Dr. Brown",
  "Dr. Garcia",
];
const TIMES = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
];

const initialAppointments: Appointment[] = [
  {
    id: 1,
    patient: "John Doe",
    doctor: "Dr. Smith",
    date: new Date(2026, 2, 24),
    time: "10:00 AM",
    status: "Confirmed",
    avatar: "👨",
    notes: "Regular checkup",
  },
  {
    id: 2,
    patient: "Jane Smith",
    doctor: "Dr. Lee",
    date: new Date(2026, 2, 24),
    time: "11:30 AM",
    status: "Pending",
    avatar: "👩",
    notes: "Follow-up consultation",
  },
  {
    id: 3,
    patient: "Mike Johnson",
    doctor: "Dr. Williams",
    date: new Date(2026, 2, 24),
    time: "02:00 PM",
    status: "Confirmed",
    avatar: "👨",
  },
  {
    id: 4,
    patient: "Sarah Williams",
    doctor: "Dr. Brown",
    date: new Date(2026, 2, 24),
    time: "03:30 PM",
    status: "Cancelled",
    avatar: "👩",
  },
  {
    id: 5,
    patient: "Robert Chen",
    doctor: "Dr. Smith",
    date: new Date(2026, 2, 25),
    time: "09:00 AM",
    status: "Pending",
    avatar: "👨",
  },
  {
    id: 6,
    patient: "Emily Davis",
    doctor: "Dr. Lee",
    date: new Date(2026, 2, 25),
    time: "01:00 PM",
    status: "Confirmed",
    avatar: "👩",
  },
];

const getMonthDays = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay(); // 0-6
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [];

  // Fill empty slots before first day
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Fill actual days
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  return days;
};

// ── Book Modal ───────────────────────────────────────────
interface BookModalProps {
  onClose: () => void;
  onSave: (appt: Appointment) => void;
  editData?: Appointment | null;
  rescheduleMode?: boolean;
}

const formatDate = (date?: Date) => {
  if (!date) return "";
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
};

const BookModal: React.FC<BookModalProps> = ({
  onClose,
  onSave,
  editData,
  rescheduleMode,
}) => {
  const [form, setForm] = React.useState({
    patient: editData?.patient ?? "",
    doctor: editData?.doctor ?? DOCTORS[0],
    date: formatDate(editData?.date),
    time: editData?.time ?? TIMES[0],
    notes: editData?.notes ?? "",
    status: editData?.status ?? ("Pending" as Status),
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.patient.trim()) e.patient = "Patient name is required";
    if (!form.date.trim()) e.date = "Date is required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSave({
      id: editData?.id ?? Date.now(),
      avatar: editData?.avatar ?? "👤",
      ...form,
      date: new Date(form.date),
      status: form.status as Status,
    });
  };

  const set = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => {
      const n = { ...e };
      delete n[field];
      return n;
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {rescheduleMode
                ? "Reschedule Appointment"
                : editData
                  ? "Edit Appointment"
                  : "Book New Appointment"}
            </h2>
            <p className="modal-subtitle">
              {rescheduleMode
                ? "Pick a new date and time for this appointment"
                : editData
                  ? "Update appointment details"
                  : "Fill in the details to schedule an appointment"}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Patient Name */}
          <div className="modal-field">
            <label className="modal-label">
              Patient Name <span className="modal-required">*</span>
            </label>
            <input
              className={`modal-input ${errors.patient ? "error" : ""}`}
              placeholder="Enter patient full name"
              value={form.patient}
              onChange={(e) => set("patient", e.target.value)}
            />
            {errors.patient && (
              <span className="modal-error">{errors.patient}</span>
            )}
          </div>

          {/* Doctor */}
          <div className="modal-field">
            <label className="modal-label">Assign Doctor</label>
            <div className="modal-select-wrap">
              <select
                className="modal-select"
                value={form.doctor}
                onChange={(e) => set("doctor", e.target.value)}
              >
                {DOCTORS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              <ChevronDown size={14} className="modal-select-icon" />
            </div>
          </div>

          {/* Date & Time */}
          <div className="modal-row">
            <div className="modal-field">
              <label className="modal-label">
                Date <span className="modal-required">*</span>
              </label>

              <input
                type="date"
                className={`modal-input ${errors.date ? "error" : ""}`}
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
              />

              {errors.date && (
                <span className="modal-error">{errors.date}</span>
              )}
            </div>
            <div className="modal-field">
              <label className="modal-label">Time</label>
              <div className="modal-select-wrap">
                <select
                  className="modal-select"
                  value={form.time}
                  onChange={(e) => set("time", e.target.value)}
                >
                  {TIMES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="modal-select-icon" />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="modal-field">
            <label className="modal-label">Status</label>
            <div className="modal-status-group">
              {(["Pending", "Confirmed", "Cancelled"] as Status[]).map((s) => (
                <button
                  key={s}
                  className={`modal-status-btn ${form.status === s ? "active " + s.toLowerCase() : ""}`}
                  onClick={() => set("status", s)}
                >
                  {form.status === s && <Check size={12} />} {s}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="modal-field">
            <label className="modal-label">
              Notes <span className="modal-optional">(optional)</span>
            </label>
            <textarea
              className="modal-textarea"
              placeholder="Add any notes or reason for visit..."
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn-save" onClick={handleSubmit}>
            {rescheduleMode
              ? "Confirm Reschedule"
              : editData
                ? "Save Changes"
                : "Book Appointment"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Confirm Delete Modal ─────────────────────────────────
interface ConfirmModalProps {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  name,
  onConfirm,
  onCancel,
}) => (
  <div className="modal-overlay" onClick={onCancel}>
    <div
      className="modal-box modal-box--sm"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <h2 className="modal-title">Cancel Appointment</h2>
        <button className="modal-close" onClick={onCancel}>
          <X size={18} />
        </button>
      </div>
      <div className="modal-body">
        <p className="confirm-text">
          Are you sure you want to cancel <strong>{name}</strong>'s appointment?
          This action cannot be undone.
        </p>
      </div>
      <div className="modal-footer">
        <button className="modal-btn-cancel" onClick={onCancel}>
          Keep Appointment
        </button>
        <button className="modal-btn-danger" onClick={onConfirm}>
          Yes, Cancel It
        </button>
      </div>
    </div>
  </div>
);

// ── Main Component ───────────────────────────────────────
const Appointments: React.FC = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [appointments, setAppointments] =
    React.useState<Appointment[]>(initialAppointments);
  const [selected, setSelected] = React.useState<Appointment>(appointments[0]);
  const [calendarView, setCalendarView] = React.useState<
    "Day" | "Week" | "Month"
  >("Week");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [dateFilter, setDateFilter] = React.useState("All");
  const [doctorFilter, setDoctorFilter] = React.useState("All");
  const [showDateDropdown, setShowDateDropdown] = React.useState(false);
  const [showDoctorDropdown, setShowDoctorDropdown] = React.useState(false);
  const [showBookModal, setShowBookModal] = React.useState(false);
  const [rescheduleMode, setRescheduleMode] = React.useState(false);
  const [editData, setEditData] = React.useState<Appointment | null>(null);
  const [confirmCancel, setConfirmCancel] = React.useState<Appointment | null>(
    null,
  );
  const [toast, setToast] = React.useState<string | null>(null);
  const calendarDays = getMonthDays(currentDate);
  const dateRef = React.useRef<HTMLDivElement>(null);
  const doctorRef = React.useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(e.target as Node))
        setShowDateDropdown(false);
      if (doctorRef.current && !doctorRef.current.contains(e.target as Node))
        setShowDoctorDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const DATE_OPTIONS = ["All", "Today", "This Week", "This Month"];
  const DOCTOR_OPTIONS = ["All", ...DOCTORS];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const isSameDay = (d1: Date, d2: Date) =>
    d1.toDateString() === d2.toDateString();

  const isThisWeek = (date: Date) => {
    const now = new Date();
    const first = new Date(now.setDate(now.getDate() - now.getDay()));
    const last = new Date(now.setDate(first.getDate() + 6));
    return date >= first && date <= last;
  };

  const isThisMonth = (date: Date) => {
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate); // clone the date
      newDate.setMonth(newDate.getMonth() - 1); // go to previous month
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate); // clone the date
      newDate.setMonth(newDate.getMonth() + 1); // go to next month
      return newDate;
    });
  };

  const filtered = appointments.filter((a) => {
    const matchSearch =
      a.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.doctor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    const matchDoctor = doctorFilter === "All" || a.doctor === doctorFilter;

    const matchDate = (() => {
      const today = new Date();

      if (dateFilter === "All") return true;
      if (dateFilter === "Today") return isSameDay(a.date, today);
      if (dateFilter === "This Week") return isThisWeek(a.date);
      if (dateFilter === "This Month") return isThisMonth(a.date);

      return true;
    })();

    return matchSearch && matchStatus && matchDoctor && matchDate;
  });

  const handleSave = (appt: Appointment) => {
    if (editData) {
      setAppointments((prev) => prev.map((a) => (a.id === appt.id ? appt : a)));
      setSelected(appt);
      showToast(
        rescheduleMode
          ? "Appointment rescheduled successfully"
          : "Appointment updated successfully",
      );
    } else {
      setAppointments((prev) => [...prev, appt]);
      setSelected(appt);
      showToast("Appointment booked successfully");
    }
    setShowBookModal(false);
    setEditData(null);
    setRescheduleMode(false);
  };

  const handleEdit = (appt: Appointment) => {
    setEditData(appt);
    setRescheduleMode(false);
    setShowBookModal(true);
  };

  const handleCancelConfirm = () => {
    if (!confirmCancel) return;
    const updated = { ...confirmCancel, status: "Cancelled" as Status };
    setAppointments((prev) =>
      prev.map((a) => (a.id === confirmCancel.id ? updated : a)),
    );
    setSelected(updated);
    setConfirmCancel(null);
    showToast("Appointment cancelled");
  };

  const handleReschedule = (appt: Appointment) => {
    setEditData({ ...appt, date: new Date(), time: TIMES[0] });
    setRescheduleMode(true);
    setShowBookModal(true);
  };

  return (
    <div className="appt-container">
      {/* Toast */}
      {toast && (
        <div className="appt-toast">
          <Check size={15} /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="appointment-header">
        <h1 className="appointment-title">Appointments</h1>
        <p className="appointment-subtitle">
          Manage and schedule patient appointments
        </p>
      </div>

      {/* Toolbar */}
      <div className="appt-toolbar">
        <div />
        <button
          className="appt-book-btn"
          onClick={() => {
            setEditData(null);
            setRescheduleMode(false);
            setShowBookModal(true);
          }}
        >
          <Plus size={16} /> Book New Appointment
        </button>
      </div>

      {/* Split View */}
      <div className="appt-split">
        {/* Calendar Panel */}
        <div className="appt-calendar-panel">
          <div className="appt-calendar-top">
            <div className="appt-cal-nav">
              {/* Previous Month Button */}
              <button className="appt-cal-nav-btn" onClick={handlePrevMonth}>
                &lt;
              </button>

              {/* Current Month and Year */}
              <span className="appt-calendar-month">
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>

              {/* Next Month Button */}
              <button className="appt-cal-nav-btn" onClick={handleNextMonth}>
                &gt;
              </button>
            </div>
            <div className="appt-view-toggle">
              {(["Day", "Week", "Month"] as const).map((v) => (
                <button
                  key={v}
                  className={`appt-view-btn ${calendarView === v ? "active" : ""}`}
                  onClick={() => setCalendarView(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="appt-calendar-grid">
            {calendarDays.map((date, i) => {
              if (!date) return <div key={i} className="appt-cal-date empty" />;

              const hasAppt = appointments.some(
                (a) =>
                  a.date.getDate() === date &&
                  a.date.getMonth() === currentDate.getMonth() &&
                  a.date.getFullYear() === currentDate.getFullYear() &&
                  a.status !== "Cancelled",
              );

              const isToday =
                date === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={i}
                  className={`appt-cal-date ${isToday ? "today" : ""}`}
                >
                  {date}
                  {hasAppt && <span className="appt-cal-dot" />}
                </div>
              );
            })}
          </div>

          {/* Today's slots */}
          <div className="appt-time-slots">
            <p className="appt-slots-label">Schedule</p>
            {appointments
              .filter((a) => {
                const appointmentDate = new Date(a.date);
                const current = new Date();

                if (calendarView === "Day") {
                  return isSameDay(appointmentDate, current);
                }

                if (calendarView === "Week") {
                  const startOfWeek = new Date(current);
                  startOfWeek.setDate(current.getDate() - current.getDay());
                  const endOfWeek = new Date(startOfWeek);
                  endOfWeek.setDate(startOfWeek.getDate() + 6);
                  return (
                    appointmentDate >= startOfWeek &&
                    appointmentDate <= endOfWeek
                  );
                }

                if (calendarView === "Month") {
                  return (
                    appointmentDate.getMonth() === current.getMonth() &&
                    appointmentDate.getFullYear() === current.getFullYear()
                  );
                }

                // Default fallback, show all
                return true;
              })
              .map((a) => (
                <div
                  key={a.id}
                  className={`appt-slot ${selected?.id === a.id ? "selected" : ""}`}
                  onClick={() => setSelected(a)}
                >
                  <span className="appt-slot-time">{a.time}</span>
                  <span className="appt-slot-name">{a.patient}</span>
                  <span className={`appt-slot-badge ${a.status.toLowerCase()}`}>
                    {a.status}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="appt-detail-panel">
          {selected ? (
            <>
              <div className="appt-detail-top">
                <span className="appt-detail-label">Appointment Detail</span>
                <span className={`appt-badge ${selected.status.toLowerCase()}`}>
                  {selected.status}
                </span>
              </div>
              <div className="appt-detail-avatar">{selected.avatar}</div>
              <h3 className="appt-detail-name">{selected.patient}</h3>
              <div className="appt-detail-rows">
                <div className="appt-detail-row">
                  <User size={14} />
                  <span className="appt-detail-row-label">Doctor</span>
                  <span className="appt-detail-row-value">
                    {selected.doctor}
                  </span>
                </div>
                <div className="appt-detail-row">
                  <Calendar size={14} />
                  <span className="appt-detail-row-label">Date</span>
                  <span className="appt-detail-row-value">
                    {selected.date.toDateString()}
                  </span>
                </div>
                <div className="appt-detail-row">
                  <Clock size={14} />
                  <span className="appt-detail-row-label">Time</span>
                  <span className="appt-detail-row-value">{selected.time}</span>
                </div>
                {selected.notes && (
                  <div className="appt-detail-notes">{selected.notes}</div>
                )}
              </div>
              <div className="appt-detail-actions">
                <button
                  className="appt-action-btn edit"
                  onClick={() => handleEdit(selected)}
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  className="appt-action-btn reschedule"
                  onClick={() => handleReschedule(selected)}
                >
                  <RefreshCw size={14} /> Reschedule
                </button>
                <button
                  className="appt-action-btn cancel"
                  onClick={() => setConfirmCancel(selected)}
                >
                  <X size={14} /> Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="appt-detail-empty">
              Select an appointment to view details
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="appt-table-card">
        <div className="appt-table-header">
          <h2 className="appt-table-title">All Appointments</h2>
          <div className="appt-table-filters">
            {/* Search */}
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

            {/* Date Filter */}
            <div className="appt-filter-wrap" ref={dateRef}>
              <div
                className={`appt-filter ${dateFilter !== "All" ? "active" : ""}`}
                onClick={() => {
                  setShowDateDropdown((p) => !p);
                  setShowDoctorDropdown(false);
                }}
              >
                <Calendar size={14} />
                {dateFilter === "All" ? "Date" : dateFilter}
                <ChevronDown
                  size={14}
                  className={showDateDropdown ? "rotated" : ""}
                />
              </div>
              {showDateDropdown && (
                <div className="appt-dropdown appt-dropdown--right">
                  {DATE_OPTIONS.map((opt) => (
                    <div
                      key={opt}
                      className={`appt-dropdown-item ${dateFilter === opt ? "selected" : ""}`}
                      onClick={() => {
                        setDateFilter(opt);
                        setShowDateDropdown(false);
                      }}
                    >
                      {dateFilter === opt && <Check size={13} />} {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Doctor Filter */}
            <div className="appt-filter-wrap" ref={doctorRef}>
              <div
                className={`appt-filter ${doctorFilter !== "All" ? "active" : ""}`}
                onClick={() => {
                  setShowDoctorDropdown((p) => !p);
                  setShowDateDropdown(false);
                }}
              >
                <User size={14} />
                {doctorFilter === "All" ? "Doctor" : doctorFilter}
                <ChevronDown
                  size={14}
                  className={showDoctorDropdown ? "rotated" : ""}
                />
              </div>
              {showDoctorDropdown && (
                <div className="appt-dropdown appt-dropdown--right">
                  {DOCTOR_OPTIONS.map((opt) => (
                    <div
                      key={opt}
                      className={`appt-dropdown-item ${doctorFilter === opt ? "selected" : ""}`}
                      onClick={() => {
                        setDoctorFilter(opt);
                        setShowDoctorDropdown(false);
                      }}
                    >
                      {doctorFilter === opt && <Check size={13} />} {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status Tabs */}
            <div className="appt-filter-tabs">
              {["All", "Confirmed", "Pending", "Cancelled"].map((s) => (
                <button
                  key={s}
                  className={`appt-filter-tab ${statusFilter === s ? "active" : ""}`}
                  onClick={() => setStatusFilter(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            <span className="appt-table-count">{filtered.length} records</span>
          </div>
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="appt-table-empty">
                    No appointments found
                  </td>
                </tr>
              ) : (
                filtered.map((apt) => (
                  <tr
                    key={apt.id}
                    className={`appt-table-row ${selected?.id === apt.id ? "row-selected" : ""}`}
                    onClick={() => setSelected(apt)}
                  >
                    <td>
                      <div className="appt-patient-cell">
                        <span className="appt-patient-avatar">
                          {apt.avatar}
                        </span>
                        <span className="appt-patient-name">{apt.patient}</span>
                      </div>
                    </td>
                    <td className="appt-doctor-cell">{apt.doctor}</td>
                    <td>{apt.date.toDateString()}</td>
                    <td>
                      <div className="appt-time-cell">
                        <Clock size={13} /> {apt.time}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`appt-badge ${apt.status.toLowerCase()}`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="appt-actions-cell">
                        <button
                          className="appt-icon-btn"
                          title="Edit"
                          onClick={() => handleEdit(apt)}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="appt-icon-btn"
                          title="Reschedule"
                          onClick={() => handleReschedule(apt)}
                        >
                          <RefreshCw size={14} />
                        </button>
                        <button
                          className="appt-icon-btn danger"
                          title="Cancel"
                          onClick={() => setConfirmCancel(apt)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showBookModal && (
        <BookModal
          onClose={() => {
            setShowBookModal(false);
            setEditData(null);
            setRescheduleMode(false);
          }}
          onSave={handleSave}
          editData={editData}
          rescheduleMode={rescheduleMode}
        />
      )}
      {confirmCancel && (
        <ConfirmModal
          name={confirmCancel.patient}
          onConfirm={handleCancelConfirm}
          onCancel={() => setConfirmCancel(null)}
        />
      )}
    </div>
  );
};

export default Appointments;
