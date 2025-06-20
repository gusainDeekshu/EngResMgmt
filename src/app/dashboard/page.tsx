"use client";
import { useState, useEffect } from "react";
import StatCardsRow from "../components/StatCardsRow";
import EngineerCard from "../components/EngineerCard";
// 1. IMPORT THE NEW CALENDAR COMPONENT
import { AssignmentsCalendar } from "../components/AssignmentsCalendar"; // Adjust path if needed
import ProtectedRoute from "../components/ProtectedRoute";
import { get } from "@/lib/api";
import { Card } from "@/components/ui/card";

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

  // No changes here
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
          {/* Change is in this Card component */}
          <div className="flex flex-col gap-4 p-0"> {/* Adjusted padding to p-0 as the calendar has its own */}
            <div className="p-4 pb-0 text-lg font-semibold">Upcoming Assignments</div>
            {/* 2. USE THE NEW COMPONENT and pass the same assignments prop */}
            <AssignmentsCalendar assignments={data.assignments} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}