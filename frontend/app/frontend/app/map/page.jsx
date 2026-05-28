"use client";
import { useState } from "react";

// ─── ICONS ────────────────────────────────────────────────────────────────────
const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const IconFilter = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const IconStar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.89a16 16 0 0 0 6.06 6.06l1.06-1.06a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconNav = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
  </svg>
);
const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PHARMACIES = [
  {
    id: 1, name: "Pharmacie Centrale", dist: "200 m", city: "Douala",
    open: true, guard: false, certified: true, rating: 4.8, reviews: 120,
    address: "Rue Joss, Akwa, Douala", phone: "+237 233 42 15 60",
    hours: "7h00 – 22h00", delivery: "30 min", price: "⭐ Prix moyen",
    top: 22, left: 95, color: "#10B981",
    meds: ["Paracétamol 500mg", "Amoxicilline", "Coartem"],
  },
  {
    id: 2, name: "Pharmacie du Marché", dist: "640 m", city: "Douala",
    open: true, guard: true, certified: false, rating: 4.0, reviews: 78,
    address: "Marché Central, Douala", phone: "+237 233 42 28 90",
    hours: "24h/24 (garde)", delivery: "45 min", price: "💰 Prix bas",
    top: 35, left: 195, color: "#0F4C81",
    meds: ["Paracétamol", "Ibuprofène", "Metformine"],
  },
  {
    id: 3, name: "Pharmacie de la Paix", dist: "1.1 km", city: "Douala",
    open: true, guard: false, certified: true, rating: 4.7, reviews: 203,
    address: "Av. de Gaulle, Bonanjo, Douala", phone: "+237 233 42 07 11",
    hours: "8h00 – 20h00", delivery: "35 min", price: "⭐ Prix moyen",
    top: 65, left: 295, color: "#38BDF8",
    meds: ["Coartem 80/480", "Metformine", "Amlodipine"],
  },
  {
    id: 4, name: "Pharmacie Bonabéri", dist: "2.3 km", city: "Douala",
    open: false, guard: false, certified: true, rating: 4.2, reviews: 56,
    address: "Bonabéri, Douala", phone: "+237 233 39 14 22",
    hours: "8h00 – 19h00", delivery: "60 min", price: "💰 Prix bas",
    top: 100, left: 145, color: "#94A3B8",
    meds: ["Paracétamol", "Amoxicilline"],
  },
];

const FILTERS = ["Toutes", "Ouvertes", "De garde", "Certifiées DPML", "< 500m"];

// ─── MAP COMPONENT ────────────────────────────────────────────────────────────
function MapView({ pharmacies, selected, onSelect }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "linear-gradient(135deg, #e8f4f8, #d1ecf7)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(15,76,129,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,76,129,0.05) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}/>

      {/* Roads */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.35 }}>
        <line x1="0" y1="85" x2="500" y2="85" stroke="#0F4C81" strokeWidth="4"/>
        <line x1="0" y1="145" x2="500" y2="145" stroke="#0F4C81" strokeWidth="2"/>
        <line x1="130" y1="0" x2="130" y2="300" stroke="#0F4C81" strokeWidth="4"/>
        <line x1="250" y1="0" x2="250" y2="300" stroke="#0F4C81" strokeWidth="2"/>
        <line x1="0" y1="115" x2="500" y2="115" stroke="#0F4C81" strokeWidth="1"/>
        <line x1="60" y1="0" x2="200" y2="300" stroke="#0F4C81" strokeWidth="1.5" opacity="0.5"/>
        <line x1="320" y1="0" x2="420" y2="300" stroke="#0F4C81" strokeWidth="1" opacity="0.4"/>
        {/* Road labels */}
        <text x="10" y="80" fontSize="9" fill="#0F4C81" opacity="0.5">Rue Joss</text>
        <text x="135" y="50" fontSize="9" fill="#0F4C81" opacity="0.5">Av. de Gaulle</text>
      </svg>

      {/* User location */}
      <div style={{
        position: "absolute", top: 75, left: 125,
        width: 16, height: 16,
        background: "#38BDF8",
        borderRadius: "50%",
        border: "3px solid white",
        boxShadow: "0 0 0 8px rgba(56,189,248,0.2)",
        zIndex: 10,
        transform: "translate(-50%, -50%)",
      }}/>
      <div style={{
        position: "absolute", top: 58, left: 108,
        background: "white", borderRadius: 6,
        padding: "2px 6px", fontSize: "0.6rem",
        fontWeight: 700, color: "#38BDF8",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        whiteSpace: "nowrap",
      }}>Vous êtes ici</div>

      {/* Pins */}
      {pharmacies.map(p => (
        <div key={p.id}
          onClick={() => onSelect(selected?.id === p.id ? null : p)}
          style={{
            position: "absolute", top: p.top, left: p.left,
            display: "flex", flexDirection: "column", alignItems: "center",
            cursor: "pointer", zIndex: selected?.id === p.id ? 20 : 5,
            transform: "translate(-50%, 0)",
            transition: "transform 0.2s",
          }}>
          <div style={{
            width: selected?.id === p.id ? 40 : 32,
            height: selected?.id === p.id ? 40 : 32,
            borderRadius: "50% 50% 50% 0",
            transform: "rotate(-45deg)",
            background: p.open ? p.color : "#94A3B8",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: selected?.id === p.id ? `0 4px 16px ${p.color}60` : "0 4px 12px rgba(0,0,0,0.2)",
            border: selected?.id === p.id ? "2px solid white" : "none",
            transition: "all 0.2s",
          }}>
            <span style={{ transform: "rotate(45deg)", color: "white", fontSize: selected?.id === p.id ? 16 : 13, fontWeight: 700 }}>+</span>
          </div>
          <div style={{
            background: "white", borderRadius: 8,
            padding: "3px 8px", marginTop: 5,
            fontSize: "0.62rem", fontWeight: 700, color: "#0F4C81",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            whiteSpace: "nowrap",
            opacity: selected?.id === p.id ? 1 : 0.85,
          }}>{p.name.split(" ").slice(0, 2).join(" ")}</div>
        </div>
      ))}

      {/* Scale */}
      <div style={{
        position: "absolute", bottom: 12, right: 12,
        background: "rgba(255,255,255,0.9)", borderRadius: 8,
        padding: "4px 10px", fontSize: "0.65rem", fontWeight: 600, color: "#0F4C81",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <div style={{ width: 30, height: 2, background: "#0F4C81" }}/>
        500m
      </div>

      {/* OSM credit */}
      <div style={{
        position: "absolute", bottom: 12, left: 12,
        fontSize: "0.55rem", color: "rgba(15,76,129,0.4)",
      }}>© OpenStreetMap</div>
    </div>
  );
}

// ─── PHARMACY CARD ────────────────────────────────────────────────────────────
function PharmacyListCard({ pharmacy, selected, onSelect }) {
  const isSelected = selected?.id === pharmacy.id;
  return (
    <div onClick={() => onSelect(isSelected ? null : pharmacy)}
      style={{
        background: "white", borderRadius: 16,
        padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 14,
        border: isSelected ? "1.5px solid #10B981" : "1px solid rgba(15,76,129,0.06)",
        boxShadow: isSelected ? "0 4px 20px rgba(16,185,129,0.15)" : "0 2px 8px rgba(15,76,129,0.06)",
        cursor: "pointer", transition: "all 0.2s", flexShrink: 0,
        minWidth: 280,
      }}>
      <div style={{
        width: 44, height: 44,
        background: pharmacy.open
          ? "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(110,231,183,0.2))"
          : "rgba(148,163,184,0.1)",
        borderRadius: 12,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, color: pharmacy.open ? "#10B981" : "#94A3B8",
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <rect x="9" y="13" width="6" height="8"/>
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0F4C81", marginBottom: 3 }}>{pharmacy.name}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
          <span style={{ fontSize: "0.7rem", color: "#94A3B8" }}>📍 {pharmacy.dist}</span>
          {pharmacy.open
            ? <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "1px 7px", borderRadius: 20, background: "rgba(16,185,129,0.1)", color: "#10B981" }}>Ouverte</span>
            : <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "1px 7px", borderRadius: 20, background: "rgba(148,163,184,0.1)", color: "#94A3B8" }}>Fermée</span>
          }
          {pharmacy.guard && <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "1px 7px", borderRadius: 20, background: "rgba(56,189,248,0.1)", color: "#38BDF8" }}>De garde</span>}
          {pharmacy.certified && <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "1px 7px", borderRadius: 20, background: "rgba(15,76,129,0.08)", color: "#0F4C81" }}>✓ DPML</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.72rem", color: "#0F4C81", fontWeight: 600 }}>
          <IconStar /> {pharmacy.rating} · {pharmacy.reviews} avis · {pharmacy.delivery}
        </div>
      </div>
      <div style={{
        width: 32, height: 32,
        background: isSelected ? "linear-gradient(135deg, #10B981, #059669)" : "#F1F5F9",
        borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: isSelected ? "white" : "#94A3B8", flexShrink: 0,
        transition: "all 0.2s",
      }}>
        <IconArrow />
      </div>
    </div>
  );
}

// ─── PHARMACY DETAIL SHEET ────────────────────────────────────────────────────
function PharmacySheet({ pharmacy, onClose }) {
  if (!pharmacy) return null;
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      background: "white", borderRadius: "24px 24px 0 0",
      padding: 24, zIndex: 200,
      boxShadow: "0 -8px 40px rgba(15,76,129,0.15)",
      animation: "slideUp 0.3s ease",
    }}>
      {/* Handle */}
      <div style={{ width: 40, height: 4, background: "#E2E8F0", borderRadius: 2, margin: "0 auto 20px" }}/>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "1rem", fontWeight: 800, color: "#0F4C81", marginBottom: 6 }}>{pharmacy.name}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {pharmacy.open
              ? <span style={{ fontSize: "0.7rem", fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "rgba(16,185,129,0.1)", color: "#10B981" }}>🟢 Ouverte</span>
              : <span style={{ fontSize: "0.7rem", fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "rgba(148,163,184,0.1)", color: "#94A3B8" }}>🔴 Fermée</span>
            }
            {pharmacy.guard && <span style={{ fontSize: "0.7rem", fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "rgba(56,189,248,0.1)", color: "#38BDF8" }}>De garde</span>}
            {pharmacy.certified && <span style={{ fontSize: "0.7rem", fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "rgba(15,76,129,0.08)", color: "#0F4C81" }}>✓ DPML</span>}
          </div>
        </div>
        <button onClick={onClose} style={{
          width: 36, height: 36, border: "none", background: "#F1F5F9",
          borderRadius: 10, cursor: "pointer", color: "#94A3B8",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}><IconX /></button>
      </div>

      {/* Info grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { icon: "📍", label: "Adresse", val: pharmacy.address },
          { icon: "🕐", label: "Horaires", val: pharmacy.hours },
          { icon: "🚴", label: "Livraison", val: pharmacy.delivery },
          { icon: "💰", label: "Tarif", val: pharmacy.price },
        ].map(item => (
          <div key={item.label} style={{
            background: "#F8FAFC", borderRadius: 12, padding: 12,
          }}>
            <div style={{ fontSize: "0.65rem", color: "#94A3B8", marginBottom: 3 }}>{item.icon} {item.label}</div>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0F4C81" }}>{item.val}</div>
          </div>
        ))}
      </div>

      {/* Rating */}
      <div style={{
        background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(56,189,248,0.06))",
        border: "1px solid rgba(16,185,129,0.15)",
        borderRadius: 12, padding: 12, marginBottom: 16,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0F4C81" }}>{pharmacy.rating}</div>
          <div style={{ display: "flex", gap: 2 }}>
            {[1,2,3,4,5].map(i => (
              <IconStar key={i} />
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0F4C81" }}>{pharmacy.reviews} avis clients</div>
          <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>Certifiée DPML — Confiance garantie</div>
        </div>
      </div>

      {/* Available meds */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0F4C81", marginBottom: 8 }}>Médicaments disponibles</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {pharmacy.meds.map(m => (
            <span key={m} style={{
              background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: 20, padding: "4px 12px",
              fontSize: "0.72rem", color: "#10B981", fontWeight: 500,
            }}>💊 {m}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10 }}>
        <a href={`tel:${pharmacy.phone}`} style={{
          flex: 1, padding: 14,
          background: "#F1F5F9", border: "none", borderRadius: 14,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          fontSize: "0.82rem", fontWeight: 600, color: "#0F4C81",
          cursor: "pointer", textDecoration: "none",
        }}>
          <IconPhone /> Appeler
        </a>
        <button style={{
          flex: 2, padding: 14,
          background: "linear-gradient(135deg, #10B981, #059669)", border: "none", borderRadius: 14,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          fontSize: "0.82rem", fontWeight: 600, color: "white", cursor: "pointer",
          boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
        }}>
          <IconNav /> Commander ici
        </button>
      </div>

      <style>{`@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function CartePage() {
  const [selected, setSelected] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Toutes");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("map"); // map | list

  const filtered = PHARMACIES.filter(p => {
    if (activeFilter === "Ouvertes") return p.open;
    if (activeFilter === "De garde") return p.guard;
    if (activeFilter === "Certifiées DPML") return p.certified;
    if (activeFilter === "< 500m") return parseInt(p.dist) < 500;
    return true;
  }).filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      background: "#F8FAFC",
      height: "100vh",
      maxWidth: 430, margin: "0 auto",
      position: "relative",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>

      {/* ── TOP BAR ── */}
      <div style={{
        background: "white",
        padding: "12px 16px 0",
        borderBottom: "1px solid rgba(15,76,129,0.08)",
        zIndex: 50,
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 800, color: "#0F4C81" }}>Pharmacies</div>
            <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
              {filtered.filter(p => p.open).length} ouvertes · Douala
            </div>
          </div>
          {/* View toggle */}
          <div style={{
            display: "flex", background: "#F1F5F9", borderRadius: 10, padding: 3,
          }}>
            {["map", "list"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "6px 14px", border: "none", borderRadius: 8,
                background: view === v ? "white" : "transparent",
                color: view === v ? "#0F4C81" : "#94A3B8",
                fontFamily: "'Poppins', sans-serif", fontSize: "0.72rem", fontWeight: 600,
                cursor: "pointer",
                boxShadow: view === v ? "0 2px 8px rgba(15,76,129,0.1)" : "none",
                transition: "all 0.2s",
              }}>
                {v === "map" ? "🗺️ Carte" : "📋 Liste"}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "#F8FAFC", borderRadius: 12,
          padding: "10px 14px", marginBottom: 12,
          border: "1px solid rgba(15,76,129,0.08)",
        }}>
          <span style={{ color: "#94A3B8" }}><IconSearch /></span>
          <input
            type="text"
            placeholder="Rechercher une pharmacie…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, border: "none", outline: "none",
              fontFamily: "'Poppins', sans-serif", fontSize: "0.85rem",
              color: "#0F4C81", background: "transparent",
            }}
          />
          <button style={{
            background: "#F1F5F9", border: "none", borderRadius: 8,
            padding: "6px 10px", cursor: "pointer", color: "#0F4C81",
            display: "flex", alignItems: "center", gap: 4,
            fontFamily: "'Poppins', sans-serif", fontSize: "0.72rem", fontWeight: 600,
          }}>
            <IconFilter /> Filtrer
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding: "6px 14px", border: "none", borderRadius: 20, flexShrink: 0,
              background: activeFilter === f ? "#0F4C81" : "#F1F5F9",
              color: activeFilter === f ? "white" : "#94A3B8",
              fontFamily: "'Poppins', sans-serif", fontSize: "0.72rem", fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s",
            }}>{f}</button>
          ))}
        </div>
      </div>

      {/* ── MAP VIEW ── */}
      {view === "map" && (
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <MapView pharmacies={filtered} selected={selected} onSelect={setSelected} />

          {/* Horizontal cards */}
          {!selected && (
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              padding: "0 16px 24px",
              background: "linear-gradient(transparent, rgba(232,244,248,0.8))",
            }}>
              <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
                {filtered.map(p => (
                  <PharmacyListCard key={p.id} pharmacy={p} selected={selected} onSelect={setSelected} />
                ))}
              </div>
            </div>
          )}

          {/* Detail sheet */}
          {selected && (
            <div style={{ position: "absolute", inset: 0, zIndex: 100 }}>
              <div onClick={() => setSelected(null)} style={{
                position: "absolute", inset: 0,
                background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)",
              }}/>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
                <PharmacySheet pharmacy={selected} onClose={() => setSelected(null)} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── LIST VIEW ── */}
      {view === "list" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 100px" }}>
          <div style={{ fontSize: "0.78rem", color: "#94A3B8", marginBottom: 12, fontWeight: 500 }}>
            {filtered.length} pharmacie{filtered.length > 1 ? "s" : ""} trouvée{filtered.length > 1 ? "s" : ""}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map(p => (
              <div key={p.id}
                onClick={() => setSelected(selected?.id === p.id ? null : p)}
                style={{
                  background: "white", borderRadius: 16, padding: "16px",
                  border: selected?.id === p.id ? "1.5px solid #10B981" : "1px solid rgba(15,76,129,0.06)",
                  boxShadow: "0 2px 8px rgba(15,76,129,0.06)",
                  cursor: "pointer", transition: "all 0.2s",
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 48, height: 48,
                    background: p.open ? "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(110,231,183,0.2))" : "rgba(148,163,184,0.1)",
                    borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                    color: p.open ? "#10B981" : "#94A3B8", flexShrink: 0,
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <rect x="9" y="13" width="6" height="8"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0F4C81", marginBottom: 4 }}>{p.name}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {p.open
                        ? <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "rgba(16,185,129,0.1)", color: "#10B981" }}>Ouverte</span>
                        : <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "rgba(148,163,184,0.1)", color: "#94A3B8" }}>Fermée</span>
                      }
                      {p.guard && <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "rgba(56,189,248,0.1)", color: "#38BDF8" }}>De garde</span>}
                      {p.certified && <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "rgba(15,76,129,0.08)", color: "#0F4C81" }}>✓ DPML</span>}
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[
                    { icon: "📍", val: p.dist },
                    { icon: "🚴", val: p.delivery },
                    { icon: "⭐", val: `${p.rating}/5` },
                  ].map(item => (
                    <div key={item.val} style={{
                      background: "#F8FAFC", borderRadius: 10, padding: "8px",
                      textAlign: "center",
                    }}>
                      <div style={{ fontSize: "0.7rem", marginBottom: 2 }}>{item.icon}</div>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#0F4C81" }}>{item.val}</div>
                    </div>
                  ))}
                </div>

                {selected?.id === p.id && (
                  <button style={{
                    width: "100%", marginTop: 12,
                    background: "linear-gradient(135deg, #10B981, #059669)",
                    border: "none", borderRadius: 12, padding: 12,
                    color: "white", fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
                  }}>
                    Commander ici →
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Detail sheet for list view */}
          {selected && view === "list" && (
            <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
              <div onClick={() => setSelected(null)} style={{
                position: "absolute", inset: 0,
                background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
              }}/>
              <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430 }}>
                <PharmacySheet pharmacy={selected} onClose={() => setSelected(null)} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
