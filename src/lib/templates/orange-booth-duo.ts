import type { TemplateConfig } from "./types";

/** Orange Booth Duo v1 — prompt owned by Prompt Lab / AI referens; do not rewrite. */
export const orangeBoothDuo: TemplateConfig = {
  template_id: "orange-booth-duo",
  name: "Orange Booth Duo",
  photos: { count: 2, pose: "frontal" },
  aspect: "9:16",
  audio: false,
  ui: { user_prompt: false },
  copy: {
    title: "Orange Booth Duo",
    hu: "Két fotó → ti ketten a narancssárga booth-ban.",
    en: "Two photos → you two in the orange booth.",
    mismatch_cta: "Pet + gazdi. Ugyanaz a booth.",
  },
  retail_usd: 4.99,
  routes: {
    paid_default: {
      provider: "wavespeed",
      model: "kwaivgi/kling-v3.0-std/motion-control",
      duration_s: 15,
      est_usd: 1.89,
    },
    paid_cinematic: {
      provider: "wavespeed",
      model: "bytedance/seedance-2.0-fast",
      duration_s_max: 8,
      est_usd_range: [1.0, 1.6],
    },
    trial: {
      provider: "wavespeed",
      model: "google/veo3.1-lite",
      duration_s_max: 8,
      watermark: false,
      audio: false,
      daily_limit: 1,
      est_usd: 0.4,
      est_usd_range: [0.4, 0.4],
    },
  },
  kill_switch_usd: 2.0,
  motion_ref: "assets/orange-booth-duo/motion.mp4",
  prompt:
    "two people in an orange booth with mics, static camera, independent motion, vertical 9:16",
};
