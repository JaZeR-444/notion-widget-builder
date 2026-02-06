import React from 'react';
import { Download, Layout, PanelRightOpen, Sun, Moon } from 'lucide-react';

export function PreviewCanvas({
  ui,
  isDarkMode,
  activeWidgetLabel,
  onOpenLibrary,
  onOpenInspector,
  onExport,
  onToggleTheme,
  isDesktop,
  children
}) {
  return (
    <section className={`flex-1 flex flex-col min-h-0 relative z-0 overflow-hidden ${isDarkMode ? 'bg-[#050505]' : 'bg-slate-100'}`}>
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: isDarkMode
            ? 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)'
            : 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className={`flex items-center justify-between px-4 py-3 border-b relative z-10 ${ui.panelHeader}`}>
        <div className="flex items-center gap-3">
          {!isDesktop && (
            <button
              type="button"
              onClick={onOpenLibrary}
              className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider border px-3 py-1.5 rounded-full transition-colors ${ui.ghostButton}`}
              aria-label="Open widget library"
            >
              <Layout className="w-3.5 h-3.5" /> Widgets
            </button>
          )}
          <div>
            <div className={`text-[10px] uppercase tracking-[0.3em] ${ui.muted}`}>Live Preview</div>
            <div className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {activeWidgetLabel || 'Widget'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isDesktop && (
            <button
              type="button"
              onClick={onOpenInspector}
              className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider border px-3 py-1.5 rounded-full transition-colors ${ui.ghostButton}`}
              aria-label="Open inspector"
            >
              <PanelRightOpen className="w-3.5 h-3.5" /> Inspector
            </button>
          )}
          <button
            type="button"
            onClick={onToggleTheme}
            className={`w-9 h-9 rounded-lg border transition-colors flex items-center justify-center ${ui.ghostButton}`}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onExport}
            className={`flex items-center gap-2 text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider border transition-colors ${
              isDarkMode ? 'border-pink-500/50 text-pink-300 bg-pink-500/10' : 'border-pink-200 text-pink-600 bg-pink-50'
            }`}
            aria-label="Export widget"
          >
            <Download className="w-3.5 h-3.5" />
            {isDesktop ? 'Export' : null}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden z-10">
        {children}
      </div>
    </section>
  );
}
