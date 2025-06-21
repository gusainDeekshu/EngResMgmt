"use client";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  Briefcase, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut,
  UserPlus,
  Target,
  PieChart,
  FileText,
  AlertTriangle,
  Menu,
  X
} from "lucide-react";
import { Quicksand } from 'next/font/google';
import { useState } from "react";

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: '600',
});

const managerNavLinks = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: Home,
    description: "Overview of team performance and projects",
    active: true
  },
  
  { 
    name: "Projects", 
    href: "/projects", 
    icon: Briefcase,
    description: "View and manage all projects",
    active: true
  },{ 
    name: "Assignments", 
    href: "/assignments", 
    icon: Calendar,
    description: "Manage team assignments and allocations",
    active: true
  },{ 
    name: "Team Management", 
    href: "#", 
    icon: Users,
    description: "Manage team members and their assignments",
    active: false
  },
  
  { 
    name: "Resource Planning", 
    href: "#", 
    icon: Target,
    description: "Plan resource allocation and capacity",
    active: false
  },
  { 
    name: "Analytics", 
    href: "#", 
    icon: BarChart3,
    description: "View team performance metrics",
    active: false
  },
  { 
    name: "Reports", 
    href: "#", 
    icon: FileText,
    description: "Generate and view reports",
    active: false
  },
  { 
    name: "Utilization", 
    href: "#", 
    icon: PieChart,
    description: "Track team utilization rates",
    active: false
  },
  { 
    name: "Issues & Risks", 
    href: "#", 
    icon: AlertTriangle,
    description: "Monitor project issues and risks",
    active: false
  },
];

export default function ManagerSidebar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200 ${!isOpen ? '' : 'hidden'}`}
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white border-r border-gray-200 flex flex-col p-6 gap-4 shadow-sm
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <button
          onClick={closeSidebar}
          className="lg:hidden absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="text-2xl font-bold mb-8 ms-4 tracking-tight ">
          GeekyAnts
        </div>
        
        {/* User Info */}
        {user && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className={`text-m font-bold ${quicksand.className}`}>
              {user.name || user.email}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Manager
            </div>
          </div>
        )}
        
        <nav className="flex flex-col gap-2">
          {managerNavLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`group px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                  link.active 
                    ? "hover:bg-blue-50 font-medium cursor-pointer" 
                    : "text-gray-400 cursor-not-allowed opacity-50"
                }`}
                title={link.active ? link.description : "Coming soon"}
                onClick={(e) => {
                  if (!link.active) {
                    e.preventDefault();
                  } else {
                    closeSidebar(); // Close sidebar on mobile when clicking active links
                  }
                }}
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
        
        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Link
              href="#"
              className="group px-4 py-2 rounded-lg hover:bg-green-50 text-gray-400 font-medium transition-colors flex items-center gap-3 text-sm cursor-not-allowed opacity-50"
              onClick={(e) => e.preventDefault()}
              title="Coming soon"
            >
              <UserPlus className="w-4 h-4 text-gray-400" />
              <span>New Assignment</span>
              <span className="ml-auto text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded">
                Soon
              </span>
            </Link>
            <Link
              href="#"
              className="group px-4 py-2 rounded-lg hover:bg-green-50 text-gray-400 font-medium transition-colors flex items-center gap-3 text-sm cursor-not-allowed opacity-50"
              onClick={(e) => e.preventDefault()}
              title="Coming soon"
            >
              <Briefcase className="w-4 h-4 text-gray-400" />
              <span>New Project</span>
              <span className="ml-auto text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded">
                Soon
              </span>
            </Link>
          </div>
        </div>
        
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
            onClick={() => {
              logout();
              closeSidebar();
            }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        )}
        
        <div className="mt-auto pt-8 border-t border-gray-100 text-xs text-gray-400">
          &copy; {new Date().getFullYear()} GeekyAnts
        </div>
      </aside>
    </>
  );
} 