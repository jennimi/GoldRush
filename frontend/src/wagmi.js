// wagmi.js
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";

const projectId = "example-project-id"; // Ganti ke WalletConnect projectId kamu jika perlu

const chains = [sepolia];

const { connectors } = getDefaultWallets({
  appName: "GoldToken DApp",
  projectId,
  chains,
});

export const config = createConfig({
  connectors,
  chains,
  transports: {
    [sepolia.id]: http("https://sepolia.infura.io/v3/14c44dea376f4191b144151e984f727e")
  },
  ssr: true,
});

export { chains };
