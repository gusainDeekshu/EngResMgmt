import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";

export async function GET() {
  await connectToDatabase();
  const engineers = await User.find({ role: "engineer" }).select("-password");
  return NextResponse.json({ engineers });
} 