import React from 'react';
import { X } from 'lucide-react';

export function BuilderInspector({
  ui,
  isDarkMode,
  inspectorTab,
  onTabChange,
  contentRef,
  children,
  className = '',
  showClose = false,
  onClose
}) {
  const tabs = [
    { id: 'configure', label: 'Configure' },
    { id: 'brand', label: 'Brand' },
    { id: 'flow', label: 'Flow' }
  ];

  return (
    <aside className={`flex flex-col h-full min-h-0 border-l ${ui.panel} ${className}`}>
      <div className={`px-4 py-3 border-b backdrop-blur-md ${ui.panelTop}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2" role="tablist" aria-label="Inspector tabs">
            {tabs.map((tab) => {
              const isActive = inspectorTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`inspector-panel-${tab.id}`}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.3em] border transition-colors ${
                    isActive
                      ? (isDarkMode ? 'border-purple-300 text-white bg-purple-500/20' : 'border-sky-300 text-sky-900 bg-sky-100')
                      : (isDarkMode ? 'border-white/10 text-neutral-400 hover:text-white hover:border-white/30' : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300')
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          {showClose && (
            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-lg border transition-colors ${ui.ghostButton}`}
              aria-label="Close inspector"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-6 custom-scrollbar"
      >
        {children}
      </div>
    </aside>
  );
}
