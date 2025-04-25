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
import { chainConfig } from "@/config/chain";
import useError from "@/hooks/use-error";
import { ListDatasetRequestData } from "@/types/list-dataset-request-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, Loader2Icon, PenIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { parseEther } from "viem";
import { z } from "zod";

export function ListDatasetDefineParamsSection(props: {
  requestData: ListDatasetRequestData;
  onRequestDataUpdate: (requestData: ListDatasetRequestData) => void;
}) {
  const { handleError } = useError();
  const [isProsessing, setIsProsessing] = useState(false);

  const formSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.coerce.number(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0.01,
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsProsessing(true);
      props.onRequestDataUpdate({
        ...props.requestData,
        name: values.name,
        description: values.description,
        price: parseEther(values.price.toString()).toString(),
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
        <PenIcon className="size-12 text-primary-foreground" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
        Parameters
      </h1>
      <p className="text-muted-foreground mt-1">
        Define parameters of the dataset
      </p>
      <Separator className="my-8" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      props.requestData.type === "CANDLES"
                        ? "D, ETH/USDT, Binance"
                        : "D, ETH, X"
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={
                      props.requestData.type === "CANDLES"
                        ? "March ETH/USDT daily OHLCV candles taken from Binance"
                        : "March ETH daily sentiment taken from X"
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
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Price ({chainConfig.chain.nativeCurrency.symbol}) *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="0.01"
                    type="number"
                    step="0.01"
                    disabled={isProsessing}
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
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
            Continue
          </Button>
        </form>
      </Form>
    </main>
  );
}
