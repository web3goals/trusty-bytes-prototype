import { DatasetType } from "./dataset-type";

export type ListDatasetRequestData = {
  sellerId?: string;
  sellerAddress?: string;
  type?: DatasetType;
  name?: string;
  description?: string;
  price?: string;
  symbol?: string;
  source?: string;
  data?: string;
};
