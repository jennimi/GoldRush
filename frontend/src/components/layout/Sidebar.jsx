import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { readContract } from "wagmi/actions";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../../constants";
import { config } from "../../wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Sidebar() {
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

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      alert("Address copied to clipboard!");
    }
  };

  return (
    <aside style={{
      backgroundColor: "#1c1c1e",
      color: "#fff",
      padding: "1.5rem",
      borderRadius: "1rem",
      boxShadow: "0 0 10px rgba(0,0,0,0.3)",
      minWidth: "250px",
      height: "fit-content",
    }}>
      <h3 style={{ color: "#ffd700", marginBottom: "1rem" }}>👤 Your Account</h3>
      <p><strong>GLD Balance:</strong><br />{balance ?? "Loading..."} GLD</p>
      {/* <p style={{ wordBreak: "break-all", cursor: "pointer", opacity: 0.8, textDecoration: "underline dotted" }} onClick={copyToClipboard}>
        {address ?? "Not Connected"}
      </p> */}
      <ConnectButton />
    </aside>
  );
}
