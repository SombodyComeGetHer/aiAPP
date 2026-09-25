import Link from "next/link";
import { Button, Card, Shell } from "@/components/ui";
import { appCopy } from "@/lib/copy/app";
import { getTemplate } from "@/lib/templates";

export default function HomePage() {
  const template = getTemplate("orange-booth-duo");
  if (!template) return null;

  const uploadHref = `/upload?template=${template.template_id}`;

  return (
    <Shell title="Home">
      {/* #1 Orange Booth Duo */}
      <Card>
        <div className="mb-4 aspect-[9/16] w-full overflow-hidden rounded-xl bg-gradient-to-b from-orange-500/40 to-zinc-900">
          <div className="flex h-full flex-col items-center justify-end gap-2 p-6 text-center">
            <span className="rounded-full bg-black/50 px-3 py-1 text-xs text-orange-200">
              {appCopy.home.freeBadgeHu} · {appCopy.home.freeBadgeEn}
            </span>
            <p className="text-xs uppercase tracking-widest text-zinc-400">#1</p>
            <p className="text-2xl font-bold">{appCopy.home.title}</p>
          </div>
        </div>
        <p className="text-sm text-zinc-300">{appCopy.home.hu}</p>
        <p className="mt-1 text-sm text-zinc-500">{appCopy.home.en}</p>
        <Link href={uploadHref} className="mt-4 block">
          <Button className="w-full">{appCopy.home.cta}</Button>
        </Link>
      </Card>

      {/* #2 Mismatch — same booth, pet + owner framing */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-zinc-400">#2</p>
          <span className="rounded-full bg-orange-500/15 px-2.5 py-0.5 text-[11px] text-orange-300">
            {appCopy.home.freeBadgeHu}
          </span>
        </div>
        <div className="mb-3 aspect-[9/16] max-h-48 w-full overflow-hidden rounded-xl bg-gradient-to-br from-orange-600/30 via-zinc-900 to-zinc-950">
          <div className="flex h-full items-end justify-center p-4">
            <p className="text-lg font-semibold text-orange-200">
              {appCopy.home.mismatchTitle}
            </p>
          </div>
        </div>
        <p className="text-sm font-medium text-orange-300">
          {appCopy.home.mismatchTitle}
        </p>
        <p className="mt-1 text-sm text-zinc-400">{appCopy.home.mismatch}</p>
        <p className="mt-0.5 text-sm text-zinc-500">{appCopy.home.mismatchEn}</p>
        <Link
          href={`${uploadHref}&mode=mismatch`}
          className="mt-4 block"
        >
          <Button className="w-full" variant="secondary">
            {appCopy.home.cta}
          </Button>
        </Link>
      </Card>

      <p className="text-center text-sm text-zinc-500">
        {appCopy.home.moreSoonHu}
        <span className="mx-1.5 text-zinc-700">·</span>
        {appCopy.home.moreSoonEn}
      </p>
    </Shell>
  );
}
