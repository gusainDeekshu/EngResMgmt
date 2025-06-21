import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import Assignment from "@/models/Assignment";
import { connectToDatabase } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const engineer = await User.findById(id);
  if (!engineer) return NextResponse.json({ error: "Engineer not found" }, { status: 404 });
  const activeAssignments = await Assignment.find({ engineerId: id });
  const totalAllocated = activeAssignments.reduce((sum, a) => sum + a.allocationPercentage, 0);
  const available = (engineer.maxCapacity || 0) - totalAllocated;
  return NextResponse.json({ available });
} 