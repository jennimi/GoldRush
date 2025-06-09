import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5050/api/auth/login",
        formData
      );
      const { token, username } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      setMessage("Login success 🎉");
      navigate("/"); // ✅ Redirect to the DApp page
    } catch (err) {
      setMessage(err.response?.data?.msg || "Login failed");
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
    button: {
      padding: "0.75rem",
      width: "100%",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#0077ff",
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
    register: {
      marginTop: "1.5rem",
      fontSize: "0.9rem",
      color: "#555",
    },
    link: {
      color: "#0077ff",
      textDecoration: "none",
      fontWeight: "600",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Login</h2>
        <form onSubmit={handleSubmit}>
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
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#005fcc")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = "#0077ff")
            }
          >
            Login
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
        <div style={styles.register}>
          Belum punya akun?{" "}
          <Link to="/register" style={styles.link}>
            Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
}