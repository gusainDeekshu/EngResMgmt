"use client";

import { useState, useEffect, useMemo } from "react";
import StatCardsRow from "../components/StatCardsRow";
import AssignmentItemCard from "../components/AssignmentItemCard";
import { AssignmentsCalendar } from "../components/AssignmentsCalendar"; // Import the correct calendar
import ProtectedRoute from "../components/ProtectedRoute";
import { get } from "@/lib/api";

// --- TYPE DEFINITIONS ---
// Shape of the data expected by the AssignmentsCalendar component
interface CalendarAssignment {
  _id: string;
  project: string;
  start: string;
  end: string;
  role: string;
  allocation: number;
}

// Shape of a single assignment from your API
interface ApiAssignment {
  _id: string;
  projectId: { name: string };
  startDate: string;
  endDate: string;
  role: string;
  allocationPercentage: number;
}

// Shape of the entire dashboard data object from your API
interface EngineerDashboardData {
  utilization: number;
  projectsCount: number;
  nextFreeDate: string;
  assignments: ApiAssignment[];
}

// --- MAIN COMPONENT ---
export default function EngineerDashboard() {
  const [data, setData] = useState<EngineerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const responseData = await get("/api/engineers/dashboard");
        setData(responseData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Use `useMemo` to transform the API data into the format the calendar needs.
  // This is efficient because it only re-runs when the API data changes.
  const calendarAssignments = useMemo((): CalendarAssignment[] => {
    if (!data?.assignments) return [];

    return data.assignments.map((a) => ({
      _id: a._id,
      project: a.projectId.name,
      start: a.startDate,
      end: a.endDate,
      role: a.role,
      allocation: a.allocationPercentage,
    }));
  }, [data?.assignments]);


  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-64 items-center justify-center text-red-500">
        Error: {error || "Dashboard data is unavailable."}
      </div>
    );
  }
  
  const stats = [
    { label: "My Utilization", value: `${data.utilization}%`, icon: "📊" },
    { label: "Active Projects", value: data.projectsCount, icon: "📁" },
    { label: "Next Free Date", value: data.nextFreeDate || "N/A", icon: "⏳" },
  ];

  return (
    <ProtectedRoute allowedRoles={["engineer"]}>
      <div className="flex flex-col gap-8">
        <StatCardsRow stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: List of Assignments */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="text-lg font-semibold">My Assignments</h2>
            {data.assignments.length > 0 ? (
              data.assignments.map((assignment) => (
                <AssignmentItemCard key={assignment._id} assignment={assignment} />
              ))
            ) : (
              <p className="text-muted-foreground">You have no assignments.</p>
            )}
          </div>

          {/* Right Column: Calendar View */}
          {/* We use the AssignmentsCalendar directly. It is its own card and has its own title. */}
          <AssignmentsCalendar assignments={calendarAssignments} />
        </div>
      </div>
    </ProtectedRoute>
  );
}