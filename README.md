# Vitalis — Patient Record System (Frontend Only)

An advanced, fully functional **ReactJS-only** front end for a hospital patient record
system. There is no backend — all data is mocked with an in-browser "database"
(localStorage) that simulates async API calls, so the app is 100% self-contained and
demo-ready out of the box. The mock service layer (`src/services/`) mirrors what real
axios calls would look like, so swapping in a real Spring Boot/Node backend later is a
drop-in replacement.

## Features / Modules

- **Landing page** — public marketing page
- **Login / Register** — mock authentication with 4 pre-loaded demo roles
- **Role-based Home dashboard** — different content for staff roles vs. patients
- **Patients module** — list, search, add, edit, delete, detail view
- **Doctors module** (admin) — roster management via modal forms
- **Appointments module** — list view + custom month calendar, book/edit/cancel
- **Medical records module** — prescriptions, lab reports, imaging notes, filterable
- **Reports/analytics** — charts (patients by status, doctor workload, diagnoses)
- **Admin — User management** — manage all accounts and roles
- **Patient self-service** — "My appointments" and "My records" for the patient role
- **Settings** — profile editing, demo data reset, logout
- **404 page**

## Demo accounts (shown on the login page too)

| Role    | Email                | Password    |
|---------|-----------------------|-------------|
| Admin   | admin@vitalis.dev     | admin123    |
| Doctor  | doctor@vitalis.dev    | doctor123   |
| Staff   | staff@vitalis.dev     | staff123    |
| Patient | patient@vitalis.dev   | patient123  |

You can also register a brand new patient account from the Register page.

## Setup

```bash
npm install
npm start
```

Opens at `http://localhost:3000`.

## Project structure

```
src/
├── components/
│   ├── common/        Sidebar, Topbar, AppLayout, ProtectedRoute, Modal, Loader, StatCard, VitalsLine
├── context/
│   └── AuthContext.js  global auth state (login/register/logout, session persistence)
├── data/
│   ├── seedData.js     initial mock data
│   └── mockDb.js        localStorage-backed mock database (async, like a real API)
├── services/            one file per resource — the "API layer" (mock now, real later)
├── pages/
│   ├── LandingPage.js, LoginPage.js, RegisterPage.js, HomePage.js, NotFoundPage.js
│   ├── patients/        PatientList, PatientForm, PatientDetails
│   ├── doctors/         DoctorList
│   ├── appointments/     AppointmentCalendar
│   ├── records/          MedicalRecords
│   ├── reports/          ReportsPage
│   ├── admin/            UserManagement
│   ├── patient/          MyAppointments, MyRecords
│   └── settings/         SettingsPage
├── routes/
│   └── AppRoutes.js      centralized route + role-guard definitions
└── styles/               tokens.css (design system), base.css, layout.css, vitals.css, landing.css, auth.css, pages.css
```

## Role-based access

Routes are wrapped in `<ProtectedRoute allowedRoles={[...]}>`. Roles: `ADMIN`, `DOCTOR`,
`STAFF`, `PATIENT`. Unauthorized visitors are redirected to `/login`; unauthorized
roles are redirected to `/home`.

## Connecting a real backend later

Replace the contents of each file in `src/services/` with real `axios` calls (see the
earlier Spring Boot version of this project for a matching REST API). Because pages only
ever import from `services/`, no page code needs to change — just the implementation
underneath.

## Design system

Colors, type, spacing, and radii are defined as CSS custom properties in
`src/styles/tokens.css`. The signature visual motif is the animated ECG/"vitals" line
(`src/components/common/VitalsLine.js`), used as the loading indicator, section divider,
and login-page ambient background — a direct nod to patient monitoring.
