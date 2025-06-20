import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import Project from "@/models/Project";
import User from "@/models/User";
import Assignment from "@/models/Assignment";

export interface IProject extends Document {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  requiredSkills: string[];
  teamSize: number;
  status: 'planning' | 'active' | 'completed';
  managerId: Types.ObjectId;
}

const ProjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  requiredSkills: [{ type: String }],
  teamSize: { type: Number },
  status: { type: String, enum: ['planning', 'active', 'completed'], default: 'planning' },
  managerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export default (mongoose.models.Project as Model<IProject>) || mongoose.model<IProject>('Project', ProjectSchema); 