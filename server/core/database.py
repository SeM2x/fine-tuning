from pymongo import MongoClient
from decouple import config
from datetime import datetime
import uuid

_client = MongoClient(config('MONGO_URI', default='mongodb://localhost:27017/'))

def connect_to_mongo():
    _client.admin.command("ping")
    return _client

def connect_to_db():
    client = connect_to_mongo()
    db_name = config('MONGODB_NAME', default='ai_conversations')
    return client[db_name]


# === Convenience Helpers ===

db = connect_to_db()
users_col = db["users"]
convs_col = db["conversations"]


def get_or_create_user(user_id):
    users_col.update_one(
        {"_id": user_id},
        {"$setOnInsert": {"created_at": datetime.utcnow()}},
        upsert=True
    )
    return user_id


def create_conversation(user_id):
    conv_id = str(uuid.uuid4())
    convs_col.insert_one({
        "_id": conv_id,
        "user_id": user_id,
        "messages": [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    return conv_id


def get_conversation(user_id, conv_id):
    return convs_col.find_one({"_id": conv_id, "user_id": user_id})


def add_message(conv_id, role, content):
    convs_col.update_one(
        {"_id": conv_id},
        {
            "$push": {"messages": {"role": role, "content": content}},
            "$set": {"updated_at": datetime.utcnow()}
        }
    )

def get_messages_for_context(conv_id, limit=20):
    conv = convs_col.find_one({"_id": conv_id}, {"messages": 1})
    msgs = conv.get("messages", [])
    return msgs[-limit:]

def get_conversations_by_user(user_id: str):
    return list(db.conversations.find(
        {"user_id": user_id},
        {"messages": 0}  # exclude messages if you only want metadata
    ))