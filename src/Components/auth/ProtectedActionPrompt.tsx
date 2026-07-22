"use client";

import { LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { useAuth } from "@/context/AuthContext";

type Props = {
  title?: string;
  message?: string;
  reason?: string;
  returnHref?: string;
};

export default function ProtectedActionPrompt({
  title = "Login required",
  message = "Please login to continue with this important action.",
  reason = "Login to continue.",
  returnHref = "/store",
}: Props) {
  const { openLoginModal } = useAuth();

  useEffect(() => {
    openLoginModal(reason);
  }, [openLoginModal, reason]);

  return (
    <main style={{ display: "grid", minHeight: "56vh", placeItems: "center", padding: "34px 18px", textAlign: "center" }}>
      <section style={{ width: "min(520px, 100%)", border: "1px solid #dce9e6", borderRadius: 24, background: "#fff", padding: 28, boxShadow: "0 30px 80px -58px rgba(15,23,42,.58)" }}>
        <span style={{ display: "inline-grid", width: 58, height: 58, placeItems: "center", borderRadius: 20, background: "#eaf8f6", color: "#087b75" }}>
          <LockKeyhole size={28} />
        </span>
        <h1 style={{ margin: "16px 0 8px", fontSize: 28, letterSpacing: "-.04em", color: "#101828" }}>{title}</h1>
        <p style={{ margin: 0, color: "#667085", lineHeight: 1.7 }}>{message}</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 22 }}>
          <button
            type="button"
            onClick={() => openLoginModal(reason)}
            style={{ display: "inline-flex", minHeight: 44, alignItems: "center", gap: 8, border: 0, borderRadius: 14, background: "#087b75", color: "#fff", padding: "0 20px", fontWeight: 900, cursor: "pointer" }}
          >
            <ShieldCheck size={17} /> Login now
          </button>
          <Link href={returnHref} style={{ display: "inline-flex", minHeight: 44, alignItems: "center", border: "1px solid #cfe4e0", borderRadius: 14, color: "#087b75", background: "#f7fbfa", padding: "0 20px", fontWeight: 900, textDecoration: "none" }}>
            Continue shopping
          </Link>
        </div>
      </section>
    </main>
  );
}
