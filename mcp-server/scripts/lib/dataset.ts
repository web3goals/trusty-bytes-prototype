import { Dataset } from "../mongodb/models/dataset";
import { findDatasets } from "../mongodb/services/dataset-service";
import { resolveCheqdTrustChain, verifyCheqdCredential } from "./cheqd";
import { logger } from "./logger";

export async function getDatasets(accessToken: string): Promise<Dataset[]> {
  logger.info(`Getting datasets for '${accessToken}'...`);
  const buyerId = accessToken;
  return await findDatasets({
    buyerId: buyerId,
  });
}

export async function getCandles(
  accessToken: string,
  symbol: string,
  source: string
): Promise<object | undefined> {
  logger.info(
    `Getting candles for '${accessToken}', '${symbol}', '${source}'...`
  );
  const buyerId = accessToken;
  const datasets = await findDatasets({
    type: "CANDLES",
    symbol: symbol,
    source: source,
    buyerId: buyerId,
  });
  const dataset = datasets[0];
  return dataset?.data;
}

export async function getSentiment(
  accessToken: string,
  symbol: string,
  source: string
): Promise<object | undefined> {
  logger.info(
    `Getting sentiment for '${accessToken}', '${symbol}', '${source}'...`
  );
  const buyerId = accessToken;
  const datasets = await findDatasets({
    type: "SENTIMENT",
    symbol: symbol,
    source: source,
    buyerId: buyerId,
  });
  const dataset = datasets[0];
  return dataset?.data;
}

export async function getIssuer(
  accessToken: string,
  symbol: string,
  source: string
): Promise<
  | {
      did: string;
      trustNetwork: string;
      trustFramework: string;
      trustFrameworkId: string;
    }
  | undefined
> {
  logger.info(
    `Getting issuer for '${accessToken}', '${symbol}', '${source}'...`
  );
  const buyerId = accessToken;
  // Find dataset
  const datasets = await findDatasets({
    symbol: symbol,
    source: source,
    buyerId: buyerId,
  });
  if (datasets.length === 0) {
    return undefined;
  }
  const dataset = datasets[0];
  // Find buyer's sale
  const buyerSale = dataset.sales.find((sale) => sale.buyerId === buyerId);
  if (!buyerSale) {
    return undefined;
  }
  // Verify access credential
  const { verified, issuer } = await verifyCheqdCredential(
    buyerSale.accessCredential
  );
  if (!verified || !issuer) {
    return undefined;
  }
  // Get trust chain
  const { trustFramework, trustFrameworkId } = await resolveCheqdTrustChain(
    issuer
  );
  if (!trustFramework || !trustFrameworkId) {
    return undefined;
  }

  return {
    did: issuer,
    trustNetwork: "cheqd",
    trustFramework,
    trustFrameworkId,
  };
}
