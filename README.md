# Employee Management Frontend

A Vue 3 + Vite frontend for a simple employee management dashboard.

## What this project contains

- **Login screen** for admin authentication
- **Dashboard** with employee list, edit/delete controls, and logout
- **API wrapper** under `src/services/api.ts` for authenticated requests
- **Vue Router** for `/login` and `/dashboard` flow
- **Modern UI** using scoped component styles and Bootstrap for base UI support

## Screenshots

### Sign in page

<img src="https://gcdnb.pbrd.co/images/HmWkAUsrZOCK.png" />

### Dashboard

<img src="https://gcdnb.pbrd.co/images/zBmHLuG6TgiB.png"/>

## Key folders

- `src/views/` — main page components (`LoginView.vue`, `DashboardView.vue`)
- `src/services/` — shared API helpers
- `src/router/` — app routing setup
- `src/` — app entry files and root component

## Getting started

### Install dependencies

```sh
npm install
```

### Run locally

```sh
npm run dev
```

Open the URL printed by Vite in your browser.

### Build for production

```sh
npm run build
```

### Preview production build

```sh
npm run preview
```

## Notes

- The app stores the auth token in `localStorage` as `employee_token`.
- API requests use `apiFetch()` from `src/services/api.ts`.
- The dashboard component currently shows a lean employee table and an edit modal.

## Security practices included

- Auth is handled through a shared helper in `src/services/auth.ts`.
- API requests attach a bearer token and include `Accept: application/json`.
- 401/403 responses automatically clear stale auth state and redirect to login.
- The login form trims credentials and validates non-empty input before sending.

## Backend security notes

This frontend assumes a secure backend. A real backend should:

- enforce HTTPS and secure headers
- validate bearer tokens or session cookies server-side
- use HttpOnly cookies for session tokens when possible
- implement rate limiting and input validation
- protect sensitive routes with role checks

## Requirements

- Node.js `^20.19.0 || >=22.12.0`
- `npm`

## Useful commands

- `npm run dev` — start development server
- `npm run build` — build production bundle
- `npm run preview` — preview production output
- `npm run type-check` — run Vue TypeScript checks

## Recommended editor setup

- VS Code with **Volar** for Vue TypeScript support
- Optionally enable Vue Devtools in your browser for debugging
