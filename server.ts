import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mock API for Projects
  app.get("/api/projects", (req, res) => {
    res.json([
      {
        id: "1",
        title: "Temeke Culvert Project",
        description: "Modern double cell culvert construction for flood management.",
        image_url: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: "2",
        title: "Residential Foundation",
        description: "High-precision foundation work for luxury residential complexes.",
        image_url: "https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=800",
      }
    ]);
  });

  // Contact Form Submission
  app.post("/api/messages", (req, res) => {
    const { name, phone, details } = req.body;
    console.log("New Message Received:", { name, phone, details });
    // In a real app, this would save to Supabase/PostgreSQL
    res.json({ success: true, message: "Message received successfully" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
