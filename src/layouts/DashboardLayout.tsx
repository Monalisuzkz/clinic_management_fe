import * as React from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <aside style={{ width: "280px", flexShrink: 0 }}>
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto",
            backgroundColor: "#f9fafb",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
