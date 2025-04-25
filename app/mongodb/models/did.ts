import { ObjectId } from "mongodb";

export class Did {
  constructor(
    public ownerId: string,
    public value: string,
    public createdDate: Date,
    public _id?: ObjectId
  ) {}
}
