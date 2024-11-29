from fastapi import FastAPI
from routes import patient_routes
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']

)

# Include the user registration routes
# app.include_router(user_routes.router)
app.include_router(patient_routes.router)
