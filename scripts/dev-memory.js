/**
 * Local development without installing MongoDB: starts an in-memory MongoDB,
 * seeds it, then starts the API. Data resets on every restart.
 */
import { MongoMemoryServer } from "mongodb-memory-server";

const mongo = await MongoMemoryServer.create({ instance: { launchTimeout: 60000 } });
process.env.MONGODB_URI = mongo.getUri("glowra");
process.env.JWT_SECRET ||= "local-dev-only-secret-change-me";

const { connectDB } = await import("../config/db.js");
const { seedDatabase } = await import("../seed/seed.js");
await connectDB(process.env.MONGODB_URI);
await seedDatabase({ log: (line) => console.info(`  seeded ${line}`) });

await import("../index.js");

const stop = async () => {
  await mongo.stop();
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
