import redis.asyncio as redis
import os
import json
import time
from datetime import datetime
from typing import Optional, Dict, Any
from dotenv import load_dotenv
from cryptography.fernet import Fernet

load_dotenv()

# Fernet encryption key (must be set in .env)
FERNET_KEY = os.getenv("FERNET_KEY")
if not FERNET_KEY:
    raise RuntimeError("FERNET_KEY not set in environment! Generate one with Fernet.generate_key() and add to .env")
fernet = Fernet(FERNET_KEY)

def encrypt_api_key(api_key: str) -> str:
    return fernet.encrypt(api_key.encode()).decode()

def decrypt_api_key(token: str) -> str:
    return fernet.decrypt(token.encode()).decode()

# Redis configuration with proper defaults and type conversion
REDIS_HOST = os.getenv("REDIS_HOST") or "localhost"
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD")
REDIS_DB = os.getenv("REDIS_DB") or "flowly"  # Always a string fallback

# Debug logging
print(f"🔧 Redis Configuration:")
print(f"   Host: {REDIS_HOST}")
print(f"   Port: {REDIS_PORT}")
print(f"   Password: {'***' if REDIS_PASSWORD else 'None'}")
print(f"   DB: {REDIS_DB}")

# Global Redis client
redis_client: Optional[redis.Redis] = None

async def get_redis_client() -> redis.Redis:
    """
    Get or create Redis client
    """
    global redis_client
    if redis_client is None:
        try:
            redis_client = redis.Redis(
                host=REDIS_HOST,
                port=REDIS_PORT,
                password=REDIS_PASSWORD,
                db=REDIS_DB,  # Redis client will handle string to int conversion
                decode_responses=True,
                encoding="utf-8"
            )
            print(f"✅ Redis client created successfully")
        except Exception as e:
            print(f"❌ Error creating Redis client: {e}")
            raise
    return redis_client

async def store_user_profile(user_id: str, user_data: Dict[str, Any], expiry: int = 86400) -> bool:
    try:
        client = await get_redis_client()
        key = f"user:{user_id}"
        value = json.dumps(user_data)
        print(f"🔄 Storing key={key}, expiry={expiry}, value={value[:100]}...")  # Trim long tokens for log
        await client.setex(name=key, time=int(expiry), value=value)
        print(f"✅ User profile stored in Redis: {user_id}")
        return True
    except Exception as e:
        print(f"❌ Error storing user profile in Redis: {e}")
        return False

async def get_user_profile(user_id: str) -> Optional[Dict[str, Any]]:
    """
    Get user profile from Redis
    """
    try:
        client = await get_redis_client()
        key = f"user:{user_id}"
        data = await client.get(key)
        if data:
            user_data = json.loads(data)
            print(f"✅ User profile retrieved from Redis: {user_id}")
            return user_data
        return None
    except Exception as e:
        print(f"❌ Error retrieving user profile from Redis: {e}")
        return None

async def update_user_profile(user_id: str, user_data: Dict[str, Any], expiry: int = 86400) -> bool:
    """
    Update user profile in Redis
    """
    try:
        client = await get_redis_client()
        key = f"user:{user_id}"
        expiry_int = int(expiry)
        await client.setex(key, expiry_int, json.dumps(user_data))
        print(f"✅ User profile updated in Redis: {user_id}")
        return True
    except Exception as e:
        print(f"❌ Error updating user profile in Redis: {e}")
        return False

async def delete_user_profile(user_id: str) -> bool:
    """
    Delete user profile from Redis
    """
    try:
        client = await get_redis_client()
        key = f"user:{user_id}"
        await client.delete(key)
        print(f"✅ User profile deleted from Redis: {user_id}")
        return True
    except Exception as e:
        print(f"❌ Error deleting user profile from Redis: {e}")
        return False

async def store_api_key(user_id: str, service_name: str, api_key: str, key_name: Optional[str] = None, expiry: int = 86400) -> bool:
    """
    Store API key for user in Redis
    """
    try:
        client = await get_redis_client()
        key = f"api_key:{user_id}:{service_name}"
        data = {
            "user_id": user_id,
            "service_name": service_name,
            "api_key": api_key,
            "key_name": key_name or service_name,
            "created_at": str(int(time.time()))
        }
        expiry_int = int(expiry)
        await client.setex(key, expiry_int, json.dumps(data))  # 24 hour expiry
        print(f"✅ API key stored in Redis for user: {user_id}, service: {service_name}")
        return True
    except Exception as e:
        print(f"❌ Error storing API key in Redis: {e}")
        return False

async def get_api_key(user_id: str, service_name: str) -> Optional[Dict[str, Any]]:
    """
    Get API key for user from Redis
    """
    try:
        client = await get_redis_client()
        key = f"api_key:{user_id}:{service_name}"
        data = await client.get(key)
        if data:
            obj = json.loads(data)
            # Decrypt the API key if present
            if obj.get("api_key"):
                try:
                    obj["api_key"] = decrypt_api_key(obj["api_key"])
                except Exception as e:
                    print(f"❌ Error decrypting API key: {e}")
                    obj["api_key"] = None
            return obj
        return None
    except Exception as e:
        print(f"❌ Error retrieving API key from Redis: {e}")
        return None

async def get_all_api_keys(user_id: str) -> list:
    """
    Get all API keys for user from Redis
    """
    try:
        client = await get_redis_client()
        pattern = f"api_key:{user_id}:*"
        keys = await client.keys(pattern)
        api_keys = []
        for key in keys:
            data = await client.get(key)
            if data:
                api_keys.append(json.loads(data))
        return api_keys
    except Exception as e:
        print(f"❌ Error retrieving API keys from Redis: {e}")
        return []

async def delete_api_key(user_id: str, service_name: str) -> bool:
    """
    Delete API key for user from Redis
    """
    try:
        client = await get_redis_client()
        key = f"api_key:{user_id}:{service_name}"
        await client.delete(key)
        print(f"✅ API key deleted from Redis for user: {user_id}, service: {service_name}")
        return True
    except Exception as e:
        print(f"❌ Error deleting API key from Redis: {e}")
        return False

async def save_openai_key(user_id: str, openai_key: str, expiry: int = 86400) -> bool:
    try:
        client = await get_redis_client()
        key = f"api_key:{user_id}:openai"
        encrypted_key = encrypt_api_key(openai_key)
        data = {
            "user_id": user_id,
            "service_name": "openai",
            "api_key": encrypted_key,
            "created_at": str(int(time.time()))
        }
        await client.setex(key, int(expiry), json.dumps(data))
        print(f"✅ OpenAI key (encrypted) saved for user: {user_id}")
        return True
    except Exception as e:
        print(f"❌ Error saving OpenAI key: {e}")
        return False

async def has_openai_key(user_id: str) -> bool:
    try:
        client = await get_redis_client()
        key = f"api_key:{user_id}:openai"
        exists = await client.exists(key)
        return bool(exists)
    except Exception as e:
        print(f"❌ Error checking OpenAI key: {e}")
        return False

async def delete_openai_key(user_id: str) -> bool:
    try:
        client = await get_redis_client()
        key = f"api_key:{user_id}:openai"
        await client.delete(key)
        print(f"✅ OpenAI key deleted for user: {user_id}")
        return True
    except Exception as e:
        print(f"❌ Error deleting OpenAI key: {e}")
        return False

async def get_user_openai_key(user_id: str) -> Optional[str]:
    """
    Fetch and decrypt the OpenAI API key for a given user_id from Redis.
    Returns the decrypted key as a string, or None if not found.
    """
    obj = await get_api_key(user_id, "openai")
    if obj and obj.get("api_key"):
        return obj["api_key"]
    return None
