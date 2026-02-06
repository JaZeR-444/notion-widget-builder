# MetraNode Brand Guide

## 🎨 Brand Identity

**MetraNode** is a professional widget builder for Notion, featuring a vibrant purple-pink-blue color scheme that evokes creativity, innovation, and modern design.

## Color Palette

### Primary Colors (Purple-Pink-Blue Theme)

```css
--vivid-purple: #A855F7     /* Primary brand color */
--deep-purple: #7C3AED      /* Deep purple accent */
--electric-pink: #EC4899    /* Electric pink highlight */
--hot-pink: #F472B6         /* Hot pink secondary */
--sky-blue: #3B82F6         /* Sky blue accent */
--cyan-blue: #06B6D4        /* Cyan blue utility */
```

### Neutral Colors

```css
--night-black: #0A0A0F      /* Deep black background */
--dark-slate: #1E1E2E       /* Dark slate */
--slate-gray: #2D2D3D       /* Slate gray */
--soft-gray: #9CA3AF        /* Soft gray text */
--light-white: #F9FAFB      /* Light white */
```

## Gradients

### Main Brand Gradient
```css
background: linear-gradient(135deg, #A855F7 0%, #EC4899 50%, #3B82F6 100%);
```

### Horizontal Gradient
```css
background: linear-gradient(90deg, #A855F7 0%, #EC4899 50%, #3B82F6 100%);
```

### Purple-Pink Gradient
```css
background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%);
```

### Pink-Blue Gradient
```css
background: linear-gradient(135deg, #EC4899 0%, #3B82F6 100%);
```

## Typography

### Font Families
- **Headings**: Orbitron (futuristic, geometric, tech-forward)
- **Body Text**: Montserrat (clean, professional, highly legible)

### Font Weights
- Light: 300
- Regular: 400
- Medium: 500
- Semi-bold: 600
- Bold: 700

### Letter Spacing
- Brand Standard: `0.03em` (3%)
- Large Headlines: `0.04em` (4%)

## Logo Usage

### Primary Logo
- **File**: `public/logo.svg`
- **Min Width**: 160px (digital), 30mm (print)
- **Clear Space**: 1em around all sides

### Icon/Favicon
- **File**: `public/icon.svg`
- **Sizes**: 100x100px minimum
- **Usage**: App icons, favicons, social media

## Visual Effects

### Glow Effects
```css
/* Purple glow */
box-shadow: 0 0 4px rgba(168, 85, 247, 0.6);

/* Pink glow */
box-shadow: 0 0 4px rgba(236, 72, 153, 0.6);

/* Blue glow */
box-shadow: 0 0 4px rgba(59, 130, 246, 0.6);

/* Strong glow */
box-shadow: 0 0 8px rgba(168, 85, 247, 0.8);
```

## Tailwind CSS Classes

### Using MetraNode Colors
```jsx
// Backgrounds
className="bg-metranode-vivid-purple"
className="bg-metranode-electric-pink"
className="bg-metranode-sky-blue"

// Text
className="text-metranode-vivid-purple"
className="text-metranode-hot-pink"

// Borders
className="border-metranode-deep-purple"

// Gradients
className="bg-metranode-gradient"
className="bg-metranode-purple-pink"
```

## Design Principles

1. **Bold & Vibrant**: Embrace the purple-pink-blue gradient for key brand moments
2. **Professional**: Maintain clean layouts and readable typography
3. **Modern**: Use contemporary design patterns and smooth animations
4. **Accessible**: Ensure WCAG AA compliance with proper contrast ratios
5. **Consistent**: Apply the brand system uniformly across all widgets

## When to Use Each Color

- **Vivid Purple (#A855F7)**: Primary CTAs, main navigation, key brand moments
- **Electric Pink (#EC4899)**: Highlights, active states, important notifications
- **Sky Blue (#3B82F6)**: Links, secondary actions, informational elements
- **Night Black (#0A0A0F)**: Dark mode backgrounds, text on light backgrounds
- **Soft Gray (#9CA3AF)**: Secondary text, disabled states, subtle UI elements

## Migration Notes

The brand has evolved from the original "JaZeR" neon theme to **MetraNode**. All new components should use the `metranode-*` color classes. Legacy `jazer-*` classes are maintained for backward compatibility but should be migrated when possible.

---

**Last Updated**: February 2026  
**Version**: 1.0  
**Maintained by**: MetraNode Team

