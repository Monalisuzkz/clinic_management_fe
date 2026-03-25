import * as React from 'react';
import {
  Search, Plus, X, Check, ChevronDown, Send,
  Eye, Printer, Download, Pill, User, Calendar,
  Clock, AlertCircle, Filter
} from 'lucide-react';
import './EPrescribing.css';

// ── Types ──────────────────────────────────────────────────
type RxStatus = 'Pending' | 'Sent' | 'Fulfilled';

interface Prescription {
  id: string;
  patient: string;
  patientId: string;
  doctor: string;
  medications: { drug: string; dosage: string; frequency: string }[];
  instructions: string;
  dateIssued: string;
  status: RxStatus;
  pharmacy?: string;
}

// ── Mock Data ──────────────────────────────────────────────
const PATIENTS = [
  { name: 'John Doe', id: 'P-001' },
  { name: 'Jane Smith', id: 'P-002' },
  { name: 'Mike Johnson', id: 'P-003' },
  { name: 'Sarah Williams', id: 'P-004' },
  { name: 'Robert Chen', id: 'P-005' },
];

const DRUGS = [
  'Amoxicillin 500mg', 'Metformin 500mg', 'Lisinopril 10mg',
  'Atorvastatin 20mg', 'Omeprazole 20mg', 'Albuterol Inhaler 90mcg',
  'Sertraline 50mg', 'Ibuprofen 400mg', 'Paracetamol 500mg',
  'Cetirizine 10mg', 'Azithromycin 500mg', 'Prednisone 10mg',
  'Losartan 50mg', 'Amlodipine 5mg', 'Pantoprazole 40mg',
];

const FREQUENCIES = [
  'Once daily', 'Twice daily', 'Three times daily',
  'Four times daily', 'Every 8 hours', 'Every 12 hours',
  'As needed', 'Once weekly', 'At bedtime',
];

const PHARMACIES = [
  'MedPlus Pharmacy', 'City Care Drugstore', 'HealthFirst Pharmacy',
  'QuickMeds', 'Central Pharmacy',
];

// Limit initial prescriptions to 5
const initialPrescriptions: Prescription[] = [
  {
    id: 'RX-001', patient: 'John Doe', patientId: 'P-001', doctor: 'Dr. Smith',
    medications: [
      { drug: 'Metformin 500mg', dosage: '500mg', frequency: 'Twice daily' },
      { drug: 'Lisinopril 10mg', dosage: '10mg', frequency: 'Once daily' },
    ],
    instructions: 'Take with food. Monitor blood pressure weekly.',
    dateIssued: 'Mar 20, 2026', status: 'Fulfilled', pharmacy: 'MedPlus Pharmacy',
  },
  {
    id: 'RX-002', patient: 'Jane Smith', patientId: 'P-002', doctor: 'Dr. Lee',
    medications: [{ drug: 'Albuterol Inhaler 90mcg', dosage: '90mcg', frequency: 'As needed' }],
    instructions: 'Use inhaler during asthma attacks. Max 4 puffs/day.',
    dateIssued: 'Mar 22, 2026', status: 'Sent', pharmacy: 'City Care Drugstore',
  },
    {
    id: 'RX-002', patient: 'Jane Smith', patientId: 'P-002', doctor: 'Dr. Lee',
    medications: [{ drug: 'Albuterol Inhaler 90mcg', dosage: '90mcg', frequency: 'As needed' }],
    instructions: 'Use inhaler during asthma attacks. Max 4 puffs/day.',
    dateIssued: 'Mar 22, 2026', status: 'Sent', pharmacy: 'City Care Drugstore',
  },
    {
    id: 'RX-002', patient: 'Jane Smith', patientId: 'P-002', doctor: 'Dr. Lee',
    medications: [{ drug: 'Albuterol Inhaler 90mcg', dosage: '90mcg', frequency: 'As needed' }],
    instructions: 'Use inhaler during asthma attacks. Max 4 puffs/day.',
    dateIssued: 'Mar 22, 2026', status: 'Sent', pharmacy: 'City Care Drugstore',
  },
    {
    id: 'RX-002', patient: 'Jane Smith', patientId: 'P-002', doctor: 'Dr. Lee',
    medications: [{ drug: 'Albuterol Inhaler 90mcg', dosage: '90mcg', frequency: 'As needed' }],
    instructions: 'Use inhaler during asthma attacks. Max 4 puffs/day.',
    dateIssued: 'Mar 22, 2026', status: 'Sent', pharmacy: 'City Care Drugstore',
  },
    {
    id: 'RX-002', patient: 'Jane Smith', patientId: 'P-002', doctor: 'Dr. Lee',
    medications: [{ drug: 'Albuterol Inhaler 90mcg', dosage: '90mcg', frequency: 'As needed' }],
    instructions: 'Use inhaler during asthma attacks. Max 4 puffs/day.',
    dateIssued: 'Mar 22, 2026', status: 'Sent', pharmacy: 'City Care Drugstore',
  },
    {
    id: 'RX-002', patient: 'Jane Smith', patientId: 'P-002', doctor: 'Dr. Lee',
    medications: [{ drug: 'Albuterol Inhaler 90mcg', dosage: '90mcg', frequency: 'As needed' }],
    instructions: 'Use inhaler during asthma attacks. Max 4 puffs/day.',
    dateIssued: 'Mar 22, 2026', status: 'Sent', pharmacy: 'City Care Drugstore',
  },
    {
    id: 'RX-002', patient: 'Jane Smith', patientId: 'P-002', doctor: 'Dr. Lee',
    medications: [{ drug: 'Albuterol Inhaler 90mcg', dosage: '90mcg', frequency: 'As needed' }],
    instructions: 'Use inhaler during asthma attacks. Max 4 puffs/day.',
    dateIssued: 'Mar 22, 2026', status: 'Sent', pharmacy: 'City Care Drugstore',
  },
  {
    id: 'RX-003', patient: 'Mike Johnson', patientId: 'P-003', doctor: 'Dr. Williams',
    medications: [
      { drug: 'Atorvastatin 20mg', dosage: '20mg', frequency: 'Once daily at bedtime' },
      { drug: 'Ibuprofen 400mg', dosage: '400mg', frequency: 'As needed for pain' },
    ],
    instructions: 'Take Atorvastatin at bedtime. Ibuprofen with meals.',
    dateIssued: 'Mar 18, 2026', status: 'Pending',
  },
  {
    id: 'RX-004', patient: 'Sarah Williams', patientId: 'P-004', doctor: 'Dr. Brown',
    medications: [
      { drug: 'Sertraline 50mg', dosage: '50mg', frequency: 'Once daily' },
      { drug: 'Prednisone 10mg', dosage: '10mg', frequency: 'Once daily' },
    ],
    instructions: 'Take in the morning with water. Do not stop abruptly.',
    dateIssued: 'Mar 10, 2026', status: 'Fulfilled', pharmacy: 'HealthFirst Pharmacy',
  },
  {
    id: 'RX-005', patient: 'Robert Chen', patientId: 'P-005', doctor: 'Dr. Smith',
    medications: [{ drug: 'Amoxicillin 500mg', dosage: '500mg', frequency: 'Three times daily' }],
    instructions: 'Complete full 7-day course. Take with or without food.',
    dateIssued: 'Mar 24, 2026', status: 'Pending',
  },
];

// ── Drug Search Dropdown ───────────────────────────────────
interface DrugSearchProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const DrugSearch: React.FC<DrugSearchProps> = ({ value, onChange, placeholder }) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState(value);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => { setQuery(value); }, [value]);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = DRUGS.filter(d => d.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="rx-drug-search" ref={ref}>
      <div className="rx-drug-input-wrap">
        <Search size={14} className="rx-drug-search-icon" />
        <input
          className="rx-drug-input"
          placeholder={placeholder ?? 'Search drug...'}
          value={query}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="rx-drug-dropdown">
          {filtered.map(d => (
            <div key={d} className={`rx-drug-option ${value === d ? 'selected' : ''}`}
              onClick={() => { onChange(d); setQuery(d); setOpen(false); }}>
              {value === d && <Check size={12} />} <Pill size={12} /> {d}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── View Detail Modal ──────────────────────────────────────
interface ViewModalProps {
  rx: Prescription;
  onClose: () => void;
  onUpdateStatus: (id: string, status: RxStatus) => void;
}

const ViewModal: React.FC<ViewModalProps> = ({ rx, onClose, onUpdateStatus }) => {
  const [pharmacy, setPharmacy] = React.useState(rx.pharmacy ?? PHARMACIES[0]);

  return (
    <div className="rx-modal-overlay" onClick={onClose}>
      <div className="rx-modal-box" onClick={e => e.stopPropagation()}>
        <div className="rx-modal-header">
          <div>
            <div className="rx-modal-id">{rx.id}</div>
            <h2 className="rx-modal-title">Prescription Details</h2>
          </div>
          <div className="rx-modal-header-right">
            <span className={`rx-badge rx-badge--${rx.status.toLowerCase()}`}>{rx.status}</span>
            <button className="rx-modal-close" onClick={onClose}><X size={18} /></button>
          </div>
        </div>
        <div className="rx-modal-body">
          {/* Patient & Doctor */}
          <div className="rx-detail-grid">
            <div className="rx-detail-item">
              <span className="rx-detail-label"><User size={12} /> Patient</span>
              <span className="rx-detail-value">{rx.patient}</span>
              <span className="rx-detail-sub">{rx.patientId}</span>
            </div>
            <div className="rx-detail-item">
              <span className="rx-detail-label"><User size={12} /> Prescribing Doctor</span>
              <span className="rx-detail-value">{rx.doctor}</span>
            </div>
            <div className="rx-detail-item">
              <span className="rx-detail-label"><Calendar size={12} /> Date Issued</span>
              <span className="rx-detail-value">{rx.dateIssued}</span>
            </div>
            <div className="rx-detail-item">
              <span className="rx-detail-label"><AlertCircle size={12} /> Pharmacy</span>
              <span className="rx-detail-value">{rx.pharmacy ?? 'Not assigned'}</span>
            </div>
          </div>

          {/* Medications */}
          <div className="rx-detail-section">
            <p className="rx-section-label">Medications</p>
            <div className="rx-med-list">
              {rx.medications.map((med, i) => (
                <div key={i} className="rx-med-item">
                  <Pill size={14} className="rx-med-icon" />
                  <div>
                    <p className="rx-med-name">{med.drug}</p>
                    <p className="rx-med-sub">{med.dosage} · {med.frequency}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="rx-detail-section">
            <p className="rx-section-label">Instructions</p>
            <div className="rx-instructions-box">{rx.instructions}</div>
          </div>

          {/* Send to Pharmacy */}
          {rx.status === 'Pending' && (
            <div className="rx-detail-section">
              <p className="rx-section-label">Send to Pharmacy</p>
              <div className="rx-pharmacy-row">
                <div className="rx-select-wrap">
                  <select className="rx-select" value={pharmacy} onChange={e => setPharmacy(e.target.value)}>
                    {PHARMACIES.map(p => <option key={p}>{p}</option>)}
                  </select>
                  <ChevronDown size={14} className="rx-select-icon" />
                </div>
                <button className="rx-send-btn" onClick={() => { onUpdateStatus(rx.id, 'Sent'); onClose(); }}>
                  <Send size={14} /> Send to Pharmacy
                </button>
              </div>
            </div>
          )}
          {rx.status === 'Sent' && (
            <div className="rx-detail-section">
              <button className="rx-fulfill-btn" onClick={() => { onUpdateStatus(rx.id, 'Fulfilled'); onClose(); }}>
                <Check size={14} /> Mark as Fulfilled
              </button>
            </div>
          )}
        </div>
        <div className="rx-modal-footer">
          <button className="rx-modal-btn-sm"><Printer size={14} /> Print</button>
          <button className="rx-modal-btn-sm"><Download size={14} /> Download PDF</button>
          <button className="rx-modal-btn-cancel" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────
const EPrescribing: React.FC = () => {
  const [prescriptions, setPrescriptions] = React.useState<Prescription[]>(initialPrescriptions);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'All' | RxStatus>('All');
  const [viewRx, setViewRx] = React.useState<Prescription | null>(null);
  const [toast, setToast] = React.useState<string | null>(null);

  // Form state
  const [form, setForm] = React.useState({
    patient: '',
    doctor: 'Dr. Smith',
    drug: '',
    dosage: '',
    frequency: FREQUENCIES[0],
    instructions: '',
    pharmacy: PHARMACIES[0],
  });
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [extraMeds, setExtraMeds] = React.useState<{ drug: string; dosage: string; frequency: string }[]>([]);

  const DOCTORS = ['Dr. Smith', 'Dr. Lee', 'Dr. Williams', 'Dr. Brown', 'Dr. Garcia'];

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const setField = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    setFormErrors(e => { const n = { ...e }; delete n[field]; return n; });
  };

  const filtered = prescriptions.filter(rx => {
    const matchSearch =
      rx.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.medications.some(m => m.drug.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = statusFilter === 'All' || rx.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.patient) e.patient = 'Select a patient';
    if (!form.drug) e.drug = 'Select a drug';
    if (!form.dosage.trim()) e.dosage = 'Enter dosage';
    return e;
  };

  const handleSubmit = () => {
    const e = validateForm();
    if (Object.keys(e).length) { setFormErrors(e); return; }

    const allMeds = [
      { drug: form.drug, dosage: form.dosage, frequency: form.frequency },
      ...extraMeds.filter(m => m.drug && m.dosage),
    ];

    const newRx: Prescription = {
      id: `RX-${String(prescriptions.length + 1).padStart(3, '0')}`,
      patient: form.patient,
      patientId: PATIENTS.find(p => p.name === form.patient)?.id ?? 'P-???',
      doctor: form.doctor,
      medications: allMeds,
      instructions: form.instructions,
      dateIssued: 'Mar 25, 2026',
      status: 'Pending',
    };

    setPrescriptions(prev => [newRx, ...prev]);
    setForm({ patient: '', doctor: 'Dr. Smith', drug: '', dosage: '', frequency: FREQUENCIES[0], instructions: '', pharmacy: PHARMACIES[0] });
    setExtraMeds([]);
    setFormErrors({});
    showToast(`Prescription ${newRx.id} created successfully`);
  };


  const handleUpdateStatus = (id: string, status: RxStatus) => {
    setPrescriptions(prev => prev.map(rx => rx.id === id ? { ...rx, status } : rx));
    showToast(status === 'Sent' ? 'Sent to pharmacy' : 'Marked as fulfilled');
  };

  const addExtraMed = () => setExtraMeds(prev => [...prev, { drug: '', dosage: '', frequency: FREQUENCIES[0] }]);
  const removeExtraMed = (i: number) => setExtraMeds(prev => prev.filter((_, idx) => idx !== i));
  const updateExtraMed = (i: number, field: string, value: string) => {
    setExtraMeds(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: value } : m));
  };

  return (
    <div className="rx-container">
      {toast && <div className="rx-toast"><Check size={15} /> {toast}</div>}

      {/* Header */}
      <div className="rx-header">
        <h1 className="rx-title">E-Prescribing</h1>
        <p className="rx-subtitle">Create and track electronic prescriptions</p>
      </div>

      {/* Main Split Layout */}
      <div className="rx-split">

        {/* LEFT — Prescriptions List */}
        <div className="rx-list-panel">
          {/* List Toolbar */}
          <div className="rx-list-toolbar">
            <div className="rx-search">
              <Search size={15} className="rx-search-icon" />
              <input
                className="rx-search-input"
                placeholder="Search prescriptions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="rx-filter-tabs">
              {(['All', 'Pending', 'Sent', 'Fulfilled'] as const).map(s => (
                <button
                  key={s}
                  className={`rx-filter-tab ${statusFilter === s ? 'active' : ''}`}
                  onClick={() => setStatusFilter(s)}
                >{s}</button>
              ))}
            </div>
          </div>

          {/* List Count */}
          <div className="rx-list-meta">
            <Filter size={13} /> {filtered.length} prescription{filtered.length !== 1 ? 's' : ''}
          </div>

          {/* Table Head - Sticky */}
          <div className="rx-list-head">
            <div className="rx-lcol rx-lcol--patient">Patient</div>
            <div className="rx-lcol rx-lcol--med">Medication(s)</div>
            <div className="rx-lcol rx-lcol--status">Status</div>
            <div className="rx-lcol rx-lcol--date">Date</div>
            <div className="rx-lcol rx-lcol--action">Action</div>
          </div>

          {/* Table Rows - Scrollable */}
          <div className="rx-list-body">
            {filtered.length === 0 ? (
              <div className="rx-list-empty">No prescriptions found</div>
            ) : (
              filtered.map(rx => (
                <div key={rx.id} className="rx-list-row" onClick={() => setViewRx(rx)}>
                  <div className="rx-lcol rx-lcol--patient">
                    <div className="rx-patient-cell">
                      <span className="rx-patient-name">{rx.patient}</span>
                      <span className="rx-patient-doctor">{rx.doctor}</span>
                    </div>
                  </div>
                  <div className="rx-lcol rx-lcol--med">
                    <div className="rx-med-cell">
                      <span className="rx-med-primary">{rx.medications[0].drug}</span>
                      {rx.medications.length > 1 && (
                        <span className="rx-med-more">+{rx.medications.length - 1} more</span>
                      )}
                    </div>
                  </div>
                  <div className="rx-lcol rx-lcol--status">
                    <span className={`rx-badge rx-badge--${rx.status.toLowerCase()}`}>{rx.status}</span>
                  </div>
                  <div className="rx-lcol rx-lcol--date">
                    <div className="rx-date-cell"><Clock size={12} /> {rx.dateIssued}</div>
                  </div>
                  <div className="rx-lcol rx-lcol--action" onClick={e => e.stopPropagation()}>
                    <button className="rx-view-btn" onClick={() => setViewRx(rx)} title="View"><Eye size={14} /></button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="rx-list-footer">Click a row to view prescription details</div>
        </div>

        {/* RIGHT — Create Prescription */}
        <div className="rx-form-panel">
          <div className="rx-form-header">
            <h2 className="rx-form-title"><Plus size={16} /> Create Prescription</h2>
            <p className="rx-form-subtitle">Fill in details to issue a new prescription</p>
          </div>

          <div className="rx-form-body">
            {/* Patient */}
            <div className="rx-field">
              <label className="rx-label">Patient <span className="rx-required">*</span></label>
              <div className="rx-select-wrap">
                <select
                  className={`rx-select ${formErrors.patient ? 'error' : ''}`}
                  value={form.patient}
                  onChange={e => setField('patient', e.target.value)}
                >
                  <option value="">Select patient...</option>
                  {PATIENTS.map(p => <option key={p.id} value={p.name}>{p.name} ({p.id})</option>)}
                </select>
                <ChevronDown size={14} className="rx-select-icon" />
              </div>
              {formErrors.patient && <span className="rx-field-error">{formErrors.patient}</span>}
            </div>

            {/* Doctor */}
            <div className="rx-field">
              <label className="rx-label">Doctor</label>
              <div className="rx-select-wrap">
                <select className="rx-select" value={form.doctor} onChange={e => setField('doctor', e.target.value)}>
                  {DOCTORS.map(d => <option key={d}>{d}</option>)}
                </select>
                <ChevronDown size={14} className="rx-select-icon" />
              </div>
            </div>

            <div className="rx-divider"><span>Medications</span></div>

            {/* Primary Medication */}
            <div className="rx-med-block">
              <div className="rx-med-block-label">Drug #1</div>
              <div className="rx-field">
                <label className="rx-label">Drug <span className="rx-required">*</span></label>
                <DrugSearch
                  value={form.drug}
                  onChange={val => setField('drug', val)}
                  placeholder="Search drug name..."
                />
                {formErrors.drug && <span className="rx-field-error">{formErrors.drug}</span>}
              </div>
              <div className="rx-field-row">
                <div className="rx-field">
                  <label className="rx-label">Dosage <span className="rx-required">*</span></label>
                  <input
                    className={`rx-input ${formErrors.dosage ? 'error' : ''}`}
                    placeholder="e.g. 500mg"
                    value={form.dosage}
                    onChange={e => setField('dosage', e.target.value)}
                  />
                  {formErrors.dosage && <span className="rx-field-error">{formErrors.dosage}</span>}
                </div>
                <div className="rx-field">
                  <label className="rx-label">Frequency</label>
                  <div className="rx-select-wrap">
                    <select className="rx-select" value={form.frequency} onChange={e => setField('frequency', e.target.value)}>
                      {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
                    </select>
                    <ChevronDown size={14} className="rx-select-icon" />
                  </div>
                </div>
              </div>
            </div>

            {/* Extra Medications */}
            {extraMeds.map((med, i) => (
              <div key={i} className="rx-med-block rx-med-block--extra">
                <div className="rx-med-block-label">
                  Drug #{i + 2}
                  <button className="rx-remove-med" onClick={() => removeExtraMed(i)}><X size={12} /></button>
                </div>
                <div className="rx-field">
                  <label className="rx-label">Drug</label>
                  <DrugSearch value={med.drug} onChange={val => updateExtraMed(i, 'drug', val)} />
                </div>
                <div className="rx-field-row">
                  <div className="rx-field">
                    <label className="rx-label">Dosage</label>
                    <input className="rx-input" placeholder="e.g. 10mg" value={med.dosage} onChange={e => updateExtraMed(i, 'dosage', e.target.value)} />
                  </div>
                  <div className="rx-field">
                    <label className="rx-label">Frequency</label>
                    <div className="rx-select-wrap">
                      <select className="rx-select" value={med.frequency} onChange={e => updateExtraMed(i, 'frequency', e.target.value)}>
                        {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
                      </select>
                      <ChevronDown size={14} className="rx-select-icon" />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button className="rx-add-med-btn" onClick={addExtraMed}>
              <Plus size={13} /> Add Another Drug
            </button>

            <div className="rx-divider"><span>Instructions & Pharmacy</span></div>

            {/* Instructions */}
            <div className="rx-field">
              <label className="rx-label">Instructions <span className="rx-optional">(optional)</span></label>
              <textarea
                className="rx-textarea"
                rows={3}
                placeholder="Dosage instructions, warnings, special notes..."
                value={form.instructions}
                onChange={e => setField('instructions', e.target.value)}
              />
            </div>

            {/* Pharmacy */}
            <div className="rx-field">
              <label className="rx-label">Send to Pharmacy</label>
              <div className="rx-select-wrap">
                <select className="rx-select" value={form.pharmacy} onChange={e => setField('pharmacy', e.target.value)}>
                  {PHARMACIES.map(p => <option key={p}>{p}</option>)}
                </select>
                <ChevronDown size={14} className="rx-select-icon" />
              </div>
            </div>
          </div>

          {/* Form Footer */}
          <div className="rx-form-footer">
            <button className="rx-save-draft-btn" onClick={() => {
              const e = validateForm();
              if (Object.keys(e).length) { setFormErrors(e); return; }
              showToast('Draft saved');
            }}>
              Save Draft
            </button>
            <button className="rx-send-pharmacy-btn" onClick={handleSubmit}>
              <Send size={15} /> Create & Send to Pharmacy
            </button>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewRx && (
        <ViewModal
          rx={prescriptions.find(r => r.id === viewRx.id) ?? viewRx}
          onClose={() => setViewRx(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default EPrescribing;