/**
 * HSL Color Harmony & Palette Generator
 * 
 * Generates fresh harmonious colors anchored to the existing palette
 * with precise Lightness/Saturation biasing (Neutral, Light, Dark, Any).
 */

import { hexToHsl, hslToHex, normalizeHex } from "./colorMath.js";
import { BIAS_MODES } from "../types.js";

/**
 * Standard Harmony Angle Offsets
 */
export const HARMONY_RULES = [
  { name: "Complementary", offset: 180 },
  { name: "Split Comp (+)", offset: 150 },
  { name: "Split Comp (-)", offset: 210 },
  { name: "Triadic (+)", offset: 120 },
  { name: "Triadic (-)", offset: 240 },
  { name: "Analogous (+)", offset: 30 },
  { name: "Analogous (-)", offset: -30 },
  { name: "Tetradic (90)", offset: 90 },
  { name: "Tetradic (270)", offset: 270 },
  { name: "Monochromatic", offset: 0 }
];

export function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

export function randomInt(min, max) {
  return Math.floor(randomRange(min, max + 1));
}

export function getPaletteHslList(palette) {
  if (!palette || palette.length === 0) {
    return [{ h: 218, s: 100, l: 59 }];
  }
  return palette
    .map((p) => {
      const norm = normalizeHex(p.hex || p);
      return norm ? hexToHsl(norm) : null;
    })
    .filter(Boolean);
}

export function generateHarmoniousPalette(palette, biasMode = BIAS_MODES.ANY, count = 8) {
  const hslList = getPaletteHslList(palette);
  const results = [];
  const generatedHexes = new Set(palette.map((p) => normalizeHex(p.hex || p)).filter(Boolean));

  let attempts = 0;
  const maxAttempts = count * 20;

  while (results.length < count && attempts < maxAttempts) {
    attempts++;

    const anchor = hslList[randomInt(0, hslList.length - 1)];
    const rule = HARMONY_RULES[randomInt(0, HARMONY_RULES.length - 1)];
    const jitter = randomRange(-8, 8);
    const targetHue = Math.round(((anchor.h + rule.offset + jitter) % 360 + 360) % 360);

    let targetSat = 0;
    let targetLight = 0;

    switch (biasMode) {
      case BIAS_MODES.NEUTRAL:
        targetSat = randomInt(4, 18);
        const neutralTier = Math.random();
        if (neutralTier < 0.4) {
          targetLight = randomInt(84, 95);
        } else if (neutralTier < 0.75) {
          targetLight = randomInt(12, 25);
        } else {
          targetLight = randomInt(44, 62);
        }
        break;

      case BIAS_MODES.LIGHT:
        targetLight = randomInt(84, 96);
        targetSat = randomInt(35, 85);
        break;

      case BIAS_MODES.DARK:
        targetLight = randomInt(10, 24);
        targetSat = randomInt(45, 90);
        break;

      case BIAS_MODES.ANY:
      default:
        targetSat = randomInt(45, 95);
        const lm = Math.random();
        if (lm < 0.25) {
          targetLight = randomInt(18, 35);
        } else if (lm < 0.7) {
          targetLight = randomInt(45, 68);
        } else {
          targetLight = randomInt(75, 92);
        }
        break;
    }

    const hex = hslToHex(targetHue, targetSat, targetLight);

    if (!generatedHexes.has(hex)) {
      generatedHexes.add(hex);
      results.push({
        id: `gen-${Date.now()}-${results.length}-${Math.random().toString(36).substr(2, 5)}`,
        hex,
        h: targetHue,
        s: targetSat,
        l: targetLight,
        rule: rule.name,
        bias: biasMode,
      });
    }
  }

  while (results.length < count) {
    const rh = randomInt(0, 360);
    results.push({
      id: `gen-fb-${results.length}-${Math.random().toString(36).substr(2, 5)}`,
      hex: hslToHex(rh, 60, biasMode === BIAS_MODES.DARK ? 18 : biasMode === BIAS_MODES.LIGHT ? 88 : 50),
      h: rh,
      s: 60,
      l: 50,
      rule: "Harmonic Accent",
      bias: biasMode,
    });
  }

  return results;
}
