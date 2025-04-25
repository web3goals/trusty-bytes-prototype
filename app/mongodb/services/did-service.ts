import { mongoDBConfig } from "@/config/mongodb";
import { Collection, ObjectId } from "mongodb";
import clientPromise from "../client";
import { Did } from "../models/did";

export async function findDids(params: {
  id?: ObjectId;
  ownerId?: string;
}): Promise<Did[]> {
  const collection = await getCollectionDids();
  const dids = await collection
    .find({
      ...(params.id && { _id: params.id }),
      ...(params.ownerId && { ownerId: params.ownerId }),
    })
    .sort({ createdDate: -1 })
    .toArray();
  return dids;
}

export async function insertDid(did: Did): Promise<ObjectId> {
  const collection = await getCollectionDids();
  const insertOneResult = await collection.insertOne(did);
  return insertOneResult.insertedId;
}

async function getCollectionDids(): Promise<Collection<Did>> {
  const client = await clientPromise;
  const db = client.db(mongoDBConfig.database);
  return db.collection<Did>(mongoDBConfig.collectionDids);
}
