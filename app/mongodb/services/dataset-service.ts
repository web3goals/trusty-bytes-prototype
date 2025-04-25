import { mongoDBConfig } from "@/config/mongodb";
import { DatasetSale } from "@/types/dataset-sale";
import { Collection, ObjectId } from "mongodb";
import clientPromise from "../client";
import { Dataset } from "../models/dataset";

export async function findDatasets(params: {
  id?: ObjectId;
  sellerId?: string;
  buyerId?: string;
}): Promise<Dataset[]> {
  const collection = await getCollectionDatasets();
  const datasets = await collection
    .find({
      ...(params.id && { _id: params.id }),
      ...(params.sellerId && { sellerId: params.sellerId }),
      ...(params.buyerId && {
        sales: {
          $elemMatch: {
            buyerId: params.buyerId,
          },
        },
      }),
    })
    .sort({ createdDate: -1 })
    .toArray();
  return datasets;
}

export async function insertDataset(dataset: Dataset): Promise<ObjectId> {
  const collection = await getCollectionDatasets();
  const insertOneResult = await collection.insertOne(dataset);
  return insertOneResult.insertedId;
}

export async function addDatasetSale(id: ObjectId, sale: DatasetSale) {
  const collection = await getCollectionDatasets();
  await collection.updateOne({ _id: id }, { $push: { sales: sale } });
}

async function getCollectionDatasets(): Promise<Collection<Dataset>> {
  const client = await clientPromise;
  const db = client.db(mongoDBConfig.database);
  return db.collection<Dataset>(mongoDBConfig.collectionDatasets);
}
