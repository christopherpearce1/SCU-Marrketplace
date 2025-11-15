"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.endsWith("@scu.edu")) {
      setError("Must use @scu.edu email");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if (users[email]) {
      setError("Email already exists");
      return;
    }

    users[email] = password;
    localStorage.setItem("users", JSON.stringify(users));

    const profiles = JSON.parse(localStorage.getItem("profiles") || "{}");
    profiles[email] = { name, email };
    localStorage.setItem("profiles", JSON.stringify(profiles));

    localStorage.setItem("currentUser", email);
    router.push("/");
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
        <div>
          <label>Name:</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "300px", padding: "5px" }}
            required
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Email:</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "300px", padding: "5px" }}
            required
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Password:</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "300px", padding: "5px" }}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button
          type="submit"
          style={{ marginTop: "10px", padding: "5px 15px" }}
        >
          Sign Up
        </button>
      </form>
      <p style={{ marginTop: "20px" }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}
