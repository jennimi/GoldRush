import React, { useState } from "react";

export default function TradeModal({ actionLabel, children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen((prev) => !prev);

  return (
    <div>
      <button onClick={toggleModal} style={{
        backgroundColor: "#ffd700",
        color: "#000",
        border: "none",
        padding: "0.75rem 1.25rem",
        borderRadius: "0.5rem",
        cursor: "pointer",
        marginTop: "1rem"
      }}>
        {actionLabel}
      </button>

      {isOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100vw", height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 999
        }}>
          <div style={{
            backgroundColor: "#1c1c1e",
            padding: "2rem",
            borderRadius: "1rem",
            minWidth: "300px",
            maxWidth: "90%",
            color: "#fff",
            boxShadow: "0 0 30px rgba(0,0,0,0.5)"
          }}>
            <h3 style={{ color: "#ffd700", marginBottom: "1rem" }}>{actionLabel}</h3>
            {children}
            <button onClick={toggleModal} style={{
              marginTop: "1.5rem",
              backgroundColor: "#333",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              cursor: "pointer"
            }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
