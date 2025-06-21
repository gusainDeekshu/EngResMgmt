# Engineering Resource Management System

A comprehensive web application for managing engineering resources, project assignments, and capacity planning. Built with Next.js, TypeScript, MongoDB, and modern UI components.

## Live Demo

🌐 **Live Application**: [https://geekyant-engineering-resource-managem.netlify.app/login](https://geekyant-engineering-resource-managem.netlify.app/login)

## Screenshots

### Manager Dashboard
![Manager Dashboard](public/screenshots/manager-dashboard.png)

### Engineer Dashboard
![Engineer Dashboard](public/screenshots/engineer-dashboard.png)

## Features

- **User Management**: Engineer and Manager roles with authentication
- **Project Management**: Create, update, and track project progress
- **Resource Allocation**: Assign engineers to projects with capacity planning
- **Dashboard Analytics**: Real-time insights into resource utilization
- **Calendar View**: Visual timeline of assignments and project schedules
- **Responsive Design**: Modern UI built with shadcn/ui components

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Custom JWT-based auth
- **UI Components**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd engineering-resource-mgmt
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/engineering-resource-mgmt
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/engineering-resource-mgmt

JWT_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000
```

### 4. Database Setup

Make sure MongoDB is running on your system or use MongoDB Atlas.

### 5. Seed the Database

Run the seed script to populate the database with sample data:

```bash
npm run seed
# or
yarn seed
```

This will create:
- 8 sample engineers with different skills and seniority levels
- 1 manager account
- 8 projects spanning June-August 2025
- 40+ assignments with realistic workload distribution

### 6. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Database Seed Script

The seed script (`src/seed/seed.ts`) creates comprehensive test data:

### Sample Users
- **Engineers**: 8 engineers with varied skills (React, Node.js, Python, Go, etc.)
- **Manager**: 1 manager account for project oversight

### Sample Projects (June-August 2025)
1. Website Redesign (June 1-30)
2. API Overhaul (June 15-July 15)
3. Cloud Migration (July 1-31)
4. Mobile App Development (July 15-August 15)
5. Data Analytics Platform (August 1-31)
6. Microservices Architecture (June 1-August 31)
7. E-commerce Platform (July 1-August 31)
8. Security Enhancement (August 1-31)

### Sample Assignments
- 40+ assignments with realistic allocation percentages
- No overlapping start dates for same engineer on different projects
- Varied roles: Frontend, Backend, Fullstack, DevOps, Cloud, Security

### Default Login Credentials
- **Manager**: manager@company.com / adminpass
- **Engineers**: alice@company.com / password123, bob@company.com / password123, etc.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API routes
│   ├── components/        # Page-specific components
│   ├── dashboard/         # Dashboard pages
│   ├── engineer/          # Engineer-specific pages
│   ├── projects/          # Project management pages
│   └── assignments/       # Assignment management pages
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility libraries
├── models/                # MongoDB models
├── seed/                  # Database seed script
├── store/                 # State management
└── types/                 # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
