// src/components/BuyGoldForm.jsx
import React, { useState } from "react";
import { writeContract } from "wagmi/actions";
import { parseEther } from "viem";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";
import { config } from "../wagmi";

export default function BuyGoldForm() {
  const [ethAmount, setEthAmount] = useState("");
  const [txStatus, setTxStatus] = useState(null);

  const handleBuy = async (e) => {
    e.preventDefault();
    try {
      setTxStatus("Processing...");

      const tx = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "buyGold",
        value: parseEther(ethAmount), // ETH → wei
      });

      setTxStatus(`Transaction sent! Tx Hash: ${tx.hash}`);
    } catch (err) {
      console.error("Transaction failed:", err);
      setTxStatus("Transaction failed.");
    }
  };

  return (
    <form onSubmit={handleBuy} style={{ marginTop: "2rem" }}>
      <label>
        Amount ETH to Buy GLD:
        <input
          type="number"
          step="0.0001"
          min="0"
          value={ethAmount}
          onChange={(e) => setEthAmount(e.target.value)}
          style={{ marginLeft: "1rem", padding: "0.4rem" }}
        />
      </label>
      <button type="submit" style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}>
        Buy Gold
      </button>
      {txStatus && <p style={{ marginTop: "1rem" }}>{txStatus}</p>}
    </form>
  );
}
