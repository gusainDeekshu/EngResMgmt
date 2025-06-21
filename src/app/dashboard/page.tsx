"use client";
import { useState, useEffect, useMemo } from "react";
import StatCardsRow from "../components/StatCardsRow";
import EngineerCard from "../components/EngineerCard";
import { AssignmentsCalendar } from "../components/AssignmentsCalendar";
import ProtectedRoute from "../components/ProtectedRoute";
import { get } from "@/lib/api";
import { AssignmentsTimeline } from "../components/AssignmentsTimeline";
import { Input } from "@/components/ui/input";
import { useDashboardStore } from "@/store/dashboardStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Project from "@/models/Project";
import { Quicksand } from 'next/font/google';

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: '600',
});


export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const engineerSkillFilter = useDashboardStore((s) => s.engineerSkillFilter);
  const setEngineerSkillFilter = useDashboardStore((s) => s.setEngineerSkillFilter);
  const projectStatusFilter = useDashboardStore((s) => s.projectStatusFilter);
  const setProjectStatusFilter = useDashboardStore((s) => s.setProjectStatusFilter);
  const timelineStartDate = useDashboardStore((s) => s.timelineStartDate);
  const setTimelineStartDate = useDashboardStore((s) => s.setTimelineStartDate);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await get("/api/dashboard");
        setData(res);
        console.log(res,"------------res")
      } catch (err: any) {
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const timelineData = useMemo(() => {
    if (!data) return { engineers: [], assignments: [] };
    const filteredEngineers = data.engineers.filter((user: any) => {
      if (!engineerSkillFilter) return true;
      return (user.skills || []).some((skill: string) =>
        skill.toLowerCase().includes(engineerSkillFilter.toLowerCase())
      );
    });

    const filteredAssignments = data.assignments
      .filter((assignment: any) => assignment.engineerId && assignment.projectId)
      .filter((assignment: any) => {
        if (!projectStatusFilter) return true;
        if (assignment.projectStatus) {
          return assignment.projectStatus.toLowerCase().includes(projectStatusFilter.toLowerCase());
        }
        return false;
      })
      .map((assignment: any) => ({
        _id: assignment._id,
        title: assignment.role,
        project: assignment.project,
        projectStatus: assignment.projectStatus,
        engineerId: assignment.engineerId,
        engineerName: assignment.engineerName,
        engineerSkills: assignment.engineerSkills,
        start: assignment.start,
        end: assignment.end,
        isTentative: assignment.isTentative || false,
        allocation: assignment.allocation,
      }));

    const engineerIdsWithAssignments = new Set(filteredAssignments.map((a: any) => a.engineerId));
    const timelineEngineers = filteredEngineers
      .filter((user: any) => engineerIdsWithAssignments.has(user._id))
      .map((user: any) => ({
        id: user._id,
        name: user.name,
        role: user.seniority ? `${user.seniority.charAt(0).toUpperCase() + user.seniority.slice(1)} ${user.department || 'Engineer'}` : 'Engineer',
        allocation: user.percent || 0,
        skills: user.skills || [],
        img: (user as any)?.img || null,
      }));

    return { engineers: timelineEngineers, assignments: filteredAssignments };
  }, [data, engineerSkillFilter, projectStatusFilter]);

  if (loading) return <div className="p-8">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

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
          <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className={`text-xl  tracking-wider  ${quicksand.className}`}>
  Team Members
</h2>
            
            {/* Vertically scrollable container for all engineers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[450px] overflow-y-auto pr-2">
              {data.engineers.map((eng: any) => (
                <EngineerCard key={eng._id} engineer={eng} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
          <h2 className={`text-xl  tracking-wider ms-1  ${quicksand.className}`}>Assignment Calendar</h2>
            <AssignmentsCalendar assignments={data.assignments.filter((a:any) => a.projectId && a.engineerId)} />
          </div>
        </div>
        <div className="flex flex-col gap-4">
        <h2 className={`text-xl  tracking-wider ms-1  ${quicksand.className}`}>Engineer Assignment Timeline</h2>
        <AssignmentsTimeline
          engineers={timelineData.engineers}
          assignments={timelineData.assignments}
        />
        </div>
        
       
      </div>
    </ProtectedRoute>
  );
}