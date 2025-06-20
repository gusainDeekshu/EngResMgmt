"use client";
import { useState, useEffect } from "react";
import StatCardsRow from "../components/StatCardsRow";
import Card from "../components/Card";
import CalendarWidget from "../components/CalendarWidget";
import ProgressBar from "../components/ProgressBar";
import ProtectedRoute from "../components/ProtectedRoute";
import { get } from "@/lib/api";

export default function EngineerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await get("/api/engineers/dashboard");
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
    { label: "My Utilization", value: `${data.utilization}%`, icon: "📊" },
    { label: "Active Projects", value: data.projectsCount, icon: "📁" },
    { label: "Next Free Date", value: data.nextFreeDate, icon: "⏳" },
  ];

  const getStatus = (assignment: any) => {
    const now = new Date();
    const start = new Date(assignment.startDate);
    const end = new Date(assignment.endDate);
    if (end < now) return "Completed";
    if (start > now) return "Upcoming";
    return "Active";
  }

  return (
    <ProtectedRoute allowedRoles={["engineer"]}>
      <div className="flex flex-col gap-8">
        <StatCardsRow stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-2 flex flex-col gap-4">
            <div className="text-lg font-semibold mb-2">My Assignments</div>
            <div className="flex flex-col gap-4">
              {data.assignments.map((a: any, i: number) => (
                <Card key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-gray-800">{a.projectId.name}</div>
                    <span className="text-xs text-gray-500">{getStatus(a)}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">{a.role}</div>
                  <ProgressBar percent={a.allocationPercentage} />
                  <div className="text-xs text-gray-400 mt-1">{a.allocationPercentage}% allocated</div>
                  <div className="text-xs text-gray-400">{new Date(a.startDate).toLocaleDateString()} to {new Date(a.endDate).toLocaleDateString()}</div>
                </Card>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-lg font-semibold mb-2">Assignment Timeline</div>
            <CalendarWidget />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 