/**
 * Color Palette & Accessibility Tool Type Interfaces & Default Presets
 */

export interface PaletteItem {
  id: string;
  hex: string;
  name: string;
}

export interface SavedPalette {
  id: string;
  name: string;
  createdAt: number;
  colors: string[];
}

export interface StarterPreset {
  name: string;
  colors: string[];
}

export interface GeneratedSwatch {
  id: string;
  hex: string;
  h: number;
  s: number;
  l: number;
  rule: string;
  bias: string;
}

export interface WCAGResult {
  ratio: number;
  formattedRatio: string;
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  aaaLarge: boolean;
  overallPass: boolean;
}

export interface ContrastPair {
  id: string;
  bgHex: string;
  fgHex: string;
  bgIndex: number;
  fgIndex: number;
  bgRgb: string;
  fgRgb: string;
  ratio: number;
  wcag: WCAGResult;
}

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export interface HarmonyRule {
  name: string;
  offset: number;
}

export const BIAS_MODES = {
  ANY: "any",
  NEUTRAL: "neutral",
  LIGHT: "light",
  DARK: "dark",
} as const;

export type BiasModeValue = typeof BIAS_MODES[keyof typeof BIAS_MODES];

export const TABS = {
  PALETTE: "palette",
  CONTRAST: "contrast",
} as const;

export type TabValue = typeof TABS[keyof typeof TABS];

export const DEFAULT_PALETTE: PaletteItem[] = [
  { id: "col-1", hex: "#FFFFFF", name: "Clean White" },
  { id: "col-2", hex: "#307CFF", name: "Electric Blue" },
  { id: "col-3", hex: "#0F172A", name: "Slate Navy" },
  { id: "col-4", hex: "#10B981", name: "Emerald Mint" },
  { id: "col-5", hex: "#F8FAFC", name: "Ghost White" },
  { id: "col-6", hex: "#F59E0B", name: "Amber Gold" },
];

export const STARTER_PRESETS: StarterPreset[] = [
  {
    name: "Antigravity Default",
    colors: ["#FFFFFF", "#307CFF", "#0F172A", "#10B981", "#F8FAFC", "#F59E0B"],
  },
  {
    name: "Modern SaaS",
    colors: ["#FFFFFF", "#6366F1", "#0B0F19", "#E0E7FF", "#EC4899", "#14B8A6"],
  },
  {
    name: "Warm Editorial",
    colors: ["#FAFAF9", "#EA580C", "#1C1917", "#FEF3C7", "#78350F", "#44403C"],
  },
  {
    name: "High Contrast",
    colors: ["#000000", "#FFFFFF", "#0284C7", "#22C55E", "#E2E8F0", "#334155"],
  },
];
