import { NextRequest, NextResponse } from "next/server";
import Assignment from "@/models/Assignment";
import { connectToDatabase } from "@/lib/db";

export async function GET() {
  await connectToDatabase();
  const assignments = await Assignment.find().populate("projectId").populate("engineerId");
  return NextResponse.json({ assignments });
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const data = await req.json();
  const assignment = await Assignment.create(data);
  return NextResponse.json({ assignment });
} 