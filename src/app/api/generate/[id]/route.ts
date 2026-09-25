import { NextResponse } from "next/server";
import {
  firstOutputUrl,
  getPredictionResult,
} from "@/lib/wavespeed/client";
import { extractActualUsd, updateJobLog } from "@/lib/wavespeed/job-log";

export const runtime = "nodejs";

const FAILURE = new Set(["failed", "cancelled", "timeout", "deleted"]);

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    if (!process.env.WAVESPEED_API_KEY) {
      return NextResponse.json(
        { error: "WAVESPEED_API_KEY is not configured" },
        { status: 503 },
      );
    }

    const { id } = await ctx.params;
    const result = await getPredictionResult(id);
    const status = result.data.status;
    const actual_usd = extractActualUsd(result.data);
    const output_url = firstOutputUrl(result.data.outputs);

    await updateJobLog(id, {
      status,
      actual_usd,
      output_url,
      error: typeof result.data.error === "string" ? result.data.error : undefined,
    });

    if (status === "completed") {
      return NextResponse.json({
        status,
        output_url,
        actual_usd,
        prediction_id: id,
      });
    }

    if (FAILURE.has(status)) {
      return NextResponse.json(
        {
          status,
          error: result.data.error || `Job ${status}`,
          actual_usd,
          prediction_id: id,
        },
        { status: 422 },
      );
    }

    return NextResponse.json({
      status,
      actual_usd,
      prediction_id: id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Poll failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
