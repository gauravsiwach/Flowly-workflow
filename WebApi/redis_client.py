import redis  # sync client
import redis.asyncio as aioredis  # async client
import os
import json
import time
from datetime import datetime
from typing import Optional, Dict, Any
from dotenv import load_dotenv
from cryptography.fernet import Fernet
import uuid

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
REDIS_DB = int(os.getenv("REDIS_DB", "0"))  # Always an int fallback

# Debug logging
print(f"🔧 Redis Configuration:")
print(f"   Host: {REDIS_HOST}")
print(f"   Port: {REDIS_PORT}")
print(f"   Password: {'***' if REDIS_PASSWORD else 'None'}")
print(f"   DB: {REDIS_DB}")

# Global Redis client
redis_client: Optional[aioredis.Redis] = None

async def get_redis_client() -> aioredis.Redis:
    """
    Get or create Redis client
    """
    global redis_client
    if redis_client is None:
        try:
            redis_client = aioredis.Redis(
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

async def store_user_profile(user_id: str, user_data: Dict[str, Any]) -> bool:
    try:
        client = await get_redis_client()
        key = f"user:{user_id}"
        value = json.dumps(user_data)
        print(f"🔄 Storing key={key}, value={value[:100]}...")  # Trim long tokens for log
        await client.set(name=key, value=value)
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

async def update_user_profile(user_id: str, user_data: Dict[str, Any]) -> bool:
    """
    Update user profile in Redis
    """
    try:
        client = await get_redis_client()
        key = f"user:{user_id}"
        await client.set(key, json.dumps(user_data))
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

async def store_api_key(user_id: str, service_name: str, api_key: str, key_name: Optional[str] = None) -> bool:
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
        await client.set(key, json.dumps(data))
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

async def save_openai_key(user_id: str, openai_key: str) -> bool:
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
        await client.set(key, json.dumps(data))
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

def get_user_openai_key_sync(user_id: str) -> Optional[str]:
    """
    Synchronous version: Fetch and decrypt the OpenAI API key for a given user_id from Redis.
    Returns the decrypted key as a string, or None if not found.
    """
    try:
        client = redis.Redis(
            host=REDIS_HOST,
            port=REDIS_PORT,
            password=REDIS_PASSWORD,
            db=REDIS_DB,
            decode_responses=True,
            encoding="utf-8"
        )
        key = f"api_key:{user_id}:openai"
        data = client.get(key)  # This should be a string, not a coroutine
        if data:
            obj = json.loads(data)
            if obj.get("api_key"):
                try:
                    obj["api_key"] = decrypt_api_key(obj["api_key"])
                except Exception as e:
                    print(f"❌ Error decrypting API key: {e}")
                    obj["api_key"] = None
            return obj["api_key"]
        return None
    except Exception as e:
        print(f"❌ Error retrieving OpenAI key (sync) from Redis: {e}")
        return None

async def save_user_workflow(user_id: str, name: str, data: dict) -> str:
    """
    Save a workflow for a user. Returns the workflow_id.
    """
    try:
        client = await get_redis_client()
        workflow_id = str(uuid.uuid4())
        key = f"workflow:{user_id}:{workflow_id}"
        workflow_data = {
            "workflow_id": workflow_id,
            "user_id": user_id,
            "name": name,
            "data": data,
            "created_at": str(int(time.time()))
        }
        await client.set(key, json.dumps(workflow_data))
        # Add workflow_id to user's workflow set for listing
        await client.sadd(f"workflows:{user_id}", workflow_id)
        return workflow_id
    except Exception as e:
        print(f"❌ Error saving workflow: {e}")
        return ""

async def get_user_workflows(user_id: str) -> list:
    """
    Get all workflows for a user.
    """
    try:
        client = await get_redis_client()
        workflow_ids = await client.smembers(f"workflows:{user_id}")
        workflows = []
        for workflow_id in workflow_ids:
            key = f"workflow:{user_id}:{workflow_id}"
            data = await client.get(key)
            if data:
                workflows.append(json.loads(data))
        return workflows
    except Exception as e:
        print(f"❌ Error retrieving workflows: {e}")
        return []

async def delete_user_workflow(user_id: str, workflow_id: str) -> bool:
    """
    Delete a workflow for a user by workflow_id.
    """
    try:
        client = await get_redis_client()
        key = f"workflow:{user_id}:{workflow_id}"
        await client.delete(key)
        await client.srem(f"workflows:{user_id}", workflow_id)
        print(f"✅ Workflow deleted: {workflow_id} for user: {user_id}")
        return True
    except Exception as e:
        print(f"❌ Error deleting workflow: {e}")
        return False

async def save_user_theme(user_id: str, theme: str) -> bool:
    """
    Save the user's selected theme in their config in Redis.
    """
    try:
        client = await get_redis_client()
        key = f"user:{user_id}:config"
        # Get existing config if any
        config = {}
        data = await client.get(key)
        if data:
            config = json.loads(data)
        config['theme'] = theme
        await client.set(key, json.dumps(config))
        print(f"✅ Theme saved for user: {user_id} -> {theme}")
        return True
    except Exception as e:
        print(f"❌ Error saving theme for user: {e}")
        return False

async def get_user_theme(user_id: str) -> str:
    """
    Get the user's selected theme from their config in Redis.
    Returns the theme name as a string, or empty string if not set.
    """
    try:
        client = await get_redis_client()
        key = f"user:{user_id}:config"
        data = await client.get(key)
        if data:
            config = json.loads(data)
            return config.get('theme', '') or ''
        return ''
    except Exception as e:
        print(f"❌ Error getting theme for user: {e}")
        return ''
