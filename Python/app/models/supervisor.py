from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from bson import ObjectId
import pymongo
from pymongo import MongoClient

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["supervisor_db"]
supervisors_collection = db["supervisors"]

# Pydantic model for Supervisor Registration (without image for now)
class Supervisor(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    fullname: str = Field(..., min_length=3, max_length=50, regex="^[A-Za-z\s]+$")
    email: EmailStr
    password: str = Field(..., min_length=6)
    phone: str = Field(..., regex="^\d{10}$")
    specialization: str
    image_filename: Optional[str]  # Image file name will be stored in the database

    class Config:
        orm_mode = True
        allow_population_by_field_name = True

# Function to add a supervisor to the database
def add_supervisor_to_db(supervisor_data, image_filename):
    try:
        # Check if email already exists
        existing_supervisor = supervisors_collection.find_one({"email": supervisor_data.email})
        if existing_supervisor:
            return {"status": "error", "message": "Email already registered"}

        # Insert new supervisor
        supervisor_data_dict = supervisor_data.dict(by_alias=True)
        supervisor_data_dict["image_filename"] = image_filename
        supervisors_collection.insert_one(supervisor_data_dict)
        return {"status": "success", "message": "Supervisor registered successfully"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
