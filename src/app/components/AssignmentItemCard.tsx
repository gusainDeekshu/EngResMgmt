"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProgressBar from "./ProgressBar"; // Assuming you have this component

// Define the shape of a single assignment coming from your API
interface ApiAssignment {
  _id: string;
  projectId: {
    name: string;
  };
  startDate: string;
  endDate:string;
  role: string;
  allocationPercentage: number;
}

// Helper to determine the assignment status
const getStatus = (startDate: string, endDate: string): { text: string; variant: "default" | "secondary" | "destructive" | "outline" } => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end < now) return { text: "Completed", variant: "secondary" };
  if (start > now) return { text: "Upcoming", variant: "outline" };
  return { text: "Active", variant: "default" };
};

export default function AssignmentItemCard({ assignment }: { assignment: ApiAssignment }) {
  const status = getStatus(assignment.startDate, assignment.endDate);
  
  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{assignment.projectId.name}</CardTitle>
          <Badge variant={status.variant}>{status.text}</Badge>
        </div>
        <CardDescription>{assignment.role}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          <ProgressBar percent={assignment.allocationPercentage} />
          <div className="text-xs text-muted-foreground">
            <span>{assignment.allocationPercentage}% Allocated</span>
            <span className="mx-2">•</span>
            <span>
              {new Date(assignment.startDate).toLocaleDateString()} - {new Date(assignment.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}