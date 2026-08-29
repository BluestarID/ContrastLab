import React, { useState, useMemo } from "react";
import {
  getContrastRatio,
  evaluateWCAG,
  hexToRgb,
  formatRgb,
} from "../utils/colorMath.js";
import {
  RefreshIcon,
  CheckIcon,
  CrossIcon,
  AlertCircleIcon,
  EyeIcon,
  SparklesIcon,
} from "./Icons.jsx";

/**
 * Interactive Preview Button Component
 * Outline 1px solid FG color (outer border, always visible).
 * On hover: Fill becomes FG color, Text becomes BG color.
 * On click/press: Opacity lowers slightly (0.75).
 * On mouse leave: Returns cleanly to default outline state.
 */
export function InteractivePreviewButton({ bgHex, fgHex }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const style = {
    backgroundColor: isHovered ? fgHex : "transparent",
    color: isHovered ? bgHex : fgHex,
    border: "none",
    outline: "1px solid " + fgHex,
    opacity: isPressed ? 0.75 : 1,
    transform: isPressed ? "scale(0.97)" : isHovered ? "translateY(-1px)" : "none",
    transition: "all 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
    cursor: "pointer",
    userSelect: "none",
  };

  return (
    <button
      type="button"
      className="sample-pill-btn"
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      title="Hover or click to preview active/hover states"
    >
      Interactive Button Preview
    </button>
  );
}

export function ContrastChecker({
  snapshotPalette,
  isStale,
  onRefresh,
  onSwitchToPalette,
}) {
  const [filterMode, setFilterMode] = useState("all");
  const [sortMode, setSortMode] = useState("default");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const contrastPairs = useMemo(() => {
    if (!snapshotPalette || snapshotPalette.length < 2) return [];

    const pairs = [];
    for (let i = 0; i < snapshotPalette.length; i++) {
      for (let j = 0; j < snapshotPalette.length; j++) {
        if (i !== j) {
          const bg = snapshotPalette[i].hex;
          const fg = snapshotPalette[j].hex;
          const ratio = getContrastRatio(fg, bg);
          const wcag = evaluateWCAG(ratio);

          pairs.push({
            id: `pair-${i}-${j}-${bg}-${fg}`,
            bgHex: bg,
            fgHex: fg,
            bgIndex: i + 1,
            fgIndex: j + 1,
            bgRgb: formatRgb(hexToRgb(bg)),
            fgRgb: formatRgb(hexToRgb(fg)),
            ratio,
            wcag,
          });
        }
      }
    }
    return pairs;
  }, [snapshotPalette]);

  const filteredPairs = useMemo(() => {
    let result = [...contrastPairs];

    if (filterMode === "failing") {
      result = result.filter((p) => !p.wcag.aaNormal);
    } else if (filterMode === "passing") {
      result = result.filter((p) => p.wcag.aaNormal);
    } else if (filterMode === "aaa") {
      result = result.filter((p) => p.wcag.aaaNormal);
    }

    if (sortMode === "lowest") {
      result.sort((a, b) => a.ratio - b.ratio);
    } else if (sortMode === "highest") {
      result.sort((a, b) => b.ratio - a.ratio);
    }

    return result;
  }, [contrastPairs, filterMode, sortMode]);

  const totalCount = contrastPairs.length;
  const passingAaCount = contrastPairs.filter((p) => p.wcag.aaNormal).length;
  const passingAaaCount = contrastPairs.filter((p) => p.wcag.aaaNormal).length;
  const passRate = totalCount > 0 ? Math.round((passingAaCount / totalCount) * 100) : 0;

  return (
    <div className="contrast-view-container" id="panel-contrast" role="tabpanel" aria-labelledby="tab-contrast">
      {isStale && (
        <div className="stale-notification-banner" role="alert">
          <div className="stale-banner-left">
            <AlertCircleIcon size={18} className="text-warning" />
            <div>
              <strong className="stale-title">Your palette has changed</strong>
              <p className="stale-desc">
                The contrast results below reflect your previous snapshot. Refresh to test your updated colors.
              </p>
            </div>
          </div>
          <button type="button" className="stale-refresh-btn" onClick={handleRefreshClick}>
            <RefreshIcon size={14} spinning={isRefreshing} />
            <span>Refresh Results</span>
          </button>
        </div>
      )}

      <section className="contrast-top-bar" aria-label="Contrast Controls">
        <div className="contrast-header-main">
          <div>
            <h2 className="section-heading">WCAG Contrast Matrix</h2>
            <p className="section-subheading">
              Testing all directional combinations (Background vs. Text) for compliance
            </p>
          </div>

          <button
            type="button"
            className={`manual-refresh-btn ${isRefreshing ? "refreshing" : ""}`}
            onClick={handleRefreshClick}
            title="Recompute contrast pairs from current palette"
          >
            <RefreshIcon size={15} spinning={isRefreshing} />
            <span>Refresh Checker</span>
          </button>
        </div>

        {totalCount > 0 && (
          <div className="contrast-stats-grid">
            <div className="stat-card">
              <span className="stat-label">Total Combinations</span>
              <span className="stat-number font-mono">{totalCount}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">WCAG AA Pass Rate</span>
              <span
                className={`stat-number font-mono ${
                  passRate >= 70 ? "text-success" : passRate >= 40 ? "text-warning" : "text-danger"
                }`}
              >
                {passRate}%
              </span>
              <span className="stat-sub">{passingAaCount} of {totalCount} pairs</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">WCAG AAA Passing</span>
              <span className="stat-number font-mono text-accent">{passingAaaCount}</span>
              <span className="stat-sub">Strict compliance (≥ 7:1)</span>
            </div>
          </div>
        )}

        {totalCount > 0 && (
          <div className="contrast-filters-row">
            <div className="filter-chips-group" role="group" aria-label="Filter Pairs">
              <button
                type="button"
                className={`filter-pill ${filterMode === "all" ? "active" : ""}`}
                onClick={() => setFilterMode("all")}
              >
                All Pairs ({totalCount})
              </button>
              <button
                type="button"
                className={`filter-pill fail-pill ${filterMode === "failing" ? "active" : ""}`}
                onClick={() => setFilterMode("failing")}
              >
                <CrossIcon size={13} />
                Failing AA ({totalCount - passingAaCount})
              </button>
              <button
                type="button"
                className={`filter-pill pass-pill ${filterMode === "passing" ? "active" : ""}`}
                onClick={() => setFilterMode("passing")}
              >
                <CheckIcon size={13} />
                Passing AA ({passingAaCount})
              </button>
              <button
                type="button"
                className={`filter-pill aaa-pill ${filterMode === "aaa" ? "active" : ""}`}
                onClick={() => setFilterMode("aaa")}
              >
                AAA Perfect ({passingAaaCount})
              </button>
            </div>

            <div className="sort-controls">
              <label htmlFor="contrast-sort" className="sort-label">
                Sort by:
              </label>
              <select
                id="contrast-sort"
                className="sort-select"
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value)}
              >
                <option value="default">Palette Order</option>
                <option value="lowest">Lowest Ratio (Fix first)</option>
                <option value="highest">Highest Ratio First</option>
              </select>
            </div>
          </div>
        )}
      </section>

      <section className="contrast-list-section" aria-label="Contrast Pairs Results">
        {!snapshotPalette || snapshotPalette.length < 2 ? (
          <div className="contrast-empty-card">
            <div className="empty-icon-wrap">
              <EyeIcon size={22} />
            </div>
            <h3 className="empty-title">Need at least 2 colors to check contrast</h3>
            <p className="empty-desc">
              Your snapshot currently has {snapshotPalette ? snapshotPalette.length : 0} color(s). Add at least two
              colors to your palette and click Refresh to test every combination.
            </p>
            <button type="button" className="load-starter-cta" onClick={onSwitchToPalette}>
              <SparklesIcon size={15} />
              <span>Go to Color Palette</span>
            </button>
          </div>
        ) : filteredPairs.length === 0 ? (
          <div className="no-filter-results">
            <p>No contrast pairs match the selected filter.</p>
            <button type="button" className="reset-filter-btn" onClick={() => setFilterMode("all")}>
              Show All Pairs
            </button>
          </div>
        ) : (
          <div className="contrast-pairs-list">
            {filteredPairs.map((pair) => {
              const { wcag } = pair;

              return (
                <article key={pair.id} className="contrast-card">
                  <div className="contrast-card-meta">
                    <div className="color-pair-identifiers">
                      <div className="color-id-item">
                        <span className="id-label">BACKGROUND</span>
                        <div className="id-swatch-wrap">
                          <span className="id-color-dot" style={{ backgroundColor: pair.bgHex }} />
                          <span className="id-hex font-mono">{pair.bgHex}</span>
                        </div>
                      </div>

                      <div className="color-id-separator">vs</div>

                      <div className="color-id-item">
                        <span className="id-label">TEXT</span>
                        <div className="id-swatch-wrap">
                          <span className="id-color-dot" style={{ backgroundColor: pair.fgHex }} />
                          <span className="id-hex font-mono">{pair.fgHex}</span>
                        </div>
                      </div>
                    </div>

                    <div className="contrast-ratio-block">
                      <div className="ratio-header">
                        <span className="ratio-label">Contrast Ratio</span>
                        <span
                          className={`ratio-prominent-badge font-mono ${
                            wcag.aaNormal ? "badge-pass" : "badge-fail"
                          }`}
                        >
                          {wcag.formattedRatio}
                        </span>
                      </div>
                    </div>

                    <div className="wcag-thresholds-matrix">
                      <div className={`threshold-badge ${wcag.aaNormal ? "pass" : "fail"}`}>
                        <div className="threshold-icon">
                          {wcag.aaNormal ? <CheckIcon size={13} /> : <CrossIcon size={13} />}
                        </div>
                        <div className="threshold-info">
                          <span className="threshold-title">AA Normal Text</span>
                          <span className="threshold-spec font-mono">≥ 4.5:1</span>
                        </div>
                        <span className="threshold-status">{wcag.aaNormal ? "PASS" : "FAIL"}</span>
                      </div>

                      <div className={`threshold-badge ${wcag.aaLarge ? "pass" : "fail"}`}>
                        <div className="threshold-icon">
                          {wcag.aaLarge ? <CheckIcon size={13} /> : <CrossIcon size={13} />}
                        </div>
                        <div className="threshold-info">
                          <span className="threshold-title">AA Large Text</span>
                          <span className="threshold-spec font-mono">≥ 3.0:1</span>
                        </div>
                        <span className="threshold-status">{wcag.aaLarge ? "PASS" : "FAIL"}</span>
                      </div>

                      <div className={`threshold-badge ${wcag.aaaNormal ? "pass" : "fail"}`}>
                        <div className="threshold-icon">
                          {wcag.aaaNormal ? <CheckIcon size={13} /> : <CrossIcon size={13} />}
                        </div>
                        <div className="threshold-info">
                          <span className="threshold-title">AAA Normal Text</span>
                          <span className="threshold-spec font-mono">≥ 7.0:1</span>
                        </div>
                        <span className="threshold-status">{wcag.aaaNormal ? "PASS" : "FAIL"}</span>
                      </div>

                      <div className={`threshold-badge ${wcag.aaaLarge ? "pass" : "fail"}`}>
                        <div className="threshold-icon">
                          {wcag.aaaLarge ? <CheckIcon size={13} /> : <CrossIcon size={13} />}
                        </div>
                        <div className="threshold-info">
                          <span className="threshold-title">AAA Large Text</span>
                          <span className="threshold-spec font-mono">≥ 4.5:1</span>
                        </div>
                        <span className="threshold-status">{wcag.aaaLarge ? "PASS" : "FAIL"}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="contrast-live-preview-box"
                    style={{ backgroundColor: pair.bgHex, color: pair.fgHex }}
                  >
                    <div className="preview-content">
                      <p className="sample-sentence-large">The quick brown fox jumps over the lazy dog</p>
                      <p className="sample-sentence-normal">
                        The quick brown fox jumps over the lazy dog. 1234567890 &amp; @#$
                      </p>
                      <div className="sample-ui-elements">
                        <InteractivePreviewButton bgHex={pair.bgHex} fgHex={pair.fgHex} />
                        <span className="sample-caption-text">Sample caption (12px text)</span>
                      </div>
                    </div>

                    <div className="preview-footer-tag">
                      <span>Live Render ({pair.fgHex} on {pair.bgHex})</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
