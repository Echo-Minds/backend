from fastapi import APIRouter, HTTPException, Depends,UploadFile, File, Form 
from passlib.context import CryptContext
from app.models.user import UserRegistration,UserLogin,UserResponse,UserFiles
from app.database import users_collection,user_files_collection
from bson import ObjectId

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# APIRouter creates path operations for the user module
router = APIRouter()

# Hash the password before storing it in the database
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

@router.post("/register")
async def register_user(user: UserRegistration):
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered")
    
    hashed_password = hash_password(user.password)
    
    user_data = {
        "fullname": user.fullname,
        "username": user.username,
        "hashed_password": hashed_password,
        "phone": user.phone,
        "email": user.email,
    }
    result = await users_collection.insert_one(user_data)
    
    return {"msg": "User registered successfully", "user_id": str(result.inserted_id)}

@router.get("/user/{identifier}", response_model=UserResponse)
async def get_user(identifier: str):
    # Try to find the user by email or username
    user = await users_collection.find_one({
        "$or": [
            {"email": identifier},
            {"username": identifier}
        ]
    })

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Exclude the hashed password from the response
    user_data = {
        "fullname": user["fullname"],
        "username": user["username"],
        "phone": user["phone"],
        "email": user["email"],
    }

    return user_data


@router.post("/login")
async def login_user(login_request: UserLogin):
    # First, try to find the user by email or username
    existing_user = await users_collection.find_one({
        "$or": [{"email": login_request.user}, {"username": login_request.user}]
    })
    
    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid username/email or password")
    
    # Check if the provided password matches the stored hashed password
    if not verify_password(login_request.password, existing_user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Invalid username/email or password")
    
    # If login is successful, you can return user details or a token (JWT)
    return {"msg": "Login successful", "username": str(existing_user["username"]), "status":200}


@router.post("/upload")
async def upload_file(username: str = Form(...), file: UploadFile = File(...)):
    try:
        # Validate file type (you can adjust this according to your requirements)
        if file.content_type not in ['image/png', 'image/jpeg', 'application/pdf']:
            raise HTTPException(status_code=400, detail="Unsupported file type.")
        
        # Read the file content
        contents = await file.read()
        
        # Create an instance of UserFiles
        file_data = UserFiles(
            filename=file.filename,
            content_type=file.content_type,
            content=contents,  # Store the file content in binary
            username=username
        )

        print(file_data)

        # Insert the file data into the MongoDB collection
        result = await user_files_collection.insert_one(file_data.dict(by_alias=True))  # Use dict to convert Pydantic model to dict
        

        return {"msg": "File uploaded successfully", "file_id": str(result.inserted_id),"status":200}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")