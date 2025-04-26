import * as dotenv from "dotenv";
dotenv.config();

import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express, { Request, Response } from "express";
import { logger } from "./lib/logger";
import { createServer } from "./lib/server";

async function main() {
  logger.info("Starting MCP server...");

  const app = express();
  const sessions: {
    [sessionId: string]: {
      transport: SSEServerTransport;
      accessToken?: string;
    };
  } = {};
  const server = createServer({
    getSessionAccessToken: (sessionId: string) =>
      sessions[sessionId].accessToken,
  });

  app.get("/sse", async (req: Request, res: Response) => {
    logger.info("Processing GET SSE request...");
    const reqParams = new URLSearchParams(
      decodeURIComponent(req.url.split("?")[1])
    );
    const accessToken = reqParams.get("access_token");
    const transport = new SSEServerTransport("/messages", res);
    sessions[transport.sessionId] = {
      transport: transport,
      accessToken: accessToken || undefined,
    };
    res.on("close", () => {
      delete sessions[transport.sessionId];
    });
    await server.connect(transport);
  });

  app.post("/messages", async (req: Request, res: Response) => {
    logger.info("Processing POST message request...");
    const sessionId = req.query.sessionId as string;
    const session = sessions[sessionId];
    if (session.transport) {
      await session.transport.handlePostMessage(req, res);
    } else {
      res.status(400).send("No transport found for sessionId");
    }
  });

  app.listen(3001);
}

main().catch((error) => {
  logger.error(error);
  process.exitCode = 1;
});
