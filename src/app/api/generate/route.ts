import { NextResponse } from "next/server";
import {
  buildWaveSpeedBody,
} from "@/lib/wavespeed/build-body";
import { submitPrediction } from "@/lib/wavespeed/client";
import { appendJobLog } from "@/lib/wavespeed/job-log";
import type { SubmitBody } from "@/lib/wavespeed/types";
import {
  canStartJob,
  estimateRouteUsd,
  getTemplate,
  type RouteKey,
} from "@/lib/templates";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!process.env.WAVESPEED_API_KEY) {
      return NextResponse.json(
        { error: "WAVESPEED_API_KEY is not configured" },
        { status: 503 },
      );
    }

    const body = (await req.json()) as SubmitBody;
    const template = getTemplate(body.templateId);
    if (!template) {
      return NextResponse.json({ error: "Unknown template" }, { status: 400 });
    }

    const routeKey = body.routeKey as RouteKey;
    if (!template.routes[routeKey]) {
      return NextResponse.json({ error: "Unknown route" }, { status: 400 });
    }

    if (!body.image || typeof body.image !== "string") {
      return NextResponse.json({ error: "image is required" }, { status: 400 });
    }

    // Block forbidden combos explicitly
    if (routeKey === "paid_default" && template.routes.paid_default.model.includes("pro")) {
      return NextResponse.json({ error: "Kling MC Pro is disabled" }, { status: 400 });
    }

    const gate = canStartJob(template, routeKey);
    if (!gate.ok) {
      return NextResponse.json(
        { error: gate.reason, est_usd: gate.est },
        { status: 402 },
      );
    }

    const est_usd = estimateRouteUsd(gate.route);
    const { model, body: wsBody } = buildWaveSpeedBody(
      template,
      routeKey,
      body.image,
    );

    const submitted = await submitPrediction(model, wsBody);
    const prediction_id = submitted.data.id;
    const now = new Date().toISOString();

    await appendJobLog({
      prediction_id,
      route: routeKey,
      model,
      status: submitted.data.status ?? "created",
      est_usd,
      actual_usd: null,
      created_at: now,
      updated_at: now,
    });

    return NextResponse.json({
      prediction_id,
      est_usd,
      model,
      route: routeKey,
      poll_url: `/api/generate/${prediction_id}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generate failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
