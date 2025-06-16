export interface TextStyle {
  fontSize: number;
  fontFamily: string;
  color: string;
  headingFontSize?: number; // Optional specific size for the heading
  caloriesFontSize?: number; // Optional specific size for the calories
  footnoteFontSize?: number; // Optional specific size for the footnote
}

export interface NutritionLabelText {
  title: string;
  dailyValueFootnote: string;
}

export interface OtherStyles {
  productName: boolean;
  showCalories: boolean;
  compactVitamin: boolean;
  justifyFootText: boolean;
  showUnsaturatedFats: boolean;
  showSugarAlcohols: boolean;
  showProteinPercent: boolean;
  shortenFootNote: boolean;
}

export interface NutritionData {
  productName: string;

  servingSize: string;
  servingsPerContainer: string;
  rounding: string;
  servingSizeQuantity: string;
  servingSizeQuantityUnit: string;
  servingSizeUnit: string;

  calories: string;
  totalFat: string;
  saturatedFat: string;
  transFat: string;
  monounsaturatedFat : string;
  polyunsaturatedFat : string;
  cholesterol: string;
  sodium: string;
  totalCarbs: string;
  dietaryFiber: string;
  totalSugars: string;
  addedSugars: string;
  sugarAlcohol: string;
  protein: string;
  vitaminD: string;
  calcium: string;
  iron: string;
  potassium: string;
  
  textStyle?: TextStyle;
  labelText?: NutritionLabelText;
  otherStyles?: OtherStyles;
}
