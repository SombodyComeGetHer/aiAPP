import { promises as fs } from "fs";
import path from "path";
import type { JobLogEntry } from "./types";

const LOG_PATH = path.join(process.cwd(), ".data", "job-logs.json");

async function ensure(): Promise<JobLogEntry[]> {
  try {
    const raw = await fs.readFile(LOG_PATH, "utf8");
    return JSON.parse(raw) as JobLogEntry[];
  } catch {
    return [];
  }
}

async function writeAll(entries: JobLogEntry[]): Promise<void> {
  await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });
  await fs.writeFile(LOG_PATH, JSON.stringify(entries, null, 2));
}

export async function appendJobLog(entry: JobLogEntry): Promise<void> {
  const all = await ensure();
  all.push(entry);
  await writeAll(all);
}

export async function updateJobLog(
  predictionId: string,
  patch: Partial<JobLogEntry>,
): Promise<JobLogEntry | null> {
  const all = await ensure();
  const idx = all.findIndex((e) => e.prediction_id === predictionId);
  if (idx < 0) return null;
  all[idx] = { ...all[idx], ...patch, updated_at: new Date().toISOString() };
  await writeAll(all);
  return all[idx];
}

export async function listJobLogs(limit = 50): Promise<JobLogEntry[]> {
  const all = await ensure();
  return all.slice(-limit).reverse();
}

export function extractActualUsd(result: unknown): number | null {
  if (!result || typeof result !== "object") return null;
  const data = result as Record<string, unknown>;
  const candidates = [
    data.actual_usd,
    data.billed_usd,
    data.cost,
    data.price,
    (data.billing as Record<string, unknown> | undefined)?.amount,
    (data.usage as Record<string, unknown> | undefined)?.cost,
  ];
  for (const c of candidates) {
    if (typeof c === "number" && Number.isFinite(c)) return c;
    if (typeof c === "string" && c.trim() && !Number.isNaN(Number(c))) {
      return Number(c);
    }
  }
  return null;
}
