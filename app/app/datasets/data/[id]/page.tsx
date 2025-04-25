"use client";

import { DatasetDataSection } from "@/components/datasets/dataset-data-section";
import { LoadingSection } from "@/components/loading-section";
import { LoginSection } from "@/components/login-section";
import { usePrivy } from "@privy-io/react-auth";
import { useParams } from "next/navigation";

export default function DatasetDataPage() {
  const { id } = useParams();
  const { ready, authenticated } = usePrivy();

  if (ready && authenticated) {
    return <DatasetDataSection id={id as string} />;
  }

  if (ready && !authenticated) {
    return <LoginSection />;
  }

  return <LoadingSection />;
}
