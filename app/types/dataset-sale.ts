import { Address, Hash } from "viem";

export type DatasetSale = {
  date: Date;
  buyerId: string;
  buyerAddress: Address;
  txHash: Hash;
  accessCredential: object;
};
