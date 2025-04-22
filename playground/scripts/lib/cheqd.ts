import axios from "axios";
import { cheqdConfig } from "../config/cheqd";

export async function listDids() {
  return axios.get(`${cheqdConfig.apiHost}/did/list`, {
    headers: { "x-api-key": `${cheqdConfig.apiKey}` },
  });
}

export async function createDid(params: object) {
  return await axios.post(`${cheqdConfig.apiHost}/did/create`, params, {
    headers: { "x-api-key": `${cheqdConfig.apiKey}` },
  });
}

export async function createDidLinkedResource(params: object) {
  return await axios.post(
    `${cheqdConfig.apiHost}/resource/create/${cheqdConfig.rootDid}`,
    params,
    { headers: { "x-api-key": `${cheqdConfig.apiKey}` } }
  );
}
