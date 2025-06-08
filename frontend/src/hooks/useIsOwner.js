// src/hooks/useIsOwner.js
import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import { useAccount } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";
import { config } from "../wagmi";

export function useIsOwner() {
  const { address, isConnected } = useAccount();
  const [isOwner, setIsOwner] = useState(null); // <-- start with null

  useEffect(() => {
    const check = async () => {
      if (!isConnected || !address) {
        setIsOwner(false);
        return;
      }

      try {
        const owner = await readContract(config, {
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "owner",
        });

        setIsOwner(owner.toLowerCase() === address.toLowerCase());
      } catch (err) {
        console.error("Owner check failed:", err);
        setIsOwner(false);
      }
    };

    check();
  }, [address, isConnected]);

  return isOwner;
}
