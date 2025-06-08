// src/components/GldBalance.jsx
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { readContract } from "wagmi/actions";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";
import { config } from "../wagmi";

export default function GldBalance() {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (!isConnected) return;

    const fetchBalance = async () => {
      try {
        const rawBalance = await readContract(config, {
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "balanceOf",
          args: [address],
        });
        setBalance((BigInt(rawBalance) / 10n ** 18n).toString());
      } catch (err) {
        console.error("Failed to fetch GLD balance:", err);
      }
    };

    fetchBalance();
  }, [address, isConnected]);

  return (
    <p><strong>Your GLD Balance:</strong> {balance ?? "Loading..."} GLD</p>
  );
}
