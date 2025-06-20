import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/Project";
import { connectToDatabase } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const project = await Project.findById(params.id);
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  return NextResponse.json({ project });
} 