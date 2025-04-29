import { usePrivy } from "@privy-io/react-auth";
import { CloudCogIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { mcpServerConfig } from "@/config/mcp-server";

export function McpServerSection() {
  const { user } = usePrivy();

  const tools = [
    {
      name: "get_datasets",
      description:
        "Get an array of purchased datasets (type, name, description)",
    },
    {
      name: "get_candles",
      description:
        "Get an array of trading candles data (date, open, high, low, close, volume) for the specified symbol and source",
      inputs: [
        {
          name: "symbol",
          type: "string",
          description:
            "Symbol for getting candles, e.g. 'ethusdt', 'trumpusdt'",
        },
        {
          name: "source",
          type: "string",
          description: "Source for getting candles, e.g. 'binance', 'meteora'",
        },
      ],
    },
    {
      name: "get_sentiment",
      description:
        "Get an array of sentiment data (date, positive, negative, neutral, volume) for the specified symbol and source",
      inputs: [
        {
          name: "symbol",
          type: "string",
          description: "Symbol for getting sentiment, e.g. 'eth', 'trump'",
        },
        {
          name: "source",
          type: "string",
          description: "Source for getting sentiment, e.g. 'x', 'warpcast'",
        },
      ],
    },
    {
      name: "get_dataset_issuer",
      description:
        "Get details about organization (DID, Trust Framework, Trust Framework ID) that issued the specified dataset by symbol and source",
      inputs: [
        {
          name: "symbol",
          type: "string",
          description: "Symbol for getting sentiment, e.g. 'eth', 'trump'",
        },
        {
          name: "source",
          type: "string",
          description: "Source for getting sentiment, e.g. 'x', 'warpcast'",
        },
      ],
    },
  ];

  const config = {
    mcpServers: {
      [mcpServerConfig.name]: {
        type: "sse",
        url: `${mcpServerConfig.url}/sse?access_token=${user?.id}`,
      },
    },
  };

  return (
    <main className="container mx-auto px-4 lg:px-80 py-16">
      <div className="flex items-center justify-center size-24 rounded-full bg-primary">
        <CloudCogIcon className="size-12 text-primary-foreground" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
        MCP Server
      </h1>
      <p className="text-muted-foreground mt-1">
        List of tools and configuration for integration
      </p>
      <Separator className="my-8" />
      {/* Tools */}
      <div className="w-full flex flex-col border rounded px-6 py-6">
        <p className="text-xl font-extrabold">Tools</p>
        <Separator className="my-4" />
        <div className="flex flex-col gap-8">
          {tools.map((tool, index) => (
            <div className="flex flex-col gap-4" key={index}>
              <p className="font-extrabold">
                {index + 1}. <span className="text-primary">{tool.name}</span>
              </p>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Description:</p>
                <p className="text-sm">{tool.description}</p>
              </div>
              {tool.inputs && (
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-muted-foreground">Inputs:</p>
                  {tool.inputs?.map((input, index) => (
                    <p key={index} className="text-sm">
                      <span className="text-primary">{input.name}</span>{" "}
                      <span className="text-muted-foreground">
                        {input.type}
                      </span>
                      : {input.description}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Usage */}
      <div className="w-full flex flex-col border rounded px-6 py-6">
        <p className="text-xl font-extrabold">Usage</p>
        <Separator className="my-4" />
        <p className="text-sm">
          Add the following data to your agent configuration
        </p>
        <div className="bg-secondary p-4 rounded mt-2">
          <pre className="text-xs font-mono overflow-auto">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}
