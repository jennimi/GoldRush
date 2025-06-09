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

  // Inline styles for a clean and attractive layout
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
      padding: "20px",
    },
    card: {
      background: "#fff",
      borderRadius: "10px",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
      padding: "2rem",
      maxWidth: "400px",
      width: "100%",
      textAlign: "left",
    },
    header: {
      marginBottom: "1rem",
      fontSize: "1.5rem",
      color: "#333",
      borderBottom: "2px solid #e1e5ea",
      paddingBottom: "0.5rem",
    },
    infoItem: {
      margin: "0.75rem 0",
      fontSize: "1rem",
      color: "#555",
    },
    bold: {
      fontWeight: "600",
      color: "#333",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3 style={styles.header}>Wallet & Token Info</h3>
        <p style={styles.infoItem}>
          <span style={styles.bold}>Wallet Connected:</span> {address}
        </p>
        <p style={styles.infoItem}>
          <span style={styles.bold}>Token Name:</span> {name}
        </p>
        <p style={styles.infoItem}>
          <span style={styles.bold}>Token Symbol:</span> {symbol}
        </p>
        <p style={styles.infoItem}>
          <span style={styles.bold}>Total Supply:</span>{" "}
          {(BigInt(totalSupply) / 10n ** 18n).toString()} GLD
        </p>
      </div>
    </div>
  );
}