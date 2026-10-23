import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

await connectDB(env.mongoUri);

const app = createApp();
app.listen(env.port, () => {
  if (!env.isProd) console.info(`Glowra API listening on http://localhost:${env.port}`);
});
