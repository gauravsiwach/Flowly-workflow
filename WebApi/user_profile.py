import httpx
from fastapi import HTTPException
from pydantic import BaseModel
from typing import Optional
import jwt
import os
from datetime import datetime, timedelta
from redis_client import store_user_profile, get_user_profile as get_redis_user_profile, update_user_profile, has_openai_key

class UserProfileRequest(BaseModel):
    access_token: str

class UserProfile(BaseModel):
    id: str
    email: str
    name: str
    picture: Optional[str] = None
    email_verified: bool = False

def generate_jwt_token(user_profile: UserProfile) -> str:
    """
    Generate JWT token for user authentication
    """
    # Get JWT secret from environment or use default
    jwt_secret = os.getenv("JWT_SECRET_KEY", "your-super-secret-jwt-key-change-in-production")
    print("jwt_secert-->",jwt_secret)
    # Token payload
    payload = {
        "sub": user_profile.id,  # Subject (user ID)
        "email": user_profile.email,
        "name": user_profile.name,
        "picture": user_profile.picture,
        "email_verified": user_profile.email_verified,
        "iat": datetime.utcnow(),  # Issued at
        "exp": datetime.utcnow() + timedelta(hours=24),  # Expires in 24 hours
        "type": "access"
    }
    
    # Generate JWT token
    token = jwt.encode(payload, jwt_secret, algorithm="HS256")
    return token

async def verify_google_token_and_get_profile(access_token: str) -> UserProfile:
    """
    Verify Google access token and return user profile information
    """
    try:
        # Verify the access token with Google
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid access token")
            
            user_info = response.json()
            
            # Create user profile object
            user_profile = UserProfile(
                id=user_info.get("id"),
                email=user_info.get("email"),
                name=user_info.get("name"),
                picture=user_info.get("picture"),
                email_verified=user_info.get("verified_email", False)
            )
            
            print(f"✅ User profile verified: {user_profile.email}")
            return user_profile
            
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error verifying token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Profile verification failed: {str(e)}")

async def get_user_profile(request: UserProfileRequest) -> dict:
    """
    Get user profile from access token, check if user exists in Redis,
    return existing user or store new user, and generate JWT token
    """
    try:
        user_profile = await verify_google_token_and_get_profile(request.access_token)
        
        # Check if user already exists in Redis
        existing_user = await get_redis_user_profile(user_profile.id)
        
        # Check if OpenAI key is saved for this user
        openai_key_saved = await has_openai_key(user_profile.id)
        
        if existing_user:
            print(f"✅ User already exists in Redis: {user_profile.email}")
            # Update last login time for existing user
            existing_user["last_login"] = datetime.utcnow().isoformat()
            existing_user["access_token"] = request.access_token
            
            # Update the user profile in Redis
            updated = await update_user_profile(user_profile.id, existing_user)
            if not updated:
                print("⚠️ Warning: Failed to update existing user profile in Redis")
            
            # Generate JWT token for existing user
            jwt_token = generate_jwt_token(user_profile)
            
            return {
                "status": "success",
                "user": {
                    "id": user_profile.id,
                    "email": user_profile.email,
                    "name": user_profile.name,
                    "picture": user_profile.picture,
                    "email_verified": user_profile.email_verified
                },
                "jwt_token": jwt_token,
                "message": "Existing user profile retrieved and updated",
                "is_new_user": False,
                "openai_key_saved": openai_key_saved
            }
        else:
            print(f"🆕 New user, storing in Redis: {user_profile.email}")
            # Generate JWT token for new user
            jwt_token = generate_jwt_token(user_profile)
            
            # Prepare user data for storage
            user_data = {
                "id": user_profile.id,
                "email": user_profile.email,
                "name": user_profile.name,
                "picture": user_profile.picture,
                "email_verified": user_profile.email_verified,
                "created_at": datetime.utcnow().isoformat(),
                "last_login": datetime.utcnow().isoformat(),
                "access_token": request.access_token
            }
            
            # Store new user profile in Redis
            stored = await store_user_profile(user_profile.id, user_data)
            if not stored:
                print("⚠️ Warning: Failed to store new user profile in Redis")
            
            return {
                "status": "success",
                "user": {
                    "id": user_profile.id,
                    "email": user_profile.email,
                    "name": user_profile.name,
                    "picture": user_profile.picture,
                    "email_verified": user_profile.email_verified
                },
                "jwt_token": jwt_token,
                "message": "New user profile created and stored successfully",
                "is_new_user": True,
                "openai_key_saved": openai_key_saved
            }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get user profile: {str(e)}") 