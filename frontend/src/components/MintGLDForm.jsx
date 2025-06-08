import React, { useState } from "react";
import { writeContract } from "wagmi/actions";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";
import { config } from "../wagmi";

export default function MintGLDForm() {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState(null);

  const handleMint = async (e) => {
    e.preventDefault();
    setStatus("⏳ Minting...");

    try {
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * 1e18));

      const tx = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "mintGLD",
        args: [CONTRACT_ADDRESS, amountInWei], // ✅ mint ke kontrak sendiri
      });

      setStatus(`✅ Minted! Tx Hash: ${tx.hash}`);
    } catch (err) {
      console.error(err);
      setStatus("❌ Mint failed. Check console.");
    }
  };

  return (
    <form onSubmit={handleMint} style={{ marginTop: "2rem" }}>
      <h3>📦 Mint GLD to Contract Inventory</h3>

      <label>
        Amount (GLD):
        <input
          type="number"
          step="0.0001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ marginTop: "0.5rem", marginLeft: '0.5rem' }}
          required
        />
      </label>

      <br />
      <button type="submit" style={{ marginTop: "1rem" }}>
        Mint to Contract
      </button>

      {status && <p style={{ marginTop: "0.5rem" }}>{status}</p>}
    </form>
  );
}
  