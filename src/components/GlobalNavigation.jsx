import React, { useState, useEffect, useRef } from 'react';
import { Menu, Sparkles, HelpCircle, Sun, Moon } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { useTheme } from '../hooks/useTheme';

// Note: WIDGET_REGISTRY will be passed down as props or accessed through other means
// For now, we'll handle breadcrumbs without direct import to avoid circular dependency

/**
 * Global Navigation Component
 * Features:
 * - Horizontal tabs on desktop, dropdown on mobile
 * - Breadcrumb navigation
 * - Sticky header with backdrop blur
 * - Brand status badge
 */
export function GlobalNavigation({ 
  currentView, 
  onNavigateHome, 
  onNavigateBuilder, 
  onNavigateBrand,
  onOpenHelp,
  selectedWidgetId,
  selectedWidgetLabel, // Pass widget label from parent
  hasBrandTheme, 
  brandLabel 
}) {
  const { theme, toggleColorMode } = useTheme();
  const isDarkMode = Boolean(theme?.isDark);
  const navItems = [
    { id: 'landing', label: 'Widgets', action: onNavigateHome },
    { id: 'builder', label: 'Builder', action: onNavigateBuilder, disabled: !selectedWidgetId },
    { id: 'brand-generator', label: 'Brand Kit', action: onNavigateBrand }
  ];
  
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const navMenuRef = useRef(null);

  // Check if desktop (for responsive behavior)
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (!showNavMenu) return undefined;
    const handleClick = (event) => {
      if (!navMenuRef.current) return;
      if (!navMenuRef.current.contains(event.target)) {
        setShowNavMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showNavMenu]);

  // Build breadcrumbs based on current view
  // Structure: Home > Widget Name > Builder OR Home > Brand Generator
  const breadcrumbs = React.useMemo(() => {
    const items = [{ label: 'Home', onClick: onNavigateHome }];
    
    if (currentView === 'builder' && selectedWidgetId && selectedWidgetLabel) {
      // Builder view: show widget name and builder step
      items.push({ label: selectedWidgetLabel, onClick: null });
      items.push({ label: 'Builder', onClick: null });
    } else if (currentView === 'brand-generator') {
      // Brand generator view: show generator step
      items.push({ label: 'Brand Generator', onClick: null });
    }
    
    return items;
  }, [currentView, selectedWidgetId, selectedWidgetLabel, onNavigateHome]);

  return (
    <header className={`w-full border-b backdrop-blur-md sticky top-0 z-30 shadow-lg ${isDarkMode ? 'border-subtle bg-[#0B0E12]/90 text-white' : 'border-sky-100 bg-white/80 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Logo/Branding */}
          <div className="flex items-center justify-between">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-3 focus-ring rounded-lg group"
              aria-label="Go to home"
            >
              <img 
                src="Notion Widget Builder Logo (150 x 50 px).png" 
                alt="Notion Widget Builder" 
                className="h-10 w-auto max-w-[200px] group-hover:scale-105 transition-transform"
                onError={(e) => {
                  console.error('Logo failed to load');
                  e.target.style.display = 'none';
                }}
              />
            </button>

            {/* Mobile menu button */}
            {!isDesktop && (
              <button
                type="button"
                onClick={() => setShowNavMenu((prev) => !prev)}
                className={`md:hidden p-2 rounded-lg border transition focus-ring ${isDarkMode ? 'border-interactive text-neutral-200 hover:border-purple-300 hover:text-white' : 'border-sky-200 text-slate-600 hover:border-sky-400 hover:text-sky-900'}`}
                aria-label="Toggle navigation menu"
                aria-expanded={showNavMenu}
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
            {/* Desktop: Horizontal tabs */}
            {isDesktop ? (
              <div className="flex items-center gap-2">
                {navItems.map(item => {
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={item.action}
                      disabled={item.disabled}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-semibold transition-all focus-ring
                        ${isActive
                          ? (isDarkMode ? 'bg-purple-500/20 text-white border-2 border-purple-400 shadow-lg' : 'bg-sky-100 text-sky-900 border-2 border-sky-300 shadow-sm')
                          : (isDarkMode ? 'text-neutral-300 hover:text-white hover:bg-white/5 border-2 border-transparent' : 'text-slate-500 hover:text-sky-900 hover:bg-sky-50 border-2 border-transparent')
                        }
                        ${item.disabled ? 'opacity-40 cursor-not-allowed' : ''}
                      `}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Mobile: Dropdown menu */
              <div className="relative" ref={navMenuRef}>
                {showNavMenu && (
                  <div className={`absolute left-0 top-0 min-w-[200px] border rounded-xl shadow-2xl p-2 space-y-1 animate-fadeIn ${isDarkMode ? 'bg-[#0C0F16] border-interactive' : 'bg-white border-sky-200'}`}>
                    {navItems.map(item => {
                      const isActive = currentView === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            item.action();
                            setShowNavMenu(false);
                          }}
                          disabled={item.disabled}
                          className={`
                            w-full px-4 py-2.5 rounded-lg text-left text-sm font-medium transition
                            ${isActive
                              ? (isDarkMode ? 'bg-purple-500/20 border border-purple-400 text-white' : 'bg-sky-100 border border-sky-300 text-sky-900')
                              : (isDarkMode ? 'bg-white/5 border border-subtle text-neutral-200 hover:border-purple-300 hover:text-white' : 'bg-white border border-sky-200 text-slate-600 hover:border-sky-400 hover:text-sky-900')
                            }
                            ${item.disabled ? 'opacity-40 cursor-not-allowed' : ''}
                          `}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Breadcrumbs - Desktop only */}
            {isDesktop && breadcrumbs.length > 1 && (
              <div className="hidden lg:block">
                <Breadcrumbs items={breadcrumbs} />
              </div>
            )}

            {/* Secondary actions */}
            <div className="ml-auto flex items-center gap-3">
              {/* Brand status badge */}
              <div className="flex items-center gap-2 text-xs">
                <span className={`hidden sm:inline uppercase tracking-widest ${isDarkMode ? 'text-neutral-500' : 'text-slate-400'}`}>Brand</span>
                <span className={`
                  px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5
                  ${hasBrandTheme 
                    ? (isDarkMode ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-200' : 'border-emerald-300 bg-emerald-50 text-emerald-700') 
                    : (isDarkMode ? 'border-interactive bg-white/5 text-neutral-300' : 'border-sky-200 bg-sky-50 text-slate-600')
                  }
                `}>
                  {hasBrandTheme && <Sparkles className="w-3 h-3" />}
                  <span className="hidden sm:inline">{hasBrandTheme ? brandLabel : 'Neon'}</span>
                  <span className="sm:hidden">{hasBrandTheme ? '✓' : '–'}</span>
                </span>
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleColorMode}
                role="switch"
                aria-checked={isDarkMode}
                aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                className={`w-11 h-11 rounded-lg border transition focus-ring flex items-center justify-center cursor-pointer ${isDarkMode ? 'border-interactive text-neutral-300 hover:border-white/40 hover:text-white' : 'border-sky-200 text-slate-600 hover:border-sky-400 hover:text-sky-900'}`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Help button */}
              {onOpenHelp && (
                <button
                  onClick={onOpenHelp}
                  className={`p-2 rounded-lg border transition focus-ring ${isDarkMode ? 'border-interactive text-neutral-300 hover:border-purple-300 hover:text-white' : 'border-sky-200 text-slate-600 hover:border-sky-400 hover:text-sky-900'}`}
                  aria-label="Open help and shortcuts"
                  title="Keyboard shortcuts"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </nav>
        </div>

        {/* Mobile breadcrumbs - shown below main nav */}
        {!isDesktop && breadcrumbs.length > 1 && (
          <div className={`mt-3 pt-3 border-t ${isDarkMode ? 'border-subtle' : 'border-sky-100'}`}>
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
      </div>
    </header>
  );
}

export default GlobalNavigation;
