# Builder Command-Center Design (2026-02-06)

## Summary
Redesign the Builder tab into a command-center layout: left library rail, center preview canvas, right inspector with tabs (Configure, Brand, Flow). The goal is to keep the preview usable while making controls easier to scan, search, and jump between.

## Goals
- Provide a clear mental model: left = what, center = result, right = how.
- Reduce scroll fatigue with inspector tabs, search, and section mini-map chips.
- Keep preview space stable and usable across common viewport sizes.
- Improve accessibility (labels, tab semantics, focus, reduced motion).

## Non-goals
- Changing widget configuration schema.
- Reworking widget rendering logic.
- Adding new backend services or persistence beyond existing localStorage usage.

## Layout
- Left rail: widget library, search, filters, pinned list. Always visible on desktop.
- Center: preview canvas with a stable toolbar row (widget name, export, reset, device controls).
- Right inspector: tabs for Configure, Brand, Flow. Sticky header with search, section chips, and jump menu.

Responsive behavior:
- Desktop: three columns visible.
- Mobile/tablet: left rail becomes a drawer. Right inspector becomes a full-height overlay with tabs, toggled from the canvas toolbar.

## Components
- `BuilderShell.jsx`: owns layout and state orchestration (active widget, config, inspectorTab).
- `BuilderSidebar.jsx`: library search/filters, pinned widgets, widget selection.
- `BuilderInspector.jsx`: tablist + sticky header + tab content host.
- `InspectorConfigureTab.jsx`: config sections for the active widget.
- `InspectorBrandTab.jsx`: brand kit + surface controls.
- `InspectorFlowTab.jsx`: upgrades, guided toggles, jump actions.
- `PreviewCanvas.jsx`: wraps `ResizablePreviewPanel` and provides toolbar actions.

## State and Data Flow
- Centralized state in `BuilderShell`: `activeWidgetId`, `config`, `inspectorTab`, `widgetSearch`, `configSearch`, `pinnedWidgets`, `highlightedSection`.
- `sectionOutline` computed from widget definitions; shared across inspector tabs.
- `sectionRefs` used for jump-to-section and mini-map highlighting.
- `handleConfigChange` remains the single config update pathway.

## UX Details
- Inspector header includes: search input, section chips, and jump-to menu.
- Section chips highlight the current section and show counts.
- Brand and surface controls are fully moved out of Configure into Brand.
- Flow tab groups upgrade and guided controls; avoids mixing with standard config.

## Accessibility
- Icon-only buttons receive `aria-label` and `title`.
- Search inputs have `aria-label`, `name`, and explicit `autocomplete` values.
- Inspector tabs use `role="tablist"` and `role="tab"` with `aria-selected`.
- Provide strong focus rings and `motion-reduce` variants for animations.

## Error Handling
- If `ActiveWidget` is missing: render an empty state with a single action (Pick a widget).
- Guard section computations when `sections` or `fields` are missing.
- Maintain try/catch for localStorage; optionally surface non-blocking warnings if pins cannot persist.

## Testing and QA
- Add a small utility-level test for section filtering logic when search is applied.
- Manual QA:
  - switch widgets, ensure inspector tabs update.
  - search within configure and brand tabs (independent scopes).
  - jump to section and verify highlight.
  - pins persist after refresh.
  - mobile: drawer/overlay behavior and focus trapping.

## Rollout Plan
- Phase 1: extract components and wire the command-center layout with existing data.
- Phase 2: refine inspector tabs and move brand/surface controls into Brand tab.
- Phase 3: accessibility pass and polish (focus, motion, labels).
