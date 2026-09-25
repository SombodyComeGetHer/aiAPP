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
        <p className="text-sm text-red-400">{appCopy.empty.unknownTemplate}</p>
      </Shell>
    );
  }

  const unlock = () => {
    // Mock unlock — no Stripe in this MVP
    saveFlow({ unlocked: true, routeKey: "paid_default" });
    router.push(`/download?template=${templateId}`);
  };

  return (
    <Shell title="Pay">
      <Card>
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-orange-500/15 px-2.5 py-1 text-[11px] font-medium text-orange-300">
            {appCopy.pay.freeBadgeHu}
          </span>
          <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-[11px] text-zinc-400">
            {appCopy.pay.freeBadgeEn}
          </span>
        </div>
        <p className="text-3xl font-semibold text-orange-400">
          ${template.retail_usd.toFixed(2)}
        </p>
        <p className="mt-2 text-sm text-zinc-300">{appCopy.pay.hu}</p>
        <p className="mt-1 text-sm text-zinc-500">{appCopy.pay.en}</p>
        <p className="mt-3 text-sm font-medium text-orange-200/90">
          {appCopy.pay.noSubHu}
        </p>
        <p className="mt-0.5 text-sm text-zinc-400">{appCopy.pay.noSubEn}</p>
        <p className="mt-3 text-xs text-zinc-600">
          {appCopy.pay.noStripeNoteHu} · {appCopy.pay.noStripeNoteEn}
        </p>
      </Card>

      <Button className="w-full" onClick={unlock}>
        {appCopy.pay.cta}
      </Button>

      {/* Subscription tiers — Coming soon only, not active CTAs */}
      <Card>
        <p className="mb-3 text-xs uppercase tracking-widest text-zinc-500">
          Plans
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-3">
            <div>
              <p className="text-sm font-medium text-zinc-300">
                {appCopy.pay.starter}
              </p>
              <p className="text-xs text-zinc-600">Subscription</p>
            </div>
            <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-[11px] text-zinc-400">
              {appCopy.pay.comingSoonHu} · {appCopy.pay.comingSoonEn}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-3">
            <div>
              <p className="text-sm font-medium text-zinc-300">
                {appCopy.pay.creator}
              </p>
              <p className="text-xs text-zinc-600">Subscription</p>
            </div>
            <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-[11px] text-zinc-400">
              {appCopy.pay.comingSoonHu} · {appCopy.pay.comingSoonEn}
            </span>
          </div>
        </div>
      </Card>

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
          <p className="text-sm text-zinc-500">{appCopy.empty.loading}</p>
        </Shell>
      }
    >
      <PayInner />
    </Suspense>
  );
}
