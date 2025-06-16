import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NutritionLabelText } from "@/types/nutrition";
import { Type, ScrollText } from "lucide-react";


interface TextContentEditorProps {
  labelText: NutritionLabelText;
  onChange: (labelText: NutritionLabelText) => void;
}

export default function TextContentEditor({
  labelText,
  onChange,
}: TextContentEditorProps) {
  const [editableText, setEditableText] = useState<NutritionLabelText>(labelText);

  const handleTextChange = (field: keyof NutritionLabelText, value: string) => {
    const updatedText = {
      ...editableText,
      [field]: value,
    };
    setEditableText(updatedText);
    onChange(updatedText);
  };

  return (
    <div className="space-y-4 mb-4">

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="title-section">
          <AccordionTrigger className="text-sm font-medium py-2">
            Title
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="title" className="text-xs">Title</Label>
                <Input
                  id="title"
                  value={editableText.title}
                  onChange={(e) => handleTextChange("title", e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="footer">
          <AccordionTrigger className="text-sm font-medium py-2">
            Footer Text
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="dailyValueFootnote" className="text-xs">Daily Value Footnote</Label>
                <textarea
                  id="dailyValueFootnote"
                  value={editableText.dailyValueFootnote}
                  onChange={(e) => handleTextChange("dailyValueFootnote", e.target.value)}
                  className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}