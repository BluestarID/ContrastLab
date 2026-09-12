import React, { useState, useMemo, useCallback, useEffect } from "react";
import styled from "styled-components";

import { DEFAULT_PALETTE, TABS, TabValue, PaletteItem, SavedPalette } from "./types";
import { normalizeHex } from "./utils/colorMath";
import {
  loadSavedPalettes,
  saveSavedPalettes,
  loadActivePalette,
  saveActivePalette,
} from "./utils/storage";
import { Header } from "./components/Header";
import { SidebarGenerator } from "./components/SidebarGenerator";
import { PaletteManager } from "./components/PaletteManager";
import { ContrastChecker } from "./components/ContrastChecker";

const AppLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: var(--bg-surface);

  @media (max-width: 1024px) {
    height: auto;
    overflow-y: auto;
  }
`;

const AppBody = styled.div`
  display: flex;
  flex: 1;
  height: calc(100vh - var(--header-height));
  max-height: calc(100vh - var(--header-height));
  width: 100%;
  overflow: hidden;

  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
    max-height: none;
    overflow: visible;
  }
`;

const MainContentArea = styled.main`
  flex: 1;
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
  min-width: 0;
  width: 100%;
  padding: clamp(18px, 2.5vw, 32px);
  box-sizing: border-box;

  @media (max-width: 1024px) {
    height: auto;
    max-height: none;
    overflow: visible;
  }
`;

/**
 * Checks if two palette arrays have different colors or order
 */
function arePalettesDifferent(
  p1: PaletteItem[] | null,
  p2: PaletteItem[] | null
): boolean {
  if (!p1 || !p2) return true;
  if (p1.length !== p2.length) return true;
  for (let i = 0; i < p1.length; i++) {
    if (normalizeHex(p1[i].hex) !== normalizeHex(p2[i].hex)) {
      return true;
    }
  }
  return false;
}

export interface AppProps {}

export function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<TabValue>(TABS.PALETTE);
  const [palette, setPalette] = useState<PaletteItem[]>(() =>
    loadActivePalette(DEFAULT_PALETTE)
  );
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>(() =>
    loadSavedPalettes()
  );

  // Snapshot palette specifically for Contrast Checker
  // Does NOT auto-update when palette changes; only updates on explicit Refresh
  const [snapshotPalette, setSnapshotPalette] = useState<PaletteItem[]>(() =>
    loadActivePalette(DEFAULT_PALETTE)
  );

  // Sync active palette changes to localStorage
  useEffect(() => {
    saveActivePalette(palette);
  }, [palette]);

  // Stale detection
  const isStale = useMemo<boolean>(() => {
    return arePalettesDifferent(palette, snapshotPalette);
  }, [palette, snapshotPalette]);

  // Add color to active palette
  const handleAddColor = useCallback((hex: string): void => {
    const normalized = normalizeHex(hex);
    if (!normalized) return;
    setPalette((prev) => [
      ...prev,
      {
        id: `col-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        hex: normalized,
        name: `Color ${prev.length + 1}`,
      },
    ]);
  }, []);

  // Remove color by index
  const handleRemoveColor = useCallback((index: number): void => {
    setPalette((prev) => prev.filter((_, idx) => idx !== index));
  }, []);

  // Update specific color
  const handleUpdateColor = useCallback((index: number, newHex: string): void => {
    const normalized = normalizeHex(newHex);
    if (!normalized) return;
    setPalette((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], hex: normalized };
      return copy;
    });
  }, []);

  // Reorder colors (move up/down)
  const handleReorderColor = useCallback((fromIndex: number, toIndex: number): void => {
    setPalette((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;
      const copy = [...prev];
      const [movedItem] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, movedItem);
      return copy;
    });
  }, []);

  // Load starter preset
  const handleLoadPreset = useCallback((colorHexes: string[]): void => {
    const newItems: PaletteItem[] = colorHexes.map((hex, idx) => ({
      id: `preset-${Date.now()}-${idx}`,
      hex: normalizeHex(hex) || "#307CFF",
      name: `Preset ${idx + 1}`,
    }));
    setPalette(newItems);
  }, []);

  // Clear palette
  const handleClearPalette = useCallback((): void => {
    setPalette([]);
  }, []);

  // Save current palette to browser storage
  const handleSavePalette = useCallback(
    (customName: string): void => {
      if (!palette || palette.length === 0) return;
      const name = customName?.trim() || `Palette ${savedPalettes.length + 1}`;
      const newEntry: SavedPalette = {
        id: `saved-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name,
        createdAt: Date.now(),
        colors: palette.map((p) => p.hex),
      };
      const updated = [newEntry, ...savedPalettes];
      setSavedPalettes(updated);
      saveSavedPalettes(updated);
    },
    [palette, savedPalettes]
  );

  // Delete saved palette from browser storage
  const handleDeleteSavedPalette = useCallback(
    (id: string): void => {
      const updated = savedPalettes.filter((p) => p.id !== id);
      setSavedPalettes(updated);
      saveSavedPalettes(updated);
    },
    [savedPalettes]
  );

  // Load saved palette
  const handleLoadSavedPalette = useCallback((colorHexes: string[]): void => {
    const newItems: PaletteItem[] = colorHexes.map((hex, idx) => ({
      id: `saved-col-${Date.now()}-${idx}`,
      hex: normalizeHex(hex) || "#307CFF",
      name: `Color ${idx + 1}`,
    }));
    setPalette(newItems);
  }, []);

  // Explicit refresh of the Contrast Checker snapshot
  const handleRefreshSnapshot = useCallback((): void => {
    setSnapshotPalette([...palette]);
  }, [palette]);

  return (
    <AppLayout>
      {/* Top Header with Tab Switcher */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        paletteCount={palette.length}
        isStale={isStale}
      />

      {/* Main Workspace Body */}
      <AppBody>
        {/* Left Persistent Color Generator Sidebar */}
        <SidebarGenerator palette={palette} onAddColor={handleAddColor} />

        {/* Center Primary Tab Content */}
        <MainContentArea role="main">
          {activeTab === TABS.PALETTE ? (
            <PaletteManager
              palette={palette}
              onAddColor={handleAddColor}
              onRemoveColor={handleRemoveColor}
              onUpdateColor={handleUpdateColor}
              onReorderColor={handleReorderColor}
              onLoadPreset={handleLoadPreset}
              onClearPalette={handleClearPalette}
              savedPalettes={savedPalettes}
              onSavePalette={handleSavePalette}
              onDeleteSavedPalette={handleDeleteSavedPalette}
              onLoadSavedPalette={handleLoadSavedPalette}
            />
          ) : (
            <ContrastChecker
              snapshotPalette={snapshotPalette}
              isStale={isStale}
              onRefresh={handleRefreshSnapshot}
              onSwitchToPalette={() => setActiveTab(TABS.PALETTE)}
            />
          )}
        </MainContentArea>
      </AppBody>
    </AppLayout>
  );
}

export default App;
