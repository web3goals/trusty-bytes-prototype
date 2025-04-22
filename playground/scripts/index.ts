/* eslint-disable @typescript-eslint/no-unused-vars */

import * as dotenv from "dotenv";
dotenv.config();

import { cheqdConfig } from "./config/cheqd";
import {
  createCheqdDid,
  createCheqdResource,
  issueCheqdTrustRegistryAccreditation,
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

async function issueTrustRegistryAccreditation() {
  // const type = "authorise";
  // const params = {
  //   issuerDid: cheqdConfig.rootDid,
  //   subjectDid: cheqdConfig.rootDid,
  //   schemas: [
  //     {
  //       url: `https://resolver.cheqd.net/1.0/identifiers/${cheqdConfig.rootDid}?resourceName=AIAgentAuthorisation&resourceType=JSONSchemaValidator2020`,
  //       types: "AIAgentAuthorisation",
  //     },
  //     {
  //       url: `https://resolver.cheqd.net/1.0/identifiers/${cheqdConfig.rootDid}?resourceName=VerifiableAccreditation&resourceType=JSONSchemaValidator2020`,
  //       types: [
  //         "VerifiableCredential",
  //         "VerifiableAccreditation",
  //         "VerifiableAccreditationToAccredit",
  //       ],
  //     },
  //     {
  //       url: `https://resolver.cheqd.net/1.0/identifiers/${cheqdConfig.rootDid}?resourceName=VerifiableAttestation&resourceType=JSONSchemaValidator2020`,
  //       types: [
  //         "VerifiableCredential",
  //         "VerifiableAttestation",
  //         "VerifiableAccreditationToAttest",
  //       ],
  //     },
  //   ],
  //   format: "jwt",
  //   accreditationName: "authoriseAccreditationTest",
  //   trustFramework: "https://learn.cheqd.io/governance/start",
  //   trustFrameworkId: "cheqd Governance Framework",
  // };
  const type = "attest";
  const params = {
    issuerDid: cheqdConfig.rootDid,
    subjectDid: cheqdConfig.rootDid,
    schemas: [
      {
        url: `https://resolver.cheqd.net/1.0/identifiers/${cheqdConfig.rootDid}?resourceName=AIAgentAuthorisation&resourceType=JSONSchemaValidator2020`,
        types: "AIAgentAuthorisation",
      },
      {
        url: `https://resolver.cheqd.net/1.0/identifiers/${cheqdConfig.rootDid}?resourceName=VerifiableAccreditation&resourceType=JSONSchemaValidator2020`,
        types: [
          "VerifiableCredential",
          "VerifiableAccreditation",
          "VerifiableAccreditationToAccredit",
        ],
      },
      {
        url: `https://resolver.cheqd.net/1.0/identifiers/${cheqdConfig.rootDid}?resourceName=VerifiableAttestation&resourceType=JSONSchemaValidator2020`,
        types: [
          "VerifiableCredential",
          "VerifiableAttestation",
          "VerifiableAccreditationToAttest",
        ],
      },
    ],
    format: "jwt",
    accreditationName: "accreditationToAttestTest",
    parentAccreditation: `${cheqdConfig.rootDid}?resourceName=authoriseAccreditationTest&resourceType=VerifiableAuthorisationForTrustChain`,
    rootAuthorization: `${cheqdConfig.rootDid}?resourceName=authoriseAccreditationTest&resourceType=VerifiableAuthorisationForTrustChain`,
  };
  const { data } = await issueCheqdTrustRegistryAccreditation(type, params);
  console.log("Data:", data);
}

async function main() {
  console.log("Starting script...");
}

main().catch((error) => {
  console.error("Error:", error);
  process.exitCode = 1;
});
