"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect while loading
    if (loading) return;
    
    if (!user) {
      router.replace("/login");
    } else if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect to correct dashboard if role is not allowed
      if (user.role === "manager") router.replace("/dashboard");
      else if (user.role === "engineer") router.replace("/engineer");
    }
  }, [user, loading, allowedRoles, router]);

  // Show loading state while authentication is being initialized
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated
  if (!user) return null;
  
  // Don't render if user doesn't have the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;
  
  return <>{children}</>;
} 