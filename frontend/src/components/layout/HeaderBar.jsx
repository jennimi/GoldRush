import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function HeaderBar() {
  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      backgroundColor: "#1c1c1e",
      color: "#fff",
      borderRadius: "1rem",
      boxShadow: "0 0 12px rgba(0,0,0,0.3)",
      marginBottom: "2rem"
    }}>
      <h2 style={{ color: "#ffd700", margin: 0 }}>🌕 GoldToken DApp</h2>

      <ConnectButton.Custom>
        {({ account, chain, openConnectModal, openAccountModal, openChainModal, mounted }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          return (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {!connected ? (
                <button onClick={openConnectModal} style={{
                  backgroundColor: "#ffd700",
                  color: "#000",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer"
                }}>
                  Connect Wallet
                </button>
              ) : (
                <>
                  <div
                    onClick={openAccountModal}
                    style={{
                      backgroundColor: "#2e2e30",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      fontSize: "0.85rem"
                    }}
                    title="Click to manage account"
                  >
                    {account.displayName}
                  </div>
                  <div
                    onClick={openChainModal}
                    style={{
                      backgroundColor: "#2e2e30",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      fontSize: "0.85rem"
                    }}
                    title="Click to switch network"
                  >
                    {chain.name}
                  </div>
                </>
              )}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </header>
  );
}
