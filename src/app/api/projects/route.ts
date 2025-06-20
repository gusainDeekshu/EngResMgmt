import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/Project";
import { connectToDatabase } from "@/lib/db";

export async function GET() {
  await connectToDatabase();
  const projects = await Project.find();
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const data = await req.json();
  const project = await Project.create(data);
  return NextResponse.json({ project });
} 