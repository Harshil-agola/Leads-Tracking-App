# Leads Tracking App — Backend

Backend REST API for tracking leads and notes, built with Express 5, TypeScript, Node's built-in SQLite engine, and JWT HttpOnly cookie authentication.

---

## Tech Stack

- **Node.js** (v24+)
- **Express v5**
- **SQLite** (using Node's native `node:sqlite` `DatabaseSync` with WAL mode enabled — zero external database driver dependencies)
- **TypeScript**
- **Biome** for fast linting and formatting
- **Docker & Docker Compose** for containerization
- **pnpm** as package manager

---

## Quick Start

### 1. Install dependencies
```bash
pnpm install
```

### 2. Environment variables
Create a `.env` file in the root of the backend folder:
```env
PORT="8080"
FRONTEND_ORIGIN="http://localhost:5173"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
JWT_SECRET="supersecret_admin_jwt_secret_key_123"
```

### 3. Seed sample data (optional)
```bash
pnpm seed:leads
```

### 4. Run development server
```bash
pnpm dev
```
The server will run on `http://localhost:8080`.

### 5. Running Tests & Linting
```bash
# Run Jest integration test suite
pnpm test

# Run Biome linter
pnpm lint:fix

# Format code with Biome
pnpm format:fix
```

---

## Running with Docker

### Docker Compose (Recommended)
```bash
cd backend
docker compose up --build
```
The container (`leads-api`) will be exposed on port `8080`.

### Docker CLI Directly
```bash
cd backend
docker build -t leads-api .
docker run -d -p 8080:8080 --name leads-api leads-api
```

---

## Database Schema

Database is stored in a local SQLite file (`database.db`).

- **`leads`**: `id`, `name`, `email` (unique), `phone`, `status` (`new`, `contacted`, `qualified`, `lost`), `createdAt`, `updatedAt`
- **`notes`**: `id`, `leadId` (foreign key with cascade delete), `content`, `createdAt`, `updatedAt`

---

## API Endpoints

### 1. Health Check & System Status
- **`GET /health`**
- Returns server status.

```bash
curl http://localhost:8080/health
```

**Response:**
```json
{
  "message": "Server is running",
  "status": "healthy"
}
```

---

### 2. Authentication

#### `POST /api/auth/login`
Authenticate admin user and issue an HttpOnly JWT cookie.

**Request body:**
```json
{
  "email": "admin@domain.com",
  "password": "Password123!"
}
```

**Success Response (`200`):**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "user": {
    "email": "admin@domain.com",
    "role": "admin"
  }
}
```

#### `GET /api/auth/verify`
Verify existing session token.

**Success Response (`200`):**
```json
{
  "success": true,
  "message": "Authenticated successfully",
  "user": {
    "email": "admin@domain.com",
    "role": "admin"
  }
}
```

**Unauthorized Response (`401`):**
```json
{
  "success": false,
  "message": "Unauthorized access. Please log in."
}
```

#### `POST /api/auth/logout`
Clear the HttpOnly authentication session cookie.

---

### 3. Leads

#### `GET /api/leads`
Fetch paginated leads with optional search, status filtering, and notes count.

**Query parameters (all optional):**
- `search` — Filter by name, email, or phone (partial match)
- `status` — Filter by status (`new` | `contacted` | `qualified` | `lost`)
- `page` — Page number (default: `1`)
- `limit` — Items per page (default: `10`)

#### `GET /api/leads/:id`
Fetch a single lead by ID along with all attached notes.

#### `POST /api/leads`
Create a new lead.

#### `PATCH /api/leads/:id`
Update fields of an existing lead (`name`, `email`, `phone`, `status`).

#### `DELETE /api/leads/:id`
Delete a lead by ID (cascading to remove notes).

#### `GET /api/leads/:id/notes`
Fetch notes attached to a specific lead.

#### `POST /api/leads/:id/notes`
Add a new note to a lead.
