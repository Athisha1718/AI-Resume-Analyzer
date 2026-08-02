from fastapi import FastAPI, UploadFile, File, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import users_collection, resumes_collection
from auth import create_access_token, verify_token
import fitz
import os
import bcrypt
from datetime import datetime

app = FastAPI()

# -----------------------------
# CORS
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Upload Folder
# -----------------------------
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# -----------------------------
# Skills List
# -----------------------------
SKILLS = [
    "Python", "Java", "C", "C++", "JavaScript",
    "React", "FastAPI", "Flask", "HTML", "CSS",
    "Tailwind", "Docker", "Kubernetes", "Git",
    "GitHub", "AWS", "Azure", "Linux",
    "MySQL", "PostgreSQL", "MongoDB",
    "Machine Learning", "TensorFlow", "PyTorch"
]

# -----------------------------
# Models
# -----------------------------
class RegisterData(BaseModel):
    name: str
    email: str
    password: str


class LoginData(BaseModel):
    email: str
    password: str


class DeleteResume(BaseModel):
    filename: str


# -----------------------------
# Home
# -----------------------------
@app.get("/")
def home():
    return {"message": "Welcome to AI Resume Analyzer"}


# -----------------------------
# Register
# -----------------------------
@app.post("/register")
def register(data: RegisterData):

    existing_user = users_collection.find_one({
        "email": data.email
    })

    if existing_user:
        return {
            "success": False,
            "message": "Email already exists"
        }

    hashed_password = bcrypt.hashpw(
        data.password.encode("utf-8"),
        bcrypt.gensalt()
    )

    users_collection.insert_one({
        "name": data.name,
        "email": data.email,
        "password": hashed_password.decode("utf-8")
    })

    return {
        "success": True,
        "message": "Registration Successful"
    }


# -----------------------------
# Login (JWT)
# -----------------------------
@app.post("/login")
def login(data: LoginData):

    user = users_collection.find_one({
        "email": data.email
    })

    if not user:
        return {
            "success": False,
            "message": "User not found"
        }

    if bcrypt.checkpw(
        data.password.encode("utf-8"),
        user["password"].encode("utf-8")
    ):

        token = create_access_token({
            "email": user["email"],
            "name": user["name"]
        })

        return {
            "success": True,
            "message": "Login Successful",
            "token": token,
            "name": user["name"]
        }

    return {
        "success": False,
        "message": "Invalid Password"
    }


# -----------------------------
# Upload Resume
# -----------------------------
@app.post("/upload")
async def upload_resume(
    resume: UploadFile = File(...),
    authorization: str = Header(None)
):

    if not authorization:
        return {
            "success": False,
            "message": "Token Missing"
        }

    token = authorization.replace("Bearer ", "")

    user = verify_token(token)

    if not user:
        return {
            "success": False,
            "message": "Invalid Token"
        }

    file_path = os.path.join(
        UPLOAD_FOLDER,
        resume.filename
    )

    with open(file_path, "wb") as file:
        file.write(await resume.read())

    document = fitz.open(file_path)

    text = ""

    for page in document:
        text += page.get_text()

    document.close()

    found_skills = []

    resume_text = text.lower()

    for skill in SKILLS:
        if skill.lower() in resume_text:
            found_skills.append(skill)

    ats_score = int(
        (len(found_skills) / len(SKILLS)) * 100
    )

    resumes_collection.insert_one({
        "email": user["email"],
        "filename": resume.filename,
        "skills": found_skills,
        "ats_score": ats_score,
        "upload_time": datetime.now().strftime(
            "%d-%m-%Y %H:%M"
        )
    })

    return {
        "success": True,
        "message": "Resume Uploaded Successfully",
        "filename": resume.filename,
        "text": text,
        "skills": found_skills,
        "ats_score": ats_score
    }


# -----------------------------
# Resume History
# -----------------------------
@app.get("/history")
def resume_history(authorization: str = Header(None)):

    if not authorization:
        return []

    token = authorization.replace("Bearer ", "")

    user = verify_token(token)

    if not user:
        return []

    resumes = resumes_collection.find(
        {"email": user["email"]},
        {"_id": 0}
    )

    return list(resumes)


# -----------------------------
# Delete Resume
# -----------------------------
@app.post("/delete_resume")
def delete_resume(
    data: DeleteResume,
    authorization: str = Header(None)
):

    if not authorization:
        return {
            "success": False
        }

    token = authorization.replace("Bearer ", "")

    user = verify_token(token)

    if not user:
        return {
            "success": False
        }

    resumes_collection.delete_one({
        "email": user["email"],
        "filename": data.filename
    })

    return {
        "success": True,
        "message": "Resume Deleted"
    }