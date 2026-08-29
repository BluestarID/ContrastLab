import React, { useState } from "react";
import {
  normalizeHex,
  isValidHex,
  hexToRgb,
  formatRgb,
  isLightColor,
  getRelativeLuminance,
} from "../utils/colorMath.js";
import { STARTER_PRESETS } from "../types.js";
import {
  PlusIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CopyIcon,
  CheckIcon,
  SparklesIcon,
  LayersIcon,
  BookmarkIcon,
  SaveIcon,
  CrossIcon,
} from "./Icons.jsx";

export function PaletteManager({
  palette,
  onAddColor,
  onRemoveColor,
  onUpdateColor,
  onReorderColor,
  onLoadPreset,
  onClearPalette,
  savedPalettes = [],
  onSavePalette,
  onDeleteSavedPalette,
  onLoadSavedPalette,
}) {
  const [inputHex, setInputHex] = useState("#307CFF");
  const [pickerHex, setPickerHex] = useState("#307CFF");
  const [copiedKey, setCopiedKey] = useState(null);
  const [inputError, setInputError] = useState("");

  // State for Saving Palette flow
  const [isSavingPalette, setIsSavingPalette] = useState(false);
  const [paletteSaveName, setPaletteSaveName] = useState("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputHex(val);
    if (val.trim() === "") {
      setInputError("");
      return;
    }
    const normalized = normalizeHex(val);
    if (normalized) {
      setPickerHex(normalized);
      setInputError("");
    } else {
      setInputError("Invalid hex code");
    }
  };

  const handlePickerChange = (e) => {
    const val = e.target.value.toUpperCase();
    setPickerHex(val);
    setInputHex(val);
    setInputError("");
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const normalized = normalizeHex(inputHex);
    if (!normalized) {
      setInputError("Please enter a valid 3 or 6 digit hex color (e.g. #307CFF)");
      return;
    }
    onAddColor(normalized);
    setInputError("");
  };

  const handleCopyText = (text, key) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleTriggerSave = () => {
    if (!palette || palette.length === 0) return;
    setIsSavingPalette(true);
    setPaletteSaveName(`Palette ${savedPalettes.length + 1}`);
  };

  const handleConfirmSave = (e) => {
    e.preventDefault();
    if (!palette || palette.length === 0) return;
    onSavePalette(paletteSaveName);
    setIsSavingPalette(false);
    setSaveSuccessMsg("Saved to browser!");
    setTimeout(() => setSaveSuccessMsg(""), 2000);
  };

  const handleCancelSave = () => {
    setIsSavingPalette(false);
    setPaletteSaveName("");
  };

  return (
    <div className="palette-view-container" id="panel-palette" role="tabpanel" aria-labelledby="tab-palette">
      <section className="palette-input-section" aria-label="Add New Color">
        <form className="palette-input-form" onSubmit={handleAdd}>
          <div className="input-group">
            <div
              className="color-preview-trigger"
              style={{ backgroundColor: isValidHex(inputHex) ? normalizeHex(inputHex) || "#FFFFFF" : "#E2E8F0" }}
            >
              <input
                type="color"
                className="native-color-input"
                value={isValidHex(inputHex) ? normalizeHex(inputHex) || "#307CFF" : "#307CFF"}
                onChange={handlePickerChange}
                aria-label="Pick color visually"
                title="Click to open color picker"
              />
            </div>

            <div className="hex-input-wrap">
              <span className="hex-prefix">#</span>
              <input
                type="text"
                className={`hex-text-input font-mono ${inputError ? "input-has-error" : ""}`}
                value={inputHex.replace(/^#/, "")}
                onChange={(e) => handleInputChange({ target: { value: "#" + e.target.value } })}
                placeholder="307CFF"
                maxLength={7}
                aria-label="Hex color value"
              />
            </div>

            <button type="submit" className="primary-add-btn" disabled={!isValidHex(inputHex)}>
              <PlusIcon size={15} />
              <span>Add to Palette</span>
            </button>
          </div>

          {inputError && <div className="input-error-msg" role="alert">{inputError}</div>}
        </form>

        {/* Starter Presets Bar */}
        <div className="presets-bar">
          <span className="presets-title">Starter Presets:</span>
          <div className="preset-buttons">
            {STARTER_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                className="preset-btn"
                onClick={() => onLoadPreset(preset.colors)}
                title={`Load ${preset.name} palette`}
              >
                <div className="preset-dots">
                  {preset.colors.slice(0, 4).map((c, i) => (
                    <span key={i} className="preset-dot" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span>{preset.name}</span>
              </button>
            ))}

            {palette.length > 0 && (
              <button
                type="button"
                className="clear-palette-btn"
                onClick={onClearPalette}
                title="Clear all colors in palette"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Saved Palettes Bar */}
        <div className="saved-palettes-bar">
          <div className="saved-bar-header">
            <div className="saved-title-wrap">
              <BookmarkIcon size={14} className="text-accent" />
              <span className="saved-bar-title">Saved Palettes ({savedPalettes.length})</span>
            </div>

            {!isSavingPalette ? (
              <div className="saved-actions-wrap">
                {saveSuccessMsg && <span className="save-success-tag">{saveSuccessMsg}</span>}
                <button
                  type="button"
                  className="save-palette-trigger-btn"
                  onClick={handleTriggerSave}
                  disabled={!palette || palette.length === 0}
                  title="Save active palette to your browser storage"
                >
                  <SaveIcon size={13} />
                  <span>Save Current Palette</span>
                </button>
              </div>
            ) : (
              <form className="save-palette-inline-form" onSubmit={handleConfirmSave}>
                <input
                  type="text"
                  className="save-palette-input"
                  value={paletteSaveName}
                  onChange={(e) => setPaletteSaveName(e.target.value)}
                  placeholder="Palette Name"
                  maxLength={30}
                  autoFocus
                />
                <button type="submit" className="save-confirm-btn" title="Save">
                  <CheckIcon size={13} />
                  <span>Save</span>
                </button>
                <button
                  type="button"
                  className="save-cancel-btn"
                  onClick={handleCancelSave}
                  title="Cancel"
                >
                  <CrossIcon size={13} />
                </button>
              </form>
            )}
          </div>

          {savedPalettes.length > 0 ? (
            <div className="saved-palettes-list">
              {savedPalettes.map((saved) => (
                <div key={saved.id} className="saved-palette-chip">
                  <button
                    type="button"
                    className="saved-chip-load-btn"
                    onClick={() => onLoadSavedPalette(saved.colors)}
                    title={`Load "${saved.name}" (${saved.colors.length} colors)`}
                  >
                    <div className="saved-chip-dots">
                      {saved.colors.slice(0, 5).map((c, i) => (
                        <span key={i} className="saved-chip-dot" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="saved-chip-name">{saved.name}</span>
                    <span className="saved-chip-count">{saved.colors.length}</span>
                  </button>

                  <button
                    type="button"
                    className="saved-chip-del-btn"
                    onClick={() => onDeleteSavedPalette(saved.id)}
                    title={`Delete "${saved.name}"`}
                    aria-label={`Delete "${saved.name}"`}
                  >
                    <CrossIcon size={11} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="saved-empty-hint">
              No custom palettes saved yet. Click <strong>Save Current Palette</strong> to store your color set locally in your browser.
            </p>
          )}
        </div>
      </section>

      <section className="palette-grid-section" aria-label="Palette Color Cards">
        <div className="section-header-row">
          <div>
            <h2 className="section-heading">Active Palette</h2>
            <p className="section-subheading">
              {palette.length} {palette.length === 1 ? "color" : "colors"} in your design system
            </p>
          </div>
          {palette.length >= 2 && (
            <div className="reorder-tip">
              <span>Use arrows to reorder colors</span>
            </div>
          )}
        </div>

        {palette.length === 0 ? (
          <div className="empty-palette-card">
            <div className="empty-icon-wrap">
              <LayersIcon size={24} />
            </div>
            <h3 className="empty-title">Your palette is currently empty</h3>
            <p className="empty-desc">
              Add colors using the input bar above, generate harmonious tones from the left sidebar, or load one of our curated design system presets.
            </p>
            <div className="empty-actions">
              <button
                type="button"
                className="load-starter-cta"
                onClick={() => onLoadPreset(STARTER_PRESETS[0].colors)}
              >
                <SparklesIcon size={15} />
                <span>Load Antigravity Starter Set</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="palette-cards-grid">
            {palette.map((item, index) => {
              const hex = item.hex;
              const rgb = hexToRgb(hex);
              const rgbStr = formatRgb(rgb);
              const luminance = getRelativeLuminance(rgb.r, rgb.g, rgb.b);
              const isLight = isLightColor(hex);

              return (
                <div key={item.id || `${hex}-${index}`} className="palette-color-card">
                  <div className="palette-swatch-box" style={{ backgroundColor: hex }}>
                    <div className="card-top-overlay">
                      <div className="card-reorder-controls">
                        <button
                          type="button"
                          className="card-action-icon-btn"
                          disabled={index === 0}
                          onClick={() => onReorderColor(index, index - 1)}
                          title="Move earlier in palette"
                          aria-label="Move earlier"
                        >
                          <ArrowUpIcon size={13} />
                        </button>
                        <button
                          type="button"
                          className="card-action-icon-btn"
                          disabled={index === palette.length - 1}
                          onClick={() => onReorderColor(index, index + 1)}
                          title="Move later in palette"
                          aria-label="Move later"
                        >
                          <ArrowDownIcon size={13} />
                        </button>
                      </div>

                      <div className="card-right-controls">
                        <label className="card-picker-label" title="Change this color">
                          <input
                            type="color"
                            className="card-hidden-picker"
                            value={hex}
                            onChange={(e) => onUpdateColor(index, e.target.value.toUpperCase())}
                          />
                          <span className="card-picker-badge">Edit</span>
                        </label>

                        <button
                          type="button"
                          className="card-action-icon-btn delete-btn"
                          onClick={() => onRemoveColor(index)}
                          title={`Remove ${hex} from palette`}
                          aria-label={`Remove ${hex}`}
                        >
                          <TrashIcon size={13} />
                        </button>
                      </div>
                    </div>

                    {/* High-contrast order label */}
                    <div className={`swatch-center-label ${isLight ? "dark-badge" : "light-badge"}`}>
                      <span className="swatch-index-tag">#{index + 1}</span>
                    </div>
                  </div>

                  <div className="palette-card-footer">
                    <div className="color-code-row">
                      <button
                        type="button"
                        className="copyable-code-btn"
                        onClick={() => handleCopyText(hex, `hex-${index}`)}
                        title="Click to copy HEX"
                      >
                        <span className="code-label">HEX</span>
                        <span className="code-value font-mono">{hex}</span>
                        {copiedKey === `hex-${index}` ? (
                          <CheckIcon size={13} className="text-success" />
                        ) : (
                          <CopyIcon size={13} className="text-muted" />
                        )}
                      </button>
                    </div>

                    <div className="color-code-row">
                      <button
                        type="button"
                        className="copyable-code-btn"
                        onClick={() => handleCopyText(rgbStr, `rgb-${index}`)}
                        title="Click to copy RGB"
                      >
                        <span className="code-label">RGB</span>
                        <span className="code-value font-mono">{rgbStr}</span>
                        {copiedKey === `rgb-${index}` ? (
                          <CheckIcon size={13} className="text-success" />
                        ) : (
                          <CopyIcon size={13} className="text-muted" />
                        )}
                      </button>
                    </div>

                    <div className="color-meta-row">
                      <span className="meta-label">Luminance</span>
                      <span className="meta-value font-mono">{luminance.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
