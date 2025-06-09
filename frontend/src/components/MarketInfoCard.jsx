import React, { useEffect, useState } from "react";
import { config } from "../wagmi";
import { readContract } from "wagmi/actions";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";
import { formatEther } from "viem";

export default function MarketInfoCard() {
  const [buyPrice, setBuyPrice] = useState(null);
  const [sellPrice, setSellPrice] = useState(null);
  const [fullyBacked, setFullyBacked] = useState(null);

  const fetchMarketInfo = async () => {
    try {
      const [buy, sell] = await readContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getPrices",
      });

      const backed = await readContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "isFullyBacked",
      });

      setBuyPrice(formatEther(buy));
      setSellPrice(formatEther(sell));
      setFullyBacked(backed);
    } catch (error) {
      console.error("Failed to fetch market info:", error);
    }
  };

  useEffect(() => {
    fetchMarketInfo();
  }, []);

  return (
    <div style={{
      backgroundColor: "#1c1c1e",
      padding: "1.5rem",
      borderRadius: "1rem",
      boxShadow: "0 0 10px rgba(0,0,0,0.3)",
      color: "#fff"
    }}>
      <h3 style={{ color: "#ffd700", marginBottom: "1rem" }}>💰 GLD Market Info</h3>
      <p><strong>Buy Price:</strong> {buyPrice ?? "Loading..."} ETH</p>
      <p><strong>Sell Price:</strong> {sellPrice ?? "Loading..."} ETH</p>
      <p><strong>Is Fully Backed:</strong> {fullyBacked === null ? "Loading..." : (fullyBacked ? "✅ Yes" : "❌ No")}</p>
    </div>
  );
}
