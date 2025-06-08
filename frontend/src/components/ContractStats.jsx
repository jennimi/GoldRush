// src/components/ContractStats.jsx
import React, { useEffect, useState } from "react";
import { readContract } from "wagmi/actions";
import { formatEther } from "viem";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";
import { config } from "../wagmi";

export default function ContractStats() {
  const [contractBalance, setContractBalance] = useState(null);
  const [gldInventory, setGldInventory] = useState(null);
  const [circulatingSupply, setCirculatingSupply] = useState(null);
  const [fullyBacked, setFullyBacked] = useState(null);

  const fetchStats = async () => {
    try {
      const [balance, inventory, circulating, backed] = await Promise.all([
        readContract(config, {
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "getContractBalance",
        }),
        readContract(config, {
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "getGLDInventory",
        }),
        readContract(config, {
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "getCirculatingSupply",
        }),
        readContract(config, {
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "isFullyBacked",
        }),
      ]);

      setContractBalance(formatEther(balance));
      setGldInventory((BigInt(inventory) / 10n ** 18n).toString());
      setCirculatingSupply((BigInt(circulating) / 10n ** 18n).toString());
      setFullyBacked(backed);
    } catch (error) {
      console.error("Failed to fetch contract stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>📊 Contract Statistics</h3>
      <p><strong>Contract ETH Balance:</strong> {contractBalance ?? "Loading..."} ETH</p>
      <p><strong>GLD Inventory (unsold):</strong> {gldInventory ?? "Loading..."} GLD</p>
      <p><strong>Circulating Supply:</strong> {circulatingSupply ?? "Loading..."} GLD</p>
      <p><strong>Is Fully Backed:</strong> {fullyBacked === null ? "Loading..." : (fullyBacked ? "✅ Yes" : "❌ No")}</p>
    </div>
  );
}
