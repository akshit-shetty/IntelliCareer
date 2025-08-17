# IntelliCareer - AI-Powered Career Guidance Platform

## Overview

IntelliCareer is a comprehensive career guidance platform that provides personalized AI-driven recommendations to help users discover their career paths. The application combines user profiling, psychometric assessments, skill gap analysis, and personalized course recommendations to guide users through their professional development journey.

The platform features a modern React frontend with a Node.js/Express backend, using PostgreSQL for data persistence and Drizzle ORM for database operations. The application is designed with a focus on user experience, featuring a clean interface built with shadcn/ui components and Tailwind CSS styling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built using React 18 with TypeScript, utilizing a component-based architecture. The frontend uses:
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Build Tool**: Vite for fast development and optimized production builds

The application follows a page-based routing structure with protected routes requiring authentication. Key pages include landing, dashboard, onboarding, career paths, courses, and user profile management.

### Backend Architecture
The server is built with Express.js and TypeScript, following RESTful API principles:
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth integration with OpenID Connect for secure user authentication
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **API Structure**: Route-based organization with middleware for authentication and error handling
- **Data Validation**: Zod schemas for request/response validation and type safety

The backend implements a storage abstraction layer that handles user profiles, assessments, skills, career recommendations, and course management.

### Database Design
The PostgreSQL database schema supports the core application features:
- **User Management**: Users and user profiles with onboarding completion tracking
- **Assessment System**: Personality traits, career interests, and psychometric data storage
- **Skills Framework**: Skills catalog with user skill levels and learning targets
- **Career System**: Career paths with salary ranges, demand levels, and required skills
- **Recommendations Engine**: AI-generated career recommendations with match scores and reasoning
- **Learning Platform**: Course catalog with user enrollment and progress tracking
- **Session Storage**: Secure session management for authentication persistence

### Authentication and Authorization
The application uses Replit's OpenID Connect authentication system:
- **SSO Integration**: Seamless login through Replit's identity provider
- **Session-based Auth**: Server-side session management with secure HTTP-only cookies
- **Route Protection**: Middleware-based authentication checks for protected endpoints
- **User Context**: Consistent user identity across frontend and backend components

### Key Design Patterns
- **Repository Pattern**: Storage abstraction for database operations
- **Component Composition**: Reusable UI components following shadcn/ui patterns
- **Hook-based Logic**: Custom React hooks for authentication, data fetching, and UI state
- **Error Boundary Handling**: Graceful error handling with user-friendly messaging
- **Progressive Enhancement**: Mobile-first responsive design with adaptive layouts

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection pooling for Neon database
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect support
- **@tanstack/react-query**: Server state management and caching solution
- **express**: Web application framework for the backend API
- **passport**: Authentication middleware with OpenID Connect strategy

### UI and Styling Dependencies  
- **@radix-ui/react-***: Comprehensive set of headless UI primitives for accessible components
- **tailwindcss**: Utility-first CSS framework for rapid UI development
- **class-variance-authority**: Type-safe CSS class variance management
- **lucide-react**: Modern icon library with React components

### Development and Build Tools
- **vite**: Fast build tool with HMR and optimized bundling
- **typescript**: Static type checking for enhanced developer experience
- **@replit/vite-plugin-***: Replit-specific development plugins for seamless integration
- **tsx**: TypeScript execution for development server

### Validation and Data Handling
- **zod**: Runtime type validation and schema parsing
- **react-hook-form**: Performant forms with minimal re-renders
- **@hookform/resolvers**: Integration layer for form validation with Zod schemas

### Database and Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **ws**: WebSocket implementation for Neon serverless connections
- **drizzle-kit**: Database migration and schema management tools