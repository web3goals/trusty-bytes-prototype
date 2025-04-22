import axios from "axios";
import { cheqdConfig } from "../config/cheqd";

export async function listCheqdDids() {
  return axios.get(`${cheqdConfig.apiHost}/did/list`, {
    headers: { "x-api-key": `${cheqdConfig.apiKey}` },
  });
}

export async function createCheqdDid(params: object) {
  return await axios.post(`${cheqdConfig.apiHost}/did/create`, params, {
    headers: { "x-api-key": `${cheqdConfig.apiKey}` },
  });
}

export async function createCheqdResource(params: object) {
  return await axios.post(
    `${cheqdConfig.apiHost}/resource/create/${cheqdConfig.rootDid}`,
    params,
    { headers: { "x-api-key": `${cheqdConfig.apiKey}` } }
  );
}

export async function issueCheqdTrustRegistryAccreditation(
  type: string,
  params: object
) {
  return await axios.post(
    `${cheqdConfig.apiHost}/trust-registry/accreditation/issue?accreditationType=${type}`,
    params,
    { headers: { "x-api-key": `${cheqdConfig.apiKey}` } }
  );
}

export async function issueCheqdCredential(params: object) {
  return await axios.post(`${cheqdConfig.apiHost}/credential/issue`, params, {
    headers: { "x-api-key": `${cheqdConfig.apiKey}` },
  });
}

export async function verifyCheqdCredential(params: object) {
  return await axios.post(`${cheqdConfig.apiHost}/credential/verify`, params);
}

export async function resolveCheqdTrustChain(params: object) {
  return await axios.post(
    `${cheqdConfig.resolveTrustChainApiHost}/tcr/v1/resolve-cheqd`,
    params
  );
}
