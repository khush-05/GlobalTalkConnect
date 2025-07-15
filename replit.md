# GlobalTalk - Real-time Video Chat with Translation

## Overview
GlobalTalk is a video calling application with AI-powered real-time translation capabilities. The application enables users to communicate across language barriers through video calls with integrated chat functionality and language translation features.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with Tailwind CSS for styling
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Real-time Communication**: Socket.io client for WebSocket connections

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Real-time Communication**: Socket.io server for WebSocket handling
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Build System**: ESBuild for production builds

### Key Components

#### Database Schema
- **Users**: Basic user authentication with username/password
- **Rooms**: Video call rooms with unique IDs and metadata
- **Participants**: Users currently in rooms with language preferences
- **Messages**: Chat messages with optional translation support

#### Real-time Features
- **WebRTC**: Peer-to-peer video/audio communication using browser APIs
- **Socket.io**: Real-time messaging and room management
- **Media Handling**: Camera and microphone access with mute/unmute controls

#### UI Components
- **Video Containers**: Display local and remote video streams
- **Chat Panel**: Real-time messaging with translation display
- **Call Setup**: Room creation and joining interface
- **Navigation**: Route-based page navigation

### Data Flow

1. **Room Creation**: Users create rooms via REST API, generating unique room IDs
2. **Room Joining**: Participants join rooms with name and language preferences
3. **WebRTC Setup**: Peer-to-peer connections established for video/audio
4. **Real-time Messaging**: Chat messages sent through WebSocket connections
5. **Translation**: Messages processed for language translation (placeholder for AI integration)

### External Dependencies

#### Core Libraries
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **UI Components**: Radix UI primitives with Tailwind CSS styling
- **Database**: Drizzle ORM with Neon Database serverless PostgreSQL
- **Real-time**: Socket.io for WebSocket communication
- **Forms**: React Hook Form with Zod validation
- **Build Tools**: Vite, ESBuild, TypeScript

#### WebRTC & Media
- **Native Browser APIs**: getUserMedia, RTCPeerConnection
- **STUN Servers**: Google STUN servers for NAT traversal

### Deployment Strategy

#### Development Environment
- **Hot Reload**: Vite development server with HMR
- **Database**: Environment-based DATABASE_URL configuration
- **Assets**: Static asset serving through Vite

#### Production Build
- **Client**: Vite builds optimized React bundle to `dist/public`
- **Server**: ESBuild compiles Express server to `dist/index.js`
- **Database**: Drizzle migrations managed through `drizzle-kit`

#### Environment Configuration
- **Database**: PostgreSQL connection via DATABASE_URL environment variable
- **Replit Integration**: Special handling for Replit development environment
- **Error Handling**: Runtime error overlay for development debugging

### Architecture Decisions

#### Database Choice
- **Selected**: PostgreSQL with Drizzle ORM
- **Rationale**: Type-safe database operations with strong schema validation
- **Alternatives**: Direct SQL, Prisma ORM
- **Pros**: Excellent TypeScript integration, lightweight, schema-first approach
- **Cons**: Smaller ecosystem compared to Prisma

#### Real-time Communication
- **Selected**: Socket.io for signaling, native WebRTC for media
- **Rationale**: Socket.io provides reliable WebSocket fallbacks, WebRTC ensures direct peer communication
- **Alternatives**: Pure WebSocket, WebRTC-only solutions
- **Pros**: Battle-tested reliability, automatic fallbacks, room management
- **Cons**: Additional complexity with dual communication channels

#### UI Framework
- **Selected**: Radix UI with Tailwind CSS
- **Rationale**: Accessible components with utility-first styling
- **Alternatives**: Material-UI, Chakra UI, plain CSS modules
- **Pros**: Accessibility built-in, design system flexibility, small bundle size
- **Cons**: More setup required, learning curve for Radix patterns

#### State Management
- **Selected**: TanStack Query for server state, React useState for local state
- **Rationale**: Specialized tools for different state types
- **Alternatives**: Redux Toolkit, Zustand, pure React state
- **Pros**: Automatic caching, optimistic updates, background refetching
- **Cons**: Additional mental model for server vs client state