// frontend/src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    ktp: null,
  });

  const [message, setMessage] = useState("");

  // ✅ Kalau sudah login, langsung redirect ke DApp
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    if (e.target.name === "ktp") {
      setFormData({ ...formData, ktp: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("password", formData.password);
      data.append("ktp", formData.ktp);

      const res = await axios.post("http://localhost:5050/api/auth/register", data);
      setMessage(res.data.msg);

      // ✅ Redirect ke login setelah sukses
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>📄 Register</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Username:</label>
          <input name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Upload Foto KTP:</label>
          <input name="ktp" type="file" accept=".jpg,.jpeg,.png" onChange={handleChange} required />
        </div>
        <button type="submit" style={{ marginTop: "1rem" }}>Daftar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
