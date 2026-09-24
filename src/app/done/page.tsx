"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { Button, Card, Shell } from "@/components/ui";
import { appCopy } from "@/lib/copy/app";
import { getTemplate } from "@/lib/templates";

function DoneInner() {
  const params = useSearchParams();
  const templateId = params.get("template") ?? "orange-booth-duo";
  const template = useMemo(() => getTemplate(templateId), [templateId]);

  if (!template) {
    return (
      <Shell title="Done">
        <p className="text-sm text-red-400">Unknown template.</p>
      </Shell>
    );
  }

  return (
    <Shell title="Done">
      <Card>
        <p className="text-lg font-semibold">Clip ready</p>
        <p className="mt-2 text-sm text-zinc-300">{appCopy.done.hu}</p>
        <p className="mt-1 text-sm text-zinc-500">{appCopy.done.en}</p>
      </Card>
      <Link href="/" className="block">
        <Button className="w-full">Back to Home</Button>
      </Link>
      <Link href={`/upload?template=${template.template_id}`} className="block">
        <Button className="w-full" variant="secondary">
          Make another
        </Button>
      </Link>
    </Shell>
  );
}

export default function DonePage() {
  return (
    <Suspense
      fallback={
        <Shell title="Done">
          <p className="text-sm text-zinc-500">Loading…</p>
        </Shell>
      }
    >
      <DoneInner />
    </Suspense>
  );
}
