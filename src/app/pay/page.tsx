"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { Button, Card, Shell } from "@/components/ui";
import { saveFlow } from "@/lib/flow-session";
import { getTemplate } from "@/lib/templates";

function PayInner() {
  const router = useRouter();
  const params = useSearchParams();
  const templateId = params.get("template") ?? "orange-booth-duo";
  const template = useMemo(() => getTemplate(templateId), [templateId]);

  if (!template) {
    return (
      <Shell title="Pay">
        <p className="text-sm text-red-400">Unknown template.</p>
      </Shell>
    );
  }

  const unlock = () => {
    // Stripe credits come later — mock unlock for MVP UI wiring.
    saveFlow({ unlocked: true, routeKey: "paid_default" });
    router.push(`/download?template=${templateId}`);
  };

  return (
    <Shell title="Pay">
      <Card>
        <p className="text-2xl font-semibold">${template.retail_usd.toFixed(2)}</p>
        <p className="mt-1 text-sm text-zinc-400">1 clip · full 15s · no watermark · no audio</p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-zinc-500">
          <li>Paid route: Kling Motion Control Std 15s</li>
          <li>Wholesale kill-switch ${template.kill_switch_usd.toFixed(2)}</li>
          <li>Packs later — single clip for v1</li>
        </ul>
      </Card>
      <Button className="w-full" onClick={unlock}>
        Unlock (mock Stripe)
      </Button>
      <Button className="w-full" variant="ghost" onClick={() => router.back()}>
        Back
      </Button>
    </Shell>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={<Shell title="Pay"><p className="text-sm text-zinc-500">Loading…</p></Shell>}>
      <PayInner />
    </Suspense>
  );
}
