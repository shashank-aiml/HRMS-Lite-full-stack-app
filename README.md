# HRMS Lite

A web-based HRMS Lite application for managing employee records and daily attendance. Built with **FastAPI** (backend), **React** (frontend), and **MongoDB**.

## Features

- **Employee Management**: Add employees (Employee ID, Full Name, Email, Department), view list, delete employees
- **Attendance Management**: Mark attendance (Date, Present/Absent), view records with optional filter by employee
- RESTful APIs with validation (required fields, email format, duplicate handling)
- Professional UI with loading, empty, and error states

## Prerequisites

- **Python 3.10+**
- **Node.js 18+** and npm
- **MongoDB** (local or Atlas connection string)

## Setup

### 1. MongoDB

Ensure MongoDB is running locally, or set `MONGODB_URL` to your connection string (e.g. MongoDB Atlas).

### 2. Backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/` (optional):

```
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=hrms_lite
```

Run the API:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://localhost:8000/docs

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Project Structure

```
quesscorp_assessment_hrms/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app, CORS, routes
│   │   ├── config.py        # Settings
│   │   ├── database.py      # MongoDB connection
│   │   ├── models.py        # Pydantic models
│   │   └── routers/
│   │       ├── employees.py # Employee CRUD
│   │       └── attendance.py# Attendance APIs
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api.js           # API client
│   │   ├── App.jsx
│   │   ├── components/      # Layout, forms, tables, states
│   │   └── pages/           # Employees, Attendance
│   ├── index.html
│   └── package.json
└── README.md
```

## API Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | List all employees |
| POST | `/api/employees` | Add employee (body: employee_id, full_name, email, department) |
| DELETE | `/api/employees/{employee_id}` | Delete employee |
| GET | `/api/attendance?employee_id=` | List attendance (optional filter) |
| POST | `/api/attendance` | Mark attendance (body: employee_id, date, status) |

Validation: required fields, valid email, unique employee_id, employee must exist for attendance. Errors return appropriate HTTP status codes and messages.
