// src/GoldDashboard.jsx
import React from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import GldBalance from "./GLDBalance";
import PriceDisplay from "./PriceDisplay";
import BuyGoldForm from "./BuyGoldForm";
import SellGoldForm from "./SellGoldForm";
import ContractStats from "./ContractStats";
import UserTokenInfo from "./UserTokenInfo";
import ApproveGLDForm from "./ApproveGLDForm";

export default function GoldDashboard() {
  const { isConnected } = useAccount();

  return (
    <div style={{ padding: "2rem" }}>
      <ConnectButton />
      <br />
      {isConnected && (
        <>
          <UserTokenInfo/>
          <GldBalance />
          <PriceDisplay />
          <BuyGoldForm />
          <SellGoldForm />
          <ApproveGLDForm/>
          <ContractStats />
        </>
      )}
    </div>
  );
}
