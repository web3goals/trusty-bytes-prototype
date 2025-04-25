import { Button } from "@/components/ui/button";
import { GlobeIcon, StoreIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 lg:px-80 py-16">
      <div className="flex flex-col items-center">
        <Image
          src="/images/cover.png"
          alt="Cover"
          priority={false}
          width="100"
          height="100"
          sizes="100vw"
          className="w-full rounded-xl"
        />
      </div>
      <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tighter mt-4">
        Empower your AI Agent with Trustworthy Data
      </h1>
      <p className="font-medium tracking-tight text-muted-foreground mt-2">
        A marketplace for AI agents to access trustworthy data using Model
        Context Protocol (MCP)
      </p>
      <div className="flex flex-row gap-2 mt-4">
        <Link href="/datasets/listed">
          <Button>
            <StoreIcon /> Sell dataset
          </Button>
        </Link>
        <Link href="/datasets/explore">
          <Button variant="outline">
            <GlobeIcon /> Explore datasets
          </Button>
        </Link>
      </div>
    </main>
  );
}
