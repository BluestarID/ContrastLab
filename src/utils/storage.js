/**
 * LocalStorage persistence utility for Saved Palettes & Active Session
 */

const SAVED_PALETTES_KEY = "contrastlab_saved_palettes_v1";
const ACTIVE_PALETTE_KEY = "contrastlab_active_palette_v1";

export function loadSavedPalettes() {
  try {
    const raw = localStorage.getItem(SAVED_PALETTES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Failed to load saved palettes from localStorage:", err);
    return [];
  }
}

export function saveSavedPalettes(palettes) {
  try {
    localStorage.setItem(SAVED_PALETTES_KEY, JSON.stringify(palettes));
  } catch (err) {
    console.warn("Failed to persist saved palettes to localStorage:", err);
  }
}

export function loadActivePalette(fallback) {
  try {
    const raw = localStorage.getItem(ACTIVE_PALETTE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch (err) {
    return fallback;
  }
}

export function saveActivePalette(palette) {
  try {
    localStorage.setItem(ACTIVE_PALETTE_KEY, JSON.stringify(palette));
  } catch (err) {
    // Ignore storage quota or disabled localStorage errors
  }
}
