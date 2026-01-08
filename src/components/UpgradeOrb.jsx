import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles, X } from 'lucide-react';

export const UpgradeOrb = ({ label = 'Upgrade', title = 'Upgrade your widget', items = [] }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const activeCount = useMemo(
    () => items.filter(item => item.kind === 'toggle' && item.enabled).length,
    [items]
  );

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    const handlePointerDown = (event) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target)) setOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:border-purple-300 hover:bg-white/10 transition"
        aria-expanded={open}
      >
        <span
          className="relative grid place-items-center h-7 w-7 rounded-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-cyan-400 shadow-lg shadow-purple-900/40 ring-1 ring-white/10"
          aria-hidden="true"
        >
          <Sparkles className="h-3.5 w-3.5 text-white drop-shadow" />
          <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition bg-white/10" />
        </span>
        <span className="hidden sm:inline tracking-wide">{label}</span>
        {activeCount > 0 && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-100">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[min(520px,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#0C0F16] shadow-xl shadow-black/50 overflow-hidden z-50">
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">Upgrades</div>
              <div className="text-sm font-semibold text-white truncate">{title}</div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 rounded-full border border-white/10 text-neutral-300 hover:border-purple-300 hover:text-white transition"
              aria-label="Close upgrades"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-3 grid gap-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {items.length === 0 ? (
              <div className="text-xs text-neutral-400 italic px-2 py-4">
                No upgrades available for this widget yet.
              </div>
            ) : (
              items.map((item) => {
                const Icon = item.icon || null;
                const rightLabel = item.kind === 'toggle'
                  ? (item.enabled ? 'Enabled' : 'Enable')
                  : (item.cta || 'Open');

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.kind === 'toggle') {
                        item.onToggle?.(!item.enabled);
                      } else {
                        item.onSelect?.();
                      }
                      if (!item.keepOpen) setOpen(false);
                    }}
                    className="w-full text-left rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.07] hover:border-purple-300/60 transition px-3 py-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 grid place-items-center text-purple-200 flex-shrink-0">
                        {Icon ? <Icon className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold text-white truncate">{item.label}</div>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border ${
                              item.kind === 'toggle' && item.enabled
                                ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-100'
                                : 'border-white/10 bg-white/5 text-neutral-300'
                            }`}
                          >
                            {rightLabel}
                          </span>
                        </div>
                        {item.description && (
                          <div className="text-[11px] text-neutral-400 leading-snug mt-1">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

