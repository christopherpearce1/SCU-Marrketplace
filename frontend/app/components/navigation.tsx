"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    setCurrentUser(user);

    if (!user && pathname !== "/login" && pathname !== "/signup") {
      router.push("/login");
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    router.push("/login");
  };

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <div
      style={{
        border: "1px solid black",
        padding: "10px",
        marginBottom: "20px",
      }}
    >
      <a href="/" style={{ marginRight: "10px" }}>
        Home
      </a>
      <a href="/listings" style={{ marginRight: "10px" }}>
        My Listings
      </a>
      <a href="/profile" style={{ marginRight: "10px" }}>
        Profile
      </a>
      {currentUser && (
        <>
          <span style={{ marginLeft: "20px" }}>
            Logged in as: {currentUser}
          </span>
          <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}
