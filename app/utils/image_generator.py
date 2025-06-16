from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
from .daily_values import DAILY_VALUES, calculate_dv
import os

# Get base directory for font access
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FONT_DIR = os.path.join(BASE_DIR, 'app', 'static', 'fonts')

# Create fonts directory if it doesn't exist
os.makedirs(FONT_DIR, exist_ok=True)

# Default font paths - we'll use DejaVuSans fonts which are usually available in Linux
REGULAR_FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BOLD_FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

# Fallback to a system font if the specified font is not available
if not os.path.exists(REGULAR_FONT):
    REGULAR_FONT = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
    BOLD_FONT = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"

# Calculate RGB from hex color
def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_nutrition_label_image(nutrition_data, format_type="standard", file_format="png"):
    """Create an image with the nutrition label in PNG or JPG format"""
    # Set image parameters based on format
    if format_type in ["standard", "vertical"]:
        width = 500
        height = 800
    elif format_type == "horizontal":
        width = 800
        height = 500
    elif format_type == "tabular":
        width = 600
        height = 800
    else:  # simplified and other formats
        width = 500
        height = 600
    
    # Create image with white background (or transparent for PNG)
    if file_format.lower() == "png":
        # For PNG, we'll create an RGBA image with transparency
        img = Image.new('RGBA', (width, height), (255, 255, 255, 0))
    else:
        # For JPG, we need a white background
        img = Image.new('RGB', (width, height), (255, 255, 255))
    
    draw = ImageDraw.Draw(img)
    
    # Load fonts
    try:
        title_font = ImageFont.truetype(BOLD_FONT, 36)
        subtitle_font = ImageFont.truetype(BOLD_FONT, 24)
        heading_font = ImageFont.truetype(BOLD_FONT, 18)
        normal_font = ImageFont.truetype(REGULAR_FONT, 16)
        small_font = ImageFont.truetype(REGULAR_FONT, 12)
    except IOError:
        # Fallback to default font if custom font not found
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        heading_font = ImageFont.load_default()
        normal_font = ImageFont.load_default()
        small_font = ImageFont.load_default()
    
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
    
    # Set up colors based on format
    text_color = (0, 0, 0)  # Black text by default
    line_color = (0, 0, 0)
    
    if format_type == "modern":
        border_color = (37, 99, 235)  # Blue
        highlight_color = (219, 234, 254)  # Light blue
        header_bg = (37, 99, 235)
        header_text = (255, 255, 255)
    elif format_type == "gradient":
        border_color = (147, 51, 234)  # Purple
        highlight_color = (243, 232, 255)  # Light purple
        header_bg = (168, 85, 247)
        header_text = (255, 255, 255)
    elif format_type == "organic":
        border_color = (21, 128, 61)  # Green
        highlight_color = (220, 252, 231)  # Light green
        header_bg = (21, 128, 61)
        header_text = (255, 255, 255)
    else:
        border_color = (0, 0, 0)  # Black
        highlight_color = (245, 245, 245)  # Light gray
        header_bg = (0, 0, 0)
        header_text = (255, 255, 255)
    
    # Draw border around the image for standard formats
    if format_type in ["standard", "vertical", "tabular"]:
        border_width = 3
        draw.rectangle(((border_width, border_width), (width-border_width, height-border_width)), 
                      outline=border_color, width=border_width)
    
    # Different layout rendering based on format type
    if format_type == "standard":
        # Standard FDA style format
        # Title
        draw.text((width//2, 50), "Nutrition Facts", fill=text_color, font=title_font, anchor="mm")
        
        # Product name
        product_name = nutrition_data.get('product_name', 'Product Name')
        draw.text((width//2, 90), product_name, fill=text_color, font=subtitle_font, anchor="mm")
        
        # Serving info
        serving_text = f"Serving Size: {nutrition_data.get('serving_size', '0')}g"
        draw.text((width//2, 130), serving_text, fill=text_color, font=normal_font, anchor="mm")
        
        servings_text = f"Servings Per Container: {nutrition_data.get('servings_per_container', '0')}"
        draw.text((width//2, 160), servings_text, fill=text_color, font=normal_font, anchor="mm")
        
        # Horizontal line
        draw.line([(50, 180), (width-50, 180)], fill=line_color, width=2)
        
        # Calories
        draw.text((80, 210), "Calories", fill=text_color, font=heading_font)
        draw.text((width-80, 210), nutrition_data.get('calories', '0'), fill=text_color, font=heading_font, anchor="ra")
        
        # Horizontal line
        draw.line([(50, 240), (width-50, 240)], fill=line_color, width=2)
        
        # Daily Value header
        draw.text((width-80, 260), "% Daily Value*", fill=text_color, font=small_font, anchor="ra")
        
        # Nutrients list
        y_pos = 290
        line_spacing = 30
        
        # Total Fat
        draw.text((80, y_pos), f"Total Fat {nutrition_data.get('total_fat', '0')}g", fill=text_color, font=normal_font)
        draw.text((width-80, y_pos), f"{total_fat_dv}%", fill=text_color, font=normal_font, anchor="ra")
        y_pos += line_spacing
        
        # Saturated Fat
        draw.text((100, y_pos), f"Saturated Fat {nutrition_data.get('saturated_fat', '0')}g", fill=text_color, font=normal_font)
        draw.text((width-80, y_pos), f"{saturated_fat_dv}%", fill=text_color, font=normal_font, anchor="ra")
        y_pos += line_spacing
        
        # Trans Fat
        draw.text((100, y_pos), f"Trans Fat {nutrition_data.get('trans_fat', '0')}g", fill=text_color, font=normal_font)
        y_pos += line_spacing
        
        # Cholesterol
        draw.text((80, y_pos), f"Cholesterol {nutrition_data.get('cholesterol', '0')}mg", fill=text_color, font=normal_font)
        draw.text((width-80, y_pos), f"{cholesterol_dv}%", fill=text_color, font=normal_font, anchor="ra")
        y_pos += line_spacing
        
        # Sodium
        draw.text((80, y_pos), f"Sodium {nutrition_data.get('sodium', '0')}mg", fill=text_color, font=normal_font)
        draw.text((width-80, y_pos), f"{sodium_dv}%", fill=text_color, font=normal_font, anchor="ra")
        y_pos += line_spacing
        
        # Total Carbs
        draw.text((80, y_pos), f"Total Carbohydrate {nutrition_data.get('total_carbs', '0')}g", fill=text_color, font=normal_font)
        draw.text((width-80, y_pos), f"{total_carbs_dv}%", fill=text_color, font=normal_font, anchor="ra")
        y_pos += line_spacing
        
        # Dietary Fiber
        draw.text((100, y_pos), f"Dietary Fiber {nutrition_data.get('dietary_fiber', '0')}g", fill=text_color, font=normal_font)
        draw.text((width-80, y_pos), f"{dietary_fiber_dv}%", fill=text_color, font=normal_font, anchor="ra")
        y_pos += line_spacing
        
        # Total Sugars
        draw.text((100, y_pos), f"Total Sugars {nutrition_data.get('total_sugars', '0')}g", fill=text_color, font=normal_font)
        y_pos += line_spacing
        
        # Added Sugars
        draw.text((120, y_pos), f"Added Sugars {nutrition_data.get('added_sugars', '0')}g", fill=text_color, font=normal_font)
        draw.text((width-80, y_pos), f"{added_sugars_dv}%", fill=text_color, font=normal_font, anchor="ra")
        y_pos += line_spacing
        
        # Protein
        draw.text((80, y_pos), f"Protein {nutrition_data.get('protein', '0')}g", fill=text_color, font=normal_font)
        y_pos += line_spacing
        
        # Horizontal line
        draw.line([(50, y_pos), (width-50, y_pos)], fill=line_color, width=1)
        y_pos += 20
        
        # Vitamins and Minerals
        draw.text((80, y_pos), f"Vitamin D {nutrition_data.get('vitamin_d', '0')}mcg", fill=text_color, font=normal_font)
        draw.text((width-80, y_pos), f"{vitamin_d_dv}%", fill=text_color, font=normal_font, anchor="ra")
        y_pos += line_spacing
        
        draw.text((80, y_pos), f"Calcium {nutrition_data.get('calcium', '0')}mg", fill=text_color, font=normal_font)
        draw.text((width-80, y_pos), f"{calcium_dv}%", fill=text_color, font=normal_font, anchor="ra")
        y_pos += line_spacing
        
        draw.text((80, y_pos), f"Iron {nutrition_data.get('iron', '0')}mg", fill=text_color, font=normal_font)
        draw.text((width-80, y_pos), f"{iron_dv}%", fill=text_color, font=normal_font, anchor="ra")
        y_pos += line_spacing
        
        draw.text((80, y_pos), f"Potassium {nutrition_data.get('potassium', '0')}mg", fill=text_color, font=normal_font)
        draw.text((width-80, y_pos), f"{potassium_dv}%", fill=text_color, font=normal_font, anchor="ra")
        y_pos += line_spacing
        
        # Footer note
        footer_y = height - 60
        draw.line([(50, footer_y-20), (width-50, footer_y-20)], fill=line_color, width=1)
        draw.multiline_text((width//2, footer_y), 
                          "* The % Daily Value (DV) tells you how much a nutrient in a\nserving contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.",
                          fill=text_color, font=small_font, align="center", anchor="mm")
    
    elif format_type == "modern":
        # Modern blue format with rounded corners
        # We can't draw rounded corners directly with PIL, but we can simulate it with background colors
        
        # Header background
        draw.rectangle(((0, 0), (width, 150)), fill=header_bg)
        
        # Title
        draw.text((width//2, 50), "Nutrition Facts", fill=header_text, font=title_font, anchor="mm")
        
        # Product name
        product_name = nutrition_data.get('product_name', 'Product Name')
        draw.text((width//2, 90), product_name, fill=header_text, font=subtitle_font, anchor="mm")
        
        # Serving info
        serving_text = f"Serving Size: {nutrition_data.get('serving_size', '0')}g"
        draw.text((100, 130), serving_text, fill=header_text, font=small_font)
        
        servings_text = f"Servings: {nutrition_data.get('servings_per_container', '0')}"
        draw.text((width-100, 130), servings_text, fill=header_text, font=small_font, anchor="ra")
        
        # Calories box
        draw.rectangle(((50, 180), (width-50, 230)), fill=highlight_color)
        draw.text((80, 205), "Calories", fill=border_color, font=heading_font)
        draw.text((width-80, 205), nutrition_data.get('calories', '0'), fill=border_color, font=heading_font, anchor="ra")
        
        # Nutrients header
        y_pos = 260
        draw.text((80, y_pos), "Nutrients", fill=border_color, font=heading_font)
        draw.text((width//2, y_pos), "Amount", fill=border_color, font=heading_font, anchor="mm")
        draw.text((width-80, y_pos), "% DV*", fill=border_color, font=heading_font, anchor="ra")
        
        # Horizontal line
        draw.line([(50, y_pos+30), (width-50, y_pos+30)], fill=border_color, width=2)
        
        # Nutrients list
        y_pos = 300
        line_spacing = 30
        
        # Total Fat
        draw.text((80, y_pos), f"Total Fat", fill=text_color, font=normal_font)
        draw.text((width//2, y_pos), f"{nutrition_data.get('total_fat', '0')}g", fill=text_color, font=normal_font, anchor="mm")
        draw.text((width-80, y_pos), f"{total_fat_dv}%", fill=text_color, font=normal_font, anchor="ra")
        y_pos += line_spacing
        
        # Saturated Fat
        draw.text((100, y_pos), f"Saturated Fat", fill=text_color, font=normal_font)
        draw.text((width//2, y_pos), f"{nutrition_data.get('saturated_fat', '0')}g", fill=text_color, font=normal_font, anchor="mm")
        draw.text((width-80, y_pos), f"{saturated_fat_dv}%", fill=text_color, font=normal_font, anchor="ra")
        y_pos += line_spacing
        
        # Continue with all nutrients...
        # The rest of the nutrient listings follow the same pattern
        
        # Add vitamin boxes at the bottom
        vitamin_y = 600
        box_width = (width-100)//4
        box_margin = 10
        
        # Vitamin D box
        draw.rectangle([(50, vitamin_y), (50+box_width-box_margin, vitamin_y+70)], fill=highlight_color)
        draw.text((50+box_width//2-box_margin//2, vitamin_y+20), "Vitamin D", fill=border_color, font=small_font, anchor="mm")
        draw.text((50+box_width//2-box_margin//2, vitamin_y+50), f"{vitamin_d_dv}%", fill=border_color, font=heading_font, anchor="mm")
        
        # Calcium box
        draw.rectangle([(50+box_width, vitamin_y), (50+2*box_width-box_margin, vitamin_y+70)], fill=highlight_color)
        draw.text((50+box_width+box_width//2-box_margin//2, vitamin_y+20), "Calcium", fill=border_color, font=small_font, anchor="mm")
        draw.text((50+box_width+box_width//2-box_margin//2, vitamin_y+50), f"{calcium_dv}%", fill=border_color, font=heading_font, anchor="mm")
        
        # Iron box
        draw.rectangle([(50+2*box_width, vitamin_y), (50+3*box_width-box_margin, vitamin_y+70)], fill=highlight_color)
        draw.text((50+2*box_width+box_width//2-box_margin//2, vitamin_y+20), "Iron", fill=border_color, font=small_font, anchor="mm")
        draw.text((50+2*box_width+box_width//2-box_margin//2, vitamin_y+50), f"{iron_dv}%", fill=border_color, font=heading_font, anchor="mm")
        
        # Potassium box
        draw.rectangle([(50+3*box_width, vitamin_y), (50+4*box_width-box_margin, vitamin_y+70)], fill=highlight_color)
        draw.text((50+3*box_width+box_width//2-box_margin//2, vitamin_y+20), "Potassium", fill=border_color, font=small_font, anchor="mm")
        draw.text((50+3*box_width+box_width//2-box_margin//2, vitamin_y+50), f"{potassium_dv}%", fill=border_color, font=heading_font, anchor="mm")
        
        # Footer note
        footer_y = height - 50
        draw.multiline_text((width//2, footer_y), 
                          "* The % Daily Value (DV) tells you how much a nutrient in a serving contributes to a daily diet.\n2,000 calories a day is used for general nutrition advice.",
                          fill=text_color, font=small_font, align="center", anchor="mm")
    
    elif format_type == "organic":
        # Organic format with green styling
        # Header 
        draw.rectangle([(0, 0), (width, 150)], fill=header_bg)
        
        # Title
        draw.text((width//2, 40), "ORGANIC", fill=header_text, font=heading_font, anchor="mm")
        draw.text((width//2, 70), "NUTRITION FACTS", fill=header_text, font=title_font, anchor="mm")
        
        # Product name
        product_name = nutrition_data.get('product_name', 'Product Name')
        draw.text((width//2, 110), product_name, fill=header_text, font=subtitle_font, anchor="mm")
        
        # Main content area with light green background
        draw.rectangle([(0, 150), (width, height-40)], fill=highlight_color)
        
        # Calories in white box
        draw.rectangle([(50, 180), (width-50, 230)], fill=(255, 255, 255), outline=border_color, width=2)
        draw.text((80, 205), "Calories", fill=border_color, font=heading_font)
        draw.text((width-80, 205), nutrition_data.get('calories', '0'), fill=border_color, font=heading_font, anchor="ra")
        
        # White background for nutrients
        draw.rectangle([(50, 250), (width-50, 550)], fill=(255, 255, 255), outline=border_color, width=1)
        
        # Nutrients header
        y_pos = 270
        draw.text((80, y_pos), "Nutrient", fill=border_color, font=heading_font)
        draw.text((width//2, y_pos), "Amount", fill=border_color, font=heading_font, anchor="mm")
        draw.text((width-80, y_pos), "% DV*", fill=border_color, font=heading_font, anchor="ra")
        
        # Horizontal line
        draw.line([(60, y_pos+30), (width-60, y_pos+30)], fill=border_color, width=1)
        
        # ... and so on for the rest of the nutrients
        
        # Footer 
        draw.rectangle([(0, height-40), (width, height)], fill=header_bg)
        draw.text((width//2, height-20), "* Percent Daily Values based on a 2,000 calorie diet.", 
                  fill=header_text, font=small_font, anchor="mm")
    
    # ... (implement other formats similarly)
    
    # Convert to appropriate format and return
    buffer = BytesIO()
    if file_format.lower() == "png":
        img.save(buffer, format="PNG")
    else:
        # For jpg, need to convert to RGB if the image has alpha channel
        if img.mode == 'RGBA':
            img = img.convert('RGB')
        img.save(buffer, format="JPEG", quality=95)
    
    image_value = buffer.getvalue()
    buffer.close()
    
    return image_value