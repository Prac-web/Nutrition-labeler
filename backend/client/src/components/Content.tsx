import React from "react";
import PreviewLabel from "@/components/PreviewLabel";
import { Card, CardContent } from "@/components/ui/card";
import { NutritionData, TextStyle, NutritionLabelText } from '@/types/nutrition';

export type ContentProps = {
  utils: any
}

export const Content: React.FC<ContentProps> = ({
  utils,
}) => {
  return (
    <>
    <Card>
        <CardContent>
            <div className="p-1 mt-3" style={{maxWidth: '750px'}}>
                <PreviewLabel
                  utils={utils}
                />
            </div>
        </CardContent>
    </Card>
    </>
  );
}
