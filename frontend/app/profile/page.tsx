"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "../types";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const profiles = JSON.parse(localStorage.getItem("profiles") || "{}");
      const userProfile = profiles[currentUser];
      if (userProfile) {
        setProfile(userProfile);
        setFirstName(userProfile.firstName || "");
        setLastName(userProfile.lastName || "");
        setPhone(userProfile.phone || "");
        setAddress(userProfile.address || "");
      }
    }
  }, []);

  const handleSave = () => {
    if (!profile) return;

    const updatedProfile: User = {
      ...profile,
      firstName,
      lastName,
      phone,
      address,
    };

    const profiles = JSON.parse(localStorage.getItem("profiles") || "{}");
    profiles[profile.email] = updatedProfile;
    localStorage.setItem("profiles", JSON.stringify(profiles));
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  const handleLogout = () => {
    // TODO: Connect to backend API
    // await authAPI.logout();
    // localStorage.removeItem("currentUser");
    // router.push("/login");
    
    console.log("Logout button clicked - ready for backend integration");
  };

  if (!profile) {
    return <div style={{ padding: "24px" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "24px", maxWidth: "800px" }}>
      <h1
        style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "24px" }}
      >
        Profile
      </h1>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "24px",
          backgroundColor: "white",
          maxWidth: "600px",
        }}
      >
        <div style={{ marginBottom: "16px" }}>
          <strong style={{ fontSize: "14px", color: "#666" }}>Name:</strong>
          <br />
          {isEditing ? (
            <div style={{ display: "flex", gap: "12px", marginTop: "6px" }}>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                style={{
                  flex: 1,
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                }}
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                style={{
                  flex: 1,
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                }}
              />
            </div>
          ) : (
            <span
              style={{ fontSize: "16px", marginTop: "4px", display: "block" }}
            >
              {profile.firstName} {profile.lastName}
            </span>
          )}
        </div>

        <div style={{ marginBottom: "16px" }}>
          <strong style={{ fontSize: "14px", color: "#666" }}>Email:</strong>
          <br />
          <span
            style={{ fontSize: "16px", marginTop: "4px", display: "block" }}
          >
            {profile.email}
          </span>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <strong style={{ fontSize: "14px", color: "#666" }}>Phone:</strong>
          <br />
          {isEditing ? (
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                marginTop: "6px",
              }}
            />
          ) : (
            <span
              style={{ fontSize: "16px", marginTop: "4px", display: "block" }}
            >
              {profile.phone || "Not provided"}
            </span>
          )}
        </div>

        <div style={{ marginBottom: "16px" }}>
          <strong style={{ fontSize: "14px", color: "#666" }}>Address:</strong>
          <br />
          {isEditing ? (
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={
                profile.livesOnCampus ? "On Campus" : "Enter address"
              }
              disabled={profile.livesOnCampus}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                marginTop: "6px",
                backgroundColor: profile.livesOnCampus ? "#f5f5f5" : "white",
              }}
            />
          ) : (
            <span
              style={{ fontSize: "16px", marginTop: "4px", display: "block" }}
            >
              {profile.livesOnCampus
                ? "On Campus"
                : profile.address || "Not provided"}
            </span>
          )}
        </div>

        {isEditing ? (
          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <button onClick={handleSave} className="btn-primary">
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setFirstName(profile.firstName || "");
                setLastName(profile.lastName || "");
                setPhone(profile.phone || "");
                setAddress(profile.address || "");
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <button onClick={() => setIsEditing(true)} className="btn-secondary">
              Edit Profile
            </button>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
