"use client";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Project from "@/models/Project";

interface Assignment {
  _id: string;
  project: string;
  engineer: string;
  start: string;
  end: string;
  role: string;
  allocation: number;
}

// Helper to compare only the date part (ignoring time)
function isDateInRange(date: Date, start: Date, end: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  return s <= d && d <= e;
}

export default function CalendarWidget({ assignments = [] }: { assignments?: Assignment[] }) {
  const [value, setValue] = useState<Date | [Date, Date] | null>(new Date());

  // Find assignments for a given date (date-only)
  function getAssignmentsForDate(date: Date) {
    return assignments.filter(a => {
      const start = new Date(a.start);
      const end = new Date(a.end);
      return isDateInRange(date, start, end);
    });
  }

  const selectedDate = Array.isArray(value) ? value[0] : value;

  return (
    <div>
      <Calendar
        value={value}
        onChange={val => {
          if (Array.isArray(val)) {
            setValue(val.filter(Boolean) as [Date, Date]);
          } else if (val) {
            setValue(val);
          } else {
            setValue(new Date());
          }
        }}
        tileContent={({ date, view }) => {
          if (view !== "month") return null;
          const todaysAssignments = getAssignmentsForDate(date);
          if (todaysAssignments.length === 0) return null;
          return (
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {todaysAssignments.slice(0, 2).map(a => (
                <li key={a._id} style={{ fontSize: 10, color: "#2563eb", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {a.project}
                </li>
              ))}
              {todaysAssignments.length > 2 && (
                <li style={{ fontSize: 10, color: "#888" }}>+{todaysAssignments.length - 2} more</li>
              )}
            </ul>
          );
        }}
      />
      {selectedDate && (
        <div className="mt-2">
          <div className="font-semibold text-sm mb-1">Assignments on {selectedDate.toLocaleDateString()}:</div>
          <ul className="text-xs">
            {getAssignmentsForDate(selectedDate).length === 0 && <li>No assignments</li>}
            {getAssignmentsForDate(selectedDate).map(a => (
              <li key={a._id}>
                <span className="font-medium">{a.project}</span> ({a.role}) - {a.engineer} [{a.allocation}%]
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 