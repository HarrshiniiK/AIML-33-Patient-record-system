import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import VitalsLine from "../components/common/VitalsLine";

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@vitalis.dev", password: "admin123" },
  { role: "Doctor", email: "doctor@vitalis.dev", password: "doctor123" },
  { role: "Staff", email: "staff@vitalis.dev", password: "staff123" },
  { role: "Patient", email: "patient@vitalis.dev", password: "patient123" },
];

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      // Replace the auth history entry so browser back returns to the landing page.
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(account) {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  }

  return (
    <div className="auth-page">
      <div className="auth-ambient">
        <VitalsLine variant="ambient" height={200} />
      </div>

      <div className="auth-card card card-pad">
        <Link to="/" className="auth-brand">
          <span className="brand-mark">V</span> Vitalis
        </Link>
        <h2>Welcome back</h2>
        <p className="muted">Sign in to access your dashboard.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <div className="field-error" style={{ marginBottom: "var(--space-4)" }}>{error}</div>}
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="auth-divider"><span>Demo accounts</span></div>
        <div className="demo-grid">
          {DEMO_ACCOUNTS.map((acc) => (
            <button key={acc.role} type="button" className="demo-chip" onClick={() => fillDemo(acc)}>
              {acc.role}
            </button>
          ))}
        </div>

        <p className="auth-footnote muted text-sm">
          Don't have an account? <Link to="/register">Register as a patient</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
