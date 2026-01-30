from pymongo import MongoClient
from pymongo.database import Database
from app.config import MONGODB_URL, DATABASE_NAME

client = None
db = None


def get_database() -> Database:
    global db, client
    if db is None:
        client = MongoClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
        db = client[DATABASE_NAME]
    return db


def close_database():
    global client
    if client:
        client.close()
        client = None
