# CRM — Lead Management Dashboard

A modern Lead Management Dashboard built using React, TypeScript, React Query, React Hook Form, Zod, Tailwind CSS, and JSON Server.

This project was developed as part of the Superleap Frontend Assessment (Level 1).

---

# Features

## Lead Management (CRUD)

* Create new leads
* View all leads
* Edit existing leads
* Delete leads

---

## Status Workflow Engine

Implemented a centralized business rules engine for lead status transitions.

### Supported Statuses

* NEW
* CONTACTED
* QUALIFIED
* CONVERTED
* LOST

### Workflow Rules

| Current Status | Allowed Next Status |
| -------------- | ------------------- |
| NEW            | CONTACTED, LOST     |
| CONTACTED      | QUALIFIED, LOST     |
| QUALIFIED      | CONVERTED, LOST     |
| CONVERTED      | Final Status        |
| LOST           | Final Status        |

Final statuses cannot be modified further.

---

## Search & Filtering

* Search by:

  * Lead name
  * Email

* Filter by:

  * Status

---

## Sorting

* Sort leads alphabetically by name
* Toggle ascending / descending order

---

## UI Features

* Responsive dashboard layout
* Status badges
* Dropdown action menu
* Search icon integration
* Zebra-striped table rows
* Inline form validation
* Empty states
* Loading states
* Modern Tailwind UI

---

# Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

## State Management

* React Query

## Forms & Validation

* React Hook Form
* Zod

## Icons

* Lucide React

## Mock Backend

* JSON Server

---

# Project Structure

```bash
src/
│
├── api/
│   └── leads.ts
│
├── components/
│   └── StatusBadge.tsx
│
├── pages/
│   ├── LeadsPage.tsx
│   ├── CreateLeadPage.tsx
│   └── EditLeadPage.tsx
│
├── types/
│   └── lead.ts
│
├── utils/
│   └── statusRules.ts
│
├── App.tsx
└── main.tsx
```

---

# Architecture Decisions

## API Layer Separation

All API logic is centralized inside:

```bash
src/api/leads.ts
```

This prevents fetch logic duplication across components and improves maintainability.

---

## Centralized Rules Engine

Lead transition rules are managed in:

```bash
src/utils/statusRules.ts
```

Benefits:

* reusable business logic
* scalable architecture
* cleaner components
* easier future modifications

---

## React Query for Server State

Used React Query for:

* data fetching
* caching
* background synchronization
* mutation handling
* query invalidation

---

## React Hook Form + Zod

Used for:

* performant forms
* schema validation
* inline validation
* clean form state management

---

# Validation Features

## Inline Validation

* Required name field
* Valid email format
* Phone number validation
* Real-time validation feedback

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone <your-repo-url>
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Start Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

## 4. Start JSON Server

```bash
npx json-server --watch backend/seed.json --port 3000
```

Backend runs on:

```bash
http://localhost:3000
```

---

# Example API Endpoints

| Method | Endpoint   | Description     |
| ------ | ---------- | --------------- |
| GET    | /leads     | Fetch all leads |
| POST   | /leads     | Create lead     |
| PATCH  | /leads/:id | Update lead     |
| DELETE | /leads/:id | Delete lead     |

---

# Future Improvements

* Authentication
* Pagination
* Kanban board view
* Bulk actions
* Dark mode
* Optimistic UI updates
* WebSocket live sync
* Advanced filtering
* Export functionality

---

# Learning Outcomes

This project helped strengthen concepts including:

* Component architecture
* Server state management
* Form validation
* Business rules implementation
* React Query mutations
* TypeScript typing
* Modern UI design
* Dropdown handling
* Conditional rendering
* Tailwind CSS styling

---

# Author

Yashovardhan A


