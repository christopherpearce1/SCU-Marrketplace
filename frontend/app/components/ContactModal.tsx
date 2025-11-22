
"use client";

import { Listing, ContactInfo } from "../types";

interface ContactModalProps {
  listing: Listing | null;
  onClose: () => void;
}

export function ContactModal({ listing, onClose }: ContactModalProps) {
  if (!listing) return null;

  const contactInfo: ContactInfo = {
    name: listing.sellerName,
    email: listing.sellerEmail,
    phone: listing.sellerPhone,
    isSCUStudent: true,
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "24px",
          maxWidth: "500px",
          width: "90%",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>
            Contact Seller
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#666",
            }}
          >
            ×
          </button>
        </div>

        <p style={{ color: "#666", marginBottom: "20px", fontSize: "14px" }}>
          Reach out to discuss pricing and details for:{" "}
          <strong>{listing.title}</strong>
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "#FFE4B5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#800000",
            }}
          >
            {getInitials(contactInfo.name)}
          </div>
          <div>
            <div style={{ fontWeight: "600", fontSize: "16px" }}>
              {contactInfo.name}
            </div>
            <div style={{ color: "#666", fontSize: "14px" }}>SCU Student</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          >
            <span style={{ fontSize: "20px" }}>✉</span>
            <div>
              <div
                style={{ fontSize: "12px", color: "#666", marginBottom: "2px" }}
              >
                Email
              </div>
              <div style={{ fontSize: "14px", fontWeight: "500" }}>
                {contactInfo.email}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          >
            <span style={{ fontSize: "20px" }}>📞</span>
            <div>
              <div
                style={{ fontSize: "12px", color: "#666", marginBottom: "2px" }}
              >
                Phone
              </div>
              <div style={{ fontSize: "14px", fontWeight: "500" }}>
                {contactInfo.phone}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
