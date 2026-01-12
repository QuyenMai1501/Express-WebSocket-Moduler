import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { ensureIndexes } from "./database/indexes.js";
import { connectMongo } from "./database/mongo.js";
import http from "node:http";
import { attachWsServer } from "./realtime/ws.js";

async function bootstrap() {
  await connectMongo();
  await ensureIndexes();

  const app = createApp();

  const server = http.createServer(app);
  attachWsServer(server);

  server.listen(env.port, "0.0.0.0", () => {
    console.log(`[Server Log] Listening on Port: ${env.port} (${env.nodeEnv})`);
  });
}

bootstrap().catch((err) => {
  console.error("[bootstrap] failed:", err);
  process.exit(1);
});
