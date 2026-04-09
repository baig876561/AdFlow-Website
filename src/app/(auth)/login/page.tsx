"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { APP_NAME } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Redirect based on role
      const roleRedirect: Record<string, string> = {
        client: "/client",
        moderator: "/moderator",
        admin: "/admin",
        super_admin: "/admin",
      };
      router.push(roleRedirect[data.data.role] || "/client");
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in relative">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
            AF
          </div>
        </Link>
        <h1 className="text-2xl font-bold mt-4">Welcome back</h1>
        <p className="text-sm text-muted mt-1">Sign in to your {APP_NAME} account</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary hover:text-primary-hover font-medium transition-colors">
          Create one
        </Link>
      </p>

      {/* Demo credentials */}
      <div className="mt-6 glass-card rounded-xl p-4">
        <p className="text-xs font-semibold text-muted mb-2">Demo Accounts</p>
        <div className="space-y-1.5 text-[11px] text-muted-foreground">
          {[
            { email: "client@adflow.test", role: "Client" },
            { email: "moderator@adflow.test", role: "Moderator" },
            { email: "admin@adflow.test", role: "Admin" },
            { email: "superadmin@adflow.test", role: "Super Admin" },
          ].map((cred) => (
            <button
              key={cred.email}
              type="button"
              onClick={() => { setEmail(cred.email); setPassword("Password123!"); }}
              className="w-full flex items-center justify-between py-1.5 px-2 rounded hover:bg-secondary/50 transition-colors text-left"
            >
              <span>{cred.role}</span>
              <span className="text-primary">{cred.email}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
