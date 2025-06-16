import React from "react";
import { NutritionData, NutritionLabelText } from "@/types/nutrition";
import { DAILY_VALUES } from "@/lib/dailyValues";
import { CarTaxiFront } from "lucide-react";

// Function to calculate daily value percentage with 2 decimal places
function calculateDV(value: string, dvReference: number): number {
  if (!value || isNaN(Number(value)) || !dvReference) return 0;
  return parseFloat(((Number(value) / dvReference) * 100).toFixed(1));
}

type NutritionLabelProps = {
  width?: number;
  utils: any
};

export default function NutritionLabel({ 
  width = 300,
  utils
}: NutritionLabelProps) {
  // We need to make sure backgrounds are explicitly set for proper transparency
  // For PNG export, we'll replace white backgrounds with a key color that will become transparent
  const data = {
    ...utils.nutritionData,
    ...utils.textStyle,
    ...utils.labelText
  }

  var bgStyle = { 
    backgroundColor: "white",
    width: width ? `${width}px` : 'auto',
  };
  
  // Apply text style if provided
  const textStyle = data.textStyle ? {
    fontSize: `${data.textStyle.fontSize}px`,
    fontFamily: data.textStyle.fontFamily,
    color: data.textStyle.color,
    borderColor: data.textStyle.color,
  } : {};
  
  // Apply heading style with optional specific heading font size
  const headingStyle = data.textStyle ? {
    fontSize: data.textStyle.headingFontSize ? `${data.textStyle.headingFontSize}px` : `${40}px`,
    fontFamily: data.textStyle.fontFamily,
    color: data.textStyle.color,
    fontWeight: 'bold'
  } : {};

  const caloriesStyle = data.textStyle ? {
    fontSize: data.textStyle.caloriesFontSize ? `${data.textStyle.caloriesFontSize}px` : `${30}px`,
    fontFamily: data.textStyle.fontFamily,
    color: data.textStyle.color,
    fontWeight: 'bold'
  } : {};

  const footnoteStyle = data.textStyle ? {
    fontSize: data.textStyle.footnoteFontSize ? `${data.textStyle.footnoteFontSize}px` : `${12}px`,
    fontFamily: data.textStyle.fontFamily,
    color: data.textStyle.color
  } : {};
  
  // Helper function to check if a field has a value
  const hasValue = (field: string | undefined): boolean => {
    return field !== undefined && field !== null && field.trim() !== "";
  };
  
  // Calculate daily values
  const totalFatDV = calculateDV(data.totalFat, DAILY_VALUES.totalFat);
  const saturatedFatDV = calculateDV(data.saturatedFat, DAILY_VALUES.saturatedFat);
  const cholesterolDV = calculateDV(data.cholesterol, DAILY_VALUES.cholesterol);
  const sodiumDV = calculateDV(data.sodium, DAILY_VALUES.sodium);
  const totalCarbsDV = calculateDV(data.totalCarbs, DAILY_VALUES.totalCarbs);
  const dietaryFiberDV = calculateDV(data.dietaryFiber, DAILY_VALUES.dietaryFiber);
  const addedSugarsDV = calculateDV(data.addedSugars, DAILY_VALUES.addedSugars);
  const vitaminDDV = calculateDV(data.vitaminD, DAILY_VALUES.vitaminD);
  const calciumDV = calculateDV(data.calcium, DAILY_VALUES.calcium);
  const ironDV = calculateDV(data.iron, DAILY_VALUES.iron);
  const potassiumDV = calculateDV(data.potassium, DAILY_VALUES.potassium);
  const proteinDV = calculateDV(data.protein, DAILY_VALUES.protein);

  // Get label text content with defaults
  const labelText: NutritionLabelText = data.labelText || {
    title: "Nutrition Facts",
    dailyValueFootnote: "* The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice."
  };

  // Standard format (default FDA style)
  const renderVerticalLabel = () => (
    <div className="nutrition-label nutrition-standard nutrition-facts" style={{...bgStyle, ...textStyle}}>
      <h1 style={headingStyle}>{labelText.title}</h1>
      <table>
        {/* Divider */}
        <tr className="divider"><td colSpan={2}></td></tr>
        { (utils.otherStyles.productName) && (
          <tr style={textStyle}>
            <td colSpan={2}><b>{ hasValue(data.productName) ? data.productName : 'Product Name' }</b></td>
          </tr>
        )}
        {/* Servings */}
        <tr className="servings-row" style={textStyle}>
          <td>Serving size: { hasValue(data.servingSizeQuantity) ? `${data.servingSizeQuantity} ` : '' }{ hasValue(data.servingSizeQuantityUnit) ? `${data.servingSizeQuantityUnit} ` : '' } ({ hasValue(data.servingSize) ? data.servingSize : '0' }g)</td>
        </tr>
        <tr style={textStyle}>
          <td>Servings per container: { hasValue(data.servingsPerContainer) ? data.servingsPerContainer : '0' }{ hasValue(data.rounding) ? ` (${data.rounding})` : '' }</td>
        </tr>
          
        {/* Divider */}
        <tr className="divider-bold" style={textStyle}><td colSpan={2}></td></tr>

        {/* Calories */}
        <tr>
          <td colSpan={2}>Amount Per Serving</td>
        </tr>
        { (utils.otherStyles.showCalories) && (
        <tr className="calories-row" style={caloriesStyle}>
          <td>Calories</td>
          <td className="percent">{ hasValue(data.calories) ? data.calories : '0' }</td>
        </tr>
        )}

        {/* Divider */}
        <tr className="divider-bold"><td colSpan={2}></td></tr>

      </table>
      <table className="table_content">
        <tr style={textStyle}>
          <td><b>Amount</b></td>
          <td className="percent"><b>% Daily Value*</b></td>
        </tr>
      </table>
      <table className="table_content">
        {/* Fats */}
        <tr style={textStyle}>
          <td className="nutrient">Total Fat { hasValue(data.totalFat) ? data.totalFat : '0' }g</td>
          <td className="percent">{totalFatDV}%</td>
        </tr>
        <tr style={textStyle}>
          <td className="sub-nutrient">Saturated Fat { hasValue(data.saturatedFat) ? data.saturatedFat : '0' }g</td>
          <td className="percent">{saturatedFatDV}%</td>
        </tr>
        <tr style={textStyle}>
          <td className="sub-nutrient"><i>Trans</i> Fat { hasValue(data.transFat) ? data.transFat : '0' }g</td>
          <td></td>
        </tr>
        { utils.otherStyles.showUnsaturatedFats && (
          <>
          <tr style={textStyle}>
            <td className="sub-nutrient" colSpan={2}>Polyunsaturated Fat { hasValue(data.polyunsaturatedFat) ? data.polyunsaturatedFat : '0' }g</td>
          </tr>
          <tr style={textStyle}>
            <td className="sub-nutrient" colSpan={2}>Monounsaturated Fat { hasValue(data.monounsaturatedFat) ? data.monounsaturatedFat : '0' }g</td>
          </tr>
          </>
        )}

        {/* Cholesterol & Sodium */}
        <tr style={textStyle}>
          <td className="nutrient">Cholesterol { hasValue(data.cholesterol) ? data.calories : '0' }mg</td>
          <td className="percent">{cholesterolDV}%</td>
        </tr>
        <tr style={textStyle}>
          <td className="nutrient">Sodium { hasValue(data.sodium) ? data.sodium : '0' }mg</td>
          <td className="percent">{sodiumDV}%</td>
        </tr>

        <tr style={textStyle}>
          <td className="nutrient">Total Carbohydrate { hasValue(data.totalCarbs) ? data.totalCarbs : '0' }g</td>
          <td className="percent">{totalCarbsDV}%</td>
        </tr>
        <tr style={textStyle}>
          <td className="sub-nutrient">Dietary Fiber { hasValue(data.dietaryFiber) ? data.dietaryFiber : '0' }g</td>
          <td className="percent">{dietaryFiberDV}%</td>
        </tr>
        <tr style={textStyle}>
          <td className="sub-nutrient">Total Sugars { hasValue(data.totalSugars) ? data.totalSugars : '0' }g</td>
          <td></td>
        </tr>
        <tr style={textStyle}>
          <td className="sub-nutrient">Includes { hasValue(data.addedSugars) ? data.addedSugars : '0' }g Added Sugars</td>
          <td className="percent">{addedSugarsDV}%</td>
        </tr>
        { utils.otherStyles.showSugarAlcohols && (
          <tr style={textStyle}>
            <td className="sub-nutrient" colSpan={2}>Sugar Alcohol { hasValue(data.sugarAlcohol) ? data.sugarAlcohol : '0' }g</td>
          </tr>
        )}

        {/* Protein */}
        <tr style={textStyle}>
          <td className="nutrient">Protein { hasValue(data.protein) ? data.protein : '0' }g</td>
          <td className="percent">
            { (utils.otherStyles.showProteinPercent) ? `${proteinDV}%` : '' }
          </td>
        </tr>

        {/* Divider */}
        <tr className="divider-bold"><td colSpan={2}></td></tr>
      </table>
      {/* Micronutrients */}
      {(hasValue(data.vitaminD) || hasValue(data.calcium) || hasValue(data.iron) || hasValue(data.potassium)) && (
          (utils.otherStyles.compactVitamin) ? (
          <div className="row nutrition-vitamins" style={{flexWrap: 'wrap'}}>
          
            {hasValue(data.vitaminD) && (
            <table className="col-2">
              <tr>
                <td className="sub-nutrient">Vit.D {data.vitaminD}mcg {vitaminDDV}%</td>
              </tr>
            </table>
            )}
            
            {hasValue(data.calcium) && (
            <table className="col-2">
              <tr>
                <td className="sub-nutrient">Calc. {data.calcium}mg {calciumDV}%</td>
              </tr>
            </table>
            )}
            {hasValue(data.iron) && (
            <table className="col-2">
              <tr>
                <td className="sub-nutrient">Iron {data.iron}mg {ironDV}%</td>
              </tr>
            </table>
            )}
            {hasValue(data.potassium) && (
            <table className="col-2">
              <tr>
                <td className="sub-nutrient">Potas. {data.potassium}mg {potassiumDV}%</td>
              </tr>
            </table>
            )}
            <table>
              <tr className="divider-bold"><td></td></tr>
            </table>
          </div>
        ) : (
          <table className="table_content">
            {hasValue(data.vitaminD) && (
            <tr style={textStyle}>
              <td>Vitamin D {data.vitaminD}mcg</td>
              <td className="percent">{vitaminDDV}%</td>
            </tr>
            )}

            {hasValue(data.calcium) && (
            <tr style={textStyle}>
              <td>Calcium {data.calcium}mg</td>
              <td className="percent">{calciumDV}%</td>
            </tr>
            )}
            
            {hasValue(data.iron) && (
            <tr style={textStyle}>
              <td>Iron {data.iron}mg</td>
              <td className="percent">{ironDV}%</td>
            </tr>
            )}
            
            {hasValue(data.potassium) && (
            <tr style={textStyle}>
              <td>Potassium {data.potassium}mg</td>
              <td className="percent">{potassiumDV}%</td>
            </tr>
            )}
            
            <tr className="divider-bold"><td colSpan={2}></td></tr>
          </table>
        )
      )}

      <p style={footnoteStyle} className={`footnote ${ utils.otherStyles.justifyFootText ? 'justify' : '' }`}>
        {labelText.dailyValueFootnote}
      </p>
    </div>
  );

  // Horizontal format (side-by-side layout)
  const renderHorizontalLabel = () => (
     <div className="nutrition-standard nutrition-horizontal nutrition-facts" style={{...bgStyle, ...textStyle}}>
      <div className="row">
        {/* Left column */}
        <div className="nutrition-main">
          <table>
            <tbody>
              <tr>
                <td colSpan={2}>
                  <h1 style={headingStyle}>{labelText.title}</h1>
                </td>
              </tr>
              {/* Divider */}
              <tr className="divider-sm" style={textStyle}>
                <td colSpan={2}></td>
              </tr>
              { (utils.otherStyles.productName) && (
                <tr style={textStyle}>
                  <td colSpan={2}>{ hasValue(data.productName) ? data.productName : 'Product Name' }</td>
                </tr>
              )}
            </tbody>
          </table>

          <table>
            <tbody>
              {/* Servings */}
              <tr className="servings-row" style={textStyle}>
                <td>Serving size: { hasValue(data.servingSizeQuantity) ? `${data.servingSizeQuantity} ` : '' } { hasValue(data.servingSizeQuantityUnit) ? `${data.servingSizeQuantityUnit} ` : '' } ({ hasValue(data.servingSize) ? data.servingSize : '0' }g)</td>
              </tr>
              <tr style={textStyle}>
                <td>Servings per container: { hasValue(data.servingsPerContainer) ? data.servingsPerContainer : '0' }{ hasValue(data.rounding) ? ` (${data.rounding})` : '' }</td>
              </tr>
            </tbody>
          </table>

          { (utils.otherStyles.showCalories) && (
          <table>
            <tbody>
              {/* Calories */}
              <tr className="calories-row" style={caloriesStyle}>
                <td>Calories</td>
                <td className="percent">{ hasValue(data.calories) ? data.calories : '0' }</td>
              </tr>
            </tbody>
          </table>
          )}
        </div>

        {/* Right column */}
        {/* Macro nutrients */}
        <div className="nutrition-content table_content" style={{ flexGrow: 1 }}>
          <div className="row">
            <div className="col-2">
              <table>
                  <tr style={textStyle}>
                    <th>Amount</th>
                    <th className="percent">% Daily Value*</th>
                  </tr>
                  {/* Divider */}
                  <tr className="divider-bold" style={textStyle}>
                    <td colSpan={2}></td>
                  </tr>
              </table>
              <table>
                {/* Fats */}
                <tr style={textStyle}>
                  <td className="nutrient">Total Fat { hasValue(data.totalFat) ? data.totalFat : '0' }g</td>
                  <td className="percent">{totalFatDV}%</td>
                </tr>
                <tr style={textStyle}>
                  <td className="sub-nutrient">Saturated Fat { hasValue(data.saturatedFat) ? data.saturatedFat : '0' }g</td>
                  <td className="percent">{saturatedFatDV}%</td>
                </tr>
                <tr style={textStyle}>
                  <td className="sub-nutrient">
                    <i>Trans</i> Fat { hasValue(data.transFat) ? data.transFat : '0' }g
                  </td>
                  <td></td>
                </tr>
                { utils.otherStyles.showUnsaturatedFats && (
                  <>
                  <tr style={textStyle}>
                    <td className="sub-nutrient" colSpan={2}>Polyunsaturated Fat { hasValue(data.polyunsaturatedFat) ? data.polyunsaturatedFat : '0' }g</td>
                  </tr>
                  <tr style={textStyle}>
                    <td className="sub-nutrient" colSpan={2}>Monounsaturated Fat { hasValue(data.monounsaturatedFat) ? data.monounsaturatedFat : '0' }g</td>
                  </tr>
                  </>
                )}
                {/* Cholesterol & Sodium */}
                <tr style={textStyle}>
                  <td className="nutrient">Cholesterol { hasValue(data.cholesterol) ? data.cholesterol : '0' }mg</td>
                  <td className="percent">{cholesterolDV}%</td>
                </tr>
                
                { ( !utils.otherStyles.showUnsaturatedFats || utils.otherStyles.showSugarAlcohols ) && (
                <tr style={textStyle}>
                  <td className="nutrient">Sodium { hasValue(data.sodium) ? data.sodium : '0' }mg</td>
                  <td className="percent">{sodiumDV}%</td>
                </tr>
                )}

                
                { (utils.otherStyles.showSugarAlcohols && !utils.otherStyles.showUnsaturatedFats) && (
                  <tr>
                    <td colSpan={2}>&nbsp;</td>
                  </tr>
                )}
                
                {/* Divider */}
                <tr className="divider-bold" style={textStyle}>
                  <td colSpan={2}></td>
                </tr>
              </table>
            </div>

            <div className="col-2" style={{ marginLeft: '5px' }}>
              <table>
                <tbody>
                  <tr style={textStyle}>
                    <th>Amount</th>
                    <th className="percent">% Daily Value*</th>
                  </tr>
                  {/* Divider */}
                  <tr className="divider-bold" style={textStyle}>
                    <td colSpan={2}></td>
                  </tr>
                </tbody>
              </table>
              <table>
                <tbody>
                  { (utils.otherStyles.showUnsaturatedFats && !utils.otherStyles.showSugarAlcohols) && (
                  <tr style={textStyle}>
                    <td className="nutrient">Sodium { hasValue(data.sodium) ? data.sodium : '0' }mg</td>
                    <td className="percent">{sodiumDV}%</td>
                  </tr>
                  )}
                  
                  <tr style={textStyle}>
                    <td className="nutrient">Total Carbohydrate { hasValue(data.totalCarbs) ? data.totalCarbs : '0' }g</td>
                    <td className="percent">{totalCarbsDV}%</td>
                  </tr>
                  <tr style={textStyle}>
                    <td className="sub-nutrient">Dietary Fiber { hasValue(data.dietaryFiber) ? data.dietaryFiber : '0' }g</td>
                    <td className="percent">{dietaryFiberDV}%</td>
                  </tr>
                  <tr style={textStyle}>
                    <td className="sub-nutrient" colSpan={2}>Total Sugars { hasValue(data.totalSugars) ? data.totalSugars : '0' }g</td>
                  </tr>
                  <tr style={textStyle}>
                    <td className="sub-nutrient">
                      Includes { hasValue(data.addedSugars) ? data.addedSugars : '0' }g Added Sugars
                    </td>
                    <td className="percent">{addedSugarsDV}%</td>
                  </tr>
                  { utils.otherStyles.showSugarAlcohols && (
                    <tr style={textStyle}>
                      <td className="sub-nutrient" colSpan={2}>
                        Sugar Alcohols { hasValue(data.sugarAlcohol) ? data.sugarAlcohol : '0' }g
                      </td>
                    </tr>
                  )}
                  {/* Protein */}
                  <tr style={textStyle}>
                    <td className="nutrient">Protein { hasValue(data.protein) ? data.protein : '0' }g</td>
                    <td className="percent">{ (utils.otherStyles.showProteinPercent) ? `${proteinDV}%` : '' }</td>
                  </tr>
                  { (utils.otherStyles.showUnsaturatedFats && utils.otherStyles.showSugarAlcohols) && (
                    <tr>
                      <td colSpan={2}>&nbsp;</td>
                    </tr>
                  )}
                  {/* Divider */}
                  <tr className="divider-bold" style={textStyle}>
                    <td colSpan={2}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {(hasValue(data.vitaminD) || hasValue(data.calcium) || hasValue(data.iron) || hasValue(data.potassium)) && (
          (utils.otherStyles.compactVitamin) ? (
          <div className="row nutrition-vitamins" style={{ flexWrap: 'wrap' }}>
            
            {hasValue(data.vitaminD) && (
            <table className="col-4">
              <tr>
                <td className="sub-nutrient">Vit.D {data.vitaminD}mcg {vitaminDDV}%</td>
              </tr>
            </table>
            )}
            {hasValue(data.calcium) && (
            <table className="col-4">
              <tr>
                <td className="sub-nutrient">Calc. {data.calcium}mg {calciumDV}%</td>
              </tr>
            </table>
            )}
            {hasValue(data.iron) && (
            <table className="col-4">
              <tr>
                <td className="sub-nutrient">Iron {data.iron}mg {ironDV}%</td>
              </tr>
            </table>
            )}
            {hasValue(data.potassium) && (
            <table className="col-4">
              <tr>
                <td className="sub-nutrient">Potas. {data.potassium}mg {potassiumDV}%</td>
              </tr>
            </table>
            )}
          </div>
          ) : (
          <div className="row nutrition-vitamins" style={{ flexWrap: 'wrap' }}>
            
            {hasValue(data.vitaminD) && (
            <table className="col-3">
              <tbody>
                <tr style={textStyle}>
                  <td className="sub-nutrient">Vitamin D { hasValue(data.vitaminD) ? `${data.vitaminD} ` : '' }mcg {vitaminDDV}%</td>
                </tr>
              </tbody>
            </table>
            )}
            {hasValue(data.calcium) && (
            <table className="col-3">
              <tbody>
                <tr style={textStyle}>
                  <td className="sub-nutrient">Calcium { hasValue(data.calcium) ? `${data.calcium} ` : '' }mg {calciumDV}%</td>
                </tr>
              </tbody>
            </table>
            )}
            {hasValue(data.iron) && (
            <table className="col-3">
              <tbody>
                <tr style={textStyle}>
                  <td className="sub-nutrient">Iron { hasValue(data.iron) ? `${data.iron} ` : '' }mg {ironDV}%</td>
                </tr>
              </tbody>
            </table>
            )}
            {hasValue(data.potassium) && (
            <table className="col-3">
              <tbody>
                <tr style={textStyle}>
                  <td className="sub-nutrient">Potassium { hasValue(data.potassium) ? `${data.potassium} ` : '' }mg {potassiumDV}%</td>
                </tr>
              </tbody>
            </table>
            )}
          </div>
          )
        )}
        </div>

        {/* Footnote */}
        { !utils.otherStyles.shortenFootNote && (
          <div className="footnote-box">
            <p className={`footnote ${ utils.otherStyles.justifyFootText ? 'justify' : '' }`} style={footnoteStyle}>{labelText.dailyValueFootnote}</p>
          </div>
        )}
      </div>
    </div>
  );

  // Linear format (less detailed)
  const renderLinearLabel = () => (
    <div className="nutrition-standard nutrition-facts nutrition-linear" style={{...bgStyle, ...textStyle}}>
      <p style={textStyle}>
        <span className="heading" style={headingStyle}>Nutrition Facts</span>{' '}
        Servings: { hasValue(data.servingsPerContainer) ? data.servingsPerContainer : '0' }{ hasValue(data.rounding) ? `(${data.rounding})` : '' },
        <b>Serv. Size: { hasValue(data.servingSizeQuantity) ? `${data.servingSizeQuantity} ` : '' } { hasValue(data.servingSizeQuantityUnit) ? `${data.servingSizeQuantityUnit} ` : '' } ({ hasValue(data.servingSize) ? `${data.servingSize} ` : '0' }g),</b>{' '}
        Amount Per Serving:{' '}
        { (utils.otherStyles.showCalories) && (
          <>
          <b className="calories" style={caloriesStyle}>
            Calories: <span>{ hasValue(data.calories) ? data.calories : '0' }</span>
          </b>,{' '}
          </>
        )}
        <b>Total Fat:</b> { hasValue(data.totalFat) ? data.totalFat : '0' }g ({totalFatDV}% DV), 
        Sat. Fat { hasValue(data.saturatedFat) ? data.saturatedFat : '0' }g ({saturatedFatDV}% DV), 
        { utils.otherStyles.showUnsaturatedFats && ( <>
          Polyunsat. Fat { hasValue(data.polyunsaturatedFat) ? data.polyunsaturatedFat : '0' }g,{' '} 
          Monounsat. Fat { hasValue(data.monounsaturatedFat) ? data.monounsaturatedFat : '0' }g,{' '} 
        </> )}
        Trans Fat { hasValue(data.transFat) ? data.transFat : '0' }g,{' '}
        <b>Cholest.</b> { hasValue(data.cholesterol) ? data.cholesterol : '0' }mg ({cholesterolDV}% DV), <b>Sodium</b> { hasValue(data.sodium) ? data.sodium : '0' }mg ({sodiumDV}% DV),{' '}
        <b>Total Carb.</b> { hasValue(data.totalCarbs) ? data.totalCarbs : '0' }g ({totalCarbsDV}% DV), Fiber { hasValue(data.dietaryFiber) ? data.dietaryFiber : '0' }g ({dietaryFiberDV}% DV), Total Sugars { hasValue(data.totalSugars) ? data.totalSugars : '0' }g{' '}
        (Incl. { hasValue(data.addedSugars) ? data.addedSugars : '0' }g Added Sugars, {addedSugarsDV}% DV),{' '}
        { utils.otherStyles.showSugarAlcohols && ( <>
          Sugar Alc. { hasValue(data.sugarAlcohol) ? data.sugarAlcohol : '0' }g,{' '}
        </> )}
        <b>Protein</b> { hasValue(data.protein) ? data.protein : '0' }g{ (utils.otherStyles.showProteinPercent) ? ` (${proteinDV}%)` : '' }
        {hasValue(data.vitaminD) && (
          <span>,{' '}Vit. D ({vitaminDDV}% DV)</span>
        )}
        {hasValue(data.calcium) && (
          <span>,{' '}Calcium ({calciumDV}% DV)</span>
        )}
        {hasValue(data.vitaminD) && (
          <span>,{' '}Iron ({ironDV}% DV)</span>
        )}
        {hasValue(data.vitaminD) && (
          <span>,{' '}Potas. ({potassiumDV}% DV)</span>
        )}
      </p>
    </div>
  );

  // const renderTabularLabel = () => (
  //   <div className="nutrition-label simplified-label bg-white border border-gray-300 rounded-lg p-4 max-w-xs shadow-sm" style={{...bgStyle, ...textStyle}}>
  //     <h2 className="text-center text-xl font-bold mb-2" style={headingStyle}>{labelText.title}</h2>
  //     {hasValue(data.productName) ? (
  //       <p className="text-center mb-3">{data.productName}</p>
  //     ) : (
  //       <p className="text-center mb-5"></p>
  //     )}
      
  //     <div className="bg-gray-100 py-3 px-4 rounded-md mb-3">
  //       <div className="flex justify-between items-center">
  //         <span className="text-xl font-bold">Calories</span>
  //         <span className="text-2xl font-bold">{hasValue(data.calories) ? data.calories : "0"}</span>
  //       </div>
  //       <div className="text-sm text-gray-600 mt-1">
  //           <span>Serving Size: {hasValue(data.servingSize) ? data.servingSize : "0"}g ({hasValue(data.servingsPerContainer) ? data.servingsPerContainer : "0"} servings per container)</span>
  //       </div>
  //     </div>
      
  //     <div className="grid grid-cols-2 gap-2 mb-4">
  //         <div className="bg-blue-50 p-2 rounded">
  //           <div className="font-bold">Total Fat</div>
  //           <div className="flex justify-between">
  //             <span>{hasValue(data.totalFat) ? data.totalFat : "0"}g</span>
  //             <span className="text-gray-600">{totalFatDV}% DV</span>
  //           </div>
  //         </div>
        
  //         <div className="bg-green-50 p-2 rounded">
  //           <div className="font-bold">Total Carbohydrates</div>
  //           <div className="flex justify-between">
  //             <span>{hasValue(data.totalCarbs) ? data.totalCarbs : "0"}g</span>
  //             <span className="text-gray-600">{totalCarbsDV}% DV</span>
  //           </div>
  //         </div>
        
  //       {hasValue(data.sodium) && (
  //         <div className="bg-red-50 p-2 rounded">
  //           <div className="font-bold">Sodium</div>
  //           <div className="flex justify-between">
  //             <span>{data.sodium}mg</span>
  //             <span className="text-gray-600">{sodiumDV}% DV</span>
  //           </div>
  //         </div>
  //       )}
        
  //         <div className="bg-purple-50 p-2 rounded">
  //           <div className="font-bold">Protein</div>
  //           <div className="flex justify-between">
  //             <span>{hasValue(data.protein) ? data.protein : "0"}g</span>
  //             <span className="text-gray-600">-</span>
  //           </div>
  //         </div>


  //         <div className="bg-purple-50 p-2 rounded">
  //           <div className="font-bold">Cholesterol</div>
  //           <div className="flex justify-between">
  //             <span>{hasValue(data.cholesterol) ? data.cholesterol : "0"}g</span>
  //             <span className="text-gray-600">-</span>
  //           </div>
  //         </div>
  //     </div>
      
  //     {(hasValue(data.saturatedFat) || hasValue(data.dietaryFiber) || hasValue(data.totalSugars) || hasValue(data.addedSugars)) && (
  //       <div className="border-t border-gray-300 pt-2 text-sm">
  //         <div className="grid grid-cols-2 gap-x-4 gap-y-1">
  //           {hasValue(data.saturatedFat) && (
  //             <>
  //               <div>Saturated Fat: {data.saturatedFat}g</div>
  //               <div>{saturatedFatDV}% DV</div>
  //             </>
  //           )}
            
  //           {hasValue(data.dietaryFiber) && (
  //             <>
  //               <div>Dietary Fiber: {data.dietaryFiber}g</div>
  //               <div>{dietaryFiberDV}% DV</div>
  //             </>
  //           )}
            
  //           {hasValue(data.totalSugars) && (
  //             <>
  //               <div>Total Sugars: {data.totalSugars}g</div>
  //               <div>-</div>
  //             </>
  //           )}
            
  //           {hasValue(data.addedSugars) && (
  //             <>
  //               <div>Added Sugars: {data.addedSugars}g</div>
  //               <div>{addedSugarsDV}% DV</div>
  //             </>
  //           )}
  //         </div>
  //       </div>
  //     )}
      
  //     <p className="text-xs text-gray-600 mt-2 pt-2 border-t border-gray-300">{labelText.dailyValueFootnote}</p>
  //   </div>
  // );


  // Vertical format (condensed, more modern looking)
  // const renderVerticalLabel = () => (
  //   <div className="nutrition-label vertical-label bg-white p-4 border-2 border-black max-w-xs" style={{...bgStyle, ...textStyle}}>
  //     <h2 className="text-center text-xl font-bold pb-1 mb-3" style={headingStyle}>{labelText.title}</h2>
  //     <div className="text-center mb-2">
  //       {hasValue(data.productName) ? (
  //         <p className="font-bold" style={textStyle}>{data.productName}</p>
  //       ) : (
  //         <p className="font-bold my-2"></p>
  //       )}
  //       <p style={textStyle}><span>{hasValue(data.servingsPerContainer) ? data.servingsPerContainer : "0"}</span> servings per container</p>
  //       <p style={textStyle}>Serving Size <span>{hasValue(data.servingSize) ? data.servingSize : "0"}</span>g</p>
  //     </div>
      
  //     <div className="bg-black text-white font-bold text-center py-1 my-2">
  //       Calories <span className="text-xl">{hasValue(data.calories) ? data.calories : "0"}</span>
  //     </div>
      
  //     <div className="grid grid-cols-3 gap-1 text-sm">
  //       <div className="col-span-2 font-bold" style={textStyle}>% Daily Value*</div>
  //       <div></div>
        
  //         <>
  //           <div className="font-bold" style={textStyle}>Total Fat</div>
  //           <div style={textStyle}>{hasValue(data.totalFat) ? data.totalFat : "0"}g</div>
  //           <div className="text-right" style={textStyle}>{totalFatDV}%</div>
  //         </>
        
  //         <>
  //           <div className="pl-4" style={textStyle}>Saturated Fat</div>
  //           <div style={textStyle}>{hasValue(data.saturatedFat) ? data.totalFat : "0"}g</div>
  //           <div className="text-right" style={textStyle}>{saturatedFatDV}%</div>
  //         </>
        
  //         <>
  //           <div className="pl-4" style={textStyle}><i>Trans</i> Fat</div>
  //           <div style={textStyle}>{hasValue(data.transFat) ? data.totalFat : "0"}g</div>
  //           <div></div>
  //         </>
        
  //         <>
  //           <div className="font-bold" style={textStyle}>Cholesterol</div>
  //           <div style={textStyle}>{hasValue(data.cholesterol) ? data.cholesterol : "0"}mg</div>
  //           <div className="text-right" style={textStyle}>{cholesterolDV}%</div>
  //         </>
        
  //         <>
  //           <div className="font-bold" style={textStyle}>Sodium</div>
  //           <div style={textStyle}>{hasValue(data.sodium) ? data.totalFat : "0"}mg</div>
  //           <div className="text-right" style={textStyle}>{sodiumDV}%</div>
  //         </>
        
  //         <>
  //           <div className="font-bold" style={textStyle}>Total Carbohydrates</div>
  //           <div style={textStyle}>{hasValue(data.totalCarbs) ? data.totalCarbs : "0"}g</div>
  //           <div className="text-right" style={textStyle}>{totalCarbsDV}%</div>
  //         </>
        
  //         <>
  //           <div className="pl-4" style={textStyle}>Dietary Fiber</div>
  //           <div style={textStyle}>{hasValue(data.dietaryFiber) ? data.totalFat : "0"}g</div>
  //           <div className="text-right" style={textStyle}>{dietaryFiberDV}%</div>
  //         </>
        
  //         <>
  //           <div className="pl-4" style={textStyle}>Total Sugars</div>
  //           <div style={textStyle}>{hasValue(data.totalSugars) ? data.totalFat : "0"}g</div>
  //           <div></div>
  //         </>
          
  //         <>
  //           <div className="pl-8" style={textStyle}>Added Sugars</div>
  //           <div style={textStyle}>{hasValue(data.addedSugars) ? data.totalFat : "0"}g</div>
  //           <div className="text-right" style={textStyle}>{addedSugarsDV}%</div>
  //         </>
          
        
  //         <>
  //           <div className="font-bold" style={textStyle}>Protein</div>
  //           <div style={textStyle}>{hasValue(data.protein) ? data.protein : "0"}g</div>
  //           <div></div>
  //         </>
  //     </div>
      
  //     {(hasValue(data.vitaminD) || hasValue(data.calcium) || hasValue(data.iron) || hasValue(data.potassium)) && (
  //       <div className="border-t border-black my-2 pt-1 grid grid-cols-4 gap-1 text-sm">
  //         {hasValue(data.vitaminD) && (
  //           <>
  //             <div style={textStyle}>Vitamin D</div>
  //             <div style={textStyle}>{data.vitaminD}mcg</div>
  //             <div className="text-right" style={textStyle}>{vitaminDDV}%</div>
  //             <div></div>
  //           </>
  //         )}
          
  //         {hasValue(data.calcium) && (
  //           <>
  //             <div style={textStyle}>Calcium</div>
  //             <div style={textStyle}>{data.calcium}mg</div>
  //             <div className="text-right" style={textStyle}>{calciumDV}%</div>
  //             <div></div>
  //           </>
  //         )}
          
  //         {hasValue(data.iron) && (
  //           <>
  //             <div style={textStyle}>Iron</div>
  //             <div style={textStyle}>{data.iron}mg</div>
  //             <div className="text-right" style={textStyle}>{ironDV}%</div>
  //             <div></div>
  //           </>
  //         )}
          
  //         {hasValue(data.potassium) && (
  //           <>
  //             <div style={textStyle}>Potassium</div>
  //             <div style={textStyle}>{data.potassium}mg</div>
  //             <div className="text-right" style={textStyle}>{potassiumDV}%</div>
  //             <div></div>
  //           </>
  //         )}
  //       </div>
  //     )}
  //     <div className="thin-separator"></div>
  //     <p className="text-xs pt-1" style={footnoteStyle}>{labelText.dailyValueFootnote}</p>
  //   </div>
  // );

  // Tabular format (grid-based)
  // const renderTabularLabel = () => (
  //   <div className="nutrition-label tabular-label bg-white border-2 border-black p-3 max-w-md" style={{...bgStyle, ...textStyle}}>
  //     <h2 className="text-center font-bold text-lg pb-1" style={headingStyle}>{labelText.title}</h2>
  //     {hasValue(data.productName) ? (
  //       <p className="text-sm text-center my-1">
  //         <span className="font-bold">{data.productName}</span>
  //       </p>
  //     ) : (
  //       <p className="text-sm text-center my-2"></p>
  //     )}
  //     <div className="grid grid-cols-2 text-sm mb-2">
  //         <p><span className="font-bold">Serving Size:</span>{hasValue(data.servingSize) ? data.servingSize : "0"}g</p>
  //         <p><span className="font-bold">servings per container:</span> {hasValue(data.servingsPerContainer) ? data.servingsPerContainer : "0"}</p>
  //     </div>
      
  //     <table className="w-full text-sm border-collapse custom_table">
  //       <thead>
  //         <tr className="bg-gray-200">
  //           <th className="border border-gray-400 px-2 py-1 text-left">Nutrient</th>
  //           <th className="border border-gray-400 px-2 py-1 text-center">Amount</th>
  //           <th className="border border-gray-400 px-2 py-1 text-center">% DV*</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         <tr className="font-bold">
  //           <td className="border border-gray-400 px-2 py-1">Calories</td>
  //           <td className="border border-gray-400 px-2 py-1 text-center">{hasValue(data.calories) ? data.calories : "0"}</td>
  //           <td className="border border-gray-400 px-2 py-1 text-center">-</td>
  //         </tr>
          
  //           <tr>
  //             <td className="border border-gray-400 px-2 py-1 font-bold">Total Fat</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{hasValue(data.totalFat) ? data.totalFat : "0"}g</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{totalFatDV}%</td>
  //           </tr>
            
          
  //           <tr>
  //             <td className="border border-gray-400 px-2 py-1 pl-4">Saturated Fat</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{hasValue(data.saturatedFat) ? data.totalFat : "0"}g</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{saturatedFatDV}%</td>
  //           </tr>
            
  //           <tr>
  //             <td className="border border-gray-400 px-2 py-1 pl-4"><i>Trans</i> Fat</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{hasValue(data.transFat) ? data.totalFat : "0"}g</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">-</td>
  //           </tr>

  //           <tr>
  //             <td className="border border-gray-400 px-2 py-1 font-bold">Cholesterol</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{hasValue(data.cholesterol) ? data.cholesterol : "0"}mg</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{cholesterolDV}%</td>
  //           </tr>
          
  //           <tr>
  //             <td className="border border-gray-400 px-2 py-1 font-bold">Sodium</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{hasValue(data.sodium) ? data.totalFat : "0"}mg</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{sodiumDV}%</td>
  //           </tr>
          
  //           <tr>
  //             <td className="border border-gray-400 px-2 py-1 font-bold">Total Carbohydrates</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{hasValue(data.totalCarbs) ? data.totalCarbs : "0"}g</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{totalCarbsDV}%</td>
  //           </tr>
          
  //           <tr>
  //             <td className="border border-gray-400 px-2 py-1 pl-4">Dietary Fiber</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{hasValue(data.dietaryFiber) ? data.totalFat : "0"}g</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{dietaryFiberDV}%</td>
  //           </tr>
            
  //           <tr>
  //             <td className="border border-gray-400 px-2 py-1 pl-4">Total Sugars</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{hasValue(data.totalSugars) ? data.totalFat : "0"}g</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">-</td>
  //           </tr>
            
  //           <tr>
  //             <td className="border border-gray-400 px-2 py-1 pl-8">Added Sugars</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{hasValue(data.addedSugars) ? data.totalFat : "0"}g</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{addedSugarsDV}%</td>
  //           </tr>
          
  //           <tr>
  //             <td className="border border-gray-400 px-2 py-1 font-bold">Protein</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{hasValue(data.protein) ? data.protein : "0"}g</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">-</td>
  //           </tr>
          
  //         {hasValue(data.vitaminD) && (
  //           <tr>
  //             <td className="border border-gray-400 px-2 py-1">Vitamin D</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{data.vitaminD}mcg</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{vitaminDDV}%</td>
  //           </tr>
  //         )}
          
  //         {hasValue(data.calcium) && (
  //           <tr>
  //             <td className="border border-gray-400 px-2 py-1">Calcium</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{data.calcium}mg</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{calciumDV}%</td>
  //           </tr>
  //         )}
          
  //         {hasValue(data.iron) && (
  //           <tr>
  //             <td className="border border-gray-400 px-2 py-1">Iron</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{data.iron}mg</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{ironDV}%</td>
  //           </tr>
  //         )}
          
  //         {hasValue(data.potassium) && (
  //           <tr>
  //             <td className="border border-gray-400 px-2 py-1">Potassium</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{data.potassium}mg</td>
  //             <td className="border border-gray-400 px-2 py-1 text-center">{potassiumDV}%</td>
  //           </tr>
  //         )}
  //       </tbody>
  //     </table>
      
  //     <p className="text-xs mt-2">{labelText.dailyValueFootnote}</p>
  //   </div>
  // );


  // // Modern format with blue gradients and rounded corners
  // const renderModernLabel = () => (
  //   <div className="nutrition-label modern-label rounded-xl overflow-hidden shadow-lg" style={{...bgStyle, ...textStyle}}>
  //     <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
  //       <h2 className="text-2xl font-bold text-center" style={headingStyle}>{labelText.title}</h2>
  //       <p className="text-center font-medium">{data.productName || "Product Name"}</p>
  //       <div className="flex justify-between text-sm mt-2">
  //         <p>Serving size: {data.servingSize || "0"}g</p>
  //         <p>Servings: {data.servingsPerContainer || "0"}</p>
  //       </div>
  //     </div>
      
  //     <div className="bg-white p-4">
  //       <div className="flex justify-between items-center bg-blue-100 p-3 rounded-lg mb-4">
  //         <p className="text-lg font-bold text-blue-800">Calories</p>
  //         <p className="text-3xl font-bold text-blue-800">{data.calories || "0"}</p>
  //       </div>
        
  //       <div className="grid grid-cols-3 gap-2 text-sm">
  //         <div className="col-span-3 flex justify-between border-b-2 border-blue-300 pb-1 mb-2">
  //           <p className="font-bold text-blue-800">Nutrients</p>
  //           <p className="font-bold text-blue-800">Amount</p>
  //           <p className="font-bold text-blue-800">% DV*</p>
  //         </div>
          
  //         <p className="font-semibold">Total Fat</p>
  //         <p className="text-center">{data.totalFat || "0"}g</p>
  //         <p className="text-right">{totalFatDV}%</p>
          
  //         <p className="pl-3 text-sm text-gray-600">Saturated Fat</p>
  //         <p className="text-center text-gray-600">{data.saturatedFat || "0"}g</p>
  //         <p className="text-right text-gray-600">{saturatedFatDV}%</p>
          
  //         <p className="pl-3 text-sm text-gray-600"><i>Trans</i> Fat</p>
  //         <p className="text-center text-gray-600">{data.transFat || "0"}g</p>
  //         <p className="text-right text-gray-600">-</p>
          
  //         <p className="font-semibold">Cholesterol</p>
  //         <p className="text-center">{data.cholesterol || "0"}mg</p>
  //         <p className="text-right">{cholesterolDV}%</p>
          
  //         <p className="font-semibold">Sodium</p>
  //         <p className="text-center">{data.sodium || "0"}mg</p>
  //         <p className="text-right">{sodiumDV}%</p>
          
  //         <p className="font-semibold">Total Carbs</p>
  //         <p className="text-center">{data.totalCarbs || "0"}g</p>
  //         <p className="text-right">{totalCarbsDV}%</p>
          
  //         <p className="pl-3 text-sm text-gray-600">Dietary Fiber</p>
  //         <p className="text-center text-gray-600">{data.dietaryFiber || "0"}g</p>
  //         <p className="text-right text-gray-600">{dietaryFiberDV}%</p>
          
  //         <p className="pl-3 text-sm text-gray-600">Total Sugars</p>
  //         <p className="text-center text-gray-600">{data.totalSugars || "0"}g</p>
  //         <p className="text-right text-gray-600">-</p>
          
  //         <p className="pl-5 text-sm text-gray-600">Added Sugars</p>
  //         <p className="text-center text-gray-600">{data.addedSugars || "0"}g</p>
  //         <p className="text-right text-gray-600">{addedSugarsDV}%</p>
          
  //         <p className="font-semibold">Protein</p>
  //         <p className="text-center">{data.protein || "0"}g</p>
  //         <p className="text-right">-</p>
  //       </div>
        
  //       <div className="mt-4 grid grid-cols-4 gap-2 border-t-2 border-blue-300 pt-2">
  //         <div className="bg-blue-50 rounded p-2 text-center">
  //           <p className="text-xs text-blue-900">Vitamin D</p>
  //           <p className="text-blue-800 font-bold">{vitaminDDV}%</p>
  //         </div>
  //         <div className="bg-blue-50 rounded p-2 text-center">
  //           <p className="text-xs text-blue-900">Calcium</p>
  //           <p className="text-blue-800 font-bold">{calciumDV}%</p>
  //         </div>
  //         <div className="bg-blue-50 rounded p-2 text-center">
  //           <p className="text-xs text-blue-900">Iron</p>
  //           <p className="text-blue-800 font-bold">{ironDV}%</p>
  //         </div>
  //         <div className="bg-blue-50 rounded p-2 text-center">
  //           <p className="text-xs text-blue-900">Potassium</p>
  //           <p className="text-blue-800 font-bold">{potassiumDV}%</p>
  //         </div>
  //       </div>
        
  //       <p className="text-xs text-gray-500 mt-3">* The % Daily Value (DV) tells you how much a nutrient in a serving contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.</p>
  //     </div>
  //   </div>
  // );
  
  // // Gradient format with vibrant colors
  // const renderGradientLabel = () => (
  //   <div className="nutrition-label gradient-label rounded-lg overflow-hidden shadow-lg" style={{...bgStyle, ...textStyle}}>
  //     <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white p-4">
  //       <h2 className="text-2xl font-bold text-center" style={headingStyle}>{labelText.title}</h2>
  //       <p className="text-center text-white">{data.productName || "Product Name"}</p>
  //       <div className="flex justify-between text-sm mt-2 opacity-90">
  //         <p>Serving size: {data.servingSize || "0"}g</p>
  //         <p>Servings: {data.servingsPerContainer || "0"}</p>
  //       </div>
  //     </div>
      
  //     <div className="bg-white p-4">
  //       <div className="flex justify-between items-center bg-gradient-to-r from-orange-400 to-pink-500 text-white p-3 rounded-lg mb-4">
  //         <p className="text-lg font-bold">Calories</p>
  //         <p className="text-3xl font-bold">{data.calories || "0"}</p>
  //       </div>
        
  //       <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
  //         <div className="grid grid-cols-12 gap-y-2 text-sm mb-1">
  //           <p className="col-span-6 font-bold text-purple-800">Nutrient</p>
  //           <p className="col-span-3 text-center font-bold text-purple-800">Amount</p>
  //           <p className="col-span-3 text-right font-bold text-purple-800">% DV*</p>
            
  //           <div className="col-span-12 h-0.5 bg-gradient-to-r from-purple-300 to-pink-300 my-1"></div>
            
  //           <p className="col-span-6 font-semibold text-purple-700">Total Fat</p>
  //           <p className="col-span-3 text-center">{data.totalFat || "0"}g</p>
  //           <p className="col-span-3 text-right font-medium text-pink-600">{totalFatDV}%</p>
            
  //           <p className="col-span-6 pl-3 text-sm text-gray-600">Saturated Fat</p>
  //           <p className="col-span-3 text-center text-gray-600">{data.saturatedFat || "0"}g</p>
  //           <p className="col-span-3 text-right text-gray-600">{saturatedFatDV}%</p>
            
  //           <p className="col-span-6 pl-3 text-sm text-gray-600"><i>Trans</i> Fat</p>
  //           <p className="col-span-3 text-center text-gray-600">{data.transFat || "0"}g</p>
  //           <p className="col-span-3 text-right text-gray-600">-</p>
            
  //           <p className="col-span-6 font-semibold text-purple-700">Cholesterol</p>
  //           <p className="col-span-3 text-center">{data.cholesterol || "0"}mg</p>
  //           <p className="col-span-3 text-right font-medium text-pink-600">{cholesterolDV}%</p>
            
  //           <p className="col-span-6 font-semibold text-purple-700">Sodium</p>
  //           <p className="col-span-3 text-center">{data.sodium || "0"}mg</p>
  //           <p className="col-span-3 text-right font-medium text-pink-600">{sodiumDV}%</p>
            
  //           <p className="col-span-6 font-semibold text-purple-700">Total Carbs</p>
  //           <p className="col-span-3 text-center">{data.totalCarbs || "0"}g</p>
  //           <p className="col-span-3 text-right font-medium text-pink-600">{totalCarbsDV}%</p>
            
  //           <p className="col-span-6 pl-3 text-sm text-gray-600">Dietary Fiber</p>
  //           <p className="col-span-3 text-center text-gray-600">{data.dietaryFiber || "0"}g</p>
  //           <p className="col-span-3 text-right text-gray-600">{dietaryFiberDV}%</p>
            
  //           <p className="col-span-6 pl-3 text-sm text-gray-600">Total Sugars</p>
  //           <p className="col-span-3 text-center text-gray-600">{data.totalSugars || "0"}g</p>
  //           <p className="col-span-3 text-right text-gray-600">-</p>
            
  //           <p className="col-span-6 pl-5 text-sm text-gray-600">Added Sugars</p>
  //           <p className="col-span-3 text-center text-gray-600">{data.addedSugars || "0"}g</p>
  //           <p className="col-span-3 text-right text-gray-600">{addedSugarsDV}%</p>
            
  //           <p className="col-span-6 font-semibold text-purple-700">Protein</p>
  //           <p className="col-span-3 text-center">{data.protein || "0"}g</p>
  //           <p className="col-span-3 text-right font-medium text-pink-600">-</p>
            
  //           <div className="col-span-12 h-0.5 bg-gradient-to-r from-purple-300 to-pink-300 my-1"></div>
  //         </div>
  //       </div>
        
  //       <div className="mt-4 grid grid-cols-4 gap-3">
  //         <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-2 text-center text-white">
  //           <p className="text-xs">Vitamin D</p>
  //           <p className="font-bold">{vitaminDDV}%</p>
  //         </div>
  //         <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-lg p-2 text-center text-white">
  //           <p className="text-xs">Calcium</p>
  //           <p className="font-bold">{calciumDV}%</p>
  //         </div>
  //         <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-2 text-center text-white">
  //           <p className="text-xs">Iron</p>
  //           <p className="font-bold">{ironDV}%</p>
  //         </div>
  //         <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg p-2 text-center text-white">
  //           <p className="text-xs">Potassium</p>
  //           <p className="font-bold">{potassiumDV}%</p>
  //         </div>
  //       </div>
        
  //       <p className="text-xs text-gray-500 mt-3 text-center">* The % Daily Value (DV) tells you how much a nutrient in a serving contributes to a daily diet.</p>
  //     </div>
  //   </div>
  // );
  
  // // Organic format with green color scheme
  // const renderOrganicLabel = () => (
  //   <div className="nutrition-label organic-label rounded-xl overflow-hidden shadow-lg" style={{...bgStyle, ...textStyle}}>
  //     <div className="bg-gradient-to-r from-green-700 to-green-500 text-white p-4">
  //       <div className="flex items-center justify-center gap-2 mb-1">
  //         <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //           <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  //           <path d="M8 12L11 15L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  //         </svg>
  //         <h2 className="text-xl font-bold text-center" style={headingStyle}>{labelText.title === "Nutrition Facts" ? "ORGANIC NUTRITION" : labelText.title}</h2>
  //       </div>
  //       <p className="text-center font-medium text-green-100">{data.productName || "Product Name"}</p>
  //       <div className="flex justify-between text-sm mt-2 text-green-100">
  //         <p>Serving: {data.servingSize || "0"}g</p>
  //         <p>Servings per package: {data.servingsPerContainer || "0"}</p>
  //       </div>
  //     </div>
      
  //     <div className="bg-green-50 p-4 border-l-4 border-r-4 border-green-700">
  //       <div className="flex justify-between items-center bg-white p-3 rounded-lg mb-4 border-2 border-green-500 shadow-inner">
  //         <p className="text-lg font-bold text-green-800">Calories</p>
  //         <p className="text-3xl font-bold text-green-800">{data.calories || "0"}</p>
  //       </div>
        
  //       <div className="bg-white rounded-lg p-4 border border-green-200">
  //         <div className="grid grid-cols-12 gap-y-2 text-sm">
  //           <p className="col-span-6 font-bold text-green-800">Nutrient</p>
  //           <p className="col-span-3 text-center font-bold text-green-800">Amount</p>
  //           <p className="col-span-3 text-right font-bold text-green-800">% DV*</p>
            
  //           <div className="col-span-12 h-0.5 bg-green-200 my-1"></div>
            
  //           <p className="col-span-6 font-semibold text-green-700">Total Fat</p>
  //           <p className="col-span-3 text-center">{data.totalFat || "0"}g</p>
  //           <p className="col-span-3 text-right font-medium text-green-600">{totalFatDV}%</p>
            
  //           <p className="col-span-6 pl-3 text-sm text-gray-600">Saturated Fat</p>
  //           <p className="col-span-3 text-center text-gray-600">{data.saturatedFat || "0"}g</p>
  //           <p className="col-span-3 text-right text-gray-600">{saturatedFatDV}%</p>
            
  //           <p className="col-span-6 pl-3 text-sm text-gray-600"><i>Trans</i> Fat</p>
  //           <p className="col-span-3 text-center text-gray-600">{data.transFat || "0"}g</p>
  //           <p className="col-span-3 text-right text-gray-600">-</p>
            
  //           <p className="col-span-6 font-semibold text-green-700">Cholesterol</p>
  //           <p className="col-span-3 text-center">{data.cholesterol || "0"}mg</p>
  //           <p className="col-span-3 text-right font-medium text-green-600">{cholesterolDV}%</p>
            
  //           <p className="col-span-6 font-semibold text-green-700">Sodium</p>
  //           <p className="col-span-3 text-center">{data.sodium || "0"}mg</p>
  //           <p className="col-span-3 text-right font-medium text-green-600">{sodiumDV}%</p>
            
  //           <p className="col-span-6 font-semibold text-green-700">Total Carbs</p>
  //           <p className="col-span-3 text-center">{data.totalCarbs || "0"}g</p>
  //           <p className="col-span-3 text-right font-medium text-green-600">{totalCarbsDV}%</p>
            
  //           <p className="col-span-6 pl-3 text-sm text-gray-600">Dietary Fiber</p>
  //           <p className="col-span-3 text-center text-gray-600">{data.dietaryFiber || "0"}g</p>
  //           <p className="col-span-3 text-right text-gray-600">{dietaryFiberDV}%</p>
            
  //           <p className="col-span-6 pl-3 text-sm text-gray-600">Total Sugars</p>
  //           <p className="col-span-3 text-center text-gray-600">{data.totalSugars || "0"}g</p>
  //           <p className="col-span-3 text-right text-gray-600">-</p>
            
  //           <p className="col-span-6 pl-5 text-sm text-gray-600">Added Sugars</p>
  //           <p className="col-span-3 text-center text-gray-600">{data.addedSugars || "0"}g</p>
  //           <p className="col-span-3 text-right text-gray-600">{addedSugarsDV}%</p>
            
  //           <p className="col-span-6 font-semibold text-green-700">Protein</p>
  //           <p className="col-span-3 text-center">{data.protein || "0"}g</p>
  //           <p className="col-span-3 text-right font-medium text-green-600">-</p>
            
  //           <div className="col-span-12 h-0.5 bg-green-200 my-1"></div>
  //         </div>
  //       </div>
        
  //       <div className="mt-4 bg-white p-3 rounded-lg border border-green-200">
  //         <p className="text-center text-green-800 font-semibold text-sm mb-2">Essential Nutrients</p>
  //         <div className="grid grid-cols-4 gap-2">
  //           <div className="bg-green-100 rounded p-2 text-center border border-green-300">
  //             <p className="text-xs text-green-800">Vitamin D</p>
  //             <p className="text-green-700 font-bold">{vitaminDDV}%</p>
  //           </div>
  //           <div className="bg-green-100 rounded p-2 text-center border border-green-300">
  //             <p className="text-xs text-green-800">Calcium</p>
  //             <p className="text-green-700 font-bold">{calciumDV}%</p>
  //           </div>
  //           <div className="bg-green-100 rounded p-2 text-center border border-green-300">
  //             <p className="text-xs text-green-800">Iron</p>
  //             <p className="text-green-700 font-bold">{ironDV}%</p>
  //           </div>
  //           <div className="bg-green-100 rounded p-2 text-center border border-green-300">
  //             <p className="text-xs text-green-800">Potassium</p>
  //             <p className="text-green-700 font-bold">{potassiumDV}%</p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
      
  //     <div className="bg-green-700 text-white text-xs p-2 text-center">
  //       <p>* Percent Daily Values are based on a 2,000 calorie diet.</p>
  //       <p className="text-green-200 mt-1 text-[10px]">CERTIFIED ORGANIC • NON-GMO • SUSTAINABLY SOURCED</p>
  //     </div>
  //   </div>
  // );

  // Render the appropriate label based on format
  switch (utils.format) {
    case "horizontal":
      return renderHorizontalLabel();
    case "linear":
      return renderLinearLabel();
    default:
      return renderVerticalLabel();
  }
}