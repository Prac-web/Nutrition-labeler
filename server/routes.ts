import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { chromium } from 'playwright';

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the nutrition label generator
  const apiPrefix = "/Nutrition-labeler/api";

  // Health check endpoint
  app.get(`${apiPrefix}/health`, (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });
  app.get(`${apiPrefix}/testing`, (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  // Route to save a label (optional feature)
  app.post(`${apiPrefix}/labels`, async (req: Request, res: Response) => {
    try {
      const labelData = req.body;
      
      // Validate the data
      if (!labelData || Object.keys(labelData).length === 0) {
        return res.status(400).json({ error: "No label data provided" });
      }
      
      // Save the label
      const savedLabel = await storage.saveLabel(labelData);
      
      res.status(201).json(savedLabel);
    } catch (error) {
      console.error("Error saving label:", error);
      res.status(500).json({ error: "Failed to save label" });
    }
  });

  // Route to get a saved label by ID (optional feature)
  app.get(`${apiPrefix}/labels/:id`, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const label = await storage.getLabelById(Number(id));
      
      if (!label) {
        return res.status(404).json({ error: "Label not found" });
      }
      
      res.status(200).json(label);
    } catch (error) {
      console.error("Error retrieving label:", error);
      res.status(500).json({ error: "Failed to retrieve label" });
    }
  });

  app.post(`${apiPrefix}/receive`, async (req: Request, res: Response) => {
    try {
      const { html, width, height } = req.body;

      const browser = await chromium.launch();
      const page = await browser.newPage();

      const parsedWidth = width ? parseInt(width) : 800;
      const parsedHeight = height ? parseInt(height) : 600;

      await page.setViewportSize({
        width: parsedWidth,
        height: parsedHeight,
      });

      await page.setContent(html, { waitUntil: 'networkidle' });

      const pdfBuffer = await page.pdf({
        printBackground: true,
        width: width,   // e.g. "400px"
        height: height, // e.g. "300px"
        pageRanges: '1',
      });

      await browser.close();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="label.pdf"',
        'Content-Length': pdfBuffer.length,
      });
      res.send(pdfBuffer);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'PDF generation failed.' });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
