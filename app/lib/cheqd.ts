import { cheqdConfig } from "@/config/cheqd";
import { Dataset } from "@/mongodb/models/dataset";
import axios from "axios";
import { Address } from "viem";

export async function createCheqdDid(): Promise<string> {
  const params = {
    network: "testnet",
    identifierFormatType: "uuid",
    verificationMethodType: "Ed25519VerificationKey2018",
  };
  const { data } = await axios.post(
    `${cheqdConfig.apiHost}/did/create`,
    params,
    {
      headers: { "x-api-key": `${cheqdConfig.apiKey}` },
    }
  );
  return data.did;
}

export async function issueCheqdAccessCredential(
  dataset: Dataset,
  buyerAddress: Address,
  buyerDid: string
): Promise<object> {
  const params = {
    issuerDid: cheqdConfig.rootDid,
    subjectDid: buyerDid,
    attributes: {
      id: dataset._id?.toString(),
      sellerAddress: dataset.sellerAddress,
      buyerAddress: buyerAddress,
      type: dataset.type,
      name: dataset.name,
      description: dataset.description,
      symbol: dataset.symbol,
      source: dataset.source,
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
  const { data } = await axios.post(
    `${cheqdConfig.apiHost}/credential/issue`,
    params,
    {
      headers: { "x-api-key": `${cheqdConfig.apiKey}` },
    }
  );
  return data;
}
