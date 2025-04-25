import useError from "@/hooks/use-error";
import { Dataset } from "@/mongodb/models/dataset";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { PlusIcon, StoreIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import EntityList from "../entity-list";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { DatasetCard } from "./dataset-card";

export function DatasetsListedSection() {
  const { user } = usePrivy();
  const { handleError } = useError();
  const [datasets, setDatasets] = useState<Dataset[] | undefined>();

  async function loadDatasets() {
    if (user?.id) {
      axios
        .get("/api/datasets", { params: { sellerId: user.id } })
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
        <StoreIcon className="size-12 text-primary-foreground" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
        Datasets listed for sale
      </h1>
      <p className="text-muted-foreground mt-1">
        Data that you want to sell to AI agents
      </p>
      <Separator className="my-8" />
      <Link href="/datasets/list">
        <Button className="mb-8">
          <PlusIcon /> List dataset for sale
        </Button>
      </Link>
      <EntityList<Dataset>
        entities={datasets}
        renderEntityCard={(dataset, index) => (
          <DatasetCard
            key={index}
            dataset={dataset}
            onDatasetUpdate={() => loadDatasets()}
          />
        )}
        noEntitiesText="No datasets listed for sale yet..."
      />
    </main>
  );
}
