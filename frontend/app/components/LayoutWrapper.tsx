"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "./app-sidebar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <AppSidebar />
      <main
        style={{
          flex: 1,
          overflow: "auto",
          padding: "20px",
          backgroundColor: "#f5f5f0",
        }}
      >
        {children}
      </main>
    </div>
  );
}