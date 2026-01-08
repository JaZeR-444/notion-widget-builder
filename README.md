<div align="center">

<img src="./Notion Widget Builder Logo.svg" alt="Notion Widget Builder Logo" width="400" />

# 🎨 Notion Widget Builder

### *Transform Your Notion Workspace with Beautiful, Custom Widgets*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Launch_Builder-8B5CF6?style=for-the-badge)](https://jazer-444.github.io/notion-widget-builder/)
[![License](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](./LICENSE)
[![Made with React](https://img.shields.io/badge/Made_with-React_19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)

<img src="./Notion Widget Builder Icon (100 x 100 px).svg" alt="App Icon" width="100" />

**A powerful visual builder for creating stunning, fully customizable Notion widgets.**  
No coding required • Real-time preview • One-click export • Works anywhere

[✨ Features](#-features) • [🚀 Quick Start](#-quick-start) • [📦 Widgets](#-widget-catalog) • [🎯 Usage Guide](#-how-to-use) • [🛠️ Tech Stack](#️-tech-stack)

</div>

---

## ✨ Features

### 🎨 **Visual Builder Interface**
- ⚡ **Real-time Preview** - See your widget update instantly as you customize
- 📐 **Resizable Canvas** - Test at any size before exporting
- 🎛️ **Intuitive Controls** - Easy-to-use configuration panels for every widget
- 🌈 **Smart Color Picker** - Brand presets + custom palette support
- 💾 **Auto-save Settings** - Never lose your work

### 🚀 **Export & Integration**
- 📥 **One-Click Download** - Get standalone HTML files ready to host
- 📋 **Copy to Clipboard** - Instant code copy for quick embedding
- 🌐 **Universal Compatibility** - Works in Notion, websites, blogs, anywhere
- 🎯 **Zero Dependencies** - Fully self-contained (except Google Fonts CDN)
- 🔗 **Multiple Hosting Options** - GitHub Pages, Vercel, Netlify, and more

### 🌟 **Smart Brand System**
- 🎨 **Logo Color Extraction** - Upload any logo, auto-extract 8-color theme
- 🌈 **10-Color Neon Palette** - Official JaZeR cyberpunk brand colors
- 🎭 **8 Auto Presets** - Monochrome, Contrast, Vibrant, Professional, Dark, Light, Neon, Minimal
- 🌓 **Intelligent Theme Switching** - System-aware light/dark mode support
- 💎 **Custom Color Palettes** - Full control over every color element

### 🎯 **Widget Capabilities**
- 📦 **8+ Widget Types** - Clocks, weather, galleries, counters, and more
- ⚙️ **Fully Customizable** - Control colors, fonts, sizes, effects, animations
- 📱 **Responsive Design** - Automatically adapts to mobile, tablet, and desktop
- ♿ **Accessibility First** - WCAG AA compliant with keyboard navigation
- ✨ **Visual Effects** - Neon glows, gradients, glassmorphism, animations

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 9+ (included with Node.js)
- **Git** ([Download](https://git-scm.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/notion-widget-builder.git
cd notion-widget-builder

# Install dependencies
npm install

# Start development server (opens at http://localhost:3000)
npm run dev
```

### Build & Preview

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

### Deploy to GitHub Pages

```bash
# Build and deploy in one command
npm run deploy
```

> **Note:** The app is configured for GitHub Pages deployment at `https://jazer-444.github.io/notion-widget-builder/`. Update `base` in `vite.config.js` for custom domains.

---

## 📦 Widget Catalog

### ⏰ Clock Widget
**The Ultimate Time Display**
- 🕐 **12+ Display Styles** - Analog, digital, flip, minimalist, and more
- 🌍 **Timezone Support** - Show time for any location worldwide
- ⏱️ **Timer & Stopwatch** - Built-in productivity tools
- 🎨 **Custom Fonts** - Choose from Google Fonts library
- ⚙️ **Full Customization** - Colors, sizes, formats (12/24hr)

### 🌤️ Weather Widget
**Real-time Weather Information**
- 🌡️ **Current Conditions** - Temperature, humidity, wind speed, pressure
- 📅 **7-Day Forecast** - Plan ahead with extended forecasts
- 📍 **Location-Based** - Automatic geolocation or manual city search
- 🌅 **Sunrise/Sunset** - Golden hour times included
- 🎨 **4 Layout Styles** - Compact, detailed, card, and minimal views
- 🌐 **Open-Meteo API** - Free, accurate weather data

### ⏳ Countdown Widget
**Event Countdown Timer**
- 📆 **Custom Target Dates** - Count down to any date and time
- 🎉 **Confetti Effect** - Celebrate when countdown reaches zero
- 🔄 **Past Date Handling** - Automatically switches to "time since" mode
- 💫 **Flip Animation** - Smooth, animated number transitions
- 🏷️ **Custom Labels** - Personalize days/hours/minutes/seconds text

### 🔢 Counter Widget
**Simple Number Tracker**
- ➕➖ **Increment/Decrement** - Track any number up or down
- 🎯 **Min/Max Limits** - Set boundaries for your counter
- 🔄 **Reset Function** - Quick return to starting value
- 📊 **Step Values** - Count by 1s, 5s, 10s, or any custom amount
- 🎨 **Goal Progress** - Visual progress bar towards target

### 🖼️ Image Gallery Widget
**Beautiful Image Showcase**
- 🎭 **Multiple Layouts** - Grid, carousel, masonry styles
- 🔍 **Lightbox View** - Full-screen image viewing
- 📝 **Caption Support** - Add descriptions to each image
- 🎨 **Customizable Spacing** - Control gaps and padding
- 🖼️ **Unlimited Images** - Add as many images as needed

### 💬 Quotes Widget
**Inspirational Quote Display**
- 📚 **Custom Quote Lists** - Add your own motivational quotes
- 🔄 **Auto-rotation** - Automatically cycle through quotes
- 🌐 **API Integration** - Optional fetch from quote APIs
- ✨ **Beautiful Typography** - Eye-catching text styling
- 🎨 **Author Display** - Show quote sources

### 🔘 Button Generator Widget
**Custom Styled Buttons**
- 🎨 **Multiple Styles** - Solid, outline, neon glow effects
- 😀 **Emoji Support** - Add icons to buttons
- 🔗 **Action Links** - Link buttons to any URL
- ✨ **Hover Effects** - Interactive animations on mouse-over
- 🌈 **Color Presets** - Quick styling with brand colors

### 📊 Life Progress Bar Widget
**Visual Time Tracker**
- 📅 **Multiple Time Periods** - Year, month, week, day progress
- 📈 **Progress Bars** - Visual representation of time passing
- 💪 **Motivational Display** - Encourages making the most of your time
- 🎯 **Customizable Metrics** - Choose which time periods to track

### All Widgets Include:
✅ **Light/Dark Mode** - Automatic system detection or manual toggle  
✅ **Brand Themes** - Apply JaZeR colors or your own logo palette  
✅ **Responsive Sizing** - Adapts to any screen size  
✅ **Background Textures** - Stars, noise, dots, grid, waves  
✅ **Export Ready** - One-click HTML download  
✅ **Zero Dependencies** - Self-contained and lightweight

---

## 🎯 How to Use

### Getting Started in 3 Steps

#### 1️⃣ Build Your Widget
1. **Choose a Widget** - Select from 8+ widget types
2. **Customize Everything** - Use intuitive controls to adjust:
   - 🎨 Colors (brand presets or custom)
   - 📝 Typography (fonts, sizes, weights)
   - 📐 Layout (dimensions, spacing, alignment)
   - ✨ Effects (glows, gradients, shadows)
   - ⚙️ Widget-specific features
3. **Preview in Real-time** - See changes instantly
4. **(Optional)** Upload your logo to auto-extract brand colors

#### 2️⃣ Export Your Widget
Choose your preferred method:
- **📥 Download HTML** - Get a standalone `.html` file
- **📋 Copy Code** - Copy to clipboard for quick paste

#### 3️⃣ Host & Embed

**Quick Hosting Options:**

<details>
<summary><b>📘 GitHub Pages (Free, Recommended)</b></summary>

```bash
# Create new repository on GitHub
git init
git add your-widget.html
git commit -m "Add Notion widget"
git branch -M main
git remote add origin https://github.com/yourusername/notion-widgets.git
git push -u origin main

# Enable GitHub Pages in Settings → Pages → Source: main branch
# Your widget URL: https://yourusername.github.io/notion-widgets/your-widget.html
```
</details>

<details>
<summary><b>⚡ Vercel (Fastest Deployment)</b></summary>

```bash
npm i -g vercel
vercel --prod
# Get instant URL
```
</details>

<details>
<summary><b>🎨 Netlify Drop (No CLI)</b></summary>

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag & drop your HTML file
3. Get instant public URL
</details>

<details>
<summary><b>🔥 Other Options</b></summary>

- **Firebase Hosting**: `firebase deploy`
- **Cloudflare Pages**: `npx wrangler pages deploy`
- **Surge**: `surge your-widget.html`
- **AWS S3**: Upload to S3 bucket with public access
</details>

#### 4️⃣ Add to Notion

1. Open your Notion page
2. Type `/embed` and press Enter
3. Paste your widget URL
4. Resize the embed block to fit
5. 🎉 Done!

### 💡 Pro Tips

- **🎨 Brand Consistency**: Upload your logo once to generate 8 themed color variations
- **📐 Test Sizes**: Use the resizable canvas to preview at different dimensions
- **🌓 Dark Mode**: Enable automatic theme switching for day/night compatibility
- **🔄 Updates**: Re-export and replace the hosted file to update your widget
- **📱 Mobile**: All widgets are responsive and mobile-optimized
- **♿ Accessibility**: Widgets include keyboard navigation and screen reader support

---

## 🛠️ Tech Stack

Built with modern, cutting-edge technologies for optimal performance and developer experience.

### Core Framework
- ⚛️ **React 19.2.0** - Latest React with improved performance and concurrent features
- ⚡ **Vite 7.2.5 (Rolldown)** - Lightning-fast build tool with next-gen bundler
- 🎨 **TailwindCSS 3.4.18** - Utility-first CSS framework for rapid UI development

### UI & Interactions
- 🎯 **Lucide React 0.554.0** - Beautiful, customizable icon library (1000+ icons)
- 🌈 **ColorThief 2.6.0** - Intelligent color extraction from images using k-means clustering
- 🆔 **nanoid 5.1.6** - Tiny, secure URL-friendly unique ID generator

### APIs & Data
- 🌤️ **Open-Meteo API** - Free, accurate weather data with no API key required
- 📍 **Geolocation API** - Browser-native location detection

### Development Tools
- 📝 **ESLint 9.x** - Code quality with modern flat config format
- 🔧 **PostCSS + Autoprefixer** - Automatic CSS vendor prefixing
- 🎨 **PropTypes** - Runtime type checking for React props

### Architecture Highlights

```
📁 Project Structure
├── src/
│   ├── widgets/          # 8+ modular widget implementations
│   │   ├── clock-widget/
│   │   │   ├── config.js          # Configuration schema
│   │   │   ├── ClockWidget.jsx    # React preview component
│   │   │   └── export.js          # Standalone HTML generator
│   │   ├── weather-widget/
│   │   ├── countdown-widget/
│   │   └── ...
│   ├── theme/            # Brand system & design tokens
│   │   └── jazerNeonTheme.js
│   ├── contexts/         # React Context providers
│   │   └── ThemeContext.jsx
│   ├── utils/            # Helper functions
│   │   └── brandThemeGenerator.js
│   ├── components/       # Reusable UI components
│   └── App.jsx           # Main application
├── public/               # Static assets
└── dist/                 # Production build output
```

### Widget Architecture Pattern

Every widget follows a consistent **three-file modular pattern**:

1. **`config.js`** - Schema & defaults
   - Widget metadata (id, label, description)
   - Default configuration values
   - Field definitions for UI controls
   - Brand theme integration

2. **`Widget.jsx`** - React preview
   - Live preview component
   - Receives configuration props
   - Supports light/dark/system modes
   - Real-time updates

3. **`export.js`** - Standalone generator
   - `generateWidgetHTML()` - Complete HTML document
   - `generateWidgetScript()` - Vanilla JavaScript
   - Zero external dependencies
   - Inline styles and fonts

### Key Technical Features

✨ **Glassmorphic UI** - Backdrop blur, transparency effects, neon borders  
📊 **Container Queries** - Responsive widgets that adapt to embed size  
🎨 **SVG Textures** - Inline data URIs for stars, noise, dots, grid, waves  
🌓 **Theme System** - System preference detection + manual overrides  
♿ **WCAG AA Compliant** - Accessible color contrast and keyboard navigation  
📦 **Code Splitting** - Optimized chunks for faster load times  
🔒 **Type Safety** - PropTypes validation throughout

---

## 🛠️ Tech Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI framework with latest features |
| **Vite** | 7.2.5 (Rolldown) | Lightning-fast build tool with Rolldown bundler |
| **TailwindCSS** | 3.4.18 | Utility-first styling framework |
| **Lucide React** | 0.554.0 | Beautiful icon library (1000+ icons) |
| **ColorThief** | 2.6.0 | AI-powered color extraction from images |
| **ESLint** | 9.x | Code quality with flat config format |

### Build Configuration

**Vite** (`vite.config.js`):
- Base path: `/` (custom domain: jazer-444.github.io/notion-widget-builder)
- Code splitting: React vendor chunk + icon chunk optimization
- Dev server: Port 3000 with auto-open browser
- Output: `dist/` with optimized assets

**Tailwind** (`tailwind.config.js`):
- Scans: `index.html` + `src/**/*.{js,ts,jsx,tsx}`
- Custom utilities: JaZeR brand colors, neon glow shadows, gradients
- Responsive breakpoints: Mobile-first approach

**ESLint** (`eslint.config.js`):
- Flat config format (ESLint 9+)
- React Hooks plugin + React Refresh
- Ignore unused vars starting with uppercase/underscore

### Development Scripts

```bash
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # Run ESLint checks
npm run deploy     # Build + deploy to GitHub Pages
```

### Project Structure

```
notion-widget-builder/
├── src/
│   ├── widgets/                  # Widget modules (8 types)
│   │   ├── clock-widget/
│   │   │   ├── config.js         # Widget configuration schema
│   │   │   ├── ClockWidget.jsx   # React component for preview
│   │   │   └── export.js         # HTML/JS generator
│   │   ├── countdown-widget/
│   │   ├── counter-widget/
│   │   ├── weather-widget/
│   │   ├── image-gallery-widget/
│   │   ├── quotes-widget/
│   │   ├── life-progress-bar-widget/
│   │   └── new-button-generator-widget/
│   ├── theme/
│   │   └── jazerNeonTheme.js     # Brand theme constants
│   ├── contexts/
│   │   └── ThemeContext.jsx      # React Context for theming
│   ├── utils/
│   │   └── brandThemeGenerator.js # Logo color extraction
│   ├── components/
│   │   └── BrandLogoUploader.jsx # Logo upload UI
│   ├── App.jsx                   # Main application (~25,000+ tokens)
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles + Tailwind
├── public/                       # Static assets
├── dist/                         # Production build output
├── index.html                    # HTML entry point
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
├── eslint.config.js              # ESLint configuration
└── package.json                  # Dependencies + scripts
```

### Widget Architecture

All widgets follow a **modular three-file pattern**:

1. **`config.js`** - Configuration schema
   - `id`, `label`, `description`
   - `defaultConfig` with all settings
   - `fields` array defining UI controls
   - Must import `jazerNeonTheme` for brand consistency

2. **`<WidgetName>Widget.jsx`** - React preview component
   - Receives `config` prop
   - Renders live preview in builder
   - Supports light/dark/system appearance modes

3. **`export.js`** - Standalone generator
   - `generateWidgetHTML(config)` - Complete HTML document
   - `generateWidgetScript(config)` - Vanilla JavaScript
   - Zero dependencies (except Google Fonts CDN)
   - Embeds `jazerNeonTheme` fonts, variables, and animations

### Key Features

- **Glassmorphic UI** - Backdrop blur, transparency, neon borders
- **Container Queries** - Responsive widgets adapt to embed size
- **SVG Textures** - Stars, noise, dots, grid, waves (inline data URIs)
- **Dark Mode First** - System preference detection + manual toggle
- **Accessibility** - WCAG AA contrast, focus states, keyboard navigation
- **Zero Config** - Works out of the box, optional customization

---

## 🎨 Brand System & Customization

### 🌈 JaZeR Neon Theme

Built-in cyberpunk color palette with 10 carefully crafted colors:

| Color | Hex | Purpose |
|-------|-----|---------|
| 🟣 **Electric Purple** | `#8B5CF6` | Primary brand, headings, CTAs |
| 🔵 **Cosmic Blue** | `#3B82F6` | Links, interactive elements |
| 🩷 **Neon Pink** | `#EC4899` | Highlights, hover states |
| 🟡 **Sunburst Gold** | `#F59E0B` | Warnings, attention |
| 🩵 **Aether Teal** | `#06B6D4` | Info states, accents |
| 🟣 **Ultraviolet** | `#A78BFA` | Secondary highlights |
| ⚫ **Night Black** | `#0B0E12` | Dark backgrounds |
| ⚪ **Stardust White** | `#F8F9FF` | Light text |
| ⬛ **Graphite** | `#1F2937` | Cards, panels |
| 🔘 **Soft Slate** | `#94A3B8` | Borders, disabled states |

### 🎭 Logo Color Extraction

Upload any logo image to automatically extract an 8-color theme using ColorThief's intelligent k-means clustering:

**8 Auto-Generated Presets:**
1. **Monochrome** - Single dominant hue variations
2. **Contrast** - High contrast pairs for readability
3. **Vibrant** - Bright, energetic colors
4. **Professional** - Muted, balanced tones
5. **Dark** - Deep tones for dark mode
6. **Light** - Bright tones for light mode
7. **Neon** - High saturation cyberpunk glow
8. **Minimal** - Subtle, understated palette

### ✨ Visual Effects

All widgets support:
- 💫 **Neon Glow** - Text and border glows
- 🌈 **Gradients** - Multi-color smooth transitions
- 🌟 **Glassmorphism** - Backdrop blur and transparency
- 🎨 **Background Textures** - Stars, noise, dots, grid, waves
- 🌓 **Theme Switching** - Automatic light/dark mode detection

---

## 🚢 Deployment

### GitHub Pages (Automated CI/CD)

The repository includes automated deployment via GitHub Actions:

```yaml
Trigger: Push to 'master' branch
Build: Node 20 → npm ci → npm run build
Deploy: dist/ → GitHub Pages (gh-pages branch)
Live URL: https://jazer-444.github.io/notion-widget-builder/
```

### Manual Deployment

<details>
<summary><b>📘 GitHub Pages</b></summary>

```bash
# Using gh-pages package (recommended)
npm run deploy

# Manual deployment
npm run build
git add dist -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```
</details>

<details>
<summary><b>⚡ Vercel</b></summary>

```bash
npm i -g vercel
vercel --prod
```
</details>

<details>
<summary><b>🎨 Netlify</b></summary>

**Option A: Drag & Drop**
1. Visit [app.netlify.com/drop](https://app.netlify.com/drop)
2. Run `npm run build`
3. Drag `dist/` folder

**Option B: Git Integration**
- Build command: `npm run build`
- Publish directory: `dist`
</details>

<details>
<summary><b>☁️ Cloudflare Pages</b></summary>

```bash
npm run build
npx wrangler pages deploy dist
```
</details>

---

## 📚 Documentation

### Core Documentation
- **[BRAND_GUIDELINES.md](./BRAND_GUIDELINES.md)** - Complete brand specifications
- **[BRAND_IMPLEMENTATION_SUMMARY.md](./BRAND_IMPLEMENTATION_SUMMARY.md)** - Implementation details
- **[FEATURE_VALIDATION_REPORT.md](./FEATURE_VALIDATION_REPORT.md)** - Feature audit

### Brand Theme System
- **[BRAND_THEME_GENERATOR_GUIDE.md](./BRAND_THEME_GENERATOR_GUIDE.md)** - Theme generator documentation
- **[BRAND_QUICK_REFERENCE.md](./BRAND_QUICK_REFERENCE.md)** - Quick developer reference

### Development
- **[WIDGET_FEATURE_AUDIT.md](./WIDGET_FEATURE_AUDIT.md)** - Widget documentation
- **[FINAL_WIDGET_LIST.md](./FINAL_WIDGET_LIST.md)** - Current widget registry

---

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-widget`)
3. Follow brand guidelines (see `BRAND_GUIDELINES.md`)
4. Test changes (`npm run dev`)
5. Lint code (`npm run lint`)
6. Commit (`git commit -m "feat: Add amazing widget"`)
7. Push (`git push origin feature/amazing-widget`)
8. Open Pull Request

### Adding New Widgets

Each widget follows a three-file pattern:

1. **`src/widgets/widget-name/config.js`** - Schema & defaults
2. **`src/widgets/widget-name/WidgetName.jsx`** - React preview
3. **`src/widgets/widget-name/export.js`** - HTML generator

See `CLAUDE.md` for detailed instructions.

### Code Standards

- **Naming**: Hyphenated lowercase directories (`clock-widget/`)
- **Colors**: Use `jazerNeonTheme.colors.*` constants
- **Modes**: Support light/dark/system configurations
- **Exports**: Zero dependencies except Google Fonts
- **Accessibility**: WCAG AA contrast, focus states

---

## 💡 FAQ

<details>
<summary><b>Can I use widgets outside of Notion?</b></summary>

Yes! Exported HTML files work anywhere - websites, blogs, apps. Embed via `<iframe>`.
</details>

<details>
<summary><b>Do widgets work offline?</b></summary>

Mostly yes. Only Google Fonts (Orbitron, Montserrat) load from CDN. Download fonts locally for full offline support.
</details>

<details>
<summary><b>Can I customize beyond the UI?</b></summary>

Absolutely! Download the HTML, edit inline styles/scripts, and re-host. Advanced users can modify source files directly.
</details>

<details>
<summary><b>How do I update a deployed widget?</b></summary>

Re-export from the builder, replace the hosted HTML file. Notion embeds auto-update (may need refresh).
</details>

<details>
<summary><b>Can I use custom brand colors?</b></summary>

Yes! Upload your logo to auto-extract 8 colors, or manually customize all colors via picker.
</details>

<details>
<summary><b>How do I report bugs?</b></summary>

Open a GitHub issue with description, reproduction steps, and screenshots.
</details>

---

## 📄 License

**MIT License** - Copyright (c) 2026 JaZeR

See [LICENSE](./LICENSE) file for full details.

---

<div align="center">

<img src="./Notion Widget Builder - Mobile App Icon.svg" alt="Mobile Icon" width="80" />

### 🚀 Ready to Build Amazing Widgets?

**[🌐 Launch Builder](https://jazer-444.github.io/notion-widget-builder/)** • **[📖 View Docs](./BRAND_GUIDELINES.md)** • **[🐛 Report Issue](https://github.com/yourusername/notion-widget-builder/issues)**

---

**Built with 💜 using React + Vite** | **Powered by Modern Web Technologies**

*Transform your Notion workspace with beautiful, customizable widgets*

</div>
