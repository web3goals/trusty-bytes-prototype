import useError from "@/hooks/use-error";
import { Dataset } from "@/mongodb/models/dataset";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { ShoppingBagIcon } from "lucide-react";
import { useEffect, useState } from "react";
import EntityList from "../entity-list";
import { Separator } from "../ui/separator";
import { DatasetCard } from "./dataset-card";

export function DatasetsPurchasedSection() {
  const { user } = usePrivy();
  const { handleError } = useError();
  const [datasets, setDatasets] = useState<Dataset[] | undefined>();

  async function loadDatasets() {
    if (user?.id) {
      axios
        .get("/api/datasets", { params: { buyerId: user.id } })
        .then(({ data }) => setDatasets(data.data))
        .catch((error) =>
          handleError(error, "Failed to load datasets, try again later")
        );
    }
  }

  useEffect(() => {
    loadDatasets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <main className="container mx-auto px-4 lg:px-80 py-16">
      <div className="flex items-center justify-center size-24 rounded-full bg-primary">
        <ShoppingBagIcon className="size-12 text-primary-foreground" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
        Purchased datasets
      </h1>
      <p className="text-muted-foreground mt-1">
        Data you can use for your AI agents
      </p>
      <Separator className="my-8" />
      <EntityList<Dataset>
        entities={datasets}
        renderEntityCard={(dataset, index) => (
          <DatasetCard
            key={index}
            dataset={dataset}
            onDatasetUpdate={() => loadDatasets()}
          />
        )}
        noEntitiesText="No datasets purchased yet..."
      />
    </main>
  );
}
