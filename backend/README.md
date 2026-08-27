# Leads Tracking App — Backend

Backend REST API for tracking leads and notes, built with Express 5, TypeScript, and Node's built-in SQLite engine.

---

## Tech Stack

- **Node.js**
- **Express v5**
- **SQLite** (using Node's native `node:sqlite` `DatabaseSync` with WAL mode enabled — zero external database driver dependencies)
- **TypeScript**
- **Biome** for linting and code formatting (faster alternative to ESLint & Prettier)
- **pnpm** as package manager

---

## Documentation

### 1. Install dependencies
```bash
pnpm install
```

### 2. Environment variables
Create a `.env` file in the root of the backend folder:
```env
PORT=8080
NODE_ENV="development"
FRONTEND_ORIGIN="http://localhost:5173"
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

---

## Database Schema

Database is stored in a local SQLite file (`database.db`).

- **`leads`**: `id`, `name`, `email` (unique), `phone`, `status` (`new`, `contacted`, `qualified`, `lost`), `createdAt`, `updatedAt`
- **`notes`**: `id`, `leadId` (foreign key with cascade delete), `content`, `createdAt`, `updatedAt`

---

## API Endpoints

### 1. Health Check
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

### 2. Leads

#### `GET /api/leads`
Fetch paginated leads with optional search, status filtering, and notes count.

**Query parameters (all optional):**
- `search` — Filter by name, email, or phone (partial match)
- `status` — Filter by status (`new` | `contacted` | `qualified` | `lost`)
- `page` — Page number (default: `1`)
- `limit` — Items per page (default: `10`)

**Example Requests:**
```bash
# Get page 1
"http://localhost:8080/api/leads?page=1&limit=10"

# Search by keyword
"http://localhost:8080/api/leads?search=alex"

# Filter by status
"http://localhost:8080/api/leads?status=qualified"

# Combined filters
"http://localhost:8080/api/leads?search=john&status=contacted&page=1&limit=5"
```

#### `POST /api/leads`
Create a new lead.
```
http://localhost:8080/api/leads
```

**Request body:**
```json
{
  "name": "Sarah Connor",
  "email": "sarah@example.com",
  "phone": "+1 555-0199"
  }'
```

**Success Response (`201`):**
```json
{
  "success": true,
  "data": {
    "id": 4,
    "name": "Sarah Connor",
    "email": "sarah@example.com",
    "phone": "+1 555-0199",
    "status": "new",
    "createdAt": "2026-08-27 10:34:03",
    "updatedAt": "2026-08-27 10:34:03"
  }
}
```

**Validation Error (`400`):**
```json
{
  "success": false,
  "message": "Invalid email address",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

**Duplicate Email Error (`409`):**
```json
{
  "success": false,
  "message": "Lead with this email already exists"
}
```

---

### 4. Delete a Lead
- **`DELETE /api/leads/:id`**
- Deletes a lead by ID (and automatically cascades to delete all associated notes).

**Example curl:**
```bash
DELETE http://localhost:8080/api/leads/1
```

**Success Response (`200`):**
```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

**Not Found Response (`404`):**
```json
{
  "success": false,
  "message": "Lead not found"
}
```

