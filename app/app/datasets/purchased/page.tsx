"use client";

import { DatasetsPurchasedSection } from "@/components/datasets/datasets-purchased-section";
import { LoadingSection } from "@/components/loading-section";
import { LoginSection } from "@/components/login-section";
import { usePrivy } from "@privy-io/react-auth";

export default function PurchasedDatasetsPage() {
  const { ready, authenticated } = usePrivy();

  if (ready && authenticated) {
    return <DatasetsPurchasedSection />;
  }

  if (ready && !authenticated) {
    return <LoginSection />;
  }

  return <LoadingSection />;
}
