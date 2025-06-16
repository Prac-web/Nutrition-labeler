from flask import Blueprint, jsonify, request, send_file, render_template
from sqlalchemy.orm import Session
from io import BytesIO
import json

from app.models.database import NutritionLabel, get_db
from app.utils.pdf_generator import create_nutrition_label_pdf
from app.utils.simple_image_generator import create_nutrition_label_image

# Create blueprint
api_bp = Blueprint('api', __name__)

# Route for the main page
@api_bp.route('/')
def index():
    return render_template('index.html')

# Health check endpoint
@api_bp.route('/api/health')
def health_check():
    return jsonify({"status": "healthy"})

# API route to save a nutrition label
@api_bp.route('/api/labels', methods=['POST'])
def create_label():
    try:
        data = request.json
        
        # Validate the request data
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Access the database session
        db = next(get_db())
        
        # Create a new nutrition label in the database
        new_label = NutritionLabel(
            product_name=data.get('product_name', ''),
            serving_size=data.get('serving_size', ''),
            servings_per_container=data.get('servings_per_container', ''),
            calories=data.get('calories', ''),
            total_fat=data.get('total_fat', ''),
            saturated_fat=data.get('saturated_fat', ''),
            trans_fat=data.get('trans_fat', ''),
            cholesterol=data.get('cholesterol', ''),
            sodium=data.get('sodium', ''),
            total_carbs=data.get('total_carbs', ''),
            dietary_fiber=data.get('dietary_fiber', ''),
            total_sugars=data.get('total_sugars', ''),
            added_sugars=data.get('added_sugars', ''),
            protein=data.get('protein', ''),
            vitamin_d=data.get('vitamin_d', ''),
            calcium=data.get('calcium', ''),
            iron=data.get('iron', ''),
            potassium=data.get('potassium', ''),
            label_format=data.get('format', 'standard')
        )
        
        db.add(new_label)
        db.commit()
        db.refresh(new_label)
        
        # Return the created label
        return jsonify({
            "message": "Label created successfully",
            "id": new_label.id
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API route to get a specific label
@api_bp.route('/api/labels/<int:label_id>', methods=['GET'])
def get_label(label_id):
    try:
        # Access the database session
        db = next(get_db())
        
        # Get the label from the database
        label = db.query(NutritionLabel).filter(NutritionLabel.id == label_id).first()
        
        if not label:
            return jsonify({"error": "Label not found"}), 404
        
        # Convert the label to a dictionary
        label_dict = {
            "id": label.id,
            "product_name": label.product_name,
            "serving_size": label.serving_size,
            "servings_per_container": label.servings_per_container,
            "calories": label.calories,
            "total_fat": label.total_fat,
            "saturated_fat": label.saturated_fat,
            "trans_fat": label.trans_fat,
            "cholesterol": label.cholesterol,
            "sodium": label.sodium,
            "total_carbs": label.total_carbs,
            "dietary_fiber": label.dietary_fiber,
            "total_sugars": label.total_sugars,
            "added_sugars": label.added_sugars,
            "protein": label.protein,
            "vitamin_d": label.vitamin_d,
            "calcium": label.calcium,
            "iron": label.iron,
            "potassium": label.potassium,
            "format": label.label_format
        }
        
        return jsonify(label_dict), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API route to list all labels
@api_bp.route('/api/labels', methods=['GET'])
def list_labels():
    try:
        # Access the database session
        db = next(get_db())
        
        # Get all labels from the database
        labels = db.query(NutritionLabel).all()
        
        # Convert the labels to a list of dictionaries
        labels_list = []
        for label in labels:
            labels_list.append({
                "id": label.id,
                "product_name": label.product_name,
                "format": label.label_format
            })
        
        return jsonify(labels_list), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API route to download a label as PDF
@api_bp.route('/api/labels/<int:label_id>/pdf', methods=['GET'])
def download_label_pdf(label_id):
    try:
        # Access the database session
        db = next(get_db())
        
        # Get the label from the database
        label = db.query(NutritionLabel).filter(NutritionLabel.id == label_id).first()
        
        if not label:
            return jsonify({"error": "Label not found"}), 404
        
        # Convert the label to a dictionary
        label_dict = {
            "product_name": label.product_name,
            "serving_size": label.serving_size,
            "servings_per_container": label.servings_per_container,
            "calories": label.calories,
            "total_fat": label.total_fat,
            "saturated_fat": label.saturated_fat,
            "trans_fat": label.trans_fat,
            "cholesterol": label.cholesterol,
            "sodium": label.sodium,
            "total_carbs": label.total_carbs,
            "dietary_fiber": label.dietary_fiber,
            "total_sugars": label.total_sugars,
            "added_sugars": label.added_sugars,
            "protein": label.protein,
            "vitamin_d": label.vitamin_d,
            "calcium": label.calcium,
            "iron": label.iron,
            "potassium": label.potassium
        }
        
        # Generate the PDF
        pdf_data = create_nutrition_label_pdf(label_dict, label.label_format)
        
        # Create a BytesIO object from the PDF data
        pdf_buffer = BytesIO(pdf_data)
        pdf_buffer.seek(0)
        
        # Return the PDF file
        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name=f"nutrition-label-{label_id}.pdf",
            mimetype="application/pdf"
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API route to download a label as PNG
@api_bp.route('/api/labels/<int:label_id>/png', methods=['GET'])
def download_label_png(label_id):
    try:
        # Access the database session
        db = next(get_db())
        
        # Get the label from the database
        label = db.query(NutritionLabel).filter(NutritionLabel.id == label_id).first()
        
        if not label:
            return jsonify({"error": "Label not found"}), 404
        
        # Convert the label to a dictionary
        label_dict = {
            "product_name": label.product_name,
            "serving_size": label.serving_size,
            "servings_per_container": label.servings_per_container,
            "calories": label.calories,
            "total_fat": label.total_fat,
            "saturated_fat": label.saturated_fat,
            "trans_fat": label.trans_fat,
            "cholesterol": label.cholesterol,
            "sodium": label.sodium,
            "total_carbs": label.total_carbs,
            "dietary_fiber": label.dietary_fiber,
            "total_sugars": label.total_sugars,
            "added_sugars": label.added_sugars,
            "protein": label.protein,
            "vitamin_d": label.vitamin_d,
            "calcium": label.calcium,
            "iron": label.iron,
            "potassium": label.potassium
        }
        
        # Generate the PNG image
        png_data = create_nutrition_label_image(label_dict, label.label_format, "png")
        
        # Create a BytesIO object from the PNG data
        png_buffer = BytesIO(png_data)
        png_buffer.seek(0)
        
        # Return the PNG file
        return send_file(
            png_buffer,
            as_attachment=True,
            download_name=f"nutrition-label-{label_id}.png",
            mimetype="image/png"
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API route to download a label as JPG
@api_bp.route('/api/labels/<int:label_id>/jpg', methods=['GET'])
def download_label_jpg(label_id):
    try:
        # Access the database session
        db = next(get_db())
        
        # Get the label from the database
        label = db.query(NutritionLabel).filter(NutritionLabel.id == label_id).first()
        
        if not label:
            return jsonify({"error": "Label not found"}), 404
        
        # Convert the label to a dictionary
        label_dict = {
            "product_name": label.product_name,
            "serving_size": label.serving_size,
            "servings_per_container": label.servings_per_container,
            "calories": label.calories,
            "total_fat": label.total_fat,
            "saturated_fat": label.saturated_fat,
            "trans_fat": label.trans_fat,
            "cholesterol": label.cholesterol,
            "sodium": label.sodium,
            "total_carbs": label.total_carbs,
            "dietary_fiber": label.dietary_fiber,
            "total_sugars": label.total_sugars,
            "added_sugars": label.added_sugars,
            "protein": label.protein,
            "vitamin_d": label.vitamin_d,
            "calcium": label.calcium,
            "iron": label.iron,
            "potassium": label.potassium
        }
        
        # Generate the JPG image
        jpg_data = create_nutrition_label_image(label_dict, label.label_format, "jpg")
        
        # Create a BytesIO object from the JPG data
        jpg_buffer = BytesIO(jpg_data)
        jpg_buffer.seek(0)
        
        # Return the JPG file
        return send_file(
            jpg_buffer,
            as_attachment=True,
            download_name=f"nutrition-label-{label_id}.jpg",
            mimetype="image/jpeg"
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API route to generate label without saving (preview)
@api_bp.route('/api/preview', methods=['POST'])
def preview_label():
    try:
        data = request.json
        
        # Validate the request data
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        format_type = data.get('format', 'standard')
        output_format = data.get('output_format', 'png')
        
        # Create a dictionary with the label data
        label_dict = {
            "product_name": data.get('product_name', ''),
            "serving_size": data.get('serving_size', ''),
            "servings_per_container": data.get('servings_per_container', ''),
            "calories": data.get('calories', ''),
            "total_fat": data.get('total_fat', ''),
            "saturated_fat": data.get('saturated_fat', ''),
            "trans_fat": data.get('trans_fat', ''),
            "cholesterol": data.get('cholesterol', ''),
            "sodium": data.get('sodium', ''),
            "total_carbs": data.get('total_carbs', ''),
            "dietary_fiber": data.get('dietary_fiber', ''),
            "total_sugars": data.get('total_sugars', ''),
            "added_sugars": data.get('added_sugars', ''),
            "protein": data.get('protein', ''),
            "vitamin_d": data.get('vitamin_d', ''),
            "calcium": data.get('calcium', ''),
            "iron": data.get('iron', ''),
            "potassium": data.get('potassium', '')
        }
        
        # Generate the image
        if output_format.lower() == 'pdf':
            image_data = create_nutrition_label_pdf(label_dict, format_type)
            mimetype = "application/pdf"
            filename = "nutrition-label-preview.pdf"
        elif output_format.lower() == 'jpg':
            image_data = create_nutrition_label_image(label_dict, format_type, "jpg")
            mimetype = "image/jpeg"
            filename = "nutrition-label-preview.jpg"
        else:  # Default to PNG
            image_data = create_nutrition_label_image(label_dict, format_type, "png")
            mimetype = "image/png"
            filename = "nutrition-label-preview.png"
        
        # Create a BytesIO object from the image data
        buffer = BytesIO(image_data)
        buffer.seek(0)
        
        # Return the image file
        return send_file(
            buffer,
            as_attachment=True,
            download_name=filename,
            mimetype=mimetype
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500