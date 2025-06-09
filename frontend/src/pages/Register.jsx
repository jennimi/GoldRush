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

  // ✅ Redirect if already logged in
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

      const res = await axios.post(
        "http://localhost:5050/api/auth/register",
        data
      );
      setMessage(res.data.msg);

      // ✅ Redirect to login after success
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Registration failed");
    }
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
      padding: "0 20px",
    },
    card: {
      backgroundColor: "#fff",
      padding: "2rem",
      borderRadius: "10px",
      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
      width: "100%",
      maxWidth: "400px",
      textAlign: "center",
    },
    title: {
      marginBottom: "1.5rem",
      color: "#333",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "1rem",
      textAlign: "left",
      fontSize: "0.95rem",
    },
    label: {
      marginBottom: "0.5rem",
      fontWeight: "600",
    },
    input: {
      padding: "0.75rem",
      borderRadius: "5px",
      border: "1px solid #ccc",
      fontSize: "1rem",
    },
    fileInput: {
      border: "none",
      padding: "0.5rem 0",
    },
    button: {
      padding: "0.75rem",
      width: "100%",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#28a745",
      color: "#fff",
      fontSize: "1rem",
      cursor: "pointer",
      marginTop: "1rem",
      transition: "background-color 0.3s ease",
    },
    message: {
      marginTop: "1rem",
      color: "#d9534f",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📄 Register</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div style={styles.formGroup}>
            <label style={styles.label}>Username:</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password:</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Upload Foto KTP:</label>
            <input
              name="ktp"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleChange}
              required
              style={{ ...styles.input, ...styles.fileInput }}
            />
          </div>
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#218838")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = "#28a745")
            }
          >
            Daftar
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}