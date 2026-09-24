import Link from "next/link";
import { Button, Card, Shell } from "@/components/ui";
import { appCopy } from "@/lib/copy/app";
import { getTemplate } from "@/lib/templates";

export default function HomePage() {
  const template = getTemplate("orange-booth-duo");
  if (!template) return null;

  return (
    <Shell title="Home">
      <Card>
        <div className="mb-4 aspect-[9/16] w-full overflow-hidden rounded-xl bg-gradient-to-b from-orange-500/40 to-zinc-900">
          <div className="flex h-full flex-col items-center justify-end gap-2 p-6 text-center">
            <span className="rounded-full bg-black/50 px-3 py-1 text-xs text-orange-200">
              9:16 · no audio · 1 free clip
            </span>
            <p className="text-2xl font-bold">{appCopy.home.title}</p>
          </div>
        </div>
        <p className="text-sm text-zinc-300">{appCopy.home.hu}</p>
        <p className="mt-1 text-sm text-zinc-500">{appCopy.home.en}</p>
        <Link href={`/upload?template=${template.template_id}`} className="mt-4 block">
          <Button className="w-full">{appCopy.home.cta}</Button>
        </Link>
      </Card>

      <Card>
        <p className="text-sm font-medium text-orange-300">Mismatch</p>
        <p className="mt-1 text-sm text-zinc-400">{appCopy.home.mismatch}</p>
      </Card>
    </Shell>
  );
}
