"use client";
import { useState, useEffect } from "react";
import StatCardsRow from "../components/StatCardsRow";
import EngineerCard from "../components/EngineerCard";
import CalendarWidget from "../components/CalendarWidget";
import ProtectedRoute from "../components/ProtectedRoute";
import { get } from "@/lib/api";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await get("/api/dashboard");
        setData(res);
      } catch (err: any) {
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const stats = [
    { label: "Total Engineers", value: data.totalEngineers, icon: "👩‍💻" },
    { label: "Active Projects", value: data.activeProjectsCount, icon: "📁" },
    { label: "Avg. Utilization", value: `${data.averageUtilization}%`, icon: "📊" },
    { label: "Next Availability", value: data.nextAvailability || "N/A", icon: "⏳" },
  ];

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div className="flex flex-col gap-8">
        <StatCardsRow stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-2 flex flex-col gap-4">
            <div className="text-lg font-semibold mb-2">Team Overview</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.engineers.map((eng: any) => (
                <EngineerCard key={eng._id} engineer={eng} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-lg font-semibold mb-2">Upcoming Assignments</div>
            <CalendarWidget assignments={data.assignments} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 