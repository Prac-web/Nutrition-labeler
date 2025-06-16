import React, { useState } from "react";

// SELECT
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

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

export type NutritionTableUnitSwitcherProps = {
    utils: any
}

const NutritionTableUnitSwitcher: React.FC<NutritionTableUnitSwitcherProps> = ({
    utils
}) => {
  // In child:
  const { unit, setUnit } = { unit: utils.unit, setUnit: utils.setUnit };
  return (
    <div className="flex items-center space-x-2 my-3">
      {/* SELECT FORMAT */}
      <span className="text-sm font-medium text-gray-700">Unit:</span>
      <Select value={unit} onValueChange={setUnit}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Unit" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(UNIT_LABELS).map(([key, label]) => (
          <SelectItem value={key} >{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default NutritionTableUnitSwitcher;