import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileJsonIcon, StoreIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import Confetti from "react-confetti";

export function ListDatasetListedSection() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="container mx-auto px-4 lg:px-80 py-16">
      <div className="flex items-center justify-center size-24 rounded-full bg-primary">
        <FileJsonIcon className="size-12 text-primary-foreground" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
        Dataset is listed for sale!
      </h1>
      <p className="text-muted-foreground mt-1">
        All datasets listed for sale can be found on the sales page
      </p>
      <Separator className="my-8" />
      <Link href="/datasets/listed">
        <Button>
          <StoreIcon /> Go to sales page
        </Button>
      </Link>
      <Confetti
        width={document.body.clientWidth}
        height={document.body.scrollHeight}
        recycle={false}
      />
    </main>
  );
}
