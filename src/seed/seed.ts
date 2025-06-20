import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import Project from "@/models/Project";
import Assignment from "@/models/Assignment";
import { connectToDatabase } from "@/lib/db";

async function seed() {
  await connectToDatabase();
  await User.deleteMany({});
  await Project.deleteMany({});
  await Assignment.deleteMany({});

  // Engineers
  const engineers = await User.insertMany([
    {
      email: "alice@company.com",
      name: "Alice Johnson",
      role: "engineer",
      skills: ["React", "TypeScript"],
      seniority: "senior",
      maxCapacity: 100,
      department: "Frontend",
      password: await bcrypt.hash("password123", 10),
    },
    {
      email: "bob@company.com",
      name: "Bob Lee",
      role: "engineer",
      skills: ["Node.js", "MongoDB"],
      seniority: "mid",
      maxCapacity: 100,
      department: "Backend",
      password: await bcrypt.hash("password123", 10),
    },
    {
      email: "priya@company.com",
      name: "Priya Singh",
      role: "engineer",
      skills: ["React", "Node.js"],
      seniority: "junior",
      maxCapacity: 50,
      department: "Fullstack",
      password: await bcrypt.hash("password123", 10),
    },
    {
      email: "carlos@company.com",
      name: "Carlos Diaz",
      role: "engineer",
      skills: ["AWS", "Docker"],
      seniority: "senior",
      maxCapacity: 50,
      department: "DevOps",
      password: await bcrypt.hash("password123", 10),
    },
  ]);

  // Manager
  const manager = await User.create({
    email: "manager@company.com",
    name: "Jane Manager",
    role: "manager",
    password: await bcrypt.hash("adminpass", 10),
  });

  // Projects
  const projects = await Project.insertMany([
    {
      name: "Website Redesign",
      description: "Revamp the company website UI/UX.",
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-07-15"),
      requiredSkills: ["React", "TypeScript"],
      teamSize: 2,
      status: "active",
      managerId: manager._id,
    },
    {
      name: "API Overhaul",
      description: "Refactor backend APIs for performance.",
      startDate: new Date("2025-06-10"),
      endDate: new Date("2025-08-01"),
      requiredSkills: ["Node.js", "MongoDB"],
      teamSize: 2,
      status: "planning",
      managerId: manager._id,
    },
    {
      name: "Cloud Migration",
      description: "Move infrastructure to AWS.",
      startDate: new Date("2025-06-20"),
      endDate: new Date("2025-09-01"),
      requiredSkills: ["AWS", "Docker"],
      teamSize: 2,
      status: "active",
      managerId: manager._id,
    },
  ]);

  // Assignments
  await Assignment.insertMany([
    {
      engineerId: engineers[0]._id,
      projectId: projects[0]._id,
      allocationPercentage: 60,
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-07-15"),
      role: "Frontend Developer",
    },
    {
      engineerId: engineers[1]._id,
      projectId: projects[1]._id,
      allocationPercentage: 50,
      startDate: new Date("2025-06-10"),
      endDate: new Date("2025-08-01"),
      role: "Backend Developer",
    },
    {
      engineerId: engineers[2]._id,
      projectId: projects[0]._id,
      allocationPercentage: 40,
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-07-15"),
      role: "Fullstack Developer",
    },
    {
      engineerId: engineers[2]._id,
      projectId: projects[1]._id,
      allocationPercentage: 10,
      startDate: new Date("2025-06-10"),
      endDate: new Date("2025-08-01"),
      role: "Fullstack Developer",
    },
    {
      engineerId: engineers[3]._id,
      projectId: projects[2]._id,
      allocationPercentage: 50,
      startDate: new Date("2025-06-20"),
      endDate: new Date("2025-09-01"),
      role: "DevOps Engineer",
    },
    {
      engineerId: engineers[1]._id,
      projectId: projects[2]._id,
      allocationPercentage: 30,
      startDate: new Date("2025-06-20"),
      endDate: new Date("2025-09-01"),
      role: "Backend Developer",
    },
  ]);

  console.log("Seed data inserted!");
  mongoose.connection.close();
}

seed(); 