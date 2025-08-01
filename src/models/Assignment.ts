import mongoose, { Schema, Types } from "mongoose";

export interface AssignmentData {
  engineerId: Types.ObjectId;
  projectId: Types.ObjectId;
  allocationPercentage: number;
  startDate: Date;
  endDate: Date;
  role: string;
}

const AssignmentSchema: Schema<AssignmentData> = new Schema(
  {
    engineerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    allocationPercentage: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    role: { type: String, required: true },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const AssignmentModel =
  mongoose.models.Assignment || mongoose.model("Assignment", AssignmentSchema);

export default AssignmentModel;
