"use client";

import { siteConfig } from "@/config/site";
import { privyUserToDisplayName } from "@/lib/converters";
import { usePrivy } from "@privy-io/react-auth";
import {
  CloudCogIcon,
  GithubIcon,
  GlobeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  ShoppingBagIcon,
  StoreIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function SiteHeader() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  return (
    <header className="sticky top-0 z-40 bg-card border-b">
      <div className="container mx-auto px-4 flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        {/* Left part */}
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex flex-col items-center size-9">
              <Image
                src="/images/icon.png"
                alt="Icon"
                priority={false}
                width="100"
                height="100"
                sizes="100vw"
                className="w-full rounded-xl"
              />
            </div>
            <span className="text-foreground font-bold">{siteConfig.name}</span>
          </Link>
        </div>
        {/* Right part */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="text-sm font-medium text-muted-foreground"
              asChild
            >
              <Button variant="ghost" size="icon">
                <MenuIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {ready && !authenticated && (
                <DropdownMenuItem onClick={() => login()}>
                  <LogInIcon />
                  <span>Login</span>
                </DropdownMenuItem>
              )}
              {ready && authenticated && (
                <>
                  <Link href="/datasets/listed">
                    <DropdownMenuItem>
                      <StoreIcon />
                      <span>Listed datasets</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/datasets/purchased">
                    <DropdownMenuItem>
                      <ShoppingBagIcon />
                      <span>Purchased datasets</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/datasets/explore">
                    <DropdownMenuItem>
                      <GlobeIcon />
                      <span>Explore datasets</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/mcp-server">
                    <DropdownMenuItem>
                      <CloudCogIcon />
                      <span>MCP Server</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOutIcon />
                    <span>
                      Logout{" "}
                      <p className="text-xs text-muted-foreground">
                        {privyUserToDisplayName(user)}
                      </p>
                    </span>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <Link href={siteConfig.links.github} target="_blank">
                <DropdownMenuItem>
                  <GithubIcon />
                  <span>GitHub</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
