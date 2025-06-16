from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from io import BytesIO
from .daily_values import DAILY_VALUES, calculate_dv

def create_nutrition_label_pdf(nutrition_data, format_type="standard"):
    """Create a PDF with the nutrition label"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, 
                            rightMargin=72, leftMargin=72, 
                            topMargin=72, bottomMargin=72)
    
    # Get styles
    styles = getSampleStyleSheet()
    title_style = styles['Heading1']
    title_style.alignment = 1  # center alignment
    
    subtitle_style = styles['Heading2']
    subtitle_style.alignment = 1
    
    normal_style = styles['Normal']
    
    # Create elements
    elements = []
    
    # Title
    elements.append(Paragraph("Nutrition Facts", title_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # Product name if provided
    if nutrition_data.get('product_name'):
        elements.append(Paragraph(nutrition_data.get('product_name'), subtitle_style))
        elements.append(Spacer(1, 0.1*inch))
    
    # Serving information
    serving_text = f"Serving Size: {nutrition_data.get('serving_size', '0')}g"
    if nutrition_data.get('servings_per_container'):
        serving_text += f" | Servings Per Container: {nutrition_data.get('servings_per_container', '0')}"
    elements.append(Paragraph(serving_text, normal_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # Calories
    calories_style = ParagraphStyle('CaloriesStyle', parent=styles['Heading2'])
    calories_style.alignment = 0  # left alignment
    elements.append(Paragraph(f"Calories: {nutrition_data.get('calories', '0')}", calories_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # Create a more detailed table for standard format
    if format_type in ["standard", "horizontal", "vertical", "tabular"]:
        # Calculate daily values
        total_fat_dv = calculate_dv(nutrition_data.get('total_fat'), DAILY_VALUES["total_fat"])
        saturated_fat_dv = calculate_dv(nutrition_data.get('saturated_fat'), DAILY_VALUES["saturated_fat"])
        cholesterol_dv = calculate_dv(nutrition_data.get('cholesterol'), DAILY_VALUES["cholesterol"])
        sodium_dv = calculate_dv(nutrition_data.get('sodium'), DAILY_VALUES["sodium"])
        total_carbs_dv = calculate_dv(nutrition_data.get('total_carbs'), DAILY_VALUES["total_carbs"])
        dietary_fiber_dv = calculate_dv(nutrition_data.get('dietary_fiber'), DAILY_VALUES["dietary_fiber"])
        added_sugars_dv = calculate_dv(nutrition_data.get('added_sugars'), DAILY_VALUES["added_sugars"])
        vitamin_d_dv = calculate_dv(nutrition_data.get('vitamin_d'), DAILY_VALUES["vitamin_d"])
        calcium_dv = calculate_dv(nutrition_data.get('calcium'), DAILY_VALUES["calcium"])
        iron_dv = calculate_dv(nutrition_data.get('iron'), DAILY_VALUES["iron"])
        potassium_dv = calculate_dv(nutrition_data.get('potassium'), DAILY_VALUES["potassium"])
        
        # Create nutrition table data
        data = [
            ["Nutrient", "Amount", "% Daily Value*"],
            ["Total Fat", f"{nutrition_data.get('total_fat', '0')}g", f"{total_fat_dv}%"],
            ["   Saturated Fat", f"{nutrition_data.get('saturated_fat', '0')}g", f"{saturated_fat_dv}%"],
            ["   Trans Fat", f"{nutrition_data.get('trans_fat', '0')}g", ""],
            ["Cholesterol", f"{nutrition_data.get('cholesterol', '0')}mg", f"{cholesterol_dv}%"],
            ["Sodium", f"{nutrition_data.get('sodium', '0')}mg", f"{sodium_dv}%"],
            ["Total Carbohydrates", f"{nutrition_data.get('total_carbs', '0')}g", f"{total_carbs_dv}%"],
            ["   Dietary Fiber", f"{nutrition_data.get('dietary_fiber', '0')}g", f"{dietary_fiber_dv}%"],
            ["   Total Sugars", f"{nutrition_data.get('total_sugars', '0')}g", ""],
            ["      Added Sugars", f"{nutrition_data.get('added_sugars', '0')}g", f"{added_sugars_dv}%"],
            ["Protein", f"{nutrition_data.get('protein', '0')}g", ""],
            ["Vitamin D", f"{nutrition_data.get('vitamin_d', '0')}mcg", f"{vitamin_d_dv}%"],
            ["Calcium", f"{nutrition_data.get('calcium', '0')}mg", f"{calcium_dv}%"],
            ["Iron", f"{nutrition_data.get('iron', '0')}mg", f"{iron_dv}%"],
            ["Potassium", f"{nutrition_data.get('potassium', '0')}mg", f"{potassium_dv}%"]
        ]
        
        # Create the table
        table = Table(data, colWidths=[2.5*inch, 1*inch, 1*inch])
        
        # Add style
        table_style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
            ('BACKGROUND', (0, 1), (-1, -1), colors.white),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('ALIGN', (1, 1), (1, -1), 'CENTER'),
            ('ALIGN', (2, 1), (2, -1), 'CENTER'),
            ('FONTNAME', (0, 1), (0, -1), 'Helvetica'),
            ('FONTNAME', (0, 1), (0, 1), 'Helvetica-Bold'),  # Total Fat
            ('FONTNAME', (0, 4), (0, 6), 'Helvetica-Bold'),  # Cholesterol, Sodium, Total Carbs
            ('FONTNAME', (0, 10), (0, 10), 'Helvetica-Bold'),  # Protein
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
        ])
        
        table.setStyle(table_style)
        elements.append(table)
    
    # Simplified format
    else:
        # Create a simpler table for colored and simplified formats
        # Calculate daily values
        total_fat_dv = calculate_dv(nutrition_data.get('total_fat'), DAILY_VALUES["total_fat"])
        total_carbs_dv = calculate_dv(nutrition_data.get('total_carbs'), DAILY_VALUES["total_carbs"])
        sodium_dv = calculate_dv(nutrition_data.get('sodium'), DAILY_VALUES["sodium"])
        protein = nutrition_data.get('protein', '0')
        
        # Main nutrients table
        main_data = [
            ["Total Fat", "Total Carbs", "Sodium", "Protein"],
            [f"{nutrition_data.get('total_fat', '0')}g", f"{nutrition_data.get('total_carbs', '0')}g", f"{nutrition_data.get('sodium', '0')}mg", f"{protein}g"],
            [f"{total_fat_dv}% DV", f"{total_carbs_dv}% DV", f"{sodium_dv}% DV", "-"]
        ]
        
        main_table = Table(main_data, colWidths=[1.1*inch, 1.1*inch, 1.1*inch, 1.1*inch])
        
        # Style for the simplified table
        main_style = TableStyle([
            ('BACKGROUND', (0, 0), (0, 0), colors.lightblue),
            ('BACKGROUND', (1, 0), (1, 0), colors.lightgreen),
            ('BACKGROUND', (2, 0), (2, 0), colors.salmon),
            ('BACKGROUND', (3, 0), (3, 0), colors.lavender),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ])
        
        main_table.setStyle(main_style)
        elements.append(main_table)
        
        # Add some space
        elements.append(Spacer(1, 0.3*inch))
    
    # Footer note
    footnote_style = ParagraphStyle('Footnote', parent=styles['Normal'])
    footnote_style.fontSize = 8
    elements.append(Paragraph("* The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.", footnote_style))
    
    # Build the document
    doc.build(elements)
    
    # Get the value from the BytesIO buffer
    pdf_value = buffer.getvalue()
    buffer.close()
    
    return pdf_value