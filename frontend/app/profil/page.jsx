"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilPage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", password: "", gdpr: false });
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://proxypharma-backend-jppj.onrender.com/api/v1";

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone, password: form.password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify({ name: data.name, role: data.role }));
        setLoggedIn(true);
      } else {
        setError(data.detail || "Erreur de connexion");
      }
    } catch {
      setError("Impossible de se connecter au serveur");
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!form.gdpr) { setError("Vous devez accepter les conditions"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phone: form.phone, email: `${form.phone}@proxypharma.cm`, password: form.password, gdpr_consent: form.gdpr }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify({ name: data.name, role: data.role }));
        setLoggedIn(true);
      } else {
        setError(data.detail || "Erreur d'inscription");
      }
    } catch {
      setError("Impossible de se connecter au serveur");
    }
    setLoading(false);
  };

  if (loggedIn) return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#F8FAFC", minHeight: "100vh", maxWidth: 430, margin: "0 auto" }}>
      <div style={{ background: "linear-gradient(150deg, #0F4C81, #0a3a6e)", padding: "52px 20px 32px", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, background: "linear-gradient(135deg, #10B981, #6EE7B7)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: "1.8rem" }}>👤</div>
        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "white" }}>{form.name || "Utilisateur"}</div>
        <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)" }}>{form.phone}</div>
      </div>
      <div style={{ padding: "20px 20px 100px" }}>
        {[
          { icon: "📦", label: "Mes commandes", path: "/commandes" },
          { icon: "📄", label: "Mes ordonnances", path: "/ordonnances" },
          { icon: "📍", label: "Mes adresses", path: "/profil/adresses" },
          { icon: "🔔", label: "Notifications", path: "/profil/notifications" },
          { icon: "🔐", label: "Sécurité & confidentialité", path: "/profil/securite" },
        ].map(item => (
          <div key={item.label} onClick={() => router.push(item.path)} style={{ background: "white", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, marginBottom: 10, cursor: "pointer", border: "1px solid rgba(15,76,129,0.06)" }}>
            <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
            <span style={{ flex: 1, fontSize: "0.88rem", fontWeight: 600, color: "#0F4C81" }}>{item.label}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        ))}
        <button onClick={() => { setLoggedIn(false); localStorage.removeItem("token"); }} style={{ width: "100%", padding: 14, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 14, color: "#EF4444", fontFamily: "'Poppins', sans-serif", fontSize: "0.88rem", fontWeight: 600, cursor: "pointer", marginTop: 8 }}>
          Se déconnecter
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "linear-gradient(145deg, #0F4C81, #062244)", minHeight: "100vh", maxWidth: 430, margin: "0 auto", padding: "0 24px 40px" }}>
      <div style={{ padding: "52px 0 32px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #10B981, #6EE7B7)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="white" strokeWidth="2"/><rect x="8" y="10.5" width="8" height="3" rx="1.5" fill="white"/><rect x="10.5" y="8" width="3" height="8" rx="1.5" fill="white"/></svg>
          </div>
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "white" }}>PROXY<span style={{ color: "#10B981" }}>PHARMA</span></span>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 4, width: "100%", marginBottom: 28 }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 10, background: mode === m ? "white" : "transparent", color: mode === m ? "#0F4C81" : "rgba(255,255,255,0.6)", fontFamily: "'Poppins', sans-serif", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
              {m === "login" ? "Se connecter" : "Créer un compte"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 24, backdropFilter: "blur(16px)" }}>
        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: "0.78rem", color: "#FCA5A5" }}>{error}</div>}

        {mode === "register" && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>Nom complet</label>
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "14px 16px" }}>
              <input type="text" placeholder="Marie Dupont" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "'Poppins', sans-serif", fontSize: "0.9rem", color: "white" }}/>
            </div>
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>Téléphone</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "14px 16px" }}>
            <input type="tel" placeholder="+237 6XX XXX XXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "'Poppins', sans-serif", fontSize: "0.9rem", color: "white" }}/>
          </div>
        </div>

        <div style={{ marginBottom: mode === "register" ? 16 : 20 }}>
          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>Mot de passe</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "14px 16px" }}>
            <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "'Poppins', sans-serif", fontSize: "0.9rem", color: "white" }}/>
          </div>
        </div>

        {mode === "register" && (
          <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: 12, marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }} onClick={() => setForm({ ...form, gdpr: !form.gdpr })}>
            <div style={{ width: 20, height: 20, background: form.gdpr ? "#10B981" : "transparent", border: form.gdpr ? "none" : "2px solid rgba(255,255,255,0.3)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
              {form.gdpr && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>J'accepte que mes données soient traitées conformément à la <span style={{ color: "#6EE7B7" }}>Loi N°2024/017</span></p>
          </div>
        )}

        <button onClick={mode === "login" ? handleLogin : handleRegister} style={{ width: "100%", padding: 16, background: loading ? "rgba(16,185,129,0.6)" : "linear-gradient(135deg, #10B981, #059669)", border: "none", borderRadius: 14, color: "white", fontFamily: "'Poppins', sans-serif", fontSize: "0.95rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {loading ? <div style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}/> : mode === "login" ? "Se connecter" : "Créer mon compte"}
        </button>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
