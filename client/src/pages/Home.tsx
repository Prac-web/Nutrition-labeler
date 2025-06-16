import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Content } from "@/components/Content";
import Advertisement from "@/components/Advertisement";
import { Card, CardContent } from "@/components/ui/card";
import { NutritionData, TextStyle, NutritionLabelText, OtherStyles } from '@/types/nutrition';

const defaultLabelText: NutritionLabelText = {
  title: "Nutrition Facts",
  dailyValueFootnote: "* The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice."
};

const defaultNutritionData: NutritionData = {
  productName: "",

  servingSize: "",
  servingsPerContainer: "",
  rounding: "",
  servingSizeQuantity: "",
  servingSizeQuantityUnit: "",
  servingSizeUnit: "",

  calories: "",
  totalFat: "",
  saturatedFat: "",
  polyunsaturatedFat: "",
  monounsaturatedFat: "",
  transFat: "",
  cholesterol: "",
  sodium: "",
  totalCarbs: "",
  dietaryFiber: "",
  totalSugars: "",
  addedSugars: "",
  sugarAlcohol: "",
  protein: "",
  vitaminD: "",
  calcium: "",
  iron: "",
  potassium: "",
  textStyle: {
    fontSize: 14,
    fontFamily: "Arial, Helvetica, sans-serif",
    color: "#000000"
  },
  labelText: defaultLabelText
};

const defaultTextStyle: TextStyle = {
    fontSize: 14,
    fontFamily: "Arial, Helvetica, sans-serif",
    color: "#000000",
    headingFontSize: 40,
    caloriesFontSize: 35,
    footnoteFontSize: 12
};

const defaultOtherStyles: OtherStyles = {
  productName: false,
  showCalories: true,
  compactVitamin: false,
  justifyFootText: false,
  showUnsaturatedFats: false,
  showSugarAlcohols: false,
  showProteinPercent: false,
  shortenFootNote: false,
};


const UNIT_LABELS = {
  px: "Pixels (px)",
  in: "Inches (in)",
  cm: "Centimeters (cm)",
  mm: "Millimeters (mm)",
  pt: "Points (pt)",
};

const BASE = {
    fontSize: 14,
    headingFontSize: 40,
    caloriesFontSize: 35,
    footnoteFontSize: 12
};

// Conversion rates: 1 px = X unit
const CONVERSION = {
  px: 1,
  in: 1/96,
  cm: 1/37.8,
  mm: 1/3.78,
  pt: 0.75, // 1 px = 0.75 pt
};

function toPx(value: number, unit: any) {
  const conversion = {
    px: 1,
    in: 96,
    cm: 37.8,
    mm: 3.78,
    pt: 1 / 0.75,
  };
  return value * conversion[unit];
}

function convertPx(value: number, unit: any) {
  return parseFloat((value * CONVERSION[unit]).toFixed(2));
}

function getDim(val: number, unit: any) {
  return `${convertPx(val, unit)}${unit}`;
}

export default function Home() {
  const [format, setFormat] = useState('vertical')
  const [width, setWidth] = useState(300)

  const [nutritionData, setNutritionData] = React.useState<NutritionData>(defaultNutritionData);
  
  const [textStyle, setTextStyle] = useState<TextStyle>(
      nutritionData.textStyle || defaultTextStyle
  );
  
  // for Other Styles
  const [otherStyles, setOtherStyles] = useState<OtherStyles>(
      nutritionData.otherStyles || defaultOtherStyles
  );
  
  // Use labelText from nutritionData or default
  const [labelText, setLabelText] = useState<NutritionLabelText>(
      nutritionData.labelText || defaultLabelText
  );

  // UNIT CONVERTER
  const [unit, setUnit] = useState("px");

  const [fontUnit, setFontUnit] = useState("px"); // "px" or "pt"


  const utils = {
    format: format,
    setFormat: setFormat,
    width: width,
    setWidth: setWidth,
    nutritionData: nutritionData,
    setNutritionData: setNutritionData,
    textStyle: textStyle,
    setTextStyle: setTextStyle,
    otherStyles: otherStyles,
    setOtherStyles: setOtherStyles,
    labelText: labelText,
    setLabelText: setLabelText,
    unit: unit,
    setUnit: setUnit,
    fontUnit: fontUnit,
    setFontUnit: setFontUnit,
    convertPx: convertPx,
    toPx: toPx,
    getDim: getDim
  }

  useEffect(() => {
    switch (format) {
      case 'vertical':
        setWidth(300); // px
        textStyle.headingFontSize = 40; // px
        textStyle.caloriesFontSize = 30; // px
        break;
      case 'horizontal':
        setWidth(800);
        textStyle.headingFontSize = 35;
        textStyle.caloriesFontSize = 25;
        break;
      case 'linear':
        setWidth(500);
        textStyle.headingFontSize = 30;
        textStyle.caloriesFontSize = 14;
        break;
      default:
        setWidth(300);
        textStyle.headingFontSize = 40;
        textStyle.caloriesFontSize = 30;
    }
  }, [format])

  const horizontal_ad = `
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9295215624875834"
      crossOrigin="anonymous"></script>
    <ins className="adsbygoogle"
        style={{display:'block'}}
        data-ad-client="ca-pub-9295215624875834"
        data-ad-slot="5950030329"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
  `;

  return (
    <div className="min-h-screen py-3">
      <main className="mx-auto px-4 container">
        {/* ADVERTISEMENT */}
        <div className="my-3">
          <Advertisement html={horizontal_ad} />
        </div>
        <div className="custom_body">
          <div className="custom_sidebar">
            <Sidebar
                utils={utils}
            />
          </div>
          <div className="custom_content">
            <Content 
                utils={utils}
            />
          </div>
        </div>
        {/* ADVERTISEMENT */}
        {/* <div className="my-3">
          <Card className="bg-white shadow rounded-lg top-6">
            <CardContent className="p-6" style={{ lineHeight: '1.6'}}>
              <Advertisement html={horizontal_ad} />
            </CardContent>
          </Card>
        </div> */}
        <div className="my-4">
           <Card className="bg-white shadow rounded-lg sticky top-6">
              <CardContent className="p-6" style={{ lineHeight: '1.6'}}>
                <h1 className="my-3 text-3xl"><b>Help</b></h1>
                <h2>How to Use This App:</h2>
                <ol type="1">
                  <li>1. Fill out the nutrition information form on the left</li>
                  <li>2. Watch the label preview update in real-time.</li>
                  <li>3. Choose a format style from the dropdown menu in the preview section.</li>
                  <li>4. Customize the styling of the nutrition label.</li>
                  <li>5. Customize the text of the nutrition label.</li>
                  <li>6. Use zoom buttons to adjust the preview size.</li>
                  <li>7. Click JPG, PNG, or PDF to download in your preferred format.</li>
                </ol>
                <p><b>Note:</b> PNG files will have transparent backgrounds, while JPG and PDF have white backgrounds.</p>
              </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
