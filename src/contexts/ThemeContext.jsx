// src/contexts/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { jazerNeonTheme } from '../theme/jazerNeonTheme'; // Import the default theme

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(jazerNeonTheme); // Default to JaZeR Neon
  const [isDark, setIsDark] = useState(false); // Initialize to false, update in useEffect
  const [activeBrandId, setActiveBrandId] = useState('jazer-neon'); // Track active brand kit

  // Listen for system dark mode changes
  useEffect(() => {
    // Ensure window is defined before accessing matchMedia
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(mediaQuery.matches);
      const handler = (e) => setIsDark(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  // Helper function to update both theme and brand ID
  const updateTheme = useCallback((newTheme, brandId = 'custom') => {
    setTheme(newTheme);
    setActiveBrandId(brandId);
  }, []);

  // Helper function to reset to JaZeR Neon theme
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
      activeBrandId,
      // Helper to check if using JaZeR Neon theme
      isJazerNeon: activeBrandId === 'jazer-neon',
    };
  }, [theme, isDark, activeBrandId]);

  const contextValue = useMemo(() => ({
    theme: activeTheme,
    setTheme: updateTheme,
    resetToJazerNeon,
    getColor,
    activeBrandId,
    // Expose jazerNeonTheme as the base theme
    baseTheme: jazerNeonTheme,
  }), [activeTheme, updateTheme, resetToJazerNeon, getColor, activeBrandId]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
