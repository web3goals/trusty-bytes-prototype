import * as dotenv from "dotenv";
dotenv.config();

import { logger } from "./lib/logger";

async function main() {
  logger.info("Starting script...");
}

main().catch((error) => {
  logger.error(error);
  process.exitCode = 1;
});
