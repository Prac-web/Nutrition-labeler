import os
from sqlalchemy import create_engine, Column, Integer, String, Float, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Get database URL from environment variables
database_url = os.environ.get('DATABASE_URL')
if database_url and database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)

# Create engine
engine = create_engine(database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class NutritionLabel(Base):
    __tablename__ = "nutrition_labels"

    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String, index=True)
    serving_size = Column(String)
    servings_per_container = Column(String)
    calories = Column(String)
    total_fat = Column(String)
    saturated_fat = Column(String)
    trans_fat = Column(String)
    cholesterol = Column(String)
    sodium = Column(String)
    total_carbs = Column(String)
    dietary_fiber = Column(String)
    total_sugars = Column(String)
    added_sugars = Column(String)
    protein = Column(String)
    vitamin_d = Column(String)
    calcium = Column(String)
    iron = Column(String)
    potassium = Column(String)
    label_format = Column(String, default="standard")

# Create the tables in the database
def create_tables():
    Base.metadata.create_all(bind=engine)

# Get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()