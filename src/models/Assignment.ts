import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import Project from "@/models/Project";

export interface IAssignment extends Document {
  engineerId: Types.ObjectId;
  projectId: Types.ObjectId;
  allocationPercentage: number;
  startDate: Date;
  endDate: Date;
  role: string;
}

const AssignmentSchema: Schema = new Schema({
  engineerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  allocationPercentage: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  role: { type: String, required: true },
});

export default (mongoose.models.Assignment as Model<IAssignment>) || mongoose.model<IAssignment>('Assignment', AssignmentSchema); 