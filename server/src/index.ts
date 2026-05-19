import { app } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";

const startServer = async (): Promise<void> => {
  await connectDb();
  app.listen(env.PORT, () => {
    console.log(`API running on http://localhost:${env.PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
