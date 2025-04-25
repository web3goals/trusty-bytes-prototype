import { Loader2Icon } from "lucide-react";

export function LoadingSection() {
  return (
    <main className="container mx-auto px-4 lg:px-80 py-16">
      <div className="flex flex-col items-center">
        <Loader2Icon className="animate-spin text-primary" />
      </div>
    </main>
  );
}
