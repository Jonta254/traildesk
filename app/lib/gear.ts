export const GEAR_TEMPLATES = {
  "Day Hike": ["Water (2L+)", "Food and snacks", "Rain shell", "First-aid kit", "Sun protection", "Navigation backup", "Emergency whistle"],
  Overnight: ["Shelter", "Sleeping bag", "Sleeping mat", "Cook kit and fuel", "Food", "Water treatment", "Headlamp and batteries", "Dry bags", "Warm layer", "First-aid kit"],
  "Multi-day": ["Shelter", "Sleeping bag", "Sleeping mat", "Stove and fuel", "Food plan", "Water treatment", "Trekking poles", "Dry bags", "Layering system", "Headlamp", "Emergency beacon", "First-aid kit", "Repair kit"],
  "Alpine / Technical": ["Ice axe", "Crampons", "Rope", "Harness and helmet", "Rescue kit", "Technical layering system", "Goggles", "Emergency bivvy", "Dedicated navigation device"],
} as const;

export type GearTemplateName = keyof typeof GEAR_TEMPLATES;
