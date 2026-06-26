import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — NGO Learning Centre" },
      { name: "description", content: "Sign in to manage student portfolios." },
    ],
  }),
  component: AuthPage,
});

const F = { fontFamily: "'Segoe UI',system-ui,sans-serif" } as const;

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/app" });
    });
  }, [navigate]);

  const submit = async () => {
    setErr(""); setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
        navigate({ to: "/app" });
      } else {
        if (!name.trim()) { setErr("Please enter your full name."); return; }
        const redirectUrl = `${window.location.origin}/app`;
        const { error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            emailRedirectTo: redirectUrl,
            data: { full_name: name.trim() },
          },
        });
        if (error) throw error;
        // try immediate sign-in (works if email confirm is disabled)
        const { error: signinErr } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (signinErr) {
          setErr("Account created. Please check your email to confirm before signing in.");
          setMode("signin");
        } else {
          navigate({ to: "/app" });
        }
      }
    } catch (e: any) {
      setErr(e?.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, ...F }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>📚</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#1e3a5f" }}>NGO Learning Centre</div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Student Portfolio System</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {(["signin", "signup"] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setErr(""); }}
                style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13,
                  background: mode === m ? "#1e3a5f" : "#f1f5f9", color: mode === m ? "#fff" : "#475569" }}>
                {m === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {mode === "signup" && (
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"
                style={{ width: "100%", padding: "11px 13px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box" }} />
            </div>
          )}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email"
              style={{ width: "100%", padding: "11px 13px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Password</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && submit()}
              style={{ width: "100%", padding: "11px 13px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box" }} />
          </div>
          {err && <div style={{ color: "#dc2626", fontSize: 12, marginBottom: 10 }}>{err}</div>}
          <button onClick={submit} disabled={busy}
            style={{ width: "100%", background: "#1e3a5f", color: "#fff", border: "none", borderRadius: 8, padding: 13, fontWeight: 700, fontSize: 15, cursor: busy ? "default" : "pointer", opacity: busy ? 0.6 : 1 }}>
            {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
          {mode === "signup" && (
            <div style={{ marginTop: 14, padding: 10, background: "#f8fafc", borderRadius: 8, fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>
              The first person to sign up becomes the <strong>Head</strong>. All later signups start as <strong>Intern</strong>; the Head can promote roles later.
            </div>
          )}
        </div>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#64748b" }}>
          <Link to="/" style={{ color: "#3b82f6" }}>← Back home</Link>
        </div>
      </div>
    </div>
  );
}
