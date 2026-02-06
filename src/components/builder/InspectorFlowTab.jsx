import React from 'react';
import { Activity, CornerDownRight, Sparkles } from 'lucide-react';

export function InspectorFlowTab({
  ui,
  isDarkMode,
  upgradeItems,
  isButtonGenerator,
  showAllButtonGeneratorSections,
  onToggleGuidedSections
}) {
  return (
    <div id="inspector-panel-flow" role="tabpanel" aria-label="Flow">
      <div className="space-y-6">
        <div>
          <div className={`text-[10px] uppercase tracking-[0.3em] ${ui.muted}`}>Flow</div>
          <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Guided upgrades</h3>
          <p className={`text-xs mt-1 ${ui.muted}`}>Toggle advanced behaviors and jump to configuration sections.</p>
        </div>

        {isButtonGenerator && (
          <section className={`border rounded-2xl p-4 ${ui.card}`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Section depth</div>
                <div className={`text-[11px] ${ui.muted}`}>Switch between guided and full section lists.</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleGuidedSections(false)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.3em] border transition-colors ${
                    !showAllButtonGeneratorSections
                      ? (isDarkMode ? 'border-emerald-400/60 text-emerald-100 bg-emerald-500/10' : 'border-emerald-300 text-emerald-700 bg-emerald-50')
                      : (isDarkMode ? 'border-white/10 text-neutral-400 hover:text-white hover:border-white/30' : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300')
                  }`}
                >
                  Guided
                </button>
                <button
                  type="button"
                  onClick={() => onToggleGuidedSections(true)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.3em] border transition-colors ${
                    showAllButtonGeneratorSections
                      ? (isDarkMode ? 'border-emerald-400/60 text-emerald-100 bg-emerald-500/10' : 'border-emerald-300 text-emerald-700 bg-emerald-50')
                      : (isDarkMode ? 'border-white/10 text-neutral-400 hover:text-white hover:border-white/30' : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300')
                  }`}
                >
                  All
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="space-y-3">
          {upgradeItems.map((item) => {
            const Icon = item.icon || Sparkles;
            const isToggle = item.kind === 'toggle';
            return (
              <div
                key={item.id}
                className={`border rounded-2xl p-4 flex items-start gap-3 ${ui.card}`}
              >
                <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.label}</div>
                  <div className={`text-[11px] ${ui.muted}`}>{item.description}</div>
                  {item.kind === 'navigate' && (
                    <button
                      type="button"
                      onClick={item.onSelect}
                      className={`mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.3em] border transition-colors ${
                        isDarkMode ? 'border-purple-300/60 text-purple-100 hover:border-purple-200' : 'border-sky-300 text-sky-800 hover:border-sky-400'
                      }`}
                    >
                      <CornerDownRight className="w-3 h-3" />
                      {item.cta || 'Open'}
                    </button>
                  )}
                </div>
                {isToggle && (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={item.enabled}
                    aria-label={`Toggle ${item.label}`}
                    onClick={() => item.onToggle(!item.enabled)}
                    className={`relative w-11 h-6 rounded-full border transition-colors ${
                      item.enabled
                        ? (isDarkMode ? 'bg-emerald-500/30 border-emerald-300/60' : 'bg-emerald-100 border-emerald-300')
                        : (isDarkMode ? 'bg-white/5 border-white/15' : 'bg-slate-100 border-slate-200')
                    }`}
                  >
                    <span
                      className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-transform ${
                        item.enabled
                          ? 'translate-x-6 bg-emerald-300'
                          : 'translate-x-1 bg-slate-300'
                      }`}
                    />
                  </button>
                )}
              </div>
            );
          })}
          {upgradeItems.length === 0 && (
            <div className={`border rounded-2xl p-4 text-xs ${ui.card}`}>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] mb-2">
                <Activity className="w-3 h-3" /> No flow upgrades
              </div>
              <p className={ui.muted}>This widget does not have advanced flows yet.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
