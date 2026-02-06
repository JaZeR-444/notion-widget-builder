# Brand Kit Palette Lab (2026-02-06)

## Summary
Redesign the Brand Theme Generator into a single-canvas “Palette Lab” with three collapsible blocks: Source, Palette, and Preview. The experience focuses on playful exploration while keeping apply/export actions clearly accessible.

## Goals
- Make palette exploration feel creative and fast.
- Reduce visual fragmentation by keeping everything inside one cohesive surface.
- Emphasize the sequence: source → remix → preview → apply.
- Maintain existing logic for palette extraction, preset generation, and theme application.

## Layout
- Single large Lab card with soft gradient background and subtle noise.
- Three collapsible blocks:
  - Source: logo upload, randomize, quick palette tags.
  - Palette: swatch grid + preset variations.
  - Preview: live theme sample + widget coverage grid.
- Sticky Apply bar pinned to the bottom of the Lab card when a theme exists.

## Visual Direction
- Playful Creative: bright accent gradients, capsule buttons, rounded shapes.
- Expressive typography with strong uppercase labels.
- High-contrast chips and swatches for visual scanning.

## Data Flow
- `brandTheme` persists to localStorage on upload or randomize.
- `generatedPresets` derived from `brandTheme`.
- `selectedPreset` drives preview and apply.
- `activePreviewTheme` merges selected preset with the base theme.

## Accessibility
- Collapsible headers use `aria-expanded` and `aria-controls`.
- Swatches are clickable buttons with titles for copy feedback.
- Icon-only buttons get `aria-label` where applicable.
- Focus states remain visible and consistent.

## QA Checklist
- Upload logo → palette + presets appear.
- Randomize palette generates presets + preview.
- Collapse/expand blocks without losing state.
- Apply preset updates global theme and shows confirmation state.
- Mobile layout remains readable, sticky action stays visible.
