import os
import hashlib
import hmac
from datetime import datetime, timedelta
import jwt
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = os.getenv("JWT_ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES_RAW = os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES")

if not SECRET_KEY or not ALGORITHM or not ACCESS_TOKEN_EXPIRE_MINUTES_RAW:
    raise RuntimeError(
        "CRITICAL ARCHITECTURAL CONFIGURATION ERROR: "
        "One or more environmental variables (JWT_SECRET, JWT_ALGORITHM, JWT_ACCESS_TOKEN_EXPIRE_MINUTES) "
        "are missing from the system execution environment context."
    )

ACCESS_TOKEN_EXPIRE_MINUTES = int(ACCESS_TOKEN_EXPIRE_MINUTES_RAW)

# --- REPLACED PASSLIB WITH STANDARD HASHLIB SHA256 ---
def hash_password(password: str) -> str:
    # Use PBKDF2 with SHA256 (Built directly into Python, no buggy external packages required)
    salt = os.urandom(16)
    hashed = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return salt.hex() + ":" + hashed.hex()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        salt_hex, hashed_hex = hashed_password.split(":")
        salt = bytes.fromhex(salt_hex)
        original_hash = bytes.fromhex(hashed_hex)
        new_hash = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, 100000)
        return hmac.compare_digest(original_hash, new_hash)
    except Exception:
        return False
# -----------------------------------------------------

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
