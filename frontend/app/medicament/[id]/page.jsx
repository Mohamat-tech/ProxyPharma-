"use client";
import { useState } from "react";

// ─── ICONS ────────────────────────────────────────────────────────────────────
const IconArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);
const IconHeart = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#EF4444" : "none"} stroke={filled ? "#EF4444" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const IconShare = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);
const IconStar = ({ filled = true }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#F59E0B" : "none"} stroke="#F59E0B" strokeWidth="2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconMinus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconCart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const MEDICINE = {
  id: 1,
  emoji: "💊",
  name: "Paracétamol 500mg",
  brand: "Doliprane",
  dci: "Paracétamol",
  code: "CPNN-2024-0142",
  category: "Antalgique / Antipyrétique",
  prescription: false,
  description: "Le Paracétamol 500mg est un médicament antalgique et antipyrétique utilisé pour soulager les douleurs légères à modérées et réduire la fièvre.",
  indication: "Maux de tête, fièvre, douleurs dentaires, douleurs musculaires, règles douloureuses.",
  posology: "1 à 2 comprimés toutes les 4 à 6 heures. Ne pas dépasser 8 comprimés par 24h.",
  sideEffects: ["Réactions allergiques rares", "Troubles hépatiques en cas de surdosage", "Nausées légères"],
  contraindications: ["Insuffisance hépatique sévère", "Allergie au paracétamol", "Alcoolisme chronique"],
  conservation: "Conserver à température ambiante (< 25°C), à l'abri de la lumidité.",
  amm: "Valide — AMM N° CM-2024-0142",
  rating: 4.8,
  reviews: 342,
};

const PHARMACIES = [
  { id: 1, name: "Pharmacie Centrale", dist: "200 m", price: 850, stock: 48, delivery: "30 min", open: true, certified: true },
  { id: 2, name: "Pharmacie du Marché", dist: "640 m", price: 700, stock: 120, delivery: "45 min", open: true, certified: false },
  { id: 3, name: "Pharmacie de la Paix", dist: "1.1 km", price: 900, stock: 30, delivery: "35 min", open: true, certified: true },
  { id: 4, name: "Pharmacie Bonabéri", dist: "2.3 km", price: 750, stock: 0, delivery: "60 min", open: false, certified: true },
];

const TABS = ["Détails", "Pharmacies", "Avis"];

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function FicheMedicamentPage() {
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("Détails");
  const [qty, setQty] = useState(1);
  const [selectedPharma, setSelectedPharma] = useState(null);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      background: "#F8FAFC",
      minHeight: "100vh",
      maxWidth: 430, margin: "0 auto",
      position: "relative",
    }}>

      {/* ── HERO ── */}
      <div style={{
        background: "linear-gradient(150deg, #0F4C81, #0a3a6e)",
        padding: "0 0 40px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Glow */}
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 200, height: 200,
          background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }}/>

        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "52px 20px 20px",
        }}>
          <button style={{
            width: 40, height: 40, border: "none",
            background: "rgba(255,255,255,0.12)", borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "white", backdropFilter: "blur(8px)",
          }}><IconArrowLeft /></button>

          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "white" }}>Fiche médicament</div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setLiked(!liked)} style={{
              width: 40, height: 40, border: "none",
              background: "rgba(255,255,255,0.12)", borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "white", backdropFilter: "blur(8px)",
            }}><IconHeart filled={liked} /></button>
            <button style={{
              width: 40, height: 40, border: "none",
              background: "rgba(255,255,255,0.12)", borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "white", backdropFilter: "blur(8px)",
            }}><IconShare /></button>
          </div>
        </div>

        {/* Med info */}
        <div style={{ padding: "0 20px", display: "flex", gap: 20, alignItems: "center" }}>
          <div style={{
            width: 90, height: 90, flexShrink: 0,
            background: "rgba(255,255,255,0.12)",
            borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "3rem", border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
          }}>{MEDICINE.emoji}</div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
              <span style={{
                fontSize: "0.65rem", fontWeight: 600,
                padding: "3px 10px", borderRadius: 20,
                background: "rgba(16,185,129,0.2)", color: "#6EE7B7",
              }}>{MEDICINE.category}</span>
              {!MEDICINE.prescription && (
                <span style={{
                  fontSize: "0.65rem", fontWeight: 600,
                  padding: "3px 10px", borderRadius: 20,
                  background: "rgba(56,189,248,0.2)", color: "#38BDF8",
                }}>Sans ordonnance</span>
              )}
            </div>
            <h1 style={{ fontSize: "1.1rem", fontWeight: 800, color: "white", marginBottom: 4, lineHeight: 1.2 }}>
              {MEDICINE.name}
            </h1>
            <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>
              {MEDICINE.brand} · DCI : {MEDICINE.dci}
            </div>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
              <div style={{ display: "flex", gap: 2 }}>
                {[1,2,3,4,5].map(i => <IconStar key={i} filled={i <= Math.round(MEDICINE.rating)} />)}
              </div>
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                {MEDICINE.rating} ({MEDICINE.reviews} avis)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── AMM BADGE ── */}
      <div style={{ margin: "16px 20px 0" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(56,189,248,0.06))",
          border: "1px solid rgba(16,185,129,0.2)",
          borderRadius: 12, padding: "10px 14px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 28, height: 28, background: "#10B981", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}><IconCheck /></div>
          <div>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0F4C81" }}>Médicament certifié CPNN</div>
            <div style={{ fontSize: "0.65rem", color: "#94A3B8" }}>{MEDICINE.amm} · Code : {MEDICINE.code}</div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{
        display: "flex", margin: "16px 20px 0",
        background: "#F1F5F9", borderRadius: 12, padding: 4,
      }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: "10px 0", border: "none", borderRadius: 10,
            background: activeTab === tab ? "white" : "transparent",
            color: activeTab === tab ? "#0F4C81" : "#94A3B8",
            fontFamily: "'Poppins', sans-serif", fontSize: "0.78rem", fontWeight: 600,
            cursor: "pointer",
            boxShadow: activeTab === tab ? "0 2px 8px rgba(15,76,129,0.1)" : "none",
            transition: "all 0.2s",
          }}>{tab}</button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      <div style={{ padding: "20px 20px 140px" }}>

        {/* DÉTAILS */}
        {activeTab === "Détails" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Description */}
            <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(15,76,129,0.06)" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0F4C81", marginBottom: 8 }}>📋 Description</div>
              <p style={{ fontSize: "0.82rem", color: "#475569", lineHeight: 1.7 }}>{MEDICINE.description}</p>
            </div>

            {/* Indication */}
            <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(15,76,129,0.06)" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0F4C81", marginBottom: 8 }}>✅ Indications</div>
              <p style={{ fontSize: "0.82rem", color: "#475569", lineHeight: 1.7 }}>{MEDICINE.indication}</p>
            </div>

            {/* Posologie */}
            <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(15,76,129,0.06)" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0F4C81", marginBottom: 8 }}>💊 Posologie</div>
              <p style={{ fontSize: "0.82rem", color: "#475569", lineHeight: 1.7 }}>{MEDICINE.posology}</p>
            </div>

            {/* Effets indésirables */}
            <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(15,76,129,0.06)" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0F4C81", marginBottom: 10 }}>
                ⚠️ Effets indésirables
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {MEDICINE.sideEffects.map(e => (
                  <div key={e} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 6, height: 6, background: "#F59E0B", borderRadius: "50%", flexShrink: 0 }}/>
                    <span style={{ fontSize: "0.8rem", color: "#475569" }}>{e}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contre-indications */}
            <div style={{
              background: "rgba(239,68,68,0.04)",
              border: "1px solid rgba(239,68,68,0.15)",
              borderRadius: 16, padding: 16,
            }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#EF4444", marginBottom: 10 }}>
                🚫 Contre-indications
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {MEDICINE.contraindications.map(c => (
                  <div key={c} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 6, height: 6, background: "#EF4444", borderRadius: "50%", flexShrink: 0 }}/>
                    <span style={{ fontSize: "0.8rem", color: "#475569" }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Conservation */}
            <div style={{
              background: "rgba(56,189,248,0.06)",
              border: "1px solid rgba(56,189,248,0.2)",
              borderRadius: 16, padding: 16,
              display: "flex", gap: 12, alignItems: "flex-start",
            }}>
              <span style={{ fontSize: "1.5rem" }}>🌡️</span>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0F4C81", marginBottom: 4 }}>Conservation</div>
                <p style={{ fontSize: "0.78rem", color: "#475569", lineHeight: 1.6 }}>{MEDICINE.conservation}</p>
              </div>
            </div>
          </div>
        )}

        {/* PHARMACIES */}
        {activeTab === "Pharmacies" && (
          <div>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8", marginBottom: 12, fontWeight: 500 }}>
              {PHARMACIES.filter(p => p.stock > 0).length} pharmacies avec stock disponible
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {PHARMACIES.sort((a, b) => a.price - b.price).map((p, i) => (
                <div key={p.id}
                  onClick={() => p.stock > 0 && setSelectedPharma(selectedPharma?.id === p.id ? null : p)}
                  style={{
                    background: "white", borderRadius: 16, padding: 16,
                    border: selectedPharma?.id === p.id ? "1.5px solid #10B981" : "1px solid rgba(15,76,129,0.06)",
                    boxShadow: selectedPharma?.id === p.id ? "0 4px 20px rgba(16,185,129,0.12)" : "0 2px 8px rgba(15,76,129,0.06)",
                    cursor: p.stock > 0 ? "pointer" : "not-allowed",
                    opacity: p.stock === 0 ? 0.6 : 1,
                    transition: "all 0.2s",
                    position: "relative",
                  }}>
                  {/* Best price badge */}
                  {i === 0 && p.stock > 0 && (
                    <div style={{
                      position: "absolute", top: -8, right: 12,
                      background: "#10B981", color: "white",
                      fontSize: "0.6rem", fontWeight: 700,
                      padding: "3px 10px", borderRadius: 20,
                    }}>Meilleur prix</div>
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <div style={{
                      width: 42, height: 42,
                      background: p.stock > 0 ? "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(110,231,183,0.2))" : "rgba(148,163,184,0.1)",
                      borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                      color: p.stock > 0 ? "#10B981" : "#94A3B8", flexShrink: 0,
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <rect x="9" y="13" width="6" height="8"/>
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0F4C81" }}>{p.name}</div>
                      <div style={{ display: "flex", gap: 6, marginTop: 3 }}>
                        <span style={{ fontSize: "0.7rem", color: "#94A3B8" }}>📍 {p.dist}</span>
                        {p.open
                          ? <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "1px 7px", borderRadius: 20, background: "rgba(16,185,129,0.1)", color: "#10B981" }}>Ouverte</span>
                          : <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "1px 7px", borderRadius: 20, background: "rgba(148,163,184,0.1)", color: "#94A3B8" }}>Fermée</span>
                        }
                        {p.certified && <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "1px 7px", borderRadius: 20, background: "rgba(15,76,129,0.08)", color: "#0F4C81" }}>✓ DPML</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#10B981" }}>{p.price} F</div>
                      <div style={{ fontSize: "0.65rem", color: "#94A3B8" }}>par boîte</div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 8, textAlign: "center" }}>
                      <div style={{ fontSize: "0.6rem", color: "#94A3B8", marginBottom: 2 }}>Stock</div>
                      <div style={{ fontSize: "0.78rem", fontWeight: 700, color: p.stock > 0 ? "#0F4C81" : "#EF4444" }}>
                        {p.stock > 0 ? `${p.stock} unités` : "Rupture"}
                      </div>
                    </div>
                    <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 8, textAlign: "center" }}>
                      <div style={{ fontSize: "0.6rem", color: "#94A3B8", marginBottom: 2 }}>Livraison</div>
                      <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0F4C81" }}>🚴 {p.delivery}</div>
                    </div>
                    <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 8, textAlign: "center" }}>
                      <div style={{ fontSize: "0.6rem", color: "#94A3B8", marginBottom: 2 }}>Total x{qty}</div>
                      <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#10B981" }}>{p.price * qty} F</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AVIS */}
        {activeTab === "Avis" && (
          <div>
            {/* Summary */}
            <div style={{
              background: "white", borderRadius: 16, padding: 20,
              boxShadow: "0 2px 8px rgba(15,76,129,0.06)", marginBottom: 16,
              display: "flex", gap: 20, alignItems: "center",
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "3rem", fontWeight: 800, color: "#0F4C81", lineHeight: 1 }}>{MEDICINE.rating}</div>
                <div style={{ display: "flex", gap: 2, justifyContent: "center", margin: "6px 0" }}>
                  {[1,2,3,4,5].map(i => <IconStar key={i} filled={i <= Math.round(MEDICINE.rating)} />)}
                </div>
                <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>{MEDICINE.reviews} avis</div>
              </div>
              <div style={{ flex: 1 }}>
                {[5,4,3,2,1].map(s => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: "0.7rem", color: "#94A3B8", width: 8 }}>{s}</span>
                    <div style={{ flex: 1, height: 6, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 3, background: "#10B981",
                        width: s === 5 ? "72%" : s === 4 ? "18%" : s === 3 ? "6%" : "2%",
                      }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            {[
              { name: "Marie N.", date: "Il y a 2 jours", rating: 5, text: "Très efficace pour la fièvre. Livré en 25 minutes depuis la Pharmacie Centrale. Je recommande !" },
              { name: "Jean-Baptiste K.", date: "Il y a 1 semaine", rating: 5, text: "Bon médicament certifié. Prix correct et pharmacie agréée DPML. Application très pratique." },
              { name: "Clémentine F.", date: "Il y a 2 semaines", rating: 4, text: "Efficace mais j'aurais voulu plus d'informations sur les interactions médicamenteuses." },
            ].map((r, i) => (
              <div key={i} style={{
                background: "white", borderRadius: 16, padding: 16,
                boxShadow: "0 2px 8px rgba(15,76,129,0.06)", marginBottom: 12,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, background: "linear-gradient(135deg, #0F4C81, #38BDF8)",
                      borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontWeight: 700, fontSize: "0.85rem",
                    }}>{r.name[0]}</div>
                    <div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0F4C81" }}>{r.name}</div>
                      <div style={{ fontSize: "0.65rem", color: "#94A3B8" }}>{r.date}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[1,2,3,4,5].map(i => <IconStar key={i} filled={i <= r.rating} />)}
                  </div>
                </div>
                <p style={{ fontSize: "0.8rem", color: "#475569", lineHeight: 1.6 }}>{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: "white", borderTop: "1px solid rgba(15,76,129,0.08)",
        padding: "16px 20px 32px",
        boxShadow: "0 -4px 20px rgba(15,76,129,0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Qty selector */}
          <div style={{
            display: "flex", alignItems: "center", gap: 0,
            background: "#F1F5F9", borderRadius: 12, overflow: "hidden",
          }}>
            <button onClick={() => qty > 1 && setQty(q => q - 1)} style={{
              width: 38, height: 48, border: "none", background: "transparent",
              color: "#0F4C81", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}><IconMinus /></button>
            <span style={{ width: 32, textAlign: "center", fontSize: "0.9rem", fontWeight: 700, color: "#0F4C81" }}>{qty}</span>
            <button onClick={() => setQty(q => q + 1)} style={{
              width: 38, height: 48, border: "none", background: "transparent",
              color: "#0F4C81", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}><IconPlus /></button>
          </div>

          {/* Add to cart */}
          <button onClick={handleAdd} style={{
            flex: 1, padding: "14px 0",
            background: added ? "#059669" : "linear-gradient(135deg, #10B981, #059669)",
            border: "none", borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            color: "white", fontFamily: "'Poppins', sans-serif",
            fontSize: "0.9rem", fontWeight: 600, cursor: "pointer",
            boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
            transition: "all 0.3s",
          }}>
            {added ? (
              <><IconCheck /> Ajouté !</>
            ) : (
              <><IconCart /> Commander</>
            )}
          </button>
        </div>

        {/* Price info */}
        {selectedPharma && (
          <div style={{ textAlign: "center", marginTop: 8, fontSize: "0.72rem", color: "#94A3B8" }}>
            {selectedPharma.name} · {selectedPharma.price * qty} FCFA · Livraison {selectedPharma.delivery}
          </div>
        )}
      </div>
    </div>
  );
}
