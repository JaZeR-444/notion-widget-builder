/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // JaZeR Brand Spacing Tokens
      spacing: {
        'xs': '0.25rem',   // 4px
        'sm': '0.5rem',    // 8px  
        'md': '1rem',      // 16px
        'lg': '1.5rem',    // 24px
        'xl': '2rem',      // 32px
        '2xl': '3rem',     // 48px
      },
      // MetraNode Brand Color Palette (Purple, Pink, Blue theme)
      colors: {
        metranode: {
          // Primary purple-pink-blue gradient colors
          'vivid-purple': '#A855F7',      // Vibrant purple (primary)
          'deep-purple': '#7C3AED',       // Deep purple (accent)
          'electric-pink': '#EC4899',     // Electric pink (highlight)
          'hot-pink': '#F472B6',          // Hot pink (secondary)
          'sky-blue': '#3B82F6',          // Sky blue (accent)
          'cyan-blue': '#06B6D4',         // Cyan blue (utility)
          
          // Neutral palette
          'night-black': '#0A0A0F',       // Deep black background
          'dark-slate': '#1E1E2E',        // Dark slate
          'slate-gray': '#2D2D3D',        // Slate gray
          'soft-gray': '#9CA3AF',         // Soft gray text
          'light-white': '#F9FAFB',       // Light white
          
          // Legacy jazer colors (for backward compatibility)
          'electric-purple': '#8B5CF6',
          'cosmic-blue': '#3B82F6',
          'neon-pink': '#EC4899',
          'sunburst-gold': '#F59E0B',
          'aether-teal': '#06B6D4',
          'ultraviolet': '#A78BFA',
          'stardust-white': '#F8F9FF',
          'graphite': '#1F2937',
          'soft-slate': '#94A3B8',
        }
      },
      // JaZeR Brand Typography
      fontFamily: {
        'heading': ['"Orbitron"', 'system-ui', 'sans-serif'],
        'body': ['"Montserrat"', 'system-ui', 'sans-serif'],
      },
      // JaZeR Brand Effects
      boxShadow: {
        'neon-purple': '0 0 4px rgba(139, 92, 246, 0.6)',
        'neon-blue': '0 0 4px rgba(59, 130, 246, 0.6)',
        'neon-pink': '0 0 4px rgba(236, 72, 153, 0.6)',
        'neon-gold': '0 0 4px rgba(245, 158, 11, 0.6)',
        'neon-strong': '0 0 8px rgba(139, 92, 246, 0.6)',
      },
      backgroundImage: {
        // MetraNode brand gradients (purple-pink-blue theme)
        'metranode-gradient': 'linear-gradient(135deg, #A855F7 0%, #EC4899 50%, #3B82F6 100%)',
        'metranode-gradient-horizontal': 'linear-gradient(90deg, #A855F7 0%, #EC4899 50%, #3B82F6 100%)',
        'metranode-purple-pink': 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
        'metranode-pink-blue': 'linear-gradient(135deg, #EC4899 0%, #3B82F6 100%)',
        
        // Legacy gradients
        'jazer-gradient': 'linear-gradient(90deg, #EC4899 0%, #F59E0B 28%, #06B6D4 50%, #3B82F6 74%, #8B5CF6 100%)',
        'jazer-gradient-purple-blue': 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
      },
      letterSpacing: {
        'brand': '0.03em',
        'brand-large': '0.04em',
      }
    },
  },
  plugins: [],
}