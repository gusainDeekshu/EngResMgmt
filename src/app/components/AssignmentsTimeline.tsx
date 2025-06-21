"use client";
import React, { useState, useMemo } from "react";
import { addDays, subDays, format, eachDayOfInterval, differenceInDays, isToday } from "date-fns";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Quicksand } from 'next/font/google';

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: '600',
});
// --- INTERFACES for props ---
interface Engineer {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  allocation: number;
  skills?: string[];
  img?: string;
}

interface Assignment {
  _id:string;
  title: string;
  project: string;
  projectStatus?: string;
  engineerId: string;
  start: string | Date;
  end: string | Date;
  isTentative?: boolean;
  allocation?: number;
}

interface AssignmentsTimelineProps {
  engineers: Engineer[];
  assignments: Assignment[];
}

// --- HELPERS ---
const PROJECT_COLORS = {
  default: "bg-orange-600",
  purple: "bg-purple-600",
  cyan: "bg-emerald-500",
  yellow: "bg-yellow-500",
  blue: "bg-zinc-500",
  pink: "bg-pink-600",
  
};
const colorKeys = Object.keys(PROJECT_COLORS).filter(k => k !== 'default');

const getProjectColor = (projectTitle: string) => {
  let hash = 0;
  for (let i = 0; i < projectTitle.length; i++) hash = projectTitle.charCodeAt(i) + ((hash << 5) - hash);
  const key = colorKeys[Math.abs(hash) % colorKeys.length];
  return PROJECT_COLORS[key as keyof typeof PROJECT_COLORS] || PROJECT_COLORS.default;
};


// --- SUB-COMPONENTS for a cleaner structure ---

const TimelineHeader = ({ startDate, setStartDate, skillFilter, setSkillFilter, projectFilter, setProjectFilter }: any) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
    <div className="flex items-center gap-2">
      <h2 className="font-semibold text-lg whitespace-nowrap">{format(startDate, "MMMM yyyy")}</h2>
      <Button variant="outline" size="icon" className="h-6 w-6  bg-neutral-100" onClick={() => setStartDate(subDays(startDate, 7))}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" className="h-6 w-6  bg-neutral-100 " onClick={() => setStartDate(addDays(startDate, 7))}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <Input placeholder="Filter by skill..." value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} className="bg-neutral-50 border-gray-600 w-full sm:w-40" />
      <Input placeholder="Filter by project..." value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="bg-neutral-50 border-gray-600 w-full sm:w-40" />
    </div>
  </div>
);

const EngineerInfo = ({ engineer }: { engineer: Engineer }) => (
  <div className="flex flex-col justify-center h-full  ">
    <div className="flex items-center gap-3">
      <Avatar className="w-10 h-10 border-2 border-gray-700">
        {engineer.img ? (
          <AvatarImage src={engineer.img} alt={engineer.name} />
        ) : (
          <AvatarFallback>{engineer.name.slice(0, 2)}</AvatarFallback>
        )}
      </Avatar>
      <div>
        <div className={`font-bold text-sm ${quicksand.className}`}>{engineer.name}</div>
        <div className="text-xs text-gray-400">{engineer.role}</div>
      </div>
    </div>
    <div className="flex items-center gap-2 mt-2.5">
      <Progress value={engineer.allocation} className="h-1.5 bg-gray-300" />
      <span className={`text-xs font-semibold w-9 text-right ${engineer.allocation > 100 ? "text-red-500" : "text-gray-300"}`}>{engineer.allocation}%</span>
    </div>
    {/* {engineer.skills && engineer.skills.length > 0 && (
       <div className="flex flex-wrap gap-1 mt-2 ">
          {engineer.skills.slice(0, 3).map(skill => (
            <Badge key={skill}  variant="outline" className="text-xs border-gray-600 px-2 py-0.5">{skill}</Badge>
          ))}
       </div>
    )} */}
  </div>
);

const AssignmentBlock = ({ assignment, gridColumn, gridRow }: { assignment: Assignment, gridColumn: string, gridRow: string }) => {
  const color = getProjectColor(assignment.project);
  const start = new Date(assignment.start);
  const end = new Date(assignment.end);

  return (
    <div style={{ gridColumn, gridRow, position: 'relative' }} className="p-1 h-full flex items-center">
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className={`w-full h-[90%] rounded-lg p-2 flex flex-col justify-center overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:brightness-110
            ${assignment.isTentative
              ? 'border-2 border-dashed border-cyan-400/80 bg-transparent text-cyan-300'
              : `${color} text-white`}`
          }>
            <p className="font-bold text-sm truncate">{assignment.title}</p>
            <p className="text-xs truncate opacity-80">{assignment.project}</p>
            {/* End date marker */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: `var(--tw-${color.replace('bg-', '')})` }}
                />
              </TooltipTrigger>
              <TooltipContent>
                {assignment.project} end date: {format(end, "yyyy-MM-dd")}
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-950 text-white border-gray-700 max-w-xs" side="top" align="start">
          <div className="space-y-2 p-1">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${color}`} />
              <p className="font-bold text-base">{assignment.title}</p>
              {assignment.allocation && <Badge variant="secondary">{assignment.allocation}%</Badge>}
            </div>
            <p className="text-sm text-gray-300">{assignment.project}</p>
            {assignment.projectStatus && (
                <p className="text-xs text-gray-400">Status: <span className="font-semibold text-gray-200">{assignment.projectStatus}</span></p>
            )}
            <div className="border-t border-gray-700 my-2" />
            <p className="text-xs text-gray-400">{format(start, "E, MMM d")} - {format(end, "E, MMM d")}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};


// --- MAIN COMPONENT ---
export function AssignmentsTimeline({ engineers: allEngineers = [], assignments: allAssignments = [] }: AssignmentsTimelineProps) {
  const [startDate, setStartDate] = useState(subDays(new Date(), 10));
  const [skillFilter, setSkillFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const numDays = 35;

  const days = useMemo(() => eachDayOfInterval({ start: startDate, end: addDays(startDate, numDays - 1) }), [startDate]);

  const filteredData = useMemo(() => {
    const lowerCaseSkillFilter = skillFilter.toLowerCase();
    const lowerCaseProjectFilter = projectFilter.toLowerCase();

    const engineers = allEngineers.filter(e =>
      !lowerCaseSkillFilter || e.skills?.some(s => s.toLowerCase().includes(lowerCaseSkillFilter))
    );
    const engineerIds = new Set(engineers.map(e => e.id));

    const assignments = allAssignments.filter(a =>
      engineerIds.has(a.engineerId) &&
      (!lowerCaseProjectFilter || a.project.toLowerCase().includes(lowerCaseProjectFilter))
    );
    
    // Group assignments by engineer for quick lookup
    const assignmentsByEngineer = new Map<string, Assignment[]>();
    for (const assignment of assignments) {
      if (!assignmentsByEngineer.has(assignment.engineerId)) {
        assignmentsByEngineer.set(assignment.engineerId, []);
      }
      assignmentsByEngineer.get(assignment.engineerId)!.push(assignment);
    }
    
    return { engineers, assignmentsByEngineer };
  }, [allEngineers, allAssignments, skillFilter, projectFilter]);

  return (
    <TooltipProvider>
      <Card className="p-4  bg-neutral-100 w-full  border-[2px] border-gray-800 rounded-lg shadow-md shadow-gray-900">
        <TimelineHeader
          startDate={startDate}
          setStartDate={setStartDate}
          skillFilter={skillFilter}
          setSkillFilter={setSkillFilter}
          projectFilter={projectFilter}
          setProjectFilter={setProjectFilter}
        />
        <div className="relative overflow-x-auto border-t border-gray-800">
          <div className="grid" style={{
            gridTemplateColumns: `250px repeat(${numDays}, minmax(80px, 1fr))`,
            gridTemplateRows: `auto repeat(${filteredData.engineers.length}, minmax(100px, auto))`,
          }}>
            {/* Grid Header (Dates) */}
            <div className="sticky top-0 left-0 z-20 "></div>
            {days.map((day, i) => (
              <div key={i} className={`sticky top-0 z-10  border-l border-gray-800 text-center py-2
                ${isToday(day) ? 'bg-neutral-500' : ''}`}>
                <div className={`text-xs text-gray-900  ${isToday(day) ? 'text-neutral-50' : ''}`}>{format(day, 'E')}</div>
                <div className={`text-lg font-semibold  ${isToday(day) ? 'text-neutral-50' : ''}`}>{format(day, 'd')}</div>
              </div>
            ))}

            {/* Grid Rows (Engineers & Assignments) */}
            {filteredData.engineers.map((engineer, engineerIndex) => (
                console.log(engineer),
              <React.Fragment key={engineer.id}>
                {/* Engineer info always in first column, sticky */}
                <div
                  className="sticky left-0 z-10  border-t border-r border-gray-800 bg-neutral-100 p-3"
                  style={{
                    gridColumn: 1,
                    gridRow: engineerIndex + 2,
                  }}
                >
                  <EngineerInfo engineer={engineer} />
                </div>
                {/* Assignment bars */}
                {(filteredData.assignmentsByEngineer.get(engineer.id) || []).map(assignment => {
                  const start = new Date(assignment.start);
                  const end = new Date(assignment.end);
                  const startIndex = differenceInDays(start, startDate);
                  const duration = differenceInDays(end, start) + 1;
                  if (startIndex + duration <= 0 || startIndex >= numDays) return null;
                  // Assignment bars start at column 2
                  return (
                    <AssignmentBlock
                      key={assignment._id}
                      assignment={assignment}
                      gridRow={`${engineerIndex + 2}`}
                      gridColumn={`${Math.max(0, startIndex) + 2} / span ${duration}`}
                    />
                  );
                })}
                {/* Background grid cells for this row (columns 2+) */}
                {days.map((_, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="border-t border-l border-gray-800"
                    style={{
                      gridColumn: dayIndex + 2,
                      gridRow: engineerIndex + 2,
                    }}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
          {filteredData.engineers.length === 0 && (
             <div className="text-center py-16 text-gray-500">No engineers match the current filters.</div>
          )}
        </div>
      </Card>
    </TooltipProvider>
  );
}