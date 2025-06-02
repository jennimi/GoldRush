import React, { useState } from "react";
import { ethers } from "ethers";
import GoldTokenABI from "./GoldTokenABI.json";

const HomePage = () => {
  // State variables for connection status, account, contract, etc.
  const [account, setAccount] = useState(null);
  const [goldContract, setGoldContract] = useState(null);
  const [sellPrice, setSellPrice] = useState(null);
  const [buyPrice, setBuyPrice] = useState(null);
  const [txStatus, setTxStatus] = useState("");

  // Deployed contract address
  const contractAddress = "0xc6e7DF5E7b4f2A278906862b61205850344D4e7d";

  // Function to connect to the user's MetaMask wallet
  async function connectWallet() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setAccount(userAddress);

        // Create a contract instance with the signer
        const contractInstance = new ethers.Contract(
          contractAddress,
          GoldTokenABI,
          signer
        );
        setGoldContract(contractInstance);

        // Fetch initial data (like prices)
        const prices = await contractInstance.getPrices();
        setSellPrice(prices[0]);
        setBuyPrice(prices[1]);
      } catch (err) {
        console.error("Error connecting wallet:", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  }

  // Function to handle buying gold via the contract
  async function buyGold() {
    if (!goldContract) return;
    try {
      const tx = await goldContract.buyGold({ value: sellPrice });
      setTxStatus("Transaction submitted...");
      await tx.wait();
      setTxStatus("Gold purchased!");
    } catch (err) {
      console.error("Error buying gold:", err);
      setTxStatus("Transaction failed.");
    }
  }

  // Function to handle selling gold (for example, selling 1 GLD token)
  async function sellGold() {
    if (!goldContract) return;
    try {
      const amount = ethers.parseUnits("1", 18); // 1 GLD token (18 decimals)
      const tx = await goldContract.sellGold(amount);
      setTxStatus("Selling gold...");
      await tx.wait();
      setTxStatus("Gold sold!");
    } catch (err) {
      console.error("Error selling gold:", err);
      setTxStatus("Sell transaction failed.");
    }
  }

  return (
    <div className="HomePage">
      <h1>GoldRush App</h1>
      {account ? (
        <div>
          <p>
            <strong>Connected:</strong> {account}
          </p>
          <p>
            <strong>Sell Price:</strong>{" "}
            {sellPrice ? ethers.formatEther(sellPrice) : "Loading..."} ETH
          </p>
          <p>
            <strong>Buy Price:</strong>{" "}
            {buyPrice ? ethers.formatEther(buyPrice) : "Loading..."} ETH
          </p>
          <button onClick={buyGold}>Buy Gold</button>
          <button onClick={sellGold}>Sell Gold</button>
          <p>{txStatus}</p>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default HomePage;