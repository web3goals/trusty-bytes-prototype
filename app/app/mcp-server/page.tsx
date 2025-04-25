"use client";

import { LoadingSection } from "@/components/loading-section";
import { LoginSection } from "@/components/login-section";
import { McpServerSection } from "@/components/mcp-server/mcp-server-section";
import { usePrivy } from "@privy-io/react-auth";

export default function ListedDatasetsPage() {
  const { ready, authenticated } = usePrivy();

  if (ready && authenticated) {
    return <McpServerSection />;
  }

  if (ready && !authenticated) {
    return <LoginSection />;
  }

  return <LoadingSection />;
}
