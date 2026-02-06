import React from 'react';
import { List as ListIcon, Search, Settings } from 'lucide-react';

export function InspectorConfigureTab({
  ui,
  isDarkMode,
  activeWidgetLabel,
  configSearch,
  onConfigSearchChange,
  highlightedSection,
  onSectionSelect,
  tabSections,
  showTabMenu,
  setShowTabMenu,
  tabMenuRef,
  configSectionNodes,
  hasMoreSections,
  infiniteScrollRef
}) {
  return (
    <div id="inspector-panel-configure" role="tabpanel" aria-label="Configure">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className={`text-[10px] uppercase tracking-[0.3em] ${ui.muted}`}>
              Configure
            </div>
            <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {activeWidgetLabel || 'Widget'} controls
            </div>
          </div>
          <div className="relative" ref={tabMenuRef}>
            <button
              type="button"
              onClick={() => setShowTabMenu((prev) => !prev)}
              className={`p-2 rounded-lg border transition-colors ${ui.ghostButton}`}
              aria-label="Jump to section"
            >
              <ListIcon className="w-4 h-4" />
            </button>
            {showTabMenu && (
              <div className={`absolute right-0 mt-2 w-52 border rounded-xl shadow-xl p-1 z-50 max-h-[50vh] overflow-y-auto ${
                isDarkMode ? 'bg-[#151921] border-white/10' : 'bg-white border-slate-200'
              }`}>
                {tabSections.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      onSectionSelect(tab.id);
                      setShowTabMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-[10px] font-medium transition-colors ${
                      highlightedSection === tab.id
                        ? (isDarkMode ? 'bg-purple-500/20 text-white' : 'bg-sky-50 text-sky-900')
                        : (isDarkMode ? 'text-neutral-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50')
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative group">
          <label htmlFor="config-search" className="sr-only">Search</label>
          <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${configSearch ? 'text-purple-400' : ui.sidebarMuted}`} />
          <input
            id="config-search"
            name="configSearch"
            autoComplete="off"
            type="text"
            value={configSearch}
            onChange={(e) => onConfigSearchChange(e.target.value)}
            placeholder="Quick find..."
            className={`w-full rounded-lg py-2 pl-9 pr-8 text-xs font-medium bg-transparent border transition-all ${
              isDarkMode 
                ? 'border-white/10 focus:bg-white/5 focus:border-purple-500/50 text-slate-200 placeholder:text-slate-600' 
                : 'border-slate-200 focus:bg-slate-50 focus:border-purple-300 text-slate-700 placeholder:text-slate-400'
            } focus:outline-none focus:ring-0`}
          />
          {configSearch && (
            <button
              type="button"
              onClick={() => onConfigSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-slate-500 hover:text-white transition-colors"
            >
              <span className="sr-only">Clear</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className={`flex items-center gap-2 text-xs font-bold uppercase ${ui.muted}`}>
            <Settings className="w-3 h-3" /> Configure Sections
          </div>
          {configSectionNodes}
          {hasMoreSections && (
            <div
              ref={infiniteScrollRef}
              className={`py-4 text-center text-[11px] ${ui.muted}`}
            >
              Keep scrolling to load more controls…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
