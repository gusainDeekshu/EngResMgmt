"use client";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Calendar, 
  User, 
  Settings, 
  LogOut,
  Briefcase,
  Clock,
  CheckCircle
} from "lucide-react";
import { Quicksand } from 'next/font/google';

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: '600',
});

const engineerNavLinks = [
  { 
    name: "My Dashboard", 
    href: "/engineer", 
    icon: Home,
    description: "Overview of my assignments and utilization",
    active: true
  }, { 
    name: "My Profile", 
    href: "/profile", 
    icon: User,
    description: "Update my skills and preferences",
    active: true
  },
  { 
    name: "My Calendar", 
    href: "#", 
    icon: Calendar,
    description: "View my assignment timeline",
    active: false
  },
 
  { 
    name: "My Projects", 
    href: "#", 
    icon: Briefcase,
    description: "View all my project assignments",
    active: false
  },
  { 
    name: "Time Tracking", 
    href: "#", 
    icon: Clock,
    description: "Track time spent on projects",
    active: false
  },
  { 
    name: "Completed Work", 
    href: "#", 
    icon: CheckCircle,
    description: "View my completed assignments",
    active: false
  },
];

export default function EngineerSidebar() {
  const { user, logout } = useAuth();
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-6 gap-4 shadow-sm">
      <div className="text-2xl font-bold mb-8 ms-4 tracking-tight">
        GeekyAnts
      </div>
      
      {/* User Info */}
      {user && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
          <div className={`text-m font-bold ${quicksand.className}`}>
            {user.name || user.email}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Engineer
          </div>
        </div>
      )}
      
      <nav className="flex flex-col gap-2">
        {engineerNavLinks.map((link) => {
          const IconComponent = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`group px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                link.active 
                  ? "hover:bg-indigo-50 font-medium cursor-pointer" 
                  : "text-gray-400 cursor-not-allowed opacity-50"
              }`}
              title={link.active ? link.description : "Coming soon"}
              onClick={(e) => !link.active && e.preventDefault()}
            >
              <IconComponent className={`w-5 h-5 ${
                link.active 
                  ? "" 
                  : "text-gray-400"
              }`} />
              <span>{link.name}</span>
              {!link.active && (
                <span className="ml-auto text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded">
                  Soon
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Settings Link */}
      <div className="mt-4">
        <Link
          href="#"
          className="group px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-400 font-medium transition-colors flex items-center gap-3 cursor-not-allowed opacity-50"
          onClick={(e) => e.preventDefault()}
          title="Coming soon"
        >
          <Settings className="w-5 h-5 text-gray-400" />
          <span>Settings</span>
          <span className="ml-auto text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded">
            Soon
          </span>
        </Link>
      </div>
      
      {user && (
        <Button
          variant="outline"
          className="mt-8 w-full flex items-center gap-2"
          onClick={logout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      )}
      
      <div className="mt-auto pt-8 border-t border-gray-100 text-xs text-gray-400">
        &copy; {new Date().getFullYear()} GeekyAnts
      </div>
    </aside>
  );
} 