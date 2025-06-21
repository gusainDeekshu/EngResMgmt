import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import Assignment from "@/models/Assignment";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "No token" }, { status: 401 });
    const token = auth.replace("Bearer ", "");

    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(payload.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const assignments = await Assignment.find({ engineerId: user._id }).populate("projectId");

    const now = new Date();
    const activeAssignments = assignments.filter(a => {
      const start = new Date(a.startDate);
      const end = new Date(a.endDate);
      return start <= now && end >= now;
    });

    const utilization = activeAssignments.reduce((acc, a) => acc + a.allocationPercentage, 0);
    
    // Use the user's maxCapacity from the User schema
    const maxUtilization = user.maxCapacity || 0;
    
    const projectsCount = new Set(activeAssignments.map(a => a.projectId.toString())).size;
    
    let nextFreeDate = now.toISOString().split("T")[0];
    if (activeAssignments.length > 0) {
      const latestEndDate = new Date(Math.max(...activeAssignments.map(a => new Date(a.endDate).getTime())));
      latestEndDate.setDate(latestEndDate.getDate() + 1); // Available the day after the last assignment ends
      nextFreeDate = latestEndDate.toISOString().split("T")[0];
    }

    // Get assignments for the current month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const assignmentsThisMonth = await Assignment.find({
      startDate: { $lte: monthEnd },
      endDate: { $gte: monthStart },
    });

    const assignmentsForWidget = assignmentsThisMonth.map(a => ({
      _id: a._id,
      start: a.startDate,
      end: a.endDate,
      project: a.projectId, // just return the ObjectId or string
      role: a.role,
      allocation: a.allocationPercentage,
    }));
    console.log(maxUtilization,"maxUtilization");

    return NextResponse.json({
      utilization,
      maxUtilization,
      projectsCount,
      nextFreeDate,
      assignments,
      assignmentsForWidget,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}