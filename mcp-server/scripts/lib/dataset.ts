import { Dataset } from "../mongodb/models/dataset";
import { findDatasets } from "../mongodb/services/dataset-service";
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
