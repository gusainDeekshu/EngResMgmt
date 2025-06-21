"use client";

import { useState, useMemo } from "react";
import {
  format,
  eachDayOfInterval,
  startOfDay,
} from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

// --- INTERFACES AND HELPERS ---
interface Assignment {
  _id: string;
  project: string;
  start: string;
  end: string;
  role: string;
  allocation: number;
}

const PROJECT_COLORS = [
  "bg-indigo-500", "bg-green-500", "bg-pink-500", "bg-yellow-500", "bg-blue-500", "bg-purple-500", "bg-orange-500"
];

function getProjectColor(project: string) {
  if (!project || typeof project !== 'string') {
    return PROJECT_COLORS[0]; // Return first color as default
  }
  
  let hash = 0;
  for (let i = 0; i < project.length; i++) {
    hash = project.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PROJECT_COLORS[Math.abs(hash) % PROJECT_COLORS.length];
}

// --- THE NEW AND IMPROVED CALENDAR COMPONENT ---
export function AssignmentsCalendar({ assignments = [] }: { assignments?: Assignment[] }) {
  const [month, setMonth] = useState(new Date());

  // --- DATA PROCESSING ---
  const assignmentsByDay = useMemo(() => {
    const dateMap = new Map<string, Assignment[]>();
    for (const assignment of assignments) {
      if (!assignment.start || !assignment.end) continue;

      try {
        const interval = {
          start: startOfDay(new Date(assignment.start)),
          end: startOfDay(new Date(assignment.end)),
        };
        
        if (interval.start > interval.end) continue;

        const daysInInterval = eachDayOfInterval(interval);
        for (const day of daysInInterval) {
          const key = format(day, "yyyy-MM-dd");
          if (!dateMap.has(key)) {
            dateMap.set(key, []);
          }
          dateMap.get(key)!.push(assignment);
        }
      } catch (error) {
        console.warn('Error processing assignment dates:', assignment, error);
        continue;
      }
    }
    return dateMap;
  }, [assignments]);

  // --- MODIFIERS to mark which days are "occupied" ---
  const modifiers = useMemo(() => ({
    occupied: (date: Date) => {
      try {
        // Validate the date parameter
        if (!date || isNaN(date.getTime())) {
          return false;
        }
        
        const dayKey = format(date, "yyyy-MM-dd");
        return assignmentsByDay.has(dayKey) && assignmentsByDay.get(dayKey)!.length > 0;
      } catch (error) {
        console.warn('Error in occupied modifier:', error);
        return false;
      }
    },
  }), [assignmentsByDay]);

  // --- STYLING for our custom "occupied" modifier ---
  const modifierClassNames = {
    occupied: " dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 rounded-md font-medium",
  };

  // --- CUSTOM DAY COMPONENT WITH TOOLTIP ---
  function CustomDay(props: { day: any; modifiers: any } & React.HTMLAttributes<HTMLTableCellElement>) {
    try {
      const { day, modifiers, ...restProps } = props;
      
      // Validate the day prop - day should have a date property
      if (!day || !day.date) {
        return (
          <td className="relative h-full w-full flex items-center justify-center" {...restProps}>
            <span>?</span>
          </td>
        );
      }
      
      const dateObj = new Date(day.date);
      if (isNaN(dateObj.getTime())) {
        // Invalid date, render a basic day cell
        return (
          <td className="relative h-full w-full flex items-center justify-center" {...restProps}>
            <span>?</span>
          </td>
        );
      }
      
      const dayKey = format(dateObj, "yyyy-MM-dd");
      const dayAssignments = assignmentsByDay.get(dayKey) || [];

      const dayContent = (
        <div className="relative h-full w-full flex items-center justify-center">
          <span>{format(dateObj, "d")}</span>
          {dayAssignments.length > 0 && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-1">
              {dayAssignments.slice(0, 3).map((a) => (
                <div
                  key={a._id}
                  className={`h-1.5 w-1.5 rounded-full ${getProjectColor(a.project || '')}`}
                />
              ))}
            </div>
          )}
        </div>
      );

      if (dayAssignments.length > 0) {
        return (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <td className="relative h-full w-full flex items-center justify-center cursor-help" {...restProps}>
                  {dayContent}
                </td>
              </TooltipTrigger>
              <TooltipContent className="pointer-events-none max-w-xs" side="top" align="center">
                <div className="text-center font-semibold mb-2">
                  {format(dateObj, "MMMM d, yyyy")}
                </div>
                <ul className="space-y-2">
                  {dayAssignments.map((a) => (
                    <li key={a._id} className="flex items-center gap-2 text-left">
                      <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${getProjectColor(a.project || '')}`} />
                      <div>
                        <p className="font-bold text-sm leading-tight">{a.project || 'Unknown Project'}</p>
                        <p className="text-xs text-muted-foreground">{a.role || 'Unknown Role'} ({a.allocation || 0}%)</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

      return (
        <td className="relative h-full w-full flex items-center justify-center" {...restProps}>
          {dayContent}
        </td>
      );
    } catch (error) {
      console.error('Error in CustomDay:', error);
      // Fallback for any unexpected errors
      return (
        <td className="relative h-full w-full flex items-center justify-center" {...props}>
          <span>?</span>
        </td>
      );
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Schedule - {format(month, "MMMM yyyy")}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <Calendar
          month={month}
          onMonthChange={setMonth}
          modifiers={modifiers}
          modifiersClassNames={modifierClassNames}
          components={{
            Day: CustomDay,
          }}
          className="p-0"
          classNames={{
            day: "h-12 w-12 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
            day_outside: "text-muted-foreground opacity-50",
            head_cell: "text-muted-foreground rounded-md w-12 font-normal text-[0.8rem]",
            nav_button: "h-7 w-7",
          }}
        />
      </CardContent>
    </Card>
  );
}