/* eslint-disable @typescript-eslint/no-unused-vars */

import * as dotenv from "dotenv";
dotenv.config();

import { cheqdConfig } from "./config/cheqd";
import {
  createCheqdDid,
  createCheqdResource,
  issueCheqdCredential,
  issueCheqdTrustRegistryAccreditation,
  listCheqdDids,
  resolveCheqdTrustChain,
  verifyCheqdCredential,
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
  // Params for schema
  const paramsData = cheqdConfig.marketplaceDatasetAccessSchema;
  const paramsDataBase64 = Buffer.from(JSON.stringify(paramsData)).toString(
    "base64"
  );
  const params = {
    data: paramsDataBase64,
    encoding: "base64",
    name: "MarketplaceDatasetAccess",
    type: "JSONSchemaValidator2020",
  };

  // Params for verifiable attestation
  // const paramsData = {
  //   credentialSubject: {
  //     aiAgentName: "ChatGPT-4 Turbo",
  //     aiAgentVersion: "4.0-turbo",
  //     model: "GPT-4 Turbo",
  //     modelVersion: "4.0",
  //     contextWindow: 128000,
  //     temperature: 0.7,
  //     topK: 40,
  //     topP: 0.9,
  //     maxTokens: 4096,
  //     fineTuned: false,
  //     fineTuningDetails: null,
  //     safetyRating: "ISO 42001 Certified",
  //     evaluationMetrics: ["BLEU-4", "ROUGE-L", "F1 Score: 92.5%"],
  //     certificationAuthority: "AI Ethics Board",
  //     validUntil: "2026-03-28T12:00:00Z",
  //     id: "did:cheqd:testnet:7ebbf88c-4840-4d1e-ab89-84e7e17badda",
  //   },
  //   issuer: { id: "did:cheqd:testnet:7ebbf88c-4840-4d1e-ab89-84e7e17badda" },
  //   type: [
  //     "VerifiableCredential",
  //     "VerifiableAttestation",
  //     "AIAgentAuthorisation",
  //   ],
  //   termsOfUse: {
  //     type: "AttestationPolicy",
  //     parentAccreditation:
  //       "did:cheqd:testnet:7ebbf88c-4840-4d1e-ab89-84e7e17badda?resourceName=accreditationToAttestTest&resourceType=VerifiableAccreditationToAttest",
  //     rootAuthorisation:
  //       "did:cheqd:testnet:7ebbf88c-4840-4d1e-ab89-84e7e17badda?resourceName=authoriseAccreditationTest&resourceType=VerifiableAuthorisationForTrustChain",
  //   },
  //   credentialSchema:
  //     "https://resolver.cheqd.net/1.0/identifiers/did:cheqd:testnet:7ebbf88c-4840-4d1e-ab89-84e7e17badda?resourceName=AIAgentAuthorisation&resourceType=JSONSchemaValidator2020",
  //   "@context": ["https://www.w3.org/2018/credentials/v1"],
  //   issuanceDate: "2025-04-22T14:05:52.000Z",
  //   proof: {
  //     type: "JwtProof2020",
  //     jwt: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUF0dGVzdGF0aW9uIiwiQUlBZ2VudEF1dGhvcmlzYXRpb24iXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWlBZ2VudE5hbWUiOiJDaGF0R1BULTQgVHVyYm8iLCJhaUFnZW50VmVyc2lvbiI6IjQuMC10dXJibyIsIm1vZGVsIjoiR1BULTQgVHVyYm8iLCJtb2RlbFZlcnNpb24iOiI0LjAiLCJjb250ZXh0V2luZG93IjoxMjgwMDAsInRlbXBlcmF0dXJlIjowLjcsInRvcEsiOjQwLCJ0b3BQIjowLjksIm1heFRva2VucyI6NDA5NiwiZmluZVR1bmVkIjpmYWxzZSwiZmluZVR1bmluZ0RldGFpbHMiOm51bGwsInNhZmV0eVJhdGluZyI6IklTTyA0MjAwMSBDZXJ0aWZpZWQiLCJldmFsdWF0aW9uTWV0cmljcyI6WyJCTEVVLTQiLCJST1VHRS1MIiwiRjEgU2NvcmU6IDkyLjUlIl0sImNlcnRpZmljYXRpb25BdXRob3JpdHkiOiJBSSBFdGhpY3MgQm9hcmQiLCJ2YWxpZFVudGlsIjoiMjAyNi0wMy0yOFQxMjowMDowMFoifSwidGVybXNPZlVzZSI6eyJ0eXBlIjoiQXR0ZXN0YXRpb25Qb2xpY3kiLCJwYXJlbnRBY2NyZWRpdGF0aW9uIjoiZGlkOmNoZXFkOnRlc3RuZXQ6N2ViYmY4OGMtNDg0MC00ZDFlLWFiODktODRlN2UxN2JhZGRhP3Jlc291cmNlTmFtZT1hY2NyZWRpdGF0aW9uVG9BdHRlc3RUZXN0JnJlc291cmNlVHlwZT1WZXJpZmlhYmxlQWNjcmVkaXRhdGlvblRvQXR0ZXN0Iiwicm9vdEF1dGhvcmlzYXRpb24iOiJkaWQ6Y2hlcWQ6dGVzdG5ldDo3ZWJiZjg4Yy00ODQwLTRkMWUtYWI4OS04NGU3ZTE3YmFkZGE_cmVzb3VyY2VOYW1lPWF1dGhvcmlzZUFjY3JlZGl0YXRpb25UZXN0JnJlc291cmNlVHlwZT1WZXJpZmlhYmxlQXV0aG9yaXNhdGlvbkZvclRydXN0Q2hhaW4ifSwiY3JlZGVudGlhbFNjaGVtYSI6Imh0dHBzOi8vcmVzb2x2ZXIuY2hlcWQubmV0LzEuMC9pZGVudGlmaWVycy9kaWQ6Y2hlcWQ6dGVzdG5ldDo3ZWJiZjg4Yy00ODQwLTRkMWUtYWI4OS04NGU3ZTE3YmFkZGE_cmVzb3VyY2VOYW1lPUFJQWdlbnRBdXRob3Jpc2F0aW9uJnJlc291cmNlVHlwZT1KU09OU2NoZW1hVmFsaWRhdG9yMjAyMCJ9LCJzdWIiOiJkaWQ6Y2hlcWQ6dGVzdG5ldDo3ZWJiZjg4Yy00ODQwLTRkMWUtYWI4OS04NGU3ZTE3YmFkZGEiLCJuYmYiOjE3NDUzMzA3NTIsImlzcyI6ImRpZDpjaGVxZDp0ZXN0bmV0OjdlYmJmODhjLTQ4NDAtNGQxZS1hYjg5LTg0ZTdlMTdiYWRkYSJ9.lL-GD3a06OLWnpP7FEMtyWFL9hZ5PomtNOFxLxwcRnqcjytzOrJIgKnAQ7uf_omvIooLO4g0lXuV1QHWupAbAw",
  //   },
  // };
  // const paramsDataBase64 = Buffer.from(JSON.stringify(paramsData)).toString(
  //   "base64"
  // );
  // const params = {
  //   data: paramsDataBase64,
  //   encoding: "base64",
  //   name: "Attestation",
  //   type: "VerifiableAttestation ",
  // };

  const { data } = await createCheqdResource(params);
  console.log("Data:", data);
}

async function issueTrustRegistryAccreditation() {
  // Params for authorisation
  // const type = "authorise";
  // const params = {
  //   issuerDid: cheqdConfig.rootDid,
  //   subjectDid: cheqdConfig.rootDid,
  //   schemas: [
  //     {
  //       url: `https://resolver.cheqd.net/1.0/identifiers/${cheqdConfig.rootDid}?resourceName=MarketplaceDatasetAccess&resourceType=JSONSchemaValidator2020`,
  //       types: "MarketplaceDatasetAccess",
  //     },
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
  //   trustFramework: "https://trusty-bytes.vercel.app/",
  //   trustFrameworkId: "Trusty Bytes Governance Framework",
  // };

  // Params for attestation
  const type = "attest";
  const params = {
    issuerDid: cheqdConfig.rootDid,
    subjectDid: cheqdConfig.rootDid,
    schemas: [
      {
        url: `https://resolver.cheqd.net/1.0/identifiers/${cheqdConfig.rootDid}?resourceName=MarketplaceDatasetAccess&resourceType=JSONSchemaValidator2020`,
        types: "MarketplaceDatasetAccess",
      },
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

async function issueCredential() {
  // Params for AIAgentAuthorisation
  // const params = {
  //   issuerDid: cheqdConfig.rootDid,
  //   subjectDid: cheqdConfig.agentDid,
  //   attributes: {
  //     aiAgentName: "ChatGPT-4 Turbo",
  //     aiAgentVersion: "4.0-turbo",
  //     model: "GPT-4 Turbo",
  //     modelVersion: "4.0",
  //     contextWindow: 128000,
  //     temperature: 0.7,
  //     topK: 40,
  //     topP: 0.9,
  //     maxTokens: 4096,
  //     fineTuned: false,
  //     fineTuningDetails: null,
  //     safetyRating: "ISO 42001 Certified",
  //     evaluationMetrics: ["BLEU-4", "ROUGE-L", "F1 Score: 92.5%"],
  //     certificationAuthority: "AI Ethics Board",
  //     validUntil: "2026-03-28T12:00:00Z",
  //   },
  //   type: [
  //     "VerifiableCredential",
  //     "VerifiableAttestation",
  //     "AIAgentAuthorisation",
  //   ],
  //   format: "jwt",
  //   credentialSchema: `https://resolver.cheqd.net/1.0/identifiers/${cheqdConfig.rootDid}?resourceName=AIAgentAuthorisation&resourceType=JSONSchemaValidator2020`,
  //   termsOfUse: {
  //     type: "AttestationPolicy",
  //     parentAccreditation: `${cheqdConfig.rootDid}?resourceName=accreditationToAttestTest&resourceType=VerifiableAccreditationToAttest`,
  //     rootAuthorisation: `${cheqdConfig.rootDid}?resourceName=authoriseAccreditationTest&resourceType=VerifiableAuthorisationForTrustChain`,
  //   },
  // };

  // Params for MarketplaceDatasetAccess
  const params = {
    issuerDid: cheqdConfig.rootDid,
    subjectDid: cheqdConfig.agentDid,
    attributes: {
      id: "67fa562c740310aff1619858",
      sellerAddress: "0x4306D7a79265D2cb85Db0c5a55ea5F4f6F73C4B1",
      buyerAddress: "0xC6F40B75095Ec88Fb72671a59bC9F23cb41851EB",
      type: "SENTIMENT",
      name: "D, TRUMP, X",
      description: "March TRUMP daily sentiment data taken from X",
      symbol: "trump",
      source: "x",
    },
    type: [
      "VerifiableCredential",
      "VerifiableAttestation",
      "MarketplaceDatasetAccess",
    ],
    format: "jwt",
    credentialSchema: `https://resolver.cheqd.net/1.0/identifiers/${cheqdConfig.rootDid}?resourceName=MarketplaceDatasetAccess&resourceType=JSONSchemaValidator2020`,
    termsOfUse: {
      type: "AttestationPolicy",
      parentAccreditation: `${cheqdConfig.rootDid}?resourceName=accreditationToAttestTest&resourceType=VerifiableAccreditationToAttest`,
      rootAuthorisation: `${cheqdConfig.rootDid}?resourceName=authoriseAccreditationTest&resourceType=VerifiableAuthorisationForTrustChain`,
    },
  };

  const { data } = await issueCheqdCredential(params);
  console.log("Data:", data);
}

async function verifyCredential() {
  // Params for AIAgentAuthorisation
  // const params = {
  //   credential: {
  //     credentialSubject: {
  //       aiAgentName: "ChatGPT-4 Turbo",
  //       aiAgentVersion: "4.0-turbo",
  //       model: "GPT-4 Turbo",
  //       modelVersion: "4.0",
  //       contextWindow: 128000,
  //       temperature: 0.7,
  //       topK: 40,
  //       topP: 0.9,
  //       maxTokens: 4096,
  //       fineTuned: false,
  //       fineTuningDetails: null,
  //       safetyRating: "ISO 42001 Certified",
  //       evaluationMetrics: ["BLEU-4", "ROUGE-L", "F1 Score: 92.5%"],
  //       certificationAuthority: "AI Ethics Board",
  //       validUntil: "2026-03-28T12:00:00Z",
  //       id: "did:cheqd:testnet:7ebbf88c-4840-4d1e-ab89-84e7e17badda",
  //     },
  //     issuer: {
  //       id: "did:cheqd:testnet:7ebbf88c-4840-4d1e-ab89-84e7e17badda",
  //     },
  //     type: [
  //       "VerifiableCredential",
  //       "VerifiableAttestation",
  //       "AIAgentAuthorisation",
  //     ],
  //     termsOfUse: {
  //       type: "AttestationPolicy",
  //       parentAccreditation:
  //         "did:cheqd:testnet:7ebbf88c-4840-4d1e-ab89-84e7e17badda?resourceName=accreditationToAttestTest&resourceType=VerifiableAccreditationToAttest",
  //       rootAuthorisation:
  //         "did:cheqd:testnet:7ebbf88c-4840-4d1e-ab89-84e7e17badda?resourceName=authoriseAccreditationTest&resourceType=VerifiableAuthorisationForTrustChain",
  //     },
  //     credentialSchema:
  //       "https://resolver.cheqd.net/1.0/identifiers/did:cheqd:testnet:7ebbf88c-4840-4d1e-ab89-84e7e17badda?resourceName=AIAgentAuthorisation&resourceType=JSONSchemaValidator2020",
  //     "@context": ["https://www.w3.org/2018/credentials/v1"],
  //     issuanceDate: "2025-04-22T14:05:52.000Z",
  //     proof: {
  //       type: "JwtProof2020",
  //       jwt: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUF0dGVzdGF0aW9uIiwiQUlBZ2VudEF1dGhvcmlzYXRpb24iXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWlBZ2VudE5hbWUiOiJDaGF0R1BULTQgVHVyYm8iLCJhaUFnZW50VmVyc2lvbiI6IjQuMC10dXJibyIsIm1vZGVsIjoiR1BULTQgVHVyYm8iLCJtb2RlbFZlcnNpb24iOiI0LjAiLCJjb250ZXh0V2luZG93IjoxMjgwMDAsInRlbXBlcmF0dXJlIjowLjcsInRvcEsiOjQwLCJ0b3BQIjowLjksIm1heFRva2VucyI6NDA5NiwiZmluZVR1bmVkIjpmYWxzZSwiZmluZVR1bmluZ0RldGFpbHMiOm51bGwsInNhZmV0eVJhdGluZyI6IklTTyA0MjAwMSBDZXJ0aWZpZWQiLCJldmFsdWF0aW9uTWV0cmljcyI6WyJCTEVVLTQiLCJST1VHRS1MIiwiRjEgU2NvcmU6IDkyLjUlIl0sImNlcnRpZmljYXRpb25BdXRob3JpdHkiOiJBSSBFdGhpY3MgQm9hcmQiLCJ2YWxpZFVudGlsIjoiMjAyNi0wMy0yOFQxMjowMDowMFoifSwidGVybXNPZlVzZSI6eyJ0eXBlIjoiQXR0ZXN0YXRpb25Qb2xpY3kiLCJwYXJlbnRBY2NyZWRpdGF0aW9uIjoiZGlkOmNoZXFkOnRlc3RuZXQ6N2ViYmY4OGMtNDg0MC00ZDFlLWFiODktODRlN2UxN2JhZGRhP3Jlc291cmNlTmFtZT1hY2NyZWRpdGF0aW9uVG9BdHRlc3RUZXN0JnJlc291cmNlVHlwZT1WZXJpZmlhYmxlQWNjcmVkaXRhdGlvblRvQXR0ZXN0Iiwicm9vdEF1dGhvcmlzYXRpb24iOiJkaWQ6Y2hlcWQ6dGVzdG5ldDo3ZWJiZjg4Yy00ODQwLTRkMWUtYWI4OS04NGU3ZTE3YmFkZGE_cmVzb3VyY2VOYW1lPWF1dGhvcmlzZUFjY3JlZGl0YXRpb25UZXN0JnJlc291cmNlVHlwZT1WZXJpZmlhYmxlQXV0aG9yaXNhdGlvbkZvclRydXN0Q2hhaW4ifSwiY3JlZGVudGlhbFNjaGVtYSI6Imh0dHBzOi8vcmVzb2x2ZXIuY2hlcWQubmV0LzEuMC9pZGVudGlmaWVycy9kaWQ6Y2hlcWQ6dGVzdG5ldDo3ZWJiZjg4Yy00ODQwLTRkMWUtYWI4OS04NGU3ZTE3YmFkZGE_cmVzb3VyY2VOYW1lPUFJQWdlbnRBdXRob3Jpc2F0aW9uJnJlc291cmNlVHlwZT1KU09OU2NoZW1hVmFsaWRhdG9yMjAyMCJ9LCJzdWIiOiJkaWQ6Y2hlcWQ6dGVzdG5ldDo3ZWJiZjg4Yy00ODQwLTRkMWUtYWI4OS04NGU3ZTE3YmFkZGEiLCJuYmYiOjE3NDUzMzA3NTIsImlzcyI6ImRpZDpjaGVxZDp0ZXN0bmV0OjdlYmJmODhjLTQ4NDAtNGQxZS1hYjg5LTg0ZTdlMTdiYWRkYSJ9.lL-GD3a06OLWnpP7FEMtyWFL9hZ5PomtNOFxLxwcRnqcjytzOrJIgKnAQ7uf_omvIooLO4g0lXuV1QHWupAbAw",
  //     },
  //   },
  // };

  // Params for MarketplaceDatasetAccess
  const params = {
    credential: {
      credentialSubject: {
        sellerAddress: "0x4306D7a79265D2cb85Db0c5a55ea5F4f6F73C4B1",
        buyerAddress: "0xC6F40B75095Ec88Fb72671a59bC9F23cb41851EB",
        type: "SENTIMENT",
        name: "D, TRUMP, X",
        description: "March TRUMP daily sentiment data taken from X",
        symbol: "trump",
        source: "x",
        id: "67fa562c740310aff1619858",
      },
      issuer: { id: "did:cheqd:testnet:7ebbf88c-4840-4d1e-ab89-84e7e17badda" },
      type: [
        "VerifiableCredential",
        "VerifiableAttestation",
        "MarketplaceDatasetAccess",
      ],
      termsOfUse: {
        type: "AttestationPolicy",
        parentAccreditation:
          "did:cheqd:testnet:7ebbf88c-4840-4d1e-ab89-84e7e17badda?resourceName=accreditationToAttestTest&resourceType=VerifiableAccreditationToAttest",
        rootAuthorisation:
          "did:cheqd:testnet:7ebbf88c-4840-4d1e-ab89-84e7e17badda?resourceName=authoriseAccreditationTest&resourceType=VerifiableAuthorisationForTrustChain",
      },
      credentialSchema:
        "https://resolver.cheqd.net/1.0/identifiers/did:cheqd:testnet:7ebbf88c-4840-4d1e-ab89-84e7e17badda?resourceName=MarketplaceDatasetAccess&resourceType=JSONSchemaValidator2020",
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      issuanceDate: "2025-04-23T15:15:29.000Z",
      proof: {
        type: "JwtProof2020",
        jwt: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUF0dGVzdGF0aW9uIiwiTWFya2V0cGxhY2VEYXRhc2V0QWNjZXNzIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7InNlbGxlckFkZHJlc3MiOiIweDQzMDZEN2E3OTI2NUQyY2I4NURiMGM1YTU1ZWE1RjRmNkY3M0M0QjEiLCJidXllckFkZHJlc3MiOiIweEM2RjQwQjc1MDk1RWM4OEZiNzI2NzFhNTliQzlGMjNjYjQxODUxRUIiLCJ0eXBlIjoiU0VOVElNRU5UIiwibmFtZSI6IkQsIFRSVU1QLCBYIiwiZGVzY3JpcHRpb24iOiJNYXJjaCBUUlVNUCBkYWlseSBzZW50aW1lbnQgZGF0YSB0YWtlbiBmcm9tIFgiLCJzeW1ib2wiOiJ0cnVtcCIsInNvdXJjZSI6IngifSwidGVybXNPZlVzZSI6eyJ0eXBlIjoiQXR0ZXN0YXRpb25Qb2xpY3kiLCJwYXJlbnRBY2NyZWRpdGF0aW9uIjoiZGlkOmNoZXFkOnRlc3RuZXQ6N2ViYmY4OGMtNDg0MC00ZDFlLWFiODktODRlN2UxN2JhZGRhP3Jlc291cmNlTmFtZT1hY2NyZWRpdGF0aW9uVG9BdHRlc3RUZXN0JnJlc291cmNlVHlwZT1WZXJpZmlhYmxlQWNjcmVkaXRhdGlvblRvQXR0ZXN0Iiwicm9vdEF1dGhvcmlzYXRpb24iOiJkaWQ6Y2hlcWQ6dGVzdG5ldDo3ZWJiZjg4Yy00ODQwLTRkMWUtYWI4OS04NGU3ZTE3YmFkZGE_cmVzb3VyY2VOYW1lPWF1dGhvcmlzZUFjY3JlZGl0YXRpb25UZXN0JnJlc291cmNlVHlwZT1WZXJpZmlhYmxlQXV0aG9yaXNhdGlvbkZvclRydXN0Q2hhaW4ifSwiY3JlZGVudGlhbFNjaGVtYSI6Imh0dHBzOi8vcmVzb2x2ZXIuY2hlcWQubmV0LzEuMC9pZGVudGlmaWVycy9kaWQ6Y2hlcWQ6dGVzdG5ldDo3ZWJiZjg4Yy00ODQwLTRkMWUtYWI4OS04NGU3ZTE3YmFkZGE_cmVzb3VyY2VOYW1lPU1hcmtldHBsYWNlRGF0YXNldEFjY2VzcyZyZXNvdXJjZVR5cGU9SlNPTlNjaGVtYVZhbGlkYXRvcjIwMjAifSwic3ViIjoiNjdmYTU2MmM3NDAzMTBhZmYxNjE5ODU4IiwibmJmIjoxNzQ1NDIxMzI5LCJpc3MiOiJkaWQ6Y2hlcWQ6dGVzdG5ldDo3ZWJiZjg4Yy00ODQwLTRkMWUtYWI4OS04NGU3ZTE3YmFkZGEifQ.dJP1m7CXAs0KbkWUpeWzRjXsvtN6rflw7mYwOGAo5LoyCyL1GCTRsi9GhjANOBSjrHiEme42c-mgwlTCDHy4AQ",
      },
    },
  };

  const { data } = await verifyCheqdCredential(params);
  console.log("Data:", data);
}

async function resolveTrustChain() {
  const params = {
    issuer: "did:cheqd:testnet:7ebbf88c-4840-4d1e-ab89-84e7e17badda",
    type: [
      "VerifiableCredential",
      "VerifiableAttestation",
      "AIAgentAuthorisation",
      "MarketplaceDatasetAccess",
    ],
    termsofuse: "AttestationPolicy",
    parentAccreditation:
      "did:cheqd:testnet:7ebbf88c-4840-4d1e-ab89-84e7e17badda?resourceName=accreditationToAttestTest&resourceType=VerifiableAccreditationToAttest",
    credentialSchema:
      "https://resolver.cheqd.net/1.0/identifiers/did:cheqd:testnet:7ebbf88c-4840-4d1e-ab89-84e7e17badda?resourceName=AIAgentAuthorisation&resourceType=JSONSchemaValidator2020",
  };
  const { data } = await resolveCheqdTrustChain(params);
  console.log("Data:", data);
}

async function main() {
  console.log("Starting script...");
}

main().catch((error) => {
  console.error("Error:", error);
  process.exitCode = 1;
});
