"use server";

import { createFailedApiResponse, createSuccessApiResponse } from "@/lib/api";
import { createCheqdDid, issueCheqdAccessCredential } from "@/lib/cheqd";
import { errorToString } from "@/lib/converters";
import {
  addDatasetSale,
  findDatasets,
} from "@/mongodb/services/dataset-service";
import { findDids, insertDid } from "@/mongodb/services/did-service";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { Address, Hash } from "viem";
import { z } from "zod";

const requestBodySchema = z.object({
  id: z.string().min(1),
  buyerId: z.string().min(1),
  buyerAddress: z.string().min(1),
  txHash: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    // Get and parse request data
    const body = await request.json();
    const bodyParseResult = requestBodySchema.safeParse(body);
    if (!bodyParseResult.success) {
      return createFailedApiResponse(
        {
          message: `Request body invalid: ${JSON.stringify(bodyParseResult)}`,
        },
        400
      );
    }

    // Get or create buyer did
    const buyerDids = await findDids({ ownerId: bodyParseResult.data.buyerId });
    let buyerDid: string | undefined;
    if (buyerDids.length > 0) {
      buyerDid = buyerDids[0].value;
    } else {
      buyerDid = await createCheqdDid();
      await insertDid({
        ownerId: bodyParseResult.data.buyerId,
        value: buyerDid,
        createdDate: new Date(),
      });
    }

    // Get and check dataset
    const datasets = await findDatasets({
      id: new ObjectId(bodyParseResult.data.id),
    });
    const dataset = datasets[0];
    if (!dataset) {
      return createFailedApiResponse({ message: "Dataset not found" }, 404);
    }

    // Issue access credential
    const accessCredential = await issueCheqdAccessCredential(
      dataset,
      bodyParseResult.data.buyerAddress as Address,
      buyerDid
    );

    // Add sale to dataset
    await addDatasetSale(new ObjectId(bodyParseResult.data.id), {
      date: new Date(),
      buyerId: bodyParseResult.data.buyerId,
      buyerAddress: bodyParseResult.data.buyerAddress as Address,
      buyerDid: buyerDid,
      accessCredential: accessCredential,
      txHash: bodyParseResult.data.txHash as Hash,
    });

    // Return success response
    return createSuccessApiResponse("Purchased");
  } catch (error) {
    console.error(
      `Failed to process ${request.method} request for "${
        new URL(request.url).pathname
      }":`,
      errorToString(error)
    );
    return createFailedApiResponse(
      { message: "Internal server error, try again later" },
      500
    );
  }
}
