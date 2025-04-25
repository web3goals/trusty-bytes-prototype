const apiHost = "https://studio-api.cheqd.net";

const apiKey = process.env.CHEQD_API_KEY;
if (!apiKey) {
  throw new Error("CHEQD_API_KEY is not set in the environment variables.");
}

const rootDid = process.env.CHEQD_ROOT_DID;
if (!rootDid) {
  throw new Error("CHEQD_ROOT_DID is not set in the environment variables.");
}

export const cheqdConfig = {
  apiHost,
  apiKey,
  rootDid,
};
