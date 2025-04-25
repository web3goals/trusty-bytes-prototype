import useError from "@/hooks/use-error";
import { Dataset } from "@/mongodb/models/dataset";
import axios from "axios";
import { BracesIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingSection } from "../loading-section";
import { Separator } from "../ui/separator";

export function DatasetDataSection(props: { id: string }) {
  const { handleError } = useError();
  const [dataset, setDataset] = useState<Dataset | undefined>();

  useEffect(() => {
    axios
      .get("/api/datasets", { params: { id: props.id } })
      .then(({ data }) => setDataset(data.data[0]))
      .catch((error) =>
        handleError(error, "Failed to load dataset, try again later")
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id]);

  if (!dataset) {
    return <LoadingSection />;
  }

  return (
    <main className="container mx-auto px-4 lg:px-80 py-16">
      <div className="flex items-center justify-center size-24 rounded-full bg-primary">
        <BracesIcon className="size-12 text-primary-foreground" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
        {dataset.name}
      </h1>
      <p className="text-muted-foreground mt-1">{dataset.description}</p>
      <Separator className="my-8" />
      <div className="bg-secondary p-4 rounded mt-2">
        <pre className="text-xs font-mono overflow-auto">
          {JSON.stringify(dataset.data, null, 2)}
        </pre>
      </div>
    </main>
  );
}
