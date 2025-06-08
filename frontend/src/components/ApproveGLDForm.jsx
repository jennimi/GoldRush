// src/components/ApproveGLDForm.jsx
import React, { useEffect, useState } from "react";
import { writeContract, readContract } from "@wagmi/core";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";
import { config } from "../wagmi";
import { useAccount } from "wagmi";

export default function ApproveGLDForm() {
  const [ownerAddress, setOwnerAddress] = useState("");
  const [amount, setAmount] = useState("");
  const { isConnected } = useAccount();

  // 🔁 Fetch the contract owner (spender) when connected
  useEffect(() => {
    const fetchOwner = async () => {
      if (!isConnected) return;

      try {
        const owner = await readContract(config, {
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "owner",
        });
        setOwnerAddress(owner);
      } catch (err) {
        console.error("Failed to fetch owner:", err);
      }
    };

    fetchOwner();
  }, [isConnected]);

  const handleApprove = async () => {
    try {
      await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "approveGLD",
        args: [ownerAddress, BigInt(amount) * 10n ** 18n],
      });
      alert("✅ Approved successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Approval failed.");
    }
  };

  return (
    <div>
      <h3>Approve GLD</h3>
      <p><strong>Admin (Seller):</strong> {ownerAddress || "Loading..."}</p>
      <input
        style={{ marginRight: '1rem' }}
        type="number"
        placeholder="Amount to approve"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleApprove} disabled={!ownerAddress || !amount}>
        Approve
      </button>
    </div>
  );
}
