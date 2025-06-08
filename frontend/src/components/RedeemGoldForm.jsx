// src/components/RedeemGLDForm.jsx
import React, { useState } from "react";
import { writeContract } from "@wagmi/core";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";
import { config } from "../wagmi";

export default function RedeemGLDForm() {
  const [targetAddress, setTargetAddress] = useState("");
  const [amount, setAmount] = useState("");

  const handleRedeem = async () => {
    try {
      await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "redeemGoldFrom",
        args: [targetAddress, BigInt(amount) * 10n ** 18n],
      });
      alert("Redeem successful");
    } catch (err) {
      console.error(err);
      alert("Redeem failed");
    }
  };

  return (
    <div style={{marginTop: '2rem'}}>
      <h3>Redeem GLD from user</h3>
      <input
        type="text"
        placeholder="User address"
        value={targetAddress}
        onChange={(e) => setTargetAddress(e.target.value)}
        style={{marginRight: '1rem'}}
      />
      <input
        type="number"
        placeholder="Amount to redeem"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{marginRight: '1rem'}}
      />
      <button onClick={handleRedeem}>Redeem</button>
    </div>
  );
}
