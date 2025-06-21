"use client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { addDays, format, isWithinInterval, startOfMonth, endOfMonth, isToday, isWeekend } from "date-fns";
import { useMemo, useState } from "react";

interface Assignment {
  _id: string;
  project: string;
  engineer?: string;
  engineerAvatar?: string;
  start: string;
  end: string;
  role: string;
  allocation: number;
}

const PROJECT_COLORS = [
  "bg-indigo-500", "bg-green-500", "bg-pink-500", "bg-yellow-500", "bg-blue-500", "bg-purple-500", "bg-orange-500"
];

function getProjectColor(project: string) {
  let hash = 0;
  for (let i = 0; i < project.length; i++) hash = project.charCodeAt(i) + ((hash << 5) - hash);
  return PROJECT_COLORS[Math.abs(hash) % PROJECT_COLORS.length];
}

export default function CalendarTimeline({ assignments = [] }: { assignments?: Assignment[] }) {
  // Filters
  const [projectFilter, setProjectFilter] = useState("");
  const [engineerFilter, setEngineerFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [modalAssignment, setModalAssignment] = useState<Assignment | null>(null);

  // Timeline for the current month
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  // Build an array of all days in the month
  const days = useMemo(() => {
    const arr = [];
    for (let d = new Date(monthStart); d <= monthEnd; d = addDays(d, 1)) {
      arr.push(new Date(d));
    }
    return arr;
  }, [monthStart, monthEnd]);

  // Unique projects/engineers/roles for filters
  const projects = Array.from(new Set(assignments.map(a => a.project)));
  const engineers = Array.from(new Set(assignments.map(a => a.engineer).filter(Boolean)));
  const roles = Array.from(new Set(assignments.map(a => a.role)));

  // Filter assignments that overlap this month and match filters
  const visibleAssignments = assignments.filter(a => {
    const start = new Date(a.start);
    const end = new Date(a.end);
    const overlaps =
      isWithinInterval(monthStart, { start, end }) ||
      isWithinInterval(monthEnd, { start, end }) ||
      (start <= monthStart && end >= monthEnd) ||
      (start >= monthStart && end <= monthEnd);
    const matchesProject = !projectFilter || a.project === projectFilter;
    const matchesEngineer = !engineerFilter || a.engineer === engineerFilter;
    const matchesRole = !roleFilter || a.role === roleFilter;
    return overlaps && matchesProject && matchesEngineer && matchesRole;
  });

  // Add Assignment button handler (placeholder)
  function handleAddAssignment() {
    alert("Add Assignment modal coming soon!");
  }

  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
        <div className="font-semibold">Assignment Timeline (This Month)</div>
        <div className="flex gap-2 flex-wrap">
          <Input
            placeholder="Filter by project"
            className="w-32"
            value={projectFilter}
            onChange={e => setProjectFilter(e.target.value)}
            list="project-list"
          />
          <datalist id="project-list">
            {projects.map(p => <option key={p} value={p} />)}
          </datalist>
          <Input
            placeholder="Filter by engineer"
            className="w-32"
            value={engineerFilter}
            onChange={e => setEngineerFilter(e.target.value)}
            list="engineer-list"
          />
          <datalist id="engineer-list">
            {engineers.map(e => <option key={e} value={e} />)}
          </datalist>
          <Input
            placeholder="Filter by role"
            className="w-32"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            list="role-list"
          />
          <datalist id="role-list">
            {roles.map(r => <option key={r} value={r} />)}
          </datalist>
          <Button size="sm" onClick={handleAddAssignment} variant="outline">+ Add Assignment</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="flex border-b text-xs text-gray-500 min-w-fit">
          <div className="w-40"></div>
          {days.map((d, i) => (
            <div
              key={i}
              className={`w-7 md:w-8 text-center ${isToday(d) ? "text-indigo-600 font-bold" : ""} ${isWeekend(d) ? "bg-gray-50" : ""}`}
            >
              {format(d, "d")}
            </div>
          ))}
        </div>
        {visibleAssignments.length === 0 && (
          <div className="text-center text-gray-400 py-8">No assignments this month</div>
        )}
        {visibleAssignments.map(a => {
          const start = new Date(a.start);
          const end = new Date(a.end);
          let startIdx = days.findIndex(d => d >= start);
          if (startIdx === -1) startIdx = 0;
          let endIdx = days.findIndex(d => d > end) - 1;
          if (endIdx < 0) endIdx = days.length - 1;
          const barLength = endIdx >= startIdx ? endIdx - startIdx + 1 : 1;
          const color = getProjectColor(a.project);
          return (
            <div key={a._id} className="flex items-center border-b last:border-0 hover:bg-gray-50 transition cursor-pointer" onClick={() => setModalAssignment(a)}>
              <div className="w-40 pr-2 py-2 text-sm font-medium text-gray-700 flex items-center gap-2">
                {a.engineer && (
                  <Avatar className="w-7 h-7">
                    {a.engineerAvatar ? (
                      <img src={a.engineerAvatar} alt={a.engineer} />
                    ) : (
                      <AvatarFallback>{a.engineer[0]}</AvatarFallback>
                    )}
                  </Avatar>
                )}
                <div>
                  <div>{a.project}</div>
                  <div className="text-xs text-gray-400">{a.role}</div>
                  {a.engineer && <div className="text-xs text-gray-400">{a.engineer}</div>}
                </div>
              </div>
              <div className="flex-1 flex items-center relative h-8">
                <div className="flex w-full">
                  {days.map((d, i) => {
                    const isBar = i >= startIdx && i <= endIdx;
                    return (
                      <div
                        key={i}
                        className={`w-7 md:w-8 h-4 mx-0.5 rounded ${isBar ? color : ""} ${isToday(d) ? "border-2 border-indigo-600" : ""} ${isWeekend(d) ? "bg-gray-100" : ""}`}
                        title={isBar ? `${a.project} | ${a.role}${a.engineer ? ` | ${a.engineer}` : ""}\n${format(start, "yyyy-MM-dd")} to ${format(end, "yyyy-MM-dd")}` : format(d, "yyyy-MM-dd")}
                        style={{ opacity: isBar ? 0.9 : 1, cursor: isBar ? "pointer" : undefined }}
                      ></div>
                    );
                  })}
                </div>
                {/* Tooltip on hover handled by native title */}
              </div>
            </div>
          );
        })}
      </div>
      {/* Assignment Details Modal */}
      <Dialog open={!!modalAssignment} onOpenChange={v => !v && setModalAssignment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assignment Details</DialogTitle>
          </DialogHeader>
          {modalAssignment && (
            <div className="space-y-2">
              <div><b>Project:</b> {modalAssignment.project}</div>
              <div><b>Role:</b> {modalAssignment.role}</div>
              {modalAssignment.engineer && <div><b>Engineer:</b> {modalAssignment.engineer}</div>}
              <div><b>Start:</b> {format(new Date(modalAssignment.start), "yyyy-MM-dd")}</div>
              <div><b>End:</b> {format(new Date(modalAssignment.end), "yyyy-MM-dd")}</div>
              <div><b>Allocation:</b> {modalAssignment.allocation}%</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
