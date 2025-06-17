var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// db/index.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  insertLabelSchema: () => insertLabelSchema,
  insertUserSchema: () => insertUserSchema,
  labels: () => labels,
  users: () => users,
  usersRelations: () => usersRelations
});
import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var labels = pgTable("labels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertLabelSchema = createInsertSchema(labels).pick({
  name: true,
  data: true
});
var usersRelations = relations(users, ({ many }) => ({
  labels: many(labels)
}));

// db/index.ts
import dotenv from "dotenv";
dotenv.config();
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq } from "drizzle-orm";
var storage = {
  // Save a new nutrition label
  async saveLabel(labelData) {
    const [savedLabel] = await db.insert(labels).values({
      name: labelData.productName || "Untitled Label",
      data: JSON.stringify(labelData),
      createdAt: /* @__PURE__ */ new Date()
    }).returning();
    return savedLabel;
  },
  // Get a label by its ID
  async getLabelById(id) {
    const label = await db.query.labels.findFirst({
      where: eq(labels.id, id)
    });
    return label;
  },
  // List all saved labels
  async listLabels() {
    const allLabels = await db.query.labels.findMany({
      orderBy: (labels2, { desc }) => [desc(labels2.createdAt)]
    });
    return allLabels;
  },
  // Delete a label by ID
  async deleteLabel(id) {
    const result = await db.delete(labels).where(eq(labels.id, id)).returning({ id: labels.id });
    return result.length > 0;
  }
};

// server/routes.ts
import { chromium } from "playwright";
async function registerRoutes(app2) {
  const apiPrefix = "/api";
  app2.get(`${apiPrefix}/health`, (_req, res) => {
    res.status(200).json({ status: "ok" });
  });
  app2.get(`${apiPrefix}/testing`, (_req, res) => {
    res.status(200).json({ status: "ok" });
  });
  app2.post(`${apiPrefix}/labels`, async (req, res) => {
    try {
      const labelData = req.body;
      if (!labelData || Object.keys(labelData).length === 0) {
        return res.status(400).json({ error: "No label data provided" });
      }
      const savedLabel = await storage.saveLabel(labelData);
      res.status(201).json(savedLabel);
    } catch (error) {
      console.error("Error saving label:", error);
      res.status(500).json({ error: "Failed to save label" });
    }
  });
  app2.get(`${apiPrefix}/labels/:id`, async (req, res) => {
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
  app2.post(`${apiPrefix}/receive`, async (req, res) => {
    try {
      const { html, width, height } = req.body;
      const browser = await chromium.launch();
      const page = await browser.newPage();
      const parsedWidth = width ? parseInt(width) : 800;
      const parsedHeight = height ? parseInt(height) : 600;
      await page.setViewportSize({
        width: parsedWidth,
        height: parsedHeight
      });
      await page.setContent(html, { waitUntil: "networkidle" });
      const pdfBuffer = await page.pdf({
        printBackground: true,
        width,
        // e.g. "400px"
        height,
        // e.g. "300px"
        pageRanges: "1"
      });
      await browser.close();
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="label.pdf"',
        "Content-Length": pdfBuffer.length
      });
      res.send(pdfBuffer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "PDF generation failed." });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import dotenv2 from "dotenv";
dotenv2.config();
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@db": path.resolve(import.meta.dirname, "db"),
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true
  },
  base: "/Nutrition-labeler"
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname);
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import bodyParser from "body-parser";
import dotenv3 from "dotenv";
import cors from "cors";
dotenv3.config();
var port = process.env.PORT || 3e3;
var app = express2();
app.use(express2.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express2.urlencoded({ extended: false }));
app.use(cors({ origin: "https://gfxfinder.com" }));
console.log("------------------");
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
})();
