import * as React from "react";
import {
  Search,
  Plus,
  FileText,
  ChevronDown,
  ChevronUp,
  Printer,
  Download,
  X,
  Check,
  User,
  Phone,
  Calendar,
  AlertCircle,
  Pill,
  FlaskConical,
  ClipboardList,
  Edit2,
} from "lucide-react";
import "./HealthRecords.css";

type TabKey = "info" | "history" | "labs" | "notes" | "rx";

interface LabResult {
  id: number;
  name: string;
  date: string;
  result: string;
  status: "Normal" | "Abnormal" | "Pending";
}

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: string;
  status: "Active" | "Discontinued";
}

interface ClinicalNote {
  id: number;
  date: string;
  doctor: string;
  note: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  email: string;
  address: string;
  lastVisit: string;
  bloodType: string;
  allergies: string[];
  conditions: string[];
  diagnoses: string[];
  labs: LabResult[];
  notes: ClinicalNote[];
  medications: Medication[];
  avatar: string;
}

const initialPatients: Patient[] = [
  {
    id: "P-001",
    name: "John Doe",
    age: 34,
    gender: "Male",
    contact: "+1 555-0101",
    email: "john.doe@email.com",
    address: "123 Main St, Springfield",
    lastVisit: "Mar 20, 2026",
    bloodType: "O+",
    avatar: "👨",
    allergies: ["Penicillin", "Shellfish"],
    conditions: ["Hypertension", "Type 2 Diabetes"],
    diagnoses: [
      "Essential Hypertension (I10)",
      "Type 2 Diabetes Mellitus (E11)",
    ],
    labs: [
      {
        id: 1,
        name: "CBC Panel",
        date: "Mar 20, 2026",
        result: "WBC: 7.2, RBC: 4.8",
        status: "Normal",
      },
      {
        id: 2,
        name: "HbA1c",
        date: "Mar 20, 2026",
        result: "7.8%",
        status: "Abnormal",
      },
      {
        id: 3,
        name: "Lipid Panel",
        date: "Feb 10, 2026",
        result: "Pending review",
        status: "Pending",
      },
    ],
    notes: [
      {
        id: 1,
        date: "Mar 20, 2026",
        doctor: "Dr. Smith",
        note: "Patient reports improved blood sugar control. Advised to continue current medication and maintain low-carb diet.",
      },
      {
        id: 2,
        date: "Jan 15, 2026",
        doctor: "Dr. Smith",
        note: "Follow-up visit. BP slightly elevated at 140/90. Adjusted antihypertensive dosage.",
      },
    ],
    medications: [
      {
        id: 1,
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        prescribedBy: "Dr. Smith",
        startDate: "Jan 2025",
        status: "Active",
      },
      {
        id: 2,
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        prescribedBy: "Dr. Smith",
        startDate: "Mar 2024",
        status: "Active",
      },
      {
        id: 3,
        name: "Aspirin",
        dosage: "81mg",
        frequency: "Once daily",
        prescribedBy: "Dr. Lee",
        startDate: "Jun 2023",
        status: "Discontinued",
      },
    ],
  },
  {
    id: "P-002",
    name: "Jane Smith",
    age: 28,
    gender: "Female",
    contact: "+1 555-0202",
    email: "jane.smith@email.com",
    address: "456 Oak Ave, Riverdale",
    lastVisit: "Mar 22, 2026",
    bloodType: "A+",
    avatar: "👩",
    allergies: ["Latex"],
    conditions: ["Asthma"],
    diagnoses: ["Mild Persistent Asthma (J45.30)"],
    labs: [
      {
        id: 1,
        name: "Spirometry",
        date: "Mar 22, 2026",
        result: "FEV1: 82%",
        status: "Normal",
      },
    ],
    notes: [
      {
        id: 1,
        date: "Mar 22, 2026",
        doctor: "Dr. Lee",
        note: "Asthma well controlled. Continue current inhaler regimen.",
      },
    ],
    medications: [
      {
        id: 1,
        name: "Albuterol Inhaler",
        dosage: "90mcg",
        frequency: "As needed",
        prescribedBy: "Dr. Lee",
        startDate: "Apr 2024",
        status: "Active",
      },
    ],
  },
  {
    id: "P-003",
    name: "Mike Johnson",
    age: 52,
    gender: "Male",
    contact: "+1 555-0303",
    email: "mike.j@email.com",
    address: "789 Pine Rd, Shelbyville",
    lastVisit: "Mar 18, 2026",
    bloodType: "B-",
    avatar: "👨",
    allergies: ["Sulfa drugs"],
    conditions: ["Chronic Back Pain", "High Cholesterol"],
    diagnoses: ["Lumbar Disc Herniation (M51.1)", "Hyperlipidemia (E78.5)"],
    labs: [
      {
        id: 1,
        name: "Lipid Panel",
        date: "Mar 18, 2026",
        result: "LDL: 145 mg/dL",
        status: "Abnormal",
      },
      {
        id: 2,
        name: "X-Ray Lumbar",
        date: "Mar 18, 2026",
        result: "L4-L5 disc narrowing",
        status: "Abnormal",
      },
    ],
    notes: [
      {
        id: 1,
        date: "Mar 18, 2026",
        doctor: "Dr. Williams",
        note: "Patient experiencing increased back pain. Referred to physical therapy. MRI ordered.",
      },
    ],
    medications: [
      {
        id: 1,
        name: "Atorvastatin",
        dosage: "20mg",
        frequency: "Once daily at bedtime",
        prescribedBy: "Dr. Williams",
        startDate: "Sep 2024",
        status: "Active",
      },
      {
        id: 2,
        name: "Ibuprofen",
        dosage: "400mg",
        frequency: "As needed for pain",
        prescribedBy: "Dr. Williams",
        startDate: "Mar 2026",
        status: "Active",
      },
    ],
  },
  {
    id: "P-004",
    name: "Sarah Williams",
    age: 45,
    gender: "Female",
    contact: "+1 555-0404",
    email: "sarah.w@email.com",
    address: "321 Elm St, Capital City",
    lastVisit: "Mar 10, 2026",
    bloodType: "AB+",
    avatar: "👩",
    allergies: [],
    conditions: ["Migraine", "Anxiety"],
    diagnoses: [
      "Chronic Migraine (G43.709)",
      "Generalized Anxiety Disorder (F41.1)",
    ],
    labs: [
      {
        id: 1,
        name: "MRI Brain",
        date: "Feb 28, 2026",
        result: "No structural abnormalities",
        status: "Normal",
      },
    ],
    notes: [
      {
        id: 1,
        date: "Mar 10, 2026",
        doctor: "Dr. Brown",
        note: "Migraine frequency reduced with current preventive therapy. Continue Topiramate.",
      },
    ],
    medications: [
      {
        id: 1,
        name: "Topiramate",
        dosage: "50mg",
        frequency: "Twice daily",
        prescribedBy: "Dr. Brown",
        startDate: "Oct 2025",
        status: "Active",
      },
      {
        id: 2,
        name: "Sertraline",
        dosage: "50mg",
        frequency: "Once daily",
        prescribedBy: "Dr. Brown",
        startDate: "Jul 2024",
        status: "Active",
      },
    ],
  },
  {
    id: "P-005",
    name: "Emily Davis",
    age: 31,
    gender: "Female",
    contact: "+1 555-0505",
    email: "emily.davis@email.com",
    address: "567 Maple Dr, Oakwood",
    lastVisit: "Mar 15, 2026",
    bloodType: "O-",
    avatar: "👩",
    allergies: ["Peanuts", "Dust"],
    conditions: ["Hypothyroidism", "Seasonal Allergies"],
    diagnoses: ["Hypothyroidism (E03.9)", "Allergic Rhinitis (J30.9)"],
    labs: [
      {
        id: 1,
        name: "TSH",
        date: "Mar 15, 2026",
        result: "4.8 mIU/L",
        status: "Abnormal",
      },
      {
        id: 2,
        name: "T4 Free",
        date: "Mar 15, 2026",
        result: "0.9 ng/dL",
        status: "Normal",
      },
    ],
    notes: [
      {
        id: 1,
        date: "Mar 15, 2026",
        doctor: "Dr. Garcia",
        note: "Patient reports fatigue and weight gain. Adjusted levothyroxine dosage to 75mcg. Follow up in 6 weeks.",
      },
    ],
    medications: [
      {
        id: 1,
        name: "Levothyroxine",
        dosage: "75mcg",
        frequency: "Once daily",
        prescribedBy: "Dr. Garcia",
        startDate: "Mar 2026",
        status: "Active",
      },
      {
        id: 2,
        name: "Cetirizine",
        dosage: "10mg",
        frequency: "Once daily as needed",
        prescribedBy: "Dr. Garcia",
        startDate: "Feb 2025",
        status: "Active",
      },
    ],
  },
  {
    id: "P-006",
    name: "David Brown",
    age: 67,
    gender: "Male",
    contact: "+1 555-0606",
    email: "david.brown@email.com",
    address: "890 Cedar Ln, Lakeside",
    lastVisit: "Mar 5, 2026",
    bloodType: "B+",
    avatar: "👨",
    allergies: ["Codeine", "Iodine"],
    conditions: ["Atrial Fibrillation", "Osteoarthritis", "Glaucoma"],
    diagnoses: [
      "Paroxysmal Atrial Fibrillation (I48.0)",
      "Osteoarthritis of Knee (M17.9)",
      "Primary Open-Angle Glaucoma (H40.1)",
    ],
    labs: [
      {
        id: 1,
        name: "INR",
        date: "Mar 5, 2026",
        result: "2.5",
        status: "Normal",
      },
      {
        id: 2,
        name: "Comprehensive Metabolic Panel",
        date: "Mar 5, 2026",
        result: "All values within normal limits",
        status: "Normal",
      },
      {
        id: 3,
        name: "ECG",
        date: "Feb 28, 2026",
        result: "Normal sinus rhythm, no arrhythmias",
        status: "Normal",
      },
    ],
    notes: [
      {
        id: 1,
        date: "Mar 5, 2026",
        doctor: "Dr. Smith",
        note: "INR stable at 2.5. Continue warfarin therapy. Scheduled for follow-up ECG in 3 months.",
      },
      {
        id: 2,
        date: "Feb 15, 2026",
        doctor: "Dr. Williams",
        note: "Knee pain improving with physical therapy. Continue exercises at home.",
      },
    ],
    medications: [
      {
        id: 1,
        name: "Warfarin",
        dosage: "5mg",
        frequency: "Once daily",
        prescribedBy: "Dr. Smith",
        startDate: "Jan 2024",
        status: "Active",
      },
      {
        id: 2,
        name: "Acetaminophen",
        dosage: "500mg",
        frequency: "As needed for pain",
        prescribedBy: "Dr. Williams",
        startDate: "Oct 2025",
        status: "Active",
      },
      {
        id: 3,
        name: "Latanoprost",
        dosage: "0.005%",
        frequency: "Once daily at bedtime",
        prescribedBy: "Dr. Chen",
        startDate: "Mar 2025",
        status: "Active",
      },
    ],
  },
  // New Patient 7
  {
    id: "P-007",
    name: "Lisa Martinez",
    age: 42,
    gender: "Female",
    contact: "+1 555-0707",
    email: "lisa.martinez@email.com",
    address: "432 Willow Way, Brookfield",
    lastVisit: "Mar 12, 2026",
    bloodType: "AB-",
    avatar: "👩",
    allergies: ["Aspirin", "Sulfa"],
    conditions: ["Rheumatoid Arthritis", "Osteoporosis"],
    diagnoses: ["Rheumatoid Arthritis (M05.9)", "Osteoporosis (M81.0)"],
    labs: [
      {
        id: 1,
        name: "Rheumatoid Factor",
        date: "Mar 12, 2026",
        result: "45 IU/mL",
        status: "Abnormal",
      },
      {
        id: 2,
        name: "Vitamin D",
        date: "Mar 12, 2026",
        result: "22 ng/mL",
        status: "Abnormal",
      },
      {
        id: 3,
        name: "Bone Density Scan",
        date: "Mar 1, 2026",
        result: "T-score: -2.5",
        status: "Abnormal",
      },
    ],
    notes: [
      {
        id: 1,
        date: "Mar 12, 2026",
        doctor: "Dr. Garcia",
        note: "Patient reports joint pain and stiffness in hands and wrists. Started on methotrexate. Prescribed calcium and vitamin D supplements.",
      },
      {
        id: 2,
        date: "Jan 20, 2026",
        doctor: "Dr. Garcia",
        note: "Osteoporosis diagnosed. Started on alendronate weekly. Discussed fall prevention strategies.",
      },
    ],
    medications: [
      {
        id: 1,
        name: "Methotrexate",
        dosage: "15mg",
        frequency: "Once weekly",
        prescribedBy: "Dr. Garcia",
        startDate: "Mar 2026",
        status: "Active",
      },
      {
        id: 2,
        name: "Alendronate",
        dosage: "70mg",
        frequency: "Once weekly",
        prescribedBy: "Dr. Garcia",
        startDate: "Jan 2026",
        status: "Active",
      },
      {
        id: 3,
        name: "Calcium + Vitamin D",
        dosage: "600mg/800 IU",
        frequency: "Twice daily",
        prescribedBy: "Dr. Garcia",
        startDate: "Jan 2026",
        status: "Active",
      },
      {
        id: 4,
        name: "Folic Acid",
        dosage: "1mg",
        frequency: "Once daily",
        prescribedBy: "Dr. Garcia",
        startDate: "Mar 2026",
        status: "Active",
      },
    ],
  },
];

// ── Patient Modal ──────────────────────────────────────────
interface PatientModalProps {
  onClose: () => void;
  onSave: (p: Patient) => void;
  editData?: Patient | null;
}

const PatientModal: React.FC<PatientModalProps> = ({
  onClose,
  onSave,
  editData,
}) => {
  const [form, setForm] = React.useState({
    name: editData?.name ?? "",
    age: editData?.age?.toString() ?? "",
    gender: editData?.gender ?? "Male",
    contact: editData?.contact ?? "",
    email: editData?.email ?? "",
    address: editData?.address ?? "",
    bloodType: editData?.bloodType ?? "O+",
    allergies: editData?.allergies.join(", ") ?? "",
    conditions: editData?.conditions.join(", ") ?? "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const set = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => {
      const n = { ...e };
      delete n[field];
      return n;
    });
  };

  const handleSubmit = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.age || isNaN(Number(form.age))) e.age = "Valid age required";
    if (!form.contact.trim()) e.contact = "Contact is required";
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSave({
      id: editData?.id ?? `P-${String(Date.now()).slice(-3)}`,
      name: form.name,
      age: Number(form.age),
      gender: form.gender,
      contact: form.contact,
      email: form.email,
      address: form.address,
      lastVisit: editData?.lastVisit ?? "Just added",
      bloodType: form.bloodType,
      avatar: form.gender === "Female" ? "👩" : "👨",
      allergies: form.allergies
        ? form.allergies
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      conditions: form.conditions
        ? form.conditions
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      diagnoses: editData?.diagnoses ?? [],
      labs: editData?.labs ?? [],
      notes: editData?.notes ?? [],
      medications: editData?.medications ?? [],
    });
  };

  return (
    <div className="hr-modal-overlay" onClick={onClose}>
      <div className="hr-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="hr-modal-header">
          <div>
            <h2 className="hr-modal-title">
              {editData ? "Edit Patient" : "Add New Patient"}
            </h2>
            <p className="hr-modal-subtitle">
              {editData
                ? "Update patient information"
                : "Create a new patient record"}
            </p>
          </div>
          <button className="hr-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="hr-modal-body">
          <div className="hr-modal-row">
            <div className="hr-modal-field">
              <label className="hr-modal-label">
                Full Name <span className="hr-required">*</span>
              </label>
              <input
                className={`hr-modal-input ${errors.name ? "error" : ""}`}
                placeholder="Enter full name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
              {errors.name && (
                <span className="hr-modal-error">{errors.name}</span>
              )}
            </div>
            <div className="hr-modal-field">
              <label className="hr-modal-label">
                Age <span className="hr-required">*</span>
              </label>
              <input
                className={`hr-modal-input ${errors.age ? "error" : ""}`}
                placeholder="e.g. 35"
                value={form.age}
                onChange={(e) => set("age", e.target.value)}
              />
              {errors.age && (
                <span className="hr-modal-error">{errors.age}</span>
              )}
            </div>
          </div>
          <div className="hr-modal-row">
            <div className="hr-modal-field">
              <label className="hr-modal-label">Gender</label>
              <div className="hr-modal-select-wrap">
                <select
                  className="hr-modal-select"
                  value={form.gender}
                  onChange={(e) => set("gender", e.target.value)}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                <ChevronDown size={14} className="hr-modal-select-icon" />
              </div>
            </div>
            <div className="hr-modal-field">
              <label className="hr-modal-label">Blood Type</label>
              <div className="hr-modal-select-wrap">
                <select
                  className="hr-modal-select"
                  value={form.bloodType}
                  onChange={(e) => set("bloodType", e.target.value)}
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (b) => (
                      <option key={b}>{b}</option>
                    ),
                  )}
                </select>
                <ChevronDown size={14} className="hr-modal-select-icon" />
              </div>
            </div>
          </div>
          <div className="hr-modal-row">
            <div className="hr-modal-field">
              <label className="hr-modal-label">
                Contact <span className="hr-required">*</span>
              </label>
              <input
                className={`hr-modal-input ${errors.contact ? "error" : ""}`}
                placeholder="+1 555-0000"
                value={form.contact}
                onChange={(e) => set("contact", e.target.value)}
              />
              {errors.contact && (
                <span className="hr-modal-error">{errors.contact}</span>
              )}
            </div>
            <div className="hr-modal-field">
              <label className="hr-modal-label">Email</label>
              <input
                className="hr-modal-input"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
          </div>
          <div className="hr-modal-field">
            <label className="hr-modal-label">Address</label>
            <input
              className="hr-modal-input"
              placeholder="Street, City"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </div>
          <div className="hr-modal-field">
            <label className="hr-modal-label">
              Allergies <span className="hr-optional">(comma separated)</span>
            </label>
            <input
              className="hr-modal-input"
              placeholder="e.g. Penicillin, Shellfish"
              value={form.allergies}
              onChange={(e) => set("allergies", e.target.value)}
            />
          </div>
          <div className="hr-modal-field">
            <label className="hr-modal-label">
              Medical Conditions{" "}
              <span className="hr-optional">(comma separated)</span>
            </label>
            <input
              className="hr-modal-input"
              placeholder="e.g. Hypertension, Diabetes"
              value={form.conditions}
              onChange={(e) => set("conditions", e.target.value)}
            />
          </div>
        </div>
        <div className="hr-modal-footer">
          <button className="hr-modal-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="hr-modal-btn-save" onClick={handleSubmit}>
            {editData ? "Save Changes" : "Add Patient"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── New Record Modal ───────────────────────────────────────
interface NewRecordModalProps {
  patient: Patient;
  onClose: () => void;
  onSave: (note: ClinicalNote) => void;
}

const NewRecordModal: React.FC<NewRecordModalProps> = ({
  patient,
  onClose,
  onSave,
}) => {
  const [note, setNote] = React.useState("");
  const [doctor, setDoctor] = React.useState("Dr. Smith");
  const DOCTORS = [
    "Dr. Smith",
    "Dr. Lee",
    "Dr. Williams",
    "Dr. Brown",
    "Dr. Garcia",
  ];
  const handleSubmit = () => {
    if (!note.trim()) return;
    onSave({ id: Date.now(), date: "Mar 25, 2026", doctor, note });
  };
  return (
    <div className="hr-modal-overlay" onClick={onClose}>
      <div
        className="hr-modal-box hr-modal-box--sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="hr-modal-header">
          <div>
            <h2 className="hr-modal-title">New Clinical Record</h2>
            <p className="hr-modal-subtitle">
              Adding note for <strong>{patient.name}</strong>
            </p>
          </div>
          <button className="hr-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="hr-modal-body">
          <div className="hr-modal-field">
            <label className="hr-modal-label">Doctor</label>
            <div className="hr-modal-select-wrap">
              <select
                className="hr-modal-select"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
              >
                {DOCTORS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              <ChevronDown size={14} className="hr-modal-select-icon" />
            </div>
          </div>
          <div className="hr-modal-field">
            <label className="hr-modal-label">
              Clinical Note <span className="hr-required">*</span>
            </label>
            <textarea
              className="hr-modal-textarea"
              rows={5}
              placeholder="Enter clinical observations, diagnosis, treatment plan..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        <div className="hr-modal-footer">
          <button className="hr-modal-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="hr-modal-btn-save" onClick={handleSubmit}>
            Save Record
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Tab Sub-components ─────────────────────────────────────
const InfoTab: React.FC<{ patient: Patient }> = ({ patient }) => (
  <div className="hr-tab-content">
    <div className="hr-info-grid">
      <div className="hr-info-item">
        <span className="hr-info-label">
          <User size={13} /> Full Name
        </span>
        <span className="hr-info-value">{patient.name}</span>
      </div>
      <div className="hr-info-item">
        <span className="hr-info-label">
          <User size={13} /> Age / Gender
        </span>
        <span className="hr-info-value">
          {patient.age} / {patient.gender}
        </span>
      </div>
      <div className="hr-info-item">
        <span className="hr-info-label">
          <Phone size={13} /> Contact
        </span>
        <span className="hr-info-value">{patient.contact}</span>
      </div>
      <div className="hr-info-item">
        <span className="hr-info-label">
          <Phone size={13} /> Email
        </span>
        <span className="hr-info-value">{patient.email}</span>
      </div>
      <div className="hr-info-item">
        <span className="hr-info-label">
          <FileText size={13} /> Patient ID
        </span>
        <span className="hr-info-value">{patient.id}</span>
      </div>
      <div className="hr-info-item">
        <span className="hr-info-label">
          <AlertCircle size={13} /> Blood Type
        </span>
        <span className="hr-info-value">{patient.bloodType}</span>
      </div>
      <div className="hr-info-item hr-info-item--full">
        <span className="hr-info-label">
          <FileText size={13} /> Address
        </span>
        <span className="hr-info-value">{patient.address}</span>
      </div>
      <div className="hr-info-item hr-info-item--full">
        <span className="hr-info-label">
          <AlertCircle size={13} /> Allergies
        </span>
        <div className="hr-tag-list">
          {patient.allergies.length ? (
            patient.allergies.map((a) => (
              <span key={a} className="hr-tag hr-tag--red">
                {a}
              </span>
            ))
          ) : (
            <span className="hr-no-data">None recorded</span>
          )}
        </div>
      </div>
      <div className="hr-info-item hr-info-item--full">
        <span className="hr-info-label">
          <AlertCircle size={13} /> Medical Conditions
        </span>
        <div className="hr-tag-list">
          {patient.conditions.length ? (
            patient.conditions.map((c) => (
              <span key={c} className="hr-tag hr-tag--blue">
                {c}
              </span>
            ))
          ) : (
            <span className="hr-no-data">None recorded</span>
          )}
        </div>
      </div>
    </div>
  </div>
);

const HistoryTab: React.FC<{ patient: Patient }> = ({ patient }) => (
  <div className="hr-tab-content">
    <p className="hr-section-label">Previous Diagnoses</p>
    {patient.diagnoses.length === 0 ? (
      <p className="hr-no-data">No diagnoses recorded</p>
    ) : (
      <div className="hr-diagnosis-list">
        {patient.diagnoses.map((d, i) => (
          <div key={i} className="hr-diagnosis-item">
            <ClipboardList size={14} />
            <span>{d}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

const LabsTab: React.FC<{ patient: Patient }> = ({ patient }) => (
  <div className="hr-tab-content">
    {patient.labs.length === 0 ? (
      <p className="hr-no-data">No lab results</p>
    ) : (
      <div className="hr-labs-list">
        {patient.labs.map((lab) => (
          <div key={lab.id} className="hr-lab-item">
            <div className="hr-lab-left">
              <FlaskConical size={15} className="hr-lab-icon" />
              <div>
                <p className="hr-lab-name">{lab.name}</p>
                <p className="hr-lab-result">{lab.result}</p>
                <p className="hr-lab-date">{lab.date}</p>
              </div>
            </div>
            <div className="hr-lab-right">
              <span
                className={`hr-lab-status hr-lab-status--${lab.status.toLowerCase()}`}
              >
                {lab.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const NotesTab: React.FC<{ patient: Patient }> = ({ patient }) => (
  <div className="hr-tab-content">
    {patient.notes.length === 0 ? (
      <p className="hr-no-data">No clinical notes</p>
    ) : (
      <div className="hr-notes-list">
        {patient.notes.map((note) => (
          <div key={note.id} className="hr-note-item">
            <div className="hr-note-header">
              <span className="hr-note-doctor">{note.doctor}</span>
              <span className="hr-note-date">{note.date}</span>
            </div>
            <p className="hr-note-text">{note.note}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

const RxTab: React.FC<{ patient: Patient }> = ({ patient }) => (
  <div className="hr-tab-content">
    {patient.medications.length === 0 ? (
      <p className="hr-no-data">No medications recorded</p>
    ) : (
      <div className="hr-rx-list">
        {patient.medications.map((med) => (
          <div key={med.id} className="hr-rx-item">
            <div className="hr-rx-left">
              <Pill size={15} className="hr-rx-icon" />
              <div>
                <p className="hr-rx-name">
                  {med.name} <span className="hr-rx-dosage">{med.dosage}</span>
                </p>
                <p className="hr-rx-freq">{med.frequency}</p>
                <p className="hr-rx-meta">
                  By {med.prescribedBy} · Since {med.startDate}
                </p>
              </div>
            </div>
            <span
              className={`hr-rx-status ${med.status === "Active" ? "active" : "discontinued"}`}
            >
              {med.status}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ── Main ───────────────────────────────────────────────────
const HealthRecords: React.FC = () => {
  const [patients, setPatients] = React.useState<Patient[]>(initialPatients);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [expandedId, setExpandedId] = React.useState<string | null>("P-001");
  const [activeTab, setActiveTab] = React.useState<Record<string, TabKey>>({
    "P-001": "info",
  });
  const [showPatientModal, setShowPatientModal] = React.useState(false);
  const [showRecordModal, setShowRecordModal] = React.useState(false);
  const [editPatient, setEditPatient] = React.useState<Patient | null>(null);
  const [recordPatient, setRecordPatient] = React.useState<Patient | null>(
    null,
  );
  const [toast, setToast] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contact.includes(searchQuery),
  );

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
    setActiveTab((prev) => ({ ...prev, [id]: prev[id] ?? "info" }));
  };

  const getTab = (id: string): TabKey => activeTab[id] ?? "info";
  const setTab = (id: string, tab: TabKey) =>
    setActiveTab((prev) => ({ ...prev, [id]: tab }));

  const handleSavePatient = (p: Patient) => {
    if (editPatient) {
      setPatients((prev) => prev.map((x) => (x.id === p.id ? p : x)));
      showToast("Patient record updated");
    } else {
      setPatients((prev) => [...prev, p]);
      showToast("Patient added successfully");
    }
    setShowPatientModal(false);
    setEditPatient(null);
  };

  const handleSaveRecord = (note: ClinicalNote) => {
    if (!recordPatient) return;
    setPatients((prev) =>
      prev.map((p) =>
        p.id === recordPatient.id ? { ...p, notes: [note, ...p.notes] } : p,
      ),
    );
    setShowRecordModal(false);
    setRecordPatient(null);
    showToast("Clinical record added");
  };

  const handleNewRecord = (patient: Patient) => {
    setRecordPatient(patient);
    setShowRecordModal(true);
    if (expandedId !== patient.id) {
      setExpandedId(patient.id);
      setActiveTab((prev) => ({ ...prev, [patient.id]: "notes" }));
    } else setTab(patient.id, "notes");
  };

  // 📥 FULL EXPORT CSV
  const handleExportCSV = (patient: Patient) => {
    const rows: string[][] = [];

    // 🧍 BASIC INFO
    rows.push(["--- PATIENT INFO ---"]);
    rows.push(["Name", patient.name]);
    rows.push(["ID", patient.id]);
    rows.push(["Age", patient.age.toString()]);
    rows.push(["Gender", patient.gender]);
    rows.push(["Contact", patient.contact]);
    rows.push(["Email", patient.email]);
    rows.push(["Address", patient.address]);
    rows.push(["Blood Type", patient.bloodType]);
    rows.push([]);

    // ⚠️ CONDITIONS & ALLERGIES
    rows.push(["--- MEDICAL INFO ---"]);
    rows.push(["Conditions", patient.conditions.join("; ")]);
    rows.push(["Allergies", patient.allergies.join("; ")]);
    rows.push(["Diagnoses", patient.diagnoses.join("; ")]);
    rows.push([]);

    // 🧪 LABS
    rows.push(["--- LAB RESULTS ---"]);
    rows.push(["Name", "Date", "Result", "Status"]);
    patient.labs.forEach((lab) => {
      rows.push([lab.name, lab.date, lab.result, lab.status]);
    });
    rows.push([]);

    // 📝 NOTES
    rows.push(["--- CLINICAL NOTES ---"]);
    rows.push(["Date", "Doctor", "Note"]);
    patient.notes.forEach((note) => {
      rows.push([note.date, note.doctor, note.note]);
    });
    rows.push([]);

    // 💊 MEDICATIONS
    rows.push(["--- MEDICATIONS ---"]);
    rows.push([
      "Name",
      "Dosage",
      "Frequency",
      "Doctor",
      "Start Date",
      "Status",
    ]);
    patient.medications.forEach((med) => {
      rows.push([
        med.name,
        med.dosage,
        med.frequency,
        med.prescribedBy,
        med.startDate,
        med.status,
      ]);
    });

    // convert to CSV
    const csvContent = rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${patient.name.replace(/\s+/g, "_")}_FULL_RECORD.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  // 🖨️ FULL PRINT
  const handlePrint = (patient: Patient) => {
    const content = `
  <html>
    <head>
      <title>${patient.name} - Medical Record</title>
      <style>
        body { font-family: Arial; padding: 24px; }
        h1, h2 { margin-bottom: 5px; }
        h2 { margin-top: 20px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
        p { margin: 4px 0; }
        ul { margin: 5px 0 10px 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 6px; font-size: 13px; }
        th { background: #f5f5f5; text-align: left; }
      </style>
    </head>
    <body>

      <h1>${patient.name}</h1>
      <p><strong>ID:</strong> ${patient.id}</p>
      <p><strong>Age:</strong> ${patient.age} | <strong>Gender:</strong> ${patient.gender}</p>
      <p><strong>Contact:</strong> ${patient.contact}</p>
      <p><strong>Email:</strong> ${patient.email}</p>
      <p><strong>Address:</strong> ${patient.address}</p>
      <p><strong>Blood Type:</strong> ${patient.bloodType}</p>

      <h2>Conditions</h2>
      <ul>${patient.conditions.map((c) => `<li>${c}</li>`).join("")}</ul>

      <h2>Allergies</h2>
      <ul>${patient.allergies.map((a) => `<li>${a}</li>`).join("")}</ul>

      <h2>Diagnoses</h2>
      <ul>${patient.diagnoses.map((d) => `<li>${d}</li>`).join("")}</ul>

      <h2>Lab Results</h2>
      <table>
        <tr><th>Name</th><th>Date</th><th>Result</th><th>Status</th></tr>
        ${patient.labs
          .map(
            (l) => `
          <tr>
            <td>${l.name}</td>
            <td>${l.date}</td>
            <td>${l.result}</td>
            <td>${l.status}</td>
          </tr>
        `,
          )
          .join("")}
      </table>

      <h2>Clinical Notes</h2>
      ${patient.notes
        .map(
          (n) => `
        <p><strong>${n.date}</strong> - ${n.doctor}</p>
        <p>${n.note}</p>
      `,
        )
        .join("")}

      <h2>Medications</h2>
      <table>
        <tr><th>Name</th><th>Dosage</th><th>Frequency</th><th>Doctor</th><th>Start</th><th>Status</th></tr>
        ${patient.medications
          .map(
            (m) => `
          <tr>
            <td>${m.name}</td>
            <td>${m.dosage}</td>
            <td>${m.frequency}</td>
            <td>${m.prescribedBy}</td>
            <td>${m.startDate}</td>
            <td>${m.status}</td>
          </tr>
        `,
          )
          .join("")}
      </table>

    </body>
  </html>
  `;

    const printWindow = window.open("", "", "width=900,height=700");
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "info", label: "Info", icon: <User size={13} /> },
    { key: "history", label: "History", icon: <ClipboardList size={13} /> },
    { key: "labs", label: "Labs", icon: <FlaskConical size={13} /> },
    { key: "notes", label: "Notes", icon: <FileText size={13} /> },
    { key: "rx", label: "Rx", icon: <Pill size={13} /> },
  ];

  return (
    <div className="hr-container">
      {toast && (
        <div className="hr-toast">
          <Check size={15} /> {toast}
        </div>
      )}

      <div className="hr-header">
        <h1 className="hr-title">Health Records</h1>
        <p className="hr-subtitle">Centralized patient medical history</p>
      </div>

      <div className="hr-card">
        {/* Toolbar */}
        <div className="hr-toolbar">
          <div className="hr-search">
            <Search size={16} className="hr-search-icon" />
            <input
              className="hr-search-input"
              placeholder="Search by name, ID, or contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="hr-toolbar-actions">
            <button
              className="hr-btn-secondary"
              onClick={() => {
                setEditPatient(null);
                setShowPatientModal(true);
              }}
            >
              <Plus size={15} /> Add Patient
            </button>
          </div>
        </div>

        {/* Table Head */}
        <div className="hr-table-head">
          <div className="hr-col hr-col--name">Name</div>
          <div className="hr-col hr-col--age">Age</div>
          <div className="hr-col hr-col--id">ID</div>
          <div className="hr-col hr-col--contact">Contact</div>
          <div className="hr-col hr-col--visit">Last Visit</div>
          <div className="hr-col hr-col--actions">Actions</div>
        </div>

        {/* Rows */}
        <div className="hr-table-body">
          {filtered.length === 0 ? (
            <div className="hr-empty">No patients found</div>
          ) : (
            filtered.map((patient) => (
              <div key={patient.id} className="hr-row-wrap">
                <div
                  className={`hr-row ${expandedId === patient.id ? "expanded" : ""}`}
                  onClick={() => toggleExpand(patient.id)}
                >
                  <div className="hr-col hr-col--name">
                    <div className="hr-patient-cell">
                      <span className="hr-chevron">
                        {expandedId === patient.id ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </span>
                      <span className="hr-avatar">{patient.avatar}</span>
                      <div>
                        <span className="hr-patient-name">{patient.name}</span>
                        <span className="hr-patient-gender">
                          {patient.gender}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="hr-col hr-col--age">{patient.age}</div>
                  <div className="hr-col hr-col--id">
                    <span className="hr-id-badge">{patient.id}</span>
                  </div>
                  <div className="hr-col hr-col--contact">
                    {patient.contact}
                  </div>
                  <div className="hr-col hr-col--visit">
                    <div className="hr-visit-cell">
                      <Calendar size={13} /> {patient.lastVisit}
                    </div>
                  </div>
                  <div
                    className="hr-col hr-col--actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="hr-actions-cell">
                      <button
                        className="hr-icon-btn"
                        title="Edit"
                        onClick={() => {
                          setEditPatient(patient);
                          setShowPatientModal(true);
                        }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="hr-icon-btn"
                        title="New Record"
                        onClick={() => handleNewRecord(patient)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {expandedId === patient.id && (
                  <div className="hr-detail">
                    <div className="hr-tabs-bar">
                      <div className="hr-tabs">
                        {TABS.map((t) => (
                          <button
                            key={t.key}
                            className={`hr-tab ${getTab(patient.id) === t.key ? "active" : ""}`}
                            onClick={() => setTab(patient.id, t.key)}
                          >
                            {t.icon} {t.label}
                          </button>
                        ))}
                      </div>
                      <div className="hr-detail-actions">
                        <button
                          className="hr-btn-sm"
                          onClick={() => handleNewRecord(patient)}
                        >
                          <Plus size={13} /> New Record
                        </button>
                        <button
                          className="hr-btn-sm"
                          onClick={() => handleExportCSV(patient)}
                        >
                          <Download size={13} /> Export
                        </button>

                        <button
                          className="hr-btn-sm"
                          onClick={() => handlePrint(patient)}
                        >
                          <Printer size={13} /> Print
                        </button>
                      </div>
                    </div>
                    {getTab(patient.id) === "info" && (
                      <InfoTab patient={patient} />
                    )}
                    {getTab(patient.id) === "history" && (
                      <HistoryTab patient={patient} />
                    )}
                    {getTab(patient.id) === "labs" && (
                      <LabsTab patient={patient} />
                    )}
                    {getTab(patient.id) === "notes" && (
                      <NotesTab patient={patient} />
                    )}
                    {getTab(patient.id) === "rx" && <RxTab patient={patient} />}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {showPatientModal && (
        <PatientModal
          onClose={() => {
            setShowPatientModal(false);
            setEditPatient(null);
          }}
          onSave={handleSavePatient}
          editData={editPatient}
        />
      )}
      {showRecordModal && recordPatient && (
        <NewRecordModal
          patient={recordPatient}
          onClose={() => {
            setShowRecordModal(false);
            setRecordPatient(null);
          }}
          onSave={handleSaveRecord}
        />
      )}
    </div>
  );
};

export default HealthRecords;
