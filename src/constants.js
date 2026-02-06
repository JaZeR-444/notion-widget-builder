// Fixed circular import
// I need self-contained logic or ordered creation.

// This file will contain JAZER_BRAND, so it shouldn't import it.

export const FONT_SIZES = { small: 16, medium: 32, large: 48, xlarge: 64 };
export const EXPORT_ANIMATION_DURATION = 300;
export const DEBOUNCE_DELAY = 300;
export const MIN_FONT_SIZE = 12;
export const MAX_FONT_SIZE = 120;

// Button presets based on Notion's color palette
export const BUTTON_PRESETS = {
  black: { bg: '#000000', text: '#FFFFFF', outline: '#000000' },
  grey: { bg: '#9B9A97', text: '#FFFFFF', outline: '#9B9A97' },
  yellow: { bg: '#DFAB01', text: '#FFFFFF', outline: '#DFAB01' },
  purple: { bg: '#6940A5', text: '#FFFFFF', outline: '#6940A5' },
  brown: { bg: '#64473A', text: '#FFFFFF', outline: '#64473A' },
  green: { bg: '#0F7B6C', text: '#FFFFFF', outline: '#0F7B6C' },
  pink: { bg: '#AD1A72', text: '#FFFFFF', outline: '#AD1A72' },
  orange: { bg: '#D9730D', text: '#FFFFFF', outline: '#D9730D' },
  blue: { bg: '#0B6E99', text: '#FFFFFF', outline: '#0B6E99' },
  red: { bg: '#E03E3E', text: '#FFFFFF', outline: '#E03E3E' },
};

// Common emojis for quick selection
export const COMMON_EMOJIS = [
  "😊", "🚀", "🎨", "💼", "🔗", "📅", "✨", "⭐", "🔥", "💡",
  "📚", "📝", "📧", "💬", "📞", "📍", "🏠", "💻", "📱", "📸",
  "🎥", "🎧", "🎵", "🎮", "🕹️", "🎲", "🏆", "🥇", "⚽", "🏀",
  "❤️", "👍", "👋", "🙌", "👏", "🤝", "👀", "🧠", "💪", "⚡",
  "🛑", "✅", "❌", "❓", "❗", "➡️", "⬅️", "⬆️", "⬇️", "🔗"
];

export const BUTTON_ARCHETYPES = [
  {
    id: 'cycle',
    label: 'Cycle Button',
    description: 'Pomodoro start / pause / skip break',
    icon: '⏱',
    config: {
      label: 'Pomodoro Cycle',
      icon: '⏱',
      tooltip: 'Cycle focus, pause, skip',
      behaviorType: 'cycle',
      variant: 'capsule'
    }
  },
  {
    id: 'createPage',
    label: 'Create Page Button',
    description: 'Creates a Notion page entry',
    icon: '📄',
    config: {
      label: 'Create Page',
      icon: '📄',
      tooltip: 'Creates a Notion page',
      behaviorType: 'createPage',
      variant: 'outline'
    }
  },
  {
    id: 'template',
    label: 'Template Button',
    description: 'Applies a database template',
    icon: '🧩',
    config: {
      label: 'Apply Template',
      icon: '🧩',
      tooltip: 'Runs assigned template',
      behaviorType: 'template',
      variant: 'ghost'
    }
  },
  {
    id: 'counter',
    label: 'Counter Button',
    description: 'Counts presses and displays value',
    icon: '🔢',
    config: {
      label: 'Log Count',
      icon: '🔢',
      tooltip: 'Adds to counter',
      behaviorType: 'counter',
      variant: 'solid'
    }
  },
  {
    id: 'modeSwitcher',
    label: 'Mode Switcher',
    description: 'Switches focus/break modes',
    icon: '🔀',
    config: {
      label: 'Mode Switch',
      icon: '🔀',
      tooltip: 'Switches mode',
      behaviorType: 'modeSwitcher',
      variant: 'capsule'
    }
  },
  {
    id: 'themeToggle',
    label: 'Theme Toggle',
    description: 'Toggles light / dark theme',
    icon: '🌓',
    config: {
      label: 'Theme Toggle',
      icon: '🌓',
      tooltip: 'Toggles theme',
      behaviorType: 'themeToggle',
      variant: 'orb'
    }
  },
  {
    id: 'playlist',
    label: 'Playlist Button',
    description: 'Cycles through playlist names',
    icon: '🎵',
    config: {
      label: 'Playlist',
      icon: '🎵',
      tooltip: 'Cycle playlist tracks',
      behaviorType: 'playlist',
      variant: 'circular',
      playlistText: 'Lo-fi Beats\nHyperfocus Mix\nBreak Vibes'
    }
  },
  {
    id: 'navigation',
    label: 'Navigation Button',
    description: 'Opens a Notion page',
    icon: '🔗',
    config: {
      label: 'Open Notion',
      icon: '🔗',
      tooltip: 'Opens linked Notion page',
      behaviorType: 'navigation',
      variant: 'outline'
    }
  },
  {
    id: 'meta',
    label: 'Meta Button',
    description: 'Runs macro sequences',
    icon: '🧠',
    config: {
      label: 'Meta Macro',
      icon: '🧠',
      tooltip: 'Runs macro playlist',
      behaviorType: 'meta',
      variant: 'solid'
    }
  },
  {
    id: 'secret',
    label: 'Secret Button',
    description: 'Long-press unlocks a hidden UI',
    icon: '🕵️',
    config: {
      label: 'Secret Button',
      icon: '🕵️',
      tooltip: 'Hold for 2 seconds',
      behaviorType: 'secret',
      variant: 'ghost'
    }
  }
];

export const CONFIG_SECTION_BATCH = 4;

export const JAZER_BRAND = {
  // ===== OFFICIAL BRAND COLORS (all 10) =====
  colors: {
    // Primary Palette
    electricPurple: '#8B5CF6',
    cosmicBlue: '#3B82F6',
    neonPink: '#EC4899',
    sunburstGold: '#F59E0B',
    aetherTeal: '#06B6D4',
    ultraviolet: '#A78BFA',
    nightBlack: '#0B0E12',
    stardustWhite: '#F8F9FF',
    graphite: '#1F2937',
    softSlate: '#94A3B8',
  },

  // ===== CUSTOM UI COLORS (non-brand, keep for UI functionality) =====
  ui: {
    deepSpace: '#1A1D29', // Background variant
    nebulaPurple: '#2D1B4E', // Background variant
    glass: 'rgba(255, 255, 255, 0.1)', // Glassmorphism
  },

  // ===== TYPOGRAPHY =====
  fonts: {
    heading: '"Orbitron", system-ui, sans-serif',
    body: '"Montserrat", system-ui, sans-serif'
  },

  fontFamily: '"Montserrat", system-ui, sans-serif',

  sizes: {
    h1: '64px',
    h2: '40px',
    h3: '28px',
    body: '18px',
    bodyLarge: '20px',
    small: '16px'
  },

  // ===== EFFECTS (brand-spec compliant) =====
  letterSpacing: '0.03em', // 3% spacing for headlines
  letterSpacingLarge: '0.04em', // 4% for extra large

  glowBlur: '4px', // ✅ FIXED: was 15px
  glowBlurSubtle: '2px',
  glow: '0 0 4px rgba(139, 92, 246, 0.5)', // ✅ FIXED: now uses 4px
  glowStrong: '0 0 8px rgba(139, 92, 246, 0.5)',

  // ===== GRADIENTS =====
  gradient: 'linear-gradient(90deg, #EC4899 0%, #F59E0B 28%, #06B6D4 50%, #3B82F6 74%, #8B5CF6 100%)',
  borderGradient: 'linear-gradient(to right, #EC4899, #3B82F6)',

  // ===== LOGO SPECIFICATIONS =====
  logo: {
    minWidth: 160, // px - digital minimum
    minWidthPrint: 30, // mm - print minimum
    clearSpace: '1em',
    paths: {
      svg: `${import.meta.env.BASE_URL}logo.svg`,
      gif: `${import.meta.env.BASE_URL}logo.svg`,
      favicon: `${import.meta.env.BASE_URL}icon.svg`
    }
  }
};

export const BRAND_KITS = {
  none: {
    id: 'none',
    label: 'None / Custom',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    headingFontFamily: 'ui-sans-serif, system-ui, sans-serif',
    bgColor: '#ffffff',
    textColor: '#37352f',
    accentColor: '#e16259',
    fontLinks: '',
    cssVariables: '',
    extraCSS: ''
  },
  jazer: {
    id: 'jazer',
    label: 'Neon',
    fontFamily: '"Montserrat", system-ui, sans-serif',
    headingFontFamily: '"Orbitron", system-ui, sans-serif',
    bgColor: JAZER_BRAND.colors.nightBlack,
    textColor: JAZER_BRAND.colors.stardustWhite,
    accentColor: JAZER_BRAND.colors.electricPurple,
    logoPath: JAZER_BRAND.logo.paths.svg,
    logoGif: JAZER_BRAND.logo.paths.gif,
    faviconPath: JAZER_BRAND.logo.paths.favicon,
    fontLinks: `
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Orbitron:wght@400;700&family=Roboto&family=Open+Sans&display=swap" rel="stylesheet">
    `,
    cssVariables: `:root {
      --jazer-electric-purple: ${JAZER_BRAND.colors.electricPurple};
      --jazer-cosmic-blue: ${JAZER_BRAND.colors.cosmicBlue};
      --jazer-neon-pink: ${JAZER_BRAND.colors.neonPink};
      --jazer-sunburst-gold: ${JAZER_BRAND.colors.sunburstGold};
      --jazer-aether-teal: ${JAZER_BRAND.colors.aetherTeal};
      --jazer-ultraviolet: ${JAZER_BRAND.colors.ultraviolet};
      --jazer-night-black: ${JAZER_BRAND.colors.nightBlack};
      --jazer-stardust-white: ${JAZER_BRAND.colors.stardustWhite};
      --jazer-graphite: ${JAZER_BRAND.colors.graphite};
      --jazer-soft-slate: ${JAZER_BRAND.colors.softSlate};
      
      --jazer-glow-blur: ${JAZER_BRAND.glowBlur};
      --jazer-glow-purple: ${JAZER_BRAND.glow};
    }`,
    extraCSS: `
    body {
      background-color: ${JAZER_BRAND.colors.nightBlack};
      color: ${JAZER_BRAND.colors.stardustWhite};
      font-family: ${JAZER_BRAND.fontFamily};
    }

    .neon-text { 
      font-family: "Orbitron", system-ui, sans-serif; 
      color: ${JAZER_BRAND.colors.stardustWhite}; 
      text-shadow: ${JAZER_BRAND.glow}; 
      letter-spacing: ${JAZER_BRAND.letterSpacing}; 
    }
    .neon-gradient-text { 
      font-family: "Orbitron", system-ui, sans-serif; 
      background: ${JAZER_BRAND.gradient}; 
      -webkit-background-clip: text; 
      background-clip: text; 
      color: transparent; 
      text-shadow: ${JAZER_BRAND.glow}; 
      letter-spacing: ${JAZER_BRAND.letterSpacing}; 
    }
    h1, h2, h3 { letter-spacing: ${JAZER_BRAND.letterSpacing}; font-family: "Orbitron", system-ui, sans-serif; } 
    h1 { font-size: ${JAZER_BRAND.sizes.h1}; }
    h2 { font-size: ${JAZER_BRAND.sizes.h2}; color: ${JAZER_BRAND.colors.electricPurple}; }
    h3 { font-size: ${JAZER_BRAND.sizes.h3}; color: ${JAZER_BRAND.colors.cosmicBlue}; } 
    
    button:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid ${JAZER_BRAND.colors.cosmicBlue}; outline-offset: 2px; }
    
    /* Scrollbar */
    ::-webkit-scrollbar { width: 10px; }
    ::-webkit-scrollbar-track { background: ${JAZER_BRAND.colors.nightBlack}; }
    ::-webkit-scrollbar-thumb { background: ${JAZER_BRAND.colors.graphite}; border-radius: 5px; border: 1px solid ${JAZER_BRAND.colors.nightBlack}; }
    ::-webkit-scrollbar-thumb:hover { background: ${JAZER_BRAND.colors.softSlate}; }
    
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    @keyframes roulette { 
      0% { transform: translateY(-20px); opacity: 0; } 
      100% { transform: translateY(0); opacity: 1; } 
    }
    `
  }
};
