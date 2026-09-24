import { orangeBoothDuo } from "./orange-booth-duo";
import type { RouteKey, TemplateConfig, TemplateRoute } from "./types";

const TEMPLATES: Record<string, TemplateConfig> = {
  [orangeBoothDuo.template_id]: orangeBoothDuo,
};

export function getTemplate(id: string): TemplateConfig | undefined {
  return TEMPLATES[id];
}

export function listTemplates(): TemplateConfig[] {
  return Object.values(TEMPLATES);
}

export function estimateRouteUsd(route: TemplateRoute): number {
  if (typeof route.est_usd === "number") return route.est_usd;
  if (route.est_usd_range) return route.est_usd_range[1];
  return Number.POSITIVE_INFINITY;
}

/** Kill-switch: job must not start if estimated wholesale exceeds hard cap. */
export function canStartJob(
  template: TemplateConfig,
  routeKey: RouteKey,
): { ok: true; route: TemplateRoute } | { ok: false; reason: string; est: number } {
  const route = template.routes[routeKey];
  const est = estimateRouteUsd(route);
  if (est > template.kill_switch_usd) {
    return {
      ok: false,
      reason: `Wholesale $${est.toFixed(2)} exceeds kill-switch $${template.kill_switch_usd.toFixed(2)}`,
      est,
    };
  }
  return { ok: true, route };
}

export function routeDurationSeconds(
  route: TemplateRoute,
  fallback: number,
): number {
  return route.duration_s ?? route.duration_s_max ?? fallback;
}

export type { RouteKey, TemplateConfig, TemplateRoute };
