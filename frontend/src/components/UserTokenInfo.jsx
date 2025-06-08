// src/components/UserTokenInfo.jsx
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { readContract } from "wagmi/actions";
import { config } from "../wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";

export default function UserTokenInfo() {
  const { address, isConnected } = useAccount();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("");

  useEffect(() => {
    const fetchTokenInfo = async () => {
      try {
        const tokenName = await readContract(config, {
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "name",
        });

        const tokenSymbol = await readContract(config, {
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "symbol",
        });

        const tokenSupply = await readContract(config, {
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "totalSupply",
        });

        setName(tokenName);
        setSymbol(tokenSymbol);
        setTotalSupply(BigInt(tokenSupply).toString());
      } catch (err) {
        console.error("Error fetching token info:", err);
      }
    };

    if (isConnected) {
      fetchTokenInfo();
    }
  }, [isConnected]);

  return (
    <div>
      <p><strong>Wallet Connected:</strong> {address}</p>
      <p><strong>Token Name:</strong> {name}</p>
      <p><strong>Token Symbol:</strong> {symbol}</p>
      <p><strong>Total Supply:</strong> {(BigInt(totalSupply) / 10n ** 18n).toString()} GLD</p>
    </div>
  );
}