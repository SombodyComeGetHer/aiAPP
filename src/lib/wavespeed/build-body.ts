import type { RouteKey, TemplateConfig } from "@/lib/templates";

export function assertMotionRefDuration(): void {
  const expected = Number(process.env.WAVESPEED_MOTION_REF_DURATION_S ?? "15");
  if (expected !== 15) {
    throw new Error(
      `motion_ref duration must be exactly 15s for paid Kling MC (got ${expected}). Update WAVESPEED_MOTION_REF_DURATION_S or the asset.`,
    );
  }
}

export function buildWaveSpeedBody(
  template: TemplateConfig,
  routeKey: RouteKey,
  image: string,
): { model: string; body: Record<string, unknown> } {
  const route = template.routes[routeKey];
  const model = route.model;

  if (routeKey === "paid_default") {
    assertMotionRefDuration();
    const video = process.env.WAVESPEED_MOTION_REF_URL;
    if (!video) {
      throw new Error("WAVESPEED_MOTION_REF_URL is required for paid Kling MC");
    }
    return {
      model,
      body: {
        image,
        video,
        character_orientation: "video",
        keep_original_sound: false,
      },
    };
  }

  if (routeKey === "paid_cinematic") {
    const duration = Math.min(route.duration_s_max ?? 8, 8);
    if (duration > 8) {
      throw new Error("Seedance duration must be ≤8s");
    }
    return {
      model,
      body: {
        prompt: template.prompt,
        image,
        aspect_ratio: "9:16",
        resolution: "720p",
        duration: duration === 5 ? 5 : 8,
        generate_audio: false,
      },
    };
  }

  // trial — Veo Lite: duration only 4/6/8
  return {
    model,
    body: {
      prompt: template.prompt,
      image,
      aspect_ratio: "9:16",
      resolution: "720p",
      duration: 8,
    },
  };
}
