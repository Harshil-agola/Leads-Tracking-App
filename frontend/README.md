# Leads Tracker - Frontend

A minimal, accessible leads tracking interface built with React 19, TypeScript, Vite, and vanilla CSS variables.

## Tech Stack

- **React 19** with TypeScript
- **Vite** (build tool and dev server)
- **React Hook Form** for form validation and state
- **Lucide React** for icons
- **Biome** for fast formatting and linting
- **Google Fonts (Poppins)** typography

## Features

- **Leads Directory**: Paginated table listing leads with name, contact details, status, and creation date.
- **Search**: Inline debounced search filtering leads across name, email, and phone without full page reloads.
- **Lead Creation**: Dedicated form with custom validation and server error handling.
- **Lead Details, Inline Editing & Notes**: Full profile view where details can be edited directly in place, with the ability to append timestamped follow-up notes.
- **Custom Modals**: Accessible confirmation popups for deleting records with escape key and backdrop dismiss support.
- **Clean Component Architecture**: Modular component structure where each component has its own `.tsx`, `.css`, and `index.ts` entry.

## Project Structure

```
frontend/
├── src/
│   ├── api/              # Typed REST client and error handler
│   ├── components/
│   │   └── common/       # Button, Input, Select, Table, Modal
│   ├── constants/        # Route definitions, validation rules, status options
│   ├── hooks/            # useDebounce, usePagination, useFetch
│   ├── pages/            # LeadsListPage, CreateLeadPage, LeadDetailPage, NotFoundPage
│   ├── types/            # TypeScript interfaces and data models
│   ├── App.tsx           # Router configuration
│   ├── main.tsx          # Application entrypoint
│   └── index.css         # Design tokens, variables, and global layout
├── biome.json            # Biome linting and formatting configuration
├── package.json
└── vite.config.ts
```

## Getting Started

### Installation
```bash
pnpm install
```

### Environment Variables

Create a `.env` file in the frontend root if configuring a custom backend URL (defaults to `http://localhost:8080/api/leads`):

```env
VITE_API_URL=http://localhost:8080
```

### Development

```bash
pnpm dev
```

The app will be accessible at `http://localhost:5173`.

### Production Build

```bash
pnpm build

pnpm preview
```

### Linting & Formatting

```bash
pnpm lint

pnpm format

pnpm check
```
