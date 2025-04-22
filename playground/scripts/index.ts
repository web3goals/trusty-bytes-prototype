/* eslint-disable @typescript-eslint/no-unused-vars */

import * as dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import { cheqdConfig } from "./config/cheqd";

async function listDids() {
  console.log("Listing DIDs...");
  const { data } = await axios.get(`${cheqdConfig.apiHost}/did/list`, {
    headers: { "x-api-key": `${cheqdConfig.apiKey}` },
  });
  console.log("Data:", data);
}

async function createDid() {
  console.log("Creating DID...");
  const { data } = await axios.post(
    `${cheqdConfig.apiHost}/did/create`,
    {
      network: "testnet",
      identifierFormatType: "uuid",
      verificationMethodType: "Ed25519VerificationKey2018",
    },
    { headers: { "x-api-key": `${cheqdConfig.apiKey}` } }
  );
  console.log("Data:", data);
}

async function createDidLinkedResource() {
  console.log("Creating DID linked resource...");
  const { data } = await axios.post(
    `${cheqdConfig.apiHost}/resource/create/${cheqdConfig.rootDid}`,
    {
      data: Buffer.from(
        JSON.stringify(cheqdConfig.aiAgentAuthorisationSchema)
      ).toString("base64"),
      encoding: "base64",
      name: "AIAgentAuthorisation",
      type: "JSONSchemaValidator2020",
    },
    { headers: { "x-api-key": `${cheqdConfig.apiKey}` } }
  );
  console.log("Data:", data);
}

async function getDidLinkedResources() {
  console.log("Getting DID linked resources...");
  const { data } = await axios.get(
    `${cheqdConfig.apiHost}/resource/search/${cheqdConfig.rootDid}`,
    {
      headers: { "x-api-key": `${cheqdConfig.apiKey}` },
    }
  );
  console.log("Data:", data);
}

async function main() {
  console.log("Starting script...");
}

main().catch((error) => {
  console.error("Error:", error);
  process.exitCode = 1;
});
