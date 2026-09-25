const BASE = "https://api.wavespeed.ai/api/v3";

function apiKey(): string {
  const key = process.env.WAVESPEED_API_KEY;
  if (!key) {
    throw new Error("WAVESPEED_API_KEY is not set");
  }
  return key;
}

function headers(): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey()}`,
    "Content-Type": "application/json",
  };
}

export type WaveSpeedSubmitResponse = {
  code: number;
  message?: string;
  data: {
    id: string;
    status?: string;
    urls?: { get?: string };
  };
};

export type WaveSpeedResultResponse = {
  code: number;
  message?: string;
  data: {
    id: string;
    status: string;
    outputs?: unknown[];
    error?: string;
    [key: string]: unknown;
  };
};

export async function submitPrediction(
  modelPath: string,
  body: Record<string, unknown>,
): Promise<WaveSpeedSubmitResponse> {
  const res = await fetch(`${BASE}/${modelPath}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as WaveSpeedSubmitResponse;
  if (!res.ok || json.code !== 200) {
    throw new Error(json.message || `WaveSpeed submit failed (${res.status})`);
  }
  if (!json.data?.id) {
    throw new Error("WaveSpeed submit missing prediction id");
  }
  return json;
}

export async function getPredictionResult(
  predictionId: string,
): Promise<WaveSpeedResultResponse> {
  const res = await fetch(`${BASE}/predictions/${predictionId}/result`, {
    method: "GET",
    headers: headers(),
    cache: "no-store",
  });
  const json = (await res.json()) as WaveSpeedResultResponse;
  if (!res.ok || json.code !== 200) {
    throw new Error(json.message || `WaveSpeed poll failed (${res.status})`);
  }
  return json;
}

export function firstOutputUrl(outputs: unknown[] | undefined): string | undefined {
  if (!outputs?.length) return undefined;
  const first = outputs[0];
  if (typeof first === "string") return first;
  if (first && typeof first === "object" && "url" in first) {
    const url = (first as { url?: unknown }).url;
    if (typeof url === "string") return url;
  }
  return undefined;
}
