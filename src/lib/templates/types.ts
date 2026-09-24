export type TemplatePhotos = {
  count: number;
  pose: "frontal";
};

export type TemplateRoute = {
  provider: "wavespeed" | "fal";
  model: string;
  duration_s?: number;
  duration_s_max?: number;
  est_usd?: number;
  est_usd_range?: [number, number];
  watermark?: boolean;
  audio?: boolean;
  daily_limit?: number;
};

export type TemplateConfig = {
  template_id: string;
  name: string;
  photos: TemplatePhotos;
  aspect: "9:16";
  audio: false;
  ui: { user_prompt: false };
  copy: {
    title: string;
    hu: string;
    en: string;
    mismatch_cta: string;
  };
  retail_usd: number;
  routes: {
    paid_default: TemplateRoute;
    paid_cinematic: TemplateRoute;
    trial: TemplateRoute;
  };
  kill_switch_usd: number;
  motion_ref: string;
  prompt: string;
};

export type RouteKey = keyof TemplateConfig["routes"];
