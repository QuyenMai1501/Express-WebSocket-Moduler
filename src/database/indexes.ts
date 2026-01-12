import { getDb } from "./mongo.js";

export async function ensureIndexes(): Promise<void> {
  const db = getDb();
  
  await db
    .collection("users")
    .createIndex({ email: 1 }, { unique: true });

  await db
    .collection("products")
    .createIndex(
      { title: "text", description: "text" },
      { name: "products_text_search" }
    );

  await db
    .collection("refresh_tokens")
    .createIndex(
      { userId: 1, revokeAt: 1, expiresAt: 1 },
      { name: "rt_user_active" }
    );

  await db
    .collection("chat_messages")
    .createIndex({ createAt: -1 }, { name: "chat_timeline" });
}
