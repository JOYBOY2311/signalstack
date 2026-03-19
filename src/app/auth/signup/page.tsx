"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createSupabaseBrowser();
    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signupError) {
      setError(signupError.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-bold mb-2">Check your email</h1>
          <p className="text-slate-400">
            We sent a confirmation link to <strong>{email}</strong>. Click it to
            activate your account and start catching signals.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-sm font-bold text-white">
              P
            </div>
            <span className="font-bold text-lg">Pulsadar</span>
          </Link>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-slate-400 text-sm mt-1">
            Free forever. No credit card required.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              placeholder="Jane Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              placeholder="jane@company.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              placeholder="Min. 8 characters"
              minLength={8}
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium text-sm"
          >
            {loading ? "Creating account..." : "Create free account"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-indigo-400 hover:text-indigo-300"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
