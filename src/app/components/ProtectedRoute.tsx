"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect to correct dashboard if role is not allowed
      if (user.role === "manager") router.replace("/dashboard");
      else if (user.role === "engineer") router.replace("/engineer");
    }
  }, [user, allowedRoles, router]);

  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;
  return <>{children}</>;
} 