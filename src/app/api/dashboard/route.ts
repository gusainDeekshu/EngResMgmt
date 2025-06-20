import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import Project from "@/models/Project";
import User from "@/models/User";
import Assignment from "@/models/Assignment";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "No token" }, { status: 401 });
    const token = auth.replace("Bearer ", "");

    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (payload.role !== 'manager') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // 1. Total Engineers
    const totalEngineers = await User.countDocuments({ role: 'engineer' });

    // 2. Active Projects
    const now = new Date();
    const activeAssignments = await Assignment.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).distinct('projectId');
    const activeProjectsCount = activeAssignments.length;

    // 3. Average Utilization
    const engineers = await User.find({ role: 'engineer' });
    const engineerIds = engineers.map(e => e._id);
    const allAssignments = await Assignment.find({ engineerId: { $in: engineerIds } });
    
    let totalUtilization = 0;
    let soonestNextAvailability: Date | null = null;
    for (const engineer of engineers) {
      const engineerAssignments = allAssignments.filter(a => String(a.engineerId) === String(engineer._id));
      const activeNow = engineerAssignments.filter(a => new Date(a.startDate) <= now && new Date(a.endDate) >= now);
      const utilization = activeNow.reduce((acc, a) => acc + a.allocationPercentage, 0);
      totalUtilization += utilization;
      // Find the soonest end date among all active assignments
      if (activeNow.length > 0) {
        const earliestEnd = new Date(Math.min(...activeNow.map(a => new Date(a.endDate).getTime())));
        earliestEnd.setDate(earliestEnd.getDate() + 1); // Available the day after
        if (!soonestNextAvailability || earliestEnd < soonestNextAvailability) {
          soonestNextAvailability = earliestEnd;
        }
      }
    }
    const averageUtilization = totalEngineers > 0 ? Math.round(totalUtilization / totalEngineers) : 0;
    
    // 4. Team Overview (with individual utilization)
    const engineersWithUtilization = engineers.map(engineer => {
      const engineerAssignments = allAssignments.filter(a => String(a.engineerId) === String(engineer._id));
      const activeNow = engineerAssignments.filter(a => new Date(a.startDate) <= now && new Date(a.endDate) >= now);
      const utilization = activeNow.reduce((acc, a) => acc + a.allocationPercentage, 0);
      return {
        _id: engineer._id,
        name: engineer.name,
        role: engineer.role,
        skills: engineer.skills,
        percent: utilization,
        img: (engineer as any)?.img || null,
      };
    });

    // 5. Assignments for the current month (for CalendarWidget)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const assignmentsThisMonth = await Assignment.find({
      startDate: { $lte: monthEnd },
      endDate: { $gte: monthStart },
    });
    // Manual join for project names
    const projectIds = assignmentsThisMonth.map(a => a.projectId.toString());
    const uniqueProjectIds = [...new Set(projectIds)];
    const projects = await Project.find({ _id: { $in: uniqueProjectIds } }, { name: 1 });
    const projectMap = Object.fromEntries(projects.map((p) => [p._id?.toString?.(), p.name]));
    const assignmentsForWidget = assignmentsThisMonth.map(a => ({
      _id: a._id,
      start: a.startDate,
      end: a.endDate,
      project: projectMap[a.projectId.toString()] || "Unknown",
      role: a.role,
      allocation: a.allocationPercentage,
    }));

    return NextResponse.json({
      totalEngineers,
      activeProjectsCount,
      averageUtilization,
      nextAvailability: soonestNextAvailability ? soonestNextAvailability.toISOString().split("T")[0] : null,
      engineers: engineersWithUtilization,
      assignments: assignmentsForWidget,
    });

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

// Helper to compare only the date part (ignoring time)
function isDateInRange(date: Date, start: Date, end: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  return s <= d && d <= e;
}

function getAssignmentsForDate(date: Date) {
  return assignments.filter(a => {
    const start = new Date(a.start);
    const end = new Date(a.end);
    return isDateInRange(date, start, end);
  });
} 