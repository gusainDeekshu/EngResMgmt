"use client";
import { useAuth } from "./AuthProvider";

import EngineerSidebar from "./EngineerSidebar";
import ManagerSidebar from "./ManagerSidebar";

export function SidebarWrapper() {
  const { user } = useAuth();

  // If user is an engineer, show the engineer sidebar
  if (user?.role === "engineer") {
    return <EngineerSidebar />;
  }

  // If user is a manager, show the manager sidebar
  if (user?.role === "manager") {
    return <ManagerSidebar />;
  }

  // For all other roles (admin, etc.), show the regular sidebar
  return <></>;
} 