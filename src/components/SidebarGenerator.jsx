import React, { useState, useEffect, useCallback } from "react";
import { BIAS_MODES } from "../types.js";
import { generateHarmoniousPalette } from "../utils/harmony.js";
import { isLightColor } from "../utils/colorMath.js";
import { ShuffleIcon, PlusIcon, SparklesIcon, CheckIcon } from "./Icons.jsx";

export function SidebarGenerator({ palette, onAddColor }) {
  const [biasMode, setBiasMode] = useState(BIAS_MODES.ANY);
  const [swatches, setSwatches] = useState([]);
  const [copiedHex, setCopiedHex] = useState(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);
  const [isShuffling, setIsShuffling] = useState(false);

  const paletteRef = React.useRef(palette);
  paletteRef.current = palette;

  const handleGenerate = useCallback((targetBias) => {
    const activeBias = targetBias || biasMode;
    setIsShuffling(true);
    const newSwatches = generateHarmoniousPalette(paletteRef.current, activeBias, 8);
    setSwatches(newSwatches);
    setTimeout(() => setIsShuffling(false), 200);
  }, [biasMode]);

  // Initial generation on mount only
  useEffect(() => {
    handleGenerate(biasMode);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBiasSelect = (filterId) => {
    setBiasMode(filterId);
    handleGenerate(filterId);
  };

  const handleCopy = (hex, e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const handleAdd = (swatch, e) => {
    e.stopPropagation();
    onAddColor(swatch.hex);
    setRecentlyAddedId(swatch.id);
    setTimeout(() => setRecentlyAddedId(null), 1200);
  };

  return (
    <aside className="sidebar-generator" aria-label="Color Harmony Generator">
      <div className="sidebar-header">
        <div className="sidebar-title-row">
          <div className="sidebar-title-icon">
            <SparklesIcon size={16} className="text-accent" />
          </div>
          <div>
            <h2 className="sidebar-title">Color Generator</h2>
            <p className="sidebar-subtitle">Harmonious suggestions for your palette</p>
          </div>
        </div>

        <div className="bias-filters-group">
          <span className="bias-label">Target Lightness:</span>
          <div className="bias-chips" role="group" aria-label="Lightness Bias Filter">
            {[
              { id: BIAS_MODES.ANY, label: "Any", desc: "Full spectrum harmony" },
              { id: BIAS_MODES.LIGHT, label: "Light", desc: "Pastels & tints for dark backgrounds" },
              { id: BIAS_MODES.DARK, label: "Dark", desc: "Deep rich tones for light backgrounds" },
              { id: BIAS_MODES.NEUTRAL, label: "Neutral", desc: "Low-saturation background greys" },
            ].map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={`bias-chip ${biasMode === filter.id ? "active" : ""}`}
                onClick={() => handleBiasSelect(filter.id)}
                title={filter.desc}
                aria-pressed={biasMode === filter.id}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={`generate-btn ${isShuffling ? "shuffling" : ""}`}
          onClick={() => handleGenerate(biasMode)}
          title="Roll fresh harmonious color suggestions"
        >
          <ShuffleIcon size={16} />
          <span>Generate New Colors</span>
        </button>
      </div>

      <div className="sidebar-swatches-section">
        <div className="swatches-header">
          <span className="swatches-count">Suggestions ({swatches.length})</span>
          <span className="swatches-hint">Click + to add to palette</span>
        </div>

        <div className="swatches-grid">
          {swatches.map((swatch) => {
            const isLight = isLightColor(swatch.hex);
            const isCopied = copiedHex === swatch.hex;
            const isAdded = recentlyAddedId === swatch.id;

            return (
              <div
                key={swatch.id}
                className="generator-swatch-card"
                style={{ backgroundColor: swatch.hex }}
              >
                <div className={`swatch-card-content ${isLight ? "dark-text" : "light-text"}`}>
                  <div className="swatch-top-info">
                    <span className="swatch-rule-tag">{swatch.rule}</span>
                  </div>

                  <div className="swatch-bottom-info">
                    <button
                      type="button"
                      className="swatch-hex-btn font-mono"
                      onClick={(e) => handleCopy(swatch.hex, e)}
                      title={`Copy ${swatch.hex}`}
                    >
                      {isCopied ? (
                        <span className="copied-label">
                          <CheckIcon size={12} /> Copied
                        </span>
                      ) : (
                        <span className="hex-label">{swatch.hex}</span>
                      )}
                    </button>

                    <button
                      type="button"
                      className={`swatch-add-btn ${isAdded ? "added" : ""}`}
                      onClick={(e) => handleAdd(swatch, e)}
                      title={`Add ${swatch.hex} to palette`}
                      aria-label={`Add ${swatch.hex} to palette`}
                    >
                      {isAdded ? (
                        <>
                          <CheckIcon size={13} />
                          <span className="btn-label">Added</span>
                        </>
                      ) : (
                        <>
                          <PlusIcon size={13} />
                          <span className="btn-label">Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="sidebar-footer">
        <p className="sidebar-footer-tip">
          💡 <strong>Tip:</strong> Need to fix failing contrast? Choose <strong>Light</strong> or <strong>Dark</strong> to find accessible pair colors.
        </p>
      </div>
    </aside>
  );
}
