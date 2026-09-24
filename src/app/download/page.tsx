"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { Button, Card, Shell } from "@/components/ui";
import { getTemplate } from "@/lib/templates";

function DownloadInner() {
  const params = useSearchParams();
  const templateId = params.get("template") ?? "orange-booth-duo";
  const template = useMemo(() => getTemplate(templateId), [templateId]);

  if (!template) {
    return (
      <Shell title="Download">
        <p className="text-sm text-red-400">Unknown template.</p>
      </Shell>
    );
  }

  return (
    <Shell title="Download">
      <Card>
        <p className="text-sm font-medium">{template.name}</p>
        <p className="mt-2 text-sm text-zinc-400">
          MP4 ready (silent). Tip: Open TikTok and add the sound yourself.
        </p>
        <Button
          className="mt-4 w-full"
          onClick={() => {
            // Placeholder download — real MP4 from job queue later.
            const blob = new Blob(
              ["Mock silent MP4 placeholder for Orange Booth Duo"],
              { type: "text/plain" },
            );
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${template.template_id}-silent.txt`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Download MP4 (mock)
        </Button>
      </Card>
      <Link href={`/done?template=${templateId}`} className="block">
        <Button className="w-full" variant="secondary">
          Done
        </Button>
      </Link>
    </Shell>
  );
}

export default function DownloadPage() {
  return (
    <Suspense fallback={<Shell title="Download"><p className="text-sm text-zinc-500">Loading…</p></Shell>}>
      <DownloadInner />
    </Suspense>
  );
}
