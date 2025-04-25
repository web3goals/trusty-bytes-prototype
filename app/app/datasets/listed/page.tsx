"use client";

import { DatasetsListedSection } from "@/components/datasets/datasets-listed-section";
import { LoadingSection } from "@/components/loading-section";
import { LoginSection } from "@/components/login-section";
import { usePrivy } from "@privy-io/react-auth";

export default function ListedDatasetsPage() {
  const { ready, authenticated } = usePrivy();

  if (ready && authenticated) {
    return <DatasetsListedSection />;
  }

  if (ready && !authenticated) {
    return <LoginSection />;
  }

  return <LoadingSection />;
}
