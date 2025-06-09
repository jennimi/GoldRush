// src/App.jsx
import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { readContract } from "wagmi/actions";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./constants";
import { config } from "./wagmi";

import HeaderBar from "./components/layout/HeaderBar";
import DashboardLayout from "./components/layout/DashboardLayout";

import Sidebar from "./components/layout/Sidebar";
import MarketInfoCard from "./components/MarketInfoCard";
import TradeModal from "./components/TradeModal";
import BuyGoldForm from "./components/BuyGoldForm";
import SellGoldForm from "./components/SellGoldForm";
import RedeemModal from "./components/RedeemModal";
import SystemInfoCard from "./components/SystemInfoCard";

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
    <div
      style={{
        padding: "2rem",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        backgroundColor: "#111",
        minHeight: "100vh",
      }}
    >
      <HeaderBar />
      {isConnected && (
        <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
          <Sidebar />

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "300px" }}>
                <div className="card" style={{ height: "100%" }}>
                  <MarketInfoCard />
                </div>
              </div>
              <div style={{ flex: 1, minWidth: "300px" }}>
                <div className="card" style={{ height: "100%" }}>
                  <h3 style={{ color: "#ffd700", marginBottom: "-0.5rem" }}>🛒 Trade Actions</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0rem" }}>
                    <TradeModal actionLabel="🛍 Buy GLD">
                      <BuyGoldForm />
                    </TradeModal>
                    <TradeModal actionLabel="💸 Sell GLD">
                      <SellGoldForm />
                    </TradeModal>
                    <RedeemModal />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <SystemInfoCard />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // return (
  //   <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
  //     <h1>🌕 GoldToken DApp</h1>
  //     <ConnectButton />
  //     <br />
  //     {isConnected && (
  //       <>
  //         <UserTokenInfo />
  //         <GldBalance />
  //         <PriceDisplay />
  //         <BuyGoldForm />
  //         <SellGoldForm />
  //         <ApproveGLDForm />
  //         <ContractStats />
  //       </>
  //     )}
  //   </div>
  // );
}
