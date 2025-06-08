// src/components/SellGoldForm.jsx
import React, { useState } from "react";
import { writeContract } from "wagmi/actions";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";
import { config } from "../wagmi";

export default function SellGoldForm() {
  const [gldAmount, setGldAmount] = useState("");
  const [txStatus, setTxStatus] = useState(null);

  const handleSell = async (e) => {
    e.preventDefault();

    try {
      setTxStatus("Processing...");
      const amountInWei = BigInt(Math.floor(parseFloat(gldAmount) * 1e18));

      const tx = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "sellGold",
        args: [amountInWei],
      });

      setTxStatus(`Transaction sent! Tx Hash: ${tx.hash}`);
    } catch (err) {
      console.error("Sell failed:", err);
      setTxStatus("Transaction failed.");
    }
  };

  return (
    <form onSubmit={handleSell} style={{ marginTop: "2rem" }}>
      <label>
        Amount GLD to Sell:
        <input
          type="number"
          step="0.0001"
          min="0"
          value={gldAmount}
          onChange={(e) => setGldAmount(e.target.value)}
          style={{ marginLeft: "1rem", padding: "0.4rem" }}
        />
      </label>
      <button type="submit" style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}>
        Sell Gold
      </button>
      {txStatus && <p style={{ marginTop: "1rem" }}>{txStatus}</p>}
    </form>
  );
}
