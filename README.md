# ContrastLab — Color Palette & Accessibility Contrast Studio

A single-page React web application designed for building color palettes, validating WCAG 2.1 contrast compliance, and generating harmonious colors with lightness biasing.

---

## Features

### 1. Persistent Left Sidebar: Color Generator
- **Harmonic color generation** grounded in your active palette using standard color harmony models (Complementary, Split-Complementary, Triadic, Tetradic, Analogous, Monochromatic).
- **Target Lightness Biasing**:
  - **Neutral**: Low-saturation tones (tints, slate charcoals, and balanced greys).
  - **Light**: High lightness pastels and tints designed to contrast cleanly against dark backgrounds.
  - **Dark**: Low lightness, deep saturated tones designed to contrast cleanly against light backgrounds.
  - **Any**: Full dynamic spectrum harmony.
- **Fast / Unlimited Shuffle**: Re-roll fresh suggestions instantly with one click.
- **1-Click Add**: Click the `+` button on any swatch to instantly add it to your palette.
- **1-Click Copy**: Click the HEX code to copy it to your clipboard.

### 2. Tab A: Color Palette Manager
- **Input Controls**: Hex code input with real-time validation + synced native color picker.
- **Starter Presets**: Instant load for "Antigravity Default", "Modern SaaS", "Warm Editorial", and "High Contrast".
- **Large Swatch Cards**:
  - Unobtrusive monospace typography displaying `#HEX` and `rgb(r, g, b)`.
  - Relative luminance metric ($L$).
  - 1-click clipboard copying with visual confirmation.
  - Interactive reordering (move up / down / earlier / later).
  - Inline color picker to modify existing colors in place.
  - Color removal / deletion.
- **Empty State**: Friendly CTA and preset loader when palette is cleared.

### 3. Tab B: Accessibility Contrast Checker
- **Complete $N \times (N - 1)$ Pair Testing**: Tests every color against every other color as both background and text interchangeably (non-deduplicated directional permutations).
- **Manual Snapshot & Refresh Workflow**:
  - Contrast pairs are calculated from a stable snapshot to prevent jarring UI rebuilds while actively editing colors.
  - When the palette is modified in Tab A, a subtle notification banner indicates that the palette has changed and prompts you to refresh.
  - One-click manual Refresh button recalculates all pairs instantly.
- **Live Text Rendering**:
  - Real-time rendered sentence: `"The quick brown fox jumps over the lazy dog"` in actual foreground and background color combinations.
  - Additional rendered interactive button pill and caption samples.
- **Accurate WCAG 2.1 Compliance Metrics**:
  - Exact gamma-corrected relative luminance formula:
    $$c_{\text{linear}} = \begin{cases} \frac{c}{12.92} & c \le 0.03928 \\ \left(\frac{c + 0.055}{1.055}\right)^{2.4} & c > 0.03928 \end{cases}$$
    $$L = 0.2126 \cdot R_{\text{linear}} + 0.7152 \cdot G_{\text{linear}} + 0.0722 \cdot B_{\text{linear}}$$
  - Contrast Ratio:
    $$\text{Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05} \quad (L_1 \ge L_2)$$
  - Scannable Pass/Fail Badges for all 4 WCAG levels:
    - **WCAG AA Normal Text**: $\ge 4.5:1$
    - **WCAG AA Large Text**: $\ge 3.0:1$
    - **WCAG AAA Normal Text**: $\ge 7.0:1$
    - **WCAG AAA Large Text**: $\ge 4.5:1$
- **Power User Filtering & Sorting**:
  - Filter by: `All Pairs`, `Failing AA`, `Passing AA`, `AAA Perfect`.
  - Sort by: `Palette Order`, `Lowest Contrast First` (find issues immediately), `Highest Contrast First`.
  - Real-time statistics: Total combinations, AA Pass Rate (%), AAA Pass Count.

---

## Design System & Theme

- **Primary Background**: `#FFFFFF`
- **Accent Color**: `#307CFF`
- **Typography**: Inter (UI labels) + JetBrains Mono / SFMono (Color values & ratios)
- **Accessible Badges**: Clear icons (Checkmark / Cross) paired with high-contrast text and colors.
- **Responsive**: Adapts gracefully across desktop, tablet, and mobile viewports.
- **Accessibility**: Visible `:focus-visible` focus indicators and `prefers-reduced-motion` compliance.

---

## How to Run

### Option 1: Direct in Browser
Double-click `index.html` or open it directly in any modern browser (Chrome, Arc, Safari, Firefox, Edge).

### Option 2: Local Python Server
Run the included python runner:
```bash
python3 serve.py
```
This opens `http://localhost:3000` automatically.
