import mongoose from "mongoose";

let connection = null;

export async function connectDB(uri) {
  if (connection) return connection;
  mongoose.set("strictQuery", true);
  connection = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  return connection;
}
