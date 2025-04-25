import { DatasetType } from "@/types/dataset-type";

export function getDatasetDataExample(type: DatasetType): object {
  switch (type) {
    case "CANDLES":
      return [
        {
          date: "2025-03-01",
          open: 12.5,
          high: 13.2,
          low: 12.1,
          close: 12.8,
          volume: 450000000,
        },
      ];
    case "SENTIMENT":
      return [
        {
          date: "2025-03-01",
          positive: 60,
          negative: 20,
          neutral: 20,
          volume: 5000,
        },
      ];
    default:
      return {};
  }
}
