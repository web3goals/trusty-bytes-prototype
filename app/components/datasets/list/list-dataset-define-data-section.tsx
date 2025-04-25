import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import useError from "@/hooks/use-error";
import { getDatasetDataExample } from "@/lib/dataset";
import { Dataset } from "@/mongodb/models/dataset";
import { DatasetType } from "@/types/dataset-type";
import { ListDatasetRequestData } from "@/types/list-dataset-request-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { ArrowRightIcon, BracesIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function ListDatasetDefineDataSection(props: {
  requestData: ListDatasetRequestData;
  onListed: (dataset: Dataset) => void;
}) {
  const { handleError } = useError();
  const [isProsessing, setIsProsessing] = useState(false);
  const { user } = usePrivy();

  const formSchema = z.object({
    symbol: z.string().min(1),
    source: z.string().min(1),
    data: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
      source: "",
      data: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsProsessing(true);

      // Check if user is logged in
      if (!user) {
        toast.warning(`Please login`);
        return;
      }

      // Check if data is valid JSON
      let valuesDataJson;
      try {
        valuesDataJson = JSON.parse(values.data);
      } catch {
        toast.error("Please provide valid JSON data.");
        return;
      }

      // Prepare a request data
      const requestData = { ...props.requestData };
      requestData.sellerId = user.id;
      requestData.sellerAddress = user.wallet?.address;
      requestData.symbol = values.symbol;
      requestData.source = values.source;
      requestData.data = JSON.stringify(valuesDataJson);

      // Send request to list dataset
      const { data } = await axios.post("/api/datasets/list", requestData);
      const dataset: Dataset = data.data;

      props.onListed(dataset);
    } catch (error) {
      handleError(error, "Failed to submit the form, try again later");
    } finally {
      setIsProsessing(false);
    }
  }

  return (
    <main className="container mx-auto px-4 lg:px-80 py-16">
      <div className="flex items-center justify-center size-24 rounded-full bg-primary">
        <BracesIcon className="size-12 text-primary-foreground" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
        Data
      </h1>
      <p className="text-muted-foreground mt-1">
        What data do you want to sell?
      </p>
      <Separator className="my-8" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Symbol *</FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      props.requestData.type === "CANDLES" ? "ethusdt" : "eth"
                    }
                    disabled={isProsessing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source *</FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      props.requestData.type === "CANDLES" ? "binance" : "x"
                    }
                    disabled={isProsessing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="data"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={JSON.stringify(
                      getDatasetDataExample(
                        props.requestData.type as DatasetType
                      ),
                      null,
                      2
                    )}
                    disabled={isProsessing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="default" disabled={isProsessing}>
            {isProsessing ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <ArrowRightIcon />
            )}
            List dataset for sale
          </Button>
        </form>
      </Form>
    </main>
  );
}
