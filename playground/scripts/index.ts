/* eslint-disable @typescript-eslint/no-unused-vars */

import * as dotenv from "dotenv";
dotenv.config();

import { cheqdConfig } from "./config/cheqd";
import {
  createCheqdDid,
  createCheqdResource,
  listCheqdDids,
} from "./lib/cheqd";

async function listDids() {
  const { data } = await listCheqdDids();
  console.log("Data:", data);
}

async function createDid() {
  const params = {
    network: "testnet",
    identifierFormatType: "uuid",
    verificationMethodType: "Ed25519VerificationKey2018",
  };
  const { data } = await createCheqdDid(params);
  console.log("Data:", data);
}

async function createResource() {
  const params = {
    data: Buffer.from(
      JSON.stringify(cheqdConfig.aiAgentAuthorisationSchema)
    ).toString("base64"),
    encoding: "base64",
    name: "AIAgentAuthorisation",
    type: "JSONSchemaValidator2020",
  };
  const { data } = await createCheqdResource(params);
  console.log("Data:", data);
}

async function main() {
  console.log("Starting script...");
}

main().catch((error) => {
  console.error("Error:", error);
  process.exitCode = 1;
});
