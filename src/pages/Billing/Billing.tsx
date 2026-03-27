import * as React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  Search,
  Plus,
  X,
  Check,
  ChevronDown,
  Eye,
  Printer,
  Download,
  Send,
  FileText,
  CreditCard,
  ShieldCheck,
  BarChart2,
  AlertCircle,
  Calendar,
  User,
  DollarSign,
  Clock,
  MoreVertical,
  TrendingUp,
} from "lucide-react";
import "./Billing.css";

// ── Types ──────────────────────────────────────────────────
type InvoiceStatus = "Paid" | "Pending" | "Overdue";
type ActiveTab = "invoices" | "payments" | "insurance" | "summary";

interface Invoice {
  id: string;
  patient: string;
  patientId: string;
  amount: number;
  dateIssued: string;
  dueDate: string;
  status: InvoiceStatus;
  services: { name: string; cost: number }[];
  insurance?: string;
  notes?: string;
}

interface Payment {
  id: string;
  invoiceId: string;
  patient: string;
  amount: number;
  date: string;
  method: "Cash" | "Card" | "Insurance" | "Online";
  claimId?: string; // Add this to link to specific insurance claim
}

interface InsuranceClaim {
  id: string;
  invoiceId?: string; // Add this to link to invoice
  patient: string;
  patientId?: string; // Add patient ID for better tracking
  provider: string;
  amount: number;
  dateSubmitted: string;
  status: "Submitted" | "Approved" | "Rejected" | "Pending";
}

// ── Mock Data ──────────────────────────────────────────────
const PATIENTS = [
  { name: "John Doe", id: "P-001" },
  { name: "Jane Smith", id: "P-002" },
  { name: "Mike Johnson", id: "P-003" },
  { name: "Sarah Williams", id: "P-004" },
  { name: "Robert Chen", id: "P-005" },
];

const SERVICES = [
  "Consultation",
  "Laboratory Test",
  "X-Ray",
  "MRI Scan",
  "ECG",
  "Blood Test",
  "Urinalysis",
  "Physical Therapy",
  "Vaccination",
  "Dental Checkup",
];

const initialInvoices: Invoice[] = [
  {
    id: "INV-001",
    patient: "John Doe",
    patientId: "P-001",
    amount: 4500,
    dateIssued: "Mar 20, 2026",
    dueDate: "Apr 3, 2026",
    status: "Paid",
    insurance: "PhilHealth",
    services: [
      { name: "Consultation", cost: 1500 },
      { name: "Blood Test", cost: 2000 },
      { name: "ECG", cost: 1000 },
    ],
    notes: "Payment received via cash.",
  },
  {
    id: "INV-002",
    patient: "Jane Smith",
    patientId: "P-002",
    amount: 8200,
    dateIssued: "Mar 22, 2026",
    dueDate: "Apr 5, 2026",
    status: "Pending",
    insurance: "Maxicare",
    services: [
      { name: "MRI Scan", cost: 6500 },
      { name: "Consultation", cost: 1700 },
    ],
  },
  {
    id: "INV-003",
    patient: "Mike Johnson",
    patientId: "P-003",
    amount: 3200,
    dateIssued: "Mar 10, 2026",
    dueDate: "Mar 24, 2026",
    status: "Overdue",
    services: [
      { name: "X-Ray", cost: 1800 },
      { name: "Physical Therapy", cost: 1400 },
    ],
    notes: "Patient notified via SMS.",
  },
  {
    id: "INV-004",
    patient: "Sarah Williams",
    patientId: "P-004",
    amount: 2800,
    dateIssued: "Mar 15, 2026",
    dueDate: "Mar 29, 2026",
    status: "Paid",
    services: [
      { name: "Consultation", cost: 1500 },
      { name: "Urinalysis", cost: 800 },
      { name: "Vaccination", cost: 500 },
    ],
  },
  {
    id: "INV-005",
    patient: "Robert Chen",
    patientId: "P-005",
    amount: 5500,
    dateIssued: "Mar 24, 2026",
    dueDate: "Apr 7, 2026",
    status: "Paid",
    insurance: "HMO Plus",
    services: [
      { name: "Laboratory Test", cost: 3000 },
      { name: "Consultation", cost: 2500 },
    ],
  },
  {
    id: "INV-006",
    patient: "Maria Santos",
    patientId: "P-006",
    amount: 3200,
    dateIssued: "Mar 20, 2026",
    dueDate: "Apr 3, 2026",
    status: "Pending",
    insurance: "PhilHealth",
    services: [
      { name: "Consultation", cost: 1200 },
      { name: "Blood Test", cost: 2000 },
    ],
    notes: "Insurance claim submitted.",
  },
  {
    id: "INV-007",
    patient: "Carlos Dela Cruz",
    patientId: "P-007",
    amount: 5800,
    dateIssued: "Mar 22, 2026",
    dueDate: "Apr 5, 2026",
    status: "Overdue",
    insurance: "Maxicare",
    services: [
      { name: "CT Scan", cost: 4500 },
      { name: "Consultation", cost: 1300 },
    ],
    notes: "Second reminder sent.",
  },
];

const initialPayments: Payment[] = [
  {
    id: "PAY-001",
    invoiceId: "INV-001",
    patient: "John Doe",
    amount: 4500,
    date: "Mar 21, 2026",
    method: "Cash",
  },
  {
    id: "PAY-002",
    invoiceId: "INV-004",
    patient: "Sarah Williams",
    amount: 2800,
    date: "Mar 16, 2026",
    method: "Card",
  },
  {
    id: "PAY-003",
    invoiceId: "INV-002",
    patient: "Jane Smith",
    amount: 4000,
    date: "Mar 23, 2026",
    method: "Insurance",
  },
  {
    id: "PAY-004",
    invoiceId: "INV-003",
    patient: "Mike Johnson",
    amount: 1500,
    date: "Mar 18, 2026",
    method: "Cash",
  },
  {
    id: "PAY-005",
    invoiceId: "INV-005",
    patient: "Robert Chen",
    amount: 5500,
    date: "Mar 25, 2026",
    method: "Online",
  },
  {
    id: "PAY-006",
    invoiceId: "INV-006",
    patient: "Maria Santos",
    amount: 1500,
    date: "Mar 26, 2026",
    method: "Card",
  },
  {
    id: "PAY-007",
    invoiceId: "INV-007",
    patient: "Carlos Dela Cruz",
    amount: 2000,
    date: "Mar 27, 2026",
    method: "Cash",
  },
];

const initialClaims: InsuranceClaim[] = [
  {
    id: "CLM-001",
    patient: "John Doe",
    provider: "PhilHealth",
    amount: 2000,
    dateSubmitted: "Mar 20, 2026",
    status: "Approved",
  },
  {
    id: "CLM-002",
    patient: "Jane Smith",
    provider: "Maxicare",
    amount: 5000,
    dateSubmitted: "Mar 22, 2026",
    status: "Submitted",
  },
  {
    id: "CLM-003",
    patient: "Robert Chen",
    provider: "HMO Plus",
    amount: 3000,
    dateSubmitted: "Mar 24, 2026",
    status: "Pending",
  },
  {
    id: "CLM-004",
    patient: "Mike Johnson",
    provider: "PhilHealth",
    amount: 1800,
    dateSubmitted: "Mar 15, 2026",
    status: "Rejected",
  },
  {
    id: "CLM-005",
    patient: "Sarah Williams",
    provider: "Maxicare",
    amount: 2500,
    dateSubmitted: "Mar 18, 2026",
    status: "Approved",
  },
  {
    id: "CLM-006",
    patient: "Maria Santos",
    provider: "PhilHealth",
    amount: 2000,
    dateSubmitted: "Mar 21, 2026",
    status: "Pending",
  },
  {
    id: "CLM-007",
    patient: "Carlos Dela Cruz",
    provider: "Maxicare",
    amount: 3500,
    dateSubmitted: "Mar 23, 2026",
    status: "Submitted",
  },
];

// ── PDF Print Helper ───────────────────────────────────────
const printInvoicePDF = (inv: Invoice) => {
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(`
    <html><head><title>${inv.id}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 40px; color: #0f172a; }
      h1 { font-size: 24px; margin-bottom: 4px; }
      .sub { color: #64748b; font-size: 14px; margin-bottom: 32px; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
      .item label { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; }
      .item p { font-size: 14px; font-weight: 600; margin: 4px 0 0; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; }
      th { background: #f8fafc; padding: 10px 12px; font-size: 12px; color: #64748b; text-align: left; border-bottom: 2px solid #e2e8f0; }
      td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
      .total { font-weight: 700; font-size: 16px; text-align: right; padding-top: 16px; }
      .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; }
      .paid { background: #d1fae5; color: #047857; }
      .pending { background: #fef3c7; color: #b45309; }
      .overdue { background: #fee2e2; color: #b91c1c; }
      .footer { margin-top: 40px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; }
    </style></head><body>
    <h1>INVOICE ${inv.id}</h1>
    <p class="sub">Clinic Management System · Generated ${new Date().toLocaleDateString()}</p>
    <div class="grid">
      <div class="item"><label>Patient</label><p>${inv.patient} (${inv.patientId})</p></div>
      <div class="item"><label>Status</label><p><span class="badge ${inv.status.toLowerCase()}">${inv.status}</span></p></div>
      <div class="item"><label>Date Issued</label><p>${inv.dateIssued}</p></div>
      <div class="item"><label>Due Date</label><p>${inv.dueDate}</p></div>
      ${inv.insurance ? `<div class="item"><label>Insurance</label><p>${inv.insurance}</p></div>` : ""}
      ${inv.notes ? `<div class="item"><label>Notes</label><p>${inv.notes}</p></div>` : ""}
    </div>
    <table>
      <thead><tr><th>Service</th><th style="text-align:right">Amount</th></tr></thead>
      <tbody>
        ${inv.services.map((s) => `<tr><td>${s.name}</td><td style="text-align:right">₱${s.cost.toLocaleString()}</td></tr>`).join("")}
      </tbody>
    可能的
    <p class="total">Total: ₱${inv.amount.toLocaleString()}</p>
    <div class="footer">This is a computer-generated invoice. No signature required.</div>
    </body></html>
  `);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
  }, 400);
};

// ── PDF Download Helper ────────────────────────────────────
const downloadInvoicePDF = async (inv: Invoice) => {
  // Create a temporary div to render the invoice HTML
  const element = document.createElement("div");
  element.innerHTML = `
    <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: white;">
      <h1 style="font-size: 24px; margin-bottom: 4px; color: #0f172a;">INVOICE ${inv.id}</h1>
      <p style="color: #64748b; font-size: 14px; margin-bottom: 32px;">
        Clinic Management System · Generated ${new Date().toLocaleDateString()}
      </p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
        <div>
          <label style="font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Patient</label>
          <p style="font-size: 14px; font-weight: 600; margin: 4px 0 0; color: #0f172a;">${inv.patient} (${inv.patientId})</p>
        </div>
        <div>
          <label style="font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Status</label>
          <p style="font-size: 14px; font-weight: 600; margin: 4px 0 0;">
            <span style="display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; background: ${inv.status === "Paid" ? "#d1fae5" : inv.status === "Pending" ? "#fef3c7" : "#fee2e2"}; color: ${inv.status === "Paid" ? "#047857" : inv.status === "Pending" ? "#b45309" : "#b91c1c"}">
              ${inv.status}
            </span>
          </p>
        </div>
        <div>
          <label style="font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Date Issued</label>
          <p style="font-size: 14px; font-weight: 600; margin: 4px 0 0; color: #0f172a;">${inv.dateIssued}</p>
        </div>
        <div>
          <label style="font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Due Date</label>
          <p style="font-size: 14px; font-weight: 600; margin: 4px 0 0; color: #0f172a;">${inv.dueDate}</p>
        </div>
        ${
          inv.insurance
            ? `
        <div>
          <label style="font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Insurance</label>
          <p style="font-size: 14px; font-weight: 600; margin: 4px 0 0; color: #0f172a;">${inv.insurance}</p>
        </div>
        `
            : ""
        }
        ${
          inv.notes
            ? `
        <div>
          <label style="font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Notes</label>
          <p style="font-size: 14px; font-weight: 600; margin: 4px 0 0; color: #0f172a;">${inv.notes}</p>
        </div>
        `
            : ""
        }
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <thead>
          <tr>
            <th style="background: #f8fafc; padding: 10px 12px; font-size: 12px; color: #64748b; text-align: left; border-bottom: 2px solid #e2e8f0;">Service</th>
            <th style="background: #f8fafc; padding: 10px 12px; font-size: 12px; color: #64748b; text-align: right; border-bottom: 2px solid #e2e8f0;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${inv.services
            .map(
              (s) => `
          <tr>
            <td style="padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${s.name}</td>
            <td style="padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #f1f5f9; text-align: right; color: #0f172a;">₱${s.cost.toLocaleString()}</td>
          </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
      
      <div style="font-weight: 700; font-size: 16px; text-align: right; padding-top: 16px; margin-top: 16px; border-top: 2px solid #e2e8f0; color: #0f172a;">
        Total: ₱${inv.amount.toLocaleString()}
      </div>
      
      <div style="margin-top: 40px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center;">
        This is a computer-generated invoice. No signature required for electronic version.
      </div>
    </div>
  `;

  element.style.position = "absolute";
  element.style.left = "-9999px";
  element.style.top = "-9999px";
  element.style.backgroundColor = "white";
  document.body.appendChild(element);

  try {
    // Show loading toast
    const loadingToast = setTimeout(() => {
      // You can add a loading indicator here if needed
    }, 100);

    // Use html2canvas to convert to image
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      logging: false,
      useCORS: true,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 190; // mm (A4 width is 210mm, with 10mm margins on each side)
    const pageHeight = 277; // mm (A4 height is 297mm, with 10mm top and bottom margins)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 10; // mm from top

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${inv.id}.pdf`);
    clearTimeout(loadingToast);
  } catch (error) {
    console.error("Error generating PDF:", error);
    // Fallback to print method if PDF generation fails
    printInvoicePDF(inv);
  } finally {
    document.body.removeChild(element);
  }
};

// Add this component after PaymentMethodModal
interface ClaimStatusModalProps {
  claim: InsuranceClaim;
  onClose: () => void;
  onUpdate: (id: string, status: InsuranceClaim["status"]) => void;
}

const ClaimStatusModal: React.FC<ClaimStatusModalProps> = ({
  claim,
  onClose,
  onUpdate,
}) => {
  const [selectedStatus, setSelectedStatus] = React.useState<
    InsuranceClaim["status"]
  >(claim.status);

  const statuses: InsuranceClaim["status"][] = [
    "Pending",
    "Submitted",
    "Approved",
    "Rejected",
  ];
  const statusColors = {
    Pending: "#f59e0b",
    Submitted: "#3b82f6",
    Approved: "#10b981",
    Rejected: "#ef4444",
  };

  return (
    <div className="bl-modal-overlay" onClick={onClose}>
      <div
        className="bl-modal-box"
        style={{ maxWidth: "400px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bl-modal-header">
          <div>
            <h2 className="bl-modal-title">Update Claim Status</h2>
            <p className="bl-modal-subtitle">
              Claim {claim.id} for {claim.patient}
            </p>
          </div>
          <button className="bl-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="bl-modal-body">
          <div className="bl-field">
            <label className="bl-label">Current Status</label>
            <div style={{ marginBottom: "1rem" }}>
              <span
                className={`bl-claim-badge bl-claim--${claim.status.toLowerCase()}`}
                style={{
                  background: `${statusColors[claim.status]}20`,
                  color: statusColors[claim.status],
                }}
              >
                {claim.status}
              </span>
            </div>
          </div>
          <div className="bl-field">
            <label className="bl-label">Update Status</label>
            <div className="bl-select-wrap">
              <select
                className="bl-select"
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as InsuranceClaim["status"])
                }
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="bl-select-icon" />
            </div>
          </div>
          {selectedStatus === "Rejected" && (
            <div className="bl-field">
              <label className="bl-label">Rejection Reason (Optional)</label>
              <textarea
                className="bl-input"
                rows={3}
                placeholder="Enter reason for rejection..."
              />
            </div>
          )}
        </div>
        <div className="bl-modal-footer">
          <button className="bl-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bl-btn-save"
            onClick={() => {
              onUpdate(claim.id, selectedStatus);
              onClose();
            }}
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Create Invoice Modal ───────────────────────────────────
interface CreateInvoiceModalProps {
  onClose: () => void;
  onSave: (inv: Invoice) => void;
  count: number;
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  onClose,
  onSave,
  count,
}) => {
  const [patient, setPatient] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [insurance, setInsurance] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [services, setServices] = React.useState([{ name: "", cost: "" }]);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const total = services.reduce((s, x) => s + (Number(x.cost) || 0), 0);

  const addService = () => setServices((p) => [...p, { name: "", cost: "" }]);
  const removeService = (i: number) =>
    setServices((p) => p.filter((_, idx) => idx !== i));
  const updateService = (i: number, field: string, val: string) =>
    setServices((p) =>
      p.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)),
    );

  const handleSubmit = () => {
    const e: Record<string, string> = {};
    if (!patient) e.patient = "Select a patient";
    if (!dueDate.trim()) e.dueDate = "Enter due date";
    if (services.some((s) => !s.name || !s.cost))
      e.services = "Fill all service fields";
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSave({
      id: `INV-${String(count + 1).padStart(3, "0")}`,
      patient,
      patientId: PATIENTS.find((p) => p.name === patient)?.id ?? "P-???",
      amount: total,
      dateIssued: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      dueDate,
      status: "Pending",
      insurance: insurance || undefined,
      notes: notes || undefined,
      services: services.map((s) => ({ name: s.name, cost: Number(s.cost) })),
    });
  };

  return (
    <div className="bl-modal-overlay" onClick={onClose}>
      <div className="bl-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="bl-modal-header">
          <div>
            <h2 className="bl-modal-title">Create Invoice</h2>
            <p className="bl-modal-subtitle">
              Fill in details to generate a new invoice
            </p>
          </div>
          <button className="bl-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="bl-modal-body">
          <div className="bl-modal-row">
            <div className="bl-field">
              <label className="bl-label">
                Patient <span className="bl-req">*</span>
              </label>
              <div className="bl-select-wrap">
                <select
                  className={`bl-select ${errors.patient ? "error" : ""}`}
                  value={patient}
                  onChange={(e) => {
                    setPatient(e.target.value);
                    setErrors((x) => ({ ...x, patient: "" }));
                  }}
                >
                  <option value="">Select patient...</option>
                  {PATIENTS.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="bl-select-icon" />
              </div>
              {errors.patient && (
                <span className="bl-error">{errors.patient}</span>
              )}
            </div>
            <div className="bl-field">
              <label className="bl-label">
                Due Date <span className="bl-req">*</span>
              </label>
              <input
                type="date"
                className={`bl-input ${errors.dueDate ? "error" : ""}`}
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  setErrors((x) => ({ ...x, dueDate: "" }));
                }}
              />
              {errors.dueDate && (
                <span className="bl-error">{errors.dueDate}</span>
              )}
            </div>
          </div>
          <div className="bl-modal-row">
            <div className="bl-field">
              <label className="bl-label">
                Insurance <span className="bl-opt">(optional)</span>
              </label>
              <input
                className="bl-input"
                placeholder="e.g. PhilHealth, Maxicare"
                value={insurance}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "" || /^[a-zA-Z0-9\s,.-]*$/.test(v))
                    setInsurance(v);
                }}
              />
            </div>
            <div className="bl-field">
              <label className="bl-label">
                Notes <span className="bl-opt">(optional)</span>
              </label>
              <input
                className="bl-input"
                placeholder="Additional notes..."
                value={notes}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "" || /^[a-zA-Z0-9\s,.'"-]*$/.test(v)) setNotes(v);
                }}
              />
            </div>
          </div>

          <div className="bl-divider">
            <span>Services</span>
          </div>
          {errors.services && (
            <span className="bl-error">{errors.services}</span>
          )}

          {services.map((s, i) => (
            <div key={i} className="bl-service-row">
              <div className="bl-field" style={{ flex: 2 }}>
                <label className="bl-label">Service</label>
                <div className="bl-select-wrap">
                  <select
                    className="bl-select"
                    value={s.name}
                    onChange={(e) => updateService(i, "name", e.target.value)}
                  >
                    <option value="">Select service...</option>
                    {SERVICES.map((sv) => (
                      <option key={sv}>{sv}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="bl-select-icon" />
                </div>
              </div>
              <div className="bl-field" style={{ flex: 1 }}>
                <label className="bl-label">Amount (₱)</label>
                <input
                  className="bl-input"
                  placeholder="0.00"
                  type="number"
                  min="0"
                  value={s.cost}
                  onChange={(e) => {
                    const value = Math.max(0, Number(e.target.value));
                    if (!isNaN(value))
                      updateService(i, "cost", value.toString());
                  }}
                />
              </div>
              {services.length > 1 && (
                <button
                  className="bl-remove-service"
                  onClick={() => removeService(i)}
                >
                  <X size={13} />
                </button>
              )}
            </div>
          ))}

          <button className="bl-add-service-btn" onClick={addService}>
            <Plus size={13} /> Add Service
          </button>

          <div className="bl-total-row">
            <span className="bl-total-label">Total Amount</span>
            <span className="bl-total-value">₱{total.toLocaleString()}</span>
          </div>
        </div>
        <div className="bl-modal-footer">
          <button className="bl-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="bl-btn-save" onClick={handleSubmit}>
            <FileText size={14} /> Create Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

// ── View Invoice Modal ─────────────────────────────────────
interface ViewInvoiceModalProps {
  invoice: Invoice;
  onClose: () => void;
  onMarkPaid: (id: string) => void;
  onSend: (id: string) => void;
  onDownload: (inv: Invoice) => void;
  onPrint: (inv: Invoice) => void;
}

const ViewInvoiceModal: React.FC<ViewInvoiceModalProps> = ({
  invoice,
  onClose,
  onMarkPaid,
  onSend,
  onDownload,
  onPrint,
}) => (
  <div className="bl-modal-overlay" onClick={onClose}>
    <div className="bl-modal-box" onClick={(e) => e.stopPropagation()}>
      <div className="bl-modal-header">
        <div>
          <div className="bl-invoice-id">{invoice.id}</div>
          <h2 className="bl-modal-title">Invoice Details</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            className={`bl-badge bl-badge--${invoice.status.toLowerCase()}`}
          >
            {invoice.status}
          </span>
          <button className="bl-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
      </div>
      <div className="bl-modal-body">
        <div className="bl-detail-grid">
          <div className="bl-detail-item">
            <span className="bl-detail-label">
              <User size={12} /> Patient
            </span>
            <span className="bl-detail-value">{invoice.patient}</span>
            <span className="bl-detail-sub">{invoice.patientId}</span>
          </div>
          <div className="bl-detail-item">
            <span className="bl-detail-label">
              <Calendar size={12} /> Date Issued
            </span>
            <span className="bl-detail-value">{invoice.dateIssued}</span>
          </div>
          <div className="bl-detail-item">
            <span className="bl-detail-label">
              <Clock size={12} /> Due Date
            </span>
            <span className="bl-detail-value">{invoice.dueDate}</span>
          </div>
          {invoice.insurance && (
            <div className="bl-detail-item">
              <span className="bl-detail-label">
                <ShieldCheck size={12} /> Insurance
              </span>
              <span className="bl-detail-value">{invoice.insurance}</span>
            </div>
          )}
        </div>

        <div className="bl-services-section">
          <p className="bl-section-label">Services</p>
          <table className="bl-services-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.services.map((s, i) => (
                <tr key={i}>
                  <td>{s.name}</td>
                  <td>₱{s.cost.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bl-services-total">
            <span>Total</span>
            <span>₱{invoice.amount.toLocaleString()}</span>
          </div>
        </div>

        {invoice.notes && (
          <div className="bl-notes-box">
            <AlertCircle size={14} /> {invoice.notes}
          </div>
        )}

        {invoice.status === "Pending" || invoice.status === "Overdue" ? (
          <div className="bl-view-actions">
            <button
              className="bl-action-send"
              onClick={() => {
                onSend(invoice.id);
                onClose();
              }}
            >
              <Send size={14} /> Send Reminder
            </button>
            <button
              className="bl-action-paid"
              onClick={() => {
                onMarkPaid(invoice.id);
                onClose();
              }}
            >
              <Check size={14} /> Mark as Paid
            </button>
          </div>
        ) : null}
      </div>
      <div className="bl-modal-footer">
        <button className="bl-btn-sm" onClick={() => onPrint(invoice)}>
          <Printer size={14} /> Print PDF
        </button>
        <button className="bl-btn-sm" onClick={() => onDownload(invoice)}>
          <Download size={14} /> Download PDF
        </button>
        <button
          className="bl-btn-cancel"
          style={{ marginLeft: "auto" }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

// ── Payment Method Modal ───────────────────────────────────
interface PaymentMethodModalProps {
  invoiceId: string;
  onClose: () => void;
  onConfirm: (id: string, method: Payment["method"]) => void;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  invoiceId,
  onClose,
  onConfirm,
}) => {
  const [selectedMethod, setSelectedMethod] =
    React.useState<Payment["method"]>("Cash");

  const methods: Payment["method"][] = ["Cash", "Card", "Insurance", "Online"];

  return (
    <div className="bl-modal-overlay" onClick={onClose}>
      <div
        className="bl-modal-box"
        style={{ maxWidth: "400px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bl-modal-header">
          <div>
            <h2 className="bl-modal-title">Record Payment</h2>
            <p className="bl-modal-subtitle">
              Select payment method for invoice {invoiceId}
            </p>
          </div>
          <button className="bl-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="bl-modal-body">
          <div className="bl-field">
            <label className="bl-label">Payment Method</label>
            <div
              className="bl-method-options"
              style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
            >
              {methods.map((method) => (
                <button
                  key={method}
                  className={`bl-method-option ${selectedMethod === method ? "active" : ""}`}
                  onClick={() => setSelectedMethod(method)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    border: `1px solid ${selectedMethod === method ? "#3b82f6" : "#e2e8f0"}`,
                    background: selectedMethod === method ? "#eff6ff" : "white",
                    color: selectedMethod === method ? "#3b82f6" : "#64748b",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                  }}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="bl-modal-footer">
          <button className="bl-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bl-btn-save"
            onClick={() => {
              onConfirm(invoiceId, selectedMethod);
              onClose();
            }}
          >
            <Check size={14} /> Record Payment
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Invoices Tab ───────────────────────────────────────────
interface InvoicesTabProps {
  invoices: Invoice[];
  onView: (inv: Invoice) => void;
  onMarkPaid: (id: string) => void;
  onDownload: (inv: Invoice) => void;
  onPrint: (inv: Invoice) => void;
  onSend: (id: string) => void;
  onCreateClick: () => void;
}

const InvoicesTab: React.FC<InvoicesTabProps> = ({
  invoices,
  onView,
  onMarkPaid,
  onDownload,
  onPrint,
  onSend,
  onCreateClick,
}) => {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"All" | InvoiceStatus>(
    "All",
  );
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpenMenu(null);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const paid = invoices
    .filter((i) => i.status === "Paid")
    .reduce((s, i) => s + i.amount, 0);
  const pending = invoices
    .filter((i) => i.status === "Pending")
    .reduce((s, i) => s + i.amount, 0);
  const overdue = invoices
    .filter((i) => i.status === "Overdue")
    .reduce((s, i) => s + i.amount, 0);

  const filtered = invoices.filter((inv) => {
    const matchSearch =
      inv.patient.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="bl-tab-content">
      {/* Summary Cards */}
      <div className="bl-summary-cards">
        {[
          { label: "Paid", value: paid, color: "#10b981", bg: "#d1fae5" },
          { label: "Pending", value: pending, color: "#f59e0b", bg: "#fef3c7" },
          { label: "Overdue", value: overdue, color: "#ef4444", bg: "#fee2e2" },
        ].map((c) => (
          <div
            key={c.label}
            className="bl-summary-card"
            style={{ borderTop: `4px solid ${c.color}` }}
          >
            <span className="bl-summary-label" style={{ color: c.color }}>
              {c.label}
            </span>
            <span className="bl-summary-value">
              ₱{c.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bl-toolbar">
        <div className="bl-search">
          <Search size={15} className="bl-search-icon" />
          <input
            className="bl-search-input"
            placeholder="Search by patient or invoice #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="bl-filter-tabs">
          {(["All", "Paid", "Pending", "Overdue"] as const).map((s) => (
            <button
              key={s}
              className={`bl-filter-tab ${statusFilter === s ? "active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <button className="bl-create-btn" onClick={onCreateClick}>
          <Plus size={15} /> Create Invoice
        </button>
      </div>

      {/* Table */}
      <div className="bl-table-wrap">
        <table className="bl-table">
          <thead>
            <tr>
              <th>Inv #</th>
              <th>Patient</th>
              <th>Amount</th>
              <th>Date Issued</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="bl-table-empty">
                  No invoices found
                </td>
              </tr>
            ) : (
              filtered.map((inv) => (
                <tr
                  key={inv.id}
                  className="bl-table-row"
                  onClick={() => onView(inv)}
                >
                  <td>
                    <span className="bl-inv-id">{inv.id}</span>
                  </td>
                  <td>
                    <div className="bl-patient-cell">
                      <span className="bl-patient-name">{inv.patient}</span>
                      <span className="bl-patient-sub">{inv.patientId}</span>
                    </div>
                  </td>
                  <td>
                    <span className="bl-amount">
                      ₱{inv.amount.toLocaleString()}
                    </span>
                  </td>
                  <td>{inv.dateIssued}</td>
                  <td
                    className={
                      inv.status === "Overdue" ? "bl-overdue-date" : ""
                    }
                  >
                    {inv.dueDate}
                  </td>
                  <td>
                    <span
                      className={`bl-badge bl-badge--${inv.status.toLowerCase()}`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div
                      className="bl-menu-wrap"
                      ref={openMenu === inv.id ? menuRef : null}
                    >
                      <button
                        className="bl-menu-btn"
                        onClick={() =>
                          setOpenMenu(openMenu === inv.id ? null : inv.id)
                        }
                      >
                        <MoreVertical size={15} />
                      </button>
                      {openMenu === inv.id && (
                        <div className="bl-menu-dropdown">
                          <div
                            className="bl-menu-item"
                            onClick={() => {
                              onView(inv);
                              setOpenMenu(null);
                            }}
                          >
                            <Eye size={13} /> View
                          </div>
                          <div
                            className="bl-menu-item"
                            onClick={() => {
                              onDownload(inv);
                              setOpenMenu(null);
                            }}
                          >
                            <Download size={13} /> Download PDF
                          </div>
                          <div
                            className="bl-menu-item"
                            onClick={() => {
                              onPrint(inv);
                              setOpenMenu(null);
                            }}
                          >
                            <Printer size={13} /> Print
                          </div>
                          <div
                            className="bl-menu-item"
                            onClick={() => {
                              onSend(inv.id);
                              setOpenMenu(null);
                            }}
                          >
                            <Send size={13} /> Send
                          </div>
                          {inv.status !== "Paid" && (
                            <div
                              className="bl-menu-item bl-menu-item--green"
                              onClick={() => {
                                onMarkPaid(inv.id);
                                setOpenMenu(null);
                              }}
                            >
                              <Check size={13} /> Mark Paid
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Payments Tab ───────────────────────────────────────────
const PaymentsTab: React.FC<{ payments: Payment[] }> = ({ payments }) => {
  const [search, setSearch] = React.useState("");
  const [methodFilter, setMethodFilter] = React.useState<
    "All" | Payment["method"]
  >("All");
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof Payment;
    direction: "asc" | "desc";
  }>({ key: "date", direction: "desc" });

  const handleSort = (key: keyof Payment) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchSearch =
      payment.id.toLowerCase().includes(search.toLowerCase()) ||
      payment.invoiceId.toLowerCase().includes(search.toLowerCase()) ||
      payment.patient.toLowerCase().includes(search.toLowerCase());
    const matchMethod =
      methodFilter === "All" || payment.method === methodFilter;
    return matchSearch && matchMethod;
  });

  // Sort payments
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    let comparison = 0;

    switch (sortConfig.key) {
      case "amount":
        comparison = a.amount - b.amount;
        break;
      case "date":
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case "id":
      case "invoiceId":
      case "patient":
      case "method":
        comparison = a[sortConfig.key].localeCompare(b[sortConfig.key]);
        break;
      default:
        comparison = 0;
    }

    return sortConfig.direction === "asc" ? comparison : -comparison;
  });

  return (
    <div className="bl-tab-content">
      <div className="bl-tab-header">
        <h3 className="bl-tab-title">
          <CreditCard size={16} /> Payment History
        </h3>
      </div>

      {/* Toolbar */}
      <div className="bl-toolbar">
        <div className="bl-search">
          <Search size={15} className="bl-search-icon" />
          <input
            className="bl-search-input"
            placeholder="Search by Payment ID, Invoice, or Patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="bl-filter-tabs">
          {(["All", "Cash", "Card", "Insurance", "Online"] as const).map(
            (method) => (
              <button
                key={method}
                className={`bl-filter-tab ${methodFilter === method ? "active" : ""}`}
                onClick={() => setMethodFilter(method)}
              >
                {method}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bl-table-wrap">
        <table className="bl-table">
          <thead>
            <tr>
              <th
                onClick={() => handleSort("id")}
                style={{ cursor: "pointer" }}
              >
                Payment ID{" "}
                {sortConfig.key === "id" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("invoiceId")}
                style={{ cursor: "pointer" }}
              >
                Invoice{" "}
                {sortConfig.key === "invoiceId" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("patient")}
                style={{ cursor: "pointer" }}
              >
                Patient{" "}
                {sortConfig.key === "patient" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("amount")}
                style={{ cursor: "pointer" }}
              >
                Amount{" "}
                {sortConfig.key === "amount" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("date")}
                style={{ cursor: "pointer" }}
              >
                Date{" "}
                {sortConfig.key === "date" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("method")}
                style={{ cursor: "pointer" }}
              >
                Method{" "}
                {sortConfig.key === "method" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPayments.length === 0 ? (
              <tr>
                <td colSpan={6} className="bl-table-empty">
                  No payments found
                </td>
              </tr>
            ) : (
              sortedPayments.map((p) => (
                <tr key={p.id} className="bl-table-row">
                  <td>
                    <span className="bl-inv-id">{p.id}</span>
                  </td>
                  <td>
                    <span className="bl-inv-id">{p.invoiceId}</span>
                  </td>
                  <td>{p.patient}</td>
                  <td>
                    <span className="bl-amount">
                      ₱{p.amount.toLocaleString()}
                    </span>
                  </td>
                  <td>{p.date}</td>
                  <td>
                    <span
                      className={`bl-method-badge bl-method--${p.method.toLowerCase()}`}
                      style={{
                        background:
                          p.method === "Cash"
                            ? "#d1fae5"
                            : p.method === "Card"
                              ? "#dbeafe"
                              : p.method === "Insurance"
                                ? "#fef3c7"
                                : "#e0e7ff",
                        color:
                          p.method === "Cash"
                            ? "#047857"
                            : p.method === "Card"
                              ? "#1e40af"
                              : p.method === "Insurance"
                                ? "#b45309"
                                : "#3730a3",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {p.method}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Insurance Tab ──────────────────────────────────────────
interface InsuranceTabProps {
  claims: InsuranceClaim[];
  onUpdateStatus: (id: string, status: InsuranceClaim["status"]) => void;
}

const InsuranceTab: React.FC<InsuranceTabProps> = ({
  claims,
  onUpdateStatus,
}) => {
  const [selectedClaim, setSelectedClaim] =
    React.useState<InsuranceClaim | null>(null);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "All" | InsuranceClaim["status"]
  >("All");
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof InsuranceClaim;
    direction: "asc" | "desc";
  }>({ key: "dateSubmitted", direction: "desc" });

  const handleSort = (key: keyof InsuranceClaim) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const filteredClaims = claims.filter((claim) => {
    const matchSearch =
      claim.patient.toLowerCase().includes(search.toLowerCase()) ||
      claim.id.toLowerCase().includes(search.toLowerCase()) ||
      claim.provider.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || claim.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const sortedClaims = [...filteredClaims].sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;

    // Handle different field types
    switch (sortConfig.key) {
      case "dateSubmitted":
        aValue = new Date(a.dateSubmitted);
        bValue = new Date(b.dateSubmitted);
        break;
      case "amount":
        aValue = a.amount;
        bValue = b.amount;
        break;
      case "id":
      case "patient":
      case "provider":
      case "status":
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
        break;
      default:
        aValue = a[sortConfig.key] as string;
        bValue = b[sortConfig.key] as string;
    }

    // Handle string comparison for text fields
    if (typeof aValue === "string" && typeof bValue === "string") {
      const comparison = aValue.localeCompare(bValue);
      return sortConfig.direction === "asc" ? comparison : -comparison;
    }

    // Handle numeric and date comparisons
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="bl-tab-content">
      <div className="bl-tab-header">
        <h3 className="bl-tab-title">
          <ShieldCheck size={16} /> Insurance Claims
        </h3>
      </div>

      <div className="bl-toolbar">
        <div className="bl-search">
          <Search size={15} className="bl-search-icon" />
          <input
            className="bl-search-input"
            placeholder="Search by patient, claim ID, or provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="bl-filter-tabs">
          {(
            ["All", "Pending", "Submitted", "Approved", "Rejected"] as const
          ).map((s) => (
            <button
              key={s}
              className={`bl-filter-tab ${statusFilter === s ? "active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bl-table-wrap">
        <table className="bl-table">
          <thead>
            <tr>
              <th
                onClick={() => handleSort("id")}
                style={{ cursor: "pointer" }}
              >
                Claim ID{" "}
                {sortConfig.key === "id" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("patient")}
                style={{ cursor: "pointer" }}
              >
                Patient{" "}
                {sortConfig.key === "patient" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("provider")}
                style={{ cursor: "pointer" }}
              >
                Provider{" "}
                {sortConfig.key === "provider" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("amount")}
                style={{ cursor: "pointer" }}
              >
                Amount{" "}
                {sortConfig.key === "amount" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("dateSubmitted")}
                style={{ cursor: "pointer" }}
              >
                Submitted{" "}
                {sortConfig.key === "dateSubmitted" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("status")}
                style={{ cursor: "pointer" }}
              >
                Status{" "}
                {sortConfig.key === "status" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedClaims.map((c) => (
              <tr key={c.id} className="bl-table-row">
                <td>
                  <span className="bl-inv-id">{c.id}</span>
                </td>
                <td>{c.patient}</td>
                <td>{c.provider}</td>
                <td>
                  <span className="bl-amount">
                    ₱{c.amount.toLocaleString()}
                  </span>
                </td>
                <td>{c.dateSubmitted}</td>
                <td>
                  <span
                    className={`bl-claim-badge bl-claim--${c.status.toLowerCase()}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedClaim(c)}
                  >
                    {c.status}
                  </span>
                </td>
                <td>
                  <button
                    className="bl-btn-sm"
                    onClick={() => setSelectedClaim(c)}
                    style={{ padding: "4px 8px", fontSize: "12px" }}
                  >
                    Update Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedClaim && (
        <ClaimStatusModal
          claim={selectedClaim}
          onClose={() => setSelectedClaim(null)}
          onUpdate={onUpdateStatus}
        />
      )}
    </div>
  );
};

// ── Summary Tab ────────────────────────────────────────────
interface SummaryTabProps {
  invoices: Invoice[];
  payments: Payment[];
}
const SummaryTab: React.FC<SummaryTabProps> = ({ invoices, payments }) => {
  const totalRevenue = invoices
    .filter((i) => i.status === "Paid")
    .reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices
    .filter((i) => i.status === "Pending")
    .reduce((s, i) => s + i.amount, 0);
  const totalOverdue = invoices
    .filter((i) => i.status === "Overdue")
    .reduce((s, i) => s + i.amount, 0);
  const totalInvoices = invoices.length;
  const collectionRate = Math.round(
    (invoices.filter((i) => i.status === "Paid").length / totalInvoices) * 100,
  );

  const kpis = [
    {
      label: "Total Revenue",
      value: `₱${totalRevenue.toLocaleString()}`,
      icon: <DollarSign size={20} />,
      color: "#10b981",
      bg: "#d1fae5",
    },
    {
      label: "Pending Payments",
      value: `₱${totalPending.toLocaleString()}`,
      icon: <Clock size={20} />,
      color: "#f59e0b",
      bg: "#fef3c7",
    },
    {
      label: "Overdue Amount",
      value: `₱${totalOverdue.toLocaleString()}`,
      icon: <AlertCircle size={20} />,
      color: "#ef4444",
      bg: "#fee2e2",
    },
    {
      label: "Collection Rate",
      value: `${collectionRate}%`,
      icon: <TrendingUp size={20} />,
      color: "#3b82f6",
      bg: "#dbeafe",
    },
  ];

  return (
    <div className="bl-tab-content">
      <div className="bl-tab-header">
        <h3 className="bl-tab-title">
          <BarChart2 size={16} /> Financial Summary
        </h3>
      </div>
      <div className="bl-kpi-grid">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="bl-kpi-card"
            style={{ borderTop: `4px solid ${k.color}` }}
          >
            <div
              className="bl-kpi-icon"
              style={{ background: k.bg, color: k.color }}
            >
              {k.icon}
            </div>
            <div>
              <p className="bl-kpi-label">{k.label}</p>
              <p className="bl-kpi-value" style={{ color: k.color }}>
                {k.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bl-summary-section">
        <p className="bl-section-label">Invoice Breakdown</p>
        <div className="bl-breakdown-list">
          {["Paid", "Pending", "Overdue"].map((s) => {
            const count = invoices.filter((i) => i.status === s).length;
            const pct = Math.round((count / totalInvoices) * 100);
            const color =
              s === "Paid"
                ? "#10b981"
                : s === "Pending"
                  ? "#f59e0b"
                  : "#ef4444";
            return (
              <div key={s} className="bl-breakdown-item">
                <div className="bl-breakdown-top">
                  <span className="bl-breakdown-label">{s}</span>
                  <span className="bl-breakdown-count">
                    {count} invoice{count !== 1 ? "s" : ""} · {pct}%
                  </span>
                </div>
                <div className="bl-progress-bar">
                  <div
                    className="bl-progress-fill"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bl-summary-section">
        <p className="bl-section-label">Recent Payments</p>
        <div className="bl-recent-payments">
          {payments
            .filter((p) => {
              const associatedInvoice = invoices.find(
                (inv) => inv.id === p.invoiceId,
              );
              return associatedInvoice?.status === "Paid";
            })
            .sort((a, b) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              return dateB.getTime() - dateA.getTime();
            })
            .slice(0, 5)
            .map((p) => (
              <div key={p.id} className="bl-recent-pay-item">
                <div>
                  <p className="bl-recent-patient">{p.patient}</p>
                  <p className="bl-recent-date">
                    {p.date} · {p.method}
                  </p>
                </div>
                <span className="bl-recent-amount">
                  ₱{p.amount.toLocaleString()}
                </span>
              </div>
            ))}
          {payments.filter((p) => {
            const associatedInvoice = invoices.find(
              (inv) => inv.id === p.invoiceId,
            );
            return associatedInvoice?.status === "Paid";
          }).length === 0 && (
            <div
              className="bl-empty-message"
              style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}
            >
              No paid payments yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────
const Billing: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>("invoices");
  const [invoices, setInvoices] = React.useState<Invoice[]>(initialInvoices);
  const [payments, setPayments] = React.useState<Payment[]>(initialPayments);
  const [claims, setClaims] = React.useState<InsuranceClaim[]>(initialClaims);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [viewInvoice, setViewInvoice] = React.useState<Invoice | null>(null);
  const [toast, setToast] = React.useState<string | null>(null);
  const [showPaymentMethodModal, setShowPaymentMethodModal] =
    React.useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = React.useState<
    string | null
  >(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateInvoice = (inv: Invoice) => {
    setInvoices((prev) => [inv, ...prev]);

    if (inv.insurance) {
      const newClaim: InsuranceClaim = {
        id: `CLM-${String(claims.length + 1).padStart(3, "0")}`,
        invoiceId: inv.id,
        patient: inv.patient,
        patientId: inv.patientId,
        provider: inv.insurance,
        amount: inv.amount,
        dateSubmitted: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        status: "Pending",
      };
      setClaims((prev) => [newClaim, ...prev]);
      showToast(`Insurance claim created for ${inv.id}`);
    }

    setShowCreateModal(false);
    showToast(`Invoice ${inv.id} created successfully`);
  };

  const handleMarkPaid = (id: string, method: Payment["method"]) => {
    const inv = invoices.find((i) => i.id === id);
    if (!inv) return;

    const existingPayment = payments.find((p) => p.invoiceId === id);

    if (existingPayment) {
      if (inv.status !== "Paid") {
        setInvoices((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: "Paid" } : i)),
        );
        showToast(
          `Payment already recorded. Invoice ${inv.id} status updated to Paid.`,
        );
      } else {
        showToast(`Invoice ${inv.id} is already paid.`);
      }
      return;
    }

    setInvoices((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "Paid" } : i)),
    );

    const newPayment: Payment = {
      id: `PAY-${String(payments.length + 1).padStart(3, "0")}`,
      invoiceId: inv.id,
      patient: inv.patient,
      amount: inv.amount,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      method: method,
    };

    if (method === "Insurance" && inv.insurance) {
      const relatedClaim = claims.find((c) => c.invoiceId === inv.id);
      if (relatedClaim) {
        setClaims((prev) =>
          prev.map((c) =>
            c.id === relatedClaim.id
              ? { ...c, status: "Approved" as const }
              : c,
          ),
        );
        newPayment.claimId = relatedClaim.id;
        showToast(`Insurance claim ${relatedClaim.id} approved`);
      }
    }

    setPayments((prev) => [newPayment, ...prev]);
    showToast(`Invoice ${inv.id} marked as paid with ${method}`);
  };

  const handleUpdateClaimStatus = (
    id: string,
    status: InsuranceClaim["status"],
  ) => {
    setClaims((prev) =>
      prev.map((claim) => (claim.id === id ? { ...claim, status } : claim)),
    );
    showToast(`Claim ${id} status updated to ${status}`);
  };

  const handleSend = (id: string) => showToast(`Reminder sent for ${id}`);

  const handleDownloadPDF = (inv: Invoice) => {
    downloadInvoicePDF(inv);
    showToast(`Downloading ${inv.id}...`);
  };

  const TABS: { key: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { key: "invoices", label: "Invoices", icon: <FileText size={15} /> },
    { key: "payments", label: "Payments", icon: <CreditCard size={15} /> },
    { key: "insurance", label: "Insurance", icon: <ShieldCheck size={15} /> },
    { key: "summary", label: "Summary", icon: <BarChart2 size={15} /> },
  ];

  return (
    <div className="bl-container">
      {toast && (
        <div className="bl-toast">
          <Check size={15} /> {toast}
        </div>
      )}

      <div className="bl-header">
        <h1 className="bl-title">Billing & Invoicing</h1>
        <p className="bl-subtitle">Manage payments and financial records</p>
      </div>

      <div className="bl-card">
        <div className="bl-tab-bar">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`bl-tab ${activeTab === t.key ? "active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {activeTab === "invoices" && (
          <InvoicesTab
            invoices={invoices}
            onView={setViewInvoice}
            onMarkPaid={(id) => {
              setSelectedInvoiceId(id);
              setShowPaymentMethodModal(true);
            }}
            onDownload={handleDownloadPDF}
            onPrint={printInvoicePDF}
            onSend={handleSend}
            onCreateClick={() => setShowCreateModal(true)}
          />
        )}
        {activeTab === "payments" && <PaymentsTab payments={payments} />}
        {activeTab === "insurance" && (
          <InsuranceTab
            claims={claims}
            onUpdateStatus={handleUpdateClaimStatus}
          />
        )}
        {activeTab === "summary" && (
          <SummaryTab invoices={invoices} payments={payments} />
        )}
      </div>

      {showCreateModal && (
        <CreateInvoiceModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateInvoice}
          count={invoices.length}
        />
      )}
      {viewInvoice && (
        <ViewInvoiceModal
          invoice={invoices.find((i) => i.id === viewInvoice.id) ?? viewInvoice}
          onClose={() => setViewInvoice(null)}
          onMarkPaid={(id) => {
            setSelectedInvoiceId(id);
            setShowPaymentMethodModal(true);
          }}
          onSend={handleSend}
          onDownload={handleDownloadPDF}
          onPrint={printInvoicePDF}
        />
      )}

      {showPaymentMethodModal && selectedInvoiceId && (
        <PaymentMethodModal
          invoiceId={selectedInvoiceId}
          onClose={() => {
            setShowPaymentMethodModal(false);
            setSelectedInvoiceId(null);
          }}
          onConfirm={(id, method) => {
            handleMarkPaid(id, method);
            setShowPaymentMethodModal(false);
            setSelectedInvoiceId(null);
          }}
        />
      )}
    </div>
  );
};

export default Billing;
