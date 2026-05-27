"use client";
import { useState } from "react";

// ─── ICONS ───────────────────────────────────────────────────────────────────
const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const IconMapPin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
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
const IconFile = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="12" y1="18" x2="12" y2="12"/>
    <line x1="9" y1="15" x2="15" y2="15"/>
  </svg>
);
const IconHome = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#10B981" : "#94A3B8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconCompass = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#10B981" : "#94A3B8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);
const IconMap = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#10B981" : "#94A3B8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconDoc = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#10B981" : "#94A3B8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);
const IconUser = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#10B981" : "#94A3B8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PHARMACIES = [
  { id: 1, name: "Pharmacie Centrale", dist: "200 m", city: "Douala", open: true, guard: false, certified: true, rating: 4.8, reviews: 120 },
  { id: 2, name: "Pharmacie du Marché", dist: "640 m", city: "Douala", open: true, guard: true, certified: false, rating: 4.0, reviews: 78 },
  { id: 3, name: "Pharmacie de la Paix", dist: "1.1 km", city: "Douala", open: true, guard: false, certified: true, rating: 4.7, reviews: 203 },
];

const MEDICINES = [
  { id: 1, emoji: "💊", name: "Paracétamol 500mg", dci: "Doliprane · CPNN", count: 12 },
  { id: 2, emoji: "🧪", name: "Amoxicilline 500mg", dci: "Clamoxyl · CPNN", count: 8 },
  { id: 3, emoji: "💉", name: "Coartem 80/480", dci: "Artéméther · CPNN", count: 15 },
  { id: 4, emoji: "🩺", name: "Metformine 500mg", dci: "Glucophage · CPNN", count: 6 },
];

const TAGS = ["💊 Paracétamol", "🤒 Fièvre", "💉 Antipaludéen", "📋 Ordonnance"];

const STEPS = [
  { n: 1, title: "Recherchez votre médicament", desc: "Par nom, pathologie ou en scannant votre ordonnance ONMC" },
  { n: 2, title: "Choisissez la pharmacie", desc: "Comparez prix et disponibilité dans les officines agréées DPML" },
  { n: 3, title: "Payez par Mobile Money", desc: "Orange Money ou MTN MoMo — paiement sécurisé en un clic" },
  { n: 4, title: "Suivez votre livraison", desc: "Votre livreur identifié arrive chez vous en 30 à 60 minutes" },
];

const NAV_ITEMS = [
  { label: "Accueil", icon: (a) => <IconHome active={a} /> },
  { label: "Recherche", icon: (a) => <IconCompass active={a} /> },
  { label: "Carte", icon: (a) => <IconMap active={a} /> },
  { label: "Ordonnances", icon: (a) => <IconDoc active={a} /> },
  { label: "Profil", icon: (a) => <IconUser active={a} /> },
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function PharmacyCard({ pharmacy }) {
  return (
    <div style={{
      background: "white",
      borderRadius: 16,
      padding: "14px 16px",
      display: "flex",
      alignItems: "center",
      gap: 14,
      border: "1px solid rgba(15,76,129,0.06)",
      boxShadow: "0 2px 8px rgba(15,76,129,0.08)",
      cursor: "pointer",
      transition: "all 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      {/* Icon */}
      <div style={{
        width: 48, height: 48,
        background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(110,231,183,0.2))",
        borderRadius: 12,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, color: "#10B981",
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <rect x="9" y="13" width="6" height="8"/>
        </svg>
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0F4C81", marginBottom: 3 }}>
          {pharmacy.name}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
          <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>📍 {pharmacy.dist} · {pharmacy.city}</span>
          {pharmacy.open && (
            <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "rgba(16,185,129,0.1)", color: "#10B981" }}>Ouverte</span>
          )}
          {pharmacy.guard && (
            <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "rgba(56,189,248,0.1)", color: "#38BDF8" }}>De garde</span>
          )}
          {pharmacy.certified && (
            <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "rgba(15,76,129,0.08)", color: "#0F4C81" }}>✓ DPML</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: "0.75rem", fontWeight: 600, color: "#0F4C81" }}>
          <IconStar /> {pharmacy.rating} · {pharmacy.reviews} avis
        </div>
      </div>

      {/* CTA */}
      <div style={{
        width: 36, height: 36,
        background: "linear-gradient(135deg, #10B981, #059669)",
        borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 4px 10px rgba(16,185,129,0.3)",
        color: "white",
        cursor: "pointer",
      }}>
        <IconArrow />
      </div>
    </div>
  );
}

function MedicineCard({ med }) {
  return (
    <div style={{
      background: "white",
      borderRadius: 16,
      padding: 16,
      minWidth: 150,
      boxShadow: "0 2px 8px rgba(15,76,129,0.08)",
      border: "1px solid rgba(15,76,129,0.06)",
      flexShrink: 0,
      cursor: "pointer",
    }}>
      <div style={{
        width: "100%", height: 80,
        background: "linear-gradient(135deg, #F1F5F9, #e2eaf4)",
        borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 10,
        fontSize: "2rem",
      }}>{med.emoji}</div>
      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0F4C81", marginBottom: 4 }}>{med.name}</div>
      <div style={{ fontSize: "0.68rem", color: "#94A3B8", marginBottom: 8 }}>{med.dci}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.7rem", color: "#10B981", fontWeight: 600 }}>{med.count} pharmacies</span>
        <div style={{
          width: 26, height: 26,
          background: "#10B981",
          borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", cursor: "pointer",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [activeNav, setActiveNav] = useState(0);
  const [search, setSearch] = useState("");

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      background: "#F8FAFC",
      minHeight: "100vh",
      maxWidth: 430,
      margin: "0 auto",
      position: "relative",
    }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(15,76,129,0.08)",
        padding: "0 20px",
        height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: "linear-gradient(135deg, #10B981, #6EE7B7)",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="2"/>
              <rect x="8" y="10.5" width="8" height="3" rx="1.5" fill="white"/>
              <rect x="10.5" y="8" width="3" height="8" rx="1.5" fill="white"/>
            </svg>
          </div>
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F4C81" }}>
            PROXY<span style={{ color: "#10B981" }}>PHARMA</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{
            padding: "8px 14px", borderRadius: 10, border: "none",
            background: "transparent", color: "#0F4C81",
            fontFamily: "'Poppins', sans-serif", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
          }}>Connexion</button>
          <button style={{
            padding: "8px 14px", borderRadius: 10, border: "none",
            background: "#10B981", color: "white",
            fontFamily: "'Poppins', sans-serif", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
            boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
          }}>Inscription</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{
        background: "linear-gradient(150deg, #0F4C81 0%, #0a3a6e 60%, #0d4a7a 100%)",
        padding: "48px 20px 64px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Glow effects */}
        <div style={{
          position: "absolute", top: -80, right: -80,
          width: 300, height: 300,
          background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }}/>

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(16,185,129,0.15)",
          border: "1px solid rgba(16,185,129,0.3)",
          borderRadius: 20, padding: "5px 12px", marginBottom: 20,
        }}>
          <div style={{ width: 6, height: 6, background: "#10B981", borderRadius: "50%" }}/>
          <span style={{ fontSize: "0.72rem", color: "#6EE7B7", fontWeight: 500 }}>
            1 950+ pharmacies référencées
          </span>
        </div>

        <h1 style={{
          fontSize: "2rem", fontWeight: 800, color: "white",
          lineHeight: 1.2, marginBottom: 12, position: "relative", zIndex: 1,
        }}>
          Vos médicaments,<br/>
          livrés en <span style={{ color: "#10B981" }}>30 min</span>
        </h1>

        <p style={{
          color: "rgba(255,255,255,0.7)", fontSize: "0.9rem",
          lineHeight: 1.6, marginBottom: 28, maxWidth: 320,
        }}>
          Recherchez, comparez et commandez vos médicaments certifiés dans les pharmacies agréées de Douala et Yaoundé.
        </p>

        {/* Search */}
        <div style={{
          background: "white", borderRadius: 18,
          padding: "6px 6px 6px 16px",
          display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 20px 60px rgba(15,76,129,0.18)",
          marginBottom: 16,
        }}>
          <span style={{ color: "#94A3B8", display: "flex" }}><IconSearch /></span>
          <input
            type="text"
            placeholder="Rechercher un médicament, une pathologie…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, border: "none", outline: "none",
              fontFamily: "'Poppins', sans-serif", fontSize: "0.9rem",
              color: "#0F4C81", background: "transparent",
            }}
          />
          <button style={{
            background: "linear-gradient(135deg, #10B981, #059669)",
            border: "none", borderRadius: 12,
            width: 44, height: 44,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "white", flexShrink: 0,
          }}>
            <IconSearch />
          </button>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TAGS.map(tag => (
            <button key={tag} onClick={() => setSearch(tag.replace(/^[^\w]+/, "").trim())}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 20, padding: "5px 12px",
                fontSize: "0.75rem", color: "rgba(255,255,255,0.85)",
                cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: 500,
              }}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{
        display: "flex", gap: 12, padding: "0 20px",
        marginTop: -20, position: "relative", zIndex: 10, marginBottom: 28,
      }}>
        {[
          { val: "30", unit: "min", label: "Délai livraison" },
          { val: "1950", unit: "+", label: "Officines" },
          { val: "100", unit: "%", label: "Certifiées DPML" },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, background: "white", borderRadius: 14,
            padding: "14px 12px", textAlign: "center",
            boxShadow: "0 8px 32px rgba(15,76,129,0.14)",
          }}>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F4C81", lineHeight: 1, marginBottom: 4 }}>
              {s.val}<span style={{ color: "#10B981" }}>{s.unit}</span>
            </div>
            <div style={{ fontSize: "0.65rem", color: "#94A3B8", fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── MAP PREVIEW ── */}
      <div style={{
        background: "linear-gradient(135deg, #e8f4f8, #d1ecf7)",
        borderRadius: 18, height: 180, margin: "0 20px 28px",
        position: "relative", overflow: "hidden", cursor: "pointer",
        border: "1px solid rgba(56,189,248,0.2)",
        boxShadow: "0 2px 8px rgba(15,76,129,0.08)",
      }}>
        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(15,76,129,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,76,129,0.06) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}/>
        {/* Pins */}
        {[
          { top: 20, left: 90, label: "Phcie Centrale", color: "#10B981" },
          { top: 30, left: 190, label: "Phcie du Marché", color: "#0F4C81" },
          { top: 60, left: 290, label: "Phcie de la Paix", color: "#38BDF8" },
        ].map(pin => (
          <div key={pin.label} style={{ position: "absolute", top: pin.top, left: pin.left, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)",
              background: pin.color, display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}>
              <span style={{ transform: "rotate(45deg)", color: "white", fontSize: 12, fontWeight: 700 }}>+</span>
            </div>
            <div style={{
              background: "white", borderRadius: 6, padding: "2px 6px",
              fontSize: "0.6rem", fontWeight: 700, color: "#0F4C81",
              marginTop: 4, boxShadow: "0 2px 8px rgba(15,76,129,0.08)",
              whiteSpace: "nowrap",
            }}>{pin.label}</div>
          </div>
        ))}
        {/* Overlay */}
        <div style={{
          position: "absolute", bottom: 12, left: 12, right: 12,
          background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)",
          borderRadius: 12, padding: "10px 14px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0F4C81" }}>Autour de vous — Douala</div>
            <div style={{ fontSize: "0.68rem", color: "#94A3B8" }}>12 pharmacies ouvertes maintenant</div>
          </div>
          <button style={{
            background: "#10B981", color: "white", border: "none",
            borderRadius: 8, padding: "7px 12px",
            fontFamily: "'Poppins', sans-serif", fontSize: "0.72rem", fontWeight: 600, cursor: "pointer",
          }}>Voir la carte</button>
        </div>
      </div>

      {/* ── PHARMACIES ── */}
      <div style={{ padding: "0 20px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: "1rem", fontWeight: 700, color: "#0F4C81" }}>Pharmacies proches</span>
          <span style={{ fontSize: "0.78rem", color: "#10B981", fontWeight: 600, cursor: "pointer" }}>Voir tout →</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {PHARMACIES.map(p => <PharmacyCard key={p.id} pharmacy={p} />)}
        </div>
      </div>

      {/* ── ORDONNANCE ── */}
      <div style={{
        margin: "0 20px 20px",
        background: "linear-gradient(135deg, rgba(56,189,248,0.08), rgba(16,185,129,0.08))",
        border: "1.5px dashed rgba(16,185,129,0.3)",
        borderRadius: 16, padding: 16,
        display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
      }}>
        <div style={{
          width: 44, height: 44,
          background: "linear-gradient(135deg, #10B981, #6EE7B7)",
          borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <IconFile />
        </div>
        <div>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0F4C81" }}>Scanner une ordonnance</div>
          <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Téléversez votre ordonnance ONMC · PDF ou photo</div>
        </div>
      </div>

      {/* ── MEDICINES ── */}
      <div style={{ padding: "0 20px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: "1rem", fontWeight: 700, color: "#0F4C81" }}>Médicaments courants</span>
          <span style={{ fontSize: "0.78rem", color: "#10B981", fontWeight: 600, cursor: "pointer" }}>Voir tout →</span>
        </div>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
          {MEDICINES.map(m => <MedicineCard key={m.id} med={m} />)}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{
        background: "linear-gradient(135deg, #0F4C81, #0a3a6e)",
        padding: "32px 20px", marginBottom: 28,
      }}>
        <div style={{ fontSize: "1rem", fontWeight: 700, color: "white", marginBottom: 4 }}>Comment ça marche ?</div>
        <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", marginBottom: 24 }}>Commandez en 3 minutes</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {STEPS.map(step => (
            <div key={step.n} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{
                width: 32, height: 32,
                background: "rgba(16,185,129,0.15)",
                border: "1.5px solid rgba(16,185,129,0.4)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.78rem", fontWeight: 700, color: "#10B981", flexShrink: 0,
              }}>{step.n}</div>
              <div style={{ paddingTop: 4 }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "white", marginBottom: 2 }}>{step.title}</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SPACER */}
      <div style={{ height: 100 }} />

      {/* ── BOTTOM NAV ── */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: "white",
        borderTop: "1px solid rgba(15,76,129,0.08)",
        display: "flex", padding: "8px 0 20px",
        zIndex: 100,
        boxShadow: "0 -4px 20px rgba(15,76,129,0.08)",
      }}>
        {NAV_ITEMS.map((item, i) => (
          <button key={item.label} onClick={() => setActiveNav(i)}
            style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              cursor: "pointer", padding: "6px 0",
              background: "transparent", border: "none", fontFamily: "'Poppins', sans-serif",
            }}>
            {item.icon(activeNav === i)}
            <span style={{ fontSize: "0.62rem", fontWeight: 500, color: activeNav === i ? "#10B981" : "#94A3B8" }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
