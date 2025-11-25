import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Clock, Quote, Timer, Palette,
  Download, Copy, Layout, Code, Image as ImageIcon,
  BarChart3, MousePointerClick, Hash, Hourglass,
  List as ListIcon, Settings, ExternalLink, Briefcase,
  AlertTriangle, Sparkles, Check, X, ArrowLeft, CloudSun,
  ChevronUp, ChevronDown, Plus, Minus, Instagram, RefreshCcw,
  ChevronLeft, ChevronRight, Search, HelpCircle, Link as LinkIcon,
  Trash2, Copy as CopyIcon, CornerDownRight, ArrowUp, ArrowDown,
  Eye, EyeOff, MoreHorizontal, CloudRain, Sun, Moon, Wind,
  Droplets, Thermometer, MapPin, Lock, Calendar, Activity,
  MousePointer, Zap, Type, Loader, Rocket, Upload
} from 'lucide-react';
import ColorThief from 'colorthief';

import { counterConfig } from './widgets/counter/config';
import { CounterWidget } from './widgets/counter/CounterWidget';
import { generateCounterHTML, generateCounterScript } from './widgets/counter/export';

import { imageGalleryConfig } from './widgets/imageGallery/config';
import { ImageGalleryWidget } from './widgets/imageGallery/ImageGalleryWidget';
import { generateImageGalleryHTML, generateImageGalleryScript } from './widgets/imageGallery/export';

import { quotesConfig } from './widgets/quotes/config';
import { QuotesWidget } from './widgets/quotes/QuotesWidget';
import { generateQuotesHTML, generateQuotesScript } from './widgets/quotes/export';

import { weatherConfig } from './widgets/weather/config';
import { WeatherWidget } from './widgets/weather/WeatherWidget';
import { generateWeatherHTML, generateWeatherScript } from './widgets/weather/export';

import { lifeProgressConfig } from './widgets/lifeProgress/config';
import { LifeProgressWidget } from './widgets/lifeProgress/LifeProgressWidget';
import { generateLifeProgressHTML, generateLifeProgressScript } from './widgets/lifeProgress/export';

import { clockConfig } from './widgets/clock/config';
import { ClockWidget } from './widgets/clock/ClockWidget';
import { generateClockHTML, generateClockScript } from './widgets/clock/export';

import { countdownConfig } from './widgets/Countdown/config';
import { CountdownWidget } from './widgets/Countdown/CountdownWidget';
import { generateCountdownHTML, generateCountdownScript } from './widgets/Countdown/export';

import { newButtonGenerator } from './widgets/newButtonGenerator/ButtonGeneratorWidget'; // Named import

import BrandLogoUploader from './components/BrandLogoUploader';

// --- CONSTANTS & CONFIG ---

const FONT_SIZES = { small: 16, medium: 32, large: 48, xlarge: 64 };
const EXPORT_ANIMATION_DURATION = 300;
const DEBOUNCE_DELAY = 300;
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 120;

// Button presets based on Notion's color palette
const BUTTON_PRESETS = {
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
const COMMON_EMOJIS = [
  "😊", "🚀", "🎨", "💼", "🔗", "📅", "✨", "⭐", "🔥", "💡",
  "📚", "📝", "📧", "💬", "📞", "📍", "🏠", "💻", "📱", "📸",
  "🎥", "🎧", "🎵", "🎮", "🕹️", "🎲", "🏆", "🥇", "⚽", "🏀",
  "❤️", "👍", "👋", "🙌", "👏", "🤝", "👀", "🧠", "💪", "⚡",
  "🛑", "✅", "❌", "❓", "❗", "➡️", "⬅️", "⬆️", "⬇️", "🔗"
];

const JAZER_BRAND = {
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
    clearSpace: '1em', // Padding equal to height of "J"
    paths: {
      svg: '/images/JaZeR BrandKit_OnSite/Logo_Primary_Full-Color.svg',
      gif: '/images/JaZeR_Logo_OFFICIAL.gif',
      favicon: '/images/JaZeR BrandKit_OnSite/favicon.svg'
    }
  }
};

// --- UTILITIES ---

const escapeHTML = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>'"]/g,
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag]));
};

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// Enhanced utility functions for config encoding and color conversion
const encodeConfig = (obj) => {
  return btoa(encodeURIComponent(JSON.stringify(obj)));
};

const decodeConfig = (str) => {
  try {
    return JSON.parse(decodeURIComponent(atob(str)));
  } catch (e) {
    console.error("Failed to decode config", e);
    return null;
  }
};

const resolveThemeColors = (config, isDark) => {
  if (config.appearanceMode === 'none') return { bg: config.bgColor || 'transparent', text: config.textColor || '#000' };
  const bg = config.backgroundMode === 'transparent' ? 'transparent' : (isDark ? '#0B0E12' : config.bgColor || '#FFFFFF');
  const text = isDark ? (config.darkTextColor || '#FFFFFF') : (config.lightTextColor || '#37352F');
  return { bg, text };
};

// --- ERROR BOUNDARY ---

class WidgetErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full bg-red-50 p-8 text-center rounded-xl">
          <div>
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-bold text-red-900 mb-2">Widget Error</h3>
            <p className="text-sm text-red-700 mb-4">{this.state.error?.message || 'Something went wrong'}</p>
            <button onClick={() => this.setState({ hasError: false })} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
              Reset Widget
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- BRAND KITS ---

const BRAND_KITS = {
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
    label: 'JaZeR Neon',
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

// --- HELPER COMPONENTS ---

const BrandColorPalette = () => (
  <div className="p-4 bg-gray-900 rounded-lg mb-4">
    <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-3">JaZeR Brand Colors</h4>
    <div className="grid grid-cols-5 gap-2">
      {Object.entries(JAZER_BRAND.colors).map(([name, color]) => (
        <div key={name} className="text-center">
          <div
            className="w-full h-10 rounded mb-1 border border-white/10"
            style={{ backgroundColor: color }}
            title={name}
          />
          <div className="text-[8px] text-white/50 truncate">{name}</div>
        </div>
      ))}
    </div>
  </div>
);


// Emoji Picker Component with Search
const EmojiPicker = ({ onSelect, onClose }) => {
  const [search, setSearch] = useState("");
  const filtered = COMMON_EMOJIS.filter(e => e.includes(search));

  return (
    <div className="absolute z-50 bg-[#1A1D29] border border-gray-700 rounded-lg shadow-xl w-64 max-h-60 flex flex-col top-full left-0 mt-1">
      <div className="p-2 border-b border-gray-700">
        <div className="relative">
          <Search size={12} className="absolute left-2 top-2 text-gray-500" />
          <input
            autoFocus
            className="w-full bg-[#0B0E12] pl-7 pr-2 py-1 text-xs text-white rounded border border-gray-700 outline-none focus:border-purple-500"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 p-2 overflow-y-auto">
        {filtered.map((emoji, i) => (
          <button
            key={i}
            className="text-lg hover:bg-gray-700 rounded p-1"
            onClick={() => { onSelect(emoji); onClose(); }}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

// Enhanced Button Manager Component
const ButtonManager = ({ value, onChange }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateButton = (idx, updates) => {
    const newButtons = [...value];
    newButtons[idx] = { ...newButtons[idx], ...updates };
    onChange(newButtons);
  };

  const addButton = () => {
    const newBtn = {
      id: `btn-${Date.now()}`,
      label: 'New Button',
      url: '',
      icon: '✨',
      hideIcon: false,
      colorPreset: 'grey',
      backgroundColor: '#9B9A97',
      backgroundOpacity: 100,
      outlineColor: '#9B9A97',
      textColor: '#FFFFFF',
      hoverBackgroundColor: '#FFFFFF',
      hoverTextColor: '#9B9A97',
      enableHoverHighlight: true,
    };
    onChange([...value, newBtn]);
    setActiveIndex(value.length);
  };

  const duplicateButton = (idx, e) => {
    e.stopPropagation();
    const newButtons = [...value];
    const clone = { ...value[idx], id: `btn-${Date.now()}` };
    newButtons.splice(idx + 1, 0, clone);
    onChange(newButtons);
  };

  const deleteButton = (idx, e) => {
    e.stopPropagation();
    const newButtons = value.filter((_, i) => i !== idx);
    onChange(newButtons);
    if (activeIndex === idx) setActiveIndex(null);
  };

  const copyStyle = (idx, e) => {
    e.stopPropagation();
    const source = value[idx];
    const newButtons = value.map(b => ({
      ...b,
      colorPreset: source.colorPreset,
      backgroundColor: source.backgroundColor,
      backgroundOpacity: source.backgroundOpacity,
      outlineColor: source.outlineColor,
      textColor: source.textColor,
      hoverBackgroundColor: source.hoverBackgroundColor,
      hoverTextColor: source.hoverTextColor,
      enableHoverHighlight: source.enableHoverHighlight
    }));
    onChange(newButtons);
  };

  const applyPreset = (idx, presetName) => {
    const p = BUTTON_PRESETS[presetName];
    updateButton(idx, {
      colorPreset: presetName,
      backgroundColor: p.bg,
      outlineColor: p.outline,
      textColor: p.text,
      hoverBackgroundColor: '#FFFFFF',
      hoverTextColor: p.bg
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {value.map((btn, idx) => (
          <div key={btn.id} className="bg-[#1A1D29] border border-gray-700 rounded-lg overflow-hidden transition-all hover:border-gray-600">
            <div
              className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-gray-800 transition-colors"
              onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center text-xs border border-white/10"
                  style={{ backgroundColor: btn.backgroundColor, color: btn.textColor }}
                >
                  {btn.icon || ''}
                </div>
                <span className="text-xs font-medium text-gray-200 truncate max-w-[100px]">{btn.label}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="p-1 text-gray-500 hover:text-white hover:bg-gray-700 rounded"
                  onClick={(e) => copyStyle(idx, e)}
                  title="Copy style to all"
                >
                  <CornerDownRight size={12} />
                </button>
                <button
                  className="p-1 text-gray-500 hover:text-white hover:bg-gray-700 rounded"
                  onClick={(e) => duplicateButton(idx, e)}
                  title="Duplicate"
                >
                  <CopyIcon size={12} />
                </button>
                <button
                  className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-900/30 rounded"
                  onClick={(e) => deleteButton(idx, e)}
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
                <ChevronRight
                  size={12}
                  style={{
                    transform: activeIndex === idx ? 'rotate(90deg)' : 'none',
                    transition: '0.2s',
                    color: '#718096'
                  }}
                />
              </div>
            </div>

            {activeIndex === idx && (
              <div className="p-3 bg-[#111318] border-t border-gray-800 flex flex-col gap-3 animate-in slide-in-from-top-2">
                <div className="flex gap-2">
                  <div style={{ width: '50px', position: 'relative' }} ref={pickerRef}>
                    <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block">Icon</label>
                    <button
                      className="w-full bg-[#0f1115] border border-gray-700 text-gray-200 p-1.5 rounded text-xs text-center hover:border-purple-500 transition-colors"
                      onClick={() => setShowEmojiPicker(showEmojiPicker === idx ? null : idx)}
                    >
                      {btn.icon || '+'}
                    </button>
                    {showEmojiPicker === idx && <EmojiPicker onSelect={(emoji) => updateButton(idx, { icon: emoji })} onClose={() => setShowEmojiPicker(null)} />}
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block">Label</label>
                    <input
                      className="w-full bg-[#0f1115] border border-gray-700 text-gray-200 p-1.5 rounded text-xs outline-none focus:border-purple-500 transition-colors"
                      value={btn.label}
                      onChange={(e) => updateButton(idx, { label: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 flex justify-between">URL <HelpCircle size={10} className="opacity-50" /></label>
                  <div className="relative">
                    <input
                      className="w-full bg-[#0f1115] border border-gray-700 text-blue-400 p-1.5 pl-6 rounded text-xs outline-none focus:border-purple-500"
                      placeholder="https://..."
                      value={btn.url}
                      onChange={(e) => updateButton(idx, { url: e.target.value })}
                    />
                    <LinkIcon size={10} className="absolute left-2 top-2 text-gray-500" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-purple-500"
                    checked={btn.hideIcon}
                    onChange={(e) => updateButton(idx, { hideIcon: e.target.checked })}
                  />
                  <span className="text-xs text-gray-400">Hide Icon</span>
                </div>

                <div className="border-t border-gray-800 pt-2">
                  <label className="text-[9px] uppercase font-bold text-gray-500 mb-2 block">Quick Colors</label>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.keys(BUTTON_PRESETS).map(p => (
                      <div
                        key={p}
                        className={`w-4 h-4 rounded-full cursor-pointer border border-white/10 transition-transform hover:scale-110 ${btn.colorPreset === p ? 'ring-1 ring-white' : ''}`}
                        style={{ backgroundColor: BUTTON_PRESETS[p].bg }}
                        onClick={() => applyPreset(idx, p)}
                        title={p}
                      />
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-2 space-y-2">
                  <label className="text-[9px] uppercase font-bold text-purple-400 flex items-center gap-1">
                    <Palette size={10} /> Custom Styles
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-gray-500 block mb-1">Bg Color</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="color"
                          value={btn.backgroundColor}
                          onChange={e => updateButton(idx, { backgroundColor: e.target.value, colorPreset: null })}
                          className="w-5 h-5 rounded cursor-pointer bg-transparent p-0 border-none"
                        />
                        <span className="text-[9px] font-mono text-gray-400">{btn.backgroundColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-500 block mb-1">Opacity {btn.backgroundOpacity}%</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={btn.backgroundOpacity}
                        onChange={e => updateButton(idx, { backgroundOpacity: Number(e.target.value) })}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-gray-500 block mb-1">Text Color</label>
                      <input
                        type="color"
                        value={btn.textColor}
                        onChange={e => updateButton(idx, { textColor: e.target.value, colorPreset: null })}
                        className="w-full h-5 rounded cursor-pointer bg-transparent p-0 border border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-500 block mb-1">Outline</label>
                      <input
                        type="color"
                        value={btn.outlineColor}
                        onChange={e => updateButton(idx, { outlineColor: e.target.value, colorPreset: null })}
                        className="w-full h-5 rounded cursor-pointer bg-transparent p-0 border border-gray-700"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      className="accent-purple-500"
                      checked={btn.enableHoverHighlight}
                      onChange={e => updateButton(idx, { enableHoverHighlight: e.target.checked })}
                    />
                    <span className="text-xs text-gray-400">Enable Hover Highlight</span>
                  </div>

                  {btn.enableHoverHighlight && (
                    <div className="grid grid-cols-2 gap-2 pl-2 border-l border-purple-500/20">
                      <div>
                        <label className="text-[9px] text-gray-500 mb-1 block">Hover Bg</label>
                        <input
                          type="color"
                          value={btn.hoverBackgroundColor}
                          onChange={e => updateButton(idx, { hoverBackgroundColor: e.target.value })}
                          className="w-full h-5 rounded cursor-pointer bg-transparent p-0 border border-gray-700"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-500 mb-1 block">Hover Text</label>
                        <input
                          type="color"
                          value={btn.hoverTextColor}
                          onChange={e => updateButton(idx, { hoverTextColor: e.target.value })}
                          className="w-full h-5 rounded cursor-pointer bg-transparent p-0 border border-gray-700"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={addButton}
        className="w-full py-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-xs font-bold text-purple-300 flex items-center justify-center gap-2 transition-all"
      >
        <Plus size={14} /> Add Button
      </button>
    </div>
  );
};

// Enhanced WidgetField Component - Supports all field types
const WidgetField = React.memo(({ field, value, onChange }) => {
  if (field.locked) {
    return (
      <div className="flex justify-between items-center py-1 opacity-50">
        <span className="text-sm text-gray-300">{field.label}</span>
        <span className="text-xs text-gray-500">🔒 Premium</span>
      </div>
    );
  }

  if (field.type === 'boolean') {
    return (
      <div className="flex justify-between items-center py-1">
        <span className="text-sm text-gray-300">{field.label}</span>
        <button
          onClick={() => onChange(!value)}
          className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ${value ? 'bg-purple-600' : 'bg-gray-700'}`}
        >
          <div className={`w-3 h-3 rounded-full bg-white shadow-md transform transition-transform duration-300 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div className="space-y-1">
        <label className="text-xs text-gray-400 font-bold">{field.label}</label>
        <select
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-gray-800 text-white text-sm p-2 rounded border border-gray-700 outline-none focus:border-purple-500"
          style={{ pointerEvents: 'auto' }}
        >
          {field.options.map(o => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === 'color') {
    return (
      <div className="space-y-1">
        <label className="text-xs text-gray-400 font-bold">{field.label}</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value || '#000000'}
            onChange={e => onChange(e.target.value)}
            className="w-8 h-8 rounded bg-transparent border-none cursor-pointer"
          />
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="flex-1 bg-gray-800 text-white text-xs p-2 rounded border border-gray-700"
          />
        </div>
      </div>
    );
  }

  if (field.type === 'text' || field.type === 'number' || field.type === 'date' || field.type === 'datetime-local') {
    return (
      <div className="space-y-1">
        <label className="text-xs text-gray-400 font-bold">{field.label}</label>
        <input
          type={field.type}
          value={value}
          onChange={e => onChange(field.type === 'number' ? Number(e.target.value) : e.target.value)}
          min={field.min}
          max={field.max}
          className="w-full bg-gray-800 text-white text-sm p-2 rounded border border-gray-700 outline-none focus:border-purple-500 transition-colors"
        />
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div className="space-y-1">
        <label className="text-xs text-gray-400 font-bold">{field.label}</label>
        <textarea
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          rows={field.rows || 4}
          className="w-full bg-gray-800 text-white text-sm p-2 rounded border border-gray-700 outline-none focus:border-purple-500"
        />
      </div>
    );
  }

  // NEW: checkbox-list field type
  if (field.type === 'checkbox-list') {
    const toggle = (optionValue) => {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter(v => v !== optionValue));
      } else {
        onChange([...currentValues, optionValue]);
      }
    };

    return (
      <div className="space-y-2">
        <label className="text-xs text-gray-400 font-bold">{field.label}</label>
        <div className="bg-gray-900 rounded border border-gray-700 p-2 space-y-1">
          {field.options.map(opt => {
            const isChecked = (value || []).includes(opt.value);
            return (
              <div
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded"
                onClick={() => toggle(opt.value)}
              >
                <div className={`w-4 h-4 border rounded flex items-center justify-center ${isChecked ? 'bg-purple-600 border-purple-600' : 'border-gray-500'}`}>
                  {isChecked && <Check size={10} className="text-white" />}
                </div>
                <span className="text-xs text-gray-300">{opt.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // NEW: bar-list field type (for Life Progress)
  if (field.type === 'bar-list') {
    const move = (idx, dir) => {
      const newItems = [...value];
      if (dir === -1 && idx > 0) {
        [newItems[idx], newItems[idx - 1]] = [newItems[idx - 1], newItems[idx]];
      } else if (dir === 1 && idx < newItems.length - 1) {
        [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
      }
      onChange(newItems);
    };

    const toggle = (idx) => {
      const n = [...value];
      n[idx].enabled = !n[idx].enabled;
      onChange(n);
    };

    return (
      <div className="space-y-2">
        <label className="text-xs text-gray-400 font-bold">{field.label}</label>
        <div className="bg-gray-900 rounded border border-gray-700 overflow-hidden">
          {value.map((item, i) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 border-b border-gray-800 last:border-0 hover:bg-white/5"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggle(i)}
                  className={`w-4 h-4 flex items-center justify-center rounded border ${item.enabled ? 'bg-purple-600 border-purple-600' : 'border-gray-500'}`}
                >
                  {item.enabled && <Check size={12} className="text-white" />}
                </button>
                <span className={`text-xs ${item.enabled ? 'text-white' : 'text-gray-500'}`}>{item.label}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => move(i, -1)}
                  className="p-1 hover:text-white text-gray-500 disabled:opacity-20"
                  disabled={i === 0}
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  className="p-1 hover:text-white text-gray-500 disabled:opacity-20"
                  disabled={i === value.length - 1}
                >
                  <ArrowDown size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // NEW: button-manager field type
  if (field.type === 'button-manager') {
    return <ButtonManager value={value || []} onChange={onChange} />;
  }

  return null;
});

const FlipCard = ({ value, label, colors, size }) => (
  <div className="inline-flex flex-col items-center mx-1">
    <div style={{
      width: `${size * 0.7}px`,
      height: `${size}px`,
      background: colors.clockColor || '#333',
      borderRadius: '8px',
      color: colors.digitColor || '#fff',
      fontSize: `${size * 0.65}px`,
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(0,0,0,0.3)' }}></div>
      {String(value).padStart(2, '0')}
    </div>
    {label && <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.7, textTransform: 'uppercase' }}>{label}</div>}
  </div>
);

const AnalogClock = ({ time, size, type, colors, config }) => {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  const center = size / 2;
  const clockRadius = size * 0.45;

  // Generate hour markers based on type
  const renderMarkers = () => {
    const markers = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30) * (Math.PI / 180);
      const x = center + Math.sin(angle) * clockRadius * 0.85;
      const y = center - Math.cos(angle) * clockRadius * 0.85;

      if (type === 'dots') {
        markers.push(
          <circle key={i} cx={x} cy={y} r={size * 0.015} fill={colors.clockColor} opacity="0.5" />
        );
      } else if (type === 'numbers') {
        markers.push(
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            fontSize={size * 0.08} fill={colors.clockColor} fontWeight="bold">
            {i === 0 ? 12 : i}
          </text>
        );
      } else if (type === 'planets') {
        const planetSizes = [8, 6, 7, 5, 9, 6, 8, 5, 6, 7, 5, 6];
        markers.push(
          <circle key={i} cx={x} cy={y} r={size * 0.01 * planetSizes[i] / 5}
            fill={colors.clockColor} opacity="0.6" />
        );
      }
    }
    return markers;
  };

  // Hand styles based on type
  const getHandProps = (handType) => {
    if (type === 'trail') {
      return { strokeLinecap: 'round', strokeWidth: handType === 'second' ? size * 0.01 : size * 0.02, opacity: 0.7 };
    }
    return { strokeLinecap: 'round', strokeWidth: handType === 'hour' ? size * 0.04 : handType === 'minute' ? size * 0.03 : size * 0.01 };
  };

  return (
    <svg width={size} height={size} style={{ filter: config.glowEffect ? `drop-shadow(0 0 ${JAZER_BRAND.glowBlur} ${colors.clockColor})` : 'none' }}>
      {/* Clock face */}
      <circle cx={center} cy={center} r={clockRadius}
        fill="none" stroke={colors.clockColor}
        strokeWidth={size * 0.01} opacity="0.2" />

      {/* Markers */}
      {renderMarkers()}

      {/* Hour hand */}
      <line
        x1={center} y1={center}
        x2={center + Math.sin(hourAngle * Math.PI / 180) * clockRadius * 0.5}
        y2={center - Math.cos(hourAngle * Math.PI / 180) * clockRadius * 0.5}
        stroke={colors.clockColor}
        {...getHandProps('hour')}
      />

      {/* Minute hand */}
      <line
        x1={center} y1={center}
        x2={center + Math.sin(minuteAngle * Math.PI / 180) * clockRadius * 0.75}
        y2={center - Math.cos(minuteAngle * Math.PI / 180) * clockRadius * 0.75}
        stroke={colors.clockColor}
        {...getHandProps('minute')}
      />

      {/* Second hand */}
      {config.showSeconds && (
        <line
          x1={center} y1={center}
          x2={center + Math.sin(secondAngle * Math.PI / 180) * clockRadius * 0.85}
          y2={center - Math.cos(secondAngle * Math.PI / 180) * clockRadius * 0.85}
          stroke={type === 'trail' ? colors.textColor : colors.clockColor}
          {...getHandProps('second')}
          style={type === 'tick' ? { transition: 'all 0.05s ease' } : {}}
        />
      )}

      {/* Center dot */}
      <circle cx={center} cy={center} r={size * 0.02} fill={colors.clockColor} />
    </svg>
  );
};

// --- WIDGET REGISTRY ---

const WIDGET_REGISTRY = {
  logo: {
    id: 'logo',
    label: 'Brand Logo',
    icon: <Sparkles className="w-4 h-4" />,
    description: 'Display the official JaZeR brand logo.',
    defaultConfig: {
      imagePath: JAZER_BRAND.logo.paths.svg,
      type: 'svg', // svg or gif
      size: 200,
      glow: true,
      bgColor: 'transparent',
    },
    fields: [
      { name: 'imagePath', label: 'Image Path/URL', type: 'text' },
      { name: 'type', label: 'Format', type: 'select', options: [{ label: 'Static SVG', value: 'svg' }, { label: 'Animated GIF', value: 'gif' }] },
      { name: 'size', label: 'Width (px)', type: 'number', min: 160, max: 800 },
      { name: 'glow', label: 'Neon Glow', type: 'boolean' },
    ],
    Component: ({ config }) => {
      const [error, setError] = useState(false);
      const src = config.imagePath || (config.type === 'gif' ? JAZER_BRAND.logo.paths.gif : JAZER_BRAND.logo.paths.svg);

      useEffect(() => { setError(false); }, [src]);

      return (
        <div className="flex items-center justify-center h-full w-full p-4">
          {error ? (
            <div className="text-center opacity-50 flex flex-col items-center">
              <AlertTriangle className="w-12 h-12 mb-2 text-red-400" />
              <p className="text-xs">Logo not found at path</p>
            </div>
          ) : (
            <img
              src={src}
              alt="Logo"
              onError={() => setError(true)}
              style={{
                width: `${Math.max(160, config.size)}px`,
                maxWidth: '100%',
                filter: config.glow ? `drop-shadow(0 0 ${JAZER_BRAND.glowBlur} ${JAZER_BRAND.colors.electricPurple})` : 'none'
              }}
            />
          )}
        </div>
      );
    },
    generateHTML: (config) => `
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <img src="${escapeHTML(config.imagePath)}" 
             alt="Logo" 
             onerror="this.style.display='none'; document.getElementById('err').style.display='block';"
             style="width: ${Math.max(160, config.size)}px; max-width: 100%; ${config.glow ? `filter: drop-shadow(0 0 ${JAZER_BRAND.glowBlur} ${JAZER_BRAND.colors.electricPurple});` : ''}" />
        <div id="err" style="display:none; color:red; text-align:center;">Logo not found</div>
      </div>
    `,
    generateScript: () => ``
  },
  cosmic: {
    id: 'cosmic',
    label: 'Cosmic BG',
    icon: <Sparkles className="w-4 h-4" />,
    description: 'Animated cosmic background with glow.',
    defaultConfig: {
      showStars: true,
      bgColor: JAZER_BRAND.colors.nightBlack
    },
    fields: [
      { name: 'showStars', label: 'Show Stars', type: 'boolean' },
    ],
    Component: ({ config }) => (
      <div className="w-full h-full relative overflow-hidden" style={{
        background: `radial-gradient(circle at 50% 10%, ${JAZER_BRAND.ui.nebulaPurple} 0%, ${JAZER_BRAND.colors.nightBlack} 100%)`
      }}>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 animate-pulse"></div>
        {config.showStars && <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px', opacity: 0.3 }}></div>}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl filter mix-blend-screen animate-pulse"></div>
      </div>
    ),
    generateHTML: (config) => `
      <div style="position: fixed; inset: 0; background: radial-gradient(circle at 50% 10%, ${JAZER_BRAND.ui.nebulaPurple} 0%, ${JAZER_BRAND.colors.nightBlack} 100%); overflow: hidden; z-index: -1;">
         <div style="position: absolute; inset: 0; background: linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.2)); animation: pulse 4s infinite; will-change: opacity;"></div>
         ${config.showStars ? '<div style="position: absolute; inset: 0; background-image: radial-gradient(white 1px, transparent 1px); background-size: 50px 50px; opacity: 0.3;"></div>' : ''}
         <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 300px; height: 300px; background: rgba(139,92,246,0.3); border-radius: 50%; filter: blur(60px); animation: pulse 6s infinite alternate;"></div>
         <style>@keyframes pulse { 0% { opacity: 0.5; } 100% { opacity: 1; } }</style>
      </div>
    `,
    generateScript: () => ``
  },
  clock: {
    ...clockConfig,
    icon: <Clock className="w-4 h-4" />,
    Component: ClockWidget,
    generateHTML: generateClockHTML,
    generateScript: generateClockScript
  },
  weather: {
    ...weatherConfig,
    icon: <CloudSun className="w-4 h-4" />,
    Component: WeatherWidget,
    generateHTML: generateWeatherHTML,
    generateScript: generateWeatherScript
  },
  countdown: {
    ...countdownConfig,
    icon: <Hourglass className="w-4 h-4" />,
    Component: CountdownWidget,
    generateHTML: generateCountdownHTML,
    generateScript: generateCountdownScript
  },
  counter: {
    ...counterConfig,
    icon: <Hash className="w-4 h-4" />,
    Component: CounterWidget,
    generateHTML: generateCounterHTML,
    generateScript: generateCounterScript
  },
  imageGallery: { // Changed from 'gallery' to 'imageGallery'
    ...imageGalleryConfig,
    icon: <ImageIcon className="w-4 h-4" />,
    Component: ImageGalleryWidget,
    generateHTML: generateImageGalleryHTML,
    generateScript: generateImageGalleryScript
  },
  newButtonGenerator: newButtonGenerator, // Added new button generator
  quotes: {
    ...quotesConfig,
    icon: <Quote className="w-4 h-4" />,
    Component: QuotesWidget,
    generateHTML: generateQuotesHTML,
    generateScript: generateQuotesScript
  },
  simpleList: {
    id: 'simpleList',
    label: 'List',
    icon: <ListIcon className="w-4 h-4" />,
    defaultConfig: { title: 'To Do', items: 'Task 1\nTask 2', accentColor: JAZER_BRAND.colors.cosmicBlue, textColor: JAZER_BRAND.colors.graphite, bgColor: JAZER_BRAND.colors.stardustWhite },
    fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'items', label: 'Items', type: 'textarea' }, { name: 'accentColor', label: 'Accent', type: 'color' }],
    Component: ({ config }) => (
      <div className="h-full w-full p-6 overflow-y-auto" style={{ background: config.bgColor, color: config.textColor }}>
        <h3 className="font-bold mb-4 pb-2 border-b-2 text-lg" style={{ borderColor: config.accentColor }}>{config.title}</h3>
        <ul className="space-y-2">{(config.items || '').split('\n').filter(Boolean).map((it, i) => <li key={i} className="flex gap-2"><div className="w-4 h-4 border rounded" style={{ borderColor: config.textColor }}></div>{it}</li>)}</ul>
      </div>
    ),
    generateHTML: (config) => `
      <div style="padding:24px; height:100%; overflow-y:auto;">
        <h3 style="font-weight:bold; margin-bottom:16px; padding-bottom:8px; border-bottom:2px solid ${config.accentColor};">${escapeHTML(config.title)}</h3>
        <ul style="list-style:none; padding:0;">
          ${(config.items || '').split('\n').filter(Boolean).map(i => `<li style="display:flex; gap:12px; margin-bottom:8px; cursor:pointer;" onclick="this.style.opacity = this.style.opacity === '0.5' ? '1' : '0.5'"><div style="width:16px; height:16px; border:2px solid currentColor; border-radius:4px;"></div><span>${escapeHTML(i)}</span></li>`).join('')}
        </ul>
      </div>
    `,
    generateScript: () => ``
  },
  pomodoro: {
    id: 'pomodoro',
    label: 'Pomodoro',
    icon: <Timer className="w-4 h-4" />,
    defaultConfig: { workTime: 25, breakTime: 5, accentColor: JAZER_BRAND.colors.neonPink, textColor: JAZER_BRAND.colors.graphite, bgColor: JAZER_BRAND.colors.stardustWhite },
    fields: [{ name: 'workTime', label: 'Work', type: 'number' }, { name: 'breakTime', label: 'Break', type: 'number' }, { name: 'accentColor', label: 'Color', type: 'color' }],
    Component: ({ config }) => (
      <div className="flex flex-col items-center justify-center h-full" style={{ background: config.bgColor, color: config.textColor }}>
        <div className="text-4xl font-bold mb-4">{config.workTime}:00</div>
        <button className="px-6 py-2 rounded-full text-white" style={{ background: config.accentColor }}>Start</button>
      </div>
    ),
    generateHTML: (config) => `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%;">
        <div id="timer" style="font-size:48px; font-weight:bold; margin-bottom:16px;">${config.workTime}:00</div>
        <button onclick="toggle()" id="btn" style="background:${config.accentColor}; color:white; border:none; padding:10px 24px; border-radius:99px; font-weight:bold; cursor:pointer;">Start</button>
      </div>
    `,
    generateScript: (config) => `
      let time = ${config.workTime * 60}; let active = false; let timer;
      const el = document.getElementById('timer'); const btn = document.getElementById('btn');
      function fmt(s) { return Math.floor(s/60).toString().padStart(2,'0')+':'+(s%60).toString().padStart(2,'0'); }
      function toggle() {
        active = !active; btn.innerText = active ? 'Pause' : 'Start';
        if(active) timer = setInterval(() => { if(time>0){time--; el.innerText=fmt(time)}else{clearInterval(timer); alert('Done!')} }, 1000);
        else clearInterval(timer);
      }
    `
  },
  lifeProgress: {
    ...lifeProgressConfig,
    icon: <BarChart3 className="w-4 h-4" />,
    Component: LifeProgressWidget,
    generateHTML: generateLifeProgressHTML,
    generateScript: generateLifeProgressScript
  },
};

// --- EXPORT MODAL COMPONENT ---

const ExportModal = ({ isOpen, onClose, widgetDef, config }) => {
  const linkUrl = useMemo(() => {
    if (!isOpen) return '';
    const encoded = encodeConfig(config);
    return `${window.location.origin}${window.location.pathname}?embed=1&widget=${widgetDef.id}&config=${encoded}`;
  }, [isOpen, config, widgetDef]);

  if (!isOpen) return null;

  const copyLink = () => {
    navigator.clipboard.writeText(linkUrl);
    alert("Link copied! Paste into Notion using /embed");
  };

  const copyCode = () => {
    const html = widgetDef.generateHTML ? widgetDef.generateHTML(config) : `<!-- ${widgetDef.label} Widget -->`;
    const script = widgetDef.generateScript ? widgetDef.generateScript(config) : '';
    const fullCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${widgetDef.label} Widget</title>
    <style>
      body { margin: 0; padding: 0; width: 100vw; height: 100vh; overflow: hidden; }
    </style>
</head>
<body>
    ${html}
    <script>${script}</script>
</body>
</html>`;
    navigator.clipboard.writeText(fullCode);
    alert("HTML Code copied!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-[#1A1D29] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0B0E12]">
          <h3 className="text-white font-bold text-xl font-mono flex items-center gap-2">
            <Rocket className="text-purple-500" /> GET WIDGET
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X />
          </button>
        </div>
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">Embed Link (Recommended)</h4>
            <div className="bg-[#0B0E12] p-4 rounded-xl border border-gray-800 flex gap-2 items-center">
              <input
                readOnly
                value={linkUrl}
                className="bg-transparent w-full text-sm text-purple-300 outline-none font-mono truncate"
              />
              <button
                onClick={copyLink}
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors"
              >
                Copy Link
              </button>
            </div>
            <p className="text-xs text-gray-500">
              In Notion, type <code className="bg-gray-800 px-1 rounded">/embed</code> and paste this URL.
              Requires this app to be hosted publicly.
            </p>
          </div>
          <div className="border-t border-white/5 pt-6 space-y-4">
            <h4 className="text-lg font-bold text-white">Standalone Code</h4>
            <button
              onClick={copyCode}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Code size={16} /> Copy HTML Code
            </button>
            <p className="text-xs text-gray-500">
              Copy the full HTML code and save it as a .html file. Host it on GitHub Pages, Netlify, or Vercel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- FILE: WidgetLandingPage.jsx ---

function WidgetLandingPage({ onSelect }) {
  return (
    <div className="min-h-screen p-8 md:p-16 flex flex-col items-center" style={{ backgroundColor: 'var(--jazer-night-black)', color: 'var(--jazer-stardust-white)' }}>
      <div className="max-w-6xl w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-full mb-4 animate-pulse-neon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', border: '1px solid var(--jazer-electric-purple)' }}>
            <Layout className="w-8 h-8" style={{ color: 'var(--jazer-electric-purple)' }} />
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight gradient-text neon-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            NOTION WIDGETS
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--jazer-soft-slate)' }}>
            Premium, customizable widgets for your Notion workspace. <span style={{ color: 'var(--jazer-neon-pink)' }}>Cyberpunk aesthetics included.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.values(WIDGET_REGISTRY).map((widget) => (
            <div key={widget.id} className="group rounded-2xl p-1 transition-all duration-300 hover:-translate-y-2 card-neon">
              <div className="h-full rounded-xl p-6 flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--jazer-graphite)' }}>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  {React.cloneElement(widget.icon, { className: "w-24 h-24", style: { color: 'var(--jazer-electric-purple)' } })}
                </div>

                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--jazer-cosmic-blue)' }}>
                  {widget.icon}
                </div>

                <h3 className="text-xl font-bold mb-2 neon-text-blue" style={{ fontFamily: 'Orbitron, sans-serif' }}>{widget.label}</h3>
                <p className="text-sm mb-6 flex-1 leading-relaxed" style={{ color: 'var(--jazer-soft-slate)' }}>
                  {widget.description || `Create a beautiful ${widget.label.toLowerCase()} widget for your Notion pages.`}
                </p>

                <button
                  onClick={() => onSelect(widget.id)}
                  className="w-full py-3 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all btn-neon"
                  style={{ backgroundColor: 'var(--jazer-electric-purple)', color: 'var(--jazer-stardust-white)' }}
                >
                  Build Widget <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <footer className="text-center pt-12 text-sm" style={{ color: 'var(--jazer-soft-slate)' }}>
          <p>© 2025 JaZeR. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

// --- FILE: NotionWidgetBuilder.jsx ---

function NotionWidgetBuilder({ initialWidgetId, onBack }) {
  const [activeWidgetId, setActiveWidgetId] = useState(initialWidgetId);
  const [activeBrandId, setActiveBrandId] = useState('none');
  const [config, setConfig] = useState(WIDGET_REGISTRY[initialWidgetId].defaultConfig);
  const [brandTheme, setBrandTheme] = useState(null); // Store extracted brand colors

  // EXPORT STATES
  const [showExport, setShowExport] = useState(false);

  const debouncedConfig = useDebounce(config, DEBOUNCE_DELAY);

  useEffect(() => {
    // Load JaZeR brand fonts: Orbitron (headings) and Montserrat (body)
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Orbitron:wght@400;700&family=Roboto&family=Open+Sans&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const applyBrandToConfig = (baseConfig, brandId) => {
    const brand = BRAND_KITS[brandId];
    if (!brand || brandId === 'none') return baseConfig;

    const newConfig = { ...baseConfig };
    if (brand.fontFamily) newConfig.fontFamily = brand.fontFamily;
    if (brand.bgColor) newConfig.bgColor = brand.bgColor;
    if (brand.textColor) newConfig.textColor = brand.textColor;
    if (brand.accentColor) newConfig.accentColor = brand.accentColor;

    if (brandId === 'jazer') {
      if (newConfig.glowEffect !== undefined) newConfig.glowEffect = true;
      if (newConfig.gradientText !== undefined) newConfig.gradientText = true;
    }

    return newConfig;
  };

  const handleWidgetChange = (id) => {
    setActiveWidgetId(id);
    const base = WIDGET_REGISTRY[id].defaultConfig;
    setConfig(applyBrandToConfig(base, activeBrandId));
    setShowExport(false);
  };

  const handleBrandChange = (brandId) => {
    const currentDefault = applyBrandToConfig(WIDGET_REGISTRY[activeWidgetId].defaultConfig, activeBrandId);
    const hasCustomizations = JSON.stringify(config) !== JSON.stringify(currentDefault);

    if (hasCustomizations && !window.confirm('Applying a brand kit will override your current customizations. Continue?')) {
      return;
    }

    setActiveBrandId(brandId);
    setConfig(prev => applyBrandToConfig(prev, brandId));
  };

  const handleConfigChange = (key, value) => {
    // If key is 'lightMode' or 'darkMode', value is an object for nested update
    if (key === 'lightMode' || key === 'darkMode') {
      setConfig(p => ({
        ...p,
        [key]: { ...p[key], ...value }
      }));
    } else {
      // Number validation fallback for non-nested properties
      if (typeof config[key] === 'number' && typeof value === 'string') {
        value = parseInt(value) || config[key];
      }
      setConfig(p => ({ ...p, [key]: value }));
    }
  };

  const ActiveWidget = WIDGET_REGISTRY[activeWidgetId];

  // --- EXPORT LOGIC ---

  const generateCode = () => {
    const widgetDef = WIDGET_REGISTRY[activeWidgetId];
    const brand = BRAND_KITS[activeBrandId];
    const fontLinks = brand?.fontLinks || '';
    const cssVariables = brand?.cssVariables || '';
    const extraCSS = brand?.extraCSS || '';
    const fontFamily = brand?.fontFamily || config.fontFamily;

    // NOTE: Removed font imports from generated styles as requested to prevent redundancy if link tags exist
    const commonStyles = `
      ${cssVariables}
      ${extraCSS}
      body { 
        margin: 0; padding: 0; height: 100vh; width: 100vw;
        display: flex; overflow: hidden;
        background-color: ${config.bgColor}; color: ${config.textColor};
        font-family: ${fontFamily};
      }
      .flex { display: flex; } .flex-col { flex-direction: column; }
      .items-center { align-items: center; } .justify-center { justify-content: center; }
      .h-full { height: 100%; } .w-full { width: 100%; }
      .text-center { text-align: center; } .font-bold { font-weight: 700; }
      .italic { font-style: italic; } .p-6 { padding: 1.5rem; }
    `;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${widgetDef.label} Widget</title>
    ${fontLinks}
    <style>${commonStyles}</style>
</head>
<body>
    ${widgetDef.generateHTML(config)}
    <script>${widgetDef.generateScript(config)}</script>
</body>
</html>`;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans h-screen overflow-hidden" style={{ backgroundColor: 'var(--jazer-night-black)', color: 'var(--jazer-stardust-white)' }}>
      {/* SIDEBAR */}
      <div className="w-full md:w-64 flex flex-col z-10 h-full" style={{ backgroundColor: 'var(--jazer-graphite)', borderRight: '1px solid var(--jazer-soft-slate)' }}>
        <div className="p-4" style={{ borderBottom: '1px solid var(--jazer-soft-slate)' }}>
          <button aria-label="Navigate back to home" onClick={onBack} className="flex items-center gap-2 text-xs font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--jazer-soft-slate)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--jazer-electric-purple)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--jazer-soft-slate)'}><ArrowLeft className="w-3 h-3" /> Back to Home</button>
          <h1 className="text-lg font-bold flex items-center gap-2 gradient-text neon-text">
            <Layout className="w-5 h-5" style={{ color: 'var(--jazer-electric-purple)' }} /> Builder
          </h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {Object.values(WIDGET_REGISTRY).map(w => (
            <button key={w.id} aria-label={`Select ${w.label} widget`} onClick={() => handleWidgetChange(w.id)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all text-left" style={{
              backgroundColor: activeWidgetId === w.id ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
              color: activeWidgetId === w.id ? 'var(--jazer-electric-purple)' : 'var(--jazer-stardust-white)',
              border: activeWidgetId === w.id ? '1px solid var(--jazer-electric-purple)' : '1px solid transparent',
              boxShadow: activeWidgetId === w.id ? 'var(--jazer-glow-purple)' : 'none'
            }}>
              <span style={{ color: activeWidgetId === w.id ? 'var(--jazer-electric-purple)' : 'var(--jazer-soft-slate)' }}>{w.icon}</span>
              {w.label}
            </button>
          ))}
        </nav>
      </div>

      {/* PREVIEW */}
      <div className="flex-1 flex flex-col relative h-full" style={{ backgroundColor: 'var(--jazer-night-black)' }}>
        <div className="flex-1 flex items-center justify-center p-8" style={{
          background: activeBrandId === 'jazer' ? `radial-gradient(circle at 50% 10%, ${JAZER_BRAND.ui.nebulaPurple} 0%, ${JAZER_BRAND.colors.nightBlack} 100%)` : '#f5f5f5',
          boxShadow: activeBrandId === 'jazer' ? JAZER_BRAND.glow : 'none'
        }}>
          <div className="w-full max-w-2xl aspect-video shadow-2xl rounded-xl overflow-hidden relative" style={{ backgroundColor: config.bgColor, border: '2px solid var(--jazer-cosmic-blue)', boxShadow: 'var(--jazer-glow-blue), 0 20px 40px rgba(0,0,0,0.4)' }}>
            <WidgetErrorBoundary key={activeWidgetId}>
              <ActiveWidget.Component
                config={debouncedConfig}
                onConfigChange={handleConfigChange}
                brand={JAZER_BRAND}
                brandTheme={brandTheme}
              />
            </WidgetErrorBoundary>
          </div>
        </div>

        {/* EXPORT MODAL */}
        <ExportModal
          isOpen={showExport}
          onClose={() => setShowExport(false)}
          widgetDef={ActiveWidget}
          config={config}
        />
      </div>

      {/* CONFIG */}
      <div className="w-full md:w-80 h-full flex flex-col" style={{ backgroundColor: 'var(--jazer-graphite)', borderLeft: '1px solid var(--jazer-soft-slate)' }}>
        <div className="p-5 flex justify-between items-center" style={{ borderBottom: '1px solid var(--jazer-soft-slate)' }}>
          <h2 className="font-bold text-sm uppercase neon-text" style={{ fontFamily: 'Orbitron, sans-serif', color: 'var(--jazer-electric-purple)', letterSpacing: '0.1em' }}>Configuration</h2>
          <button aria-label="Get export code" onClick={() => setShowExport(true)} className="text-xs px-3 py-1.5 rounded flex items-center gap-1 btn-neon transition-all" style={{ backgroundColor: 'var(--jazer-neon-pink)', color: 'var(--jazer-night-black)', fontWeight: 'bold' }}><Download className="w-3 h-3" /> Get Code</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          {/* Brand Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase"><Briefcase className="w-3 h-3" /> Brand Kit</div>
            <select aria-label="Select brand kit" value={activeBrandId} onChange={(e) => handleBrandChange(e.target.value)} className="w-full p-2 text-sm border rounded">
              <option value="none">None</option>
              <option value="jazer">JaZeR Neon</option>
            </select>
            {activeBrandId === 'jazer' && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs space-y-1">
                <div className="font-bold text-purple-900 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Active Features:</div>
                <ul className="text-purple-700 space-y-0.5 ml-4 list-disc">
                  <li>Orbitron + Montserrat fonts</li>
                  <li>Night Black background</li>
                  <li>Neon gradient effects</li>
                </ul>
              </div>
            )}
          </div>

          {/* Optional: Brand Palette Visualization */}
          {activeBrandId === 'jazer' && <BrandColorPalette />}

          {/* Brand Logo Color Extraction */}
          <BrandLogoUploader
            onColorsExtracted={(theme) => {
              // Save brand theme for generating dynamic presets
              setBrandTheme(theme);

              // Apply extracted colors to widget configuration
              const newConfig = { ...config };

              // Map colors based on widget type
              if (activeWidgetId === 'clock') {
                newConfig.lightMode = {
                  ...newConfig.lightMode,
                  textColor: theme.text,
                  panelColor: theme.background,
                  digitColor: theme.primary
                };
                newConfig.darkMode = {
                  ...newConfig.darkMode,
                  textColor: theme.background,
                  panelColor: theme.text,
                  digitColor: theme.secondary
                };
              } else if (activeWidgetId === 'countdown') {
                newConfig.lightMode = {
                  ...newConfig.lightMode,
                  textColor: theme.text,
                  panelColor: theme.background,
                  digitColor: theme.primary
                };
                newConfig.darkMode = {
                  ...newConfig.darkMode,
                  textColor: theme.background,
                  panelColor: theme.text,
                  digitColor: theme.secondary
                };
              } else if (activeWidgetId === 'counter') {
                newConfig.lightTextColor = theme.text;
                newConfig.darkTextColor = theme.background;
                newConfig.bgColor = theme.background;
              } else if (activeWidgetId === 'newButtonGenerator') {
                // Apply to all buttons
                if (newConfig.buttons && Array.isArray(newConfig.buttons)) {
                  newConfig.buttons = newConfig.buttons.map((btn, idx) => ({
                    ...btn,
                    bgColor: theme.palette[idx % theme.palette.length] || theme.primary,
                    textColor: theme.background,
                    outlineColor: theme.accent
                  }));
                }
              } else if (activeWidgetId === 'quotes') {
                newConfig.lightMode = {
                  ...newConfig.lightMode,
                  textColor: theme.text,
                  authorColor: theme.secondary,
                  backgroundColor: theme.background
                };
                newConfig.darkMode = {
                  ...newConfig.darkMode,
                  textColor: theme.background,
                  authorColor: theme.accent,
                  backgroundColor: theme.text
                };
              } else {
                // Generic color mapping for other widgets
                newConfig.bgColor = theme.background;
                newConfig.textColor = theme.text;
                if (newConfig.accentColor !== undefined) {
                  newConfig.accentColor = theme.primary;
                }
              }

              setConfig(newConfig);
            }}
          />

          <hr className="border-neutral-100" />

          {/* Global Appearance */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase"><Palette className="w-3 h-3" /> Appearance</div>
            {config.fontSize !== undefined && (
              <div className="space-y-1.5">
                <div className="flex justify-between"><label className="block text-xs font-medium text-neutral-600">Font Size</label><span className="text-xs text-neutral-400">{config.fontSize}px</span></div>
                <input aria-label="Font size slider" type="range" min={MIN_FONT_SIZE} max={MAX_FONT_SIZE} value={config.fontSize} onChange={(e) => handleConfigChange('fontSize', parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1.5">Background</label>
                <div className="flex items-center gap-2 border border-neutral-200 p-1 rounded"><input aria-label="Background color" type="color" value={config.bgColor} onChange={(e) => handleConfigChange('bgColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none" /><span className="text-[10px] font-mono text-neutral-400">{config.bgColor}</span></div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1.5">Text</label>
                <div className="flex items-center gap-2 border border-neutral-200 p-1 rounded"><input aria-label="Text color" type="color" value={config.textColor || '#000000'} onChange={(e) => handleConfigChange('textColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none" /><span className="text-[10px] font-mono text-neutral-400">{config.textColor}</span></div>
              </div>
            </div>
          </div>

          <hr className="border-neutral-100" />

          {/* Fields - Grouped by Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase">
              <Settings className="w-3 h-3" /> Settings
            </div>

            {/* Group fields by section */}
            {['time', 'style', 'analog', 'typography', 'background', 'interactive', 'theme', 'appearance', 'features', 'effects'].map(section => {
              const sectionFields = ActiveWidget.fields.filter(f => f.section === section);
              if (sectionFields.length === 0) return null;

              const sectionTitles = {
                time: 'Time Display',
                style: 'Clock Style',
                analog: 'Analog Customization',
                typography: 'Typography',
                background: 'Background',
                interactive: 'Interactive Mode',
                theme: 'Preset Themes',
                appearance: 'Appearance Mode',
                features: 'Additional Features',
                effects: 'Visual Effects',
                event: 'Event Setup',
                units: 'Time Units',
                completion: 'Completion'
              };

              return (
                <div key={section} className="space-y-3">
                  <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide border-b pb-1">
                    {sectionTitles[section]}
                  </div>
                  {sectionFields.map(f => {
                    // Dynamically add brand preset options to presetTheme field
                    let field = f;
                    if (f.name === 'presetTheme' && brandTheme && activeWidgetId === 'clock') {
                      const brandPresets = [
                        { label: '--- Brand-Based Themes ---', value: '__separator__', disabled: true },
                        { label: 'Brand Monochrome', value: 'brand-monochrome' },
                        { label: 'Brand Contrast', value: 'brand-contrast' },
                        { label: 'Brand Vibrant', value: 'brand-vibrant' },
                        { label: 'Brand Professional', value: 'brand-professional' },
                        { label: 'Brand Dark', value: 'brand-dark' },
                        { label: 'Brand Light', value: 'brand-light' },
                        { label: 'Brand Neon', value: 'brand-neon' },
                        { label: 'Brand Minimal', value: 'brand-minimal' }
                      ];
                      field = {
                        ...f,
                        options: [...f.options, ...brandPresets]
                      };
                    }

                    return (
                      <WidgetField
                        key={f.name}
                        field={field}
                        value={config[f.name]}
                        onChange={(val) => handleConfigChange(f.name, val)}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div className="space-y-3 mt-8">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-2">
              <Palette className="w-3 h-3" /> Light Mode Colors
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-600">Text Color</label>
              <div className="flex items-center gap-2 border border-neutral-200 p-1 rounded">
                <input type="color" value={config.lightMode?.textColor || JAZER_BRAND.colors.graphite} onChange={(e) => handleConfigChange('lightMode', { textColor: e.target.value })} className="w-6 h-6 rounded cursor-pointer border-none" />
                <span className="text-[10px] font-mono text-neutral-400">{config.lightMode?.textColor || JAZER_BRAND.colors.graphite}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-600">Panel Color</label>
              <div className="flex items-center gap-2 border border-neutral-200 p-1 rounded">
                <input type="color" value={config.lightMode?.panelColor || JAZER_BRAND.colors.stardustWhite} onChange={(e) => handleConfigChange('lightMode', { panelColor: e.target.value })} className="w-6 h-6 rounded cursor-pointer border-none" />
                <span className="text-[10px] font-mono text-neutral-400">{config.lightMode?.panelColor || JAZER_BRAND.colors.stardustWhite}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-600">Digit Color</label>
              <div className="flex items-center gap-2 border border-neutral-200 p-1 rounded">
                <input type="color" value={config.lightMode?.digitColor || JAZER_BRAND.colors.nightBlack} onChange={(e) => handleConfigChange('lightMode', { digitColor: e.target.value })} className="w-6 h-6 rounded cursor-pointer border-none" />
                <span className="text-[10px] font-mono text-neutral-400">{config.lightMode?.digitColor || JAZER_BRAND.colors.nightBlack}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-8">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-2">
              <Palette className="w-3 h-3" /> Dark Mode Colors
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-600">Text Color</label>
              <div className="flex items-center gap-2 border border-neutral-200 p-1 rounded">
                <input type="color" value={config.darkMode?.textColor || JAZER_BRAND.colors.stardustWhite} onChange={(e) => handleConfigChange('darkMode', { textColor: e.target.value })} className="w-6 h-6 rounded cursor-pointer border-none" />
                <span className="text-[10px] font-mono text-neutral-400">{config.darkMode?.textColor || JAZER_BRAND.colors.stardustWhite}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-600">Panel Color</label>
              <div className="flex items-center gap-2 border border-neutral-200 p-1 rounded">
                <input type="color" value={config.darkMode?.panelColor || JAZER_BRAND.colors.graphite} onChange={(e) => handleConfigChange('darkMode', { panelColor: e.target.value })} className="w-6 h-6 rounded cursor-pointer border-none" />
                <span className="text-[10px] font-mono text-neutral-400">{config.darkMode?.panelColor || JAZER_BRAND.colors.graphite}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-600">Digit Color</label>
              <div className="flex items-center gap-2 border border-neutral-200 p-1 rounded">
                <input type="color" value={config.darkMode?.digitColor || JAZER_BRAND.colors.stardustWhite} onChange={(e) => handleConfigChange('darkMode', { digitColor: e.target.value })} className="w-6 h-6 rounded cursor-pointer border-none" />
                <span className="text-[10px] font-mono text-neutral-400">{config.darkMode?.digitColor || JAZER_BRAND.colors.stardustWhite}</span>
              </div>
            </div>
          </div>

          <hr className="border-neutral-100" />
          {/* Clock Specific Colors */}
          {activeWidgetId === 'clock' && (
            <>
              <hr className="border-neutral-100 my-4" />
              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                💡 <strong>Advanced Clock Features:</strong> Full light/dark mode support, 7+ clock styles, and custom fonts available in the full version.
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

// --- FILE: Main.jsx (Entry Point) ---

export default function App() {
  // Embed mode detection
  const search = useMemo(() => new URLSearchParams(window.location.search), []);
  const isEmbedMode = search.get('embed') === '1';
  const urlWidgetId = search.get('widget');
  const urlConfigStr = search.get('config');

  // State management
  const [view, setView] = useState('landing'); // 'landing' | 'builder'
  const [selectedWidgetId, setSelectedWidgetId] = useState('clock');

  const navigateToBuilder = (id) => {
    setSelectedWidgetId(id);
    setView('builder');
  };

  const navigateToHome = () => {
    setView('landing');
  };

  // Handle embed mode - render widget standalone
  if (isEmbedMode && urlWidgetId && WIDGET_REGISTRY[urlWidgetId]) {
    const widgetDef = WIDGET_REGISTRY[urlWidgetId];
    let widgetConfig = widgetDef.defaultConfig;

    // Decode config from URL if provided
    if (urlConfigStr) {
      const decoded = decodeConfig(urlConfigStr);
      widgetConfig = decoded || widgetDef.defaultConfig;
    }

    const theme = resolveThemeColors(widgetConfig, false);
    const WidgetComponent = widgetDef.Component;

    return (
      <div style={{
        margin: 0,
        padding: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: theme.bg,
        color: theme.text,
        fontFamily: 'sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <div className="w-full h-full">
          <WidgetComponent config={widgetConfig} />
        </div>
      </div>
    );
  }

  // Normal app mode
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@400;700&family=Montserrat:wght@400;600&display=swap');
        ${BRAND_KITS.jazer.extraCSS}
      `}</style>

      {view === 'landing' ? (
        <WidgetLandingPage onSelect={navigateToBuilder} />
      ) : (
        <NotionWidgetBuilder initialWidgetId={selectedWidgetId} onBack={navigateToHome} />
      )}
    </>
  );
}