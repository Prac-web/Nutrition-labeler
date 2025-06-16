import { db } from "@db";
import { labels, Label } from "@shared/schema";
import { eq } from "drizzle-orm";

// Storage interface for the nutrition label generator
export const storage = {
  // Save a new nutrition label
  async saveLabel(labelData: any): Promise<Label> {
    const [savedLabel] = await db.insert(labels)
      .values({
        name: labelData.productName || "Untitled Label",
        data: JSON.stringify(labelData),
        createdAt: new Date()
      })
      .returning();
    
    return savedLabel;
  },

  // Get a label by its ID
  async getLabelById(id: number): Promise<Label | undefined> {
    const label = await db.query.labels.findFirst({
      where: eq(labels.id, id)
    });
    
    return label;
  },

  // List all saved labels
  async listLabels(): Promise<Label[]> {
    const allLabels = await db.query.labels.findMany({
      orderBy: (labels, { desc }) => [desc(labels.createdAt)]
    });
    
    return allLabels;
  },

  // Delete a label by ID
  async deleteLabel(id: number): Promise<boolean> {
    const result = await db.delete(labels)
      .where(eq(labels.id, id))
      .returning({ id: labels.id });
    
    return result.length > 0;
  }
};
