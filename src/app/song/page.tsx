import { Card, Shell } from "@/components/ui";
import { appCopy } from "@/lib/copy/app";

export default function Page() {
  return (
    <Shell title="Dal" tabs>
      <Card>
        <p className="text-sm text-zinc-200">{appCopy.tabs.songHu}</p>
        <p className="mt-1 text-sm text-zinc-500">{appCopy.tabs.songEn}</p>
      </Card>
    </Shell>
  );
}
