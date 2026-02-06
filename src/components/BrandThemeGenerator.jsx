import React, { useState, useMemo, useCallback } from 'react';
import { 
  Sparkles, Download, Palette, Check, Copy, 
  RefreshCcw, ArrowLeft, ChevronDown, Shuffle,
  Clock, Quote, Hash, ImageIcon, BarChart3, Hourglass, 
  MousePointerClick, CloudSun
} from 'lucide-react';
import { BrandLogoUploader } from './BrandLogoUploader';
import { generateBrandPresets } from '../utils/brandThemeGenerator';
import { JAZER_BRAND } from '../theme/jazerNeonTheme';
import { normalizeBrandTheme } from '../utils/brandTheme';

const WIDGET_ICONS = {
  clock: Clock,
  quotes: Quote,
  counter: Hash,
  imageGallery: ImageIcon,
  countdown: Hourglass,
  newButtonGenerator: MousePointerClick,
  weather: CloudSun
};

const loadSavedBrandTheme = () => {
  if (typeof window === 'undefined') return null;
  const saved = window.localStorage.getItem('jazer_brand_theme');
  if (!saved) return null;
  try {
    const parsed = JSON.parse(saved);
    if (parsed && parsed.palette && Array.isArray(parsed.palette) && parsed.palette.length > 0) {
      return normalizeBrandTheme(parsed);
    }
    window.localStorage.removeItem('jazer_brand_theme');
  } catch {
    window.localStorage.removeItem('jazer_brand_theme');
  }
  return null;
};

const hslToHex = (h, s, l) => {
  const hue = h / 360;
  const sat = s / 100;
  const light = l / 100;

  const hueToRgb = (p, q, t) => {
    let temp = t;
    if (temp < 0) temp += 1;
    if (temp > 1) temp -= 1;
    if (temp < 1 / 6) return p + (q - p) * 6 * temp;
    if (temp < 1 / 2) return q;
    if (temp < 2 / 3) return p + (q - p) * (2 / 3 - temp) * 6;
    return p;
  };

  let r;
  let g;
  let b;

  if (sat === 0) {
    r = g = b = light;
  } else {
    const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
    const p = 2 * light - q;
    r = hueToRgb(p, q, hue + 1 / 3);
    g = hueToRgb(p, q, hue);
    b = hueToRgb(p, q, hue - 1 / 3);
  }

  const toHex = (value) => {
    const hex = Math.round(value * 255).toString(16).padStart(2, '0');
    return hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const createRandomPalette = () => {
  const baseHue = Math.floor(Math.random() * 360);
  const baseSat = 60 + Math.floor(Math.random() * 20);
  const offsets = [0, 18, 36, 54, 180, 210, 240, 300];
  return offsets.map((offset, idx) => {
    const hue = (baseHue + offset + Math.floor(Math.random() * 12)) % 360;
    const lightness = idx < 2 ? 18 + idx * 8 : idx < 5 ? 46 + idx * 4 : 70 + (idx - 5) * 6;
    return hslToHex(hue, baseSat, lightness);
  });
};

const buildThemeFromPalette = (palette) => {
  if (!palette || palette.length < 4) return null;
  return normalizeBrandTheme({
    palette,
    backgroundColor: palette[0],
    textColor: palette[7] || palette[palette.length - 1],
    primary: palette[2],
    accent: palette[4] || palette[1]
  });
};

const BrandThemeGenerator = ({ onBack, onThemeGenerated }) => {
  console.log('[BrandThemeGenerator v2] Component loaded - Dec 4 2024');
  const [brandTheme, setBrandTheme] = useState(() => loadSavedBrandTheme());
  const generatedPresets = useMemo(
    () => (brandTheme ? generateBrandPresets(brandTheme) : []),
    [brandTheme]
  );
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const selectedPreset = useMemo(() => {
    if (!generatedPresets.length) return null;
    if (selectedPresetId) {
      const match = generatedPresets.find((preset) => preset.id === selectedPresetId);
      if (match) return match;
    }
    return generatedPresets[0];
  }, [generatedPresets, selectedPresetId]);
  const [appliedToWidgets, setAppliedToWidgets] = useState(false);
  const [openBlocks, setOpenBlocks] = useState({
    source: true,
    palette: true,
    preview: true
  });

  const toggleBlock = useCallback((blockId) => {
    setOpenBlocks((prev) => ({
      ...prev,
      [blockId]: !prev[blockId]
    }));
  }, []);

  const activePreviewTheme = useMemo(() => {
    if (!brandTheme) return null;
    if (!selectedPreset) return brandTheme;
    return {
      ...brandTheme,
      ...selectedPreset,
      palette: brandTheme.palette || selectedPreset.palette
    };
  }, [brandTheme, selectedPreset]);

  const handleColorsExtracted = (theme) => {
    if (!theme) {
      setBrandTheme(null);
      setSelectedPresetId(null);
      return;
    }

    const normalized = normalizeBrandTheme(theme);
    setBrandTheme(normalized);
    setSelectedPresetId(null);

    // Save to localStorage
    try {
      localStorage.setItem('jazer_brand_theme', JSON.stringify(normalized));
    } catch {
      // Silently fail if localStorage is not available
    }
  };

  const handleRandomizePalette = useCallback(() => {
    const palette = createRandomPalette();
    const randomTheme = buildThemeFromPalette(palette);
    if (!randomTheme) return;
    setBrandTheme(randomTheme);
    setSelectedPresetId(null);
    try {
      localStorage.setItem('jazer_brand_theme', JSON.stringify(randomTheme));
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleApplyToAllWidgets = () => {
    if (!brandTheme) return;

    // Use selectedPreset if available, otherwise use base brandTheme
    const baseTheme = selectedPreset
      ? {
        ...brandTheme,
        ...selectedPreset,
        palette: brandTheme?.palette || selectedPreset.palette
      }
      : brandTheme;
    const themeToApply = normalizeBrandTheme(baseTheme, {
      presetName: selectedPreset?.name ?? baseTheme?.presetName,
      name: selectedPreset?.name ?? baseTheme?.name
    });

    // Store in localStorage with a global key
    localStorage.setItem('jazer_global_brand_theme', JSON.stringify(themeToApply));
    localStorage.setItem('jazer_global_brand_active', 'true');

    // Notify parent component
    if (onThemeGenerated) {
      onThemeGenerated(themeToApply);
    }

    setAppliedToWidgets(true);

    // Reset after 3 seconds
    setTimeout(() => setAppliedToWidgets(false), 3000);
  };

  const handleClearBrandTheme = () => {
    if (!window.confirm('This will remove your custom brand theme from all widgets. Continue?')) {
      return;
    }

    setBrandTheme(null);
    setSelectedPresetId(null);
    localStorage.removeItem('jazer_brand_theme');
    localStorage.removeItem('jazer_global_brand_theme');
    localStorage.removeItem('jazer_global_brand_active');

    if (onThemeGenerated) {
      onThemeGenerated(null);
    }
  };

  const handleDownloadTheme = () => {
    if (!brandTheme) return;

    const themeData = {
      name: 'Custom Brand Theme',
      timestamp: new Date().toISOString(),
      colors: brandTheme,
      presets: generatedPresets
    };

    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brand-theme.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyColorToClipboard = (color) => {
    navigator.clipboard.writeText(color);
  };

  const hasTheme = Boolean(brandTheme && brandTheme.palette && brandTheme.palette.length);
  const previewBackground = activePreviewTheme?.backgroundColor || activePreviewTheme?.background || '#0B0E12';
  const previewText = activePreviewTheme?.textColor || activePreviewTheme?.text || '#F8F9FF';
  const previewPrimary = activePreviewTheme?.clockColor || activePreviewTheme?.primary || '#6D28D9';
  const previewAccent = activePreviewTheme?.digitColor || activePreviewTheme?.accent || '#00F2EA';

  return (
    <div
      className="min-h-screen px-6 md:px-12 py-10 animate-fadeIn"
      style={{
        background: 'radial-gradient(circle at top, rgba(0, 242, 234, 0.12), transparent 55%), radial-gradient(circle at 20% 20%, rgba(255, 0, 110, 0.12), transparent 45%), #05070D',
        color: '#F8F9FF'
      }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-3 rounded-xl transition-all hover:scale-105 btn-ghost"
              style={{
                background: 'var(--bg-card)',
                border: '2px solid var(--border-cyan)',
                color: 'var(--jazer-cyan)'
              }}
              aria-label="Back to builder"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1
                className="text-4xl md:text-5xl font-black tracking-tight"
                style={{
                  fontFamily: 'var(--font-primary)',
                  background: 'var(--gradient-text)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textTransform: 'uppercase'
                }}
              >
                Brand Kit Lab
              </h1>
              <p
                className="text-lg mt-2"
                style={{
                  color: 'var(--text-gray)',
                  fontFamily: 'var(--font-body)'
                }}
              >
                Explore playful palettes, remix presets, and ship your theme.
              </p>
            </div>
          </div>

          {hasTheme && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleDownloadTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all hover:scale-105"
                style={{
                  background: 'var(--gradient-accent)',
                  color: 'white',
                  border: '2px solid var(--border-pink)',
                  fontFamily: 'var(--font-secondary)',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em'
                }}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={handleClearBrandTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all hover:scale-105"
                style={{
                  background: 'var(--bg-card)',
                  color: 'var(--text-gray)',
                  border: '2px solid var(--border-default)',
                  fontFamily: 'var(--font-secondary)',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em'
                }}
              >
                <RefreshCcw className="w-4 h-4" />
                Clear
              </button>
            </div>
          )}
        </div>

        <div
          className="relative overflow-hidden rounded-[32px] border p-6 md:p-8 space-y-6"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 15, 30, 0.92), rgba(6, 10, 18, 0.92))',
            borderColor: 'rgba(99, 102, 241, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45)'
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 10% 10%, rgba(0, 242, 234, 0.12), transparent 45%), radial-gradient(circle at 80% 20%, rgba(255, 0, 110, 0.12), transparent 50%)',
              opacity: 0.7
            }}
          />

          <div className="relative space-y-5">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.45em]" style={{ color: 'var(--text-gray)', fontFamily: 'var(--font-secondary)' }}>
                  Palette Lab
                </div>
                <h2 className="text-2xl md:text-3xl font-black" style={{ fontFamily: 'var(--font-primary)', color: 'white' }}>
                  Source. Remix. Preview.
                </h2>
                <p className="text-sm mt-2" style={{ color: 'var(--text-gray)', fontFamily: 'var(--font-body)' }}>
                  Upload a logo, randomize a palette, then explore variations before applying.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--text-gray)', fontFamily: 'var(--font-secondary)' }}>
                  Status
                </span>
                <span
                  className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.3em]"
                  style={{
                    background: hasTheme ? 'rgba(0, 242, 234, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                    color: hasTheme ? 'var(--jazer-cyan)' : 'var(--text-gray)',
                    border: hasTheme ? '1px solid rgba(0, 242, 234, 0.4)' : '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  {hasTheme ? 'Palette Ready' : 'No Palette'}
                </span>
              </div>
            </div>

            <section className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(0, 242, 234, 0.25)', background: 'rgba(4, 8, 15, 0.6)' }}>
              <button
                type="button"
                onClick={() => toggleBlock('source')}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={openBlocks.source}
                aria-controls="brand-block-source"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl" style={{ background: 'rgba(0, 242, 234, 0.12)', color: 'var(--jazer-cyan)' }}>
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-sm font-bold" style={{ color: 'white', fontFamily: 'var(--font-secondary)' }}>Source</div>
                    <div className="text-xs" style={{ color: 'var(--text-gray)', fontFamily: 'var(--font-body)' }}>
                      Upload a logo, randomize, or reuse a palette.
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {hasTheme && !openBlocks.source && (
                    <div className="flex items-center gap-1">
                      {brandTheme.palette.slice(0, 4).map((color, idx) => (
                        <span
                          key={`${color}-${idx}`}
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: color, borderColor: 'rgba(255,255,255,0.4)' }}
                        />
                      ))}
                    </div>
                  )}
                  <ChevronDown className={`w-4 h-4 transition-transform ${openBlocks.source ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {openBlocks.source && (
                <div id="brand-block-source" className="px-5 pb-5 space-y-4">
                  <BrandLogoUploader onColorsExtracted={handleColorsExtracted} />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleRandomizePalette}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all hover:scale-105"
                      style={{
                        background: 'rgba(255, 0, 110, 0.15)',
                        color: 'var(--jazer-pink)',
                        border: '1px solid rgba(255, 0, 110, 0.4)',
                        fontFamily: 'var(--font-secondary)'
                      }}
                    >
                      <Shuffle className="w-4 h-4" />
                      Randomize palette
                    </button>
                    {hasTheme && (
                      <button
                        type="button"
                        onClick={handleClearBrandTheme}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all hover:scale-105"
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: 'var(--text-gray)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          fontFamily: 'var(--font-secondary)'
                        }}
                      >
                        <RefreshCcw className="w-4 h-4" />
                        Clear palette
                      </button>
                    )}
                  </div>

                  {hasTheme && (
                    <div className="flex flex-wrap gap-2">
                      {brandTheme.palette.slice(0, 8).map((color, idx) => (
                        <button
                          key={`${color}-${idx}`}
                          type="button"
                          onClick={() => copyColorToClipboard(color)}
                          className="group flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] border transition-all hover:scale-105"
                          style={{
                            background: 'rgba(10, 12, 20, 0.8)',
                            color: 'var(--text-gray)',
                            borderColor: 'rgba(255,255,255,0.15)',
                            fontFamily: 'var(--font-secondary)'
                          }}
                        >
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                          {color}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>

            <section className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(147, 51, 234, 0.3)', background: 'rgba(6, 8, 16, 0.65)' }}>
              <button
                type="button"
                onClick={() => toggleBlock('palette')}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={openBlocks.palette}
                aria-controls="brand-block-palette"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl" style={{ background: 'rgba(147, 51, 234, 0.15)', color: 'var(--jazer-purple)' }}>
                    <Palette className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-sm font-bold" style={{ color: 'white', fontFamily: 'var(--font-secondary)' }}>Palette</div>
                    <div className="text-xs" style={{ color: 'var(--text-gray)', fontFamily: 'var(--font-body)' }}>
                      Explore swatches and pick a preset.
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!openBlocks.palette && generatedPresets.length > 0 && (
                    <span className="text-[10px] uppercase tracking-[0.25em]" style={{ color: 'var(--text-gray)' }}>
                      {generatedPresets.length} presets
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 transition-transform ${openBlocks.palette ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {openBlocks.palette && (
                <div id="brand-block-palette" className="px-5 pb-5 space-y-5">
                  {!hasTheme ? (
                    <div
                      className="text-center py-12 rounded-xl border-2 border-dashed"
                      style={{
                        borderColor: 'rgba(147, 51, 234, 0.35)',
                        color: 'var(--text-gray)',
                        background: 'rgba(147, 51, 234, 0.08)'
                      }}
                    >
                      <Sparkles className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--jazer-purple)', opacity: 0.7 }} />
                      <p className="text-lg font-bold" style={{ fontFamily: 'var(--font-secondary)', color: 'white' }}>
                        Add a logo or randomize to unlock palettes
                      </p>
                      <p className="text-xs mt-2" style={{ fontFamily: 'var(--font-body)' }}>
                        We will generate playful variations automatically.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                        {brandTheme.palette.map((color, idx) => (
                          <button
                            key={`${color}-${idx}`}
                            type="button"
                            onClick={() => copyColorToClipboard(color)}
                            className="group relative text-center transition-transform hover:scale-110"
                            title={`Click to copy ${color}`}
                          >
                            <div
                              className="w-full h-12 rounded-lg border"
                              style={{
                                backgroundColor: color,
                                borderColor: 'rgba(255, 255, 255, 0.2)'
                              }}
                            />
                            <div
                              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                            >
                              <Copy className="w-4 h-4" style={{ color: 'white' }} />
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--text-gray)', fontFamily: 'var(--font-secondary)' }}>
                          Presets
                        </h3>
                        <span className="text-[10px] uppercase tracking-[0.25em]" style={{ color: 'var(--text-gray)' }}>
                          {generatedPresets.length} variations
                        </span>
                      </div>

                      {generatedPresets.length === 0 ? (
                        <div className="text-sm" style={{ color: 'var(--text-gray)' }}>
                          We need at least 8 palette colors to generate presets.
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                          {generatedPresets.map((preset) => (
                            <button
                              key={preset.id}
                              onClick={() => setSelectedPresetId(preset.id)}
                              className="w-full text-left p-4 rounded-2xl transition-all hover:scale-[1.02]"
                              style={{
                                background: selectedPreset?.id === preset.id
                                  ? 'var(--gradient-card)'
                                  : 'rgba(6, 8, 16, 0.8)',
                                border: `2px solid ${
                                  selectedPreset?.id === preset.id
                                    ? 'var(--jazer-cyan)'
                                    : 'rgba(255, 255, 255, 0.15)'
                                }`,
                                boxShadow: selectedPreset?.id === preset.id ? 'var(--shadow-cyan)' : 'none'
                              }}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4
                                    className="font-bold text-sm"
                                    style={{
                                      color: 'white',
                                      fontFamily: 'var(--font-secondary)'
                                    }}
                                  >
                                    {preset.name}
                                  </h4>
                                  <p
                                    className="text-xs mt-1"
                                    style={{ color: 'var(--text-gray)' }}
                                  >
                                    {preset.description}
                                  </p>
                                </div>
                                {selectedPreset?.id === preset.id && (
                                  <Check
                                    className="w-5 h-5"
                                    style={{ color: 'var(--jazer-cyan)' }}
                                  />
                                )}
                              </div>

                              <div className="flex gap-2">
                                <div
                                  className="flex-1 h-7 rounded"
                                  style={{ backgroundColor: preset.backgroundColor }}
                                  title={`Background: ${preset.backgroundColor}`}
                                />
                                <div
                                  className="flex-1 h-7 rounded"
                                  style={{ backgroundColor: preset.clockColor }}
                                  title={`Primary: ${preset.clockColor}`}
                                />
                                <div
                                  className="flex-1 h-7 rounded"
                                  style={{ backgroundColor: preset.digitColor }}
                                  title={`Digits: ${preset.digitColor}`}
                                />
                                <div
                                  className="flex-1 h-7 rounded"
                                  style={{ backgroundColor: preset.textColor }}
                                  title={`Text: ${preset.textColor}`}
                                />
                              </div>

                              {preset.glow && (
                                <div
                                  className="mt-2 text-xs flex items-center gap-2"
                                  style={{ color: 'var(--jazer-cyan)' }}
                                >
                                  <Sparkles className="w-3 h-3" />
                                  Includes glow effect
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </section>

            <section className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(255, 0, 110, 0.28)', background: 'rgba(6, 8, 16, 0.65)' }}>
              <button
                type="button"
                onClick={() => toggleBlock('preview')}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={openBlocks.preview}
                aria-controls="brand-block-preview"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl" style={{ background: 'rgba(255, 0, 110, 0.15)', color: 'var(--jazer-pink)' }}>
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-sm font-bold" style={{ color: 'white', fontFamily: 'var(--font-secondary)' }}>Preview</div>
                    <div className="text-xs" style={{ color: 'var(--text-gray)', fontFamily: 'var(--font-body)' }}>
                      See your palette in motion.
                    </div>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${openBlocks.preview ? 'rotate-180' : ''}`} />
              </button>

              {openBlocks.preview && (
                <div id="brand-block-preview" className="px-5 pb-5 space-y-5">
                  {!hasTheme ? (
                    <div
                      className="text-center py-12 rounded-xl border-2 border-dashed"
                      style={{
                        borderColor: 'rgba(255, 0, 110, 0.35)',
                        color: 'var(--text-gray)',
                        background: 'rgba(255, 0, 110, 0.08)'
                      }}
                    >
                      <Sparkles className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--jazer-pink)', opacity: 0.7 }} />
                      <p className="text-lg font-bold" style={{ fontFamily: 'var(--font-secondary)', color: 'white' }}>
                        Preview appears after you create a palette
                      </p>
                    </div>
                  ) : (
                    <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-4">
                      <div
                        className="rounded-2xl p-5 border"
                        style={{
                          backgroundColor: previewBackground,
                          color: previewText,
                          borderColor: 'rgba(255,255,255,0.15)'
                        }}
                      >
                        <div className="text-[10px] uppercase tracking-[0.4em]" style={{ opacity: 0.7 }}>MetraNode</div>
                        <div className="text-2xl font-black mt-2">Brand Pulse</div>
                        <p className="text-xs mt-2" style={{ opacity: 0.8 }}>
                          A playful surface that reacts to your palette choices.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span
                            className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.3em]"
                            style={{ background: previewPrimary, color: previewBackground }}
                          >
                            Primary
                          </span>
                          <span
                            className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.3em]"
                            style={{ background: previewAccent, color: previewBackground }}
                          >
                            Accent
                          </span>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          {brandTheme.palette.slice(0, 5).map((color, idx) => (
                            <span
                              key={`${color}-${idx}`}
                              className="w-5 h-5 rounded-full border"
                              style={{ backgroundColor: color, borderColor: 'rgba(255,255,255,0.4)' }}
                            />
                          ))}
                        </div>
                      </div>

                      <div
                        className="rounded-2xl p-4 border"
                        style={{
                          background: 'rgba(8, 12, 20, 0.8)',
                          borderColor: 'rgba(255,255,255,0.15)'
                        }}
                      >
                        <h3
                          className="text-xs uppercase tracking-[0.4em] mb-4"
                          style={{ color: 'var(--text-gray)', fontFamily: 'var(--font-secondary)' }}
                        >
                          Widgets using your theme
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(WIDGET_ICONS).map(([key, IconEntry]) => {
                            const IconComponent = IconEntry;
                            return (
                              <div
                                key={key}
                                className="p-3 rounded-xl text-center"
                                style={{
                                  background: 'rgba(12, 16, 28, 0.7)',
                                  border: '1px solid rgba(255,255,255,0.12)'
                                }}
                              >
                                <IconComponent
                                  className="w-6 h-6 mx-auto mb-2"
                                  style={{ color: previewPrimary }}
                                />
                                <div
                                  className="text-[10px] font-bold capitalize"
                                  style={{ color: 'white', fontFamily: 'var(--font-secondary)' }}
                                >
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {hasTheme && (
              <div className="sticky bottom-0 pt-4">
                <div
                  className="rounded-2xl border p-4 backdrop-blur"
                  style={{
                    background: 'rgba(5, 7, 13, 0.92)',
                    borderColor: 'rgba(255,255,255,0.15)'
                  }}
                >
                  <button
                    onClick={handleApplyToAllWidgets}
                    disabled={appliedToWidgets}
                    className="w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: appliedToWidgets
                        ? 'linear-gradient(135deg, #00f2ea 0%, #4facfe 100%)'
                        : 'var(--gradient-accent)',
                      color: 'white',
                      fontFamily: 'var(--font-primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      border: appliedToWidgets ? '2px solid var(--jazer-cyan)' : '2px solid var(--border-pink)',
                      boxShadow: appliedToWidgets ? 'var(--shadow-cyan)' : 'var(--shadow-card)'
                    }}
                  >
                    {appliedToWidgets ? (
                      <>
                        <Check className="w-6 h-6" />
                        {selectedPreset ? `${selectedPreset.name} Applied!` : 'Theme Applied!'}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6" />
                        {selectedPreset ? `Apply ${selectedPreset.name}` : 'Apply to All Widgets'}
                      </>
                    )}
                  </button>
                  <p
                    className="text-xs text-center mt-2"
                    style={{ color: 'var(--text-gray)' }}
                  >
                    {selectedPreset
                      ? `This will apply "${selectedPreset.name}" preset to all widgets`
                      : 'This will set your brand colors as the default for all widgets'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000000;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--jazer-purple);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--jazer-cyan);
        }
      `}</style>
    </div>
  );

};

export default BrandThemeGenerator;
