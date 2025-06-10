import React, { useEffect } from "react";
import { useIsOwner } from "./hooks/useIsOwner";
import GoldDashboard from "./components/GoldDashboard";
import SetPricesForm from "./components/SetPricesForm";
import MintGLDForm from "./components/MintGLDForm";
import RedeemGLDForm from "./components/RedeemGoldForm";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function AdminPage() {
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  const isOwner = useIsOwner();

  // 🔐 Proteksi login (harus punya token)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // 🔁 Proteksi wallet: redirect jika bukan owner
  useEffect(() => {
    if (!isConnected || isOwner === false) {
      navigate("/");
    }
  }, [isConnected, isOwner, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  // ⏳ Jangan render apa-apa selama loading
  if (!isConnected || isOwner === null) return null;

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* <h1>🌕 GoldToken DApp</h1> */}
        <button onClick={handleLogout}>Logout</button>
      </div>
      <GoldDashboard />
      <div style={{ padding: "2rem", borderTop: "1px solid #ccc", marginTop: "2rem" }}>
        <h2>🛠 Admin Controls</h2>
        <SetPricesForm />
        <MintGLDForm />
        <RedeemGLDForm />
      </div>
    </div>
  );
}
