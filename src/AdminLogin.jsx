import { useState } from "react";
import { supabase } from "./supabaseClient";
import "./AdminLogin.css";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    console.log("Admin logged in:", data.user);

    onLogin(data.user);
  }

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-logo">
          <span>✦</span> PearlSmile
        </div>

        <p className="admin-label">
          ADMIN PORTAL
        </p>

        <h1>
          Welcome Back
        </h1>

        <p className="admin-description">
          Sign in to manage appointments and clinic
          requests.
        </p>

        <form onSubmit={handleLogin}>

          <div className="admin-field">

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="admin@pearlsmile.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>

          <div className="admin-field">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

          </div>

          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>

        </form>

        <p className="admin-security">
          🔒 Secure clinic administration
        </p>

      </div>

    </div>
  );
}