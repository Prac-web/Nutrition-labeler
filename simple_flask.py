from flask import Flask, jsonify, request, send_file
from io import BytesIO
import json
import os

app = Flask(__name__)

@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/')
def index():
    return "Nutrition Label Generator API - Python Version"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)