import React, { useState } from 'react';
import { LabelEditor } from './LabelEditor';
import { Card, CardContent } from "@/components/ui/card";


export type SidebarProps = {
    utils: any
}

export const Sidebar: React.FC<SidebarProps> = ({
    utils
}) => {
  return (
    <>
      <Card className="bg-white shadow rounded-lg sticky top-6">
        <CardContent className="p-6">
          <LabelEditor
            utils={utils}
          />
        </CardContent>
      </Card>
    </>
  );
}
