"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/components/AuthProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading, login } = useAuth();

  // Redirect authenticated users to their appropriate dashboard
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === "manager") {
        router.replace("/dashboard");
      } else if (user.role === "engineer") {
        router.replace("/engineer");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      
      // Use AuthProvider's login function
      login(data.user, data.token);
      
      // Role-based redirects after successful login
      // Managers go to /dashboard, Engineers go to /engineer
      if (data.user.role === "manager") {
        router.push("/dashboard");
      } else if (data.user.role === "engineer") {
        router.push("/engineer");
      } else {
        // Fallback for any other roles
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Don't show login form if user is already authenticated
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm flex flex-col gap-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-2">Sign In</h2>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          className="bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
        
        {/* Test Account Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
          <p className="font-semibold mb-2">Test Accounts:</p>
          <p><strong>Manager:</strong> manager@company.com / adminpass</p>
          <p><strong>Engineer:</strong> alice@company.com / password123</p>
        </div>
      </form>
    </div>
  );
} 