import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useError from "@/hooks/use-error";
import { getDatasetDataExample } from "@/lib/dataset";
import { DatasetType } from "@/types/dataset-type";
import { ListDatasetRequestData } from "@/types/list-dataset-request-data";
import { BracesIcon, FileJsonIcon, MoveRightIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function ListDatasetDefineTypeSection(props: {
  requestData: ListDatasetRequestData;
  onRequestDataUpdate: (requestData: ListDatasetRequestData) => void;
}) {
  const { handleError } = useError();
  const [isProsessing, setIsProsessing] = useState(false);

  const types: {
    id: DatasetType;
    image: string;
    title: string;
    example: object;
  }[] = [
    {
      id: "CANDLES",
      image: "/images/type-candles.png",
      title: "Candles",
      example: getDatasetDataExample("CANDLES"),
    },
    {
      id: "SENTIMENT",
      image: "/images/type-sentiment.png",
      title: "Sentiment",
      example: getDatasetDataExample("SENTIMENT"),
    },
  ];

  async function handleSubmit(type: DatasetType) {
    try {
      setIsProsessing(true);
      props.onRequestDataUpdate({
        ...props.requestData,
        type: type,
      });
    } catch (error) {
      handleError(error, "Failed to submit the form, try again later");
    } finally {
      setIsProsessing(false);
    }
  }

  return (
    <main className="container mx-auto px-4 lg:px-80 py-16">
      <div className="flex items-center justify-center size-24 rounded-full bg-primary">
        <FileJsonIcon className="size-12 text-primary-foreground" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
        Type
      </h1>
      <p className="text-muted-foreground mt-1">
        What type of dataset do you want to sell?
      </p>
      <Separator className="my-8" />
      <div className="flex flex-col gap-4">
        {types.map((type, index) => (
          <div
            key={index}
            className="w-full flex flex-row gap-6 border rounded px-6 py-6"
          >
            <div className="w-64">
              <Image
                src={type.image}
                alt="Type"
                priority={false}
                width="100"
                height="100"
                sizes="100vw"
                className="w-full rounded-xl"
              />
            </div>
            <div className="flex-1">
              <p className="text-xl font-extrabold">{type.title}</p>
              <div className="flex flex-row gap-3 mt-2">
                <div className="flex items-center justify-center size-10 rounded-full bg-primary">
                  <BracesIcon className="size-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data example</p>
                  <div className="bg-secondary p-4 rounded mt-2">
                    <pre className="text-xs font-mono overflow-auto">
                      {JSON.stringify(type.example, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <Button
                // className="mt-4"
                disabled={isProsessing}
                onClick={() => handleSubmit(type.id)}
              >
                <MoveRightIcon /> Select
              </Button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
