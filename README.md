# Student Internship Tracking System

A full-stack **MERN application** for managing and monitoring the complete student internship lifecycle across **Students, Companies, and the Placement Cell**.

The platform centralizes internship discovery, applications, company and internship approvals, interviews, task management, weekly reporting, document verification, evaluations, notifications, and placement monitoring within a role-based system.

---

## Overview

Managing internships manually can involve scattered records, repeated communication, and limited visibility into student progress.

The **Student Internship Tracking System** provides a centralized platform where:

* **Students** discover internships, apply, track applications, and manage internship activities.
* **Companies** publish internship opportunities, review applicants, conduct the selection process, and manage interns.
* **Placement Cell** verifies companies and internships while monitoring the overall internship lifecycle.

---

## Core Workflow

```text
Company Registration
        │
        ▼
Placement Cell Verification
        │
        ▼
Company Creates Internship
        │
        ▼
Placement Cell Reviews & Approves
        │
        ▼
Internship Published
        │
        ▼
Student Applies
        │
        ▼
Company Reviews Application
        │
        ▼
Shortlisting & Interview
        │
        ▼
Student Selection
        │
        ▼
Internship Begins
        │
        ├── Task Management
        ├── Weekly Reports
        ├── Document Management
        └── Progress Tracking
        │
        ▼
Company Evaluation
        │
        ▼
Internship Completion
```

The **Placement Cell** can monitor and manage the process throughout the internship lifecycle.

---

## User Roles

### Student

Students can:

* Register and securely log in
* Create and update their profile
* Maintain academic information
* Add skills, projects, and certifications
* Manage resume information
* Browse published internships
* Check internship eligibility
* Apply for internships
* Track application status
* View interview information
* View assigned tasks
* Update task progress
* Submit weekly reports
* Upload internship documents
* Track internship progress
* View evaluations
* Receive notifications

### Company

Companies can:

* Register and securely log in
* Create and manage a company profile
* Submit the company for Placement Cell verification
* Create internship opportunities
* Submit internships for approval
* Manage internship listings
* View applicants
* Review applications
* Shortlist or reject applicants
* Schedule interviews
* Select students
* Assign internship tasks
* Monitor student progress
* Review internship activities
* Evaluate students
* Receive notifications

### Placement Cell

The Placement Cell can:

* Access a dedicated administrative dashboard
* View registered students
* Review registered companies
* Approve or reject companies
* Review internship opportunities
* Approve or reject internships
* Publish approved internships
* Monitor applications
* Verify internship-related documents
* Monitor ongoing internships
* View reports and analytics
* Review audit logs
* Receive system notifications

---

## Application Lifecycle

### Internship Lifecycle

```text
Draft
  ↓
Pending Approval
  ↓
Approved
  ↓
Published
  ↓
Application Closed
  ↓
Ongoing
  ↓
Completed
  ↓
Archived
```

### Application Lifecycle

```text
Applied
   ↓
Under Review
   ↓
Shortlisted
   ↓
Interview Scheduled
   ↓
Selected
```

An application can also be **rejected** during the review and selection process.

---

## Technology Stack

| Layer             | Technologies                 |
| ----------------- | ---------------------------- |
| Frontend          | React.js, Vite, Tailwind CSS |
| Routing           | React Router                 |
| API Communication | Axios                        |
| Backend           | Node.js, Express.js          |
| Database          | MongoDB Atlas                |
| ODM               | Mongoose                     |
| Authentication    | JWT                          |
| Password Security | bcrypt                       |
| Authorization     | Role-Based Access Control    |
| Validation        | Express Validator            |
| File Handling     | Multer                       |
| Development       | Git, GitHub, npm, Nodemon    |

---

## Architecture

```text
┌─────────────────────────────────────────────┐
│               React + Vite                  │
│                                             │
│  Student     Company      Placement Cell    │
└─────────────────────┬───────────────────────┘
                      │
                      │ REST API / JWT
                      ▼
┌─────────────────────────────────────────────┐
│             Node.js + Express               │
│                                             │
│ Authentication • Authorization • APIs       │
│ Validation • Business Logic • File Handling │
└─────────────────────┬───────────────────────┘
                      │
                      │ Mongoose
                      ▼
┌─────────────────────────────────────────────┐
│                MongoDB Atlas                │
│                                             │
│ Users • Students • Companies • Internships  │
│ Applications • Tasks • Reports • Documents  │
│ Evaluations • Notifications • Audit Logs    │
└─────────────────────────────────────────────┘
```

---

## Database Collections

The system uses collections including:

```text
users
students
companies
internships
applications
documents
tasks
weeklyReports
internshipProgress
evaluations
notifications
auditLogs
```

---

## Project Structure

```text
InternshipTracker/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── uploads/
│   │   └── .gitkeep
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── student/
│   │   │   ├── company/
│   │   │   └── placement/
│   │   ├── routes/
│   │   ├── services/
│   │   └── ...
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure the following are installed/configured:

* Node.js
* npm
* Git
* MongoDB Atlas account

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/LearnerOp02/InternshipTracker.git
```

```bash
cd InternshipTracker
```

---

### 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=8000
MONGO_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
JWT_SECRET=YOUR_JWT_SECRET
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Start the development server:

```bash
npm run dev
```

The backend will normally run on:

```text
http://localhost:8000
```

---

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:8000/api
```

Start the frontend:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

## API Modules

The backend is organized into REST API modules such as:

```text
/api/auth
/api/students
/api/companies
/api/internships
/api/applications
/api/documents
/api/tasks
/api/weekly-reports
/api/progress
/api/evaluations
/api/notifications
/api/dashboard
/api/reports
/api/audit-logs
/api/placement
```

---

## Authentication & Authorization

The application uses **JWT-based authentication**.

After successful authentication, users access functionality according to their assigned role:

```text
                  Login
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
     Student      Company   Placement Cell
        │           │           │
        ▼           ▼           ▼
     Student      Company     Placement
    Dashboard    Dashboard    Dashboard
```

Protected API endpoints use authentication and role-based authorization middleware to restrict access.

Public registration is intended for:

* Student
* Company

Placement Cell accounts are not intended for unrestricted public registration.

---

## Company Verification

New companies enter the system with a verification status of:

```text
Pending
```

The Placement Cell can then review the company and change its status to:

```text
Pending → Approved
```

or:

```text
Pending → Rejected
```

This prevents unverified companies from freely participating in the internship workflow.

---

## Eligibility Checking

Before applying, student information can be evaluated against internship eligibility requirements.

Eligibility can consider information such as:

* Department/branch
* Academic year
* CGPA
* Backlogs
* Required skills

This helps prevent invalid applications and provides students with eligibility information before applying.

---

## Task & Progress Management

After selection, companies can assign tasks to students.

Students can:

* View assigned tasks
* Track task status
* Record internship activities
* Submit weekly reports

Companies and the Placement Cell can use this information to monitor internship progress.

---

## Notification System

The application provides notifications for important activities such as:

* New internship applications
* Application status changes
* Interview scheduling
* Student selection
* Task assignment
* Weekly reports
* Document-related updates
* Internship-related activities
* System events

Users can view notifications and mark them as read.

---

## Audit Logging

Important system operations can be recorded through audit logs.

This provides better traceability for administrative and internship-management activities.

---

## Security

The project includes several security practices:

* Password hashing using bcrypt
* JWT authentication
* Protected backend routes
* Role-based authorization
* Server-side validation
* Environment-based configuration
* Restricted administrative functionality
* User-specific resource access

> **Security Notice:** Never commit `.env` files, MongoDB credentials, JWT secrets, user documents, passwords, or other sensitive information to the repository.

---

## Deployment Architecture

The project can be deployed using:

```text
              Users
                │
                ▼
       ┌─────────────────┐
       │     Vercel      │
       │  React Frontend │
       └────────┬────────┘
                │
                │ HTTPS
                ▼
       ┌─────────────────┐
       │     Render      │
       │ Express Backend │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │  MongoDB Atlas  │
       │    Database     │
       └─────────────────┘
```

For production use, persistent cloud storage should be considered for resumes and other uploaded documents rather than relying on temporary server storage.

---

## Future Enhancements

Potential improvements include:

* Email notifications
* Persistent cloud document storage
* Advanced placement analytics
* Graphical reporting dashboards
* Internship recommendation system
* Automated reminders
* Certificate generation
* Report export functionality
* Improved search and filtering
* Enhanced mobile responsiveness

---

## Project Purpose

This project was developed to demonstrate the implementation of a complete internship management workflow using modern full-stack web technologies.

It focuses on connecting the three major participants in the internship process:

```text
Students ↔ Companies ↔ Placement Cell
```

The objective is to provide a centralized and structured system for internship discovery, approval, selection, monitoring, reporting, and evaluation.

---

## Developer

**Vedant Patil**
Computer Engineering Student

GitHub: [@LearnerOp02](https://github.com/LearnerOp02)

---

## Repository

**InternshipTracker**

https://github.com/LearnerOp02/InternshipTracker

---

## Copyright

Copyright © 2026 Vedant Patil.

This project and its original source code are provided for educational and academic purposes. Third-party libraries, frameworks, and dependencies remain subject to their respective licenses.
