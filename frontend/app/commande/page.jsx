"use client";
import { useState } from "react";

// ─── ICONS ────────────────────────────────────────────────────────────────────
const IconArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconUpload = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/>
    <line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);
const IconStar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconMapPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ORDER = {
  med: { name: "Paracétamol 500mg", brand: "Doliprane", emoji: "💊", qty: 2 },
  pharma: { name: "Pharmacie Centrale", dist: "200 m", rating: 4.8, delivery: "30 min", certified: true },
  price: { med: 850, delivery: 500, total: 2200 },
};

const PAYMENT_METHODS = [
  { id: "orange", label: "Orange Money", emoji: "🟠", color: "#FF6600", desc: "+237 6XX XXX XXX" },
  { id: "mtn", label: "MTN MoMo", emoji: "🟡", color: "#FFCC00", desc: "+237 6XX XXX XXX" },
  { id: "cash", label: "Espèces à la livraison", emoji: "💵", color: "#10B981", desc: "Payez à la réception" },
];

// ─── STEP INDICATOR ───────────────────────────────────────────────────────────
function StepIndicator({ step }) {
  const steps = ["Médicament", "Pharmacie", "Paiement"];
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "0 20px" }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: i < step ? "#10B981" : i === step ? "#0F4C81" : "#E2E8F0",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.3s",
              boxShadow: i === step ? "0 4px 12px rgba(15,76,129,0.3)" : "none",
            }}>
              {i < step
                ? <IconCheck />
                : <span style={{ fontSize: "0.78rem", fontWeight: 700, color: i === step ? "white" : "#94A3B8" }}>{i + 1}</span>
              }
            </div>
            <span style={{ fontSize: "0.6rem", fontWeight: 600, color: i <= step ? "#0F4C81" : "#94A3B8", whiteSpace: "nowrap" }}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              flex: 1, height: 2, margin: "0 8px", marginBottom: 16,
              background: i < step ? "#10B981" : "#E2E8F0",
              transition: "all 0.3s",
            }}/>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── STEP 1 — MÉDICAMENT ─────────────────────────────────────────────────────
function Step1({ onNext }) {
  const [qty, setQty] = useState(2);
  const [ordonnance, setOrdonnance] = useState(null);
  const [address, setAddress] = useState("");

  return (
    <div style={{ padding: "20px 20px 140px", display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Med summary */}
      <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(15,76,129,0.06)" }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Médicament sélectionné</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 56, height: 56,
            background: "linear-gradient(135deg, #F1F5F9, #e2eaf4)",
            borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.8rem", flexShrink: 0,
          }}>💊</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0F4C81" }}>Paracétamol 500mg</div>
            <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Doliprane · CPNN-2024-0142</div>
            <div style={{ fontSize: "0.7rem", color: "#10B981", fontWeight: 600, marginTop: 4 }}>850 FCFA / boîte</div>
          </div>
          {/* Qty */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, background: "#F1F5F9", borderRadius: 10, overflow: "hidden" }}>
            <button onClick={() => qty > 1 && setQty(q => q - 1)} style={{
              width: 32, height: 36, border: "none", background: "transparent",
              fontSize: "1.1rem", color: "#0F4C81", cursor: "pointer", fontWeight: 700,
            }}>−</button>
            <span style={{ width: 28, textAlign: "center", fontSize: "0.85rem", fontWeight: 700, color: "#0F4C81" }}>{qty}</span>
            <button onClick={() => setQty(q => q + 1)} style={{
              width: 32, height: 36, border: "none", background: "transparent",
              fontSize: "1.1rem", color: "#0F4C81", cursor: "pointer", fontWeight: 700,
            }}>+</button>
          </div>
        </div>
      </div>

      {/* Ordonnance upload */}
      <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(15,76,129,0.06)" }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Ordonnance</div>
        <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: 12 }}>Obligatoire — Décision ONMC juillet 2024</div>

        {ordonnance ? (
          <div style={{
            background: "rgba(16,185,129,0.06)", border: "1.5px solid rgba(16,185,129,0.3)",
            borderRadius: 12, padding: 14,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 40, height: 40, background: "#10B981", borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0F4C81" }}>ordonnance.pdf</div>
              <div style={{ fontSize: "0.68rem", color: "#10B981" }}>✓ Téléversée avec succès</div>
            </div>
            <button onClick={() => setOrdonnance(null)} style={{
              background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: "1.2rem",
            }}>×</button>
          </div>
        ) : (
          <div
            onClick={() => setOrdonnance("uploaded")}
            style={{
              border: "2px dashed rgba(16,185,129,0.3)",
              borderRadius: 14, padding: "24px 16px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
              cursor: "pointer", background: "rgba(16,185,129,0.03)",
              transition: "all 0.2s",
            }}>
            <div style={{ color: "#10B981" }}><IconUpload /></div>
            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0F4C81" }}>Téléverser l'ordonnance</div>
            <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>PDF ou photo · Cachet ONMC requis</div>
            <div style={{
              background: "#10B981", color: "white", border: "none",
              borderRadius: 10, padding: "8px 20px",
              fontFamily: "'Poppins', sans-serif", fontSize: "0.78rem", fontWeight: 600,
              cursor: "pointer",
            }}>Choisir un fichier</div>
          </div>
        )}
      </div>

      {/* Delivery address */}
      <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(15,76,129,0.06)" }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Adresse de livraison
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "#F8FAFC", borderRadius: 12, padding: "12px 14px",
          border: "1px solid rgba(15,76,129,0.08)",
        }}>
          <span style={{ color: "#10B981" }}><IconMapPin /></span>
          <input
            type="text"
            placeholder="Rue, quartier, ville…"
            value={address}
            onChange={e => setAddress(e.target.value)}
            style={{
              flex: 1, border: "none", outline: "none",
              fontFamily: "'Poppins', sans-serif", fontSize: "0.85rem",
              color: "#0F4C81", background: "transparent",
            }}
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <button style={{
            background: "none", border: "none", color: "#10B981",
            fontFamily: "'Poppins', sans-serif", fontSize: "0.75rem", fontWeight: 600,
            cursor: "pointer", padding: 0,
          }}>📍 Utiliser ma position actuelle</button>
        </div>
      </div>

      {/* Summary */}
      <div style={{
        background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(56,189,248,0.04))",
        border: "1px solid rgba(16,185,129,0.15)",
        borderRadius: 14, padding: 14,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Total estimé</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F4C81" }}>{850 * qty + 500} FCFA</div>
          <div style={{ fontSize: "0.65rem", color: "#94A3B8" }}>{850 * qty} méd. + 500 livraison</div>
        </div>
        <div style={{ fontSize: "0.78rem", color: "#10B981", fontWeight: 600 }}>🚴 ~30 min</div>
      </div>

      {/* Next button */}
      <button onClick={onNext} style={{
        width: "100%", padding: 16,
        background: ordonnance ? "linear-gradient(135deg, #10B981, #059669)" : "#E2E8F0",
        border: "none", borderRadius: 14,
        color: ordonnance ? "white" : "#94A3B8",
        fontFamily: "'Poppins', sans-serif", fontSize: "0.95rem", fontWeight: 600,
        cursor: ordonnance ? "pointer" : "not-allowed",
        boxShadow: ordonnance ? "0 4px 16px rgba(16,185,129,0.3)" : "none",
        transition: "all 0.3s",
      }}>
        Choisir la pharmacie →
      </button>
    </div>
  );
}

// ─── STEP 2 — PHARMACIE ───────────────────────────────────────────────────────
function Step2({ onNext, onBack }) {
  const [selected, setSelected] = useState(null);

  const pharmacies = [
    { id: 1, name: "Pharmacie Centrale", dist: "200 m", price: 850, delivery: "30 min", rating: 4.8, stock: 48, certified: true, open: true, recommended: true },
    { id: 2, name: "Pharmacie du Marché", dist: "640 m", price: 700, delivery: "45 min", rating: 4.0, stock: 120, certified: false, open: true, recommended: false },
    { id: 3, name: "Pharmacie de la Paix", dist: "1.1 km", price: 900, delivery: "35 min", rating: 4.7, stock: 30, certified: true, open: true, recommended: false },
  ];

  return (
    <div style={{ padding: "20px 20px 140px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: "0.78rem", color: "#94A3B8", marginBottom: 4 }}>
        {pharmacies.length} pharmacies disponibles pour Paracétamol 500mg
      </div>

      {pharmacies.map(p => (
        <div key={p.id} onClick={() => setSelected(p)}
          style={{
            background: "white", borderRadius: 16, padding: 16,
            border: selected?.id === p.id ? "1.5px solid #10B981" : "1px solid rgba(15,76,129,0.06)",
            boxShadow: selected?.id === p.id ? "0 4px 20px rgba(16,185,129,0.12)" : "0 2px 8px rgba(15,76,129,0.06)",
            cursor: "pointer", transition: "all 0.2s", position: "relative",
          }}>
          {p.recommended && (
            <div style={{
              position: "absolute", top: -10, left: 16,
              background: "linear-gradient(135deg, #10B981, #059669)",
              color: "white", fontSize: "0.62rem", fontWeight: 700,
              padding: "3px 12px", borderRadius: 20,
              boxShadow: "0 2px 8px rgba(16,185,129,0.3)",
            }}>⭐ Recommandée</div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 44, height: 44,
              background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(110,231,183,0.2))",
              borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
              color: "#10B981", flexShrink: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <rect x="9" y="13" width="6" height="8"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0F4C81" }}>{p.name}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 3, flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.7rem", color: "#94A3B8" }}>📍 {p.dist}</span>
                <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "1px 7px", borderRadius: 20, background: "rgba(16,185,129,0.1)", color: "#10B981" }}>Ouverte</span>
                {p.certified && <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "1px 7px", borderRadius: 20, background: "rgba(15,76,129,0.08)", color: "#0F4C81" }}>✓ DPML</span>}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#10B981" }}>{p.price} F</div>
              <div style={{ display: "flex", alignItems: "center", gap: 3, justifyContent: "flex-end" }}>
                <IconStar /><span style={{ fontSize: "0.7rem", color: "#94A3B8" }}>{p.rating}</span>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "Stock", val: `${p.stock} unités`, color: "#10B981" },
              { label: "Livraison", val: `🚴 ${p.delivery}`, color: "#0F4C81" },
              { label: "Total", val: `${p.price * 2 + 500} F`, color: "#10B981" },
            ].map(item => (
              <div key={item.label} style={{ background: "#F8FAFC", borderRadius: 10, padding: "8px", textAlign: "center" }}>
                <div style={{ fontSize: "0.6rem", color: "#94A3B8", marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: item.color }}>{item.val}</div>
              </div>
            ))}
          </div>

          {/* Selection indicator */}
          {selected?.id === p.id && (
            <div style={{
              marginTop: 12, display: "flex", alignItems: "center", gap: 8,
              background: "rgba(16,185,129,0.06)", borderRadius: 10, padding: "8px 12px",
            }}>
              <div style={{ width: 20, height: 20, background: "#10B981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconCheck />
              </div>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#10B981" }}>Pharmacie sélectionnée</span>
            </div>
          )}
        </div>
      ))}

      {/* Buttons */}
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button onClick={onBack} style={{
          padding: "14px 20px", background: "#F1F5F9", border: "none", borderRadius: 14,
          color: "#0F4C81", fontFamily: "'Poppins', sans-serif", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
        }}>← Retour</button>
        <button onClick={onNext} disabled={!selected} style={{
          flex: 1, padding: 14,
          background: selected ? "linear-gradient(135deg, #10B981, #059669)" : "#E2E8F0",
          border: "none", borderRadius: 14,
          color: selected ? "white" : "#94A3B8",
          fontFamily: "'Poppins', sans-serif", fontSize: "0.9rem", fontWeight: 600,
          cursor: selected ? "pointer" : "not-allowed",
          boxShadow: selected ? "0 4px 16px rgba(16,185,129,0.3)" : "none",
          transition: "all 0.3s",
        }}>
          Passer au paiement →
        </button>
      </div>
    </div>
  );
}

// ─── STEP 3 — PAIEMENT ────────────────────────────────────────────────────────
function Step3({ onBack, onConfirm }) {
  const [method, setMethod] = useState(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    if (!method) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onConfirm(); }, 2000);
  };

  return (
    <div style={{ padding: "20px 20px 140px", display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Order recap */}
      <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(15,76,129,0.06)" }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Récapitulatif</div>
        {[
          { label: "Paracétamol 500mg × 2", val: "1 700 FCFA" },
          { label: "Frais de livraison", val: "500 FCFA" },
          { label: "Pharmacie Centrale", val: "30 min" },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: "0.82rem", color: "#475569" }}>{item.label}</span>
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0F4C81" }}>{item.val}</span>
          </div>
        ))}
        <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0F4C81" }}>Total</span>
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#10B981" }}>2 200 FCFA</span>
        </div>
      </div>

      {/* Payment methods */}
      <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(15,76,129,0.06)" }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Mode de paiement</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PAYMENT_METHODS.map(m => (
            <div key={m.id} onClick={() => setMethod(m.id)}
              style={{
                padding: "14px 16px", borderRadius: 14, cursor: "pointer",
                border: method === m.id ? `1.5px solid ${m.color}` : "1.5px solid #F1F5F9",
                background: method === m.id ? `${m.color}08` : "#F8FAFC",
                display: "flex", alignItems: "center", gap: 14,
                transition: "all 0.2s",
              }}>
              <span style={{ fontSize: "1.6rem" }}>{m.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0F4C81" }}>{m.label}</div>
                <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>{m.desc}</div>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                border: method === m.id ? `2px solid ${m.color}` : "2px solid #E2E8F0",
                background: method === m.id ? m.color : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}>
                {method === m.id && <div style={{ width: 8, height: 8, background: "white", borderRadius: "50%" }}/>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phone input for mobile money */}
      {(method === "orange" || method === "mtn") && (
        <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(15,76,129,0.06)" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Numéro {method === "orange" ? "Orange Money" : "MTN MoMo"}
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#F8FAFC", borderRadius: 12, padding: "12px 14px",
            border: "1px solid rgba(15,76,129,0.08)",
          }}>
            <span style={{ fontSize: "1.2rem" }}>{method === "orange" ? "🟠" : "🟡"}</span>
            <input
              type="tel"
              placeholder="+237 6XX XXX XXX"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={{
                flex: 1, border: "none", outline: "none",
                fontFamily: "'Poppins', sans-serif", fontSize: "0.9rem",
                color: "#0F4C81", background: "transparent",
              }}
            />
          </div>
          <p style={{ fontSize: "0.7rem", color: "#94A3B8", marginTop: 8, lineHeight: 1.5 }}>
            Vous recevrez une notification de paiement sur ce numéro. Confirmez sur votre téléphone.
          </p>
        </div>
      )}

      {/* Security note */}
      <div style={{
        background: "rgba(15,76,129,0.04)", border: "1px solid rgba(15,76,129,0.1)",
        borderRadius: 12, padding: "10px 14px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ color: "#0F4C81" }}><IconLock /></span>
        <p style={{ fontSize: "0.7rem", color: "#94A3B8", lineHeight: 1.5 }}>
          Paiement sécurisé — TLS 1.3 · Vos données ne sont jamais stockées
        </p>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onBack} style={{
          padding: "14px 20px", background: "#F1F5F9", border: "none", borderRadius: 14,
          color: "#0F4C81", fontFamily: "'Poppins', sans-serif", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
        }}>← Retour</button>
        <button onClick={handlePay} disabled={!method || loading} style={{
          flex: 1, padding: 14,
          background: method && !loading ? "linear-gradient(135deg, #10B981, #059669)" : "#E2E8F0",
          border: "none", borderRadius: 14,
          color: method && !loading ? "white" : "#94A3B8",
          fontFamily: "'Poppins', sans-serif", fontSize: "0.9rem", fontWeight: 600,
          cursor: method && !loading ? "pointer" : "not-allowed",
          boxShadow: method ? "0 4px 16px rgba(16,185,129,0.3)" : "none",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          transition: "all 0.3s",
        }}>
          {loading ? (
            <>
              <div style={{
                width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)",
                borderTop: "2px solid white", borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}/>
              Traitement…
            </>
          ) : "💳 Confirmer le paiement"}
        </button>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── SUCCESS SCREEN ───────────────────────────────────────────────────────────
function SuccessScreen() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: "80vh", padding: "40px 20px", textAlign: "center",
    }}>
      {/* Animated checkmark */}
      <div style={{
        width: 100, height: 100,
        background: "linear-gradient(135deg, #10B981, #059669)",
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 0 20px rgba(16,185,129,0.1), 0 0 0 40px rgba(16,185,129,0.05)",
        marginBottom: 28, fontSize: "3rem",
      }}>✓</div>

      <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0F4C81", marginBottom: 8 }}>
        Commande confirmée !
      </h2>
      <p style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: 1.6, marginBottom: 28, maxWidth: 280 }}>
        Votre commande a été transmise à la Pharmacie Centrale. Un livreur va vous être assigné.
      </p>

      {/* Order number */}
      <div style={{
        background: "white", borderRadius: 16, padding: "16px 24px",
        boxShadow: "0 4px 20px rgba(15,76,129,0.1)",
        marginBottom: 24, width: "100%", maxWidth: 300,
      }}>
        <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: 4 }}>Numéro de commande</div>
        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F4C81", letterSpacing: 2 }}>PP-2026-00142</div>
      </div>

      {/* ETA */}
      <div style={{
        display: "flex", gap: 16, marginBottom: 32,
      }}>
        {[
          { emoji: "🚴", label: "Livraison estimée", val: "~30 min" },
          { emoji: "💰", label: "Total payé", val: "2 200 F" },
        ].map(item => (
          <div key={item.label} style={{
            flex: 1, background: "white", borderRadius: 14, padding: 14,
            textAlign: "center", boxShadow: "0 2px 8px rgba(15,76,129,0.06)",
          }}>
            <div style={{ fontSize: "1.4rem", marginBottom: 4 }}>{item.emoji}</div>
            <div style={{ fontSize: "0.65rem", color: "#94A3B8", marginBottom: 2 }}>{item.label}</div>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0F4C81" }}>{item.val}</div>
          </div>
        ))}
      </div>

      <button style={{
        width: "100%", maxWidth: 300, padding: 16,
        background: "linear-gradient(135deg, #10B981, #059669)",
        border: "none", borderRadius: 14,
        color: "white", fontFamily: "'Poppins', sans-serif",
        fontSize: "0.95rem", fontWeight: 600, cursor: "pointer",
        boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
      }}>
        🗺️ Suivre ma livraison
      </button>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function TunnelCommandePage() {
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#F8FAFC", minHeight: "100vh", maxWidth: 430, margin: "0 auto" }}>
      <SuccessScreen />
    </div>
  );

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      background: "#F8FAFC",
      minHeight: "100vh",
      maxWidth: 430, margin: "0 auto",
    }}>
      {/* Top bar */}
      <div style={{
        background: "white", padding: "52px 20px 16px",
        borderBottom: "1px solid rgba(15,76,129,0.08)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <button style={{
            width: 36, height: 36, border: "none", background: "#F1F5F9",
            borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#0F4C81",
          }}><IconArrowLeft /></button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0F4C81" }}>Commander</div>
            <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>
              Étape {step + 1} sur 3
            </div>
          </div>
        </div>
        <StepIndicator step={step} />
      </div>

      {/* Steps */}
      {step === 0 && <Step1 onNext={() => setStep(1)} />}
      {step === 1 && <Step2 onNext={() => setStep(2)} onBack={() => setStep(0)} />}
      {step === 2 && <Step3 onBack={() => setStep(1)} onConfirm={() => setConfirmed(true)} />}
    </div>
  );
}
