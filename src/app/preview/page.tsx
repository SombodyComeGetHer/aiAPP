"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Button, Card, Shell } from "@/components/ui";
import { appCopy } from "@/lib/copy/app";
import { loadFlow, type FlowSession } from "@/lib/flow-session";
import {
  getTemplate,
  routeDurationSeconds,
  type RouteKey,
} from "@/lib/templates";

function PreviewInner() {
  const params = useSearchParams();
  const templateId = params.get("template") ?? "orange-booth-duo";
  const routeKey = (params.get("route") as RouteKey) || "trial";
  const live = params.get("live") === "1";
  const template = useMemo(() => getTemplate(templateId), [templateId]);
  const [flow, setFlow] = useState<FlowSession | null>(null);

  useEffect(() => {
    setFlow(loadFlow());
  }, []);

  if (!template) {
    return (
      <Shell title="Preview">
        <p className="text-sm text-red-400">{appCopy.empty.unknownTemplate}</p>
      </Shell>
    );
  }

  const route = template.routes[routeKey];
  const isFree = routeKey === "trial" && !flow?.unlocked;
  const seconds = routeDurationSeconds(route, isFree ? 8 : 15);
  const videoUrl = live ? flow?.lastOutputUrl : undefined;

  return (
    <Shell title="Preview">
      <Card>
        <div className="relative aspect-[9/16] overflow-hidden rounded-xl bg-zinc-800">
          {videoUrl ? (
            <video
              src={videoUrl}
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              controls
            />
          ) : flow?.photos?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={flow.photos[0]}
              alt="Preview stand-in"
              className="h-full w-full object-cover opacity-80"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">
              Preview placeholder
            </div>
          )}
          <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs">
            {isFree
              ? `${appCopy.preview.freeBadgeHu} · ${appCopy.preview.freeBadgeEn}`
              : `${seconds}s full`}
          </div>
        </div>
        <p className="mt-3 text-sm text-zinc-300">
          {isFree ? appCopy.preview.freeHu : appCopy.preview.paidHu}
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          {isFree ? appCopy.preview.freeEn : appCopy.preview.paidEn}
        </p>
      </Card>

      {isFree ? (
        <>
          <Link href={`/pay?template=${templateId}`} className="block">
            <Button className="w-full">{appCopy.preview.unlock}</Button>
          </Link>
          <Link href={`/download?template=${templateId}`} className="block">
            <Button className="w-full" variant="secondary">
              {appCopy.preview.downloadFree}
            </Button>
          </Link>
        </>
      ) : (
        <Link href={`/download?template=${templateId}`} className="block">
          <Button className="w-full">Continue to download</Button>
        </Link>
      )}
    </Shell>
  );
}

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <Shell title="Preview">
          <p className="text-sm text-zinc-500">{appCopy.empty.loading}</p>
        </Shell>
      }
    >
      <PreviewInner />
    </Suspense>
  );
}
