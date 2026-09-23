# 🎓 Student Internship Tracking System

A full-stack **MERN-based Student Internship Tracking System** designed to manage the complete internship lifecycle between **Students, Companies, and the Placement Cell**.

The system allows students to discover and apply for internships, companies to publish opportunities and manage applicants, and the placement cell to approve, monitor, and manage the overall internship process.

---

## 🚀 Features

### 👨‍🎓 Student Module

- Student registration and login
- Student profile management
- Academic information management
- Skills, projects, and certifications
- Resume management
- Browse published internships
- Apply for internships
- Eligibility checking
- Track application status
- View scheduled interviews
- View assigned tasks
- Update task progress
- Submit weekly internship reports
- Track internship progress
- Upload internship-related documents
- View evaluations
- Receive notifications
- Student dashboard

### 🏢 Company Module

- Company registration and login
- Company profile management
- Placement Cell verification
- Create internship opportunities
- Submit internships for approval
- Publish approved internships
- View internship applicants
- Review applications
- Shortlist or reject students
- Schedule interviews
- Select students
- Assign internship tasks
- Monitor student progress
- Review weekly reports
- Evaluate interns
- Receive notifications
- Company dashboard

### 🧑‍💼 Placement Cell Module

- Secure Placement Cell login
- Placement dashboard
- View registered students
- Manage registered companies
- Approve or reject companies
- Review internship opportunities
- Approve or reject internships
- Publish approved internships
- Monitor student applications
- Monitor active internships
- Verify student documents
- View internship progress
- Reports and analytics
- Audit logs
- Notifications

---

## 🔄 System Workflow

```text
Company Registration
        ↓
Placement Cell Approval
        ↓
Company Creates Internship
        ↓
Placement Cell Reviews Internship
        ↓
Internship Published
        ↓
Student Browses Internship
        ↓
Student Applies
        ↓
Company Reviews Application
        ↓
Shortlisting / Interview
        ↓
Student Selected
        ↓
Company Assigns Tasks
        ↓
Student Submits Weekly Reports
        ↓
Internship Progress Tracking
        ↓
Company Evaluation
        ↓
Internship Completion
```

The **Placement Cell monitors and manages the overall process** throughout the internship lifecycle.

---

## 🛠️ Technology Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend

- Node.js
- Express.js
- REST API
- JWT Authentication
- Role-Based Access Control

### Database

- MongoDB
- MongoDB Atlas
- Mongoose

### Development Tools

- Git
- GitHub
- npm
- Nodemon
- VS Code

---

## 👥 User Roles

The system contains three main roles:

| Role | Purpose |
|---|---|
| **Student** | Search and apply for internships and manage internship activities |
| **Company** | Publish internships and manage applicants/interns |
| **Placement Cell** | Approve, monitor, and manage the internship ecosystem |

---

## 🔐 Authentication & Authorization

The application uses **JWT (JSON Web Token)** authentication.

After login, users are redirected according to their role:

```text
Login
  │
  ├── Student ────────→ Student Dashboard
  │
  ├── Company ────────→ Company Dashboard
  │
  └── Placement Cell ─→ Placement Dashboard
```

Protected backend APIs use authentication and role-based authorization middleware.

---

## 📂 Project Structure

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
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/LearnerOp02/InternshipTracker.git
```

Enter the project:

```bash
cd InternshipTracker
```

---

## 🔧 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=8000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:8000
```

---

## 🎨 Frontend Setup

Open another terminal and navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file if required:

```env
VITE_API_URL=http://localhost:8000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

## 🌐 API Structure

Major API groups include:

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

## 📊 Internship Application Lifecycle

An application can move through stages such as:

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

An application may also be:

```text
Rejected
```

---

## 📝 Internship Management

The system supports internship states including:

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
```

---

## 🔔 Notification System

Notifications are generated for important system activities such as:

- Application updates
- Interview scheduling
- Student selection
- Document updates
- Task assignments
- Internship updates
- Reports
- System activities

Users can view their notifications and mark individual or all notifications as read.

---

## 📈 Monitoring & Reports

The system provides dashboards and statistics for monitoring:

- Students
- Companies
- Internships
- Applications
- Selected students
- Tasks
- Weekly reports
- Documents
- Internship progress
- Evaluations
- Notifications

The Placement Cell can use these features to monitor internship activities across the system.

---

## 🛡️ Security

The application includes:

- Password hashing
- JWT authentication
- Protected API routes
- Role-based authorization
- Environment variables for sensitive credentials
- Server-side validation
- Restricted access based on user roles

> **Important:** Never commit `.env` files, MongoDB credentials, JWT secrets, or other sensitive information to GitHub.

---

## ☁️ Deployment

The project can be deployed using:

```text
Frontend  → Vercel
Backend   → Render
Database  → MongoDB Atlas
```

For production use, uploaded documents and resumes should be stored using persistent cloud storage rather than temporary server storage.

---

## 🎯 Project Objective

The main objective of the Student Internship Tracking System is to provide a centralized platform for managing the complete internship process while improving communication and coordination between:

**Students ↔ Companies ↔ Placement Cell**

The system reduces manual tracking and provides better visibility into internship applications, selections, tasks, progress, reports, documents, and evaluations.

---

## 🔮 Future Enhancements

Possible future improvements include:

- Email notifications
- Cloud-based document storage
- Advanced analytics and charts
- Automated internship recommendations
- Certificate generation
- Exportable reports
- Interview reminders
- Mobile-responsive enhancements
- Production deployment and monitoring

---

## 👨‍💻 Developer

**Vedant Patil**

Computer Engineering Student

GitHub: **LearnerOp02**

---

## 📄 License

This project is developed for educational and academic purposes.

Copyright © 2026 Vedant Patil. All rights reserved.
