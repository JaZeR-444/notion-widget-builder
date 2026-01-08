import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const UpgradeOrbRadial = ({
  title = 'Upgrades',
  items = [],
  radius = 120,
  maxItems = 8
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const visibleItems = useMemo(() => items.slice(0, clamp(maxItems, 1, 12)), [items, maxItems]);

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

  const getPositionStyle = (index) => {
    if (!open) {
      return {
        transform: 'translate(0px, 0px) scale(0.7)',
        opacity: 0,
        pointerEvents: 'none'
      };
    }

    const count = visibleItems.length;
    const startAngle = -90 - 80;
    const endAngle = -90 + 30;
    const angle = count <= 1
      ? -90
      : startAngle + (index * (endAngle - startAngle)) / (count - 1);
    const radians = (angle * Math.PI) / 180;
    const x = Math.cos(radians) * radius;
    const y = Math.sin(radians) * radius;

    return {
      transform: `translate(${x}px, ${y}px) scale(1)`,
      opacity: 1,
      pointerEvents: 'auto'
    };
  };

  return (
    <div ref={rootRef} className="absolute bottom-4 right-4 z-30">
      <div className="relative">
        <div
          className="absolute bottom-0 right-0 text-[10px] uppercase tracking-[0.3em] text-white/60"
          style={{ transform: open ? 'translate(-8px, -56px)' : 'translate(-8px, -44px)', transition: 'transform 160ms ease' }}
        >
          {open ? title : 'Upgrade'}
        </div>

        {visibleItems.map((item, index) => {
          const Icon = item.icon || Sparkles;
          const enabled = item.kind === 'toggle' ? Boolean(item.enabled) : false;
          const ring = enabled ? 'ring-2 ring-emerald-300/70' : 'ring-1 ring-white/10';
          const bg = enabled ? 'bg-emerald-500/20 border-emerald-300/40' : 'bg-white/10 border-white/15';

          return (
            <button
              key={item.id}
              type="button"
              title={item.description ? `${item.label} — ${item.description}` : item.label}
              onClick={() => {
                if (item.kind === 'toggle') {
                  item.onToggle?.(!item.enabled);
                  if (!item.keepOpen) setOpen(false);
                  return;
                }
                item.onSelect?.();
                setOpen(false);
              }}
              className={`absolute bottom-0 right-0 h-10 w-10 rounded-full border ${bg} ${ring} grid place-items-center text-white shadow-lg shadow-black/40 backdrop-blur-md transition`}
              style={{
                ...getPositionStyle(index),
                transitionProperty: 'transform, opacity, background-color, border-color',
                transitionDuration: '180ms',
                transitionTimingFunction: 'ease'
              }}
              aria-label={item.label}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setOpen(prev => !prev)}
          className="relative h-14 w-14 rounded-full border border-white/15 bg-gradient-to-br from-purple-500 via-fuchsia-500 to-cyan-400 shadow-xl shadow-purple-900/40 ring-1 ring-white/10 grid place-items-center text-white"
          aria-expanded={open}
          aria-label={open ? 'Close upgrades' : 'Open upgrades'}
        >
          <Sparkles className="h-5 w-5 drop-shadow" />
          {activeCount > 0 && (
            <span className="absolute -top-1 -left-1 min-w-6 h-6 px-1 rounded-full bg-black/60 border border-white/15 text-[10px] font-semibold grid place-items-center">
              {activeCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

