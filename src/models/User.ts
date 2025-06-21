import mongoose, { Schema } from "mongoose";

export interface UserData {
  email: string;
  name: string;
  role: "engineer" | "manager";
  skills?: string[];
  seniority?: "junior" | "mid" | "senior";
  maxCapacity?: number;
  department?: string;
  img?: string;
  password?: string;
}

const UserSchema: Schema<UserData> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["engineer", "manager"], required: true },
    skills: [{ type: String }],
    seniority: { type: String, enum: ["junior", "mid", "senior"] },
    maxCapacity: { type: Number },
    department: { type: String },
    img: { type: String },
    password: { type: String },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const UserModel = mongoose.models.users || mongoose.model("users", UserSchema);

export default UserModel;
