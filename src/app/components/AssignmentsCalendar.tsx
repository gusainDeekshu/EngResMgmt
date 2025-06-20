"use client";
import { useState, useMemo } from "react";
import {
  addDays,
  format,
  isWithinInterval,
  startOfDay,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  subMonths,
  addMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Shadcn UI Components
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from "@/components/ui/popover";

// React Day Picker types for customization
import { DayPicker } from "react-day-picker";

// --- INTERFACES AND HELPERS (Mostly Unchanged) ---
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


// --- THE NEW CALENDAR COMPONENT ---
export function AssignmentsCalendar({ assignments = [] }: { assignments?: Assignment[] }) {
  // --- STATE MANAGEMENT ---
  const [month, setMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverTarget, setPopoverTarget] = useState<HTMLElement | null>(null);

  // Filters
  const [projectFilter, setProjectFilter] = useState("");
  const [engineerFilter, setEngineerFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // --- DATA PROCESSING ---
  const assignmentsByDay = useMemo(() => {
    const filteredAssignments = assignments.filter(a => {
        const matchesProject = !projectFilter || a.project.toLowerCase().includes(projectFilter.toLowerCase());
        const matchesEngineer = !engineerFilter || a.engineer?.toLowerCase().includes(engineerFilter.toLowerCase());
        const matchesRole = !roleFilter || a.role.toLowerCase().includes(roleFilter.toLowerCase());
        return matchesProject && matchesEngineer && matchesRole;
    });

    const dateMap = new Map<string, Assignment[]>();
    for (const assignment of filteredAssignments) {
      const interval = {
        start: startOfDay(new Date(assignment.start)),
        end: startOfDay(new Date(assignment.end)),
      };
      const daysInInterval = eachDayOfInterval(interval);

      for (const day of daysInInterval) {
        const key = format(day, "yyyy-MM-dd");
        if (!dateMap.has(key)) {
          dateMap.set(key, []);
        }
        dateMap.get(key)!.push(assignment);
      }
    }
    return dateMap;
  }, [assignments, projectFilter, engineerFilter, roleFilter]);

  // --- CUSTOM DAY COMPONENT ---
  function CustomDayContent(date: Date) {
    const dayKey = format(date, "yyyy-MM-dd");
    const dayAssignments = assignmentsByDay.get(dayKey) || [];

    return (
      <div className="relative h-full w-full">
        <span>{date.getDate()}</span>
        {dayAssignments.length > 0 && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-1">
            {dayAssignments.slice(0, 3).map((a) => (
              <div
                key={a._id}
                className={`h-1.5 w-1.5 rounded-full ${getProjectColor(a.project)}`}
                title={a.project}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- EVENT HANDLERS ---
  const handleDayClick = (day: Date | undefined, modifiers: any, e: React.MouseEvent) => {
    if (!day) return;
    
    const dayKey = format(day, "yyyy-MM-dd");
    const assignmentsForDay = assignmentsByDay.get(dayKey) || [];

    if (assignmentsForDay.length > 0) {
        setSelectedDay(day);
        setPopoverTarget(e.currentTarget as HTMLElement);
        setPopoverOpen(true);
    } else {
        setSelectedDay(null);
        setPopoverOpen(false);
    }
  };

  return (
    <Card className="p-4">
      {/* --- HEADER & FILTERS --- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold whitespace-nowrap">
                {format(month, "MMMM yyyy")}
            </h2>
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setMonth(subMonths(month, 1))}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setMonth(addMonths(month, 1))}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Input placeholder="Filter by project" className="w-36" value={projectFilter} onChange={e => setProjectFilter(e.target.value)} />
          <Input placeholder="Filter by engineer" className="w-36" value={engineerFilter} onChange={e => setEngineerFilter(e.target.value)} />
          <Input placeholder="Filter by role" className="w-36" value={roleFilter} onChange={e => setRoleFilter(e.target.value)} />
        </div>
      </div>

      {/* --- CALENDAR & POPOVER --- */}
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverAnchor asChild>
            {/* The anchor is virtual; we position the popover based on the clicked day's element */}
            <div style={{ position: 'fixed', top: popoverTarget?.getBoundingClientRect().bottom, left: popoverTarget?.getBoundingClientRect().left }}/>
        </PopoverAnchor>
        <Calendar
            month={month}
            onMonthChange={setMonth}
            onDayClick={handleDayClick}
            renderDay={CustomDayContent}
            className="p-0"
            classNames={{
                day_outside: "text-muted-foreground opacity-50",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day: "h-12 w-12 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
            }}
        />

        <PopoverContent className="w-80" align="start">
            {selectedDay && (
                <div className="space-y-4">
                    <div className="font-semibold text-lg border-b pb-2">
                        Assignments for {format(selectedDay, "MMMM d, yyyy")}
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {(assignmentsByDay.get(format(selectedDay, "yyyy-MM-dd")) || []).map(a => (
                            <div key={a._id} className="flex items-start gap-3">
                                <div className={`mt-1.5 h-3 w-3 rounded-full flex-shrink-0 ${getProjectColor(a.project)}`} />
                                <div>
                                    <p className="font-semibold text-sm">{a.project}</p>
                                    <p className="text-xs text-muted-foreground">{a.role}</p>
                                    {a.engineer && (
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <Avatar className="h-5 w-5">
                                                {a.engineerAvatar ? <img src={a.engineerAvatar} /> : <AvatarFallback className="text-xs">{a.engineer[0]}</AvatarFallback>}
                                            </Avatar>
                                            <span className="text-xs">{a.engineer}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </PopoverContent>
      </Popover>
    </Card>
  );
}