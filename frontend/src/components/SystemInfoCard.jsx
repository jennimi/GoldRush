import React, { useEffect, useState } from "react";
import { readContract } from "wagmi/actions";
import { formatEther } from "viem";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";
import { config } from "../wagmi";

export default function SystemInfoCard() {
  const [contractBalance, setContractBalance] = useState(null);
  const [gldInventory, setGldInventory] = useState(null);
  const [circulatingSupply, setCirculatingSupply] = useState(null);
  const [fullyBacked, setFullyBacked] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const [balance, inventory, circulating, backed, supply] = await Promise.all([
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
            readContract(config, {
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "totalSupply",
            }),
            ]);

            setContractBalance(formatEther(balance));
            setGldInventory((BigInt(inventory) / 10n ** 18n).toString());
            setCirculatingSupply((BigInt(circulating) / 10n ** 18n).toString());
            setFullyBacked(backed);
            setTotalSupply((BigInt(supply) / 10n ** 18n).toString());
        } catch (error) {
            console.error("Failed to fetch contract stats:", error);
        }
    };


    fetchStats();
  }, []);

  return (
    <div style={{
      backgroundColor: "#1c1c1e",
      padding: "1.5rem",
      borderRadius: "1rem",
      boxShadow: "0 0 10px rgba(0,0,0,0.3)",
      color: "#fff"
    }}>
        <h3 style={{ color: "#ffd700", marginBottom: "1rem" }}>📊 System Info</h3>
        <p><strong>Contract ETH Balance:</strong> {contractBalance ?? "Loading..."} ETH</p>
        <p><strong>GLD Inventory:</strong> {gldInventory ?? "Loading..."} GLD</p>
        <p><strong>Circulating Supply:</strong> {circulatingSupply ?? "Loading..."} GLD</p>
        <p><strong>Is Fully Backed:</strong> {fullyBacked === null ? "Loading..." : (fullyBacked ? "✅ Yes" : "❌ No")}</p>
        <p><strong>Total Supply:</strong> {totalSupply ?? "Loading..."} GLD</p>
    </div>
  );
}
