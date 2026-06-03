"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrdonnancesPage() {
  const router = useRouter();
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);

  const ORDONNANCES = [
    { id: 1, date: "2026-05-28", verified: true, prescriber: "Dr. Mbarga Paul", meds: ["Paracétamol 500mg", "Amoxicilline"] },
    { id: 2, date: "2026-05-15", verified: false, prescriber: "Dr. Kamga Marie", meds: ["Metformine 500mg"] },
  ];

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => { setUploading(false); setUploaded(true); }, 2000);
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#F8FAFC", minHeight: "100vh", maxWidth: 430, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(150deg, #0F4C81, #0a3a6e)", padding: "52px 20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <button onClick={() => router.back()} style={{ width: 36, height: 36, border: "none", background: "rgba(255,255,255,0.12)", borderRadius: 10, cursor: "pointer", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 800, color: "white" }}>Mes ordonnances</div>
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.6)" }}>Stockage sécurisé — Chiffrement AES-256</div>
          </div>
        </div>

        {/* Upload button */}
        <div onClick={handleUpload} style={{ background: "rgba(255,255,255,0.1)", border: "1.5px dashed rgba(255,255,255,0.3)", borderRadius: 16, padding: 20, display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
          <div style={{ width: 48, height: 48, background: "linear-gradient(135deg, #10B981, #6EE7B7)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {uploading ? (
              <div style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}/>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
            )}
          </div>
          <div>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "white" }}>{uploading ? "Téléversement…" : uploaded ? "✓ Ordonnance ajoutée !" : "Téléverser une ordonnance"}</div>
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.6)" }}>PDF ou photo · Cachet ONMC requis</div>
          </div>
        </div>
      </div>

      {/* List */}
      <div style={{ padding: "20px 20px 100px" }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {ORDONNANCES.length} ordonnance{ORDONNANCES.length > 1 ? "s" : ""} stockée{ORDONNANCES.length > 1 ? "s" : ""}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ORDONNANCES.map(o => (
            <div key={o.id} style={{ background: "white", borderRadius: 16, padding: 16, border: "1px solid rgba(15,76,129,0.06)", boxShadow: "0 2px 8px rgba(15,76,129,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 40, height: 40, background: o.verified ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={o.verified ? "#10B981" : "#F59E0B"} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0F4C81" }}>{o.prescriber}</div>
                    <div style={{ fontSize: "0.68rem", color: "#94A3B8" }}>{new Date(o.date).toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
                <span style={{ fontSize: "0.68rem", fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: o.verified ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", color: o.verified ? "#10B981" : "#F59E0B" }}>
                  {o.verified ? "✓ Vérifiée" : "⏳ En attente"}
                </span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {o.meds.map(m => (
                  <span key={m} style={{ fontSize: "0.7rem", padding: "3px 10px", borderRadius: 20, background: "#F8FAFC", color: "#0F4C81", fontWeight: 500 }}>💊 {m}</span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button onClick={() => router.push('/commande')} style={{ flex: 1, padding: "10px 0", background: "linear-gradient(135deg, #10B981, #059669)", border: "none", borderRadius: 10, color: "white", fontFamily: "'Poppins', sans-serif", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
                  Commander
                </button>
                <button style={{ width: 40, height: 38, background: "#F1F5F9", border: "none", borderRadius: 10, cursor: "pointer", color: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
