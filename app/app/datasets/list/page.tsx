"use client";

import { ListDatasetSection } from "@/components/datasets/list/list-dataset-section";
import { LoadingSection } from "@/components/loading-section";
import { LoginSection } from "@/components/login-section";
import { usePrivy } from "@privy-io/react-auth";

export default function ListDatasetPage() {
  const { ready, authenticated } = usePrivy();

  if (ready && authenticated) {
    return <ListDatasetSection />;
  }

  if (ready && !authenticated) {
    return <LoginSection />;
  }

  return <LoadingSection />;
}
