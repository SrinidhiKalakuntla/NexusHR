# NexusHR

A modern Human Resources Management System (HRMS) built with React, TypeScript, and Vite. NexusHR helps organizations manage employees, attendance, leave requests, payroll, performance tracking, recruitment workflows, and analytics through a centralized platform.

---

## Project Overview

NexusHR is designed as a scalable HR Management System with a modular architecture. Each HR function is developed as an independent feature module, making the application easy to maintain, extend, and integrate with future backend services.

The application currently includes:

* Authentication & Authorization
* Dashboard
* Employee Management
* Role-Based Access Control
* Theme Support (Light/Dark Mode)

Future modules include:

* Attendance Management
* Leave Management
* Payroll Management
* Performance Management
* Recruitment Management
* Reports & Analytics

---

## Tech Stack

### Frontend

* React 19
* TypeScript
* Vite

### Styling

* TailwindCSS
* CSS Variables Theme System
* Light/Dark Mode Support

### State Management

* Zustand (Client State)
* TanStack Query (Server State)

### Forms & Validation

* React Hook Form
* Zod

### Networking

* Axios

### Routing

* React Router

### Notifications

* Sonner

### Charts & Visualization

* Recharts
* React Flow

---

## Features Implemented

### Authentication Module

* Demo login system
* Protected routes
* Role-based authentication
* Persistent login state using Zustand
* Logout functionality

### Dashboard Module

* Dashboard landing page
* Navigation sidebar
* Header section
* Theme toggle support
* Responsive layout

### Employee Management Module

#### Employee Listing

* View all employees
* Search employees by:

  * Name
  * Email
  * Employee ID

#### Employee Details

* Employee profile page
* Department information
* Designation information
* Contact details
* Employment information

#### Employee Operations

* Add Employee
* Edit Employee
* Delete Employee

#### Filters

* Filter by Department
* Filter by Employment Status

#### Pagination

* Client-side pagination
* Employee count tracking

#### Validation

* Form validation using React Hook Form and Zod

#### Role-Based Access

| Role       | Employee Module Access |
| ---------- | ---------------------- |
| Admin      | Full Access            |
| HR Manager | Full Access            |
| Manager    | View Only              |
| Employee   | No Access              |

---

## Demo Accounts

Use the following demo credentials to explore the application:

| Role       | Email                                               | Password    |
| ---------- | --------------------------------------------------- | ----------- |
| Admin      | [admin@nexushr.com](mailto:admin@nexushr.com)       | admin123    |
| HR Manager | [hr@nexushr.com](mailto:hr@nexushr.com)             | hr123       |
| Manager    | [manager@nexushr.com](mailto:manager@nexushr.com)   | manager123  |
| Employee   | [employee@nexushr.com](mailto:employee@nexushr.com) | employee123 |

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/SrinidhiKalakuntla/NexusHR.git
cd NexusHR
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the project root.

Example:

```env
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCK=true
```

### Environment Variables

| Variable      | Description      | Default                   |
| ------------- | ---------------- | ------------------------- |
| VITE_API_URL  | Backend API URL  | http://localhost:3000/api |
| VITE_USE_MOCK | Enable Mock Data | true                      |

---

## Running the Project

### Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint Project

```bash
npm run lint
```

---

## Project Structure

```text
src/
│
├── app/
│   ├── providers
│   ├── router
│   └── bootstrap
│
├── assets/
│
├── components/
│   ├── common/
│   ├── layout/
│   ├── charts/
│   └── ui/
│
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── employees/
│   ├── attendance/
│   ├── leave/
│   ├── payroll/
│   ├── performance/
│   └── recruitment/
│
├── hooks/
│
├── lib/
│
├── mocks/
│
├── routes/
│
├── stores/
│
├── styles/
│
└── types/
```

---

## Employee Module Structure

```text
src/features/employees/
│
├── components/
│   ├── EmployeeTable.tsx
│   ├── EmployeeFilters.tsx
│   ├── EmployeeFormDialog.tsx
│   ├── EmployeePagination.tsx
│   ├── EmployeeStatusBadge.tsx
│   └── DeleteEmployeeDialog.tsx
│
├── hooks/
│   ├── useEmployees.ts
│   ├── useEmployee.ts
│   └── useEmployeeMutations.ts
│
├── pages/
│   ├── EmployeeListPage.tsx
│   └── EmployeeDetailPage.tsx
│
├── services/
│   ├── employee.service.ts
│   └── employee.mock-data.ts
│
├── index.ts
└── types.ts
```

---

## Screenshots

Screenshots of the application are available in:

```text
project-screenshots/
```

Recommended screenshots:

* Login Page
* Dashboard
* Employee Management
* Employee Details
* Add Employee
* Manager View
* Employee View

---

## Current Project Status

### Completed

* Authentication Module
* Dashboard Module
* Employee Management Module

### In Progress

* Attendance Management Module

### Planned

* Leave Management
* Payroll Management
* Performance Management
* Recruitment Management
* Reports & Analytics

---

## Build Validation

The project has been successfully tested with:

```bash
npm run build
```

and produces a successful production build.

---

## License

Private Project

NexusHR © 2026

Developed as a modular Human Resources Management System using React, TypeScript, and Vite.
