"use client";
import { useState, useEffect } from "react";

// ─── ICONS ────────────────────────────────────────────────────────────────────
const IconArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);
const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.89a16 16 0 0 0 6.06 6.06l1.06-1.06a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconMessage = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconStar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

// ─── DELIVERY STEPS ───────────────────────────────────────────────────────────
const STEPS = [
  { id: 0, label: "Commande confirmée", desc: "Votre commande a été reçue", icon: "✅", time: "09:12" },
  { id: 1, label: "Pharmacie en préparation", desc: "La Pharmacie Centrale prépare votre commande", icon: "💊", time: "09:15" },
  { id: 2, label: "Livreur en route", desc: "Paul D. a pris en charge votre commande", icon: "🚴", time: "09:22" },
  { id: 3, label: "Livreur proche", desc: "Votre livreur est à moins de 500m", icon: "📍", time: "09:38" },
  { id: 4, label: "Livré !", desc: "Confirmez la réception avec le code OTP", icon: "🎉", time: "" },
];

const RIDER = {
  name: "Paul Djimtibaye",
  phone: "+237 6 52 34 12 09",
  rating: 4.9,
  deliveries: 312,
  avatar: "P",
  vehicle: "Moto · DL-4521-CM",
};

// ─── MAP COMPONENT ────────────────────────────────────────────────────────────
function LiveMap({ progress }) {
  // Rider position based on progress
  const riderPos = {
    x: 60 + progress * 1.8,
    y: 120 - progress * 0.6,
  };

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
        backgroundSize: "28px 28px",
      }}/>

      {/* Roads */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.3 }}>
        <line x1="0" y1="80" x2="500" y2="80" stroke="#0F4C81" strokeWidth="5"/>
        <line x1="0" y1="130" x2="500" y2="130" stroke="#0F4C81" strokeWidth="2"/>
        <line x1="120" y1="0" x2="120" y2="220" stroke="#0F4C81" strokeWidth="4"/>
        <line x1="280" y1="0" x2="280" y2="220" stroke="#0F4C81" strokeWidth="2"/>
        <line x1="60" y1="0" x2="180" y2="220" stroke="#0F4C81" strokeWidth="1.5" opacity="0.5"/>
        <text x="8" y="75" fontSize="8" fill="#0F4C81" opacity="0.6">Rue Joss</text>
        <text x="125" y="40" fontSize="8" fill="#0F4C81" opacity="0.6">Av. de Gaulle</text>
      </svg>

      {/* Route line */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <path
          d={`M ${riderPos.x} ${riderPos.y} Q 200 90 320 110`}
          stroke="#10B981" strokeWidth="3" fill="none"
          strokeDasharray="8,4" opacity="0.7"
        />
      </svg>

      {/* Pharmacy (destination) */}
      <div style={{ position: "absolute", top: 95, left: 305, transform: "translate(-50%, -50%)" }}>
        <div style={{
          width: 32, height: 32,
          background: "#0F4C81", borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(15,76,129,0.4)",
        }}>
          <span style={{ transform: "rotate(45deg)", fontSize: 14 }}>🏥</span>
        </div>
        <div style={{
          background: "white", borderRadius: 6, padding: "2px 8px",
          fontSize: "0.6rem", fontWeight: 700, color: "#0F4C81",
          marginTop: 4, boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          whiteSpace: "nowrap", textAlign: "center",
        }}>Vous</div>
      </div>

      {/* Rider (animated) */}
      <div style={{
        position: "absolute",
        top: riderPos.y,
        left: riderPos.x,
        transform: "translate(-50%, -50%)",
        transition: "all 1s ease",
        zIndex: 10,
      }}>
        <div style={{
          width: 44, height: 44,
          background: "linear-gradient(135deg, #10B981, #059669)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 0 8px rgba(16,185,129,0.2), 0 4px 16px rgba(16,185,129,0.4)",
          fontSize: "1.4rem",
          border: "2px solid white",
        }}>🚴</div>
        <div style={{
          background: "#10B981", color: "white",
          borderRadius: 8, padding: "3px 8px",
          fontSize: "0.62rem", fontWeight: 700,
          marginTop: 4, textAlign: "center",
          boxShadow: "0 2px 8px rgba(16,185,129,0.3)",
          whiteSpace: "nowrap",
        }}>Paul D.</div>
      </div>

      {/* ETA overlay */}
      <div style={{
        position: "absolute", top: 12, right: 12,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)",
        borderRadius: 12, padding: "8px 14px",
        boxShadow: "0 4px 16px rgba(15,76,129,0.12)",
      }}>
        <div style={{ fontSize: "0.65rem", color: "#94A3B8" }}>Arrivée dans</div>
        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#10B981" }}>~8 min</div>
      </div>

      {/* OSM */}
      <div style={{ position: "absolute", bottom: 8, left: 10, fontSize: "0.55rem", color: "rgba(15,76,129,0.4)" }}>
        © OpenStreetMap
      </div>
    </div>
  );
}

// ─── OTP MODAL ────────────────────────────────────────────────────────────────
function OTPModal({ onConfirm, onClose }) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    setError(false);
    if (val && idx < 3) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code === "1234") {
      setLoading(true);
      setTimeout(() => { setLoading(false); onConfirm(); }, 1500);
    } else {
      setError(true);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
    }}>
      <div onClick={onClose} style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
      }}/>
      <div style={{
        background: "white", borderRadius: "24px 24px 0 0",
        padding: "28px 24px 48px",
        position: "relative",
        animation: "slideUp 0.3s ease",
      }}>
        <div style={{ width: 40, height: 4, background: "#E2E8F0", borderRadius: 2, margin: "0 auto 24px" }}/>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔐</div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F4C81", marginBottom: 8 }}>
            Confirmer la réception
          </h3>
          <p style={{ fontSize: "0.82rem", color: "#94A3B8", lineHeight: 1.5 }}>
            Entrez le code OTP reçu par SMS au <strong>+237 6XX XXX XXX</strong>
          </p>
          <p style={{ fontSize: "0.72rem", color: "#10B981", marginTop: 4 }}>
            (Code de démo : 1234)
          </p>
        </div>

        {/* OTP inputs */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 20 }}>
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(e.target.value, i)}
              style={{
                width: 60, height: 68,
                textAlign: "center",
                fontSize: "1.6rem", fontWeight: 800,
                border: error ? "2px solid #EF4444" : digit ? "2px solid #10B981" : "2px solid #E2E8F0",
                borderRadius: 14,
                color: "#0F4C81",
                outline: "none",
                background: digit ? "rgba(16,185,129,0.05)" : "#F8FAFC",
                fontFamily: "'Poppins', sans-serif",
                transition: "all 0.2s",
              }}
            />
          ))}
        </div>

        {error && (
          <p style={{ textAlign: "center", color: "#EF4444", fontSize: "0.78rem", marginBottom: 16 }}>
            ❌ Code incorrect. Réessayez.
          </p>
        )}

        <button onClick={handleVerify} style={{
          width: "100%", padding: 16,
          background: otp.join("").length === 4
            ? "linear-gradient(135deg, #10B981, #059669)"
            : "#E2E8F0",
          border: "none", borderRadius: 14,
          color: otp.join("").length === 4 ? "white" : "#94A3B8",
          fontFamily: "'Poppins', sans-serif",
          fontSize: "0.95rem", fontWeight: 600,
          cursor: otp.join("").length === 4 ? "pointer" : "not-allowed",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          boxShadow: otp.join("").length === 4 ? "0 4px 16px rgba(16,185,129,0.3)" : "none",
        }}>
          {loading ? (
            <div style={{
              width: 20, height: 20,
              border: "2px solid rgba(255,255,255,0.3)",
              borderTop: "2px solid white",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}/>
          ) : "Confirmer la réception ✓"}
        </button>

        <button style={{
          width: "100%", marginTop: 12,
          background: "none", border: "none",
          color: "#94A3B8", fontFamily: "'Poppins', sans-serif",
          fontSize: "0.78rem", cursor: "pointer",
        }}>
          Renvoyer le code SMS
        </button>
      </div>
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─── RATING SCREEN ────────────────────────────────────────────────────────────
function RatingScreen() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "100vh", padding: 40, textAlign: "center",
      background: "#F8FAFC",
    }}>
      <div style={{
        width: 100, height: 100,
        background: "linear-gradient(135deg, #10B981, #059669)",
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "3rem",
        boxShadow: "0 0 0 20px rgba(16,185,129,0.1)",
        marginBottom: 28,
      }}>🎉</div>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0F4C81", marginBottom: 8 }}>Merci !</h2>
      <p style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: 1.6 }}>
        Votre avis aide la communauté ProxyPharma.
      </p>
      <button style={{
        marginTop: 28, padding: "14px 32px",
        background: "linear-gradient(135deg, #10B981, #059669)",
        border: "none", borderRadius: 14,
        color: "white", fontFamily: "'Poppins', sans-serif",
        fontSize: "0.9rem", fontWeight: 600, cursor: "pointer",
        boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
      }}>
        Retour à l'accueil
      </button>
    </div>
  );

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      background: "#F8FAFC", minHeight: "100vh",
      maxWidth: 430, margin: "0 auto",
      padding: "60px 24px 40px",
    }}>
      {/* Success banner */}
      <div style={{
        background: "linear-gradient(135deg, #10B981, #059669)",
        borderRadius: 20, padding: "24px 20px",
        textAlign: "center", marginBottom: 32,
        boxShadow: "0 8px 32px rgba(16,185,129,0.3)",
      }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>✅</div>
        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "white", marginBottom: 4 }}>Livraison confirmée !</div>
        <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.8)" }}>Commande PP-2026-00142</div>
      </div>

      {/* Receipt */}
      <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(15,76,129,0.06)", marginBottom: 24 }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Reçu de commande</div>
        {[
          { label: "Paracétamol 500mg × 2", val: "1 700 FCFA" },
          { label: "Livraison", val: "500 FCFA" },
          { label: "Payé via Orange Money", val: "✓" },
          { label: "Durée totale", val: "28 min" },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: "0.8rem", color: "#475569" }}>{item.label}</span>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#0F4C81" }}>{item.val}</span>
          </div>
        ))}
        <div style={{ borderTop: "1px dashed #E2E8F0", paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0F4C81" }}>Total</span>
          <span style={{ fontSize: "1rem", fontWeight: 800, color: "#10B981" }}>2 200 FCFA</span>
        </div>
      </div>

      {/* Rating */}
      <div style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 2px 8px rgba(15,76,129,0.06)", marginBottom: 24 }}>
        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0F4C81", marginBottom: 4, textAlign: "center" }}>
          Notez votre expérience
        </div>
        <div style={{ fontSize: "0.72rem", color: "#94A3B8", textAlign: "center", marginBottom: 16 }}>
          Paul Djimtibaye · Pharmacie Centrale
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
          {[1,2,3,4,5].map(s => (
            <button key={s}
              onClick={() => setRating(s)}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                transform: (hover || rating) >= s ? "scale(1.2)" : "scale(1)",
                transition: "transform 0.15s",
              }}>
              <svg width="36" height="36" viewBox="0 0 24 24"
                fill={(hover || rating) >= s ? "#F59E0B" : "none"}
                stroke="#F59E0B" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </button>
          ))}
        </div>
        <button onClick={() => rating > 0 && setSubmitted(true)} style={{
          width: "100%", padding: 14,
          background: rating > 0 ? "linear-gradient(135deg, #10B981, #059669)" : "#E2E8F0",
          border: "none", borderRadius: 12,
          color: rating > 0 ? "white" : "#94A3B8",
          fontFamily: "'Poppins', sans-serif", fontSize: "0.88rem", fontWeight: 600,
          cursor: rating > 0 ? "pointer" : "not-allowed",
          transition: "all 0.3s",
        }}>
          {rating > 0 ? `Envoyer (${rating} ⭐)` : "Sélectionnez une note"}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function SuiviLivraisonPage() {
  const [currentStep, setCurrentStep] = useState(2);
  const [showOTP, setShowOTP] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [progress, setProgress] = useState(30);

  // Simulate rider moving
  useEffect(() => {
    if (confirmed) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 200) { clearInterval(interval); return 200; }
        return p + 1;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [confirmed]);

  // Auto-advance steps
  useEffect(() => {
    if (progress > 60 && currentStep < 3) setCurrentStep(3);
    if (progress > 140 && currentStep < 4) setCurrentStep(4);
  }, [progress, currentStep]);

  if (confirmed) return <RatingScreen />;

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      background: "#F8FAFC",
      height: "100vh",
      maxWidth: 430, margin: "0 auto",
      display: "flex", flexDirection: "column",
      overflow: "hidden", position: "relative",
    }}>

      {/* ── TOP BAR ── */}
      <div style={{
        background: "white", padding: "52px 20px 16px",
        borderBottom: "1px solid rgba(15,76,129,0.08)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <button style={{
            width: 36, height: 36, border: "none", background: "#F1F5F9",
            borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#0F4C81",
          }}><IconArrowLeft /></button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0F4C81" }}>Suivi de livraison</div>
            <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>Commande PP-2026-00142</div>
          </div>
          {/* Live badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "rgba(16,185,129,0.1)", borderRadius: 20,
            padding: "4px 10px",
          }}>
            <div style={{
              width: 6, height: 6, background: "#10B981", borderRadius: "50%",
              animation: "pulse 1.2s infinite",
            }}/>
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#10B981" }}>EN DIRECT</span>
          </div>
        </div>

        {/* ETA bar */}
        <div style={{
          background: "linear-gradient(135deg, #0F4C81, #0a3a6e)",
          borderRadius: 14, padding: "12px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}>Livraison estimée</div>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "white" }}>
              {currentStep >= 4 ? "Arrivé !" : `~${Math.max(1, 12 - Math.floor(progress / 20))} min`}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}>Distance restante</div>
            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#6EE7B7" }}>
              {currentStep >= 4 ? "0 m" : `${Math.max(0, 480 - progress * 2)} m`}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAP ── */}
      <div style={{ height: 200, flexShrink: 0 }}>
        <LiveMap progress={progress} />
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 120px" }}>

        {/* Rider card */}
        <div style={{
          background: "white", borderRadius: 16, padding: 16,
          boxShadow: "0 2px 8px rgba(15,76,129,0.06)", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <div style={{
            width: 52, height: 52,
            background: "linear-gradient(135deg, #0F4C81, #38BDF8)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 800, fontSize: "1.2rem", flexShrink: 0,
          }}>{RIDER.avatar}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0F4C81" }}>{RIDER.name}</div>
            <div style={{ fontSize: "0.7rem", color: "#94A3B8", marginBottom: 4 }}>{RIDER.vehicle}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#0F4C81" }}>{RIDER.rating}</span>
              <span style={{ fontSize: "0.68rem", color: "#94A3B8" }}>· {RIDER.deliveries} livraisons</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <a href={`tel:${RIDER.phone}`} style={{
              width: 40, height: 40, background: "#F1F5F9", borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#0F4C81", textDecoration: "none",
            }}><IconPhone /></a>
            <button style={{
              width: 40, height: 40, background: "#F1F5F9", borderRadius: 10,
              border: "none", cursor: "pointer", color: "#0F4C81",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}><IconMessage /></button>
          </div>
        </div>

        {/* Steps timeline */}
        <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(15,76,129,0.06)", marginBottom: 16 }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8", marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Statut de la commande
          </div>
          {STEPS.map((s, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            return (
              <div key={s.id} style={{ display: "flex", gap: 14, marginBottom: i < STEPS.length - 1 ? 4 : 0 }}>
                {/* Timeline */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 32, flexShrink: 0 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: done ? "#10B981" : active ? "#0F4C81" : "#F1F5F9",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: done ? "0" : "0.9rem",
                    boxShadow: active ? "0 4px 12px rgba(15,76,129,0.25)" : "none",
                    transition: "all 0.4s",
                    flexShrink: 0,
                  }}>
                    {done ? <IconCheck /> : <span>{s.icon}</span>}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{
                      width: 2, flex: 1, minHeight: 24,
                      background: done ? "#10B981" : "#F1F5F9",
                      margin: "4px 0", transition: "all 0.4s",
                    }}/>
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingTop: 4, paddingBottom: i < STEPS.length - 1 ? 16 : 0 }}>
                  <div style={{
                    fontSize: "0.85rem", fontWeight: active ? 700 : 600,
                    color: done || active ? "#0F4C81" : "#94A3B8",
                    marginBottom: 2,
                  }}>{s.label}</div>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8", lineHeight: 1.4 }}>{s.desc}</div>
                  {s.time && done && (
                    <div style={{ fontSize: "0.65rem", color: "#10B981", fontWeight: 600, marginTop: 3 }}>✓ {s.time}</div>
                  )}
                  {active && (
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      background: "rgba(15,76,129,0.06)", borderRadius: 20,
                      padding: "3px 10px", marginTop: 6,
                    }}>
                      <div style={{ width: 5, height: 5, background: "#0F4C81", borderRadius: "50%", animation: "pulse 1s infinite" }}/>
                      <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "#0F4C81" }}>En cours…</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary */}
        <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(15,76,129,0.06)" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Votre commande
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44, height: 44, background: "#F1F5F9",
              borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.5rem", flexShrink: 0,
            }}>💊</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0F4C81" }}>Paracétamol 500mg × 2</div>
              <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>Pharmacie Centrale · DPML ✓</div>
            </div>
            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#10B981" }}>2 200 F</div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: "white", borderTop: "1px solid rgba(15,76,129,0.08)",
        padding: "16px 20px 32px",
        boxShadow: "0 -4px 20px rgba(15,76,129,0.08)",
      }}>
        {currentStep >= 4 ? (
          <button onClick={() => setShowOTP(true)} style={{
            width: "100%", padding: 16,
            background: "linear-gradient(135deg, #10B981, #059669)",
            border: "none", borderRadius: 14,
            color: "white", fontFamily: "'Poppins', sans-serif",
            fontSize: "0.95rem", fontWeight: 600, cursor: "pointer",
            boxShadow: "0 4px 16px rgba(16,185,129,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            🔐 Confirmer avec le code OTP
          </button>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{
              flex: 1, background: "#F8FAFC", borderRadius: 14, padding: "12px 16px",
              border: "1px solid rgba(15,76,129,0.08)",
            }}>
              <div style={{ fontSize: "0.65rem", color: "#94A3B8" }}>Commande</div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0F4C81" }}>PP-2026-00142</div>
            </div>
            <button style={{
              flex: 1, padding: "12px 16px",
              background: "#F1F5F9", border: "none", borderRadius: 14,
              color: "#EF4444", fontFamily: "'Poppins', sans-serif",
              fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
            }}>
              Signaler un problème
            </button>
          </div>
        )}
      </div>

      {/* OTP Modal */}
      {showOTP && (
        <OTPModal
          onConfirm={() => { setShowOTP(false); setConfirmed(true); }}
          onClose={() => setShowOTP(false)}
        />
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
