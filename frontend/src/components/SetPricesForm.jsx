// src/components/SetPricesForm.jsx
import React, { useState } from "react";
import { writeContract } from "wagmi/actions";
import { parseEther } from "viem";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";
import { config } from "../wagmi";

export default function SetPricesForm() {
  const [sellPrice, setSellPrice] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Processing...");

    try {
      const tx = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "setPrices",
        args: [parseEther(sellPrice), parseEther(buyPrice)],
      });

      setStatus(`Tx sent: ${tx.hash}`);
    } catch (err) {
      console.error(err);
      setStatus("Failed to update prices.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
      <h3>💰 Update Prices</h3>
      <label>
        New Sell Price (in ETH):
        <input
          type="number"
          step="0.0001"
          value={sellPrice}
          onChange={(e) => setSellPrice(e.target.value)}
          style={{ marginLeft: "1rem" }}
        />
      </label>
      <br />
      <label>
        New Buy Price (in ETH):
        <input
          type="number"
          step="0.0001"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          style={{ marginLeft: "1rem", marginTop: "0.5rem" }}
        />
      </label>
      <br />
      <button type="submit" style={{ marginTop: "1rem" }}>Update Prices</button>
      {status && <p>{status}</p>}
    </form>
  );
}
