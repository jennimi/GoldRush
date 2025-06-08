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

  useEffect(() => {
    if (!isConnected || isOwner === false) {
      navigate("/"); // redirect if not connected or not owner
    }
  }, [isConnected, isOwner, navigate]);

  // prevent rendering during loading phase
  if (!isConnected || isOwner === null) return null;

  return (
    <div>
      <GoldDashboard/>
      <div style={{ padding: "2rem", borderTop: "1px solid #ccc", marginTop: "2rem" }}>
        <h2>🛠 Admin Panel</h2>
        <SetPricesForm />
        <MintGLDForm />
        <RedeemGLDForm />
      </div>
    </div>
  );
}