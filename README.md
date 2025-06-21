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

## Development Approach & AI Tooling

This project was developed using a combination of traditional coding and AI-powered tools to accelerate development and improve code quality. Here's a breakdown of the tools used:

### AI-Powered Development Environment
- **Cursor IDE**: An AI-first code editor that integrates AI capabilities directly into the development workflow. It was used for code generation, refactoring, and understanding complex codebases.

### AI Models & Tools
- **Google Gemini Studio**: Leveraged for its powerful multimodal capabilities and large context window. It helped in generating complex components, brainstorming application architecture, and creating documentation.
- **ChatGPT**: Utilized for quick code snippets, debugging assistance, and generating boilerplate code.

This approach of combining human expertise with AI assistance allowed for rapid prototyping, efficient development, and a focus on building high-quality features.

## My Approach, Decisions, and Challenges

This section outlines the strategic approach, key decisions, and challenges faced during the development of the Engineering Resource Management System.

### My Approach

My approach was to build a robust, scalable, and user-friendly application by following an iterative development process. The core philosophy was to start with a solid foundation and incrementally add features.

1.  **Foundation First**: I began by setting up the Next.js project, defining the MongoDB schemas, and implementing the core authentication system.
2.  **Component-Driven UI**: I adopted a component-based architecture, creating reusable UI elements with `shadcn/ui` that could be composed to build complex interfaces.
3.  **Data-Centric Development**: I created a comprehensive seed script early on. This allowed me to work with realistic data, making it easier to test features like resource allocation, capacity planning, and timeline visualizations.
4.  **AI-Assisted Workflow**: I integrated AI tools throughout the development cycle—from brainstorming architecture with Google Gemini Studio to generating boilerplate code with ChatGPT and refactoring with Cursor IDE.

### Key Decisions

-   **Tech Stack**:
    -   **Next.js**: Chosen for its powerful full-stack capabilities, including server-side rendering, API routes, and a seamless developer experience.
    -   **MongoDB & Mongoose**: Selected for its flexible, schema-on-read nature, which is ideal for applications with evolving data structures. Mongoose provided a straightforward way to model application data.
    -   **TypeScript**: Used to enforce type safety, reduce runtime errors, and improve code maintainability, especially in a growing codebase.
    -   **shadcn/ui**: Preferred over other component libraries for its unstyled, composable, and accessible components, which provided full control over the final look and feel.

-   **Authentication**: I decided to implement a custom JWT-based authentication system to have granular control over the security and user session management, rather than relying on a third-party provider.

### Challenges & How I Approached Them

-   **Challenge**: **Complex State Management for Resource Allocation**
    -   **Problem**: Managing the state for the engineer assignment timeline, which involved complex date calculations, allocation percentages, and filtering.
    -   **Solution**: I created dedicated API endpoints to handle the business logic of calculating engineer capacity and fetching assignments for a given date range. This kept the frontend components lean and focused on rendering data. For date manipulation, I used the `date-fns` library to ensure accuracy.

-   **Challenge**: **Visualizing Overlapping Assignments**
    -   **Problem**: Creating an intuitive timeline view that clearly shows how engineers are allocated across multiple projects, especially with overlapping dates.
    -   **Solution**: I designed a custom timeline component using CSS Grid, which allowed for precise placement of assignment blocks. I used color-coding and clear labeling to distinguish between projects and implemented dynamic rendering based on start and end dates to accurately reflect the schedule.

-   **Challenge**: **Generating Realistic and Diverse Seed Data**
    -   **Problem**: The application's effectiveness depends heavily on having realistic data to test. Creating this data manually would be tedious and error-prone.
    -   **Solution**: I invested time in building a robust seed script (`src/seed/seed.ts`). I started with a small dataset and iteratively expanded it to include a variety of scenarios, such as fully allocated engineers, engineers on multiple projects, and projects with different timelines. This script became an invaluable tool for testing and development.

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
