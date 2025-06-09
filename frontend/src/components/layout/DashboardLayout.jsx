import React from "react";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div style={{
      display: "flex",
      gap: "2rem",
    }}>
      <Sidebar />
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "2rem"
      }}>
        {children}
      </div>
    </div>
  );
}
