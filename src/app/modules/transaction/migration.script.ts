// src/modules/transaction/migration.script.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Transaction } from "./transaction.model";

dotenv.config(); // Load .env

async function migrate() {
  const mongoUri = process.env.DATABASE_URL;
  if (!mongoUri) {
    console.error("DATABASE_URL not found in .env");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");

  // Fix old cash-in transactions
  const cashInResult = await Transaction.updateMany(
    { type: "send", agent: { $ne: null } }, // condition to identify cash-in
    { $set: { type: "cash-in" } }
  );
  console.log("Updated cash-in transactions:", cashInResult.modifiedCount);

  // Fix old cash-out transactions
  const cashOutResult = await Transaction.updateMany(
    { type: "send", from: { $exists: true }, agent: { $ne: null } }, // condition to identify cash-out
    { $set: { type: "cash-out" } }
  );
  console.log("Updated cash-out transactions:", cashOutResult.modifiedCount);

  await mongoose.disconnect();
  console.log("Migration completed!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
