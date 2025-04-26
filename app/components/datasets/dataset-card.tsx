import { chainConfig } from "@/config/chain";
import { marketplaceAbi } from "@/contracts/abi/marketplace";
import useError from "@/hooks/use-error";
import { addressToShortAddress } from "@/lib/converters";
import { Dataset } from "@/mongodb/models/dataset";
import { DatasetType } from "@/types/dataset-type";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import axios from "axios";
import {
  BadgeCheckIcon,
  BracesIcon,
  CalendarIcon,
  CaseUpperIcon,
  DatabaseIcon,
  DollarSignIcon,
  FileJsonIcon,
  ListIcon,
  Loader2Icon,
  ShoppingBagIcon,
  TextIcon,
  UserRoundIcon,
} from "lucide-react";
import { ObjectId } from "mongodb";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  Address,
  createPublicClient,
  createWalletClient,
  custom,
  formatEther,
} from "viem";
import { Button } from "../ui/button";

export function DatasetCard(props: {
  dataset: Dataset;
  onDatasetUpdate: () => void;
}) {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const { handleError } = useError();
  const [isProsessing, setIsProsessing] = useState(false);

  const isUserSeller = props.dataset.sellerId === user?.id;
  const isUserPurchased = props.dataset.sales.find(
    (sale) => sale.buyerId === user?.id
  );

  const types: Record<DatasetType, { image: string; string: string }> = {
    CANDLES: { image: "/images/type-candles.png", string: "Candles" },
    SENTIMENT: { image: "/images/type-sentiment.png", string: "Sentiment" },
  };

  async function handleBuy() {
    try {
      setIsProsessing(true);

      // Check if user is logged in
      if (!user) {
        toast.warning(`Please login`);
        return;
      }

      // Check if user has a wallet connected
      const wallet = wallets[0];
      if (!wallet) {
        toast.warning(`Please login`);
        return;
      }

      // Check if user has a wallet connected to the right chain
      if (
        wallet.chainId.replace("eip155:", "") !==
        chainConfig.chain.id.toString()
      ) {
        toast.warning(`Please connect to ${chainConfig.chain.name}`);
        return;
      }

      // Use contract to buy the dataset
      const provider = await wallet.getEthereumProvider();
      const publicClient = createPublicClient({
        chain: chainConfig.chain,
        transport: custom(provider),
      });
      const walletClient = createWalletClient({
        account: wallet.address as Address,
        chain: chainConfig.chain,
        transport: custom(provider),
      });
      const { request } = await publicClient.simulateContract({
        account: wallet.address as Address,
        address: chainConfig.contracts.marketplace,
        abi: marketplaceAbi,
        functionName: "buy",
        args: [(props.dataset._id as ObjectId).toString()],
        value: BigInt(props.dataset.price),
      });
      const txHash = await walletClient.writeContract(request);

      // Send request to API
      await axios.post("/api/datasets/buy", {
        id: props.dataset._id,
        buyerId: user?.id,
        buyerAddress: user?.wallet?.address,
        txHash: txHash,
      });

      // Update dataset in the state
      props.onDatasetUpdate();

      // Show success message
      toast("Dataset purchased 🎉");
    } catch (error) {
      handleError(error, "Failed to buy the dataset, try again later");
    } finally {
      setIsProsessing(false);
    }
  }

  return (
    <div className="w-full flex flex-row gap-6 border rounded px-6 py-6">
      {/* Left part */}
      <div className="w-36">
        {/* Image */}
        <Image
          src={types[props.dataset.type].image}
          alt="Type"
          priority={false}
          width="100"
          height="100"
          sizes="100vw"
          className="w-full rounded-xl"
        />
      </div>
      {/* Right part */}
      <div className="flex-1">
        {/* Name */}
        <p className="text-xl font-extrabold">{props.dataset.name}</p>
        {/* Params */}
        <div className="flex flex-col gap-4 mt-4">
          {/* Description */}
          <div className="flex flex-row gap-3">
            <div className="flex items-center justify-center size-8 rounded-full bg-primary">
              <TextIcon className="size-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-sm">{props.dataset.description}</p>
            </div>
          </div>
          {/* Created date */}
          <div className="flex flex-row gap-3">
            <div className="flex items-center justify-center size-8 rounded-full bg-primary">
              <CalendarIcon className="size-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="text-sm">
                {new Date(props.dataset.createdDate).toLocaleString()}
              </p>
            </div>
          </div>
          {/* Type */}
          <div className="flex flex-row gap-3">
            <div className="flex items-center justify-center size-8 rounded-full bg-primary">
              <FileJsonIcon className="size-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="text-sm">{types[props.dataset.type].string}</p>
            </div>
          </div>
          {/* Symbol */}
          <div className="flex flex-row gap-3">
            <div className="flex items-center justify-center size-8 rounded-full bg-primary">
              <CaseUpperIcon className="size-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Symbol</p>
              <p className="text-sm">{props.dataset.symbol}</p>
            </div>
          </div>
          {/* Source */}
          <div className="flex flex-row gap-3">
            <div className="flex items-center justify-center size-8 rounded-full bg-primary">
              <DatabaseIcon className="size-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Source</p>
              <p className="text-sm">{props.dataset.source}</p>
            </div>
          </div>
          {/* Price */}
          <div className="flex flex-row gap-3">
            <div className="flex items-center justify-center size-8 rounded-full bg-primary">
              <DollarSignIcon className="size-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-sm">
                {formatEther(BigInt(props.dataset.price))}{" "}
                {chainConfig.chain.nativeCurrency.symbol}
              </p>
            </div>
          </div>
          {/* Seller */}
          <div className="flex flex-row gap-3">
            <div className="flex items-center justify-center size-8 rounded-full bg-primary">
              <UserRoundIcon className="size-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Seller</p>
              <Link
                href={`${chainConfig.chain.blockExplorers?.default.url}/address/${props.dataset.sellerAddress}`}
                target="_blank"
              >
                <p className="text-sm underline underline-offset-4">
                  {addressToShortAddress(props.dataset.sellerAddress)}
                </p>
              </Link>
            </div>
          </div>
          {/* Sales */}
          {isUserSeller && (
            <div className="flex flex-row gap-3">
              <div className="flex items-center justify-center size-8 rounded-full bg-primary">
                <ListIcon className="size-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Sales</p>
                {props.dataset.sales.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {props.dataset.sales.map((sale, index) => (
                      <Link
                        key={index}
                        href={`${chainConfig.chain.blockExplorers?.default.url}/tx/${sale.txHash}`}
                        target="_blank"
                      >
                        <p className="text-sm underline underline-offset-4">
                          {sale.date.toLocaleString()}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm">No sales yet</p>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Actions */}
        <div className="flex flex-row gap-2 mt-8">
          {!isUserPurchased && (
            <Button disabled={isProsessing} onClick={() => handleBuy()}>
              {isProsessing ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <ShoppingBagIcon />
              )}
              Buy
            </Button>
          )}
          {/* Open data icon */}
          {(isUserSeller || isUserPurchased) && (
            <Link href={`/datasets/data/${props.dataset._id}`}>
              <Button variant="outline">
                <BracesIcon /> Open data
              </Button>
            </Link>
          )}
          {isUserPurchased && (
            <Link href={`/datasets/access-credential/${props.dataset._id}`}>
              <Button variant="outline">
                <BadgeCheckIcon /> Open access credential
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
