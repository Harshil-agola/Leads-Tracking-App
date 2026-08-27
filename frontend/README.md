# Leads Tracker — Frontend

A minimal, accessible leads tracking interface built with React 19, TypeScript, Vite, React Hook Form, and vanilla CSS variables.

## Tech Stack

- **React 19** with TypeScript
- **Vite** (build tool and dev server)
- **React Hook Form** for form validation and state management
- **Lucide React** for icons
- **Biome** for fast formatting and linting (ESLint-free setup)
- **Google Fonts (Poppins)** typography

## Features

- **Admin Authentication**: Protected dashboard routes with React Hook Form validation and inline feedback messages below the login trigger.
- **Leads Directory**: Paginated table listing leads with name, contact details, status badge, and creation date.
- **Search & Filter**: Inline debounced search filtering leads across name, email, and phone, alongside status filter options.
- **Lead Creation**: Dedicated form with custom React Hook Form validation and server error handling.
- **Lead Details, Inline Editing & Notes**: Full profile view where details can be edited in place, with the ability to append timestamped follow-up notes.
- **Custom Modals**: Accessible confirmation popups for deleting records with escape key and backdrop dismiss support.
- **Clean Component Architecture**: Modular component structure where each component has its own `.tsx`, `.css`, and index entry point.

## Project Structure

```
frontend/
├── src/
│   ├── api/              # Typed REST client and error handler
│   ├── components/
│   │   └── common/       # Button, Input, Select, Table, Modal, ProtectedRoute
│   ├── constants/        # Route definitions, validation rules, status options
│   ├── context/          # AuthContext provider and authentication state
│   ├── hooks/            # useDebounce custom hook
│   ├── pages/            # LoginPage, LeadsListPage, CreateLeadPage, LeadDetailPage, NotFoundPage
│   ├── types/            # TypeScript interfaces and data models
│   ├── App.tsx           # Router configuration
│   ├── main.tsx          # Application entrypoint
│   └── index.css         # Design tokens, variables, and global layout
├── biome.json            # Biome linting and formatting configuration
├── package.json
└── vite.config.ts
```

## Getting Started

### Admin Credentials

Use the following default credentials to access the admin dashboard:

- **Email**: `admin@example.com`
- **Password**: `admin123`

### Installation
```bash
pnpm install
```

### Environment Variables

Create a `.env` file in the frontend root if configuring a custom backend URL (defaults to `http://localhost:8080`):

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
# Run Biome lint checks
pnpm lint:fix

# Format code with Biome
pnpm format:fix

# Perform combined lint & format check
pnpm check
```
