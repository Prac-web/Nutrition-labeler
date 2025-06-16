import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Layout, MoveHorizontal, MoveVertical } from 'lucide-react'
import TextAnalyzer from '@/components/TextAnalyzer'
import TextContentEditor from '@/components/TextContentEditor'
import NutritionForm from '@/components/NutritionForm'
import { TextStyle, NutritionLabelText, NutritionData } from '@/types/nutrition';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export type LabelEditorProps = {
  utils: any
}

export const LabelEditor: React.FC<LabelEditorProps> = ({
  utils
}) => {
  
  // Toggle function: pass the key you want to flip
  const toggleKey = (key: string) => {
    utils.setOtherStyles((prev: any) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const defaultTextStyle: TextStyle = {
    fontSize: 14,
    fontFamily: "Arial, Helvetica, sans-serif",
    color: "#000000",
    headingFontSize: 40, // Optional specific size for the heading
    caloriesFontSize: 30, // Optional specific size for the calories
    footnoteFontSize: 12, 
  };

  const onLabelTextChange = (labelText: NutritionLabelText) => {
    utils.setNutritionData((prevData) => ({
      ...prevData,
      labelText
    }));
  };

  const handleLabelTextChange = (newLabelText: NutritionLabelText) => {
    utils.setLabelText(newLabelText);
    if (onLabelTextChange) {
      onLabelTextChange(newLabelText);
    }
  };

  const onTextStyleChange = (textStyle: TextStyle) => {
    utils.setNutritionData((prevData) => ({
      ...prevData,
      textStyle
    }));
  };
  
  const handleTextStyleChange = (newTextStyle: TextStyle) => {
    utils.setTextStyle(newTextStyle);
    if (onTextStyleChange) {
      onTextStyleChange(newTextStyle);
    }
  };

  const handleFormChange = (data: NutritionData) => {
    utils.setNutritionData(data);
  };

  
  const handleReset = () => {
    handleTextStyleChange(defaultTextStyle);
    switch (utils.format) {
      case 'vertical':
        utils.setWidth(300);
        utils.textStyle = {
          ... defaultTextStyle,
          headingFontSize: 40,
          caloriesFontSize: 30,
        };
        handleTextStyleChange(utils.textStyle);
        break
      case 'horizontal':
        utils.setWidth(800);
        utils.textStyle = {
          ... defaultTextStyle,
          headingFontSize: 35,
          caloriesFontSize: 25,
        };
        handleTextStyleChange(utils.textStyle);
        break
      case 'linear':
        utils.setWidth(500);
        utils.textStyle = {
          ... defaultTextStyle,
          headingFontSize: 30,
          caloriesFontSize: 14,
        };
        handleTextStyleChange(utils.textStyle);
        break
      // …etc
      default:
        utils.setWidth(300);
        utils.textStyle = {
          ... defaultTextStyle,
          headingFontSize: 40,
          caloriesFontSize: 30,
        };
        handleTextStyleChange(utils.textStyle);
    }
  };


  return (
    <div style={{ width: '100%' }}>

      <Accordion type="single" collapsible className="w-full" defaultValue="text-and-size-customization">

        {/* Label Values */}
        <AccordionItem value="label-values">
            <AccordionTrigger className="text-sm font-medium py-2">
                <h1 className="my-3 text-xl"><b>Label Values</b></h1>
            </AccordionTrigger>
            <AccordionContent>
              <NutritionForm utils={utils} onFormChange={handleFormChange} />
            </AccordionContent>
        </AccordionItem>

        {/* Text and Size Customization */}
        <AccordionItem value="text-and-size-customization">
            <AccordionTrigger className="text-sm font-medium py-2">
                <h1 className="my-3 text-xl mx-0"><b>Text and Size Customization</b></h1>
            </AccordionTrigger>
            <AccordionContent>
                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={handleReset} 
                    variant="outline"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Reset
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MoveHorizontal className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Width: {utils.convertPx(utils.width, utils.unit)}{utils.unit}
                      </span>
                    </div>
                    <Slider
                      value={[utils.convertPx(utils.width, utils.unit)]}
                      min={utils.convertPx(200, utils.unit)}
                      max={utils.convertPx(1000, utils.unit)}
                      step={utils.convertPx(10, utils.unit)}
                      onValueChange={(vals: number[]) => {
                        utils.setWidth(utils.toPx(vals[0], utils.unit));
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
                <TextAnalyzer 
                  utils={utils}
                  onChange={handleTextStyleChange}
                />
            </AccordionContent>
        </AccordionItem>

        {/* Label Text Editor */}
        <AccordionItem value="label-text-editor">
            <AccordionTrigger className="text-sm font-medium py-2">
                <h1 className="my-3 text-xl"><b>Label Text Editor</b></h1>
            </AccordionTrigger>
            <AccordionContent>
                <TextContentEditor labelText={utils.labelText} onChange={handleLabelTextChange} />
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="additional-styles">
            <AccordionTrigger className="text-sm font-medium py-2">
                <h1 className="my-3 text-xl"><b>Additional Settings</b></h1>
            </AccordionTrigger>
            <AccordionContent>
              <div>
                  <div className="flex items-center mb-4">
                    <input 
                      id='productName'
                      checked={utils.otherStyles['productName']}
                      type="checkbox"
                      onChange={() => toggleKey('productName')}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label 
                      htmlFor='productName'
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Show Product Name
                    </label>
                  </div>
              </div>
              <div>
                  <div className="flex items-center mb-4">
                    <input 
                      id='showCalories'
                      checked={utils.otherStyles['showCalories']}
                      type="checkbox"
                      onChange={() => toggleKey('showCalories')}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label 
                      htmlFor='showCalories'
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Show Calories
                    </label>
                  </div>
              </div>
              <div>
                  <div className="flex items-center mb-4">
                    <input 
                      id='compactVitamin'
                      checked={utils.otherStyles['compactVitamin']}
                      type="checkbox"
                      onChange={() => toggleKey('compactVitamin')}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label 
                      htmlFor='compactVitamin'
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Compact Vitamins
                    </label>
                  </div>
              </div>
              <div>
                  <div className="flex items-center mb-4">
                    <input
                      id='justifyFootText'
                      checked={utils.otherStyles['justifyFootText']}
                      type="checkbox"
                      onChange={() => toggleKey('justifyFootText')}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor='justifyFootText'
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Justify Foot Text</label>
                  </div>
              </div>
              <div>
                  <div className="flex items-center mb-4">
                    <input
                      id='showUnsaturatedFats'
                      checked={utils.otherStyles['showUnsaturatedFats']}
                      type="checkbox"
                      onChange={() => toggleKey('showUnsaturatedFats')}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor='showUnsaturatedFats'
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Show Unsaturated Fats</label>
                  </div>
              </div>
              <div>
                  <div className="flex items-center mb-4">
                    <input
                      id='showSugarAlcohols'
                      checked={utils.otherStyles['showSugarAlcohols']}
                      type="checkbox"
                      onChange={() => toggleKey('showSugarAlcohols')}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor='showSugarAlcohols'
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Show Sugar Alcohols</label>
                  </div>
              </div>
              <div>
                  <div className="flex items-center mb-4">
                    <input
                      id='showProteinPercent'
                      checked={utils.otherStyles['showProteinPercent']}
                      type="checkbox"
                      onChange={() => toggleKey('showProteinPercent')}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor='showProteinPercent'
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Show Protein Percent</label>
                  </div>
              </div>
              { (utils.format == 'horizontal') && (
                <div>
                    <div className="flex items-center mb-4">
                      <input
                        id='shortenFootNote'
                        checked={utils.otherStyles['shortenFootNote']}
                        type="checkbox"
                        onChange={() => toggleKey('shortenFootNote')}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor='shortenFootNote'
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >Shorten Foot Note</label>
                    </div>
                </div>
              )}
            </AccordionContent>
        </AccordionItem>
      </Accordion>

    </div>
  )
}