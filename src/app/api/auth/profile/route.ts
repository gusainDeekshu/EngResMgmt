import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "No token" }, { status: 401 });
  const token = auth.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(payload.id).select("-password");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  await connectToDatabase();
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "No token" }, { status: 401 });
  
  const token = auth.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(payload.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    
    const body = await req.json();
    const { name, department, skills, seniority } = body;
    
    // Update user fields
    if (name) user.name = name;
    if (department) user.department = department;
    if (skills) user.skills = skills;
    if (seniority) user.seniority = seniority;
    
    await user.save();
    
    // Return updated user without password
    const updatedUser = await User.findById(user._id).select("-password");
    
    return NextResponse.json({ 
      message: "Profile updated successfully", 
      user: updatedUser 
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
} 