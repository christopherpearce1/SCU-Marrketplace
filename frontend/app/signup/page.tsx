"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "../types";
import { authAPI } from "../../api";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [livesOnCampus, setLivesOnCampus] = useState(false);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.endsWith("@scu.edu")) {
      setError("Must use @scu.edu email");
      return;
    }

    if (
      password.length < 6 ||
      password.length > 16 ||
      !/^[a-zA-Z0-9]+$/.test(password)
    ) {
      setError("Password must be 6-16 characters, letters and numbers only");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!livesOnCampus && !address.trim()) {
      setError("Please enter your off-campus address");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (users[email]) {
      setError("Email already exists");
      return;
    }

    users[email] = password;
    localStorage.setItem("users", JSON.stringify(users));

    try {
      // Extract username from email (or use email as username)
      const username = email.split('@')[0]; // or just use email
      
      await authAPI.register(username, password, email, firstName, lastName, phone);
      
      // Auto-login after signup
      const loginData = await authAPI.login(username, password);
      localStorage.setItem("currentUser", loginData.username);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f0",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "40px",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "8px" }}
        >
          Create Account
        </h1>
        <p style={{ color: "#666", marginBottom: "24px", fontSize: "14px" }}>
          Join the SCU Marketplace community
        </p>

        <form onSubmit={handleSignup}>
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              SCU Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@scu.edu"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6-16 characters, letters and numbers"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={livesOnCampus}
                onChange={(e) => setLivesOnCampus(e.target.checked)}
                style={{ width: "18px", height: "18px" }}
              />
              <span style={{ fontSize: "14px" }}>I live on campus</span>
            </label>
          </div>

          {!livesOnCampus && (
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Off-Campus Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, Santa Clara, CA"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
                required={!livesOnCampus}
              />
            </div>
          )}

          {error && (
            <p style={{ color: "red", fontSize: "14px", marginBottom: "16px" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#800000",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Create Account
          </button>
        </form>

        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "14px",
            color: "#666",
          }}
        >
          Already have an account?{" "}
          <a href="/login" style={{ color: "#800000", textDecoration: "none" }}>
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
