// Vercel serverless entry: reuse one Express app and one MongoDB connection per instance.
import { createApp } from "../app.js";
import { connectDB } from "../config/db.js";
import { env } from "../config/env.js";

const app = createApp();

export default async function handler(req, res) {
  await connectDB(env.mongoUri);
  return app(req, res);
}
