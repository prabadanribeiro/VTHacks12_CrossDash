from pymongo import MongoClient
import pandas as pd
from pymongo.server_api import ServerApi

password = 'yJsKf4xToMs2TM5H'
uri = f"mongodb+srv://admin:askjfhql23ku4hkjwaerasdf@virginia-tech.kmkg2.mongodb.net/?retryWrites=true&w=majority&appName=Virginia-Tech"
client = MongoClient(uri, server_api=ServerApi('1'))

db = client["HeatMap"]
collection = db["collection"]

def post(data,db=client["HeatMap"], collection = db["collection"]):
    collection.insert_one(data)
