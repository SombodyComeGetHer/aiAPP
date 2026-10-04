"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appCopy } from "@/lib/copy/app";

const tabs = [
  { href: "/", label: appCopy.tabs.home },
  { href: "/templates", label: appCopy.tabs.templates },
  { href: "/studios", label: appCopy.tabs.studios },
  { href: "/song", label: appCopy.tabs.song },
] as const;

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 grid grid-cols-4 border-t border-zinc-800 bg-zinc-950">
      {tabs.map((tab) => {
        const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-1 py-3 text-center text-[11px] ${
              active ? "text-orange-400" : "text-zinc-500"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
