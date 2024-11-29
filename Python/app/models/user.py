from pydantic import BaseModel, EmailStr, constr, Field
from bson import ObjectId


class UserRegistration(BaseModel):
    fullname: constr(min_length=3, max_length=30) = Field(..., pattern="^[a-zA-Z ]+$")   #type:ignore
    username: constr(min_length=3, max_length=30) = Field(..., pattern="^[a-zA-Z0-9_]+$")   #type:ignore
    password: constr(min_length=8)  # Just length validation #type:ignore
    phone: constr(pattern=r"^[0-9]{10}$")  # Updated to use pattern #type:ignore
    email: EmailStr  # Email validation

class UserResponse(BaseModel):
    fullname: str
    username: str
    phone: str
    email: str


class UserLogin(BaseModel):
    user: str  # This can be either username or email
    password: str


class UserFiles(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")  # MongoDB ID
    filename: str
    content_type: str
    content: bytes  # This will store the file content in binary
    username: str

    class Config:
        # This will allow us to use the Pydantic model to interact with MongoDB documents.
        allow_population_by_field_name = True
        arbitrary_types_allowed = True  # To allow bytes

# # Example usage
# user = UserRegistration(
#     username="valid_username",
#     password="securePassword123",
#     phone="1234567890",
#     email="example@example.com"
# )

# if __name__ == '__main__':
#     # print(user)

# print(user)
