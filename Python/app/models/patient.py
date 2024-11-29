from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from fastapi import UploadFile
from passlib.context import CryptContext
from io import BytesIO
import gridfs
from pymongo import MongoClient

# MongoDB connection and GridFS setup
client = MongoClient("your-mongo-atlas-connection-string")
db = client['your-database-name']
fs = gridfs.GridFS(db)

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Patient Registration Model
class PatientRegistrationModel(BaseModel):
    fullname: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    phone: str = Field(..., regex=r'^\d{10}$')
    gender: str = Field(..., regex=r'^(Male|Female|Other)$')
    age: int = Field(..., gt=0, le=120)
    goal: Optional[str] = Field(None, max_length=500)
    image: Optional[UploadFile] = None

    # Validators for full name and gender
    @validator("fullname")
    def validate_fullname(cls, value):
        if not value.replace(" ", "").isalpha():
            raise ValueError("Full name can only contain letters and spaces")
        return value

    @validator("gender")
    def validate_gender(cls, value):
        if value not in ["Male", "Female", "Other"]:
            raise ValueError("Gender must be one of: Male, Female, Other")
        return value

    # Hash password before saving
    def hash_password(self):
        return pwd_context.hash(self.password)

    # Save image to GridFS and return file_id
    async def save_image(self, image: UploadFile):
        file_data = await image.read()
        file_id = fs.put(file_data, filename=image.filename)
        return file_id


# Example usage for data validation and saving to the database
async def register_patient(data: dict, file: Optional[UploadFile]):
    try:
        # Validate the data and create PatientRegistrationModel instance
        patient_data = PatientRegistrationModel(**data, image=file)

        # Hash password
        hashed_password = patient_data.hash_password()

        # Save image to GridFS and get the file ID
        image_file_id = await patient_data.save_image(file) if file else None

        # Store patient information in MongoDB
        patient_record = {
            "fullname": patient_data.fullname,
            "email": patient_data.email,
            "phone": patient_data.phone,
            "gender": patient_data.gender,
            "age": patient_data.age,
            "goal": patient_data.goal,
            "password": hashed_password,
            "image_id": image_file_id,  # Image file ID stored in GridFS
        }

        # Insert into MongoDB
        db.patients.insert_one(patient_record)
        print("Patient registered successfully!")

        return {"message": "Patient registered successfully!"}
    except Exception as e:
        print(f"Error during patient registration: {e}")
        return {"error": "Patient registration failed!"}
