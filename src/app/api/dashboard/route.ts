import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import "@/models/User";      // just registers
import "@/models/Project";   // just registers
import  "@/models/Assignment"; // the one you're using
import User from "@/models/User";
import Assignment from "@/models/Assignment";


const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "No token" }, { status: 401 });
    const token = auth.replace("Bearer ", "");

    const payload = jwt.verify(token, JWT_SECRET) as { role: string };
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
        img: engineer?.img || null,
        seniority: engineer.seniority,
      };
    });

    // 5. Assignments for the current month (for CalendarWidget and Timeline)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const assignmentsThisMonth = await Assignment.find({
      startDate: { $lte: monthEnd },
      endDate: { $gte: monthStart },
    })
      .populate({ path: 'engineerId', select: 'name skills seniority department' })
      .populate({ path: 'projectId', select: 'name status' });

    const assignmentsForWidget = assignmentsThisMonth.map(a => ({
      _id: a._id,
      start: a.startDate,
      end: a.endDate,
      project: typeof a.projectId === 'object' && a.projectId !== null && 'name' in a.projectId ? a.projectId.name : "Unknown",
      projectStatus: typeof a.projectId === 'object' && a.projectId !== null && 'status' in a.projectId ? a.projectId.status : "",
      role: a.role,
      seniority: a.seniority,
      allocation: a.allocationPercentage,
      engineerId: typeof a.engineerId === 'object' && a.engineerId !== null && '_id' in a.engineerId ? a.engineerId._id : a.engineerId,
      engineerName: typeof a.engineerId === 'object' && a.engineerId !== null && 'name' in a.engineerId ? a.engineerId.name : "",
      engineerSkills: typeof a.engineerId === 'object' && a.engineerId !== null && 'skills' in a.engineerId ? a.engineerId.skills : [],
      engineerSeniority: typeof a.engineerId === 'object' && a.engineerId !== null && 'seniority' in a.engineerId ? a.engineerId.seniority : "",
      engineerDepartment: typeof a.engineerId === 'object' && a.engineerId !== null && 'department' in a.engineerId ? a.engineerId.department : "",
      engineerAvatar: typeof a.engineerId === 'object' && a.engineerId !== null && 'img' in a.engineerId ? a.engineerId.img : null,
      projectId: typeof a.projectId === 'object' && a.projectId !== null && '_id' in a.projectId ? a.projectId._id : a.projectId,
      isTentative: typeof a.isTentative !== 'undefined' ? a.isTentative : false,
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

// function isSameDay(d1: Date, d2: Date) {
//   return d1.getFullYear() === d2.getFullYear() &&
//          d1.getMonth() === d2.getMonth() &&
//          d1.getDate() === d2.getDate();
// }

// // Helper to compare only the date part (ignoring time)
// function isDateInRange(date: Date, start: Date, end: Date) {
//   const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
//   const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
//   const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
//   return s <= d && d <= e;
// } 