import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  role: 'engineer' | 'manager';
  skills?: string[];
  seniority?: 'junior' | 'mid' | 'senior';
  maxCapacity?: number;
  department?: string;
  password?: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['engineer', 'manager'], required: true },
  skills: [{ type: String }],
  seniority: { type: String, enum: ['junior', 'mid', 'senior'] },
  maxCapacity: { type: Number },
  department: { type: String },
  password: { type: String },
});

export default (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema); 