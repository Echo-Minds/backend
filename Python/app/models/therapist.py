from pydantic import BaseModel, EmailStr, Field
from typing import Optional
import motor.motor_asyncio
from bson import ObjectId
import base64
import hashlib
from datetime import datetime

# MongoDB Connection
client = motor.motor_asyncio.AsyncIOMotorClient("your_mongodb_connection_string")
db = client["therapist_db"]
therapist_collection = db["therapists"]


# Utility for hashing passwords
def hash_password(password: str) -> str:
    salt = "static_salt"  # You can use a random salt for each user
    return hashlib.sha256((password + salt).encode()).hexdigest()


# Pydantic Model for Therapist Registration
class TherapistModel(BaseModel):
    fullname: str = Field(..., regex="^[A-Za-z\s]+$", min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    phone: str = Field(..., regex="^\d{10}$")
    course: str
    department: str
    image_base64: Optional[str] = None  # Base64 encoded image


# MongoDB Document Model
class MongoDBTherapist(BaseModel):
    id: Optional[str]
    fullname: str
    email: EmailStr
    password: str
    phone: str
    course: str
    department: str
    image_base64: Optional[str] = None
    created_at: datetime


async def register_therapist(therapist_data: TherapistModel):
    """Inserts a new therapist into the database after validation and password hashing."""
    existing_therapist = await therapist_collection.find_one({"email": therapist_data.email})
    if existing_therapist:
        return {"error": "Email already registered"}

    hashed_password = hash_password(therapist_data.password)
    therapist_dict = therapist_data.dict()
    therapist_dict["password"] = hashed_password
    therapist_dict["created_at"] = datetime.utcnow()

    result = await therapist_collection.insert_one(therapist_dict)
    therapist_dict["id"] = str(result.inserted_id)
    return {"message": "Therapist registered successfully", "id": therapist_dict["id"]}
