import React, { useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextStyle } from '@/types/nutrition';

interface TextAnalyzerProps {
  utils: any;
  onChange: (textStyle: TextStyle) => void;
}

const fontFamilies = [
  "Arial, Helvetica, sans-serif",
  "Helvetica, Arial, sans-serif",
  "Georgia, serif",
  "Times New Roman, Times, serif",
  "Courier New, Courier, monospace",
  "Verdana, Geneva, sans-serif",
  "Tahoma, Geneva, sans-serif"
];

export default function TextAnalyzer({ utils, onChange }: TextAnalyzerProps) {
  // Default values for headingFontSize if not set
  const headingFontSize = utils.textStyle.headingFontSize || 40;
  const caloriesFontSize = utils.textStyle.caloriesFontSize || 30;
  const footnoteFontSize = utils.textStyle.footnoteFontSize || 12;

  const convertFontValueForInput = (valuePx) =>
    utils.fontUnit === "px" ? valuePx : parseFloat((valuePx * 0.75).toFixed(2)); // px to pt

  const toPxFromInput = (valueInput) =>
    utils.fontUnit === "px" ? valueInput : valueInput / 0.75; // pt to px

  const handleFontValueChange = (key, value) => {
    const numeric = parseFloat(value);
    if (!isNaN(numeric) && numeric > 0) {
      onChange({
        ...utils.textStyle,
        [key]: toPxFromInput(numeric)
      });
    }
  };

  const handleFontFamilyChange = (value: string) => {
    onChange({
      ...utils.textStyle,
      fontFamily: value
    });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...utils.textStyle,
      color: e.target.value
    });
  };


  return (
    <div className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 my-2">
          <label htmlFor="font-unit-toggle" className="text-sm font-medium text-gray-700">
            Font Unit:
          </label>
          <Select
            value={utils.fontUnit}
            onValueChange={utils.setFontUnit}
          >
            <SelectTrigger id="font-unit-select" className="border rounded px-2 py-1 text-sm font-mono w-24">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="px">PX</SelectItem>
              <SelectItem value="pt">PT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="headingFontSize">Heading Font Size: {convertFontValueForInput(headingFontSize)}{utils.fontUnit}</Label>
          </div>
          <Slider
            id="headingFontSize"
            value={[convertFontValueForInput(headingFontSize)]}
            min={14}
            max={60}
            step={2}
            onValueChange={val => handleFontValueChange('headingFontSize', val[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="caloriesFontSize">Calories Font Size: {convertFontValueForInput(caloriesFontSize)}{utils.fontUnit}</Label>
          </div>
          <Slider
            id="caloriesFontSize"
            value={[convertFontValueForInput(caloriesFontSize)]}
            min={14}
            max={60}
            step={2}
            onValueChange={val => handleFontValueChange('caloriesFontSize', val[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="fontSize">Body Font Size: {convertFontValueForInput(utils.textStyle.fontSize)}{utils.fontUnit}</Label>
          </div>
          <Slider
            id="fontSize"
            value={[convertFontValueForInput(utils.textStyle.fontSize)]}
            min={8}
            max={24}
            step={1}
            onValueChange={val => handleFontValueChange('fontSize', val[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="footnoteFontSize">Footnote Font Size: {convertFontValueForInput(footnoteFontSize)}{utils.fontUnit}</Label>
          </div>
          <Slider
            id="footnoteFontSize"
            value={[convertFontValueForInput(footnoteFontSize)]}
            min={8}
            max={20}
            step={1}
            onValueChange={val => handleFontValueChange('footnoteFontSize', val[0])}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fontFamily">Font Family</Label>
          <Select
            value={utils.textStyle.fontFamily}
            onValueChange={handleFontFamilyChange}
          >
            <SelectTrigger id="fontFamily">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font) => (
                <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                  {font.split(",")[0]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="textColor">Text Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="textColor"
              type="color"
              value={utils.textStyle.color}
              onChange={handleColorChange}
              className="w-12 h-8 p-1"
            />
            <Input
              type="text"
              value={utils.textStyle.color}
              onChange={handleColorChange}
              className="flex-1"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>
    </div>
  );
}