# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Notion Widget Builder is a React-based visual builder for creating customizable widgets that can be embedded in Notion pages. The app allows users to configure 8 different widget types, preview them in real-time, and export standalone HTML files ready for deployment.

## Development Commands

### Setup and Development
```bash
npm install              # Install dependencies
npm run dev             # Start development server (http://localhost:3000)
npm run build           # Create production build
npm run preview         # Preview production build locally
npm run lint            # Run ESLint
```

### Deployment
```bash
npm run predeploy       # Runs build automatically
npm run deploy          # Deploy to GitHub Pages (gh-pages branch)
```

GitHub Actions automatically deploys to GitHub Pages on push to `master` branch. The workflow is defined in `.github/workflows/deploy.yml`.

## Architecture

### Widget System

All widgets follow a modular three-file pattern located in `src/widgets/<widget-name>-widget/` (note: hyphenated directory names):

1. **`config.js`** - Widget configuration schema
   - Exports a config object with `id`, `label`, `description`, `defaultConfig`, and `fields`
   - `fields` define the customization options shown in the UI builder
   - Each field has: `name`, `label`, `type`, `section`, and optional `options` for selects
   - Must import `jazerNeonTheme` from `src/theme/jazerNeonTheme.js` to use brand colors in defaults

2. **`<WidgetName>Widget.jsx`** - React component for live preview
   - Receives `config` prop containing current settings
   - Renders the widget using the configured options
   - Displayed in the builder's preview panel

3. **`export.js`** - HTML/Script generator
   - `generateWidgetHTML(config)` - Creates standalone HTML document
   - `generateWidgetScript(config)` - Generates vanilla JavaScript for the widget
   - Exports must be self-contained (no external dependencies beyond CDN fonts)

### Available Widgets

- **Clock** (`src/widgets/clock-widget/`) - Multiple styles (analog/digital/flip) with timezone support
- **Countdown** (`src/widgets/countdown-widget/`) - Countdown timer to specific dates/events
- **Counter** (`src/widgets/counter-widget/`) - Number tracker with increment/decrement
- **Weather** (`src/widgets/weather-widget/`) - Weather display with forecast support
- **Image Gallery** (`src/widgets/image-gallery-widget/`) - Image gallery with various layouts
- **Quotes** (`src/widgets/quotes-widget/`) - Rotating quote display
- **Life Progress** (`src/widgets/life-progress-bar-widget/`) - Progress bar visualization
- **Button Generator** (`src/widgets/new-button-generator-widget/`) - Custom button creator

### Main Application (`src/App.jsx`)

The main App component is very large (~25,000+ tokens) and contains:
- Widget type selection and routing
- Configuration panel with form controls
- Live preview rendering
- Export functionality (download HTML/copy code)
- Brand kit system (JAZER_BRAND theme)
- Color extraction from uploaded logos via ColorThief

### Brand System

The app includes a comprehensive theming system:

**JaZeR Neon Theme** (`src/theme/jazerNeonTheme.js`):
- 10 official brand colors (electricPurple, cosmicBlue, neonPink, sunburstGold, aetherTeal, ultraviolet, nightBlack, stardustWhite, graphite, softSlate)
- UI colors for glassmorphic effects (deepSpace, nebulaPurple, glass)
- Orbitron (headings) and Montserrat (body) Google Fonts
- Neon glow effects, gradients, and CSS animations
- Exports `fontLinks`, `cssVariables`, and `extraCSS` for standalone widget HTML

**Theme Context** (`src/contexts/ThemeContext.jsx`):
- React Context for managing theme state across the app
- Automatically detects system dark mode preference
- Provides `useTheme()` hook for accessing theme in components

**Brand Theme Generator** (`src/utils/brandThemeGenerator.js`):
- Analyzes uploaded logo images using ColorThief to extract color palette
- Generates 8 preset themes from extracted colors (Monochrome, Contrast, Vibrant, Professional, Dark, Light, Neon, Minimal)
- Uses luminance-based sorting to intelligently assign colors to different UI elements
- Each preset includes backgroundColor, clockColor, digitColor, textColor, texture, and glow settings

All widgets support light/dark mode switching and can apply both JAZER_BRAND theme and dynamically generated brand themes from uploaded logos.

### Configuration Fields

Widgets use a declarative field system defined in `config.js`:
- `type: 'text'` - Text input
- `type: 'boolean'` - Checkbox/toggle
- `type: 'select'` - Dropdown with `options` array (each option has `label` and `value`)
- `type: 'color'` - Color picker
- `section` - Groups fields in UI sections (common sections: 'time', 'style', 'typography', 'background', 'theme', 'effects', 'interactive', 'appearance', 'features', 'analog')

The `defaultConfig` object in each widget's config defines all available settings and their default values. These defaults should use `jazerNeonTheme.colors.*` constants for consistency.

#### Common Configuration Sections

Organize widget fields into logical sections for better UI grouping:
- **`time`** - Time-related settings (format, timezone, date display)
- **`style`** - Visual style options (size, type, layout)
- **`typography`** - Font and text settings
- **`background`** - Background colors and textures
- **`theme`** - Preset theme selection
- **`appearance`** - Light/dark mode settings
- **`effects`** - Visual effects (glow, gradient, shadows)
- **`interactive`** - Interactive features (modes, controls)
- **`features`** - Additional feature toggles
- **`analog`** - Analog clock-specific settings (for clock widgets)

## Tech Stack

- **React 19.2.0** - UI framework
- **Vite** (rolldown-vite 7.2.5) - Build tool with Rolldown bundler
- **Tailwind CSS 3.4.18** - Utility-first styling
- **Lucide React 0.554.0** - Icon library
- **ColorThief 2.6.0** - Extract colors from uploaded brand logos
- **ESLint 9** - Linting with flat config format

## Build Configuration

### Vite (`vite.config.js`)
- Base path: `/` (configured for custom domain: notion.jazer-music.com)
- Output: `dist/` directory
- Code splitting: React/ReactDOM in `vendor` chunk, Lucide icons in `icons` chunk
- Dev server: Port 3000 with auto-open

### Tailwind (`tailwind.config.js`)
- Scans `index.html` and all files in `src/**/*.{js,ts,jsx,tsx}`
- No custom theme extensions currently

### ESLint (`eslint.config.js`)
- Flat config format (ESLint 9+)
- React Hooks and React Refresh plugins
- Rule: Ignore unused vars starting with uppercase or underscore (for React components/constants)

## Adding a New Widget

1. Create directory: `src/widgets/<widget-name>-widget/` (use hyphenated lowercase naming)
2. Create `config.js`:
   - Import `jazerNeonTheme` from `../../theme/jazerNeonTheme`
   - Export config object with `id`, `label`, `description`, `defaultConfig`, and `fields`
   - Use `jazerNeonTheme.colors.*` for default color values
   - Include both `lightMode` and `darkMode` color configurations in defaults
3. Create `<WidgetName>Widget.jsx`:
   - Export React component that receives `config` prop
   - Implement widget rendering logic based on config values
   - Support appearance modes (system/light/dark)
4. Create `export.js`:
   - Import `jazerNeonTheme` from `../../theme/jazerNeonTheme`
   - Export `generateWidgetHTML(config)` function that returns complete standalone HTML
   - Export `generateWidgetScript(config)` function that returns vanilla JS code
   - Include `jazerNeonTheme.fontLinks` in HTML head
   - Include `jazerNeonTheme.cssVariables` and `jazerNeonTheme.extraCSS` in style tags
   - Ensure zero external dependencies (except CDN fonts)
5. Register in `src/App.jsx`:
   - Import config, widget component, and export functions
   - Add to widget selection/routing logic
   - Add to configuration form rendering
   - Add case in export handler

## Important Notes

- **Widget exports must be completely standalone** - no React, no external dependencies (except Google Fonts CDN). The exported HTML files run in Notion embeds without access to npm packages.
- **Always use `jazerNeonTheme` constants** - Import from `src/theme/jazerNeonTheme.js` and use `jazerNeonTheme.colors.*` for all default color values to maintain consistency
- **Light/Dark mode support required** - All widgets must have `lightMode` and `darkMode` color configurations in their `defaultConfig`
- **Appearance modes** - The app supports `appearance: 'system'|'light'|'dark'` for theme switching
- **Background textures** - Implemented as inline SVG data URIs or CSS patterns (noise, stars, dots, grid, waves)
- **Responsive sizing** - Widgets can use container queries when `responsiveSizing: true` is enabled
- **Brand logo uploads** - Use `src/components/BrandLogoUploader.jsx` with ColorThief to extract palette and generate brand presets via `brandThemeGenerator.js`

## Deployment Context

The application is deployed to GitHub Pages via GitHub Actions:
- Trigger: Push to `master` branch or manual workflow dispatch
- Build: Node 20, `npm ci`, `npm run build`
- Output: `dist/` folder deployed to GitHub Pages
- Custom domain: notion.jazer-music.com

## File Naming Conventions

**Active widget directories** use hyphenated lowercase naming: `clock-widget/`, `countdown-widget/`, `counter-widget/`, etc.

**Note**: Legacy directories may exist in the repository (e.g., old uppercase or non-hyphenated names). The current standard is hyphenated lowercase for all new widgets.
