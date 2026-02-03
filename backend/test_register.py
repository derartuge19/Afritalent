from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from app import models, schemas, crud
from app.config import settings

# Setup DB connection
SQLALCHEMY_DATABASE_URL = f"postgresql://postgres:{settings.POSTGRES_PASSWORD}@localhost/{settings.POSTGRES_DB}"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def test_create_user():
    db = TestingSessionLocal()
    try:
        # Create a test user schema
        # Use a random email to avoid collision
        import random
        email = f"test_{random.randint(1000,9999)}@example.com"
        user_in = schemas.UserCreate(
            email=email,
            password="password123",
            role="seeker" # Pydantic should parse this to Enum
        )
        
        print(f"Attempting to create user: {user_in}")
        
        # Test hash
        hashed = crud.get_password_hash(user_in.password)
        print(f"Hash generated: {hashed}")
        
        # Test creation
        user = crud.create_user(db, user_in)
        print(f"User created successfully: ID={user.id}, Role={user.role}")
        
    except Exception as e:
        print(f"FAILED: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_create_user()
