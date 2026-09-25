"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Button, Card, Shell } from "@/components/ui";
import { appCopy } from "@/lib/copy/app";
import { saveFlow } from "@/lib/flow-session";
import { getTemplate } from "@/lib/templates";

function UploadInner() {
  const router = useRouter();
  const params = useSearchParams();
  const templateId = params.get("template") ?? "orange-booth-duo";
  const mode = params.get("mode");
  const template = useMemo(() => getTemplate(templateId), [templateId]);
  const [photos, setPhotos] = useState<[string | null, string | null]>([null, null]);

  if (!template) {
    return (
      <Shell title="Upload">
        <p className="text-sm text-red-400">{appCopy.empty.unknownTemplate}</p>
      </Shell>
    );
  }

  const onFile = (index: 0 | 1, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotos((prev) => {
        const next: [string | null, string | null] = [...prev];
        next[index] = String(reader.result);
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const ready = Boolean(photos[0] && photos[1]);

  const start = (routeKey: "trial" | "paid_default") => {
    if (!photos[0] || !photos[1]) return;
    saveFlow({
      templateId,
      photos: [photos[0], photos[1]],
      routeKey,
      unlocked: routeKey === "paid_default",
    });
    router.push(`/generating?template=${templateId}&route=${routeKey}`);
  };

  const isMismatch = mode === "mismatch";

  return (
    <Shell title="Upload">
      <Card>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-orange-500/15 px-2.5 py-1 text-[11px] font-medium text-orange-300">
            {appCopy.upload.freeBadgeHu}
          </span>
          <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-[11px] text-zinc-400">
            {appCopy.upload.freeBadgeEn}
          </span>
          {isMismatch ? (
            <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-[11px] text-orange-200">
              Mismatch
            </span>
          ) : null}
        </div>
        <p className="text-sm font-medium">
          {isMismatch ? appCopy.home.mismatchTitle : template.name}
        </p>
        <p className="mt-1 text-sm text-zinc-400">{appCopy.upload.hint}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {([0, 1] as const).map((i) => (
            <label
              key={i}
              className="flex aspect-[3/4] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-700 bg-zinc-950 text-xs text-zinc-500"
            >
              {photos[i] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photos[i]!} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
              ) : (
                <span>
                  {isMismatch
                    ? i === 0
                      ? "Pet / owner"
                      : "Photo 2"
                    : `Photo ${i + 1}`}
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFile(i, e.target.files?.[0] ?? null)}
              />
            </label>
          ))}
        </div>
      </Card>

      <Button className="w-full" disabled={!ready} onClick={() => start("trial")}>
        {appCopy.upload.free}
      </Button>
      <Button
        className="w-full"
        variant="secondary"
        disabled={!ready}
        onClick={() => start("paid_default")}
      >
        {appCopy.upload.paid} ({appCopy.upload.unlockPrice})
      </Button>
    </Shell>
  );
}

export default function UploadPage() {
  return (
    <Suspense
      fallback={
        <Shell title="Upload">
          <p className="text-sm text-zinc-500">{appCopy.empty.loading}</p>
        </Shell>
      }
    >
      <UploadInner />
    </Suspense>
  );
}
