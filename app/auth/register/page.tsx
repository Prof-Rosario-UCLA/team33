"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/auth/signin"), 1000);
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-primary">Register</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border rounded px-3 py-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded px-3 py-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-alert text-sm">{error}</div>}
        {success && <div className="text-green-700 text-sm">Registration successful! Redirecting...</div>}
        <button className="bg-primary text-white py-2 rounded font-semibold hover:bg-secondary transition-colors">Register</button>
      </form>
      <div className="mt-4 text-sm text-center">
        Already have an account? <Link href="/auth/signin" className="text-primary underline">Sign In</Link>
      </div>
    </div>
  );
} 