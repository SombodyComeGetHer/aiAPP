"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Shell } from "@/components/ui";
import { appCopy } from "@/lib/copy/app";
import { compositeDuoFrame } from "@/lib/composite";
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
  const [status, setStatus] = useState("starting");
  const started = useRef(false);

  useEffect(() => {
    if (!template || started.current) return;
    started.current = true;

    const flow = loadFlow();
    if (!flow.photos) {
      setError(appCopy.empty.missingPhotos);
      return;
    }

    if (routeKey === "trial") {
      const limit = template.routes.trial.daily_limit ?? 1;
      if (flow.trialUsedToday >= limit) {
        setError(`${appCopy.limits.freeUsed} ${appCopy.limits.freeUsedEn}`);
        return;
      }
    }

    const gate = canStartJob(template, routeKey);
    if (!gate.ok) {
      setError(gate.reason);
      return;
    }

    let cancelled = false;
    const tick = window.setInterval(() => {
      setProgress((p) => Math.min(90, p + 4));
    }, 800);

    (async () => {
      try {
        setStatus("compositing");
        const image =
          routeKey === "paid_default"
            ? await compositeDuoFrame(flow.photos![0], flow.photos![1])
            : flow.photos![0];

        setStatus("submitting");
        const submitRes = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateId,
            routeKey,
            image,
          }),
        });
        const submitJson = await submitRes.json();
        if (!submitRes.ok) {
          throw new Error(submitJson.error || "Submit failed");
        }

        const predictionId = submitJson.prediction_id as string;
        setStatus("polling");

        // Poll ~2s
        for (let i = 0; i < 120; i++) {
          if (cancelled) return;
          await new Promise((r) => setTimeout(r, 2000));
          const pollRes = await fetch(`/api/generate/${predictionId}`);
          const pollJson = await pollRes.json();
          if (pollJson.status === "completed" && pollJson.output_url) {
            if (routeKey === "trial") {
              saveFlow({
                trialUsedToday: loadFlow().trialUsedToday + 1,
                lastOutputUrl: pollJson.output_url,
                lastPredictionId: predictionId,
              });
            } else {
              saveFlow({
                lastOutputUrl: pollJson.output_url,
                lastPredictionId: predictionId,
              });
            }
            setProgress(100);
            router.replace(
              `/preview?template=${templateId}&route=${routeKey}&live=1`,
            );
            return;
          }
          if (
            pollRes.status === 422 ||
            ["failed", "cancelled", "timeout", "deleted"].includes(
              pollJson.status,
            )
          ) {
            throw new Error(pollJson.error || `Job ${pollJson.status}`);
          }
          setStatus(pollJson.status || "processing");
        }
        throw new Error("Timed out waiting for WaveSpeed result");
      } catch (err) {
        // Fallback: if key missing, keep mock path for UX testing
        const message = err instanceof Error ? err.message : "Generate failed";
        if (message.includes("WAVESPEED_API_KEY") || message.includes("503")) {
          setStatus("mock-fallback");
          window.setTimeout(() => {
            if (routeKey === "trial") {
              saveFlow({ trialUsedToday: loadFlow().trialUsedToday + 1 });
            }
            router.replace(`/preview?template=${templateId}&route=${routeKey}`);
          }, 1200);
          return;
        }
        setError(message);
      } finally {
        window.clearInterval(tick);
      }
    })();

    return () => {
      cancelled = true;
      window.clearInterval(tick);
    };
  }, [template, routeKey, router, templateId]);

  if (!template) {
    return (
      <Shell title="Generating">
        <p className="text-sm text-red-400">{appCopy.empty.unknownTemplate}</p>
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
          Target length: {seconds}s · audio: off · kill-switch $
          {template.kill_switch_usd.toFixed(2)}
        </p>
        <p className="mt-2 text-xs text-orange-300/80">status: {status}</p>
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
            <p className="mt-2 text-xs text-zinc-500">
              {status === "mock-fallback"
                ? `${appCopy.generating.mockHu} · ${appCopy.generating.mockEn}`
                : `${appCopy.generating.workingHu} · ${appCopy.generating.workingEn}`}
            </p>
          </>
        )}
      </Card>
      {error ? (
        <Button
          className="w-full"
          variant="secondary"
          onClick={() => router.push("/upload")}
        >
          Back to Upload
        </Button>
      ) : null}
    </Shell>
  );
}

export default function GeneratingPage() {
  return (
    <Suspense
      fallback={
        <Shell title="Generating">
          <p className="text-sm text-zinc-500">{appCopy.empty.loading}</p>
        </Shell>
      }
    >
      <GeneratingInner />
    </Suspense>
  );
}
