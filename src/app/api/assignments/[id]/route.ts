import { NextRequest, NextResponse } from "next/server";
import Assignment from "@/models/Assignment";
import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const data = await req.json();

  if (data.projectId && !mongoose.Types.ObjectId.isValid(data.projectId)) {
    console.log(data);
    return NextResponse.json({ error: "Invalid Project ID format" }, { status: 400 });
  }
  if (data.engineerId && !mongoose.Types.ObjectId.isValid(data.engineerId)) {
    return NextResponse.json({ error: "Invalid Engineer ID format" }, { status: 400 });
  }

  const assignment = await Assignment.findByIdAndUpdate(params.id, data, { new: true });
  if (!assignment) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
  return NextResponse.json({ assignment });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const assignment = await Assignment.findByIdAndDelete(params.id);
  if (!assignment) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
  return NextResponse.json({ success: true });
} 