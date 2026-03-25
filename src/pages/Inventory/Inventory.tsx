import * as React from "react";
import "./inventory.css";

const Inventory: React.FC = () => {
  return (
    <>
      {/* Header */}
      <div className="inventory-header">
        <h1 className="inventory-title">Inventory Management</h1>
        <p className="eprescribing-subtitle">
          Track medical supplies and medications
        </p>
      </div>
    </>
  );
};

export default Inventory;
