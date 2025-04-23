const apiHost = "https://studio-api.cheqd.net";
const resolveTrustChainApiHost = "https://dev-train.trust-scheme.de";

const apiKey = process.env.CHEQD_API_KEY;
if (!apiKey) {
  throw new Error("CHEQD_API_KEY is not set in the environment variables.");
}

const rootDid = process.env.CHEQD_ROOT_DID;
if (!rootDid) {
  throw new Error("CHEQD_ROOT_DID is not set in the environment variables.");
}

const agentDid = process.env.CHEQD_ROOT_DID;
if (!agentDid) {
  throw new Error("CHEQD_AGENT_DID is not set in the environment variables.");
}

const verifiableAttestationSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "Verifiable Attestation",
  description:
    "The schema defines a generic structure for any Verifiable Credentials according to the VCDM v1.1",
  type: "object",
  properties: {
    "@context": {
      description:
        "Semantic context for the issued credential. First element MUST be https://www.w3.org/2018/credentials/v1",
      type: "array",
      items: {
        type: "string",
        format: "uri",
      },
      contains: {
        const: "https://www.w3.org/2018/credentials/v1",
      },
      minItems: 1,
      uniqueItems: true,
    },
    id: {
      description: "Globally unique identifier for the issued credential",
      type: "string",
      format: "uri",
    },
    type: {
      description:
        "Full type chain, used to identify the credential base types",
      type: "array",
      items: {
        type: "string",
      },
      contains: {
        type: "string",
        const: "VerifiableAttestation",
      },
      uniqueItems: true,
    },
    issuer: {
      description:
        "Defines a property for expressing the issuer of a Verifiable Credential",
      oneOf: [
        {
          description: "DID of the credential issuer",
          type: "string",
          format: "uri",
        },
        {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              description: "DID of the credential issuer",
              type: "string",
              format: "uri",
            },
          },
        },
      ],
    },
    issuanceDate: {
      description:
        "Defines the date and time, when the issued credential becomes valid",
      type: "string",
      format: "date-time",
    },
    issued: {
      description: "Defines when the issued credential was issued",
      type: "string",
      format: "date-time",
    },
    validFrom: {
      description:
        "Defines the date and time, when the issued credential becomes valid",
      type: "string",
      format: "date-time",
    },
    validUntil: {
      description:
        "Defines the date and time, when the issued credential expires",
      type: "string",
      format: "date-time",
    },
    expirationDate: {
      description:
        "Defines the date and time, when the issued credential expires",
      type: "string",
      format: "date-time",
    },
    credentialSubject: {
      description:
        "Defines information about the subject that is defined by the type chain",
      anyOf: [
        {
          $ref: "#/$defs/credentialSubject",
        },
        {
          type: "array",
          items: {
            $ref: "#/$defs/credentialSubject",
          },
        },
      ],
    },
    credentialStatus: {
      description:
        "Defines suspension and/or revocation details for the issued credential. Further redefined by the type extension",
      anyOf: [
        {
          $ref: "#/$defs/credentialStatus",
        },
        {
          type: "array",
          items: {
            $ref: "#/$defs/credentialStatus",
          },
        },
      ],
    },
    credentialSchema: {
      description:
        "One or more schemas that validate the Verifiable Credential.",
      anyOf: [
        {
          $ref: "#/$defs/credentialSchema",
        },
        {
          type: "array",
          items: {
            $ref: "#/$defs/credentialSchema",
          },
        },
      ],
    },
    termsOfUse: {
      description:
        "Contains the terms under which the issued credential was issued",
      anyOf: [
        {
          $ref: "#/$defs/termsOfUse",
        },
        {
          type: "array",
          items: {
            $ref: "#/$defs/termsOfUse",
          },
        },
      ],
    },
    evidence: {
      description:
        "Contains the optional evidence used to issue this credential",
      anyOf: [
        {
          $ref: "#/$defs/evidence",
        },
        {
          type: "array",
          items: {
            $ref: "#/$defs/evidence",
          },
        },
      ],
    },
  },
  required: ["@context", "id", "type", "issuer", "credentialSubject"],
  $defs: {
    credentialSubject: {
      description:
        "Defines information about the subject that is defined by the type chain",
      type: "object",
      properties: {
        id: {
          description:
            "Defines the DID of the subject that is described by the issued credential",
          type: "string",
          format: "uri",
        },
      },
    },
    credentialStatus: {
      description:
        "Defines suspension and/or revocation details for the issued credential. Further redefined by the type extension",
      type: "object",
      properties: {
        id: {
          description: "Exact identity for the credential status",
          type: "string",
          format: "uri",
        },
        type: {
          description: "Defines the revocation type extension",
          type: "string",
        },
      },
      required: ["id", "type"],
    },
    credentialSchema: {
      description:
        "Contains information about the credential schema on which the issued credential is based",
      type: "object",
      properties: {
        id: {
          description:
            "References the credential schema stored on the Trusted Schemas Registry (TSR) on which the Verifiable Authorisation is based on",
          type: "string",
          format: "uri",
        },
        type: {
          description: "Defines credential schema type",
          type: "string",
        },
      },
      required: ["id", "type"],
    },
    termsOfUse: {
      description:
        "Contains the terms under which the issued credential was issued",
      type: "object",
      properties: {
        id: {
          description:
            "Contains a URL that points to where more information about this instance of terms of use can be found.",
          type: "string",
        },
        type: {
          description: "Defines the type extension",
          type: "string",
        },
      },
      required: ["type"],
    },
    evidence: {
      type: "object",
      properties: {
        id: {
          description:
            "If present, it SHOULD contain a URL that points to where more information about this instance of evidence can be found.",
          type: "string",
        },
        type: {
          anyOf: [
            {
              description: "Defines the evidence type extension",
              type: "string",
            },
            {
              description: "Defines the evidence type extension",
              type: "array",
              items: {
                type: "string",
              },
            },
          ],
        },
      },
      required: ["type"],
    },
  },
};

const verifiableAccreditationSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "Verifiable Accreditation",
  description: "Schema of a Verifiable Accreditation",
  type: "object",
  allOf: [
    {
      $ref: `https://resolver.cheqd.net/1.0/identifiers/${rootDid}?resourceName=VerifiableAttestation&resourceType=JSONSchemaValidator2020`,
    },
    {
      properties: {
        credentialSubject: {
          description:
            "Defines additional information about the subject that is described by the Verifiable Accreditation",
          type: "object",
          properties: {
            id: {
              description:
                "Defines a unique identifier of the Verifiable Accreditation",
              type: "string",
              format: "uri",
            },
            accreditedFor: {
              description:
                "Defines a list of claims that define/determine the authorisation of an Issuer to issue certain types of VCs",
              type: "array",
              items: {
                type: "object",
                properties: {
                  schemaId: {
                    description:
                      "Schema, registered in Trusted  Schemas Registry, which the accredited organisation is allowed to issue, as per their accreditation",
                    type: "string",
                    format: "uri",
                  },
                  types: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  limitJurisdiction: {
                    anyOf: [
                      {
                        description:
                          "Defines the jurisdiction for which the accreditation is valid",
                        type: "string",
                        format: "uri",
                      },
                      {
                        type: "array",
                        description:
                          "Defines the jurisdictions for which the accreditation is valid",
                        items: {
                          type: "string",
                          format: "uri",
                        },
                      },
                    ],
                  },
                },
                required: ["schemaId", "types"],
              },
            },
          },
          required: ["id", "accreditedFor"],
        },
        credentialStatus: {
          description:
            "Defines revocation details for the issued credential. Further redefined by type extension",
          type: "object",
          properties: {
            id: {
              description: "Exact identity for the credential status",
              type: "string",
              format: "uri",
            },
            type: {
              description: "Defines the revocation status type",
              type: "string",
              const: "EbsiAccreditationEntry",
            },
          },
          required: ["id", "type"],
        },
      },
      required: ["credentialSubject", "termsOfUse"],
    },
  ],
};

const aiAgentAuthorisationSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  type: "object",
  allOf: [
    {
      $ref: `https://resolver.cheqd.net/1.0/identifiers/${rootDid}?resourceName=VerifiableAttestation&resourceType=JSONSchemaValidator2020`,
    },
    {
      properties: {
        credentialSubject: {
          type: "object",
          properties: {
            id: {
              type: "string",
              pattern: "uri",
            },
            aiAgentName: {
              type: "string",
            },
            aiAgentVersion: {
              type: "string",
            },
            model: {
              type: "string",
            },
            modelVersion: {
              type: "string",
            },
            contextWindow: {
              type: "integer",
              minimum: 0,
            },
            temperature: {
              type: "number",
              minimum: 0,
              maximum: 1,
            },
            topK: {
              type: "integer",
              minimum: 0,
            },
            topP: {
              type: "number",
              minimum: 0,
              maximum: 1,
            },
            maxTokens: {
              type: "integer",
              minimum: 0,
            },
            fineTuned: {
              type: "boolean",
            },
            fineTuningDetails: {
              type: "string",
              nullable: true,
            },
            safetyRating: {
              type: "string",
            },
            evaluationMetrics: {
              type: "array",
              items: {
                type: "string",
              },
            },
            certificationAuthority: {
              type: "string",
            },
            validUntil: {
              type: "string",
              format: "date-time",
            },
          },
          required: ["id", "aiAgentName", "model"],
        },
        proof: {
          description: "Contains information about the proof",
          type: "object",
          properties: {
            type: {
              description: "Defines the proof type",
              type: "string",
            },
            proofPurpose: {
              description: "Defines the purpose of the proof",
              type: "string",
            },
            created: {
              description:
                "Defines the date and time, when the proof has been created",
              type: "string",
              format: "date-time",
            },
            verificationMethod: {
              description:
                "Contains information about the verification method / proof mechanisms",
              type: "string",
            },
            jws: {
              description: "Defines the proof value in JWS format",
              type: "string",
            },
          },
          required: [
            "type",
            "proofPurpose",
            "created",
            "verificationMethod",
            "jws",
          ],
        },
      },
      required: ["credentialSubject", "proof"],
    },
  ],
};

const marketplaceDatasetAccessSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "Marketplace Dataset Access Verifiable Credential Schema",
  description: "Schema for a Marketplace Dataset Access",
  type: "object",
  allOf: [
    {
      $ref: `https://resolver.cheqd.net/1.0/identifiers/${rootDid}?resourceName=VerifiableAttestation&resourceType=JSONSchemaValidator2020`,
    },
    {
      properties: {
        credentialSubject: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            sellerAddress: {
              type: "string",
            },
            buyerAddress: {
              type: "string",
            },
            type: {
              type: "string",
            },
            name: {
              type: "string",
            },
            description: {
              type: "string",
            },
            symbol: {
              type: "string",
            },
            source: {
              type: "string",
            },
          },
          required: [
            "id",
            "sellerAddress",
            "buyerAddress",
            "type",
            "name",
            "description",
            "symbol",
            "source",
          ],
        },
        proof: {
          description: "Contains information about the proof",
          type: "object",
          properties: {
            type: {
              description: "Defines the proof type",
              type: "string",
            },
            proofPurpose: {
              description: "Defines the purpose of the proof",
              type: "string",
            },
            created: {
              description:
                "Defines the date and time, when the proof has been created",
              type: "string",
              format: "date-time",
            },
            verificationMethod: {
              description:
                "Contains information about the verification method / proof mechanisms",
              type: "string",
            },
            jws: {
              description: "Defines the proof value in JWS format",
              type: "string",
            },
          },
          required: [
            "type",
            "proofPurpose",
            "created",
            "verificationMethod",
            "jws",
          ],
        },
      },
      required: ["credentialSubject", "proof"],
    },
  ],
};

export const cheqdConfig = {
  apiHost,
  resolveTrustChainApiHost,
  apiKey,
  rootDid,
  agentDid,
  verifiableAttestationSchema,
  verifiableAccreditationSchema,
  aiAgentAuthorisationSchema,
  marketplaceDatasetAccessSchema,
};
