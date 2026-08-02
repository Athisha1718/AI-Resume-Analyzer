# 🚀 AI Resume Analyzer

A full-stack AI Resume Analyzer built using **React**, **FastAPI**, and **MongoDB**. The application allows users to securely register, log in, upload PDF resumes, extract text and technical skills, calculate a keyword-based ATS score, and manage resume history.

---

## 📌 Features

### 🔐 Authentication
- User Registration
- User Login
- JWT Authentication
- Password Hashing using bcrypt
- Secure Logout

### 📄 Resume Analysis
- Upload PDF Resume
- Extract Resume Text
- Detect Technical Skills
- Calculate ATS Score
- Display Resume Content

### 🗂 Resume History
- Store uploaded resumes
- View previous uploads
- Delete uploaded resumes
- Upload timestamp

### 🗄 Database
- MongoDB Integration
- Store Users
- Store Resume History

---

# 🛠 Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- React Router DOM

## Backend
- FastAPI
- Python
- PyMuPDF (fitz)
- bcrypt
- python-jose (JWT)
- PyMongo

## Database
- MongoDB

---

# 📂 Project Structure

```
AI-Resume-Analyzer
│
├── backend
│   ├── auth.py
│   ├── database.py
│   ├── main.py
│   ├── uploads
│   └── requirements.txt
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# ⚙ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Athisha1718/AI-Resume-Analyzer.git
```

---

## 2️⃣ Move into Project

```bash
cd AI-Resume-Analyzer
```

---

# Backend Setup

## Install Dependencies

```bash
cd backend

pip install fastapi
pip install uvicorn
pip install pymongo
pip install bcrypt
pip install python-jose
pip install pymupdf
pip install python-multipart
```

Start Backend

```bash
uvicorn main:app --reload
```

Backend runs at

```
http://127.0.0.1:8000
```

---

# Frontend Setup

Open another terminal

```bash
cd frontend

npm install
```

Start Frontend

```bash
npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

# MongoDB Setup

1. Install MongoDB Community Server
2. Install MongoDB Compass
3. Start MongoDB Service
4. Create Database

```
AI_Resume_Analyzer
```

Collections

```
users
resumes
```

---

# API Endpoints

## Home

```
GET /
```

Returns

```json
{
    "message":"Welcome to AI Resume Analyzer"
}
```

---

## Register

```
POST /register
```

Body

```json
{
    "name":"John",
    "email":"john@gmail.com",
    "password":"123456"
}
```

---

## Login

```
POST /login
```

Returns JWT Token

---

## Upload Resume

```
POST /upload
```

Headers

```
Authorization: Bearer JWT_TOKEN
```

Upload

```
PDF Resume
```

Returns

- Resume Text
- ATS Score
- Skills

---

## Resume History

```
GET /history
```

---

## Delete Resume

```
POST /delete_resume
```

---

# 🔒 Security

- Password Hashing (bcrypt)
- JWT Authentication
- Protected APIs
- MongoDB Storage
- CORS Enabled

---

# 📊 Current ATS Score Logic

The ATS score is calculated using keyword matching.

Formula:

```
ATS Score =
(Number of Skills Found /
Total Skills List)
×100
```

Example

```
Skills Found = 9

Total Skills = 24

ATS Score = 37%
```

---

# 🚀 Future Enhancements

- AI-based ATS Scoring
- Job Description Matching
- AI Resume Suggestions
- Grammar Checking
- Resume Comparison
- Download PDF Report
- Interview Readiness Score
- Resume Templates
- ---
