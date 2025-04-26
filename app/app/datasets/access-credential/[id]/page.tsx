"use client";

import { DatasetAccessCredentialSection } from "@/components/datasets/dataset-access-credential-section";
import { LoadingSection } from "@/components/loading-section";
import { LoginSection } from "@/components/login-section";
import { usePrivy } from "@privy-io/react-auth";
import { useParams } from "next/navigation";

export default function DatasetAccessCredentialPage() {
  const { id } = useParams();
  const { ready, authenticated } = usePrivy();

  if (ready && authenticated) {
    return <DatasetAccessCredentialSection id={id as string} />;
  }

  if (ready && !authenticated) {
    return <LoginSection />;
  }

  return <LoadingSection />;
}
