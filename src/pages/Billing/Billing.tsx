import * as React from "react";
import "./billing.css";

const Billing: React.FC = () => {
  return (
    <>
      {/* Header */}
      <div className="billing-header">
        <h1 className="billing-title">Billing & Invoicing</h1>
        <p className="billing-subtitle">
          Manage patient billing and generate invoices
        </p>
      </div>
    </>
  );
};

export default Billing;
