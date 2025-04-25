import { Address, Hash } from "viem";

export type DatasetSale = {
  date: Date;
  buyerId: string;
  buyerAddress: Address;
  buyerDid: string;
  txHash: Hash;
  accessCredential: object;
};
