// src/App.jsx
import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { readContract } from "wagmi/actions";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./constants";
import { config } from "./wagmi";

import { ConnectButton } from "@rainbow-me/rainbowkit";

import UserTokenInfo from "./components/UserTokenInfo";
import GldBalance from "./components/GLDBalance";
import PriceDisplay from "./components/PriceDisplay";
import BuyGoldForm from "./components/BuyGoldForm";
import SellGoldForm from "./components/SellGoldForm";
import ApproveGLDForm from "./components/ApproveGLDForm";
import ContractStats from "./components/ContractStats";

export default function App() {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();

  // 🔒 Redirect jika belum login (tidak ada token)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // 🔁 Cek apakah wallet milik owner
  useEffect(() => {
    const checkIfOwner = async () => {
      if (!isConnected || !address) return;

      try {
        const owner = await readContract(config, {
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "owner",
        });

        if (owner.toLowerCase() === address.toLowerCase()) {
          navigate("/admin");
        }
      } catch (err) {
        console.error("Owner check failed:", err);
      }
    };

    checkIfOwner();
  }, [isConnected, address, navigate]);

  // 🚪 Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>🌕 GoldRush App</h1>
        <button onClick={handleLogout} style={{ height: "2rem" }}>
          Logout
        </button>
      </div>
      <ConnectButton />
      <br />
      {isConnected && (
        <>
          <UserTokenInfo />
          <GldBalance />
          <PriceDisplay />
          <BuyGoldForm />
          <SellGoldForm />
          <ApproveGLDForm />
          <ContractStats />
        </>
      )}
    </div>
  );
}
