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
