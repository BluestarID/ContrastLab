import React, { useState, useMemo, useCallback } from "react";
import { DEFAULT_PALETTE, TABS } from "./types.js";
import { normalizeHex } from "./utils/colorMath.js";
import { Header } from "./components/Header.js";
import { SidebarGenerator } from "./components/SidebarGenerator.js";
import { PaletteManager } from "./components/PaletteManager.js";
import { ContrastChecker } from "./components/ContrastChecker.js";

/**
 * Checks if two palette arrays have different colors or order
 */
function arePalettesDifferent(p1, p2) {
  if (!p1 || !p2) return true;
  if (p1.length !== p2.length) return true;
  for (let i = 0; i < p1.length; i++) {
    if (normalizeHex(p1[i].hex) !== normalizeHex(p2[i].hex)) {
      return true;
    }
  }
  return false;
}

export function App() {
  const [activeTab, setActiveTab] = useState(TABS.PALETTE);
  const [palette, setPalette] = useState(DEFAULT_PALETTE);
  
  // Snapshot palette specifically for Contrast Checker
  // Does NOT auto-update when palette changes; only updates on explicit Refresh
  const [snapshotPalette, setSnapshotPalette] = useState(DEFAULT_PALETTE);

  // Stale detection
  const isStale = useMemo(() => {
    return arePalettesDifferent(palette, snapshotPalette);
  }, [palette, snapshotPalette]);

  // Add color to active palette
  const handleAddColor = useCallback((hex) => {
    const normalized = normalizeHex(hex);
    if (!normalized) return;
    setPalette((prev) => [
      ...prev,
      {
        id: `col-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        hex: normalized,
        name: `Color ${prev.length + 1}`
      }
    ]);
  }, []);

  // Remove color by index
  const handleRemoveColor = useCallback((index) => {
    setPalette((prev) => prev.filter((_, idx) => idx !== index));
  }, []);

  // Update specific color
  const handleUpdateColor = useCallback((index, newHex) => {
    const normalized = normalizeHex(newHex);
    if (!normalized) return;
    setPalette((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], hex: normalized };
      return copy;
    });
  }, []);

  // Reorder colors (move up/down)
  const handleReorderColor = useCallback((fromIndex, toIndex) => {
    setPalette((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;
      const copy = [...prev];
      const [movedItem] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, movedItem);
      return copy;
    });
  }, []);

  // Load starter preset
  const handleLoadPreset = useCallback((colorHexes) => {
    const newItems = colorHexes.map((hex, idx) => ({
      id: `preset-${Date.now()}-${idx}`,
      hex: normalizeHex(hex) || "#307CFF",
      name: `Preset ${idx + 1}`
    }));
    setPalette(newItems);
  }, []);

  // Clear palette
  const handleClearPalette = useCallback(() => {
    setPalette([]);
  }, []);

  // Explicit refresh of the Contrast Checker snapshot
  const handleRefreshSnapshot = useCallback(() => {
    setSnapshotPalette([...palette]);
  }, [palette]);

  return (
    <div className="app-layout">
      {/* Top Header with Tab Switcher */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        paletteCount={palette.length}
        isStale={isStale}
      />

      {/* Main Workspace Body */}
      <div className="app-body">
        {/* Left Persistent Color Generator Sidebar */}
        <SidebarGenerator
          palette={palette}
          onAddColor={handleAddColor}
        />

        {/* Center Primary Tab Content */}
        <main className="main-content-area" role="main">
          {activeTab === TABS.PALETTE ? (
            <PaletteManager
              palette={palette}
              onAddColor={handleAddColor}
              onRemoveColor={handleRemoveColor}
              onUpdateColor={handleUpdateColor}
              onReorderColor={handleReorderColor}
              onLoadPreset={handleLoadPreset}
              onClearPalette={handleClearPalette}
            />
          ) : (
            <ContrastChecker
              snapshotPalette={snapshotPalette}
              isStale={isStale}
              onRefresh={handleRefreshSnapshot}
              onSwitchToPalette={() => setActiveTab(TABS.PALETTE)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
