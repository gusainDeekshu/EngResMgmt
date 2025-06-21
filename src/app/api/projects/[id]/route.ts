import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/Project";
import Assignment from "@/models/Assignment";
import { connectToDatabase } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const project = await Project.findById(id);
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const data = await req.json();
  
  try {
    const project = await Project.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    
    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  
  try {
    // First, delete all assignments related to this project
    const deleteAssignmentsResult = await Assignment.deleteMany({ projectId: id });
    console.log(`Deleted ${deleteAssignmentsResult.deletedCount} assignments for project ${id}`);
    
    // Then delete the project
    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: "Project and related assignments deleted successfully",
      deletedAssignments: deleteAssignmentsResult.deletedCount
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
} 