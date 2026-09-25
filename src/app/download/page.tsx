"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Button, Card, Shell } from "@/components/ui";
import { appCopy } from "@/lib/copy/app";
import { loadFlow } from "@/lib/flow-session";
import { getTemplate } from "@/lib/templates";

function DownloadInner() {
  const params = useSearchParams();
  const templateId = params.get("template") ?? "orange-booth-duo";
  const template = useMemo(() => getTemplate(templateId), [templateId]);
  const [outputUrl, setOutputUrl] = useState<string | undefined>();

  useEffect(() => {
    setOutputUrl(loadFlow().lastOutputUrl);
  }, []);

  if (!template) {
    return (
      <Shell title="Download">
        <p className="text-sm text-red-400">{appCopy.empty.unknownTemplate}</p>
      </Shell>
    );
  }

  return (
    <Shell title="Download">
      <Card>
        <p className="text-sm font-medium">{template.name}</p>
        <p className="mt-2 text-sm text-zinc-300">{appCopy.download.hu}</p>
        <p className="mt-1 text-sm text-zinc-500">{appCopy.download.en}</p>
        <Button
          className="mt-4 w-full"
          onClick={() => {
            if (outputUrl) {
              window.open(outputUrl, "_blank", "noopener,noreferrer");
              return;
            }
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
          {outputUrl ? "Open / download MP4" : "Download MP4 (mock)"}
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
    <Suspense
      fallback={
        <Shell title="Download">
          <p className="text-sm text-zinc-500">{appCopy.empty.loading}</p>
        </Shell>
      }
    >
      <DownloadInner />
    </Suspense>
  );
}
