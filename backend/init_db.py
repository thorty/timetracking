"""
Initialize database with correct schema
"""
from database import Base, engine
import models

# Create all tables
Base.metadata.create_all(bind=engine)
print("Database initialized successfully with all tables!")
