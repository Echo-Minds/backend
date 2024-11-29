from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from dotenv import load_dotenv
import asyncio
import os

load_dotenv()

MONGO_DETAILS = os.getenv("DATABASE_URL")

client = AsyncIOMotorClient(MONGO_DETAILS)

database = client['RemembranceAI']  
users_collection = database['users']  
user_files_collection = database['files']


async def test_connection():
    try:
        user_data = {
            "email": "testuser@example.com",
            "name": "Test User",
        }
        result = await users_collection.insert_one(user_data)
        print(f"Test user inserted with id: {result.inserted_id}")
        
        user = await users_collection.find_one({"_id": result.inserted_id})
        print("Retrieved user:", user)
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        client.close()


if __name__ == '__main__':
    asyncio.run(test_connection())