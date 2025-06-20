"use client";
import Link from "next/link";
import { useAuth } from "./AuthProvider";

const navLinks = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Projects", href: "/projects" },
  { name: "Assignments", href: "/assignments" },

];

export default function Sidebar() {
  const { user, logout } = useAuth();
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-6 gap-4 shadow-sm">
      <div className="text-2xl font-bold mb-8 tracking-tight">EngResMgmt</div>
      <nav className="flex flex-col gap-2">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="px-4 py-2 rounded-lg hover:bg-indigo-50 text-gray-700 font-medium transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </nav>
      {user && (
        <button
          className="mt-8 bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 font-medium"
          onClick={logout}
        >
          Logout
        </button>
      )}
      <div className="mt-auto pt-8 border-t border-gray-100 text-xs text-gray-400">
        &copy; {new Date().getFullYear()} EngResMgmt
      </div>
    </aside>
  );
} 