import React from 'react';
import { Layout, Search, Star, X } from 'lucide-react';

export function BuilderSidebar({
  ui,
  isDarkMode,
  onBack,
  navFilters,
  navFilter,
  onNavFilterChange,
  filterIconMap,
  widgetSearch,
  onWidgetSearchChange,
  filteredWidgets,
  pinnedWidgetList,
  unpinnedWidgetList,
  showGroupedList,
  onSelectWidget,
  activeWidgetId,
  onTogglePinned,
  className = '',
  showClose = false,
  onClose
}) {
  const primaryFilters = ['all', 'pinned'];
  const categoryFilters = navFilters.filter((filter) => !primaryFilters.includes(filter));
  const renderWidgetRow = (widget) => {
    const isActive = activeWidgetId === widget.id;
    const isPinned = widget.isPinned;
    return (
      <div
        key={widget.id}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors group ${
          isActive
            ? (isDarkMode ? 'bg-purple-500/20 text-white' : 'bg-sky-50 text-sky-900')
            : (isDarkMode ? 'text-neutral-300 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50')
        }`}
      >
        <button
          type="button"
          onClick={() => onSelectWidget(widget.id)}
          className="flex-1 flex items-center gap-3 text-left"
          aria-current={isActive ? 'true' : undefined}
        >
          <div className={`transition-colors ${isActive ? 'text-purple-300' : 'text-current opacity-70'}`}>
            {React.cloneElement(widget.icon, { size: 16 })}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate">{widget.label}</div>
            <div className={`text-[10px] truncate ${ui.sidebarMuted}`}>{widget.category}</div>
          </div>
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onTogglePinned(widget.id);
          }}
          className={`p-1 rounded-full border transition-colors ${
            isPinned
              ? (isDarkMode ? 'border-yellow-400/50 text-yellow-300 bg-yellow-500/10' : 'border-amber-300 text-amber-700 bg-amber-50')
              : (isDarkMode ? 'border-white/10 text-neutral-400 hover:text-white hover:border-white/30' : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300')
          }`}
          aria-label={isPinned ? `Unpin ${widget.label}` : `Pin ${widget.label}`}
          aria-pressed={isPinned}
        >
          <Star className="w-3 h-3" />
        </button>
      </div>
    );
  };

  const renderWidgetList = (widgets) => (
    widgets.map(renderWidgetRow)
  );

  return (
    <aside className={`flex flex-col h-full min-h-0 border-r ${ui.sidebar} ${className}`}>
      <div className={`px-4 py-4 border-b flex items-center justify-between gap-3 ${ui.sidebarHeader}`}>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-3 focus-ring rounded-lg"
          aria-label="Back to home"
        >
          <img
            src={`${import.meta.env.BASE_URL}icon.svg`}
            alt="MetraNode"
            width={32}
            height={32}
            className="w-8 h-8 rounded-lg"
          />

        </button>
        {showClose && (
          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-lg border transition-colors ${ui.ghostButton}`}
            aria-label="Close widget library"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className={`px-4 py-4 space-y-4 border-b ${ui.sidebarHeader}`}>
        <div className="space-y-2">
          <label htmlFor="widget-search" className="sr-only">Search widgets</label>
          <div className="relative">
            <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${ui.sidebarMuted}`} />
            <input
              id="widget-search"
              name="widgetSearch"
              autoComplete="off"
              type="text"
              value={widgetSearch}
              onChange={(e) => onWidgetSearchChange(e.target.value)}
              placeholder="Search widgets…"
              aria-label="Search widgets"
              className={`w-full rounded-lg py-2 pl-8 pr-2 text-xs focus-ring transition-colors ${ui.input}`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className={`text-[10px] uppercase tracking-[0.3em] ${ui.sidebarMuted}`}>Filters</div>
          <div className="flex flex-wrap gap-2">
            {primaryFilters.map((filter) => {
              const isActive = navFilter === filter;
              const Icon = filterIconMap[filter] || Layout;
              const label = filter === 'all' ? 'All' : 'Pinned';
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => onNavFilterChange(filter)}
                  className={`text-[10px] px-2.5 py-1 rounded-full border flex items-center gap-1.5 transition-colors ${
                    isActive ? ui.chipActive : ui.chip
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              );
            })}
          </div>
          {categoryFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categoryFilters.map((filter) => {
                const isActive = navFilter === filter;
                const Icon = filterIconMap[filter] || Layout;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => onNavFilterChange(filter)}
                    className={`text-[10px] px-2.5 py-1 rounded-full border flex items-center gap-1.5 transition-colors ${
                      isActive ? ui.chipActive : ui.chip
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {filter}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 custom-scrollbar">
        {showGroupedList && pinnedWidgetList.length > 0 && (
          <div className="space-y-2">
            <div className={`text-[10px] uppercase tracking-[0.3em] ${ui.sidebarMuted}`}>Pinned</div>
            <div className="space-y-1">
              {renderWidgetList(pinnedWidgetList)}
            </div>
          </div>
        )}

        <div className="space-y-2">
          {showGroupedList && (
            <div className={`text-[10px] uppercase tracking-[0.3em] ${ui.sidebarMuted}`}>All Widgets</div>
          )}
          <div className="space-y-1">
            {renderWidgetList(showGroupedList ? unpinnedWidgetList : filteredWidgets)}
          </div>
        </div>

        {filteredWidgets.length === 0 && (
          <div className={`p-4 text-xs rounded-xl border ${ui.cardSoft}`}>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] mb-2">
              <Layout className="w-3 h-3" /> No matches
            </div>
            <p className={ui.muted}>Try a different keyword or filter.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
