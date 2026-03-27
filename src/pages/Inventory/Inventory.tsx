import * as React from "react";

import {
  Search,
  Plus,
  X,
  Check,
  ChevronDown,
  AlertTriangle,
  Package,
  List,
  LayoutGrid,
  Download,
  Printer,
  Edit2,
  Minus,
  History,
  RefreshCw,
  Filter,
} from "lucide-react";
import "./Inventory.css";

// ── Types ──────────────────────────────────────────────────
type ItemStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Expired";
type ViewMode = "list" | "card";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  expiryDate: string;
  supplier: string;
  status: ItemStatus;
  reorderLevel: number;
}

interface AuditLog {
  id: string;
  itemId: string;
  itemName: string;
  action: "Added" | "Removed" | "Adjusted";
  quantity: number;
  date: string;
  note: string;
}

// ── Mock Data ──────────────────────────────────────────────
const CATEGORIES = [
  "Medication",
  "Supplies",
  "Equipment",
  "PPE",
  "Lab Reagents",
];
const SUPPLIERS = [
  "MedSupply Co.",
  "PharmaDist Inc.",
  "HealthCare Supplies",
  "MedEquip PH",
  "BioLab Corp.",
];
const UNITS = ["pcs", "boxes", "vials", "bottles", "packs", "rolls", "sets"];

const initialItems: InventoryItem[] = [
  {
    id: "INV-001",
    name: "Paracetamol 500mg",
    category: "Medication",
    quantity: 500,
    unit: "pcs",
    unitPrice: 5,
    expiryDate: "2026-12-01",
    supplier: "PharmaDist Inc.",
    status: "In Stock",
    reorderLevel: 100,
  },
  {
    id: "INV-002",
    name: "Surgical Gloves (M)",
    category: "PPE",
    quantity: 30,
    unit: "boxes",
    unitPrice: 250,
    expiryDate: "2026-06-01",
    supplier: "MedSupply Co.",
    status: "Low Stock",
    reorderLevel: 50,
  },
  {
    id: "INV-003",
    name: "Disposable Syringes",
    category: "Supplies",
    quantity: 0,
    unit: "pcs",
    unitPrice: 12,
    expiryDate: "2025-03-01",
    supplier: "HealthCare Supplies",
    status: "Expired",
    reorderLevel: 200,
  },
  {
    id: "INV-004",
    name: "Amoxicillin 500mg",
    category: "Medication",
    quantity: 0,
    unit: "pcs",
    unitPrice: 8,
    expiryDate: "2026-09-01",
    supplier: "PharmaDist Inc.",
    status: "Out of Stock",
    reorderLevel: 150,
  },
  {
    id: "INV-005",
    name: "N95 Face Masks",
    category: "PPE",
    quantity: 200,
    unit: "pcs",
    unitPrice: 35,
    expiryDate: "2026-05-01",
    supplier: "MedSupply Co.",
    status: "In Stock",
    reorderLevel: 50,
  },
  {
    id: "INV-006",
    name: "Blood Glucose Test Strips",
    category: "Lab Reagents",
    quantity: 45,
    unit: "pcs",
    unitPrice: 15,
    expiryDate: "2026-04-01",
    supplier: "BioLab Corp.",
    status: "Low Stock",
    reorderLevel: 100,
  },
  {
    id: "INV-007",
    name: "Alcohol 70% (500ml)",
    category: "Supplies",
    quantity: 80,
    unit: "bottles",
    unitPrice: 60,
    expiryDate: "2027-08-01",
    supplier: "HealthCare Supplies",
    status: "In Stock",
    reorderLevel: 20,
  },
  {
    id: "INV-008",
    name: "Digital Thermometer",
    category: "Equipment",
    quantity: 15,
    unit: "pcs",
    unitPrice: 350,
    expiryDate: "N/A",
    supplier: "MedEquip PH",
    status: "In Stock",
    reorderLevel: 5,
  },
  {
    id: "INV-009",
    name: "Metformin 500mg",
    category: "Medication",
    quantity: 0,
    unit: "pcs",
    unitPrice: 7,
    expiryDate: "2025-01-01",
    supplier: "PharmaDist Inc.",
    status: "Expired",
    reorderLevel: 200,
  },
  {
    id: "INV-010",
    name: "Cotton Balls",
    category: "Supplies",
    quantity: 120,
    unit: "packs",
    unitPrice: 25,
    expiryDate: "N/A",
    supplier: "HealthCare Supplies",
    status: "In Stock",
    reorderLevel: 30,
  },
];

const initialLogs: AuditLog[] = [
  {
    id: "LOG-001",
    itemId: "INV-001",
    itemName: "Paracetamol 500mg",
    action: "Added",
    quantity: 500,
    date: "2026-03-22",
    note: "Initial stock",
  },
  {
    id: "LOG-002",
    itemId: "INV-002",
    itemName: "Surgical Gloves (M)",
    action: "Removed",
    quantity: 20,
    date: "2026-03-22",
    note: "Used in ward",
  },
  {
    id: "LOG-003",
    itemId: "INV-005",
    itemName: "N95 Face Masks",
    action: "Added",
    quantity: 100,
    date: "2026-03-23",
    note: "Reorder received",
  },
];

declare global {
  interface Window {
    jspdf?: {
      jsPDF: new (options?: {
        orientation?: string;
        unit?: string;
        format?: string;
      }) => {
        internal: {
          pageSize: {
            getWidth: () => number;
            getHeight: () => number;
          };
        };
        setPage: (page: number) => void;
        setFontSize: (size: number) => void;
        setFont: (font: string, style?: string) => void;
        setTextColor: (r: number, g: number, b: number) => void;
        setFillColor: (r: number, g: number, b: number) => void;
        rect: (
          x: number,
          y: number,
          w: number,
          h: number,
          style?: string,
        ) => void;
        text: (
          text: string,
          x: number,
          y: number,
          options?: { align?: string },
        ) => void;
        save: (filename: string) => void;
        addPage: () => void;
        getNumberOfPages: () => number;
      };
    };
  }
}

// ── PDF Download Helper (CDN + safe typing) ────
const downloadInventoryPDF = async (items: InventoryItem[]) => {
  const { jsPDF } = await import("jspdf");
  const html2canvas = (await import("html2canvas")).default;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 32px; color:#0f172a; background: white;">
      <h1 style="font-size:22px;margin-bottom:4px;">Inventory Report</h1>
      <p style="color:#64748b;font-size:13px;margin-bottom:24px;">
        Generated ${new Date().toLocaleDateString()} · ${items.length} items
      </p>
      <table style="width:100%;border-collapse:collapse;margin-top:12px;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="padding:10px 12px;font-size:11px;color:#64748b;text-align:left;border-bottom:2px solid #e2e8f0;text-transform:uppercase;">ID</th>
            <th style="padding:10px 12px;font-size:11px;color:#64748b;text-align:left;border-bottom:2px solid #e2e8f0;text-transform:uppercase;">Item</th>
            <th style="padding:10px 12px;font-size:11px;color:#64748b;text-align:left;border-bottom:2px solid #e2e8f0;text-transform:uppercase;">Category</th>
            <th style="padding:10px 12px;font-size:11px;color:#64748b;text-align:left;border-bottom:2px solid #e2e8f0;text-transform:uppercase;">Qty</th>
            <th style="padding:10px 12px;font-size:11px;color:#64748b;text-align:left;border-bottom:2px solid #e2e8f0;text-transform:uppercase;">Unit Price</th>
            <th style="padding:10px 12px;font-size:11px;color:#64748b;text-align:left;border-bottom:2px solid #e2e8f0;text-transform:uppercase;">Expiry</th>
            <th style="padding:10px 12px;font-size:11px;color:#64748b;text-align:left;border-bottom:2px solid #e2e8f0;text-transform:uppercase;">Supplier</th>
            <th style="padding:10px 12px;font-size:11px;color:#64748b;text-align:left;border-bottom:2px solid #e2e8f0;text-transform:uppercase;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (i) => `
            <tr>
              <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">${i.id}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">${i.name}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">${i.category}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">${i.quantity} ${i.unit}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">&#8369;${i.unitPrice.toLocaleString()}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">${i.expiryDate}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">${i.supplier}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">
                <span style="display:inline-block;padding:2px 10px;border-radius:999px;font-size:11px;font-weight:700;
                  ${i.status === "In Stock" ? "background:#d1fae5;color:#047857;" : ""}
                  ${i.status === "Low Stock" ? "background:#fef3c7;color:#b45309;" : ""}
                  ${i.status === "Out of Stock" ? "background:#fee2e2;color:#b91c1c;" : ""}
                  ${i.status === "Expired" ? "background:#fce7f3;color:#9d174d;" : ""}
                ">${i.status}</span>
              </td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
      <div style="margin-top:32px;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px;">
        Clinic Management System · Inventory Report
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

    pdf.save(`inventory_${new Date().toISOString().slice(0, 10)}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
};

// PRINT INVENTORY
const printInventoryPDF = (items: InventoryItem[]) => {
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(`<html><head><title>Inventory Report</title>
  <style>
    body{font-family:Arial,sans-serif;padding:32px;color:#0f172a}
    h1{font-size:22px;margin-bottom:4px}.sub{color:#64748b;font-size:13px;margin-bottom:24px}
    table{width:100%;border-collapse:collapse;margin-top:12px}
    th{background:#f8fafc;padding:10px 12px;font-size:11px;color:#64748b;text-align:left;border-bottom:2px solid #e2e8f0;text-transform:uppercase}
    td{padding:10px 12px;font-size:13px;border-bottom:1px solid #f1f5f9}
    .badge{display:inline-block;padding:2px 10px;border-radius:999px;font-size:11px;font-weight:700}
    .in-stock{background:#d1fae5;color:#047857}.low-stock{background:#fef3c7;color:#b45309}
    .out-of-stock{background:#fee2e2;color:#b91c1c}.expired{background:#fce7f3;color:#9d174d}
    .footer{margin-top:32px;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px}
  </style></head><body>
  <h1>Inventory Report</h1>
  <p class="sub">Generated ${new Date().toLocaleDateString()} · ${items.length} items</p>
  <table><thead><tr><th>ID</th><th>Item</th><th>Category</th><th>Qty</th><th>Unit Price</th><th>Expiry</th><th>Supplier</th><th>Status</th></tr></thead>
  <tbody>${items.map((i) => `<tr><td>${i.id}</td><td>${i.name}</td><td>${i.category}</td><td>${i.quantity} ${i.unit}</td><td>₱${i.unitPrice}</td><td>${i.expiryDate}</td><td>${i.supplier}</td><td><span class="badge ${i.status.toLowerCase().replace(/ /g, "-")}">${i.status}</span></td></tr>`).join("")}</tbody>
  </table>
  <div class="footer">Clinic Management System · Inventory Report</div>
  </body></html>`);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 400);
};

const downloadInventoryCSV = (items: InventoryItem[]) => {
  const rows = [
    ["Inventory Report"],
    [`Generated: ${new Date().toLocaleDateString()}`],
    [],
    [
      "ID",
      "Item Name",
      "Category",
      "Quantity",
      "Unit",
      "Unit Price",
      "Expiry Date",
      "Supplier",
      "Status",
    ],
    ...items.map((i) => [
      i.id,
      i.name,
      i.category,
      i.quantity.toString(),
      i.unit,
      `₱${i.unitPrice}`,
      i.expiryDate,
      i.supplier,
      i.status,
    ]),
  ];
  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `inventory_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ── Helpers ────────────────────────────────────────────────
const getStatusColor = (status: ItemStatus): string => {
  if (status === "In Stock") return "#10b981";
  if (status === "Low Stock") return "#f59e0b";
  if (status === "Out of Stock") return "#ef4444";
  return "#ec4899";
};

const computeStatus = (
  quantity: number,
  expiryDate: string,
  reorderLevel: number,
): ItemStatus => {
  const expDate = expiryDate !== "N/A" ? new Date(expiryDate) : null;
  if (expDate && expDate < new Date()) return "Expired";
  if (quantity === 0) return "Out of Stock";
  if (quantity <= reorderLevel) return "Low Stock";
  return "In Stock";
};

// ── Add/Edit Item Modal ────────────────────────────────────
interface ItemModalProps {
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
  editData?: InventoryItem | null;
  count: number;
}

const ItemModal: React.FC<ItemModalProps> = ({
  onClose,
  onSave,
  editData,
  count,
}) => {
  const [form, setForm] = React.useState({
    name: editData?.name ?? "",
    category: editData?.category ?? CATEGORIES[0],
    quantity: editData?.quantity?.toString() ?? "",
    unit: editData?.unit ?? UNITS[0],
    unitPrice: editData?.unitPrice?.toString() ?? "",
    expiryDate: editData?.expiryDate ?? "",
    supplier: editData?.supplier ?? SUPPLIERS[0],
    reorderLevel: editData?.reorderLevel?.toString() ?? "50",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const set = (f: string, v: string) => {
    setForm((p) => ({ ...p, [f]: v }));
    setErrors((e) => {
      const n = { ...e };
      delete n[f];
      return n;
    });
  };

  const handleSubmit = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name required";
    if (!form.quantity || isNaN(Number(form.quantity)))
      e.quantity = "Valid qty required";
    if (!form.unitPrice || isNaN(Number(form.unitPrice)))
      e.unitPrice = "Valid price required";
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    const qty = Number(form.quantity),
      reorder = Number(form.reorderLevel) || 50;
    onSave({
      id: editData?.id ?? `INV-${String(count + 1).padStart(3, "0")}`,
      name: form.name,
      category: form.category,
      quantity: qty,
      unit: form.unit,
      unitPrice: Number(form.unitPrice),
      expiryDate: form.expiryDate || "N/A",
      supplier: form.supplier,
      status: computeStatus(qty, form.expiryDate || "N/A", reorder),
      reorderLevel: reorder,
    });
  };

  return (
    <div className="inv-modal-overlay" onClick={onClose}>
      <div className="inv-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="inv-modal-header">
          <div>
            <h2 className="inv-modal-title">
              {editData ? "Edit Item" : "Add New Item"}
            </h2>
            <p className="inv-modal-subtitle">
              {editData ? "Update item details" : "Add a new inventory item"}
            </p>
          </div>
          <button className="inv-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="inv-modal-body">
          <div className="inv-modal-row">
            <div className="inv-field">
              <label className="inv-label">
                Item Name <span className="inv-req">*</span>
              </label>
              <input
                className={`inv-input ${errors.name ? "error" : ""}`}
                placeholder="e.g. Paracetamol 500mg"
                value={form.name}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "" || /^[a-zA-Z0-9\s()%.,/-]*$/.test(v))
                    set("name", v);
                }}
              />
              {errors.name && <span className="inv-error">{errors.name}</span>}
            </div>
            <div className="inv-field">
              <label className="inv-label">Category</label>
              <div className="inv-select-wrap">
                <select
                  className="inv-select"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="inv-select-icon" />
              </div>
            </div>
          </div>
          <div className="inv-modal-row">
            <div className="inv-field">
              <label className="inv-label">
                Quantity <span className="inv-req">*</span>
              </label>
              <input
                className={`inv-input ${errors.quantity ? "error" : ""}`}
                type="number"
                min="0"
                placeholder="0"
                value={form.quantity}
                onChange={(e) =>
                  set(
                    "quantity",
                    Math.max(0, Number(e.target.value)).toString(),
                  )
                }
              />
              {errors.quantity && (
                <span className="inv-error">{errors.quantity}</span>
              )}
            </div>
            <div className="inv-field">
              <label className="inv-label">Unit</label>
              <div className="inv-select-wrap">
                <select
                  className="inv-select"
                  value={form.unit}
                  onChange={(e) => set("unit", e.target.value)}
                >
                  {UNITS.map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="inv-select-icon" />
              </div>
            </div>
          </div>
          <div className="inv-modal-row">
            <div className="inv-field">
              <label className="inv-label">
                Unit Price (₱) <span className="inv-req">*</span>
              </label>
              <input
                className={`inv-input ${errors.unitPrice ? "error" : ""}`}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.unitPrice}
                onChange={(e) =>
                  set(
                    "unitPrice",
                    Math.max(0, Number(e.target.value)).toString(),
                  )
                }
              />
              {errors.unitPrice && (
                <span className="inv-error">{errors.unitPrice}</span>
              )}
            </div>
            <div className="inv-field">
              <label className="inv-label">
                Expiry Date{" "}
                <span className="inv-opt">(or leave blank if N/A)</span>
              </label>
              <input
                className="inv-input"
                type="date"
                value={form.expiryDate}
                onChange={(e) => set("expiryDate", e.target.value)}
              />
            </div>
          </div>
          <div className="inv-modal-row">
            <div className="inv-field">
              <label className="inv-label">Supplier</label>
              <div className="inv-select-wrap">
                <select
                  className="inv-select"
                  value={form.supplier}
                  onChange={(e) => set("supplier", e.target.value)}
                >
                  {SUPPLIERS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="inv-select-icon" />
              </div>
            </div>
            <div className="inv-field">
              <label className="inv-label">Reorder Level</label>
              <input
                className="inv-input"
                type="number"
                min="0"
                placeholder="50"
                value={form.reorderLevel}
                onChange={(e) =>
                  set(
                    "reorderLevel",
                    Math.max(0, Number(e.target.value)).toString(),
                  )
                }
              />
            </div>
          </div>
        </div>
        <div className="inv-modal-footer">
          <button className="inv-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="inv-btn-save" onClick={handleSubmit}>
            <Package size={14} /> {editData ? "Save Changes" : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Adjust Stock Modal ─────────────────────────────────────
interface AdjustModalProps {
  item: InventoryItem;
  onClose: () => void;
  onAdjust: (id: string, delta: number, note: string) => void;
}

const AdjustModal: React.FC<AdjustModalProps> = ({
  item,
  onClose,
  onAdjust,
}) => {
  const [mode, setMode] = React.useState<"add" | "remove">("add");
  const [qty, setQty] = React.useState("");
  const [note, setNote] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = () => {
    if (!qty || isNaN(Number(qty)) || Number(qty) <= 0) {
      setError("Enter a valid quantity");
      return;
    }
    if (mode === "remove" && Number(qty) > item.quantity) {
      setError("Cannot remove more than current stock");
      return;
    }
    onAdjust(
      item.id,
      mode === "add" ? Number(qty) : -Number(qty),
      note || `Manual ${mode}`,
    );
  };

  return (
    <div className="inv-modal-overlay" onClick={onClose}>
      <div
        className="inv-modal-box inv-modal-box--sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="inv-modal-header">
          <div>
            <h2 className="inv-modal-title">Adjust Stock</h2>
            <p className="inv-modal-subtitle">
              {item.name} · Current: {item.quantity} {item.unit}
            </p>
          </div>
          <button className="inv-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="inv-modal-body">
          <div className="inv-field">
            <label className="inv-label">
              Quantity <span className="inv-req">*</span>
            </label>
            <input
              className={`inv-input ${error ? "error" : ""}`}
              type="number"
              min="1"
              placeholder="0"
              value={qty}
              onChange={(e) => {
                setQty(Math.max(0, Number(e.target.value)).toString());
                setError("");
              }}
            />
            {error && <span className="inv-error">{error}</span>}
          </div>
          <div className="inv-field">
            <label className="inv-label">
              Note <span className="inv-opt">(optional)</span>
            </label>
            <input
              className="inv-input"
              placeholder="Reason for adjustment..."
              value={note}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || /^[a-zA-Z0-9\s.,'-]*$/.test(v)) setNote(v);
              }}
            />
          </div>
          {qty && !error && (
            <div className="inv-preview">
              New quantity:{" "}
              <strong>
                {mode === "add"
                  ? item.quantity + Number(qty)
                  : item.quantity - Number(qty)}{" "}
                {item.unit}
              </strong>
            </div>
          )}
          <div className="inv-mode-toggle">
            <button
              className={`inv-mode-btn ${mode === "add" ? "active-add" : ""}`}
              onClick={() => setMode("add")}
            >
              <Plus size={14} /> Add Stock
            </button>
            <button
              className={`inv-mode-btn ${mode === "remove" ? "active-remove" : ""}`}
              onClick={() => setMode("remove")}
            >
              <Minus size={14} /> Remove Stock
            </button>
          </div>
        </div>
        <div className="inv-modal-footer">
          <button className="inv-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`inv-btn-save ${mode === "remove" ? "inv-btn-danger" : ""}`}
            onClick={handleSubmit}
          >
            {mode === "add" ? <Plus size={14} /> : <Minus size={14} />}{" "}
            {mode === "add" ? "Add Stock" : "Remove Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────
const Inventory: React.FC = () => {
  const [items, setItems] = React.useState<InventoryItem[]>(initialItems);
  const [logs, setLogs] = React.useState<AuditLog[]>(initialLogs);
  const [viewMode, setViewMode] = React.useState<ViewMode>("list");
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"All" | ItemStatus>(
    "All",
  );
  const [expiryFilter, setExpiryFilter] = React.useState<string>("All");
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editItem, setEditItem] = React.useState<InventoryItem | null>(null);
  const [adjustItem, setAdjustItem] = React.useState<InventoryItem | null>(
    null,
  );
  const [showLogs, setShowLogs] = React.useState(false);
  const [logSearch, setLogSearch] = React.useState("");
  const [toast, setToast] = React.useState<string | null>(null);
  const [showExpiryDropdown, setShowExpiryDropdown] = React.useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = React.useState(false);
  const [showExportDropdown, setShowExportDropdown] = React.useState(false);
  const exportRef = React.useRef<HTMLDivElement>(null);
  const statusRef = React.useRef<HTMLDivElement>(null);
  const expiryRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node))
        setShowStatusDropdown(false);
      if (expiryRef.current && !expiryRef.current.contains(e.target as Node))
        setShowExpiryDropdown(false);
      if (exportRef.current && !exportRef.current.contains(e.target as Node))
        setShowExportDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const stats = {
    total: items.length,
    inStock: items.filter((i) => i.status === "In Stock").length,
    lowStock: items.filter((i) => i.status === "Low Stock").length,
    expired: items.filter((i) => i.status === "Expired").length,
    outOfStock: items.filter((i) => i.status === "Out of Stock").length,
  };

  const filtered = items.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || item.status === statusFilter;

    // Fix the expiry filter logic
    let matchExpiry = true;
    if (expiryFilter === "Expired") {
      matchExpiry = item.status === "Expired";
    } else if (expiryFilter === "Expiring Soon") {
      if (item.expiryDate !== "N/A" && item.status !== "Expired") {
        try {
          const exp = parseExpiry(item.expiryDate);
          if (exp) {
            const next90Days = new Date();
            next90Days.setDate(next90Days.getDate() + 90);
            matchExpiry = exp < next90Days;
          } else {
            matchExpiry = false;
          }
        } catch (error) {
          console.error("Error in expiry filter:", error);
          matchExpiry = false;
        }
      } else {
        matchExpiry = false;
      }
    }

    return matchSearch && matchStatus && matchExpiry;
  });

  const handleSaveItem = (item: InventoryItem) => {
    if (editItem) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
      showToast("Item updated");
    } else {
      setItems((prev) => [...prev, item]);
      showToast(`${item.name} added to inventory`);
    }
    setShowAddModal(false);
    setEditItem(null);
  };

  const parseExpiry = (dateStr: string): Date | null => {
    if (!dateStr || dateStr === "N/A") return null;

    try {
      // Try ISO format (YYYY-MM-DD)
      const isoDate = new Date(dateStr);
      if (!isNaN(isoDate.getTime())) {
        return isoDate;
      }

      // Try month year format (e.g., "Dec 2026")
      const parts = dateStr.split(" ");
      if (parts.length === 2) {
        const [month, year] = parts;
        const parsed = new Date(`${month} 1, ${year}`);
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }
      }

      // Try parsing as a regular date string
      const fallbackDate = new Date(dateStr);
      if (!isNaN(fallbackDate.getTime())) {
        return fallbackDate;
      }

      console.warn(`Unable to parse date: ${dateStr}`);
      return null;
    } catch (error) {
      console.error(`Error parsing date "${dateStr}":`, error);
      return null;
    }
  };

  const handleAdjust = (id: string, delta: number, note: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const newQty = item.quantity + delta;
    const newStatus = computeStatus(newQty, item.expiryDate, item.reorderLevel);

    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: newQty, status: newStatus } : i,
      ),
    );

    const newLog: AuditLog = {
      id: `LOG-${String(logs.length + 1).padStart(3, "0")}`,
      itemId: id,
      itemName: item.name,
      action: delta > 0 ? "Added" : "Removed",
      quantity: Math.abs(delta),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      note,
    };
    setLogs((prev) => [newLog, ...prev]);

    setAdjustItem(null);
    showToast(
      `Stock ${delta > 0 ? "added" : "removed"}: ${Math.abs(delta)} ${item.unit}`,
    );
  };

  const EXPIRY_OPTIONS = ["All", "Expiring Soon", "Expired"];
  const STATUS_OPTIONS: ("All" | ItemStatus)[] = [
    "All",
    "In Stock",
    "Low Stock",
    "Out of Stock",
    "Expired",
  ];

  return (
    <div className="inv-container">
      {toast && (
        <div className="inv-toast">
          <Check size={15} /> {toast}
        </div>
      )}

      <div className="inv-header">
        <h1 className="inv-title">Inventory</h1>
        <p className="inv-subtitle">Track medical supplies and medications</p>
      </div>

      {/* Stat Cards */}
      <div className="inv-stat-cards">
        {[
          {
            label: "Total Items",
            value: stats.total,
            color: "#3b82f6",
            border: "#3b82f6",
            icon: <Package size={18} />,
          },
          {
            label: "In Stock",
            value: stats.inStock,
            color: "#10b981",
            border: "#10b981",
            icon: <Check size={18} />,
          },
          {
            label: "Low Stock",
            value: stats.lowStock,
            color: "#f59e0b",
            border: "#f59e0b",
            icon: <AlertTriangle size={18} />,
          },
          {
            label: "Expired",
            value: stats.expired,
            color: "#ec4899",
            border: "#ec4899",
            icon: <X size={18} />,
          },
          {
            label: "Out of Stock",
            value: stats.outOfStock,
            color: "#ef4444",
            border: "#ef4444",
            icon: <Package size={18} />,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="inv-stat-card"
            style={{ borderTop: `4px solid ${s.border}` }}
          >
            <div
              className="inv-stat-card-icon"
              style={{ background: s.color + "18", color: s.color }}
            >
              {s.icon}
            </div>
            <div className="inv-stat-card-info">
              <span className="inv-stat-card-label">{s.label}</span>
              <span className="inv-stat-card-value" style={{ color: s.color }}>
                {s.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Inventory Management Card */}
      <div className="inv-card">
        {/* Toolbar */}
        <div className="inv-toolbar">
          <div className="inv-toolbar-left">
            <div className="inv-view-toggle">
              <button
                className={`inv-view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <List size={15} /> List
              </button>
              <button
                className={`inv-view-btn ${viewMode === "card" ? "active" : ""}`}
                onClick={() => setViewMode("card")}
              >
                <LayoutGrid size={15} /> Cards
              </button>
            </div>
            <div className="inv-search">
              <Search size={15} className="inv-search-icon" />
              <input
                className="inv-search-input"
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Status Filter */}
            <div className="inv-filter-wrap" ref={statusRef}>
              <div
                className={`inv-filter ${statusFilter !== "All" ? "active" : ""}`}
                onClick={() => {
                  setShowStatusDropdown((p) => !p);
                  setShowExpiryDropdown(false);
                }}
              >
                <Filter size={13} />
                {statusFilter === "All" ? "Status" : statusFilter}
                <ChevronDown
                  size={13}
                  className={showStatusDropdown ? "rotated" : ""}
                />
              </div>
              {showStatusDropdown && (
                <div className="inv-dropdown">
                  {STATUS_OPTIONS.map((o) => (
                    <div
                      key={o}
                      className={`inv-dropdown-item ${statusFilter === o ? "selected" : ""}`}
                      onClick={() => {
                        setStatusFilter(o);
                        setShowStatusDropdown(false);
                      }}
                    >
                      {statusFilter === o && <Check size={12} />} {o}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Expiry Filter */}
            <div className="inv-filter-wrap" ref={expiryRef}>
              <div
                className={`inv-filter ${expiryFilter !== "All" ? "active" : ""}`}
                onClick={() => {
                  setShowExpiryDropdown((p) => !p);
                  setShowStatusDropdown(false);
                }}
              >
                <Filter size={13} />
                {expiryFilter === "All" ? "Expiry" : expiryFilter}
                <ChevronDown
                  size={13}
                  className={showExpiryDropdown ? "rotated" : ""}
                />
              </div>
              {showExpiryDropdown && (
                <div className="inv-dropdown">
                  {EXPIRY_OPTIONS.map((o) => (
                    <div
                      key={o}
                      className={`inv-dropdown-item ${expiryFilter === o ? "selected" : ""}`}
                      onClick={() => {
                        setExpiryFilter(o);
                        setShowExpiryDropdown(false);
                      }}
                    >
                      {expiryFilter === o && <Check size={12} />} {o}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="inv-toolbar-right">
            <button
              className="inv-btn-outline"
              onClick={() => setShowLogs((p) => !p)}
            >
              <History size={14} /> {showLogs ? "Hide Log" : "Audit Log"}
            </button>
            {/* Export Dropdown */}
            <div className="inv-filter-wrap" ref={exportRef}>
              <button
                className="inv-btn-outline"
                onClick={() => setShowExportDropdown((p) => !p)}
              >
                <Download size={14} /> Export{" "}
                <ChevronDown
                  size={13}
                  className={showExportDropdown ? "rotated" : ""}
                />
              </button>
              {showExportDropdown && (
                <div className="inv-dropdown inv-dropdown--right">
                  <div
                    className="inv-dropdown-item"
                    onClick={() => {
                      downloadInventoryPDF(filtered)
                        .then(() => showToast("PDF downloaded"))
                        .catch(() => showToast("PDF download failed"));
                      setShowExportDropdown(false);
                    }}
                  >
                    <Download size={13} /> Download PDF
                  </div>
                  <div
                    className="inv-dropdown-item"
                    onClick={() => {
                      downloadInventoryCSV(filtered);
                      setShowExportDropdown(false);
                    }}
                  >
                    <Download size={13} /> Download CSV
                  </div>
                  <div className="inv-dropdown-divider" />
                  <div
                    className="inv-dropdown-item"
                    onClick={() => {
                      printInventoryPDF(filtered);
                      setShowExportDropdown(false);
                    }}
                  >
                    <Printer size={13} /> Print
                  </div>
                </div>
              )}
            </div>
            <button
              className="inv-btn-primary"
              onClick={() => {
                setEditItem(null);
                setShowAddModal(true);
              }}
            >
              <Plus size={15} /> Add New Item
            </button>
          </div>
        </div>

        {/* ALERT BANNER */}
        {items.some(
          (i) =>
            i.status === "Low Stock" ||
            i.status === "Expired" ||
            i.status === "Out of Stock",
        ) && (
          <div className="inv-alert-banner">
            <AlertTriangle size={16} />
            <span>
              <strong>{stats.lowStock} low stock</strong>,{" "}
              <strong>{stats.expired} expired</strong>,{" "}
              <strong>{stats.outOfStock} out of stock</strong> items need
              attention.
            </span>
          </div>
        )}

        {/* LIST VIEW */}
        {viewMode === "list" && (
          <div className="inv-table-scroll">
            <table className="inv-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Expiry</th>
                  <th>Supplier</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="inv-table-empty">
                      No items found
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id} className="inv-table-row">
                      <td>
                        <span className="inv-id-badge">{item.id}</span>
                      </td>
                      <td>
                        <span className="inv-item-name">{item.name}</span>
                      </td>
                      <td>
                        <span className="inv-category-tag">
                          {item.category}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            item.quantity <= item.reorderLevel &&
                            item.quantity > 0
                              ? "inv-qty-warn"
                              : item.quantity === 0
                                ? "inv-qty-zero"
                                : "inv-qty"
                          }
                        >
                          {item.quantity} {item.unit}
                        </span>
                      </td>
                      <td>₱{item.unitPrice}</td>
                      <td
                        className={
                          item.status === "Expired" ? "inv-expired-date" : ""
                        }
                      >
                        {item.expiryDate}
                      </td>
                      <td className="inv-supplier-cell">{item.supplier}</td>
                      <td>
                        <span
                          className="inv-status-badge"
                          style={{
                            background: getStatusColor(item.status) + "20",
                            color: getStatusColor(item.status),
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <div className="inv-actions">
                          <button
                            className="inv-icon-btn"
                            title="Edit"
                            onClick={() => {
                              setEditItem(item);
                              setShowAddModal(true);
                            }}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            className="inv-icon-btn inv-icon-btn--adjust"
                            title="Adjust Stock"
                            onClick={() => setAdjustItem(item)}
                          >
                            <RefreshCw size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* CARD VIEW */}
        {viewMode === "card" && (
          <div className="inv-card-grid">
            {filtered.length === 0 ? (
              <div className="inv-table-empty">No items found</div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  className="inv-item-card"
                  style={{
                    borderTop: `4px solid ${getStatusColor(item.status)}`,
                  }}
                >
                  <div className="inv-item-card-header">
                    <div>
                      <p className="inv-item-card-name">{item.name}</p>
                      <p className="inv-item-card-cat">{item.category}</p>
                    </div>
                    <span
                      className="inv-status-badge"
                      style={{
                        background: getStatusColor(item.status) + "20",
                        color: getStatusColor(item.status),
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="inv-item-card-body">
                    <div className="inv-item-card-row">
                      <span>Quantity</span>
                      <span className="inv-item-card-val">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                    <div className="inv-item-card-row">
                      <span>Unit Price</span>
                      <span className="inv-item-card-val">
                        ₱{item.unitPrice}
                      </span>
                    </div>
                    <div className="inv-item-card-row">
                      <span>Expiry</span>
                      <span
                        className={
                          item.status === "Expired"
                            ? "inv-expired-date inv-item-card-val"
                            : "inv-item-card-val"
                        }
                      >
                        {item.expiryDate}
                      </span>
                    </div>
                    <div className="inv-item-card-row">
                      <span>Supplier</span>
                      <span className="inv-item-card-val">{item.supplier}</span>
                    </div>
                  </div>
                  <div className="inv-item-card-footer">
                    <button
                      className="inv-card-btn"
                      onClick={() => {
                        setEditItem(item);
                        setShowAddModal(true);
                      }}
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      className="inv-card-btn inv-card-btn--primary"
                      onClick={() => setAdjustItem(item)}
                    >
                      <RefreshCw size={13} /> Adjust
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Audit Log Card - Separate Card */}
      {showLogs && (
        <div className="inv-card inv-audit-card">
          <div className="inv-audit-header">
            <div className="inv-audit-title">
              <History size={15} /> Inventory Audit Log
            </div>
            <div className="inv-audit-search">
              <Search size={14} className="inv-audit-search-icon" />
              <input
                className="inv-audit-search-input"
                placeholder="Search logs..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="inv-table-scroll">
            <table className="inv-table">
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>Item</th>
                  <th>Action</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {logs
                  .filter(
                    (l) =>
                      l.itemName
                        .toLowerCase()
                        .includes(logSearch.toLowerCase()) ||
                      l.id.toLowerCase().includes(logSearch.toLowerCase()) ||
                      l.note.toLowerCase().includes(logSearch.toLowerCase()) ||
                      l.action.toLowerCase().includes(logSearch.toLowerCase()),
                  )
                  .map((log) => (
                    <tr key={log.id} className="inv-table-row">
                      <td>
                        <span className="inv-id-badge">{log.id}</span>
                      </td>
                      <td>{log.itemName}</td>
                      <td>
                        <span
                          className={`inv-action-badge inv-action--${log.action.toLowerCase()}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td>{log.quantity}</td>
                      <td>{log.date}</td>
                      <td>{log.note}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(showAddModal || editItem) && (
        <ItemModal
          onClose={() => {
            setShowAddModal(false);
            setEditItem(null);
          }}
          onSave={handleSaveItem}
          editData={editItem}
          count={items.length}
        />
      )}
      {adjustItem && (
        <AdjustModal
          item={adjustItem}
          onClose={() => setAdjustItem(null)}
          onAdjust={handleAdjust}
        />
      )}
    </div>
  );
};

export default Inventory;
