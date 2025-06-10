"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useSearchParams();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-primary">Sign In</h1>
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
        <button className="bg-primary text-white py-2 rounded font-semibold hover:bg-secondary transition-colors">Sign In</button>
      </form>
      <div className="mt-4 text-sm text-center">
        Don&apos;t have an account? <Link href="/auth/register" className="text-primary underline">Register</Link>
      </div>
    </div>
  );
} 