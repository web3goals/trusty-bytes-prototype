"use client";

import { DatasetsExploreSection } from "@/components/datasets/datasets-explore-section";
import { LoadingSection } from "@/components/loading-section";
import { LoginSection } from "@/components/login-section";
import { usePrivy } from "@privy-io/react-auth";

export default function ExploreDatasetsPage() {
  const { ready, authenticated } = usePrivy();

  if (ready && authenticated) {
    return <DatasetsExploreSection />;
  }

  if (ready && !authenticated) {
    return <LoginSection />;
  }

  return <LoadingSection />;
}
