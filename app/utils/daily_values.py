DAILY_VALUES = {
    "total_fat": 78,               # g
    "saturated_fat": 20,           # g
    "cholesterol": 300,            # mg
    "sodium": 2300,                # mg
    "total_carbs": 275,            # g
    "dietary_fiber": 28,           # g
    "added_sugars": 50,            # g
    "vitamin_d": 20,               # mcg
    "calcium": 1300,               # mg
    "iron": 18,                    # mg
    "potassium": 4700              # mg
}

def calculate_dv(value, dv_reference):
    """Calculate the daily value percentage with 2 decimal places"""
    if not value or not dv_reference:
        return 0
    
    try:
        return round(float(value) / dv_reference * 100, 2)
    except (ValueError, TypeError):
        return 0