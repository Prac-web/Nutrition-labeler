import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { string, z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TextStyle, NutritionLabelText, NutritionData } from '@/types/nutrition';

const nutritionFormSchema = z.object({
  productName: z.string().optional(),
  servingSize: z.string().min(0, "Must be a valid number"),
  servingsPerContainer: z.string().min(0, "Must be a valid number"),
  calories: z.string().min(0, "Must be a valid number"),
  totalFat: z.string().min(0, "Must be a valid number"),
  saturatedFat: z.string().min(0, "Must be a valid number"),
  transFat: z.string().min(0, "Must be a valid number"),
  cholesterol: z.string().min(0, "Must be a valid number"),
  sodium: z.string().min(0, "Must be a valid number"),
  totalCarbs: z.string().min(0, "Must be a valid number"),
  dietaryFiber: z.string().min(0, "Must be a valid number"),
  totalSugars: z.string().min(0, "Must be a valid number"),
  addedSugars: z.string().min(0, "Must be a valid number"),
  protein: z.string().min(0, "Must be a valid number"),
  vitaminD: z.string().min(0, "Must be a valid number"),
  calcium: z.string().min(0, "Must be a valid number"),
  iron: z.string().min(0, "Must be a valid number"),
  potassium: z.string().min(0, "Must be a valid number")
});


const defaultTextStyle: TextStyle = {
  fontSize: 14,
  fontFamily: "Arial, Helvetica, sans-serif",
  color: "#000000",
  headingFontSize: 40, // Optional specific size for the heading
  caloriesFontSize: 30, // Optional specific size for the calories
  footnoteFontSize: 12, 
};

type NutritionFormProps = {
  utils: any,
  onFormChange: (data: NutritionData) => void;
};

export default function NutritionForm({ utils, onFormChange }: NutritionFormProps) {
  const form = useForm<NutritionData>({
    resolver: zodResolver(nutritionFormSchema),
    defaultValues: utils.nutritionData,
    mode: "onChange"
  });

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      onFormChange(value as NutritionData);
    });
    handleTextStyleChange(utils.textStyle);
    return () => subscription.unsubscribe();
  }, [form, onFormChange]);

  const onSubmit = (data: NutritionData) => {
    onFormChange(data);
  };

  useEffect(()=>{
    handleTextStyleChange(utils.textStyle);
  },([utils.textStyle]));

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

  const handleReset = () => {
    form.reset({
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
      transFat: "",
      cholesterol: "",
      sodium: "",
      totalCarbs: "",
      dietaryFiber: "",
      totalSugars: "",
      addedSugars: "",
      protein: "",
      vitaminD: "",
      calcium: "",
      iron: "",
      potassium: ""
    });
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
    <>
      <Form {...form}>
        <div className="flex justify-start">
          <Button
            type="button"
            onClick={handleReset}
            variant="outline"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Reset
          </Button>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <div className="space-y-3 pt-2">
              <div className="grid w-full items-center gap-1.5">
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-sm font-medium text-gray-700">Product Name</Label>
                      <Input className="h-8 text-sm" placeholder="Product Name"
                        {...field}
                      />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <div className="grid w-full items-center gap-1.5">
                <FormField
                  control={form.control}
                  name="servingsPerContainer"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-sm font-medium text-gray-700">Servings Per Container</Label>
                      <Input className="h-8 text-sm" type="number" min="0" step="0.1" {...field} placeholder="Example: 7" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <div className="grid w-full items-center gap-1.5">
                <FormField
                  control={form.control}
                  name="servingSize"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-sm font-medium text-gray-700">Serving Size (wt in g)</Label>
                      <Input className="h-8 text-sm" type="number" min="0" step="0.1" {...field} placeholder="Example: 55" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <div className="grid w-full items-center gap-1.5">
                <FormField
                  control={form.control}
                  name="rounding"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-sm font-medium text-gray-700">Rounding</Label>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Default" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="usually">Usually</SelectItem>
                          <SelectItem value="varied">Varied</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <div className="grid w-full items-center gap-1.5">
                <FormField
                  control={form.control}
                  name="servingSizeQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-sm font-medium text-gray-700">Serving Size Quantity</Label>
                      <Input className="h-8 text-sm" type="text" min="0" {...field} placeholder="Example: 1/2, 10" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <div className="grid w-full items-center gap-1.5">
                <FormField
                  control={form.control}
                  name="servingSizeQuantityUnit"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-sm font-medium text-gray-700">Serving Size Quantity Unit</Label>
                      <Input className="h-8 text-sm" type="text" min="0" {...field} placeholder="Example: Cup, Tbsp, Tsp, etc." />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <div className="grid w-full items-center gap-1.5">
                <FormField
                  control={form.control}
                  name="calories"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-sm font-medium text-gray-700">Calories</Label>
                      <Input className="h-8 text-sm" type="number" min="0" {...field} />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <div className="grid w-full items-center gap-1.5">
                <div className="sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="totalFat"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="block text-sm font-medium text-gray-700">Total Fat (g)</Label>
                        <Input className="h-8 text-sm" type="number" min="0" step="0.1" {...field} />
                      </FormItem>
                    )}
                  />
                </div>
            </div>

                <div className="sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="saturatedFat"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="block text-sm font-medium text-gray-700">Saturated Fat (g)</Label>
                        <Input className="h-8 text-sm" type="number" min="0" step="0.1" {...field} />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="transFat"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="block text-sm font-medium text-gray-700">Trans Fat (g)</Label>
                        <Input className="h-8 text-sm" type="number" min="0" step="0.1" {...field} />
                      </FormItem>
                    )}
                  />
                </div>
                { utils.otherStyles.showUnsaturatedFats && (
                  <>
                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="polyunsaturatedFat"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="block text-sm font-medium text-gray-700">Polyunsaturated Fat (g)</Label>
                          <Input className="h-8 text-sm" type="number" min="0" step="0.1" {...field} />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="monounsaturatedFat"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="block text-sm font-medium text-gray-700">Monounsaturated Fat (g)</Label>
                          <Input className="h-8 text-sm" type="number" min="0" step="0.1" {...field} />
                        </FormItem>
                      )}
                    />
                  </div>
                  </>
                )}

                <div className="sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="cholesterol"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="block text-sm font-medium text-gray-700">Cholesterol (mg)</Label>
                        <Input className="h-8 text-sm" type="number" min="0" step="1" {...field} />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="sodium"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="block text-sm font-medium text-gray-700">Sodium (mg)</Label>
                        <Input className="h-8 text-sm" type="number" min="0" step="1" {...field} />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="totalCarbs"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="block text-sm font-medium text-gray-700">Total Carbohydrates (g)</Label>
                        <Input className="h-8 text-sm" type="number" min="0" step="0.1" {...field} />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="dietaryFiber"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="block text-sm font-medium text-gray-700">Dietary Fiber (g)</Label>
                        <Input className="h-8 text-sm" type="number" min="0" step="0.1" {...field} />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="totalSugars"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="block text-sm font-medium text-gray-700">Total Sugars (g)</Label>
                        <Input className="h-8 text-sm" type="number" min="0" step="0.1" {...field} />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="addedSugars"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="block text-sm font-medium text-gray-700">Added Sugars (g)</Label>
                        <Input className="h-8 text-sm" type="number" min="0" step="0.1" {...field} />
                      </FormItem>
                    )}
                  />
                </div>
                
                { utils.otherStyles.showSugarAlcohols && (
                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="sugarAlcohol"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="block text-sm font-medium text-gray-700">Sugar Alcohols (g)</Label>
                          <Input className="h-8 text-sm" type="number" min="0" step="0.1" {...field} />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className="sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="protein"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="block text-sm font-medium text-gray-700">Protein (g)</Label>
                        <Input className="h-8 text-sm" type="number" min="0" step="0.1" {...field} />
                      </FormItem>
                    )}
                  />
                </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Vitamins and Minerals</h4>
            
            <div className="space-y-3 pt-2">
              <div className="grid w-full items-center gap-1.5">
                <FormField
                  control={form.control}
                  name="vitaminD"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-sm font-medium text-gray-700">Vitamin D (mcg)</Label>
                      <Input className="h-8 text-sm" type="number" min="0" step="0.1" {...field} />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <div className="grid w-full items-center gap-1.5">
                <FormField
                  control={form.control}
                  name="calcium"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-sm font-medium text-gray-700">Calcium (mg)</Label>
                      <Input className="h-8 text-sm" type="number" min="0" step="1" {...field} />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <div className="grid w-full items-center gap-1.5">
                <FormField
                  control={form.control}
                  name="iron"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-sm font-medium text-gray-700">Iron (mg)</Label>
                      <Input className="h-8 text-sm" type="number" min="0" step="0.1" {...field} />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <div className="grid w-full items-center gap-1.5">
                <FormField
                  control={form.control}
                  name="potassium"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-sm font-medium text-gray-700">Potassium (mg)</Label>
                      <Input className="h-8 text-sm" type="number" min="0" step="1" {...field} />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

        </form>
      </Form>
    </>
  );
}
