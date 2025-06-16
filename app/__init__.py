from flask import Flask
from flask_cors import CORS
import os

from app.models.database import create_tables

def create_app():
    # Create Flask app
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app)
    
    # Create database tables
    create_tables()
    
    # Import and register API routes
    from app.routes import api_bp
    app.register_blueprint(api_bp)
    
    return app