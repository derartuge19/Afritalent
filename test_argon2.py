from passlib.context import CryptContext

try:
    pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
    h = pwd_context.hash("testpassword")
    v = pwd_context.verify("testpassword", h)
    print(f"Argon2 working: {v}")
except Exception as e:
    print(f"Argon2 failed: {e}")
