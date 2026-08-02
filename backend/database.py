from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017")

# Database
db = client["ai_resume_analyzer"]

# Collections
users_collection = db["users"]

resumes_collection = db["resumes"]