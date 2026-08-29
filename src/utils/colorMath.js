/**
 * WCAG 2.1 Contrast & Color Math Utilities
 */

export function normalizeHex(hex) {
  if (!hex || typeof hex !== "string") return null;
  let clean = hex.trim().replace(/^#/, "");
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  if (!/^[0-9A-Fa-f]{6}$/.test(clean)) {
    return null;
  }
  return "#" + clean.toUpperCase();
}

export function isValidHex(hex) {
  return normalizeHex(hex) !== null;
}

export function hexToRgb(hex) {
  const normalized = normalizeHex(hex);
  if (!normalized) return { r: 0, g: 0, b: 0 };
  const num = parseInt(normalized.slice(1), 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r, g, b) {
  const clamp = (val) => Math.max(0, Math.min(255, Math.round(val)));
  const toHex = (val) => clamp(val).toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function formatRgb(r, g, b) {
  if (typeof r === "object" && r !== null) {
    return `rgb(${Math.round(r.r)}, ${Math.round(r.g)}, ${Math.round(r.b)})`;
  }
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

export function rgbToHsl(r, g, b) {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(((h % 1 + 1) % 1) * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let rPrime = 0, gPrime = 0, bPrime = 0;

  if (h >= 0 && h < 60) {
    rPrime = c; gPrime = x; bPrime = 0;
  } else if (h >= 60 && h < 120) {
    rPrime = x; gPrime = c; bPrime = 0;
  } else if (h >= 120 && h < 180) {
    rPrime = 0; gPrime = c; bPrime = x;
  } else if (h >= 180 && h < 240) {
    rPrime = 0; gPrime = x; bPrime = c;
  } else if (h >= 240 && h < 300) {
    rPrime = x; gPrime = 0; bPrime = c;
  } else {
    rPrime = c; gPrime = 0; bPrime = x;
  }

  return {
    r: Math.max(0, Math.min(255, Math.round((rPrime + m) * 255))),
    g: Math.max(0, Math.min(255, Math.round((gPrime + m) * 255))),
    b: Math.max(0, Math.min(255, Math.round((bPrime + m) * 255))),
  };
}

export function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

export function hslToHex(h, s, l) {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

export function getRelativeLuminance(r, g, b) {
  const toLinear = (c) => {
    const norm = c / 255;
    if (norm <= 0.03928) {
      return norm / 12.92;
    }
    return Math.pow((norm + 0.055) / 1.055, 2.4);
  };

  const rLinear = toLinear(r);
  const gLinear = toLinear(g);
  const bLinear = toLinear(b);

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

export function getContrastRatio(color1Hex, color2Hex) {
  const rgb1 = hexToRgb(color1Hex);
  const rgb2 = hexToRgb(color2Hex);

  const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

export function formatRatio(ratio) {
  return `${ratio.toFixed(2)}:1`;
}

export function evaluateWCAG(ratio) {
  const aaNormal = ratio >= 4.5;
  const aaLarge = ratio >= 3.0;
  const aaaNormal = ratio >= 7.0;
  const aaaLarge = ratio >= 4.5;

  return {
    ratio,
    formattedRatio: formatRatio(ratio),
    aaNormal,
    aaLarge,
    aaaNormal,
    aaaLarge,
    overallPass: aaNormal,
  };
}

/**
 * Checks if a color is perceived as visually light using WCAG relative luminance.
 * Mathematical threshold of ~0.20 provides optimal contrast for dark text on light backgrounds.
 */
export function isLightColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  return getRelativeLuminance(r, g, b) > 0.20;
}
