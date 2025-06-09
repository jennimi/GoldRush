import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // ⬅️ tambahkan Link

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  // ✅ Redirect kalau sudah login sebelumnya
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5050/api/auth/login", formData);
      const { token, username } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      setMessage("Login success 🎉");
      navigate("/"); // ✅ Redirect ke halaman DApp
    } catch (err) {
      setMessage(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>🔐 Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit" style={{ marginTop: "1rem" }}>Login</button>
      </form>
      {message && <p>{message}</p>}
      
      {/* 🔗 Tambahkan link ke register */}
      <p style={{ marginTop: "1rem" }}>
        Belum punya akun? <Link to="/register">Daftar di sini</Link>
      </p>
    </div>
  );
}
