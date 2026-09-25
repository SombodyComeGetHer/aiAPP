import type { RouteKey } from "@/lib/templates";

export type JobLogEntry = {
  prediction_id: string;
  route: RouteKey;
  model: string;
  status: string;
  est_usd: number;
  actual_usd: number | null;
  created_at: string;
  updated_at: string;
  error?: string;
  output_url?: string;
};

export type SubmitBody = {
  templateId: string;
  routeKey: RouteKey;
  /** Public URL or data URL of the (composite) frame */
  image: string;
  /** Optional second photo for client-side composite already done */
  promptOverride?: string;
};
