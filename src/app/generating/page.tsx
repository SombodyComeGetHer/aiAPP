"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Button, Card, Shell } from "@/components/ui";
import { loadFlow, saveFlow } from "@/lib/flow-session";
import {
  canStartJob,
  getTemplate,
  routeDurationSeconds,
  type RouteKey,
} from "@/lib/templates";

function GeneratingInner() {
  const router = useRouter();
  const params = useSearchParams();
  const templateId = params.get("template") ?? "orange-booth-duo";
  const routeKey = (params.get("route") as RouteKey) || "trial";
  const template = useMemo(() => getTemplate(templateId), [templateId]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    if (!template) return;
    const flow = loadFlow();
    if (!flow.photos) {
      setError("Missing photos. Go back to Upload.");
      return;
    }

    if (routeKey === "trial") {
      const limit = template.routes.trial.daily_limit ?? 2;
      if (flow.trialUsedToday >= limit) {
        setError(`Trial daily limit reached (${limit}/day). Unlock paid instead.`);
        return;
      }
    }

    const gate = canStartJob(template, routeKey);
    if (!gate.ok) {
      setError(gate.reason);
      return;
    }

    const tick = window.setInterval(() => {
      setProgress((p) => Math.min(92, p + 12));
    }, 350);

    const done = window.setTimeout(() => {
      if (routeKey === "trial") {
        saveFlow({ trialUsedToday: loadFlow().trialUsedToday + 1 });
      }
      router.replace(`/preview?template=${templateId}&route=${routeKey}`);
    }, 2200);

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(done);
    };
  }, [template, routeKey, router, templateId]);

  if (!template) {
    return (
      <Shell title="Generating">
        <p className="text-sm text-red-400">Unknown template.</p>
      </Shell>
    );
  }

  const route = template.routes[routeKey];
  const seconds = routeDurationSeconds(route, 8);

  return (
    <Shell title="Generating">
      <Card>
        <p className="text-sm font-medium">{template.name}</p>
        <p className="mt-1 text-xs text-zinc-500">
          {route.provider} · {route.model}
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Target length: {seconds}s · audio: off · kill-switch ${template.kill_switch_usd.toFixed(2)}
        </p>
        {error ? (
          <p className="mt-4 text-sm text-red-400">{error}</p>
        ) : (
          <>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full bg-orange-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-zinc-500">Mock job queue — WaveSpeed call comes later.</p>
          </>
        )}
      </Card>
      {error ? (
        <Button className="w-full" variant="secondary" onClick={() => router.push("/upload")}>
          Back to Upload
        </Button>
      ) : null}
    </Shell>
  );
}

export default function GeneratingPage() {
  return (
    <Suspense fallback={<Shell title="Generating"><p className="text-sm text-zinc-500">Loading…</p></Shell>}>
      <GeneratingInner />
    </Suspense>
  );
}
