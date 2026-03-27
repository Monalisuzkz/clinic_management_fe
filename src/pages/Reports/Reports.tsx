import * as React from "react";
import {
  Users,
  DollarSign,
  Calendar,
  TrendingDown,
  Download,
  Filter,
  ChevronDown,
  BarChart2,
  PieChart,
  Activity,
  Check,
  Printer,
} from "lucide-react";
import "./Reports.css";

// ── Mock Data ──────────────────────────────────────────────
const DOCTORS = [
  "All",
  "Dr. Smith",
  "Dr. Lee",
  "Dr. Williams",
  "Dr. Brown",
  "Dr. Garcia",
];
const DEPARTMENTS = [
  "All",
  "General Medicine",
  "Cardiology",
  "Pediatrics",
  "Orthopedics",
  "OB-GYN",
];

const revenueData = [
  { month: "Oct", value: 38000 },
  { month: "Nov", value: 42000 },
  { month: "Dec", value: 51000 },
  { month: "Jan", value: 45000 },
  { month: "Feb", value: 48000 },
  { month: "Mar", value: 55000 },
];

const appointmentsByDoctor = [
  { doctor: "Dr. Smith", count: 312 },
  { doctor: "Dr. Lee", count: 278 },
  { doctor: "Dr. Williams", count: 245 },
  { doctor: "Dr. Brown", count: 198 },
  { doctor: "Dr. Garcia", count: 165 },
];

const demographics = [
  { label: "Male", value: 38, color: "#3b82f6" },
  { label: "Female", value: 47, color: "#ec4899" },
  { label: "Children", value: 15, color: "#10b981" },
];

const financialSummary = {
  totalRevenue: 279000,
  pendingPayments: 45200,
  overdue: 12800,
  collectionRate: 87,
};

const appointmentStats = {
  completed: 1032,
  noShows: 78,
  cancelled: 34,
  avgDuration: 30,
};

// ── Date Formatter ─────────────────────────────────────────
const formatDate = (d: string) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

// ── PDF Export ─────────────────────────────────────────────
const exportPDF = async (
  doctorFilter: string,
  deptFilter: string,
  dateFrom: string,
  dateTo: string,
) => {
  const { jsPDF } = await import("jspdf");
  const html2canvas = (await import("html2canvas")).default;

  const htmlContent = `
    <div style="font-family:Arial,sans-serif;padding:40px;color:#0f172a;background:white;">
      <h1 style="font-size:24px;margin-bottom:4px;">Clinic Analytics Report</h1>
      <p style="color:#64748b;font-size:13px;margin-bottom:32px;">Generated ${new Date().toLocaleDateString()}</p>
      <div style="background:#f8fafc;padding:12px 16px;border-radius:8px;font-size:12px;color:#64748b;margin-bottom:24px;">
        Filters: Doctor: ${doctorFilter} | Department: ${deptFilter} | Period: ${formatDate(dateFrom)} to ${formatDate(dateTo)}
      </div>
      <div style="margin-bottom:28px;">
        <h2 style="font-size:16px;font-weight:700;border-bottom:2px solid #f1f5f9;padding-bottom:8px;margin-bottom:16px;">KPI Overview</h2>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
          <div style="background:#f8fafc;border-radius:8px;padding:14px;"><p style="font-size:11px;text-transform:uppercase;color:#94a3b8;font-weight:700;margin:0;">Total Patients</p><p style="font-size:20px;font-weight:800;color:#0f172a;margin:4px 0 0;">1,245</p></div>
          <div style="background:#f8fafc;border-radius:8px;padding:14px;"><p style="font-size:11px;text-transform:uppercase;color:#94a3b8;font-weight:700;margin:0;">Total Revenue</p><p style="font-size:20px;font-weight:800;color:#0f172a;margin:4px 0 0;">₱${financialSummary.totalRevenue.toLocaleString()}</p></div>
          <div style="background:#f8fafc;border-radius:8px;padding:14px;"><p style="font-size:11px;text-transform:uppercase;color:#94a3b8;font-weight:700;margin:0;">Appointments Completed</p><p style="font-size:20px;font-weight:800;color:#0f172a;margin:4px 0 0;">${appointmentStats.completed.toLocaleString()}</p></div>
          <div style="background:#f8fafc;border-radius:8px;padding:14px;"><p style="font-size:11px;text-transform:uppercase;color:#94a3b8;font-weight:700;margin:0;">No-show Rate</p><p style="font-size:20px;font-weight:800;color:#0f172a;margin:4px 0 0;">${Math.round((appointmentStats.noShows / (appointmentStats.completed + appointmentStats.noShows)) * 100)}%</p></div>
        </div>
      </div>
      <div style="margin-bottom:28px;">
        <h2 style="font-size:16px;font-weight:700;border-bottom:2px solid #f1f5f9;padding-bottom:8px;margin-bottom:16px;">Revenue Trend</h2>
        <table style="width:100%;border-collapse:collapse;">
          <thead><tr><th style="background:#f8fafc;padding:10px 12px;font-size:11px;color:#64748b;text-align:left;border-bottom:2px solid #e2e8f0;">Month</th><th style="background:#f8fafc;padding:10px 12px;font-size:11px;color:#64748b;text-align:left;border-bottom:2px solid #e2e8f0;">Revenue</th></tr></thead>
          <tbody>${revenueData.map((r) => `<tr><td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">${r.month}</td><td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">₱${r.value.toLocaleString()}</td></tr>`).join("")}</tbody>
        </table>
      </div>
      <div style="margin-bottom:28px;">
        <h2 style="font-size:16px;font-weight:700;border-bottom:2px solid #f1f5f9;padding-bottom:8px;margin-bottom:16px;">Appointments by Doctor</h2>
        <table style="width:100%;border-collapse:collapse;">
          <thead><tr><th style="background:#f8fafc;padding:10px 12px;font-size:11px;color:#64748b;text-align:left;border-bottom:2px solid #e2e8f0;">Doctor</th><th style="background:#f8fafc;padding:10px 12px;font-size:11px;color:#64748b;text-align:left;border-bottom:2px solid #e2e8f0;">Appointments</th></tr></thead>
          <tbody>${appointmentsByDoctor.map((d) => `<tr><td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">${d.doctor}</td><td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">${d.count}</td></tr>`).join("")}</tbody>
        </table>
      </div>
      <div style="margin-bottom:28px;">
        <h2 style="font-size:16px;font-weight:700;border-bottom:2px solid #f1f5f9;padding-bottom:8px;margin-bottom:16px;">Financial Summary</h2>
        <table style="width:100%;border-collapse:collapse;">
          <thead><tr><th style="background:#f8fafc;padding:10px 12px;font-size:11px;color:#64748b;text-align:left;border-bottom:2px solid #e2e8f0;">Metric</th><th style="background:#f8fafc;padding:10px 12px;font-size:11px;color:#64748b;text-align:left;border-bottom:2px solid #e2e8f0;">Value</th></tr></thead>
          <tbody>
            <tr><td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">Total Revenue</td><td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">₱${financialSummary.totalRevenue.toLocaleString()}</td></tr>
            <tr><td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">Pending Payments</td><td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">₱${financialSummary.pendingPayments.toLocaleString()}</td></tr>
            <tr><td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">Overdue</td><td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">₱${financialSummary.overdue.toLocaleString()}</td></tr>
            <tr><td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">Collection Rate</td><td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">${financialSummary.collectionRate}%</td></tr>
          </tbody>
        </table>
      </div>
      <div style="margin-top:40px;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px;">
        Clinic Management System · Analytics Report
      </div>
    </div>
  `;

  const container = document.createElement("div");
  container.innerHTML = htmlContent;
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.width = "800px";
  container.style.backgroundColor = "white";
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: "#ffffff",
      logging: false,
      useCORS: true,
      windowWidth: 800,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const imgWidth = 190;
    const pageHeight = 277;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`clinic_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
};

// ── Print Report ───────────────────────────────────────────
const printReport = (
  doctorFilter: string,
  deptFilter: string,
  dateFrom: string,
  dateTo: string,
) => {
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(`<html><head><title>Clinic Report</title>
  <style>
    body{font-family:Arial,sans-serif;padding:40px;color:#0f172a}
    h1{font-size:24px;margin-bottom:4px}
    .sub{color:#64748b;font-size:13px;margin-bottom:32px}
    .filters{background:#f8fafc;padding:12px 16px;border-radius:8px;font-size:12px;color:#64748b;margin-bottom:24px}
    .section{margin-bottom:28px}
    h2{font-size:16px;font-weight:700;border-bottom:2px solid #f1f5f9;padding-bottom:8px;margin-bottom:16px}
    .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:20px}
    .kpi{background:#f8fafc;border-radius:8px;padding:14px}
    .kpi label{font-size:11px;text-transform:uppercase;color:#94a3b8;font-weight:700}
    .kpi p{font-size:20px;font-weight:800;color:#0f172a;margin:4px 0 0}
    table{width:100%;border-collapse:collapse}
    th{background:#f8fafc;padding:10px 12px;font-size:11px;color:#64748b;text-align:left;border-bottom:2px solid #e2e8f0;text-transform:uppercase}
    td{padding:10px 12px;font-size:13px;border-bottom:1px solid #f1f5f9}
    .footer{margin-top:40px;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px}
  </style></head><body>
  <h1>Clinic Analytics Report</h1>
  <p class="sub">Generated ${new Date().toLocaleDateString()}</p>
  <div class="filters">
    Filters: Doctor: ${doctorFilter} | Department: ${deptFilter} | Period: ${formatDate(dateFrom)} to ${formatDate(dateTo)}
  </div>
  <div class="section">
    <h2>KPI Overview</h2>
    <div class="grid">
      <div class="kpi"><label>Total Patients</label><p>1,245</p></div>
      <div class="kpi"><label>Total Revenue</label><p>₱${financialSummary.totalRevenue.toLocaleString()}</p></div>
      <div class="kpi"><label>Appointments Completed</label><p>${appointmentStats.completed.toLocaleString()}</p></div>
      <div class="kpi"><label>No-show Rate</label><p>${Math.round((appointmentStats.noShows / (appointmentStats.completed + appointmentStats.noShows)) * 100)}%</p></div>
    </div>
  </div>
  <div class="section">
    <h2>Revenue Trend</h2>
    <table><thead><tr><th>Month</th><th>Revenue</th></tr></thead><tbody>
    ${revenueData.map((r) => `<tr><td>${r.month}</td><td>₱${r.value.toLocaleString()}</td></tr>`).join("")}
    </tbody></table>
  </div>
  <div class="section">
    <h2>Appointments by Doctor</h2>
    <table><thead><tr><th>Doctor</th><th>Appointments</th></tr></thead><tbody>
    ${appointmentsByDoctor.map((d) => `<tr><td>${d.doctor}</td><td>${d.count}</td></tr>`).join("")}
    </tbody></table>
  </div>
  <div class="section">
    <h2>Financial Summary</h2>
    <table><thead><tr><th>Metric</th><th>Value</th></tr></thead><tbody>
    <tr><td>Total Revenue</td><td>₱${financialSummary.totalRevenue.toLocaleString()}</td></tr>
    <tr><td>Pending Payments</td><td>₱${financialSummary.pendingPayments.toLocaleString()}</td></tr>
    <tr><td>Overdue</td><td>₱${financialSummary.overdue.toLocaleString()}</td></tr>
    <tr><td>Collection Rate</td><td>${financialSummary.collectionRate}%</td></tr>
    </tbody></table>
  </div>
  <div class="footer">Clinic Management System · Analytics Report</div>
  </body></html>`);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 400);
};

// ── Line Chart (SVG) ───────────────────────────────────────
const LineChart: React.FC = () => {
  const W = 500,
    H = 180,
    pad = 40;
  const maxVal = Math.max(...revenueData.map((r) => r.value));
  const minVal = Math.min(...revenueData.map((r) => r.value));
  const xStep = (W - pad * 2) / (revenueData.length - 1);
  const yScale = (v: number) =>
    H - pad - ((v - minVal) / (maxVal - minVal + 1)) * (H - pad * 2);

  const points = revenueData.map((r, i) => ({
    x: pad + i * xStep,
    y: yScale(r.value),
    ...r,
  }));
  const pathD = points
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(" ");
  const areaD = `${pathD} L${points[points.length - 1].x},${H - pad} L${points[0].x},${H - pad} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="rp-chart-svg">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => {
        const y = pad + (i * (H - pad * 2)) / 3;
        return (
          <line
            key={i}
            x1={pad}
            y1={y}
            x2={W - pad}
            y2={y}
            stroke="#f1f5f9"
            strokeWidth="1"
          />
        );
      })}
      <path d={areaD} fill="url(#lineGrad)" />
      <path
        d={pathD}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {points.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r={4}
            fill="white"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          <text
            x={p.x}
            y={H - 8}
            textAnchor="middle"
            fontSize="11"
            fill="#94a3b8"
          >
            {p.month}
          </text>
          <text
            x={p.x}
            y={p.y - 10}
            textAnchor="middle"
            fontSize="10"
            fill="#64748b"
          >
            ₱{(p.value / 1000).toFixed(0)}K
          </text>
        </g>
      ))}
    </svg>
  );
};

// ── Bar Chart (SVG) ────────────────────────────────────────
const BarChart: React.FC = () => {
  const W = 500,
    H = 200,
    pad = { t: 20, b: 50, l: 30, r: 20 };
  const maxVal = Math.max(...appointmentsByDoctor.map((d) => d.count));
  const barW = (W - pad.l - pad.r) / appointmentsByDoctor.length - 10;
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="rp-chart-svg">
      {[0, 1, 2, 3].map((i) => {
        const y = pad.t + (i * (H - pad.t - pad.b)) / 3;
        return (
          <line
            key={i}
            x1={pad.l}
            y1={y}
            x2={W - pad.r}
            y2={y}
            stroke="#f1f5f9"
            strokeWidth="1"
          />
        );
      })}
      {appointmentsByDoctor.map((d, i) => {
        const x =
          pad.l + i * ((W - pad.l - pad.r) / appointmentsByDoctor.length) + 5;
        const barH = (d.count / maxVal) * (H - pad.t - pad.b);
        const y = H - pad.b - barH;
        const shortName = d.doctor.replace("Dr. ", "");
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx="4"
              fill={colors[i]}
              opacity="0.85"
            />
            <text
              x={x + barW / 2}
              y={y - 5}
              textAnchor="middle"
              fontSize="10"
              fill="#64748b"
            >
              {d.count}
            </text>
            <text
              x={x + barW / 2}
              y={H - 10}
              textAnchor="middle"
              fontSize="10"
              fill="#94a3b8"
            >
              {shortName}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ── Pie Chart ──────────────────────────────────────────────
type Slice = { label: string; value: number; color: string; d: string };

const PIE_CX = 80,
  PIE_CY = 80,
  PIE_R = 65;
const PIE_TOTAL = demographics.reduce((s, d) => s + d.value, 0);

const pieSlices: Slice[] = demographics.reduce<Slice[]>((acc, d) => {
  const startAngle = acc.reduce(
    (sum, s) => sum + (s.value / PIE_TOTAL) * 2 * Math.PI,
    -Math.PI / 2,
  );
  const angle = (d.value / PIE_TOTAL) * 2 * Math.PI;
  const x1 = PIE_CX + PIE_R * Math.cos(startAngle);
  const y1 = PIE_CY + PIE_R * Math.sin(startAngle);
  const x2 = PIE_CX + PIE_R * Math.cos(startAngle + angle);
  const y2 = PIE_CY + PIE_R * Math.sin(startAngle + angle);
  const large = angle > Math.PI ? 1 : 0;
  return [
    ...acc,
    {
      ...d,
      d: `M${PIE_CX},${PIE_CY} L${x1},${y1} A${PIE_R},${PIE_R} 0 ${large},1 ${x2},${y2} Z`,
    },
  ];
}, []);

const PieChartSVG: React.FC = () => (
  <div className="rp-pie-wrap">
    <svg viewBox="0 0 160 160" className="rp-pie-svg">
      {pieSlices.map((s, i) => (
        <path key={i} d={s.d} fill={s.color} opacity="0.9" />
      ))}
      <circle cx={PIE_CX} cy={PIE_CY} r={35} fill="white" />
      <text
        x={PIE_CX}
        y={PIE_CY - 5}
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="#0f172a"
      >
        {PIE_TOTAL}
      </text>
      <text
        x={PIE_CX}
        y={PIE_CY + 10}
        textAnchor="middle"
        fontSize="9"
        fill="#94a3b8"
      >
        patients
      </text>
    </svg>
    <div className="rp-pie-legend">
      {demographics.map((d) => (
        <div key={d.label} className="rp-legend-item">
          <span className="rp-legend-dot" style={{ background: d.color }} />
          <span className="rp-legend-label">{d.label}</span>
          <span className="rp-legend-val">{d.value}%</span>
        </div>
      ))}
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────
const Reports: React.FC = () => {
  const [doctorFilter, setDoctorFilter] = React.useState("All");
  const [deptFilter, setDeptFilter] = React.useState("All");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [toast, setToast] = React.useState<string | null>(null);
  const [showDoctorDd, setShowDoctorDd] = React.useState(false);
  const [showDeptDd, setShowDeptDd] = React.useState(false);
  const [dateError, setDateError] = React.useState(false);
  const doctorRef = React.useRef<HTMLDivElement>(null);
  const deptRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (doctorRef.current && !doctorRef.current.contains(e.target as Node)) {
        setShowDoctorDd(false);
      }
      if (deptRef.current && !deptRef.current.contains(e.target as Node)) {
        setShowDeptDd(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ── Date validation ──────────────────────────────────────
  const handleDateFrom = (val: string) => {
    setDateFrom(val);
    setDateError(false);
    if (dateTo && val > dateTo) {
      setDateTo("");
      showToast("Start date cannot be after end date");
    }
  };

  const handleDateTo = (val: string) => {
    if (dateFrom && val < dateFrom) {
      showToast("End date cannot be before start date");
      return;
    }
    setDateTo(val);
    setDateError(false);
  };

  const validateDates = (): boolean => {
    if (!dateFrom || !dateTo) {
      setDateError(true);
      showToast("Please select a date range first");
      return false;
    }
    return true;
  };

  const noShowRate = Math.round(
    (appointmentStats.noShows /
      (appointmentStats.completed + appointmentStats.noShows)) *
      100,
  );

  const kpis = [
    {
      label: "Total Patients",
      value: "1,245",
      sub: "+12% this month",
      icon: <Users size={20} />,
      color: "#3b82f6",
      bg: "#eff6ff",
    },
    {
      label: "Total Revenue",
      value: `₱${financialSummary.totalRevenue.toLocaleString()}`,
      sub: "Monthly",
      icon: <DollarSign size={20} />,
      color: "#10b981",
      bg: "#f0fdf4",
    },
    {
      label: "Appointments Completed",
      value: appointmentStats.completed.toLocaleString(),
      sub: "This period",
      icon: <Calendar size={20} />,
      color: "#f59e0b",
      bg: "#fffbeb",
    },
    {
      label: "No-show Rate",
      value: `${noShowRate}%`,
      sub: `${appointmentStats.noShows} no-shows`,
      icon: <TrendingDown size={20} />,
      color: "#ef4444",
      bg: "#fef2f2",
    },
  ];

  return (
    <div className="rp-container">
      {toast && (
        <div className="rp-toast">
          <Check size={15} /> {toast}
        </div>
      )}

      <div className="rp-header">
        <h1 className="rp-title">Reports</h1>
        <p className="rp-subtitle">Analytics and business intelligence</p>
      </div>

      {/* TOP SECTION: KPIs + Report Builder */}
      <div className="rp-top-grid">
        <div className="rp-kpi-section">
          <p className="rp-section-label">KPI Overview</p>
          <div className="rp-kpi-grid">
            {kpis.map((k) => (
              <div
                key={k.label}
                className="rp-kpi-card"
                style={{ borderTop: `4px solid ${k.color}` }}
              >
                <div
                  className="rp-kpi-icon"
                  style={{ background: k.bg, color: k.color }}
                >
                  {k.icon}
                </div>
                <div>
                  <p className="rp-kpi-label">{k.label}</p>
                  <p className="rp-kpi-value" style={{ color: k.color }}>
                    {k.value}
                  </p>
                  <p className="rp-kpi-sub">{k.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Builder */}
        <div className="rp-builder-card">
          <p className="rp-section-label">Custom Report Builder</p>
          <div className="rp-builder-body">
            <div className="rp-builder-field">
              <label className="rp-builder-label">
                Date Range <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div className="rp-date-row">
                <input
                  className={`rp-input ${dateError && !dateFrom ? "rp-input--error" : ""}`}
                  type="date"
                  value={dateFrom}
                  onChange={(e) => handleDateFrom(e.target.value)}
                />
                <input
                  className={`rp-input ${dateError && !dateTo ? "rp-input--error" : ""}`}
                  type="date"
                  value={dateTo}
                  min={dateFrom}
                  onChange={(e) => handleDateTo(e.target.value)}
                />
              </div>
              {dateError && (
                <span className="rp-error-msg">
                  Both start and end dates are required
                </span>
              )}
            </div>

            <div className="rp-builder-field">
              <label className="rp-builder-label">Filter by Doctor</label>
              <div className="rp-filter-wrap" ref={doctorRef}>
                <div
                  className={`rp-filter ${doctorFilter !== "All" ? "active" : ""}`}
                  onClick={() => setShowDoctorDd(!showDoctorDd)}
                >
                  <Filter size={13} />
                  {doctorFilter}
                  <ChevronDown
                    size={13}
                    className={showDoctorDd ? "rotated" : ""}
                  />
                </div>
                {showDoctorDd && (
                  <div className="rp-dropdown">
                    {DOCTORS.map((d) => (
                      <div
                        key={d}
                        className={`rp-dropdown-item ${doctorFilter === d ? "selected" : ""}`}
                        onClick={() => {
                          setDoctorFilter(d);
                          setShowDoctorDd(false);
                        }}
                      >
                        {doctorFilter === d && <Check size={12} />} {d}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rp-builder-field">
              <label className="rp-builder-label">Filter by Department</label>
              <div className="rp-filter-wrap" ref={deptRef}>
                <div
                  className={`rp-filter ${deptFilter !== "All" ? "active" : ""}`}
                  onClick={() => setShowDeptDd(!showDeptDd)}
                >
                  <Filter size={13} />
                  {deptFilter}
                  <ChevronDown
                    size={13}
                    className={showDeptDd ? "rotated" : ""}
                  />
                </div>
                {showDeptDd && (
                  <div className="rp-dropdown">
                    {DEPARTMENTS.map((d) => (
                      <div
                        key={d}
                        className={`rp-dropdown-item ${deptFilter === d ? "selected" : ""}`}
                        onClick={() => {
                          setDeptFilter(d);
                          setShowDeptDd(false);
                        }}
                      >
                        {deptFilter === d && <Check size={12} />} {d}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rp-export-row">
              <button
                className="rp-export-btn rp-export-btn--pdf"
                onClick={() => {
                  if (!validateDates()) return;
                  exportPDF(doctorFilter, deptFilter, dateFrom, dateTo)
                    .then(() => showToast("PDF downloaded successfully"))
                    .catch(() => showToast("PDF export failed"));
                }}
              >
                <Download size={14} /> Export PDF
              </button>
              <button
                className="rp-export-btn rp-export-btn--print"
                onClick={() => {
                  if (!validateDates()) return;
                  printReport(doctorFilter, deptFilter, dateFrom, dateTo);
                  showToast("Printing...");
                }}
              >
                <Printer size={14} /> Print
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="rp-charts-wrapper">
        <div className="rp-charts-card-header">
          <BarChart2 size={16} /> Charts & Graphs
        </div>
        <div className="rp-charts-grid">
          <div className="rp-chart-card">
            <div className="rp-chart-title">
              <Activity size={15} /> Revenue Trend{" "}
              <span className="rp-chart-sub">(Last 6 months)</span>
            </div>
            <LineChart />
          </div>
          <div className="rp-chart-card">
            <div className="rp-chart-title">
              <BarChart2 size={15} /> Appointments by Doctor
            </div>
            <BarChart />
          </div>
          <div className="rp-chart-card rp-chart-card--pie">
            <div className="rp-chart-title">
              <PieChart size={15} /> Patient Demographics
            </div>
            <PieChartSVG />
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="rp-bottom-grid">
        <div className="rp-summary-card">
          <div className="rp-summary-header">
            <DollarSign size={16} /> Financial Summary
          </div>
          <div className="rp-summary-body">
            {[
              {
                label: "Total Revenue",
                value: `₱${financialSummary.totalRevenue.toLocaleString()}`,
                color: "#10b981",
              },
              {
                label: "Pending Payments",
                value: `₱${financialSummary.pendingPayments.toLocaleString()}`,
                color: "#f59e0b",
              },
              {
                label: "Overdue",
                value: `₱${financialSummary.overdue.toLocaleString()}`,
                color: "#ef4444",
              },
              {
                label: "Collection Rate",
                value: `${financialSummary.collectionRate}%`,
                color: "#3b82f6",
              },
            ].map((s) => (
              <div key={s.label} className="rp-summary-row">
                <span className="rp-summary-label">{s.label}</span>
                <span className="rp-summary-value" style={{ color: s.color }}>
                  {s.value}
                </span>
              </div>
            ))}
            <div className="rp-progress-wrap">
              <div className="rp-progress-label">
                <span>Collection Rate</span>
                <span>{financialSummary.collectionRate}%</span>
              </div>
              <div className="rp-progress-bar">
                <div
                  className="rp-progress-fill"
                  style={{
                    width: `${financialSummary.collectionRate}%`,
                    background: "#3b82f6",
                  }}
                />
              </div>
            </div>
            <div className="rp-last-item">
              <span className="rp-last-label">Last Payment</span>
              <span className="rp-last-value">John Doe · ₱4,500</span>
            </div>
          </div>
        </div>

        <div className="rp-summary-card">
          <div className="rp-summary-header">
            <Calendar size={16} /> Appointment Statistics
          </div>
          <div className="rp-summary-body">
            {[
              {
                label: "Completed",
                value: appointmentStats.completed.toLocaleString(),
                color: "#10b981",
              },
              {
                label: "No-shows",
                value: appointmentStats.noShows.toString(),
                color: "#ef4444",
              },
              {
                label: "Cancelled",
                value: appointmentStats.cancelled.toString(),
                color: "#f59e0b",
              },
              {
                label: "Avg. Duration",
                value: `${appointmentStats.avgDuration} mins`,
                color: "#3b82f6",
              },
            ].map((s) => (
              <div key={s.label} className="rp-summary-row">
                <span className="rp-summary-label">{s.label}</span>
                <span className="rp-summary-value" style={{ color: s.color }}>
                  {s.value}
                </span>
              </div>
            ))}
            <div className="rp-breakdown-bars">
              {[
                {
                  label: "Completed",
                  value: appointmentStats.completed,
                  color: "#10b981",
                },
                {
                  label: "No-shows",
                  value: appointmentStats.noShows,
                  color: "#ef4444",
                },
                {
                  label: "Cancelled",
                  value: appointmentStats.cancelled,
                  color: "#f59e0b",
                },
              ].map((b) => {
                const total =
                  appointmentStats.completed +
                  appointmentStats.noShows +
                  appointmentStats.cancelled;
                return (
                  <div key={b.label} className="rp-breakdown-row">
                    <span className="rp-breakdown-label">{b.label}</span>
                    <div className="rp-progress-bar rp-progress-bar--sm">
                      <div
                        className="rp-progress-fill"
                        style={{
                          width: `${Math.round((b.value / total) * 100)}%`,
                          background: b.color,
                        }}
                      />
                    </div>
                    <span className="rp-breakdown-pct">
                      {Math.round((b.value / total) * 100)}%
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="rp-last-item">
              <span className="rp-last-label">Last Appointment</span>
              <span className="rp-last-value">Jane Smith · Mar 23</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;