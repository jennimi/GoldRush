import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AdminPage from "./AdminPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { WagmiConfig } from "wagmi";
import { config, chains } from "./wagmi";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <RainbowKitProvider chains={chains}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </BrowserRouter>
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  </React.StrictMode>
);