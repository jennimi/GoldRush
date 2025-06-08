// src/components/PriceDisplay.jsx
import React, { useEffect, useState } from "react";
import { config } from "../wagmi";
import { readContract } from "wagmi/actions";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";
import { formatEther } from "viem";

export default function PriceDisplay() {
    const [buyPrice, setBuyPrice] = useState(null);
    const [sellPrice, setSellPrice] = useState(null);

    const fetchPrices = async () => {
        try {
            const [buy, sell] = await readContract(config, {
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "getPrices",
            });
            setBuyPrice(formatEther(buy));
            setSellPrice(formatEther(sell));
        } catch (error) {
            console.error("Failed to fetch prices:", error);
        }
    };

    useEffect(() => {
        fetchPrices();
    }, []);

    return (
        <div>
            <p><strong>Buy Price (per GLD):</strong> {buyPrice ?? "Loading..."} ETH</p>
            <p><strong>Sell Price (per GLD):</strong> {sellPrice ?? "Loading..."} ETH</p>
        </div>
    );
}
