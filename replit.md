# PALETTE

## Overview

PALETTE is a minimalist, Notion-inspired project management workspace built with React and TypeScript. The core concept centers on creating visual "palettes" of projects where each board has a customizable color. The application features a Monday.com-style table view for task management, AI assistant integration ("Pal"), and various productivity tools like calculators, flashcards, and mind maps.

The app currently uses a hybrid data approach with localStorage as the primary storage mechanism, with Supabase integration available for authentication and future cloud sync capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: Radix UI primitives wrapped with shadcn/ui
- **Animations**: Framer Motion for smooth transitions
- **Routing**: React Router DOM v6

### State Management
- Custom React hooks pattern using `usePaletteStore` as the central state manager
- Context API via `PaletteContext` for global state distribution
- All data persisted to localStorage under the `palette_data` key
- React Query configured but primarily used for potential future API integration

### Data Model
The app manages four primary entities:
- **Boards**: Projects with customizable colors, templates, and optional SMART goals
- **Groups**: Sections within boards for organizing tasks (Monday.com style)
- **Columns**: Define the structure and data types for tasks
- **Tasks**: Individual items with flexible data fields based on column types

### Authentication
- Supabase client configured for GitHub OAuth and Magic Link email auth
- Currently bypassed with a mock user for development/testing
- Auth state managed via `use-auth.ts` hook

### Board Templates
Five template types available: blank, todo, softwaredev, learning, and smart_goal. Each template comes with pre-configured columns and groups appropriate for the use case.

### Tool System
Modular tool components in `src/components/tools/` provide board-specific functionality:
- Calculator, Code Snippets, File Storage, Flashcards, Mind Map, PDF Editor
- Tools are associated with specific board template types via `boardTools.ts`

### Layout Structure
- `AppLayout` component provides the main shell with a collapsible right sidebar
- `RightSidebar` contains navigation, board list, and quick actions
- Board views support both table/grid layouts and Kanban-style columns

## External Dependencies

### Supabase (Authentication & Future Database)
- Project URL: `https://mmmfebmyxmcyirncalqw.supabase.co`
- Used for GitHub OAuth and email magic link authentication
- Requires environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- See `AUTH_GUIDE.md` and `SUPABASE_SETUP.md` for configuration details

### Deployment
- Configured for Vercel deployment via `vercel.json`
- SPA routing handled with rewrite rules
- Production URL: `https://palette-test-murex.vercel.app`

### AI Integration (Planned)
- Settings support for OpenAI, Claude, and Gemini API keys
- BYOK (Bring Your Own Key) model for user-provided API credentials
- "Pal" AI assistant UI exists but requires API keys to function

### Drag and Drop
- @dnd-kit library for task reordering within groups
- Sortable contexts applied to table rows and kanban cards

### Third-Party Services Referenced
- YouTube integration for embedding videos in tasks
- Developer tools links (Canva, various AI tools) defined in `devTools.ts`