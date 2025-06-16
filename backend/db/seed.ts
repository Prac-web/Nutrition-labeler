import { db } from "./index";
import * as schema from "@shared/schema";

async function seed() {
  try {
    // Seed example labels
    const exampleLabels = [
      {
        name: "Protein Powder",
        data: JSON.stringify({
          productName: "Whey Protein Powder",
          servingSize: "30",
          servingsPerContainer: "30",
          calories: "120",
          totalFat: "2",
          saturatedFat: "1",
          transFat: "0",
          cholesterol: "50",
          sodium: "80",
          totalCarbs: "3",
          dietaryFiber: "0",
          totalSugars: "2",
          addedSugars: "0",
          protein: "24",
          vitaminD: "0",
          calcium: "120",
          iron: "0",
          potassium: "150"
        })
      },
      {
        name: "Multivitamin",
        data: JSON.stringify({
          productName: "Daily Multivitamin",
          servingSize: "1",
          servingsPerContainer: "60",
          calories: "10",
          totalFat: "0",
          saturatedFat: "0",
          transFat: "0",
          cholesterol: "0",
          sodium: "5",
          totalCarbs: "2",
          dietaryFiber: "0",
          totalSugars: "2",
          addedSugars: "2",
          protein: "0",
          vitaminD: "20",
          calcium: "200",
          iron: "18",
          potassium: "80"
        })
      }
    ];

    // Check if we already have labels
    const existingLabels = await db.query.labels.findMany();
    
    if (existingLabels.length === 0) {
      console.log("Seeding example labels...");
      for (const label of exampleLabels) {
        await db.insert(schema.labels).values({
          name: label.name,
          data: label.data,
          createdAt: new Date()
        });
      }
      console.log("Seed data inserted successfully!");
    } else {
      console.log("Labels already exist, skipping seed.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
