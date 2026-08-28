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
const HARMONY_RULES = [
  { name: "Complementary", offset: 180 },
  { name: "Split Complementary (+)", offset: 150 },
  { name: "Split Complementary (-)", offset: 210 },
  { name: "Triadic (+)", offset: 120 },
  { name: "Triadic (-)", offset: 240 },
  { name: "Analogous (+)", offset: 30 },
  { name: "Analogous (-)", offset: -30 },
  { name: "Tetradic (90)", offset: 90 },
  { name: "Tetradic (270)", offset: 270 },
  { name: "Monochromatic", offset: 0 }
];

/**
 * Random helper within a range [min, max]
 */
function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Random integer helper within [min, max] inclusive
 */
function randomInt(min, max) {
  return Math.floor(randomRange(min, max + 1));
}

/**
 * Extracts anchor hues from the user palette.
 * If palette is empty, provides a clean curated anchor hue.
 * @param {Array<{hex: string}>} palette 
 * @returns {Array<{h: number, s: number, l: number}>}
 */
export function getPaletteHslList(palette) {
  if (!palette || palette.length === 0) {
    // Default anchor: Antigravity Accent Blue (#307CFF -> H: 218, S: 100, L: 59)
    return [{ h: 218, s: 100, l: 59 }];
  }
  return palette
    .map(p => {
      const norm = normalizeHex(p.hex || p);
      return norm ? hexToHsl(norm) : null;
    })
    .filter(Boolean);
}

/**
 * Generates a batch of harmonious colors based on current palette and selected bias mode.
 * 
 * @param {Array<{hex: string}>} palette Current user palette
 * @param {string} biasMode "any" | "neutral" | "light" | "dark"
 * @param {number} count Number of swatches to generate (default 8)
 * @returns {Array<{
 *   id: string,
 *   hex: string,
 *   h: number,
 *   s: number,
 *   l: number,
 *   rule: string,
 *   bias: string
 * }>}
 */
export function generateHarmoniousPalette(palette, biasMode = BIAS_MODES.ANY, count = 8) {
  const hslList = getPaletteHslList(palette);
  const results = [];
  const generatedHexes = new Set(palette.map(p => normalizeHex(p.hex || p)).filter(Boolean));

  let attempts = 0;
  const maxAttempts = count * 15;

  while (results.length < count && attempts < maxAttempts) {
    attempts++;

    // Pick a random anchor color from current palette
    const anchor = hslList[randomInt(0, hslList.length - 1)];

    // Pick a random harmony rule
    const rule = HARMONY_RULES[randomInt(0, HARMONY_RULES.length - 1)];

    // Calculate harmonious target hue with subtle organic jitter (+- 10 deg)
    const jitter = randomRange(-8, 8);
    const targetHue = Math.round(((anchor.h + rule.offset + jitter) % 360 + 360) % 360);

    let targetSat = 0;
    let targetLight = 0;

    switch (biasMode) {
      case BIAS_MODES.NEUTRAL:
        // Neutral: low saturation (4% to 18%), balanced lightness ranges
        targetSat = randomInt(4, 18);
        // Blend between soft light grays (82-94%), slate/charcoal (14-26%), and mid neutrals (42-60%)
        const neutralTier = Math.random();
        if (neutralTier < 0.4) {
          targetLight = randomInt(84, 95); // Light neutral / off-white
        } else if (neutralTier < 0.75) {
          targetLight = randomInt(12, 25); // Dark neutral / deep slate
        } else {
          targetLight = randomInt(44, 62); // Mid neutral gray
        }
        break;

      case BIAS_MODES.LIGHT:
        // Light: high lightness value, soft pastel saturation
        targetLight = randomInt(84, 96);
        targetSat = randomInt(35, 85);
        break;

      case BIAS_MODES.DARK:
        // Dark: low lightness value, rich deep saturation
        targetLight = randomInt(10, 24);
        targetSat = randomInt(45, 90);
        break;

      case BIAS_MODES.ANY:
      default:
        // Any: full dynamic harmony range
        // Balanced spread of medium-to-vibrant saturations and mid-to-bright lightness
        targetSat = randomInt(45, 95);
        const lightMode = Math.random();
        if (lightMode < 0.25) {
          targetLight = randomInt(18, 35); // Deep tone
        } else if (lightMode < 0.7) {
          targetLight = randomInt(45, 68); // Rich mid tone
        } else {
          targetLight = randomInt(75, 92); // Bright highlight
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
        bias: biasMode
      });
    }
  }

  // Fallback guarantee if deduplication was too strict
  while (results.length < count) {
    const randomHue = randomInt(0, 360);
    const hex = hslToHex(randomHue, 60, biasMode === BIAS_MODES.DARK ? 18 : biasMode === BIAS_MODES.LIGHT ? 88 : 50);
    results.push({
      id: `gen-fb-${results.length}-${Math.random().toString(36).substr(2, 5)}`,
      hex,
      h: randomHue,
      s: 60,
      l: 50,
      rule: "Harmonic Accent",
      bias: biasMode
    });
  }

  return results;
}
