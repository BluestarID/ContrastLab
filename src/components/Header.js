import React from "react";
import { TABS } from "../types.js";
import { LayersIcon, EyeIcon } from "./Icons.js";

export function Header({ activeTab, setActiveTab, paletteCount, isStale }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="brand-logo">
          <div className="logo-icon-wrap">
            <div className="logo-dot-1"></div>
            <div className="logo-dot-2"></div>
            <div className="logo-dot-3"></div>
          </div>
          <div className="brand-text">
            <span className="brand-title">ContrastLab</span>
            <span className="brand-badge">WCAG 2.1</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <nav className="tab-pill-container" role="tablist" aria-label="Main Navigation">
          <button
            role="tab"
            id="tab-palette"
            aria-selected={activeTab === TABS.PALETTE}
            aria-controls="panel-palette"
            tabIndex={0}
            className={`tab-pill ${activeTab === TABS.PALETTE ? "active" : ""}`}
            onClick={() => setActiveTab(TABS.PALETTE)}
          >
            <LayersIcon className="tab-icon" size={15} />
            <span>Color Palette</span>
            <span className="tab-count-badge">{paletteCount}</span>
          </button>

          <button
            role="tab"
            id="tab-contrast"
            aria-selected={activeTab === TABS.CONTRAST}
            aria-controls="panel-contrast"
            tabIndex={0}
            className={`tab-pill ${activeTab === TABS.CONTRAST ? "active" : ""}`}
            onClick={() => setActiveTab(TABS.CONTRAST)}
          >
            <EyeIcon className="tab-icon" size={15} />
            <span>Contrast Checker</span>
            {isStale && <span className="tab-stale-dot" title="Palette changed - refresh needed" />}
          </button>
        </nav>
      </div>

      <div className="header-right" aria-hidden="true" />
    </header>
  );
}
