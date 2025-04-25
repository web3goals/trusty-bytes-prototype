import { DatasetSale } from "@/types/dataset-sale";
import { DatasetType } from "@/types/dataset-type";
import { ObjectId } from "mongodb";
import { Address } from "viem";

export class Dataset {
  constructor(
    public sellerId: string,
    public sellerAddress: Address,
    public createdDate: Date,
    public type: DatasetType,
    public name: string,
    public description: string,
    public price: string,
    public symbol: string,
    public source: string,
    public data: object,
    public sales: DatasetSale[],
    public _id?: ObjectId
  ) {}
}
