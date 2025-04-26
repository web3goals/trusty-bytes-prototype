import axios from "axios";
import { cheqdConfig } from "../config/cheqd";

export async function verifyCheqdCredential(
  credential: object
): Promise<{ verified: boolean | undefined; issuer: string | undefined }> {
  const params = { credential: credential };
  const { data } = await axios.post(
    `${cheqdConfig.apiHost}/credential/verify`,
    params
  );
  return {
    verified: data?.verified,
    issuer: data?.issuer,
  };
}

export async function resolveCheqdTrustChain(issuer: string): Promise<{
  trustFramework: string | undefined;
  trustFrameworkId: string | undefined;
}> {
  const params = {
    issuer: issuer,
    type: [
      "VerifiableCredential",
      "VerifiableAttestation",
      "MarketplaceDatasetAccess",
    ],
    termsofuse: "AttestationPolicy",
    parentAccreditation: `${issuer}?resourceName=accreditationToAttestTest&resourceType=VerifiableAccreditationToAttest`,
    credentialSchema: `https://resolver.cheqd.net/1.0/identifiers/${issuer}?resourceName=MarketplaceDatasetAccess&resourceType=JSONSchemaValidator2020`,
  };
  const { data } = await axios.post(
    `${cheqdConfig.resolveTrustChainApiHost}/tcr/v1/resolve-cheqd`,
    params
  );
  return {
    trustFramework: data?.VerificationResult.TrustFramework,
    trustFrameworkId: data?.VerificationResult.TrustFrameworkId,
  };
}
