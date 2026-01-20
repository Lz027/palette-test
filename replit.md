# Palette App

## Overview
Palette is a task organization web application built with React, TypeScript, and Vite. It uses Supabase for authentication and data storage.

## Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication/Database**: Supabase
- **State Management**: TanStack React Query
- **UI Components**: Radix UI primitives
- **Drag & Drop**: dnd-kit

## Project Structure
```
src/
  components/     # UI components
  contexts/       # React contexts
  hooks/          # Custom hooks
  lib/            # Utilities and Supabase client
  pages/          # Page components
  types/          # TypeScript types
  utils/          # Helper functions
```

## Development
- **Dev Server**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build`
- **Test**: `npm test`

## Environment Variables
The app uses Supabase with the following variables (with hardcoded fallbacks):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Deployment
Static deployment with `npm run build` - outputs to `dist/` directory.
