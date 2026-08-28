/**
 * Color Palette & Accessibility Tool Type Constants & Default Presets
 */

export const BIAS_MODES = {
  ANY: "any",
  NEUTRAL: "neutral",
  LIGHT: "light",
  DARK: "dark",
};

export const TABS = {
  PALETTE: "palette",
  CONTRAST: "contrast",
};

export const DEFAULT_PALETTE = [
  { id: "col-1", hex: "#FFFFFF", name: "Clean White" },
  { id: "col-2", hex: "#307CFF", name: "Electric Blue" },
  { id: "col-3", hex: "#0F172A", name: "Slate Navy" },
  { id: "col-4", hex: "#10B981", name: "Emerald Mint" },
  { id: "col-5", hex: "#F8FAFC", name: "Ghost White" },
  { id: "col-6", hex: "#F59E0B", name: "Amber Gold" }
];

export const STARTER_PRESETS = [
  {
    name: "Antigravity Default",
    colors: ["#FFFFFF", "#307CFF", "#0F172A", "#10B981", "#F8FAFC", "#F59E0B"]
  },
  {
    name: "Modern SaaS Brand",
    colors: ["#FFFFFF", "#6366F1", "#0B0F19", "#E0E7FF", "#EC4899", "#14B8A6"]
  },
  {
    name: "Warm Editorial",
    colors: ["#FAFAF9", "#EA580C", "#1C1917", "#FEF3C7", "#78350F", "#44403C"]
  },
  {
    name: "High Contrast Tech",
    colors: ["#000000", "#FFFFFF", "#0284C7", "#22C55E", "#E2E8F0", "#334155"]
  }
];
