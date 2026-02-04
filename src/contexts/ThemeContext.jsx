// src/contexts/ThemeContext.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { jazerNeonTheme } from '../theme/jazerNeonTheme'; // Import the default theme
import { ThemeContext } from './ThemeContextStore';

const getPreferredDark = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const getStoredColorMode = () => {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = window.localStorage.getItem('jazer_color_mode');
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
    return 'system';
  } catch {
    return 'system';
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(jazerNeonTheme); // Default to Neon theme
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => getPreferredDark());
  const [colorMode, setColorMode] = useState(() => getStoredColorMode());
  const [activeBrandId, setActiveBrandId] = useState('jazer-neon'); // Track active brand kit

  // Listen for system dark mode changes
  useEffect(() => {
    // Ensure window is defined before accessing matchMedia
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e) => setSystemPrefersDark(e.matches);
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handler);
      } else {
        mediaQuery.addListener(handler);
      }
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handler);
        } else {
          mediaQuery.removeListener(handler);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('jazer_color_mode', colorMode);
    } catch {
      // ignore write errors
    }
  }, [colorMode]);

  const isDark = useMemo(() => {
    if (colorMode === 'system') return systemPrefersDark;
    return colorMode === 'dark';
  }, [colorMode, systemPrefersDark]);

  // Helper function to update both theme and brand ID
  const updateTheme = useCallback((newTheme, brandId = 'custom') => {
    setTheme(newTheme);
    setActiveBrandId(brandId);
  }, []);

  // Helper function to reset to Neon theme
  const resetToJazerNeon = useCallback(() => {
    setTheme(jazerNeonTheme);
    setActiveBrandId('jazer-neon');
  }, []);

  // Helper function to get a color with fallback
  const getColor = useCallback((colorKey, fallback = jazerNeonTheme.colors.stardustWhite) => {
    return theme?.colors?.[colorKey] || fallback;
  }, [theme]);

  const activeTheme = useMemo(() => {
    // Merge theme with runtime properties
    return {
      ...theme,
      isDark,
      colorMode,
      activeBrandId,
      // Helper to check if using Neon theme
      isJazerNeon: activeBrandId === 'jazer-neon',
    };
  }, [theme, isDark, colorMode, activeBrandId]);

  const toggleColorMode = useCallback(() => {
    setColorMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const contextValue = useMemo(() => ({
    theme: activeTheme,
    setTheme: updateTheme,
    resetToJazerNeon,
    getColor,
    activeBrandId,
    colorMode,
    setColorMode,
    toggleColorMode,
    // Expose jazerNeonTheme as the base theme
    baseTheme: jazerNeonTheme,
  }), [activeTheme, updateTheme, resetToJazerNeon, getColor, activeBrandId, colorMode, setColorMode, toggleColorMode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

