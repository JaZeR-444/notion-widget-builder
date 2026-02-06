import React from 'react';
import { Palette, Sparkles } from 'lucide-react';

export function InspectorBrandTab({
  ui,
  isDarkMode,
  activeBrandId,
  hasCustomBrandTheme,
  customBrandLabel,
  effectiveBrandTheme,
  onBrandChange,
  onLaunchBrandGenerator,
  onLogoColorsExtracted,
  BrandColorPalette,
  BrandLogoUploader,
  config,
  handleConfigChange,
  JAZER_BRAND,
  activeWidgetId,
  onRegisterSectionRef,
  minFontSize,
  maxFontSize
}) {
  const palette = effectiveBrandTheme?.palette || [];
  const fontMin = Number.isFinite(minFontSize) ? minFontSize : 8;
  const fontMax = Number.isFinite(maxFontSize) ? maxFontSize : 30;
  const BrandColorPaletteComponent = BrandColorPalette;
  const BrandLogoUploaderComponent = BrandLogoUploader;
  const backgroundColorId = 'brand-bg-color';
  const textColorId = 'brand-text-color';
  const lightTextColorId = 'light-mode-text-color';
  const lightPanelColorId = 'light-mode-panel-color';
  const lightDigitColorId = 'light-mode-digit-color';
  const darkTextColorId = 'dark-mode-text-color';
  const darkPanelColorId = 'dark-mode-panel-color';
  const darkDigitColorId = 'dark-mode-digit-color';

  return (
    <div id="inspector-panel-brand" role="tabpanel" aria-label="Brand">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-[10px] uppercase tracking-[0.3em] ${ui.muted}`}>Brand</div>
            <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Palette + Surface</h3>
          </div>
          {onLaunchBrandGenerator && (
            <button
              type="button"
              onClick={onLaunchBrandGenerator}
              className={`text-[10px] px-3 py-1.5 rounded-full border transition-colors ${
                isDarkMode ? 'border-cyan-400/60 text-cyan-100 hover:border-cyan-200' : 'border-cyan-300 text-cyan-700 hover:border-cyan-400'
              }`}
            >
              Launch Generator
            </button>
          )}
        </div>

        <section
          ref={(el) => onRegisterSectionRef?.('brandControls', el)}
          className={`space-y-3 border rounded-xl p-4 ${ui.card}`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className={`text-xs font-medium ${ui.mutedStrong}`}>Active Kit</span>
            <div className="flex-1 max-w-[180px]">
              <label htmlFor="brand-kit-select" className="sr-only">Select brand kit</label>
              <select
                id="brand-kit-select"
                aria-label="Select brand kit"
                value={activeBrandId}
                onChange={(e) => onBrandChange(e.target.value)}
                className={`w-full rounded-lg text-xs px-2 py-1.5 border outline-none focus:ring-1 focus:ring-purple-500 ${isDarkMode ? 'bg-[#0B0E12] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-700'}`}
              >
                <option value="none">None (Default)</option>
                <option value="jazer">Neon (Preset)</option>
                {hasCustomBrandTheme && (
                  <option value="custom">{customBrandLabel}</option>
                )}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-3">
              {activeBrandId === 'jazer' && (
                <div className={`p-3 rounded-xl text-xs space-y-1 ${isDarkMode ? 'bg-purple-500/10 border border-purple-400/40 text-purple-100' : 'bg-purple-50 border border-purple-200 text-purple-700'}`}>
                  <div className="font-semibold flex items-center gap-2"><Sparkles className="w-3 h-3" /> Official Neon Kit</div>
                  <p className={isDarkMode ? 'text-purple-200/80' : 'text-purple-600'}>Orbitron & Montserrat fonts, neon gradient accents, and night-mode canvas.</p>
                </div>
              )}
              {activeBrandId === 'custom' && effectiveBrandTheme && (
                <div className={`p-3 rounded-xl text-xs space-y-2 ${isDarkMode ? 'bg-cyan-500/10 border border-cyan-400/40 text-cyan-100' : 'bg-cyan-50 border border-cyan-200 text-cyan-700'}`}>
                  <div className="font-semibold flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> {customBrandLabel}
                  </div>
                  <p className={isDarkMode ? 'text-cyan-100/80' : 'text-cyan-600'}>Widgets are synced with your logo palette.</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Background', color: effectiveBrandTheme.backgroundColor || effectiveBrandTheme.background },
                      { label: 'Primary', color: effectiveBrandTheme.clockColor || effectiveBrandTheme.primary },
                      { label: 'Digits', color: effectiveBrandTheme.digitColor || effectiveBrandTheme.secondary },
                      { label: 'Text', color: effectiveBrandTheme.textColor || effectiveBrandTheme.text }
                    ].map(({ label, color }) => (
                      <div key={label} className="text-center">
                        <div className={`h-10 rounded border ${isDarkMode ? 'border-white/20' : 'border-slate-200'}`} style={{ backgroundColor: color || '#0B0E12' }} />
                        <div className={`mt-1 text-[9px] uppercase ${ui.muted}`}>{label}</div>
                        <div className={`text-[9px] font-mono ${ui.mutedStrong}`}>{color || '--'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {activeBrandId === 'custom' && palette.length > 0 && (
              <div className={`rounded-xl p-3 border ${isDarkMode ? 'bg-[#0B0E12] border-white/10' : 'bg-white border-slate-200'}`}>
                <div className={`text-[10px] uppercase mb-2 ${ui.sidebarMuted}`}>Palette Swatches</div>
                <div className="grid grid-cols-5 gap-2">
                  {palette.map((color, idx) => (
                    <div key={`${color}-${idx}`} className="text-center">
                      <div className={`w-full h-10 rounded border ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`} style={{ backgroundColor: color }} />
                      <div className={`text-[8px] truncate mt-1 ${ui.muted}`}>{color}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeBrandId === 'jazer' && <BrandColorPaletteComponent />}
          </div>
        </section>

        <section
          ref={(el) => onRegisterSectionRef?.('appearanceControls', el)}
          className={`space-y-3 border rounded-xl p-4 ${ui.card}`}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className={`text-sm font-bold uppercase tracking-widest ${ui.muted}`}>Surface Controls</h4>
            {config.fontSize !== undefined && (
              <div className={`text-[10px] font-mono ${ui.mutedStrong}`}>
                {config.fontSize}px
              </div>
            )}
          </div>
          
          {config.fontSize !== undefined && (
            <div className="space-y-2">
              <label className={`block text-xs font-medium ${ui.muted}`}>Font Size</label>
              <input
                aria-label="Font size slider"
                type="range"
                min={fontMin}
                max={fontMax}
                value={config.fontSize}
                onChange={(e) => handleConfigChange('fontSize', parseInt(e.target.value))}
                className={`w-full h-1.5 rounded-full appearance-none cursor-pointer accent-purple-500 ${isDarkMode ? 'bg-neutral-800' : 'bg-slate-200'}`}
              />
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label htmlFor={backgroundColorId} className={`block text-xs font-medium ${ui.muted}`}>Background</label>
              <div className={`flex items-center gap-2 border p-1.5 rounded-lg ${ui.border}`}>
                <input
                  id={backgroundColorId}
                  name="backgroundColor"
                  autoComplete="off"
                  aria-label="Background color"
                  type="color"
                  value={config.bgColor}
                  onChange={(e) => handleConfigChange('bgColor', e.target.value)}
                  className="w-6 h-6 rounded border-none cursor-pointer"
                />
                <span className={`text-[10px] font-mono ${ui.mutedStrong}`}>{config.bgColor}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label htmlFor={textColorId} className={`block text-xs font-medium ${ui.muted}`}>Text</label>
              <div className={`flex items-center gap-2 border p-1.5 rounded-lg ${ui.border}`}>
                <input
                  id={textColorId}
                  name="textColor"
                  autoComplete="off"
                  aria-label="Text color"
                  type="color"
                  value={config.textColor || '#000000'}
                  onChange={(e) => handleConfigChange('textColor', e.target.value)}
                  className="w-6 h-6 rounded border-none cursor-pointer"
                />
                <span className={`text-[10px] font-mono ${ui.mutedStrong}`}>{config.textColor}</span>
              </div>
            </div>
          </div>
        </section>

        <BrandLogoUploaderComponent onColorsExtracted={onLogoColorsExtracted} />

        {(activeWidgetId === 'clock' || config.lightMode || config.darkMode) && (
          <div className={`border rounded-xl p-4 space-y-4 ${ui.card}`}>
            <h4 className={`text-sm font-bold uppercase tracking-widest ${ui.muted}`}>Theme Modes</h4>
            <div className="grid grid-cols-2 gap-4">
              {/* Light Mode Column */}
              <div className="space-y-3">
                <div className={`text-[10px] font-bold uppercase tracking-wider border-b pb-1 mb-2 ${ui.border} ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Light Mode</div>
                {[
                  { id: lightTextColorId, label: 'Text', val: config.lightMode?.textColor, def: JAZER_BRAND.colors.graphite, key: 'textColor' },
                  { id: lightPanelColorId, label: 'Panel', val: config.lightMode?.panelColor, def: JAZER_BRAND.colors.stardustWhite, key: 'panelColor' },
                  { id: lightDigitColorId, label: 'Digit', val: config.lightMode?.digitColor, def: JAZER_BRAND.colors.nightBlack, key: 'digitColor' }
                ].map(item => (
                  <div key={item.id} className="space-y-1">
                    <label htmlFor={item.id} className={`block text-[10px] font-medium ${ui.muted}`}>{item.label}</label>
                    <div className={`flex items-center gap-2 border p-1 rounded ${ui.border}`}>
                      <input
                        id={item.id}
                        type="color"
                        value={item.val || item.def}
                        onChange={(e) => handleConfigChange('lightMode', { [item.key]: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border-none"
                      />
                      <span className={`text-[9px] font-mono truncate ${ui.muted}`}>{item.val || item.def}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dark Mode Column */}
              <div className="space-y-3">
                <div className={`text-[10px] font-bold uppercase tracking-wider border-b pb-1 mb-2 ${ui.border} ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Dark Mode</div>
                {[
                  { id: darkTextColorId, label: 'Text', val: config.darkMode?.textColor, def: JAZER_BRAND.colors.stardustWhite, key: 'textColor' },
                  { id: darkPanelColorId, label: 'Panel', val: config.darkMode?.panelColor, def: JAZER_BRAND.colors.graphite, key: 'panelColor' },
                  { id: darkDigitColorId, label: 'Digit', val: config.darkMode?.digitColor, def: JAZER_BRAND.colors.stardustWhite, key: 'digitColor' }
                ].map(item => (
                  <div key={item.id} className="space-y-1">
                    <label htmlFor={item.id} className={`block text-[10px] font-medium ${ui.muted}`}>{item.label}</label>
                    <div className={`flex items-center gap-2 border p-1 rounded ${ui.border}`}>
                      <input
                        id={item.id}
                        type="color"
                        value={item.val || item.def}
                        onChange={(e) => handleConfigChange('darkMode', { [item.key]: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border-none"
                      />
                      <span className={`text-[9px] font-mono truncate ${ui.muted}`}>{item.val || item.def}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
