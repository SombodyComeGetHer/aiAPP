"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Button, Card, Shell } from "@/components/ui";
import { saveFlow } from "@/lib/flow-session";
import { getTemplate } from "@/lib/templates";

function UploadInner() {
  const router = useRouter();
  const params = useSearchParams();
  const templateId = params.get("template") ?? "orange-booth-duo";
  const template = useMemo(() => getTemplate(templateId), [templateId]);
  const [photos, setPhotos] = useState<[string | null, string | null]>([null, null]);

  if (!template) {
    return (
      <Shell title="Upload">
        <p className="text-sm text-red-400">Unknown template.</p>
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

  return (
    <Shell title="Upload">
      <Card>
        <p className="text-sm text-zinc-400">
          {template.photos.count} frontal photos · zero prompt · {template.aspect}
        </p>
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
                <span>Photo {i + 1}</span>
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
        Generate free preview
      </Button>
      <Button
        className="w-full"
        variant="secondary"
        disabled={!ready}
        onClick={() => start("paid_default")}
      >
        Generate full (${template.retail_usd.toFixed(2)})
      </Button>
    </Shell>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={<Shell title="Upload"><p className="text-sm text-zinc-500">Loading…</p></Shell>}>
      <UploadInner />
    </Suspense>
  );
}
