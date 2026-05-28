"use client";
import { useState } from "react";

// ─── LOGO SVG ─────────────────────────────────────────────────────────────────
function LogoIcon({ size = 100 }) {
  return (
    <div style={{
      width: size, height: size,
      background: "linear-gradient(135deg, #10B981, #6EE7B7)",
      borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 0 0 16px rgba(16,185,129,0.12), 0 0 0 32px rgba(16,185,129,0.06)",
      position: "relative",
    }}>
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="20" stroke="white" strokeWidth="2.5"/>
        <rect x="18" y="25.5" width="20" height="5" rx="2.5" fill="white"/>
        <rect x="25.5" y="18" width="5" height="20" rx="2.5" fill="white"/>
        <circle cx="28" cy="28" r="8" fill="rgba(255,255,255,0.15)"/>
      </svg>
    </div>
  );
}

// ─── INPUT COMPONENT ──────────────────────────────────────────────────────────
function Input({ label, type = "text", placeholder, value, onChange, icon }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: "block", fontSize: "0.78rem", fontWeight: 600,
        color: "rgba(255,255,255,0.7)", marginBottom: 6,
      }}>{label}</label>
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        background: focused ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)",
        border: focused ? "1.5px solid rgba(16,185,129,0.6)" : "1.5px solid rgba(255,255,255,0.12)",
        borderRadius: 14, padding: "14px 16px",
        transition: "all 0.2s",
      }}>
        {icon && <span style={{ color: focused ? "#10B981" : "rgba(255,255,255,0.4)", flexShrink: 0 }}>{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            fontFamily: "'Poppins', sans-serif", fontSize: "0.9rem",
            color: "white",
          }}
        />
      </div>
    </div>
  );
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.89a16 16 0 0 0 6.06 6.06l1.06-1.06a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ─── FEATURES LIST ────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: "📍", label: "Proximité", desc: "Pharmacies près de vous" },
  { icon: "🛡️", label: "Confiance", desc: "Certifiées DPML" },
  { icon: "💊", label: "Santé", desc: "Médicaments vérifiés" },
  { icon: "⚡", label: "Rapidité", desc: "Livraison en 30 min" },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function SplashPage() {
  const [mode, setMode] = useState("splash"); // splash | login | register
  const [loginData, setLoginData] = useState({ phone: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  // ── SPLASH ──
  if (mode === "splash") return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      minHeight: "100vh",
      background: "linear-gradient(145deg, #0F4C81 0%, #0a3560 50%, #062244 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 24px",
      maxWidth: 430, margin: "0 auto",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background glows */}
      <div style={{
        position: "absolute", top: -100, right: -100,
        width: 300, height: 300,
        background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }}/>
      <div style={{
        position: "absolute", bottom: -80, left: -80,
        width: 250, height: 250,
        background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }}/>

      {/* Logo */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 40 }}>
        <LogoIcon size={100} />
        <div style={{ marginTop: 20, fontSize: "2rem", fontWeight: 800, color: "white", letterSpacing: -0.5 }}>
          PROXY<span style={{ color: "#10B981" }}>PHARMA</span>
        </div>
        <div style={{ fontSize: "0.9rem", color: "#6EE7B7", fontWeight: 400, marginTop: 4, letterSpacing: 0.5 }}>
          Votre santé, à proximité
        </div>
      </div>

      {/* Mission */}
      <div style={{ textAlign: "center", maxWidth: 280, marginBottom: 36 }}>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.85rem", lineHeight: 1.7 }}>
          Rendre les soins et les médicaments accessibles à tous, partout et à tout moment, grâce à la géolocalisation et la technologie.
        </p>
      </div>

      {/* Features */}
      <div style={{ display: "flex", gap: 16, marginBottom: 44, flexWrap: "wrap", justifyContent: "center" }}>
        {FEATURES.map(f => (
          <div key={f.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 48, height: 48,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.3rem",
            }}>{f.icon}</div>
            <span style={{ fontSize: "0.68rem", color: "#6EE7B7", fontWeight: 500, textAlign: "center" }}>{f.label}</span>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 320 }}>
        <button onClick={() => setMode("login")} style={{
          background: "linear-gradient(135deg, #10B981, #059669)",
          color: "white", border: "none", borderRadius: 14,
          padding: 16, fontFamily: "'Poppins', sans-serif",
          fontSize: "0.95rem", fontWeight: 600, cursor: "pointer",
          boxShadow: "0 8px 24px rgba(16,185,129,0.35)",
          transition: "transform 0.2s",
        }}>Se connecter</button>

        <button onClick={() => setMode("register")} style={{
          background: "transparent", color: "white",
          border: "1.5px solid rgba(255,255,255,0.25)",
          borderRadius: 14, padding: 15,
          fontFamily: "'Poppins', sans-serif",
          fontSize: "0.95rem", fontWeight: 500, cursor: "pointer",
          backdropFilter: "blur(8px)",
        }}>Créer un compte</button>
      </div>

      {/* Footer */}
      <p style={{ marginTop: 32, fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
        En continuant, vous acceptez nos{" "}
        <span style={{ color: "#6EE7B7", cursor: "pointer" }}>Conditions d'utilisation</span>
        {" "}et notre{" "}
        <span style={{ color: "#6EE7B7", cursor: "pointer" }}>Politique de confidentialité</span>
      </p>
    </div>
  );

  // ── LOGIN ──
  if (mode === "login") return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      minHeight: "100vh",
      background: "linear-gradient(145deg, #0F4C81 0%, #0a3560 60%, #062244 100%)",
      padding: "0 24px 40px",
      maxWidth: 430, margin: "0 auto",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{ padding: "56px 0 32px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
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
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "white" }}>
            PROXY<span style={{ color: "#10B981" }}>PHARMA</span>
          </span>
        </div>

        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "white", marginBottom: 8, textAlign: "center" }}>
          Bon retour ! 👋
        </h1>
        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", textAlign: "center" }}>
          Connectez-vous pour accéder à vos médicaments
        </p>
      </div>

      {/* Form */}
      <div style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20, padding: 24,
        backdropFilter: "blur(16px)",
        marginBottom: 20,
      }}>
        <Input
          label="Numéro de téléphone"
          type="tel"
          placeholder="+237 6XX XXX XXX"
          value={loginData.phone}
          onChange={e => setLoginData({ ...loginData, phone: e.target.value })}
          icon={<IconPhone />}
        />
        <Input
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          value={loginData.password}
          onChange={e => setLoginData({ ...loginData, password: e.target.value })}
          icon={<IconLock />}
        />

        <div style={{ textAlign: "right", marginBottom: 20 }}>
          <span style={{ fontSize: "0.78rem", color: "#6EE7B7", cursor: "pointer", fontWeight: 500 }}>
            Mot de passe oublié ?
          </span>
        </div>

        <button onClick={handleSubmit} style={{
          width: "100%",
          background: loading ? "rgba(16,185,129,0.6)" : "linear-gradient(135deg, #10B981, #059669)",
          color: "white", border: "none", borderRadius: 14,
          padding: 16, fontFamily: "'Poppins', sans-serif",
          fontSize: "0.95rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          {loading ? (
            <div style={{
              width: 20, height: 20, border: "2px solid rgba(255,255,255,0.3)",
              borderTop: "2px solid white", borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}/>
          ) : "Se connecter"}
        </button>
      </div>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }}/>
        <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>ou continuer avec</span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }}/>
      </div>

      {/* Mobile Money */}
      <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
        {[
          { name: "Orange Money", color: "#FF6600", emoji: "🟠" },
          { name: "MTN MoMo", color: "#FFCC00", emoji: "🟡" },
        ].map(m => (
          <button key={m.name} style={{
            flex: 1, padding: "12px 8px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12, cursor: "pointer",
            fontFamily: "'Poppins', sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <span style={{ fontSize: "1.2rem" }}>{m.emoji}</span>
            <span style={{ fontSize: "0.75rem", color: "white", fontWeight: 500 }}>{m.name}</span>
          </button>
        ))}
      </div>

      {/* Switch to register */}
      <p style={{ textAlign: "center", fontSize: "0.85rem", color: "rgba(255,255,255,0.55)" }}>
        Pas encore de compte ?{" "}
        <span onClick={() => setMode("register")}
          style={{ color: "#10B981", fontWeight: 600, cursor: "pointer" }}>
          Créer un compte
        </span>
      </p>

      <p style={{ textAlign: "center", marginTop: 12 }}>
        <span onClick={() => setMode("splash")}
          style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}>
          ← Retour
        </span>
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // ── REGISTER ──
  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      minHeight: "100vh",
      background: "linear-gradient(145deg, #0F4C81 0%, #0a3560 60%, #062244 100%)",
      padding: "0 24px 40px",
      maxWidth: 430, margin: "0 auto",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{ padding: "48px 0 28px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
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
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "white" }}>
            PROXY<span style={{ color: "#10B981" }}>PHARMA</span>
          </span>
        </div>

        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "white", marginBottom: 8, textAlign: "center" }}>
          Créer un compte 🚀
        </h1>
        <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", textAlign: "center" }}>
          Rejoignez ProxyPharma — livraison en 30 min
        </p>
      </div>

      {/* Benefits */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {["✓ Gratuit", "✓ Certifié DPML", "✓ Mobile Money"].map(b => (
          <div key={b} style={{
            background: "rgba(16,185,129,0.12)",
            border: "1px solid rgba(16,185,129,0.25)",
            borderRadius: 20, padding: "4px 12px",
            fontSize: "0.72rem", color: "#6EE7B7", fontWeight: 600,
          }}>{b}</div>
        ))}
      </div>

      {/* Form */}
      <div style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20, padding: 24,
        backdropFilter: "blur(16px)",
        marginBottom: 20,
      }}>
        <Input
          label="Nom complet"
          placeholder="Marie Dupont"
          value={registerData.name}
          onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
          icon={<IconUser />}
        />
        <Input
          label="Email"
          type="email"
          placeholder="marie@exemple.cm"
          value={registerData.email}
          onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
          icon={<IconMail />}
        />
        <Input
          label="Numéro de téléphone"
          type="tel"
          placeholder="+237 6XX XXX XXX"
          value={registerData.phone}
          onChange={e => setRegisterData({ ...registerData, phone: e.target.value })}
          icon={<IconPhone />}
        />
        <Input
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          value={registerData.password}
          onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
          icon={<IconLock />}
        />

        {/* Consent */}
        <div style={{
          background: "rgba(16,185,129,0.08)",
          border: "1px solid rgba(16,185,129,0.2)",
          borderRadius: 12, padding: 12, marginBottom: 20,
          display: "flex", gap: 10, alignItems: "flex-start",
        }}>
          <div style={{
            width: 20, height: 20, background: "#10B981", borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, marginTop: 1,
          }}>
            <IconCheck />
          </div>
          <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
            J'accepte que mes données de santé soient traitées conformément à la{" "}
            <span style={{ color: "#6EE7B7", cursor: "pointer" }}>Loi N°2024/017</span>{" "}
            sur la protection des données personnelles.
          </p>
        </div>

        <button onClick={handleSubmit} style={{
          width: "100%",
          background: loading ? "rgba(16,185,129,0.6)" : "linear-gradient(135deg, #10B981, #059669)",
          color: "white", border: "none", borderRadius: 14,
          padding: 16, fontFamily: "'Poppins', sans-serif",
          fontSize: "0.95rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {loading ? (
            <div style={{
              width: 20, height: 20, border: "2px solid rgba(255,255,255,0.3)",
              borderTop: "2px solid white", borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}/>
          ) : "Créer mon compte"}
        </button>
      </div>

      {/* Switch to login */}
      <p style={{ textAlign: "center", fontSize: "0.85rem", color: "rgba(255,255,255,0.55)" }}>
        Déjà un compte ?{" "}
        <span onClick={() => setMode("login")}
          style={{ color: "#10B981", fontWeight: 600, cursor: "pointer" }}>
          Se connecter
        </span>
      </p>

      <p style={{ textAlign: "center", marginTop: 12 }}>
        <span onClick={() => setMode("splash")}
          style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}>
          ← Retour
        </span>
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
