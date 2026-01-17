# PALETTE - Project Management App

## Overview
PALETTE is a project management application that allows users to create boards and organize tasks with style. It features a drag-and-drop interface, table/board views, and an AI assistant.

## Current State
- Successfully migrated from Lovable to Replit
- Frontend-only React/Vite application running on port 5000
- Uses React Router for navigation
- Styled with Tailwind CSS and shadcn/ui components

## Project Architecture

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: Zustand (usePaletteStore)
- **Routing**: React Router DOM v6
- **Drag & Drop**: @dnd-kit

### Directory Structure
```
src/
├── components/       # Reusable UI components
│   └── ui/          # shadcn/ui base components
├── pages/           # Page components (Dashboard, BoardView, Settings, etc.)
├── hooks/           # Custom React hooks
├── contexts/        # React context providers
├── lib/             # Utility functions
├── types/           # TypeScript type definitions
└── assets/          # Static assets
```

### Key Files
- `src/App.tsx` - Main app component with routing
- `src/main.tsx` - Entry point
- `src/hooks/usePaletteStore.ts` - Global state management
- `vite.config.ts` - Vite configuration (port 5000, allowedHosts enabled)

## Development

### Running the App
```bash
npm run dev
```
The app runs on port 5000 with hot module replacement.

### Building for Production
```bash
npm run build
```
Static files are output to the `dist` directory.

## Recent Changes
- January 17, 2026: Migrated from Lovable to Replit environment
  - Updated Vite config to use port 5000 and allow all hosts
  - Configured static deployment

## User Preferences
(To be updated as user specifies preferences)
