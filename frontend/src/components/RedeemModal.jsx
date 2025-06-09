import React, { useState } from "react";
import ApproveGLDForm from "./ApproveGLDForm";

export default function RedeemModal() {
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
        🔐 Redeem Physical Gold
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
            <h3 style={{ color: "#ffd700", marginBottom: "1rem" }}>Redeem Physical Gold</h3>
            <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
              To receive real physical gold, approve the amount of GLD to the admin. The admin will burn that amount and fulfill your redemption.
            </p>
            <ApproveGLDForm />
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
