# ApnaFreelancer - Freelance Marketplace Platform

## Overview

ApnaFreelancer is a modern freelance marketplace platform that connects clients with freelancers for various services. The platform enables users to post jobs, offer services, communicate through messaging, and manage freelance work relationships. Built with a full-stack TypeScript architecture, it provides a seamless experience for both freelancers and clients to find opportunities and collaborate effectively.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with protected routes based on authentication status
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form validation
- **Styling**: Tailwind CSS with custom design system including Poppins and Inter fonts

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured route handlers
- **Middleware**: Custom logging, JSON parsing, and error handling middleware
- **Development**: Hot reloading with Vite integration for seamless development experience

### Authentication System
- **Provider**: Replit OAuth integration using OpenID Connect
- **Session Management**: Express sessions with PostgreSQL session store
- **Strategy**: Passport.js with custom OIDC strategy
- **Security**: HTTP-only cookies with secure session handling

### Database Architecture
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Relational design with tables for users, services, jobs, proposals, messages, reviews, and categories
- **Migrations**: Drizzle Kit for database schema management

### Core Data Models
- **Users**: Profiles supporting both freelancer and client roles with ratings and skills
- **Services**: Freelancer service offerings with categories, pricing, and skill tags
- **Jobs**: Client job postings with requirements and budget information
- **Proposals**: Freelancer bids on client jobs
- **Messages**: Real-time messaging system between users
- **Reviews**: Rating and feedback system for completed work
- **Categories**: Organized service and job categorization

### File Structure
- `client/`: React frontend application with components, pages, and utilities
- `server/`: Express backend with routes, database, and authentication
- `shared/`: Common TypeScript types and Zod schemas shared between frontend and backend
- Monorepo structure enabling code sharing and type safety across the full stack

## External Dependencies

### Database Services
- **Neon PostgreSQL**: Serverless PostgreSQL database for primary data storage
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Authentication Services
- **Replit OAuth**: OpenID Connect authentication provider
- **Passport.js**: Authentication middleware with OpenID Connect strategy

### UI and Styling
- **Radix UI**: Headless UI components for accessibility and functionality
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Build tool and development server with React plugin
- **TypeScript**: Type safety across the entire application
- **Drizzle Kit**: Database migration and schema management
- **TanStack Query**: Server state management and caching

### Runtime Libraries
- **React Hook Form**: Form handling with validation
- **Zod**: Runtime type validation and schema definition
- **Date-fns**: Date manipulation utilities
- **Wouter**: Lightweight React router