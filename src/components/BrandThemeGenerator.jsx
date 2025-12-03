import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Download, Palette, Check, Copy, 
  RefreshCcw, Eye, EyeOff, ChevronRight, ArrowLeft,
  Clock, Quote, Hash, ImageIcon, BarChart3, Hourglass, 
  MousePointerClick, CloudSun
} from 'lucide-react';
import { BrandLogoUploader } from './BrandLogoUploader';
import { generateBrandPresets } from '../utils/brandThemeGenerator';

const JAZER_BRAND = {
  colors: {
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
  fonts: {
    heading: '"Orbitron", system-ui, sans-serif',
    body: '"Montserrat", system-ui, sans-serif'
  },
  glow: '0 0 4px rgba(139, 92, 246, 0.5)',
};

const WIDGET_ICONS = {
  clock: Clock,
  quotes: Quote,
  counter: Hash,
  imageGallery: ImageIcon,
  lifeProgress: BarChart3,
  countdown: Hourglass,
  newButtonGenerator: MousePointerClick,
  weather: CloudSun
};

const BrandThemeGenerator = ({ onBack, onThemeGenerated }) => {
  const [brandTheme, setBrandTheme] = useState(null);
  const [generatedPresets, setGeneratedPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [appliedToWidgets, setAppliedToWidgets] = useState(false);

  useEffect(() => {
    // Load saved brand theme from localStorage
    const saved = localStorage.getItem('jazer_brand_theme');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBrandTheme(parsed);
        generatePresetsFromTheme(parsed);
      } catch (e) {
        console.error('Failed to load saved brand theme:', e);
      }
    }
  }, []);

  const handleColorsExtracted = (theme) => {
    setBrandTheme(theme);
    generatePresetsFromTheme(theme);
    
    // Save to localStorage
    localStorage.setItem('jazer_brand_theme', JSON.stringify(theme));
  };

  const generatePresetsFromTheme = (theme) => {
    const presets = generateBrandPresets(theme);
    setGeneratedPresets(presets);
    if (presets.length > 0) {
      setSelectedPreset(presets[0]);
    }
  };

  const handleApplyToAllWidgets = () => {
    if (!brandTheme) return;

    // Store in localStorage with a global key
    localStorage.setItem('jazer_global_brand_theme', JSON.stringify(brandTheme));
    localStorage.setItem('jazer_global_brand_active', 'true');

    // Notify parent component
    if (onThemeGenerated) {
      onThemeGenerated(brandTheme);
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
    setGeneratedPresets([]);
    setSelectedPreset(null);
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

  return (
    <div 
      className="min-h-screen p-8 md:p-16"
      style={{ 
        backgroundColor: JAZER_BRAND.colors.nightBlack,
        color: JAZER_BRAND.colors.stardustWhite 
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg transition-all hover:scale-105"
              style={{
                backgroundColor: JAZER_BRAND.colors.graphite,
                color: JAZER_BRAND.colors.softSlate
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 
                className="text-4xl md:text-5xl font-black tracking-tight"
                style={{ 
                  fontFamily: JAZER_BRAND.fonts.heading,
                  background: `linear-gradient(90deg, ${JAZER_BRAND.colors.electricPurple} 0%, ${JAZER_BRAND.colors.cosmicBlue} 50%, ${JAZER_BRAND.colors.neonPink} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: JAZER_BRAND.glow
                }}
              >
                BRAND THEME GENERATOR
              </h1>
              <p 
                className="text-lg mt-2"
                style={{ color: JAZER_BRAND.colors.softSlate }}
              >
                Extract colors from your logo and apply them to all widgets
              </p>
            </div>
          </div>

          {brandTheme && (
            <div className="flex gap-3">
              <button
                onClick={handleDownloadTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
                style={{
                  backgroundColor: JAZER_BRAND.colors.cosmicBlue,
                  color: JAZER_BRAND.colors.stardustWhite
                }}
              >
                <Download className="w-4 h-4" />
                Export Theme
              </button>
              <button
                onClick={handleClearBrandTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
                style={{
                  backgroundColor: JAZER_BRAND.colors.graphite,
                  color: JAZER_BRAND.colors.softSlate
                }}
              >
                <RefreshCcw className="w-4 h-4" />
                Clear Theme
              </button>
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Uploader */}
          <div className="space-y-6">
            <div
              className="rounded-xl p-8"
              style={{
                backgroundColor: JAZER_BRAND.colors.graphite,
                border: `1px solid ${JAZER_BRAND.colors.electricPurple}40`
              }}
            >
              <BrandLogoUploader onColorsExtracted={handleColorsExtracted} />

              {brandTheme && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 
                      className="text-sm font-bold uppercase tracking-wider"
                      style={{ 
                        color: JAZER_BRAND.colors.softSlate,
                        fontFamily: JAZER_BRAND.fonts.heading
                      }}
                    >
                      Extracted Colors
                    </h3>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="p-1 rounded transition-colors"
                      style={{ color: JAZER_BRAND.colors.softSlate }}
                    >
                      {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {showPreview && (
                    <div className="grid grid-cols-4 gap-3">
                      {brandTheme.palette.map((color, idx) => (
                        <button
                          key={idx}
                          onClick={() => copyColorToClipboard(color)}
                          className="group relative text-center transition-transform hover:scale-110"
                          title={`Click to copy ${color}`}
                        >
                          <div
                            className="w-full h-16 rounded-lg border-2 transition-all"
                            style={{ 
                              backgroundColor: color,
                              borderColor: JAZER_BRAND.colors.stardustWhite + '20'
                            }}
                          />
                          <div 
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                          >
                            <Copy className="w-4 h-4" style={{ color: JAZER_BRAND.colors.stardustWhite }} />
                          </div>
                          <div 
                            className="text-[9px] font-mono mt-1"
                            style={{ color: JAZER_BRAND.colors.softSlate }}
                          >
                            {color}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Apply to All Widgets Button */}
                  <button
                    onClick={handleApplyToAllWidgets}
                    disabled={appliedToWidgets}
                    className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: appliedToWidgets 
                        ? `linear-gradient(90deg, ${JAZER_BRAND.colors.aetherTeal} 0%, ${JAZER_BRAND.colors.cosmicBlue} 100%)`
                        : `linear-gradient(90deg, ${JAZER_BRAND.colors.electricPurple} 0%, ${JAZER_BRAND.colors.neonPink} 100%)`,
                      color: JAZER_BRAND.colors.stardustWhite,
                      fontFamily: JAZER_BRAND.fonts.heading,
                      boxShadow: JAZER_BRAND.glow
                    }}
                  >
                    {appliedToWidgets ? (
                      <>
                        <Check className="w-6 h-6" />
                        Theme Applied!
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6" />
                        Apply to All Widgets
                      </>
                    )}
                  </button>

                  <p 
                    className="text-xs text-center"
                    style={{ color: JAZER_BRAND.colors.softSlate }}
                  >
                    This will set your brand colors as the default for all widgets
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Presets */}
          <div className="space-y-6">
            <div
              className="rounded-xl p-8"
              style={{
                backgroundColor: JAZER_BRAND.colors.graphite,
                border: `1px solid ${JAZER_BRAND.colors.cosmicBlue}40`
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Palette 
                  className="w-6 h-6"
                  style={{ color: JAZER_BRAND.colors.cosmicBlue }}
                />
                <h3 
                  className="text-xl font-bold"
                  style={{ 
                    fontFamily: JAZER_BRAND.fonts.heading,
                    color: JAZER_BRAND.colors.stardustWhite
                  }}
                >
                  Generated Presets ({generatedPresets.length})
                </h3>
              </div>

              {generatedPresets.length === 0 ? (
                <div 
                  className="text-center py-12 rounded-lg border-2 border-dashed"
                  style={{ 
                    borderColor: JAZER_BRAND.colors.softSlate + '40',
                    color: JAZER_BRAND.colors.softSlate
                  }}
                >
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Upload a logo to generate presets</p>
                  <p className="text-sm mt-2">8 unique color schemes will be created</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {generatedPresets.map((preset, idx) => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset)}
                      className="w-full text-left p-4 rounded-lg transition-all hover:scale-[1.02]"
                      style={{
                        backgroundColor: selectedPreset?.id === preset.id 
                          ? JAZER_BRAND.colors.electricPurple + '20'
                          : JAZER_BRAND.colors.nightBlack + '80',
                        border: `2px solid ${
                          selectedPreset?.id === preset.id 
                            ? JAZER_BRAND.colors.electricPurple 
                            : 'transparent'
                        }`
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 
                            className="font-bold text-sm"
                            style={{ 
                              color: JAZER_BRAND.colors.stardustWhite,
                              fontFamily: JAZER_BRAND.fonts.heading
                            }}
                          >
                            {preset.name}
                          </h4>
                          <p 
                            className="text-xs mt-1"
                            style={{ color: JAZER_BRAND.colors.softSlate }}
                          >
                            {preset.description}
                          </p>
                        </div>
                        {selectedPreset?.id === preset.id && (
                          <Check 
                            className="w-5 h-5"
                            style={{ color: JAZER_BRAND.colors.electricPurple }}
                          />
                        )}
                      </div>

                      <div className="flex gap-2">
                        <div 
                          className="flex-1 h-8 rounded"
                          style={{ backgroundColor: preset.backgroundColor }}
                          title={`Background: ${preset.backgroundColor}`}
                        />
                        <div 
                          className="flex-1 h-8 rounded"
                          style={{ backgroundColor: preset.clockColor }}
                          title={`Primary: ${preset.clockColor}`}
                        />
                        <div 
                          className="flex-1 h-8 rounded"
                          style={{ backgroundColor: preset.digitColor }}
                          title={`Digits: ${preset.digitColor}`}
                        />
                        <div 
                          className="flex-1 h-8 rounded"
                          style={{ backgroundColor: preset.textColor }}
                          title={`Text: ${preset.textColor}`}
                        />
                      </div>

                      {preset.glow && (
                        <div 
                          className="mt-2 text-xs flex items-center gap-2"
                          style={{ color: JAZER_BRAND.colors.aetherTeal }}
                        >
                          <Sparkles className="w-3 h-3" />
                          Includes glow effect
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Widget Coverage */}
        {brandTheme && (
          <div
            className="rounded-xl p-8"
            style={{
              backgroundColor: JAZER_BRAND.colors.graphite,
              border: `1px solid ${JAZER_BRAND.colors.aetherTeal}40`
            }}
          >
            <h3 
              className="text-xl font-bold mb-6 flex items-center gap-3"
              style={{ 
                fontFamily: JAZER_BRAND.fonts.heading,
                color: JAZER_BRAND.colors.stardustWhite
              }}
            >
              <Sparkles 
                className="w-6 h-6"
                style={{ color: JAZER_BRAND.colors.aetherTeal }}
              />
              Widgets Using Your Brand Theme
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(WIDGET_ICONS).map(([key, Icon]) => (
                <div
                  key={key}
                  className="p-4 rounded-lg text-center transition-all hover:scale-105"
                  style={{
                    backgroundColor: JAZER_BRAND.colors.nightBlack,
                    border: `1px solid ${JAZER_BRAND.colors.stardustWhite}20`
                  }}
                >
                  <Icon 
                    className="w-8 h-8 mx-auto mb-2"
                    style={{ color: brandTheme.primary }}
                  />
                  <div 
                    className="text-sm font-medium capitalize"
                    style={{ color: JAZER_BRAND.colors.stardustWhite }}
                  >
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div 
                    className="text-xs mt-1"
                    style={{ color: JAZER_BRAND.colors.aetherTeal }}
                  >
                    Theme Active
                  </div>
                </div>
              ))}
            </div>

            <div 
              className="mt-6 p-4 rounded-lg"
              style={{
                backgroundColor: JAZER_BRAND.colors.electricPurple + '10',
                border: `1px solid ${JAZER_BRAND.colors.electricPurple}40`
              }}
            >
              <p 
                className="text-sm"
                style={{ color: JAZER_BRAND.colors.stardustWhite }}
              >
                💡 <strong>Pro Tip:</strong> Your brand theme is saved locally and will be automatically applied to all widgets. You can always come back here to update or clear your theme.
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${JAZER_BRAND.colors.nightBlack};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${JAZER_BRAND.colors.electricPurple};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${JAZER_BRAND.colors.ultraviolet};
        }
      `}</style>
    </div>
  );
};

export default BrandThemeGenerator;
