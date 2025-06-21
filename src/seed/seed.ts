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
      img: "/assets/profileImages/img1.jpg",
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
      img: "/assets/profileImages/img2.jpg",
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
      img: "/assets/profileImages/img3.jpg",
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
      img: "/assets/profileImages/img1.jpg",
      password: await bcrypt.hash("password123", 10),
    },
    // Additional engineers
    {
      email: "emma@company.com",
      name: "Emma Watson",
      role: "engineer",
      skills: ["Python", "Django"],
      seniority: "mid",
      maxCapacity: 100,
      department: "Backend",
      img: "/assets/profileImages/img2.jpg",
      password: await bcrypt.hash("password123", 10),
    },
    {
      email: "li@company.com",
      name: "Li Wei",
      role: "engineer",
      skills: ["Go", "Kubernetes"],
      seniority: "senior",
      maxCapacity: 100,
      department: "Cloud",
      img: "/assets/profileImages/img3.jpg",
      password: await bcrypt.hash("password123", 10),
    },
    {
      email: "sofia@company.com",
      name: "Sofia Rossi",
      role: "engineer",
      skills: ["Vue.js", "JavaScript"],
      seniority: "junior",
      maxCapacity: 80,
      department: "Frontend",
      img: "/assets/profileImages/img1.jpg",
      password: await bcrypt.hash("password123", 10),
    },
    {
      email: "michael@company.com",
      name: "Michael Brown",
      role: "engineer",
      skills: ["Java", "Spring Boot"],
      seniority: "mid",
      maxCapacity: 90,
      department: "Backend",
      img: "/assets/profileImages/img2.jpg",
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
      description: "Revamp the company website UI/UX with modern design principles and improved user experience.",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-02-15"),
      requiredSkills: ["React", "TypeScript"],
      teamSize: 2,
      status: "active",
      managerId: manager._id,
    },
    {
      name: "API Overhaul",
      description: "Refactor backend APIs for better performance and scalability.",
      startDate: new Date("2025-02-01"),
      endDate: new Date("2025-04-01"),
      requiredSkills: ["Node.js", "MongoDB"],
      teamSize: 2,
      status: "planning",
      managerId: manager._id,
    },
    {
      name: "Cloud Migration",
      description: "Move infrastructure to AWS cloud platform for better reliability.",
      startDate: new Date("2025-03-01"),
      endDate: new Date("2025-05-01"),
      requiredSkills: ["AWS", "Docker"],
      teamSize: 2,
      status: "active",
      managerId: manager._id,
    },
    {
      name: "Mobile App Development",
      description: "Build a cross-platform mobile application for customer engagement.",
      startDate: new Date("2025-04-01"),
      endDate: new Date("2025-06-30"),
      requiredSkills: ["React Native", "JavaScript"],
      teamSize: 3,
      status: "planning",
      managerId: manager._id,
    },
    {
      name: "Data Analytics Platform",
      description: "Develop a comprehensive analytics dashboard for business insights.",
      startDate: new Date("2025-05-01"),
      endDate: new Date("2025-07-31"),
      requiredSkills: ["Python", "Django"],
      teamSize: 2,
      status: "active",
      managerId: manager._id,
    },
    {
      name: "Microservices Architecture",
      description: "Transform monolithic application into microservices for better scalability.",
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-08-31"),
      requiredSkills: ["Go", "Kubernetes"],
      teamSize: 3,
      status: "planning",
      managerId: manager._id,
    },
    {
      name: "E-commerce Platform",
      description: "Build a modern e-commerce platform with payment integration.",
      startDate: new Date("2025-07-01"),
      endDate: new Date("2025-09-30"),
      requiredSkills: ["Vue.js", "Node.js"],
      teamSize: 4,
      status: "planning",
      managerId: manager._id,
    },
    {
      name: "Security Enhancement",
      description: "Implement comprehensive security measures across all applications.",
      startDate: new Date("2025-08-01"),
      endDate: new Date("2025-10-31"),
      requiredSkills: ["Java", "Spring Boot"],
      teamSize: 2,
      status: "planning",
      managerId: manager._id,
    },
  ]);

  // Assignments
  await Assignment.insertMany([
    // Alice – overlapping assignments in June-July
    {
      engineerId: engineers[0]._id, // Alice
      projectId: projects[0]._id,
      allocationPercentage: 60,
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-06-30"),
      role: "Frontend Developer",
    },
    {
      engineerId: engineers[0]._id, // Alice
      projectId: projects[1]._id,
      allocationPercentage: 30,
      startDate: new Date("2025-06-15"),
      endDate: new Date("2025-07-15"),
      role: "Frontend Developer",
    },
  
    // Bob – overlapping
    {
      engineerId: engineers[1]._id, // Bob
      projectId: projects[2]._id,
      allocationPercentage: 70,
      startDate: new Date("2025-06-10"),
      endDate: new Date("2025-07-10"),
      role: "Backend Developer",
    },
    {
      engineerId: engineers[1]._id,
      projectId: projects[3]._id,
      allocationPercentage: 20,
      startDate: new Date("2025-07-01"),
      endDate: new Date("2025-07-31"),
      role: "API Specialist",
    },
  
    // Priya – overlapping
    {
      engineerId: engineers[2]._id, // Priya
      projectId: projects[0]._id,
      allocationPercentage: 50,
      startDate: new Date("2025-06-05"),
      endDate: new Date("2025-07-05"),
      role: "Fullstack Developer",
    },
    {
      engineerId: engineers[2]._id,
      projectId: projects[4]._id,
      allocationPercentage: 30,
      startDate: new Date("2025-06-20"),
      endDate: new Date("2025-07-25"),
      role: "Fullstack Developer",
    },
  
    // Carlos
    {
      engineerId: engineers[3]._id,
      projectId: projects[2]._id,
      allocationPercentage: 100,
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-06-30"),
      role: "DevOps Engineer",
    },
  
    // Emma
    {
      engineerId: engineers[4]._id,
      projectId: projects[4]._id,
      allocationPercentage: 80,
      startDate: new Date("2025-07-01"),
      endDate: new Date("2025-07-30"),
      role: "Backend Developer",
    },
  
    // Li
    {
      engineerId: engineers[5]._id,
      projectId: projects[2]._id,
      allocationPercentage: 60,
      startDate: new Date("2025-06-05"),
      endDate: new Date("2025-07-15"),
      role: "Cloud Engineer",
    },
  
    // Sofia
    {
      engineerId: engineers[6]._id,
      projectId: projects[0]._id,
      allocationPercentage: 40,
      startDate: new Date("2025-06-15"),
      endDate: new Date("2025-07-10"),
      role: "Frontend Developer",
    },
  
    // Michael
    {
      engineerId: engineers[7]._id,
      projectId: projects[1]._id,
      allocationPercentage: 90,
      startDate: new Date("2025-06-20"),
      endDate: new Date("2025-07-25"),
      role: "Backend Developer",
    },
  
    // Additional entries for more data density
    {
      engineerId: engineers[3]._id,
      projectId: projects[3]._id,
      allocationPercentage: 40,
      startDate: new Date("2025-07-01"),
      endDate: new Date("2025-07-20"),
      role: "DevOps Engineer",
    },
    {
      engineerId: engineers[5]._id,
      projectId: projects[1]._id,
      allocationPercentage: 40,
      startDate: new Date("2025-07-01"),
      endDate: new Date("2025-07-28"),
      role: "Cloud Architect",
    },
  ]);
  

  console.log("Seed data inserted!",process.env.NEXT_PUBLIC_JWT_SECRET);
  console.log("Seed data inserted!");
  mongoose.connection.close();
}

seed(); 