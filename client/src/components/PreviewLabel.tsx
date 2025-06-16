// PreviewLabel.tsx
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";
import NutritionLabel from "@/components/NutritionLabel";
import Downloader from "@/components/Downloader";
import NutritionTableUnitSwitcher from "@/components/NutritionTableUnitSwitcher";
import { useToast } from "@/hooks/use-toast";

// SELECT
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export type PreviewLabelProps = {
  utils: any;
};

const PreviewLabel: React.FC<PreviewLabelProps> = ({ utils }) => {
  const [scale, setScale] = useState(1);
  const labelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleZoomIn = () => scale < 1.5 && setScale((s) => s + 0.1);
  const handleZoomOut = () => scale > 0.5 && setScale((s) => s - 0.1);

  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (labelRef.current) {
      setHeight(labelRef.current.offsetHeight);
    }
  }, [labelRef, utils.width, utils.unit]); // Add any dependencies that may cause height to change

  // const displayDims = `${utils.convertPx(width, utils.unit)} × ${utils.convertPx(height, utils.unit)} ${utils.unit}`;

  // We'll get the width in px, but display/input in current unit
  const widthInUnit = utils.convertPx(utils.width, utils.unit);
  const heightInUnit = utils.convertPx(height, utils.unit);

  // To allow decimals for units like "cm", "in"
  const handleWidthChange = (e) => {
    const value = e.target.value;
    if (!value) return; // ignore empty input
    const numericValue = parseFloat(value);
    utils.setWidth(utils.toPx(numericValue, utils.unit));
  };

  return (
    <>
      <h1 className="my-3 text-2xl">
        <b>Label Preview</b>
      </h1>

      {/* SELECT FORMAT */}
      <div className="flex items-center space-x-2 my-3">
        <span className="text-sm font-medium text-gray-700">Label Format:</span>
        <Select value={utils.format} onValueChange={utils.setFormat}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vertical">Vertical</SelectItem>
            <SelectItem value="horizontal">Horizontal</SelectItem>
            <SelectItem value="linear">Linear</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* SELECT UNIT */}
      <NutritionTableUnitSwitcher utils={utils} />

      <div className="flex items-center space-x-2 my-2">
        <label
          className="text-lg font-medium text-gray-700"
          htmlFor="width-input"
        >
          Dimensions:
        </label>
        <input
          id="width-input"
          type="number"
          min={utils.convertPx(200, utils.unit)}
          max={utils.convertPx(1000, utils.unit)}
          step={utils.unit === "px" || utils.unit === "pt" ? 1 : 0.1}
          value={widthInUnit}
          onChange={handleWidthChange}
          className="border rounded px-2 w-24 text-lg"
        />
        <span className="text-lg text-gray-700">
          {utils.unit} / {heightInUnit}
          {utils.unit} (auto)
        </span>
      </div>

      {/* Zoom Controls */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex space-x-3">
          <Button onClick={handleZoomIn} variant="outline">
            <ZoomIn className="h-5 w-5 mr-1" /> Zoom In
          </Button>
          <Button onClick={handleZoomOut} variant="outline">
            <ZoomOut className="h-5 w-5 mr-1" /> Zoom Out
          </Button>
        </div>
      </div>

      {/* TEXT FORMATTING */}
      {/* <div>
        <div className="custom_label" style={{textAlign: 'center'}}>
            <button className="custom_edit custom_bold" onClick={handleBoldClick} ><LuBold /></button>
            <button className="custom_edit custom_italic" onClick={handleItalicClick} ><LuItalic /></button>
            <button className="custom_edit custom_underline" onClick={handleUnderlineClick} ><LuUnderline /></button>
        </div>
      </div> */}

      {/* Live Preview */}
      <div
        // ref={editorRef}
        // contentEditable
        // suppressContentEditableWarning

        id="preview-container"
        className="flex p-3"
        style={{ overflowX: "auto", height: "auto" }}
      >
        <div
          ref={labelRef}
          id="nutrition-label"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: `${utils.convertPx(utils.width, utils.unit)}${utils.unit}`,
            height: "auto",
            margin: 0,
            padding: 0,
            boxSizing: "border-box",
            position: "relative",
            top: 0,
            left: 0,
            background: "transparent",
          }}
        >
          <NutritionLabel width={utils.width} utils={utils} />
        </div>
      </div>

      <Downloader labelRef={labelRef} />

      {/* <p className='mt-3' style={{color: 'red', textAlign: 'center'}}>Note: Please do not change the text from here. Only for formatting </p> */}
    </>
  );
};

export default PreviewLabel;
