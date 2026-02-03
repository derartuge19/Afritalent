from passlib.context import CryptContext

try:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    h = pwd_context.hash("testpassword")
    v = pwd_context.verify("testpassword", h)
    print(f"Bcrypt working: {v}")
except Exception as e:
    print(f"Bcrypt failed: {e}")
