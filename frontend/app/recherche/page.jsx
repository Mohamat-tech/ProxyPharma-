"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://proxypharma-backend-jppj.onrender.com/api/v1";

const SUGGESTIONS = ["Paracétamol", "Fièvre", "Antipaludéen", "Amoxicilline", "Metformine", "Ibuprofène"];

function RechercheContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (q) => {
    if (!q) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/medicines/search?q=${q}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([
        { id: 1, name: "Paracétamol 500mg", dci: "Paracétamol", category: "Antalgique", available_pharmacies: 12, min_price: 700, requires_prescription: false },
        { id: 2, name: "Amoxicilline 500mg", dci: "Amoxicilline", category: "Antibiotique", available_pharmacies: 8, min_price: 1200, requires_prescription: true },
        { id: 3, name: "Coartem 80/480", dci: "Artéméther", category: "Antipaludéen", available_pharmacies: 15, min_price: 2500, requires_prescription: false },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (search) handleSearch(search);
  }, []);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#F8FAFC", minHeight: "100vh", maxWidth: 430, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ background: "white", padding: "52px 20px 16px", borderBottom: "1px solid rgba(15,76,129,0.08)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <button onClick={() => router.back()} style={{ width: 36, height: 36, border: "none", background: "#F1F5F9", borderRadius: 10, cursor: "pointer", color: "#0F4C81", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, background: "#F8FAFC", borderRadius: 12, padding: "10px 14px", border: "1px solid rgba(15,76,129,0.08)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              autoFocus
              type="text"
              placeholder="Médicament, pathologie…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch(search)}
              style={{ flex: 1, border: "none", outline: "none", fontFamily: "'Poppins', sans-serif", fontSize: "0.9rem", color: "#0F4C81", background: "transparent" }}
            />
          </div>
          <button onClick={() => handleSearch(search)} style={{ padding: "10px 16px", background: "#10B981", border: "none", borderRadius: 12, color: "white", fontFamily: "'Poppins', sans-serif", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>Chercher</button>
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => { setSearch(s); handleSearch(s); }} style={{ padding: "5px 12px", background: search === s ? "#0F4C81" : "#F1F5F9", border: "none", borderRadius: 20, fontSize: "0.72rem", fontWeight: 600, color: search === s ? "white" : "#94A3B8", cursor: "pointer", flexShrink: 0, fontFamily: "'Poppins', sans-serif" }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div style={{ padding: "20px 20px 100px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#94A3B8" }}>
            <div style={{ width: 32, height: 32, border: "3px solid #F1F5F9", borderTop: "3px solid #10B981", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }}/>
            Recherche en cours…
          </div>
        ) : results.length > 0 ? (
          <>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8", marginBottom: 12 }}>{results.length} résultat{results.length > 1 ? "s" : ""}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {results.map(med => (
                <div key={med.id} onClick={() => router.push(`/medicament/${med.id}`)} style={{ background: "white", borderRadius: 16, padding: 16, display: "flex", gap: 14, alignItems: "center", border: "1px solid rgba(15,76,129,0.06)", boxShadow: "0 2px 8px rgba(15,76,129,0.06)", cursor: "pointer" }}>
                  <div style={{ width: 52, height: 52, background: "linear-gradient(135deg, #F1F5F9, #e2eaf4)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>💊</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0F4C81", marginBottom: 3 }}>{med.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: 6 }}>{med.dci} · {med.category}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ fontSize: "0.7rem", color: "#10B981", fontWeight: 600 }}>{med.available_pharmacies} pharmacies</span>
                      {med.min_price && <span style={{ fontSize: "0.7rem", color: "#0F4C81", fontWeight: 600 }}>À partir de {med.min_price} F</span>}
                      {med.requires_prescription && <span style={{ fontSize: "0.65rem", padding: "1px 7px", borderRadius: 20, background: "rgba(239,68,68,0.1)", color: "#EF4444", fontWeight: 600 }}>Ordonnance</span>}
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              ))}
            </div>
          </>
        ) : search ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0F4C81", marginBottom: 4 }}>Aucun résultat</div>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>Essayez un autre terme</div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: "2rem", marginBottom: 12 }}>💊</div>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0F4C81", marginBottom: 4 }}>Rechercher un médicament</div>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>Par nom, DCI ou pathologie</div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function RecherchePage() {
  return (
    <Suspense fallback={<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "'Poppins', sans-serif", color: "#94A3B8" }}>Chargement…</div>}>
      <RechercheContent />
    </Suspense>
  );
}
