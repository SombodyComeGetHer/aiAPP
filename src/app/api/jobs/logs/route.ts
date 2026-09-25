import { NextResponse } from "next/server";
import { listJobLogs } from "@/lib/wavespeed/job-log";

export const runtime = "nodejs";

export async function GET() {
  const logs = await listJobLogs(50);
  return NextResponse.json({ jobs: logs });
}
