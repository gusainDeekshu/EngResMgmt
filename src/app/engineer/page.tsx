"use client";

import { useState, useEffect, useMemo } from "react";
import StatCardsRow from "../components/StatCardsRow";
import AssignmentItemCard from "@/app/components/AssignmentItemCard";
import { EngineerAssignmentsCalendar } from "../components/EngineerAssignmentsCalendar";
import ProtectedRoute from "../components/ProtectedRoute";
import { get } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  maxUtilization: number;
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

    console.log(data.assignments,"data.assignments");

    return data.assignments.map((a) => ({
      _id: a._id,
      project: a.projectId.name,
      start: a.startDate,
      end: a.endDate,
      role: a.role,
      allocation: a.allocationPercentage,
    }));
  }, [data?.assignments]);

  // Organize assignments by status
  const organizedAssignments = useMemo(() => {
    if (!data?.assignments) return { current: [], upcoming: [], completed: [] };

    const now = new Date();
    return data.assignments.reduce((acc, assignment) => {
      const start = new Date(assignment.startDate);
      const end = new Date(assignment.endDate);

      if (end < now) {
        acc.completed.push(assignment);
      } else if (start > now) {
        acc.upcoming.push(assignment);
      } else {
        acc.current.push(assignment);
      }
      return acc;
    }, { current: [] as ApiAssignment[], upcoming: [] as ApiAssignment[], completed: [] as ApiAssignment[] });
  }, [data?.assignments]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-64 items-center justify-center text-red-500">
        <div className="text-lg">Error: {error || "Dashboard data is unavailable."}</div>
      </div>
    );
  }
  
  const stats = [
    { label: "My Utilization", value: `${data.utilization}%`, icon: "📊" },
    { label: "My Max Capacity", value: `${data.maxUtilization}%`, icon: "📈" },
    { label: "Active Projects", value: data.projectsCount, icon: "📁" },
    { label: "Next Free Date", value: data.nextFreeDate || "N/A", icon: "⏳" },
  ];

  return (
    <ProtectedRoute allowedRoles={["engineer"]}>
      <div className="flex flex-col gap-8">
        <StatCardsRow stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Organized Assignments */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Current and Upcoming Assignments Combined */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>My Assignments</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {organizedAssignments.current.length + organizedAssignments.upcoming.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Assignments Section */}
                {organizedAssignments.current.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm text-green-600">Current Projects</h4>
                      <Badge variant="outline" className="text-xs">
                        {organizedAssignments.current.length}
                      </Badge>
                    </div>
                    {organizedAssignments.current.map((assignment) => (
                      <AssignmentItemCard key={assignment._id} assignment={assignment} />
                    ))}
                  </div>
                )}

                {/* Upcoming Assignments Section */}
                {organizedAssignments.upcoming.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm text-blue-600">Upcoming Assignments</h4>
                      <Badge variant="outline" className="text-xs">
                        {organizedAssignments.upcoming.length}
                      </Badge>
                    </div>
                    {organizedAssignments.upcoming.map((assignment) => (
                      <AssignmentItemCard key={assignment._id} assignment={assignment} />
                    ))}
                  </div>
                )}

                {/* No assignments message */}
                {organizedAssignments.current.length === 0 && organizedAssignments.upcoming.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No current or upcoming assignments at the moment.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent Completed Assignments */}
            {organizedAssignments.completed.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>Recently Completed</span>
                    <Badge variant="secondary">
                      {organizedAssignments.completed.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {organizedAssignments.completed.slice(0, 3).map((assignment) => (
                    <AssignmentItemCard key={assignment._id} assignment={assignment} />
                  ))}
                  {organizedAssignments.completed.length > 3 && (
                    <p className="text-muted-foreground text-center text-sm">
                      +{organizedAssignments.completed.length - 3} more completed assignments
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Calendar View */}
          <EngineerAssignmentsCalendar assignments={calendarAssignments} />
        </div>
      </div>
    </ProtectedRoute>
  );
}