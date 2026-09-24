"use client";

import type { RouteKey } from "./templates";

const KEY = "orange-booth-flow-v1";

export type FlowSession = {
  templateId: string;
  photos: [string, string] | null;
  routeKey: RouteKey;
  unlocked: boolean;
  trialUsedToday: number;
};

const defaultSession = (): FlowSession => ({
  templateId: "orange-booth-duo",
  photos: null,
  routeKey: "trial",
  unlocked: false,
  trialUsedToday: 0,
});

export function loadFlow(): FlowSession {
  if (typeof window === "undefined") return defaultSession();
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return defaultSession();
    return { ...defaultSession(), ...JSON.parse(raw) } as FlowSession;
  } catch {
    return defaultSession();
  }
}

export function saveFlow(patch: Partial<FlowSession>): FlowSession {
  const next = { ...loadFlow(), ...patch };
  sessionStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearFlowPhotos(): void {
  saveFlow({ photos: null, unlocked: false });
}
