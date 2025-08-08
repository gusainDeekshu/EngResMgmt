import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";
import Sidebar from "./components/Sidebar";
import EngineerSidebar from "./components/EngineerSidebar";
import { Toaster } from "sonner";
import { SidebarWrapper } from "./components/SidebarWrapper";

export const metadata: Metadata = {
  title: "Engineering Resource Management",
  description: "Manage  team assignments and capacity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body
        className={`antialiased bg-gray-50`}
      >
        <Toaster />
        <AuthProvider>
          <div className="min-h-screen flex">
            <SidebarWrapper />
            <main className="flex-1 p-8 overflow-y-auto">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
