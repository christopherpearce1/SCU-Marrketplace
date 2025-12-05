"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "../types";
import { authAPI, listingsAPI } from "../../api";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await authAPI.getCurrentUser();
        const userProfile: User = {
          id: user.id || '',
          email: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone || '',
          address: user.address || '',
          livesOnCampus: false,
          createdAt: ''
        };
        setProfile(userProfile);
        setFirstName(user.first_name || "");
        setLastName(user.last_name || "");
        setPhone(user.phone || "");
        setAddress(user.address || "");

        const allListings = await listingsAPI.getAll();
        const userListings = allListings.filter((l: any) => l.author.username === user.username);
        setListings(userListings);
      } catch (err) {
        router.push('/login');
      }
    };
    loadProfile();
  }, [router]);

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

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem("currentUser");
      router.push("/login");
    } catch (err) {
      console.error('Logout failed:', err);
    }
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

      <div style={{ marginTop: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
          My Listings
        </h2>
        {listings.length === 0 ? (
          <p style={{ color: "#666" }}>You haven't created any listings yet.</p>
        ) : (
          listings.map((listing) => (
            <div
              key={listing.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "12px",
                backgroundColor: "white",
                display: "flex",
                gap: "16px",
              }}
            >
              {listing.image && (
                <img
                  src={listing.image}
                  alt={listing.title}
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>
                  {listing.title}
                </h3>
                <p style={{ margin: "0 0 8px 0", color: "#666" }}>
                  {listing.description}
                </p>
                <p style={{ margin: 0, fontWeight: "bold" }}>
                  ${listing.price}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
