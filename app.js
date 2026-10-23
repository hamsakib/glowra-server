import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/error.js";
import apiRoutes from "./routes/index.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(
    cors({
      origin(origin, callback) {
        // Allow same-origin / server-to-server requests (no Origin header) and listed frontends.
        // Vercel preview deployments of the frontend are allowed by suffix match.
        const allowed =
          !origin ||
          env.clientOrigins.includes(origin) ||
          env.clientOrigins.some((o) => o.startsWith("*.") && origin.endsWith(o.slice(1)));
        callback(null, allowed);
      },
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      maxAge: 86400,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: "100kb" }));
  if (!env.isProd) app.use(morgan("dev"));

  app.get("/", (_req, res) => res.json({ success: true, name: "Glowra API", docs: "/api/health" }));
  app.use("/api", apiRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
