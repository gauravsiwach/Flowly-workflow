import jwt
import os
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from user_profile import UserProfile

# JWT secret key
JWT_SECRET = os.getenv("JWT_SECRET_KEY", "your-super-secret-jwt-key-change-in-production")

# HTTP Bearer scheme
security = HTTPBearer()

def verify_jwt_token(token: str) -> dict:
    """
    Verify JWT token and return payload
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Extract current user from JWT token
    """
    token = credentials.credentials
    payload = verify_jwt_token(token)
    
    # Create user profile from JWT payload
    user_profile = UserProfile(
        id=payload.get("sub"),
        email=payload.get("email"),
        name=payload.get("name"),
        picture=payload.get("picture"),
        email_verified=payload.get("email_verified", False)
    )
    
    return {
        "id": user_profile.id,
        "email": user_profile.email,
        "name": user_profile.name,
        "picture": user_profile.picture,
        "email_verified": user_profile.email_verified
    }

def get_optional_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Optional[dict]:
    """
    Extract current user from JWT token (optional - doesn't raise error if no token)
    """
    try:
        if credentials:
            token = credentials.credentials
            payload = verify_jwt_token(token)
            
            user_profile = UserProfile(
                id=payload.get("sub"),
                email=payload.get("email"),
                name=payload.get("name"),
                picture=payload.get("picture"),
                email_verified=payload.get("email_verified", False)
            )
            
            return {
                "id": user_profile.id,
                "email": user_profile.email,
                "name": user_profile.name,
                "picture": user_profile.picture,
                "email_verified": user_profile.email_verified
            }
    except HTTPException:
        return None
    except Exception:
        return None
    
    return None 