"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Button, Card, Shell } from "@/components/ui";
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
  const template = useMemo(() => getTemplate(templateId), [templateId]);
  const [flow, setFlow] = useState<FlowSession | null>(null);

  useEffect(() => {
    setFlow(loadFlow());
  }, []);

  if (!template) {
    return (
      <Shell title="Preview">
        <p className="text-sm text-red-400">Unknown template.</p>
      </Shell>
    );
  }

  const route = template.routes[routeKey];
  const isTrial = routeKey === "trial" && !flow?.unlocked;
  const seconds = routeDurationSeconds(route, isTrial ? 8 : 15);
  const watermark = isTrial || Boolean(route.watermark);

  return (
    <Shell title="Preview">
      <Card>
        <div className="relative aspect-[9/16] overflow-hidden rounded-xl bg-zinc-800">
          {flow?.photos?.[0] ? (
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
          {watermark ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="rotate-[-24deg] text-3xl font-black uppercase tracking-widest text-white/40">
                Watermark
              </span>
            </div>
          ) : null}
          <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs">
            {isTrial ? `${seconds}s trial · watermark` : `${seconds}s full · no watermark`}
          </div>
        </div>
        <p className="mt-3 text-sm text-zinc-400">Silent playback · add TikTok sound yourself</p>
      </Card>

      {isTrial ? (
        <Link href={`/pay?template=${templateId}`} className="block">
          <Button className="w-full">Unlock full 15s · ${template.retail_usd.toFixed(2)}</Button>
        </Link>
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
    <Suspense fallback={<Shell title="Preview"><p className="text-sm text-zinc-500">Loading…</p></Shell>}>
      <PreviewInner />
    </Suspense>
  );
}
