# ContrastLab 🎨

> **A developer-grade Color Palette Studio and WCAG 2.1 Accessibility Contrast Matrix built with React 18 and Vite.**

ContrastLab helps designers, developers, and design-system engineers create accessible, harmonious color palettes. It calculates exact WCAG 2.1 relative luminance and contrast ratios across all color permutations, tests live text and interactive UI elements, and generates color harmony suggestions grounded in color theory.

---

## 🌟 Key Features

### 1. 🧠 Color Harmony Generator (Persistent Sidebar)
- **Harmonic Suggestions**: Generates fresh color ideas rooted in your active palette using standard color harmony angles:
  - *Complementary* ($180^\circ$)
  - *Split-Complementary* ($150^\circ / 210^\circ$)
  - *Triadic* ($120^\circ / 240^\circ$)
  - *Tetradic / Square* ($90^\circ / 270^\circ$)
  - *Analogous* ($\pm 30^\circ$)
  - *Monochromatic* ($0^\circ$)
- **Target Lightness Biasing**:
  - **Neutral**: Low-saturation tones (slate charcoals, tints, and balanced grays).
  - **Light**: High-lightness pastels and tints designed to contrast against dark backgrounds.
  - **Dark**: Deep, rich saturated tones designed to contrast against light backgrounds.
  - **Any**: Full-spectrum dynamic harmony.
- **1-Click Actions**: One-click **+ Add** to active palette, one-click **Copy HEX**, and unlimited **Generate New Colors** shuffling.

---

### 2. 🗂️ Active Palette Manager
- **Precise Input Controls**: Hex text input with real-time validation and two-way synced native color picker.
- **Curated Starter Presets**: Load pre-built palettes with one click:
  - *Antigravity Default*
  - *Modern SaaS*
  - *Warm Editorial*
  - *High Contrast*
- **Card Controls**:
  - Unobtrusive monospace displays for `#HEX`, `rgb(r, g, b)`, and Relative Luminance ($L$).
  - 1-click clipboard copy with animated visual feedback.
  - Reorder colors up/down to adjust hierarchy.
  - Inline color picker to tweak existing colors directly.
  - Dynamic high-contrast index tags (`#1`, `#2`, etc.) that automatically adapt to light and dark backgrounds.
  - Empty state with a single-click restore CTA.

---

### 3. 🔍 Directional WCAG 2.1 Contrast Matrix
- **Complete $N \times (N - 1)$ Permutation Testing**: Every color is tested against every other color in both directions (Color A as background with Color B as text, and vice versa).
- **Snapshot & Refresh Engine**: Decouples palette editing from heavy matrix calculations. If the palette changes, a banner alerts you to refresh when ready.
- **4 WCAG 2.1 Compliance Levels**:
  - ✅ **WCAG AA Normal Text** ($\ge 4.5:1$)
  - ✅ **WCAG AA Large Text** ($\ge 3.0:1$)
  - 🌟 **WCAG AAA Normal Text** ($\ge 7.0:1$)
  - 🌟 **WCAG AAA Large Text** ($\ge 4.5:1$)
- **Live Text & UI Element Previews**:
  - Sample sentence rendering: `"The quick brown fox jumps over the lazy dog"` in both large and normal typography.
  - **Interactive Button Preview**: Outline button that dynamically fills with the foreground color on hover, switches text to the background color, and provides active pressed feedback.
- **Power User Filtering & Sorting**:
  - Filter by: `All Pairs`, `Failing AA`, `Passing AA`, `AAA Perfect`.
  - Sort by: `Palette Order`, `Lowest Contrast First` (fix accessibility blockers first), `Highest Contrast First`.
  - Live statistics: Total combinations count, WCAG AA Pass Rate (%), and AAA Perfect count.

---

## 🔬 How It Works (Under the Hood)

### 1. WCAG 2.1 Relative Luminance & Contrast Formula
Relative luminance ($L$) represents the perceived brightness of a color normalized to $0$ (darkest black) and $1$ (lightest white), following the sRGB standard:

$$\text{Linearize}(C) = \begin{cases} \frac{C}{12.92} & C \le 0.03928 \\ \left(\frac{C + 0.055}{1.055}\right)^{2.4} & C > 0.03928 \end{cases}$$

$$L = 0.2126 \cdot R_{\text{linear}} + 0.7152 \cdot G_{\text{linear}} + 0.0722 \cdot B_{\text{linear}}$$

The contrast ratio between two relative luminance values ($L_1$ and $L_2$, where $L_1 \ge L_2$) is:

$$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$

### 2. Adaptive Perceived Lightness Switch
In UI elements, text and badge colors switch between dark (`#0F172A`) and light (`#FFFFFF`) based on a mathematical luminance threshold ($L > 0.20$), ensuring all metadata overlays and swatch indices remain readable across colors.

---

## 🛠️ Project Structure

```
color-palette-app/
├── public/
│   └── favicon.png            # Application favicon
├── src/
│   ├── components/
│   │   ├── ContrastChecker.jsx   # WCAG matrix, interactive previews, filters
│   │   ├── Header.jsx            # Top navbar and pill tab navigation
│   │   ├── Icons.jsx             # Lucide React icon wrappers
│   │   ├── PaletteManager.jsx    # Palette grid, inputs, card controls
│   │   └── SidebarGenerator.jsx  # HSL harmony generator with lightness bias
│   ├── styles/
│   │   └── app.css               # Design tokens, responsive breakpoints, layout
│   ├── utils/
│   │   ├── colorMath.js          # WCAG luminance, contrast ratios, RGB/HSL math
│   │   └── harmony.js            # Color harmony algorithms and biasing
│   ├── App.jsx                   # Root state & snapshot synchronization
│   ├── main.jsx                  # React 18 DOM mount point
│   └── types.js                  # Presets and constant definitions
├── index.html                    # Vite HTML root with Google Fonts
├── package.json                  # Dependencies & scripts
├── vite.config.js                # Vite configuration
└── README.md                     # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or higher)
- [pnpm](https://pnpm.io/) (or `npm`)

### 1. Installation
Clone the repository and install dependencies:

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 2. Run Local Development Server
Start the local Vite dev server:

```bash
pnpm dev
# (or: npm run dev)
```

Open your browser and navigate to **`http://localhost:3000`**.

### 3. Production Build
To create an optimized production build:

```bash
pnpm build
# (or: npm run build)
```

The compiled assets will be in the `dist/` directory.

### 4. Preview Production Build
To preview the production build locally:

```bash
pnpm preview
# (or: npm run preview)
```

---

## 💻 Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Bundler & Dev Server**: [Vite 6](https://vitejs.dev/)
- **Icon System**: [Lucide React](https://lucide.dev/)
- **Typography**: [Inter](https://fonts.google.com/specimen/Inter) & [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)
- **Styling**: Pure CSS with Custom Properties (CSS variables) & responsive fluid layouts

---

## 📄 License

MIT License. Feel free to use, modify, and distribute ContrastLab for personal or commercial projects.
