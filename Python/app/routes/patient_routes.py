#import gridfs
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from pymongo import MongoClient
import jwt
import datetime
from passlib.context import CryptContext
from fastapi.responses import JSONResponse
from typing import Optional

# MongoDB Atlas connection
client = MongoClient("mongodb+srv://bhuvaneshg:deepakbhuvi@cluster0.e2m47pj.mongodb.net")
db = client['SIH']

router = APIRouter()

# JWT Configuration
SECRET_KEY = "EchoMinds"  # Replace with a secure key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Token expires in 30 minutes
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Password hashing setup with bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Patient Register Model
class PatientRegister(BaseModel):
    name: str
    email: str
    phone: str
    age: int
    gender: str
    goals: str
    password: str  # Password field for registration

# Patient Login Model
class PatientLogin(BaseModel):
    email: str
    password: str

# Token Model
class Token(BaseModel):
    access_token: str
    token_type: str

# Patient data model excluding sensitive data like password
class Patient(BaseModel):
    name: str
    email: str
    phone: str
    gender: str
    age: int
    goals: str

# Function to hash password
def hash_password(password: str):
    return pwd_context.hash(password)

# Function to verify password
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# Function to create JWT token
def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Register route
@router.post("/register")
async def register_patient(
    patient_data: PatientRegister,
    # image: UploadFile = File(...),  # Image file upload
):
    print(patient_data)
    try:
        # Hash password before storing it
        hashed_password = hash_password(patient_data.password)
        
        # Read image file
        # image_data = await image.read()

        # Save the image file to MongoDB GridFS
        # file_id = fs.put(image_data, filename=image.filename)

        # Store patient information along with hashed password and image file ID
        new_patient = {
            "name": patient_data.name,
            "email": patient_data.email,
            "phone": patient_data.phone,
            "age": patient_data.age,
            "gender": patient_data.gender,
            "goals": patient_data.goals,
            "password": hashed_password,  # Store hashed password
            # "image_id": file_id,  # Store the GridFS file ID
        }

        # Save patient data to MongoDB
        db.patients.insert_one(new_patient)

        return JSONResponse(
            content={"message": "Patient registered successfully!"},
            status_code=200,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading image: {str(e)}")

# Login route to get the JWT token
@router.post("/login", response_model=Token)
async def login_patient(patient_data: PatientLogin):
    # Verify if the patient exists and the password is correct
    patient = db.patients.find_one({"email": patient_data.email})
    if not patient or not verify_password(patient_data.password, patient["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create the JWT token
    access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": patient["email"]}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer","_id":str(patient["_id"])}

# Get patient info route - Requires JWT token
@router.get("/patient/{patient_id}")
async def get_patient_info(patient_id: str, token: str = Depends(oauth2_scheme)):
    try:
        # Decode the token to verify the user
        #payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        patient_email: str = payload.get("sub")
        if patient_email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Retrieve patient data from MongoDB
        patient = db.patients.find_one({"email": patient_email, "_id": patient_id})
        
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")

        # Retrieve image from GridFS using file_id
        #image_file = fs.get(patient["image_id"])
        #image_data = image_file.read()

        return {
            "id": str(patient["_id"]),
            "name": patient["name"],
            "email": patient["email"],
            "phone": patient["phone"],
            "age": patient["age"],
            "gender": patient["gender"],
            "goals": patient["goals"],
            # "image_data": image_data,  # Return the image as binary data
        }

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

