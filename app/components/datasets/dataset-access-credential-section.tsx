import { BadgeCheckIcon } from "lucide-react";
import { LoadingSection } from "../loading-section";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import axios from "axios";
import { Dataset } from "@/mongodb/models/dataset";
import { usePrivy } from "@privy-io/react-auth";
import useError from "@/hooks/use-error";

export function DatasetAccessCredentialSection(props: { id: string }) {
  const { user } = usePrivy();
  const { handleError } = useError();
  const [dataset, setDataset] = useState<Dataset | undefined>();
  const [credential, setCredential] = useState<object | undefined>();

  useEffect(() => {
    axios
      .get("/api/datasets", { params: { id: props.id } })
      .then(({ data }) => setDataset(data.data[0]))
      .catch((error) =>
        handleError(error, "Failed to load dataset, try again later")
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id]);

  useEffect(() => {
    const userSale = dataset?.sales.find((sale) => sale.buyerId === user?.id);
    setCredential(userSale?.accessCredential);
  }, [dataset, user]);

  if (!dataset || !credential) {
    return <LoadingSection />;
  }

  return (
    <main className="container mx-auto px-4 lg:px-80 py-16">
      <div className="flex items-center justify-center size-24 rounded-full bg-primary">
        <BadgeCheckIcon className="size-12 text-primary-foreground" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
        Access credential
      </h1>
      <p className="text-muted-foreground mt-1">{dataset.name}</p>
      <Separator className="my-8" />
      <div className="bg-secondary p-4 rounded mt-2">
        <pre className="text-xs font-mono overflow-auto">
          {JSON.stringify(credential, null, 2)}
        </pre>
      </div>
    </main>
  );
}
