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

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🌕 GoldToken DApp</h1>
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