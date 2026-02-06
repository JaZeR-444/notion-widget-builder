import { normalizeBrandTheme } from './brandTheme';

export const escapeHTML = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>'"]/g,
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag]));
};

// Enhanced utility functions for config encoding and color conversion
export const encodeConfig = (obj) => {
  return btoa(encodeURIComponent(JSON.stringify(obj)));
};

export const decodeConfig = (str) => {
  try {
    return JSON.parse(decodeURIComponent(atob(str)));
  } catch {
    // Silently fail for invalid configs
    return null;
  }
};

export const loadStoredBrandTheme = () => {
  if (typeof window === 'undefined') return null;
  const savedTheme = window.localStorage.getItem('jazer_global_brand_theme');
  const isActive = window.localStorage.getItem('jazer_global_brand_active');
  if (savedTheme && isActive === 'true') {
    try {
      return normalizeBrandTheme(JSON.parse(savedTheme));
    } catch {
      return null;
    }
  }
  const extractedTheme = window.localStorage.getItem('jazer_brand_theme');
  if (extractedTheme) {
    try {
      return normalizeBrandTheme(JSON.parse(extractedTheme));
    } catch {
      return null;
    }
  }
  return null;
};

export const resolveThemeColors = (config, isDark) => {
  if (config.appearanceMode === 'none') return { bg: config.bgColor || 'transparent', text: config.textColor || '#000' };
  const bg = config.backgroundMode === 'transparent' ? 'transparent' : (isDark ? '#0B0E12' : config.bgColor || '#FFFFFF');
  const text = isDark ? (config.darkTextColor || '#FFFFFF') : (config.lightTextColor || '#37352F');
  return { bg, text };
};
