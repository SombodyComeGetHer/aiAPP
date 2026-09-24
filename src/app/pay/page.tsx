"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { Button, Card, Shell } from "@/components/ui";
import { appCopy } from "@/lib/copy/app";
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
    saveFlow({ unlocked: true, routeKey: "paid_default" });
    router.push(`/download?template=${templateId}`);
  };

  return (
    <Shell title="Pay">
      <Card>
        <p className="text-2xl font-semibold">${template.retail_usd.toFixed(2)}</p>
        <p className="mt-2 text-sm text-zinc-300">{appCopy.pay.hu}</p>
        <p className="mt-1 text-sm text-zinc-500">{appCopy.pay.en}</p>
      </Card>
      <Button className="w-full" onClick={unlock}>
        {appCopy.pay.cta}
      </Button>
      <Button className="w-full" variant="ghost" onClick={() => router.back()}>
        Back
      </Button>
    </Shell>
  );
}

export default function PayPage() {
  return (
    <Suspense
      fallback={
        <Shell title="Pay">
          <p className="text-sm text-zinc-500">Loading…</p>
        </Shell>
      }
    >
      <PayInner />
    </Suspense>
  );
}
