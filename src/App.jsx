import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Clock, Quote, Timer, Palette,
  Download, Copy, Layout, Code, Image as ImageIcon,
  BarChart3, MousePointerClick, Hash, Hourglass,
  List as ListIcon, Settings, ExternalLink, Briefcase,
  AlertTriangle, Sparkles, Check, X, ArrowLeft, CloudSun,
  ChevronUp, ChevronDown, Plus, Minus, Instagram, RefreshCcw,
  ChevronLeft, ChevronRight, Search, HelpCircle, Link as LinkIcon,
  Trash2, Copy as CopyIcon, CornerDownRight, ArrowUp, ArrowDown,
  Eye, EyeOff, MoreHorizontal, CloudRain, Sun, Moon, Wind,
  Droplets, Thermometer, MapPin, Lock, Calendar, Activity,
  MousePointer, Zap, Type, Rocket, Upload, Star, ArrowRight
} from 'lucide-react';
import ColorThief from 'colorthief';


// New components for modernization
import { GlobalNavigation } from './components/GlobalNavigation';
import { KeyboardShortcutsHelp } from './components/KeyboardShortcutsHelp';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ToastProvider } from './components/Toast';
import { BuilderSidebar } from './components/builder/BuilderSidebar';
import { BuilderInspector } from './components/builder/BuilderInspector';
import { InspectorConfigureTab } from './components/builder/InspectorConfigureTab';
import { InspectorBrandTab } from './components/builder/InspectorBrandTab';
import { InspectorFlowTab } from './components/builder/InspectorFlowTab';
import { PreviewCanvas } from './components/builder/PreviewCanvas';

import {
  FONT_SIZES, EXPORT_ANIMATION_DURATION, DEBOUNCE_DELAY, MIN_FONT_SIZE, MAX_FONT_SIZE,
  BUTTON_PRESETS, COMMON_EMOJIS, BUTTON_ARCHETYPES, JAZER_BRAND, BRAND_KITS, CONFIG_SECTION_BATCH
} from './constants';
import {
  encodeConfig, decodeConfig, loadStoredBrandTheme, resolveThemeColors
} from './utils/helpers';
import { useDebounce } from './hooks/useDebounce';
import { WIDGET_REGISTRY, WIDGET_CATEGORIES } from './widgetRegistry';


import { BrandLogoUploader } from './components/BrandLogoUploader';
import BrandThemeGenerator from './components/BrandThemeGenerator';
import { UpgradeOrbRadial } from './components/UpgradeOrbRadial';
import { normalizeBrandTheme } from './utils/brandTheme';
import { useRecentWidgets, formatRelativeTime } from './hooks/useRecentWidgets';
import { useTheme } from './hooks/useTheme';

class WidgetErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Widget Error Boundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 m-4">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Widget Component Error
          </h3>
          <p className="text-xs font-mono mb-4">{this.state.error?.message || 'Unknown error'}</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const BrandColorPalette = () => (
  <div className="p-4 bg-gray-900 rounded-lg mb-4">
    <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-3">Brand Colors</h4>
    <div className="grid grid-cols-5 gap-2">
      {Object.entries(JAZER_BRAND.colors).map(([name, color]) => (
        <div key={name} className="text-center">
          <div
            className="w-full h-10 rounded mb-1 border border-white/10"
            style={{ backgroundColor: color }}
            title={name}
          />
          <div className="text-[8px] text-white/50 truncate">{name}</div>
        </div>
      ))}
    </div>
  </div>
);


// Emoji Picker Component with Search
const EmojiPicker = ({ onSelect, onClose }) => {
  const [search, setSearch] = useState("");
  const filtered = COMMON_EMOJIS.filter(e => e.includes(search));

  return (
    <div className="absolute z-50 bg-[#1A1D29] border border-gray-700 rounded-lg shadow-xl w-64 max-h-60 flex flex-col top-full left-0 mt-1">
      <div className="p-2 border-b border-gray-700">
        <div className="relative">
          <Search size={12} className="absolute left-2 top-2 text-gray-500" />
          <input
            autoFocus
            className="w-full bg-[#0B0E12] pl-7 pr-2 py-1 text-xs text-white rounded border border-gray-700 outline-none focus:border-purple-500"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 p-2 overflow-y-auto">
        {filtered.map((emoji, i) => (
          <button
            key={i}
            className="text-lg hover:bg-gray-700 rounded p-1"
            onClick={() => { onSelect(emoji); onClose(); }}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

// Enhanced Button Manager Component
const ButtonManager = ({ value, onChange }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const pickerRef = useRef(null);
  const idCounterRef = useRef(0);
  const behaviorOptions = useMemo(() => [
    { value: 'custom', label: 'Custom' },
    ...BUTTON_ARCHETYPES.map(template => ({
      value: template.config.behaviorType || template.id,
      label: template.label
    }))
  ], []);
  const variantOptions = [
    { value: 'solid', label: 'Solid' },
    { value: 'text', label: 'Text Only' },
    { value: 'icon', label: 'Icon Only' },
    { value: 'iconText', label: 'Icon + Text' },
    { value: 'capsule', label: 'Capsule' },
    { value: 'circular', label: 'Circular' },
    { value: 'orb', label: 'Floating Orb' },
    { value: 'outline', label: 'Outline' },
    { value: 'ghost', label: 'Ghost' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateButton = (idx, updates) => {
    const newButtons = [...value];
    newButtons[idx] = { ...newButtons[idx], ...updates };
    onChange(newButtons);
  };

  const baseButtonProps = {
    label: 'New Button',
    url: '',
    icon: '✨',
    hideIcon: false,
    colorPreset: 'grey',
    backgroundColor: '#9B9A97',
    backgroundOpacity: 100,
    outlineColor: '#9B9A97',
    textColor: '#FFFFFF',
    hoverBackgroundColor: '#FFFFFF',
    hoverTextColor: '#9B9A97',
    enableHoverHighlight: true,
    tooltip: '',
    behaviorType: 'custom',
    variant: 'solid',
    playlistText: ''
  };

  const makeButtonId = () => {
    idCounterRef.current += 1;
    return `btn-${idCounterRef.current}`;
  };

  const addButton = () => {
    const newBtn = {
      id: makeButtonId(),
      ...baseButtonProps
    };
    onChange([...value, newBtn]);
    setActiveIndex(value.length);
  };

  const addButtonFromTemplate = (template) => {
    const newBtn = {
      id: makeButtonId(),
      ...baseButtonProps,
      ...template.config
    };
    onChange([...value, newBtn]);
    setActiveIndex(value.length);
  };

  const duplicateButton = (idx, e) => {
    e.stopPropagation();
    const newButtons = [...value];
    const clone = { ...value[idx], id: makeButtonId() };
    newButtons.splice(idx + 1, 0, clone);
    onChange(newButtons);
  };

  const deleteButton = (idx, e) => {
    e.stopPropagation();
    const newButtons = value.filter((_, i) => i !== idx);
    onChange(newButtons);
    if (activeIndex === idx) setActiveIndex(null);
  };

  const copyStyle = (idx, e) => {
    e.stopPropagation();
    const source = value[idx];
    const newButtons = value.map(b => ({
      ...b,
      colorPreset: source.colorPreset,
      backgroundColor: source.backgroundColor,
      backgroundOpacity: source.backgroundOpacity,
      outlineColor: source.outlineColor,
      textColor: source.textColor,
      hoverBackgroundColor: source.hoverBackgroundColor,
      hoverTextColor: source.hoverTextColor,
      enableHoverHighlight: source.enableHoverHighlight
    }));
    onChange(newButtons);
  };

  const applyPreset = (idx, presetName) => {
    const p = BUTTON_PRESETS[presetName];
    updateButton(idx, {
      colorPreset: presetName,
      backgroundColor: p.bg,
      outlineColor: p.outline,
      textColor: p.text,
      hoverBackgroundColor: '#FFFFFF',
      hoverTextColor: p.bg
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {value.map((btn, idx) => {
          return (
            <div key={btn.id} className="bg-[#1A1D29] border border-gray-700 rounded-lg overflow-hidden transition-all hover:border-gray-600">
            <div
              className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-gray-800 transition-colors"
              onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center text-xs border border-white/10"
                  style={{ backgroundColor: btn.backgroundColor, color: btn.textColor }}
                >
                  {btn.icon || ''}
                </div>
                <span className="text-xs font-medium text-gray-200 truncate max-w-[100px]">{btn.label}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="p-1 text-gray-500 hover:text-white hover:bg-gray-700 rounded"
                  onClick={(e) => copyStyle(idx, e)}
                  title="Copy style to all"
                >
                  <CornerDownRight size={12} />
                </button>
                <button
                  className="p-1 text-gray-500 hover:text-white hover:bg-gray-700 rounded"
                  onClick={(e) => duplicateButton(idx, e)}
                  title="Duplicate"
                >
                  <CopyIcon size={12} />
                </button>
                <button
                  className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-900/30 rounded"
                  onClick={(e) => deleteButton(idx, e)}
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
                <ChevronRight
                  size={12}
                  style={{
                    transform: activeIndex === idx ? 'rotate(90deg)' : 'none',
                    transition: '0.2s',
                    color: '#718096'
                  }}
                />
              </div>
            </div>

            {activeIndex === idx && (
              <div className="p-3 bg-[#111318] border-t border-gray-800 flex flex-col gap-3 animate-in slide-in-from-top-2">
                <div className="flex gap-2">
                  <div style={{ width: '50px', position: 'relative' }} ref={pickerRef}>
                    <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block">Icon</label>
                    <button
                      className="w-full bg-[#0f1115] border border-gray-700 text-gray-200 p-1.5 rounded text-xs text-center hover:border-purple-500 transition-colors"
                      onClick={() => setShowEmojiPicker(showEmojiPicker === idx ? null : idx)}
                    >
                      {btn.icon || '+'}
                    </button>
                    {showEmojiPicker === idx && <EmojiPicker onSelect={(emoji) => updateButton(idx, { icon: emoji })} onClose={() => setShowEmojiPicker(null)} />}
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block">Label</label>
                    <input
                      className="w-full bg-[#0f1115] border border-gray-700 text-gray-200 p-1.5 rounded text-xs outline-none focus:border-purple-500 transition-colors"
                      value={btn.label}
                      onChange={(e) => updateButton(idx, { label: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 flex justify-between">URL <HelpCircle size={10} className="opacity-50" /></label>
                  <div className="relative">
                    <input
                      className="w-full bg-[#0f1115] border border-gray-700 text-blue-400 p-1.5 pl-6 rounded text-xs outline-none focus:border-purple-500"
                      placeholder="https://..."
                      value={btn.url}
                      onChange={(e) => updateButton(idx, { url: e.target.value })}
                    />
                    <LinkIcon size={10} className="absolute left-2 top-2 text-gray-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block">Button Type</label>
                    <select
                      className="w-full bg-[#0f1115] border border-gray-700 text-gray-200 p-1.5 rounded text-xs outline-none focus:border-purple-500"
                      value={btn.behaviorType || 'custom'}
                      onChange={(e) => updateButton(idx, { behaviorType: e.target.value })}
                    >
                      {behaviorOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block">Variant</label>
                    <select
                      className="w-full bg-[#0f1115] border border-gray-700 text-gray-200 p-1.5 rounded text-xs outline-none focus:border-purple-500"
                      value={btn.variant || 'solid'}
                      onChange={(e) => updateButton(idx, { variant: e.target.value })}
                    >
                      {variantOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block">Tooltip</label>
                  <input
                    className="w-full bg-[#0f1115] border border-gray-700 text-gray-200 p-1.5 rounded text-xs outline-none focus:border-purple-500"
                    value={btn.tooltip || ''}
                    onChange={(e) => updateButton(idx, { tooltip: e.target.value })}
                    placeholder="Describe the action..."
                  />
                </div>

                {btn.behaviorType === 'playlist' && (
                  <div>
                    <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 block">Playlist Items (one per line)</label>
                    <textarea
                      className="w-full bg-[#0f1115] border border-gray-700 text-gray-200 p-1.5 rounded text-xs outline-none focus:border-purple-500"
                      rows={3}
                      value={btn.playlistText || ''}
                      onChange={(e) => updateButton(idx, { playlistText: e.target.value })}
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-purple-500"
                    checked={btn.hideIcon}
                    onChange={(e) => updateButton(idx, { hideIcon: e.target.checked })}
                  />
                  <span className="text-xs text-gray-400">Hide Icon</span>
                </div>

                <div className="border-t border-gray-800 pt-2">
                  <label className="text-[9px] uppercase font-bold text-gray-500 mb-2 block">Quick Colors</label>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.keys(BUTTON_PRESETS).map(p => (
                      <div
                        key={p}
                        className={`w-4 h-4 rounded-full cursor-pointer border border-white/10 transition-transform hover:scale-110 ${btn.colorPreset === p ? 'ring-1 ring-white' : ''}`}
                        style={{ backgroundColor: BUTTON_PRESETS[p].bg }}
                        onClick={() => applyPreset(idx, p)}
                        title={p}
                      />
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-2 space-y-2">
                  <label className="text-[9px] uppercase font-bold text-purple-400 flex items-center gap-1">
                    <Palette size={10} /> Custom Styles
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-gray-500 block mb-1">Bg Color</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="color"
                          value={btn.backgroundColor}
                          onChange={e => updateButton(idx, { backgroundColor: e.target.value, colorPreset: null })}
                          className="w-5 h-5 rounded cursor-pointer bg-transparent p-0 border-none"
                        />
                        <span className="text-[9px] font-mono text-gray-400">{btn.backgroundColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-500 block mb-1">Opacity {btn.backgroundOpacity}%</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={btn.backgroundOpacity}
                        onChange={e => updateButton(idx, { backgroundOpacity: Number(e.target.value) })}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-gray-500 block mb-1">Text Color</label>
                      <input
                        type="color"
                        value={btn.textColor}
                        onChange={e => updateButton(idx, { textColor: e.target.value, colorPreset: null })}
                        className="w-full h-5 rounded cursor-pointer bg-transparent p-0 border border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-500 block mb-1">Outline</label>
                      <input
                        type="color"
                        value={btn.outlineColor}
                        onChange={e => updateButton(idx, { outlineColor: e.target.value, colorPreset: null })}
                        className="w-full h-5 rounded cursor-pointer bg-transparent p-0 border border-gray-700"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      className="accent-purple-500"
                      checked={btn.enableHoverHighlight}
                      onChange={e => updateButton(idx, { enableHoverHighlight: e.target.checked })}
                    />
                    <span className="text-xs text-gray-400">Enable Hover Highlight</span>
                  </div>

                  {btn.enableHoverHighlight && (
                    <div className="grid grid-cols-2 gap-2 pl-2 border-l border-purple-500/20">
                      <div>
                        <label className="text-[9px] text-gray-500 mb-1 block">Hover Bg</label>
                        <input
                          type="color"
                          value={btn.hoverBackgroundColor}
                          onChange={e => updateButton(idx, { hoverBackgroundColor: e.target.value })}
                          className="w-full h-5 rounded cursor-pointer bg-transparent p-0 border border-gray-700"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-500 mb-1 block">Hover Text</label>
                        <input
                          type="color"
                          value={btn.hoverTextColor}
                          onChange={e => updateButton(idx, { hoverTextColor: e.target.value })}
                          className="w-full h-5 rounded cursor-pointer bg-transparent p-0 border border-gray-700"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          );
        })}
      </div>
      <div className="p-3 bg-[#0F1115] border border-gray-800 rounded-lg space-y-2">
        <div className="text-[10px] uppercase text-gray-400 font-bold tracking-wide">Quick Templates</div>
        <div className="grid grid-cols-2 gap-2">
          {BUTTON_ARCHETYPES.map(template => (
            <button
              key={template.id}
              className="p-2 rounded-lg border border-white/10 bg-white/5 hover:border-purple-400 hover:bg-purple-500/10 transition flex items-center gap-2 text-left"
              onClick={() => addButtonFromTemplate(template)}
            >
              <span className="text-lg">{template.icon}</span>
              <div>
                <div className="text-xs font-semibold text-white">{template.label}</div>
                <div className="text-[10px] text-gray-400">{template.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={addButton}
        className="w-full py-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-xs font-bold text-purple-300 flex items-center justify-center gap-2 transition-all"
      >
        <Plus size={14} /> Add Button
      </button>
    </div>
  );
};

// Enhanced WidgetField Component - Supports all field types
const WidgetField = React.memo(({ field, value, onChange }) => {
  if (field.locked) {
    return (
      <div className="flex justify-between items-center py-1 opacity-50">
        <span className="text-sm text-gray-300">{field.label}</span>
        <span className="text-xs text-gray-500">🔒 Premium</span>
      </div>
    );
  }

  if (field.type === 'boolean') {
    return (
      <div className="flex justify-between items-center py-1">
        <span className="text-sm text-gray-300">{field.label}</span>
        <button
          onClick={() => onChange(!value)}
          className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ${value ? 'bg-purple-600' : 'bg-gray-700'}`}
        >
          <div className={`w-3 h-3 rounded-full bg-white shadow-md transform transition-transform duration-300 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div className="space-y-1">
        <label className="text-xs text-gray-400 font-bold">{field.label}</label>
        <select
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-gray-800 text-white text-sm p-2 rounded border border-gray-700 outline-none focus:border-purple-500"
          style={{ pointerEvents: 'auto' }}
        >
          {field.options.map(o => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === 'color') {
    return (
      <div className="space-y-1">
        <label className="text-xs text-gray-400 font-bold">{field.label}</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value || '#000000'}
            onChange={e => onChange(e.target.value)}
            className="w-8 h-8 rounded bg-transparent border-none cursor-pointer"
          />
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="flex-1 bg-gray-800 text-white text-xs p-2 rounded border border-gray-700"
          />
        </div>
      </div>
    );
  }

  if (field.type === 'text' || field.type === 'number' || field.type === 'date' || field.type === 'datetime-local') {
    return (
      <div className="space-y-1">
        <label className="text-xs text-gray-400 font-bold">{field.label}</label>
        <input
          type={field.type}
          value={value}
          onChange={e => onChange(field.type === 'number' ? Number(e.target.value) : e.target.value)}
          min={field.min}
          max={field.max}
          className="w-full bg-gray-800 text-white text-sm p-2 rounded border border-gray-700 outline-none focus:border-purple-500 transition-colors"
        />
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div className="space-y-1">
        <label className="text-xs text-gray-400 font-bold">{field.label}</label>
        <textarea
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          rows={field.rows || 4}
          className="w-full bg-gray-800 text-white text-sm p-2 rounded border border-gray-700 outline-none focus:border-purple-500"
        />
      </div>
    );
  }

  // NEW: checkbox-list field type
  if (field.type === 'checkbox-list') {
    const toggle = (optionValue) => {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter(v => v !== optionValue));
      } else {
        onChange([...currentValues, optionValue]);
      }
    };

    return (
      <div className="space-y-2">
        <label className="text-xs text-gray-400 font-bold">{field.label}</label>
        <div className="bg-gray-900 rounded border border-gray-700 p-2 space-y-1">
          {field.options.map(opt => {
            const isChecked = (value || []).includes(opt.value);
            return (
              <div
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded"
                onClick={() => toggle(opt.value)}
              >
                <div className={`w-4 h-4 border rounded flex items-center justify-center ${isChecked ? 'bg-purple-600 border-purple-600' : 'border-gray-500'}`}>
                  {isChecked && <Check size={10} className="text-white" />}
                </div>
                <span className="text-xs text-gray-300">{opt.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // NEW: bar-list field type (for Life Progress)
  if (field.type === 'bar-list') {
    const move = (idx, dir) => {
      const newItems = [...value];
      if (dir === -1 && idx > 0) {
        [newItems[idx], newItems[idx - 1]] = [newItems[idx - 1], newItems[idx]];
      } else if (dir === 1 && idx < newItems.length - 1) {
        [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
      }
      onChange(newItems);
    };

    const toggle = (idx) => {
      const n = [...value];
      n[idx].enabled = !n[idx].enabled;
      onChange(n);
    };

    return (
      <div className="space-y-2">
        <label className="text-xs text-gray-400 font-bold">{field.label}</label>
        <div className="bg-gray-900 rounded border border-gray-700 overflow-hidden">
          {value.map((item, i) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 border-b border-gray-800 last:border-0 hover:bg-white/5"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggle(i)}
                  className={`w-4 h-4 flex items-center justify-center rounded border ${item.enabled ? 'bg-purple-600 border-purple-600' : 'border-gray-500'}`}
                >
                  {item.enabled && <Check size={12} className="text-white" />}
                </button>
                <span className={`text-xs ${item.enabled ? 'text-white' : 'text-gray-500'}`}>{item.label}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => move(i, -1)}
                  className="p-1 hover:text-white text-gray-500 disabled:opacity-20"
                  disabled={i === 0}
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  className="p-1 hover:text-white text-gray-500 disabled:opacity-20"
                  disabled={i === value.length - 1}
                >
                  <ArrowDown size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // NEW: button-manager field type
  if (field.type === 'button-manager') {
    return <ButtonManager value={value || []} onChange={onChange} />;
  }

  // NEW: multiselect field type
  if (field.type === 'multiselect') {
    const toggle = (optionValue) => {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter(v => v !== optionValue));
      } else {
        // Check maxItems limit
        if (field.maxItems && currentValues.length >= field.maxItems) {
          return; // Don't add more items if max reached
        }
        onChange([...currentValues, optionValue]);
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-gray-400 font-bold">{field.label}</label>
          {field.maxItems && (
            <span className="text-xs text-gray-500">
              {(value || []).length}/{field.maxItems} selected
            </span>
          )}
        </div>
        {field.helpText && (
          <p className="text-xs text-gray-500">{field.helpText}</p>
        )}
        <div className="bg-gray-900 rounded border border-gray-700 p-2 space-y-1 max-h-64 overflow-y-auto">
          {field.options.map(opt => {
            const isChecked = (value || []).includes(opt.value);
            const isDisabled = field.maxItems && !isChecked && (value || []).length >= field.maxItems;
            return (
              <div
                key={opt.value}
                className={`flex items-center gap-2 p-1 rounded ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-white/5'}`}
                onClick={() => !isDisabled && toggle(opt.value)}
              >
                <div className={`w-4 h-4 border rounded flex items-center justify-center ${isChecked ? 'bg-purple-600 border-purple-600' : 'border-gray-500'}`}>
                  {isChecked && <Check size={10} className="text-white" />}
                </div>
                <span className="text-xs text-gray-300">{opt.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
});

const FlipCard = ({ value, label, colors, size }) => (
  <div className="inline-flex flex-col items-center mx-1">
    <div style={{
      width: `${size * 0.7}px`,
      height: `${size}px`,
      background: colors.clockColor || '#333',
      borderRadius: '8px',
      color: colors.digitColor || '#fff',
      fontSize: `${size * 0.65}px`,
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(0,0,0,0.3)' }}></div>
      {String(value).padStart(2, '0')}
    </div>
    {label && <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.7, textTransform: 'uppercase' }}>{label}</div>}
  </div>
);

const AnalogClock = ({ time, size, type, colors, config }) => {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  const center = size / 2;
  const clockRadius = size * 0.45;

  // Generate hour markers based on type
  const renderMarkers = () => {
    const markers = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30) * (Math.PI / 180);
      const x = center + Math.sin(angle) * clockRadius * 0.85;
      const y = center - Math.cos(angle) * clockRadius * 0.85;

      if (type === 'dots') {
        markers.push(
          <circle key={i} cx={x} cy={y} r={size * 0.015} fill={colors.clockColor} opacity="0.5" />
        );
      } else if (type === 'numbers') {
        markers.push(
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            fontSize={size * 0.08} fill={colors.clockColor} fontWeight="bold">
            {i === 0 ? 12 : i}
          </text>
        );
      } else if (type === 'planets') {
        const planetSizes = [8, 6, 7, 5, 9, 6, 8, 5, 6, 7, 5, 6];
        markers.push(
          <circle key={i} cx={x} cy={y} r={size * 0.01 * planetSizes[i] / 5}
            fill={colors.clockColor} opacity="0.6" />
        );
      }
    }
    return markers;
  };

  // Hand styles based on type
  const getHandProps = (handType) => {
    if (type === 'trail') {
      return { strokeLinecap: 'round', strokeWidth: handType === 'second' ? size * 0.01 : size * 0.02, opacity: 0.7 };
    }
    return { strokeLinecap: 'round', strokeWidth: handType === 'hour' ? size * 0.04 : handType === 'minute' ? size * 0.03 : size * 0.01 };
  };

  return (
    <svg width={size} height={size} style={{ filter: config.glowEffect ? `drop-shadow(0 0 ${JAZER_BRAND.glowBlur} ${colors.clockColor})` : 'none' }}>
      {/* Clock face */}
      <circle cx={center} cy={center} r={clockRadius}
        fill="none" stroke={colors.clockColor}
        strokeWidth={size * 0.01} opacity="0.2" />

      {/* Markers */}
      {renderMarkers()}

      {/* Hour hand */}
      <line
        x1={center} y1={center}
        x2={center + Math.sin(hourAngle * Math.PI / 180) * clockRadius * 0.5}
        y2={center - Math.cos(hourAngle * Math.PI / 180) * clockRadius * 0.5}
        stroke={colors.clockColor}
        {...getHandProps('hour')}
      />

      {/* Minute hand */}
      <line
        x1={center} y1={center}
        x2={center + Math.sin(minuteAngle * Math.PI / 180) * clockRadius * 0.75}
        y2={center - Math.cos(minuteAngle * Math.PI / 180) * clockRadius * 0.75}
        stroke={colors.clockColor}
        {...getHandProps('minute')}
      />

      {/* Second hand */}
      {config.showSeconds && (
        <line
          x1={center} y1={center}
          x2={center + Math.sin(secondAngle * Math.PI / 180) * clockRadius * 0.85}
          y2={center - Math.cos(secondAngle * Math.PI / 180) * clockRadius * 0.85}
          stroke={type === 'trail' ? colors.textColor : colors.clockColor}
          {...getHandProps('second')}
          style={type === 'tick' ? { transition: 'all 0.05s ease' } : {}}
        />
      )}

      {/* Center dot */}
      <circle cx={center} cy={center} r={size * 0.02} fill={colors.clockColor} />
    </svg>
  );
};



// --- EXPORT MODAL COMPONENT ---

const ExportModal = ({ isOpen, onClose, widgetDef, config }) => {
  const linkUrl = useMemo(() => {
    if (!isOpen) return '';
    const encoded = encodeConfig(config);
    return `${window.location.origin}${window.location.pathname}?embed=1&widget=${widgetDef.id}&config=${encoded}`;
  }, [isOpen, config, widgetDef]);

  if (!isOpen) return null;

  const copyLink = () => {
    navigator.clipboard.writeText(linkUrl);
    alert("Link copied! Paste into Notion using /embed");
  };

  const copyCode = () => {
    const html = widgetDef.generateHTML ? widgetDef.generateHTML(config) : `<!-- ${widgetDef.label} Widget -->`;
    const script = widgetDef.generateScript ? widgetDef.generateScript(config) : '';
    const fullCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${widgetDef.label} Widget</title>
    <style>
      body { margin: 0; padding: 0; width: 100vw; height: 100vh; overflow: hidden; }
    </style>
</head>
<body>
    ${html}
    <script>${script}</script>
</body>
</html>`;
    navigator.clipboard.writeText(fullCode);
    alert("HTML Code copied!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-[#1A1D29] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0B0E12]">
          <h3 className="text-white font-bold text-xl font-mono flex items-center gap-2">
            <Rocket className="text-purple-500" /> GET WIDGET
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X />
          </button>
        </div>
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">Embed Link (Recommended)</h4>
            <div className="bg-[#0B0E12] p-4 rounded-xl border border-gray-800 flex gap-2 items-center">
              <input
                readOnly
                value={linkUrl}
                className="bg-transparent w-full text-sm text-purple-300 outline-none font-mono truncate"
              />
              <button
                onClick={copyLink}
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors"
              >
                Copy Link
              </button>
            </div>
            <p className="text-xs text-gray-500">
              In Notion, type <code className="bg-gray-800 px-1 rounded">/embed</code> and paste this URL.
              Requires this app to be hosted publicly.
            </p>
          </div>
          <div className="border-t border-white/5 pt-6 space-y-4">
            <h4 className="text-lg font-bold text-white">Standalone Code</h4>
            <button
              onClick={copyCode}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Code size={16} /> Copy HTML Code
            </button>
            <p className="text-xs text-gray-500">
              Copy the full HTML code and save it as a .html file. Host it on GitHub Pages, Netlify, or Vercel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- FILE: WidgetLandingPage.jsx ---

// Resizable Preview Panel Component
const ResizablePreviewPanel = ({ 
  activeBrandId,
  config,
  activeWidgetId,
  debouncedConfig,
  handleConfigChange, 
  brandTheme, 
  ActiveWidget,
  showExport,
  setShowExport,
  onCustomizeRequest,
  upgradeItems
}) => {
  const { theme } = useTheme();
  const isDarkMode = Boolean(theme?.isDark);
  const [previewWidth, setPreviewWidth] = useState(800);
  const [previewHeight, setPreviewHeight] = useState(450);
  const [isResizing, setIsResizing] = useState(false);
  const previewContainerRef = useRef(null);
  const previewBrandTheme = brandTheme || debouncedConfig?.brandThemeSnapshot || config.brandThemeSnapshot;
  const presetSizes = useMemo(() => ([
    { id: 'phone', label: 'Phone', width: 360, height: 640 },
    { id: 'tablet', label: 'Tablet', width: 820, height: 640 },
    { id: 'desktop', label: 'Desktop', width: 1100, height: 640 }
  ]), []);

  const startResize = (direction, e) => {
    e.preventDefault();
    setIsResizing(direction);
  };

  const applyPresetSize = (preset) => {
    setPreviewWidth(preset.width);
    setPreviewHeight(preset.height);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !previewContainerRef.current) return;
      
      const container = previewContainerRef.current.getBoundingClientRect();
      
      if (isResizing === 'horizontal' || isResizing === 'both') {
        const newWidth = Math.max(300, Math.min(1600, e.clientX - container.left - 40));
        setPreviewWidth(newWidth);
      }
      
      if (isResizing === 'vertical' || isResizing === 'both') {
        const newHeight = Math.max(200, Math.min(1000, e.clientY - container.top - 40));
        setPreviewHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div 
      ref={previewContainerRef}
      className="flex-1 flex flex-col relative h-full bg-transparent"
    >
      <div className="flex-1 flex items-center justify-center p-8" style={{
        background: activeBrandId === 'jazer'
          ? `radial-gradient(circle at 50% 10%, ${JAZER_BRAND.ui.nebulaPurple} 0%, ${JAZER_BRAND.colors.nightBlack} 100%)`
          : 'transparent',
        boxShadow: activeBrandId === 'jazer' ? JAZER_BRAND.glow : 'none'
      }}>
        <div
          className="shadow-2xl rounded-xl overflow-hidden relative group"
          style={{
            width: `${previewWidth}px`,
            height: `${previewHeight}px`,
            maxWidth: '100%',
            maxHeight: 'min(80vh, 720px)',
            backgroundColor: config.bgColor,
            border: '2px solid var(--jazer-cosmic-blue)',
            boxShadow: 'var(--jazer-glow-blue), 0 20px 40px rgba(0,0,0,0.4)',
            transition: isResizing ? 'none' : 'all 0.2s ease'
          }}
        >
          <div className="absolute top-3 left-3 z-20 flex gap-2">
            {presetSizes.map((preset) => {
              const isActive = Math.round(previewWidth) === preset.width && Math.round(previewHeight) === preset.height;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPresetSize(preset)}
                  className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.3em] border transition ${
                    isActive
                      ? (isDarkMode ? 'border-white text-white bg-white/20' : 'border-slate-300 text-slate-900 bg-white')
                      : (isDarkMode ? 'border-white/20 text-white/70 bg-black/30 hover:border-white/40 hover:text-white' : 'border-slate-200 text-slate-600 bg-white/70 hover:border-slate-300 hover:text-slate-900')
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
          <WidgetErrorBoundary key={activeWidgetId}>
            <ActiveWidget.Component
              config={debouncedConfig}
              onConfigChange={handleConfigChange}
              brand={JAZER_BRAND}
              brandTheme={previewBrandTheme}
              onCustomizeRequest={onCustomizeRequest}
            />
          </WidgetErrorBoundary>

          {Array.isArray(upgradeItems) && upgradeItems.length > 0 && (
            <UpgradeOrbRadial
              title={activeWidgetId === 'newButtonGenerator' ? 'Button Upgrades' : 'Widget Upgrades'}
              items={upgradeItems}
            />
          )}
          
          {/* Resize Handles */}
          {/* Right handle */}
          <div
            onMouseDown={(e) => startResize('horizontal', e)}
            className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--jazer-electric-purple))',
            }}
          >
            <div 
              className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-l"
              style={{ backgroundColor: 'var(--jazer-electric-purple)', boxShadow: 'var(--jazer-glow-purple)' }}
            />
          </div>
          
          {/* Bottom handle */}
          <div
            onMouseDown={(e) => startResize('vertical', e)}
            className="absolute left-0 right-0 bottom-0 h-2 cursor-ns-resize opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: 'linear-gradient(180deg, transparent, var(--jazer-electric-purple))',
            }}
          >
            <div 
              className="absolute left-1/2 -translate-x-1/2 bottom-0 h-1 w-12 rounded-t"
              style={{ backgroundColor: 'var(--jazer-electric-purple)', boxShadow: 'var(--jazer-glow-purple)' }}
            />
          </div>
          
          {/* Corner handle */}
          <div
            onMouseDown={(e) => startResize('both', e)}
            className="absolute right-0 bottom-0 w-6 h-6 cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: 'var(--jazer-electric-purple)',
              clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
              boxShadow: 'var(--jazer-glow-purple)'
            }}
          />
          
          {/* Size indicator */}
          <div 
            className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              backgroundColor: 'rgba(139, 92, 246, 0.9)',
              color: 'var(--jazer-stardust-white)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {previewWidth} × {previewHeight}
          </div>
        </div>
      </div>

      {/* EXPORT MODAL */}
      <ExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        widgetDef={ActiveWidget}
        config={config}
      />
    </div>
  );
};

// Export WIDGET_REGISTRY for use in GlobalNavigation


function WidgetLandingPage({ onSelect, onBrandGenerator, setSearchInputRef }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

  const { theme } = useTheme();
  const isDarkMode = Boolean(theme?.isDark);
  const searchInputLocalRef = useRef(null);

  // Set search input ref for parent keyboard shortcuts
  useEffect(() => {
    if (setSearchInputRef && searchInputLocalRef.current) {
      setSearchInputRef(searchInputLocalRef.current);
    }
  }, [setSearchInputRef]);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const linkId = 'plus-jakarta-sans-font';
    const existing = document.getElementById(linkId);
    if (existing) return undefined;
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(link);
    return () => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, []);



  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleScroll = () => {
      const doc = document.documentElement;
      const height = doc.scrollHeight - window.innerHeight;
      const progress = height > 0 ? Math.min(window.scrollY / height, 1) : 0;
      setScrollProgress(progress);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const widgetList = useMemo(() => (
    Object.values(WIDGET_REGISTRY).map(widget => ({
      ...widget,
      category: WIDGET_CATEGORIES[widget.id] || 'Other'
    }))
  ), []);

  const categories = useMemo(() => (
    ['all', ...Array.from(new Set(widgetList.map(widget => widget.category)))]
  ), [widgetList]);


  /* featuredWidgets removed */
  
  const filteredWidgets = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return widgetList.filter(widget => {
      const matchesCategory = selectedCategory === 'all' || widget.category === selectedCategory;
      const matchesQuery = !normalizedQuery ||
        [widget.label, widget.description]
          .filter(Boolean)
          .some(text => text.toLowerCase().includes(normalizedQuery));
      return matchesCategory && matchesQuery;
    });
  }, [widgetList, selectedCategory, searchQuery]);



  const heroStats = [
    { label: 'Widgets', value: '9', subLabel: 'Final list' },
    { label: 'Categories', value: '4', subLabel: 'Time, Data, Media, Interactive' },
    { label: 'API Integrations', value: '2', subLabel: 'Weather + Quotes' },
    { label: 'Brand Kits', value: '∞', subLabel: 'Generator-powered' }
  ];





  const ui = useMemo(() => ({
    page: isDarkMode
      ? 'bg-[#050505] text-slate-200'
      : 'bg-slate-50 text-slate-800',
    track: isDarkMode ? 'bg-white/5' : 'bg-slate-200',
    trackFill: 'bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600',
    card: isDarkMode
      ? 'bg-[#0A0A0A]/80 backdrop-blur-xl border-white/5 shadow-2xl shadow-black/50'
      : 'bg-white/80 backdrop-blur-xl border-slate-200 shadow-xl shadow-slate-200/50',
    cardGlass: isDarkMode
      ? 'bg-white/[0.03] border-white/[0.08] backdrop-blur-sm'
      : 'bg-white/60 border-slate-200/60 backdrop-blur-sm',
    kicker: isDarkMode ? 'text-indigo-400' : 'text-indigo-600',
    textPrimary: isDarkMode ? 'text-white' : 'text-slate-900',
    textSecondary: isDarkMode ? 'text-slate-400' : 'text-slate-500',
    border: isDarkMode ? 'border-white/10' : 'border-slate-200',
    glossyOverlay: 'absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-inherit',
    input: isDarkMode ? 'bg-white/5 border-white/10 text-slate-200 focus:bg-white/10' : 'bg-white border-slate-200 text-slate-700 focus:bg-white',
  }), [isDarkMode]);

  return (
    <div
      className={`min-h-[calc(100vh-4rem)] flex flex-col relative overflow-hidden ${ui.page}`}
      style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}
    >
      {/* Scroll Progress (Top) */}
      <div aria-hidden="true" className={`fixed top-0 left-0 right-0 z-50 h-[1px] ${ui.track}`}>
        <div
          className={`h-full ${ui.trackFill}`}
          style={{
            width: `${Math.round(scrollProgress * 100)}%`,
            transition: 'width 200ms ease-out'
          }}
        />
      </div>



      {/* MAIN CONTENT: Single Column */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-4 pb-12 space-y-16">
         
         {/* HERO SECTION */}
         <section className="relative pt-0 pb-12 lg:pb-16 text-center space-y-8">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="relative z-10 space-y-4 max-w-3xl mx-auto flex flex-col items-center">
                  <img
                    src={`${import.meta.env.BASE_URL}logo.svg`}
                    alt="MetraNode Logo"
                    className="w-56 h-56 lg:w-72 lg:h-72 object-contain drop-shadow-2xl"
                  />
               
               <h2 className={`text-xl lg:text-2xl font-bold font-['Orbitron'] leading-tight ${ui.textPrimary}`}>
                  Professional Notion Widgets.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500">Synced to Your Brand.</span>
               </h2>
               <p className={`text-lg leading-relaxed ${ui.textSecondary} max-w-2xl mx-auto`}>
                  Stop fighting with custom CSS. Design premium Clock, Weather, and Button widgets that inherit your brand identity automatically.
               </p>
               
                <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
                   <button
                     onClick={() => onSelect('clock')}
                     className="group relative px-8 py-4 bg-white text-black hover:bg-slate-50 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_-5px_rgba(255,255,255,0.5)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.7)] hover:-translate-y-0.5 transition-all text-center flex items-center gap-3 overflow-hidden"
                   >
                     <span className="relative z-10">Open Builder</span>
                     <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                   </button>
                   <button 
                     onClick={onBrandGenerator}
                     className={`group px-8 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] border transition-all hover:bg-white/5 flex items-center gap-3 ${ui.border} ${ui.textPrimary}`}
                   >
                     <Palette className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                     <span>Brand Kit</span>
                   </button>
                </div>
            </div>

            {/* HERO STATS */}
            {/* HERO STATS - Floating HUD */}
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-px max-w-4xl mx-auto rounded-2xl overflow-hidden border ${isDarkMode ? 'bg-white/5 border-white/10 shadow-2xl shadow-black/50' : 'bg-slate-200 border-slate-200 shadow-xl'}`}>
               {heroStats.map((stat) => (
                 <div key={stat.label} className={`p-6 text-center backdrop-blur-md relative group ${isDarkMode ? 'bg-[#0B0E12]/80 hover:bg-white/5' : 'bg-white/60 hover:bg-white/80'} transition-colors`}>
                   <div className={`text-3xl font-bold font-['Orbitron'] mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</div>
                   <div className={`text-[9px] uppercase tracking-[0.2em] font-medium opacity-60 ${ui.textSecondary}`}>{stat.label}</div>
                   {/* Prismatic bottom line on hover */}
                   <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                 </div>
               ))}
            </div>
         </section>

         {/* PIPELINE / ARCHITECTURE */}
         <section className="space-y-8">
             <div className="text-center space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-500">Pipeline</p>
                <h3 className={`text-2xl font-bold font-['Orbitron'] ${ui.textPrimary}`}>From Idea to Embed</h3>
             </div>

             <div className="relative grid md:grid-cols-3 gap-8 pt-8">
                 {/* Connecting Line (Desktop) */}
                 <div className={`hidden md:block absolute top-[68px] left-[16%] right-[16%] h-[2px] border-t-2 border-dashed ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`} aria-hidden="true"></div>

                 {/* Phase 1 */}
                 <div className={`relative p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${isDarkMode ? 'bg-[#0F1115] border-white/5 shadow-black/40' : 'bg-white border-slate-100 shadow-slate-200/50'}`}>
                    <div className="absolute top-6 right-6 text-[40px] font-bold opacity-5 font-['Orbitron'] select-none">01</div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 relative z-10 transition-transform group-hover:scale-110 ${isDarkMode ? 'bg-[#151921] shadow-inner border border-white/5' : 'bg-slate-50 border border-slate-100'}`}>
                       <Layout className="w-5 h-5 text-indigo-500" />
                    </div>
                    <h4 className={`text-sm font-bold uppercase tracking-widest mb-3 ${ui.textPrimary}`}>Select Widget</h4>
                    <p className={`text-xs leading-relaxed opacity-70 ${ui.textSecondary}`}>
                       Choose from our library of pro-grade components. Clock, Weather, Buttons, and more.
                    </p>
                 </div>

                 {/* Phase 2 */}
                 <div className={`relative p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${isDarkMode ? 'bg-[#0F1115] border-white/5 shadow-black/40' : 'bg-white border-slate-100 shadow-slate-200/50'}`}>
                    <div className="absolute top-6 right-6 text-[40px] font-bold opacity-5 font-['Orbitron'] select-none">02</div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 relative z-10 transition-transform group-hover:scale-110 ${isDarkMode ? 'bg-[#151921] shadow-inner border border-white/5' : 'bg-slate-50 border border-slate-100'}`}>
                       <Palette className="w-5 h-5 text-fuchsia-500" />
                    </div>
                    <h4 className={`text-sm font-bold uppercase tracking-widest mb-3 ${ui.textPrimary}`}>Sync Brand</h4>
                    <p className={`text-xs leading-relaxed opacity-70 ${ui.textSecondary}`}>
                       Upload your logo once. We extract the palette and notch it into every widget automatically.
                    </p>
                 </div>

                 {/* Phase 3 */}
                 <div className={`relative p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${isDarkMode ? 'bg-[#0F1115] border-white/5 shadow-black/40' : 'bg-white border-slate-100 shadow-slate-200/50'}`}>
                    <div className="absolute top-6 right-6 text-[40px] font-bold opacity-5 font-['Orbitron'] select-none">03</div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 relative z-10 transition-transform group-hover:scale-110 ${isDarkMode ? 'bg-[#151921] shadow-inner border border-white/5' : 'bg-slate-50 border border-slate-100'}`}>
                       <Rocket className="w-5 h-5 text-emerald-500" />
                    </div>
                    <h4 className={`text-sm font-bold uppercase tracking-widest mb-3 ${ui.textPrimary}`}>Deploy</h4>
                    <p className={`text-xs leading-relaxed opacity-70 ${ui.textSecondary}`}>
                       Copy the optimized embed code. Paste into Notion. Design stays locked in sync.
                    </p>
                 </div>
             </div>
         </section>

         {/* 1. Widget Directory (Command Center) */}
        <section className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/5">
            <div className="space-y-4 flex-1">
              <div>
                <h2 className={`text-2xl font-bold font-['Orbitron'] ${ui.textPrimary}`}>System Index</h2>
                <p className={`text-xs opacity-60 mt-1 ${ui.textSecondary}`}>Select a protocol to begin configuration.</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                      selectedCategory === category
                        ? (isDarkMode ? 'bg-white/10 border-white/40 text-white shadow-[0_0_15px_-3px_rgba(255,255,255,0.3)]' : 'bg-slate-800 text-white border-slate-800')
                        : (isDarkMode ? 'border-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300' : 'border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-800')
                    }`}
                  >
                    {category === 'all' ? ':: All Systems' : `:: ${category}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full lg:w-72">
              <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                <Search className="w-4 h-4" />
              </div>
              <input
                ref={searchInputLocalRef}
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search protocols..."
                className={`w-full pl-11 pr-4 py-3 text-xs font-mono bg-transparent border-b-2 transition-colors focus:outline-none ${
                  isDarkMode 
                    ? 'border-white/10 text-white focus:border-purple-500 placeholder:text-slate-700' 
                    : 'border-slate-200 text-slate-900 focus:border-purple-600 placeholder:text-slate-400'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredWidgets.map((widget, i) => (
              <div 
                key={widget.id} 
                className={`group relative p-8 border transition-all duration-300 hover:-translate-y-1 aspect-square flex flex-col justify-between rounded-xl ${
                  isDarkMode 
                    ? 'bg-[#0B1320] border-white/5 hover:border-white/20 hover:shadow-2xl hover:shadow-purple-900/20' 
                    : 'bg-white border-slate-200 hover:border-purple-200 hover:shadow-xl'
                }`}
              >
                {/* Tech Corners */}
                <div className={`absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 rounded-tl-lg transition-colors ${isDarkMode ? 'border-white/10 group-hover:border-purple-400' : 'border-slate-200 group-hover:border-purple-600'}`}></div>
                <div className={`absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 rounded-tr-lg transition-colors ${isDarkMode ? 'border-white/10 group-hover:border-purple-400' : 'border-slate-200 group-hover:border-purple-600'}`}></div>
                <div className={`absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 rounded-bl-lg transition-colors ${isDarkMode ? 'border-white/10 group-hover:border-purple-400' : 'border-slate-200 group-hover:border-purple-600'}`}></div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 rounded-br-lg transition-colors ${isDarkMode ? 'border-white/10 group-hover:border-purple-400' : 'border-slate-200 group-hover:border-purple-600'}`}></div>

                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-white/5 text-purple-300' : 'bg-purple-50 text-purple-600'}`}>
                    {widget.icon}
                  </div>
                  <span className={`text-[9px] font-mono uppercase opacity-50 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    ID: {String(i + 1).padStart(3, '0')}
                  </span>
                </div>

                <div className="mb-8">
                  <h3 className={`text-xl font-bold font-['Orbitron'] mb-2 ${ui.textPrimary}`}>{widget.label}</h3>
                  <p className={`text-sm leading-relaxed opacity-70 ${ui.textSecondary}`}>{widget.description || `Initialize ${widget.label} protocol sequence.`}</p>
                </div>

                <button
                  onClick={() => onSelect(widget.id)}
                  className={`w-full py-4 text-[10px] font-bold uppercase tracking-[0.2em] border transition-all relative overflow-hidden group/btn rounded-lg ${
                    isDarkMode 
                      ? 'border-white/20 text-white hover:bg-white hover:text-black' 
                      : 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">Initialize</span>
                </button>
              </div>
            ))}
          </div>
        </section>



        {/* 2. Brand Kit Promo */}
        <section className={`rounded-3xl p-8 lg:p-20 relative overflow-hidden group border ${isDarkMode ? 'border-purple-500/20 bg-gradient-to-br from-[#0F1218] to-purple-900/10' : 'border-purple-200 bg-gradient-to-br from-white to-purple-50'}`}>
          <div className="absolute top-0 right-0 p-40 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
             <div className="space-y-6">
               <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-purple-400">
                  <Palette className="w-3 h-3" /> Brand Kit
               </div>
               <h2 className={`text-4xl lg:text-5xl font-bold font-['Orbitron'] ${ui.textPrimary}`}>Generate once, sync everywhere</h2>
               <p className={`text-base leading-relaxed max-w-2xl mx-auto opacity-80 ${ui.textSecondary}`}>
                 Upload a logo, capture its palette, and notch it into every widget automatically. The generator writes to local storage so your theme loads every time you reopen the builder.
               </p>
             </div>

             <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-medium opacity-70">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> 8+ curated presets per brand</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Auto-applies to light + dark modes</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Palette chips ready for export</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> One-click re-launch</div>
             </div>

             <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
                <button 
                  onClick={onBrandGenerator}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded font-bold text-xs uppercase tracking-[0.2em] shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] transition-all"
                >
                  Launch Generator
                </button>
                <button 
                  onClick={() => onSelect('newButtonGenerator')}
                  className={`px-8 py-4 rounded font-bold text-xs uppercase tracking-[0.2em] border transition-all ${isDarkMode ? 'border-white/10 text-white hover:bg-white/5' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                >
                  Preview with Buttons
                </button>
             </div>
          </div>
        </section>

        {/* 3. Workflow Section */}
        <section className="space-y-12">
           <div className="space-y-2 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-500">Workflow</p>
              <h2 className={`text-3xl font-bold font-['Orbitron'] ${ui.textPrimary}`}>How builders ship faster</h2>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  icon: <Layout className="w-6 h-6" />, 
                  title: 'Choose a widget', 
                  desc: 'Clock, Weather, Buttons, and more with presets tuned to Notion.',
                  color: 'text-blue-400'
                },
                { 
                  icon: <Palette className="w-6 h-6" />, 
                  title: 'Apply your brand', 
                  desc: 'Upload a logo once and sync its palette across every widget.',
                  color: 'text-purple-400'
                },
                { 
                  icon: <Download className="w-6 h-6" />, 
                  title: 'Export / embed', 
                  desc: 'Copy the embed link or HTML snippet directly into Notion.',
                  color: 'text-green-400'
                }
              ].map((step, i) => (
                 <div key={i} className={`p-8 rounded-xl border ${isDarkMode ? 'bg-[#111620] border-white/5' : 'bg-white border-slate-100'}`}>
                    <div className={`w-14 h-14 mb-6 rounded-lg flex items-center justify-center bg-white/5 ${step.color}`}>
                       {step.icon}
                    </div>
                    <h3 className={`text-base font-bold font-['Orbitron'] mb-3 ${ui.textPrimary}`}>{step.title}</h3>
                    <p className={`text-sm leading-relaxed opacity-60 ${ui.textSecondary}`}>{step.desc}</p>
                 </div>
              ))}
           </div>
        </section>

        {/* 4. Testimonials */}
        <section className="space-y-12">
           <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-pink-500">Loved by Teams</p>
              <h2 className={`text-2xl font-bold font-['Orbitron'] ${ui.textPrimary}`}>Feedback from early builders</h2>
           </div>
           
           <div className="grid md:grid-cols-3 gap-6">
              {[
                { quote: "Favorite part is the Button Generator. Macro + toggle modes mean I can run my workflows without leaving Notion.", author: "Mika", role: "Studio Lead" },
                { quote: "Brand kit syncing blew my mind—upload logo, click apply, every widget updates instantly.", author: "Lewis", role: "Creator" },
                { quote: "The builder finally feels as premium as the widgets themselves. I can move from idea to embedded widget in minutes.", author: "Nara", role: "Product Ops" }
              ].map((test, i) => (
                 <div key={i} className={`p-8 rounded-xl border relative ${isDarkMode ? 'bg-[#111620] border-white/5' : 'bg-white border-slate-100'} hover:border-purple-500/30 transition-colors`}>
                    <p className={`text-sm leading-loose italic mb-6 opacity-80 ${ui.textSecondary}`}>"{test.quote}"</p>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 opacity-20"></div>
                       <div>
                          <div className={`text-[11px] font-bold uppercase tracking-wider ${ui.textPrimary}`}>{test.author}</div>
                          <div className="text-[9px] text-purple-400 uppercase tracking-wider">{test.role}</div>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </section>

        {/* 5. Climax CTA */}
         <section className={`rounded-3xl p-12 lg:p-24 text-center relative overflow-hidden ${isDarkMode ? 'bg-gradient-to-b from-[#131b2c] to-[#0A0C12]' : 'bg-slate-900'}`}>
             <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
             <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-400">Climax CTA</p>
                <h2 className="text-4xl lg:text-6xl font-bold font-['Orbitron'] text-white">Ship your first widget in minutes</h2>
                <p className="text-lg text-slate-400 leading-relaxed"> Launch the builder, pick a widget, and apply your brand kit. Your Notion pages stay polished without the manual work.</p>
                
                <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
                  <button 
                    onClick={() => onSelect('clock')}
                    className="px-8 py-4 bg-white text-black hover:bg-slate-200 rounded-full font-bold text-xs uppercase tracking-[0.2em] shadow-lg transition-all"
                  >
                    Open Builder
                  </button>
                  <button 
                    onClick={onBrandGenerator}
                    className="px-8 py-4 rounded-full font-bold text-xs uppercase tracking-[0.2em] border border-white/20 text-white hover:bg-white/10 transition-all"
                  >
                    Generate Brand Kit
                  </button>
               </div>
             </div>
         </section>

          <footer className={`pt-24 pb-12 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
             <div className="grid md:grid-cols-4 gap-12 text-[10px] uppercase tracking-widest text-left">
                <div className="space-y-4">
                   <div className={`font-bold font-['Orbitron'] ${ui.textPrimary}`}>MetraNode</div>
                   <p className={`opacity-50 leading-relaxed normal-case ${ui.textSecondary}`}>
                      Advanced interface components for the modern web. Built by JaZeR.
                   </p>
                </div>
                
                <div className="space-y-4">
                   <div className={`font-bold ${ui.textPrimary}`}>System</div>
                   <ul className={`space-y-2 opacity-60 ${ui.textSecondary}`}>
                      <li className="hover:opacity-100 cursor-pointer">Changelog</li>
                      <li className="hover:opacity-100 cursor-pointer">Status</li>
                      <li className="hover:opacity-100 cursor-pointer">Docs</li>
                   </ul>
                </div>

                <div className="space-y-4">
                   <div className={`font-bold ${ui.textPrimary}`}>Legal</div>
                   <ul className={`space-y-2 opacity-60 ${ui.textSecondary}`}>
                      <li className="hover:opacity-100 cursor-pointer">Privacy</li>
                      <li className="hover:opacity-100 cursor-pointer">Terms</li>
                      <li className="hover:opacity-100 cursor-pointer">License</li>
                   </ul>
                </div>

                <div className="space-y-4">
                   <div className={`font-bold ${ui.textPrimary}`}>Social</div>
                   <div className="flex items-center gap-4 opacity-60">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors">
                        <Instagram className="w-3 h-3" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors">
                        <ExternalLink className="w-3 h-3" />
                      </div>
                   </div>
                </div>
             </div>
             
             <div className={`mt-12 pt-8 border-t text-center opacity-30 ${isDarkMode ? 'border-white/5' : 'border-slate-200'} ${ui.textSecondary}`}>
                MetraNode Mainframe v2.1 // System Online
             </div>
          </footer>
      </main>
    </div>
  );
}

// --- FILE: NotionWidgetBuilder.jsx ---

const applyBrandThemeToConfig = (baseConfig, theme) => {
  if (!theme) return baseConfig;
  const updated = { ...baseConfig };

  updated.brandThemeSnapshot = {
    ...theme,
    appliedAt: theme.appliedAt || new Date().toISOString()
  };

  if (theme.backgroundColor) {
    updated.bgColor = theme.backgroundColor;
    if (updated.backgroundColor !== undefined) {
      updated.backgroundColor = theme.backgroundColor;
    }
  }

  if (theme.textColor && updated.textColor !== undefined) {
    updated.textColor = theme.textColor;
  }

  if (theme.accentColor && updated.accentColor !== undefined) {
    updated.accentColor = theme.accentColor;
  }

  if (updated.lightMode) {
    updated.lightMode = {
      ...updated.lightMode,
      backgroundColor: theme.backgroundColor || updated.lightMode.backgroundColor,
      clockColor: theme.clockColor || updated.lightMode.clockColor,
      digitColor: theme.digitColor || theme.clockColor || updated.lightMode.digitColor,
      textColor: theme.textColor || updated.lightMode.textColor
    };
  }

  if (updated.darkMode) {
    updated.darkMode = {
      ...updated.darkMode,
      backgroundColor: theme.backgroundColor || updated.darkMode.backgroundColor,
      clockColor: theme.clockColor || updated.darkMode.clockColor,
      digitColor: theme.digitColor || theme.clockColor || updated.darkMode.digitColor,
      textColor: theme.textColor || updated.darkMode.textColor
    };
  }

  if (theme.glow !== undefined && updated.glowEffect !== undefined) {
    updated.glowEffect = theme.glow;
  }

  if (theme.texture && updated.backgroundTexture !== undefined) {
    updated.backgroundTexture = theme.texture;
  }

  // Support for widgets using 'theme.light'/'theme.dark' structure (e.g., Weather)
  if (updated.theme && updated.theme.light) {
    updated.theme.light = {
      ...updated.theme.light,
      backgroundColor: theme.backgroundColor || updated.theme.light.backgroundColor,
      textColor: theme.textColor || updated.theme.light.textColor
    };
  }

  if (updated.theme && updated.theme.dark) {
    updated.theme.dark = {
      ...updated.theme.dark,
      backgroundColor: theme.backgroundColor || updated.theme.dark.backgroundColor,
      textColor: theme.textColor || updated.theme.dark.textColor
    };
  }

  // Update flat color fields if they exist (Weather widget specific)
  if (updated.textColorLight !== undefined && theme.textColor) {
    updated.textColorLight = theme.textColor;
  }
  if (updated.textColorDark !== undefined && theme.textColor) {
    updated.textColorDark = theme.textColor; // Or contrast text if available
  }
  if (updated.backgroundColor !== undefined && theme.backgroundColor) {
    updated.backgroundColor = theme.backgroundColor;
    // For Weather widget, force static background to override weather gradients
    if (updated.setBackgroundColor !== undefined) {
      updated.setBackgroundColor = true;
    }
  }

  return updated;
};

const applyBrandToConfig = (baseConfig, brandId, customTheme) => {
  if (brandId === 'custom' && customTheme) {
    return applyBrandThemeToConfig(baseConfig, customTheme);
  }

  if (brandId === 'none') {
    const cleared = { ...baseConfig };
    delete cleared.brandThemeSnapshot;
    return cleared;
  }

  const brand = BRAND_KITS[brandId];
  if (!brand) {
    const cleared = { ...baseConfig };
    delete cleared.brandThemeSnapshot;
    return cleared;
  }

  const newConfig = { ...baseConfig };
  delete newConfig.brandThemeSnapshot;
  if (brand.fontFamily) newConfig.fontFamily = brand.fontFamily;
  if (brand.bgColor) newConfig.bgColor = brand.bgColor;
  if (brand.textColor) newConfig.textColor = brand.textColor;
  if (brand.accentColor) newConfig.accentColor = brand.accentColor;

  if (brandId === 'jazer') {
    if (newConfig.glowEffect !== undefined) newConfig.glowEffect = true;
    if (newConfig.gradientText !== undefined) newConfig.gradientText = true;
  }

  // FORCE APPLY brand colors to nested widget configs (like Weather)
  // This ensures the brand overrides internal widget defaults effectively
  if (brand.bgColor || brand.textColor) {
    // 1. Update legacy/flat fields if they exist
    if (newConfig.textColorLight !== undefined) newConfig.textColorLight = brand.textColor;
    if (newConfig.textColorDark !== undefined) newConfig.textColorDark = brand.textColor; // Enforce brand text
    if (newConfig.backgroundColor !== undefined) {
      newConfig.backgroundColor = brand.bgColor;
      if (newConfig.setBackgroundColor !== undefined) newConfig.setBackgroundColor = true;
    }

    // 2. Update nested theme objects (Weather widget structure)
    if (newConfig.theme) {
      if (newConfig.theme.light) {
        newConfig.theme.light = {
          ...newConfig.theme.light,
          backgroundColor: brand.bgColor || newConfig.theme.light.backgroundColor,
          textColor: brand.textColor || newConfig.theme.light.textColor
        };
      }
      if (newConfig.theme.dark) {
        newConfig.theme.dark = {
          ...newConfig.theme.dark,
          backgroundColor: brand.bgColor || newConfig.theme.dark.backgroundColor,
          textColor: brand.textColor || newConfig.theme.dark.textColor
        };
      }
    }
  }

  return newConfig;
};

function NotionWidgetBuilder({ initialWidgetId, onBack, globalBrandTheme, onBrandThemeUpdate, onLaunchBrandGenerator }) {
  const normalizedGlobalTheme = useMemo(
    () => (globalBrandTheme ? normalizeBrandTheme(globalBrandTheme) : null),
    [globalBrandTheme]
  );
  const [activeWidgetId, setActiveWidgetId] = useState(initialWidgetId);
  const [activeBrandId, setActiveBrandId] = useState(normalizedGlobalTheme ? 'custom' : 'none');
  const [config, setConfig] = useState(() => {
    const defaultConfig = WIDGET_REGISTRY[initialWidgetId].defaultConfig;
    return normalizedGlobalTheme ? applyBrandThemeToConfig(defaultConfig, normalizedGlobalTheme) : defaultConfig;
  });
  const [brandTheme, setBrandTheme] = useState(normalizedGlobalTheme); // Store extracted brand colors
  const [expandedSections, setExpandedSections] = useState({});
  const [configSearch, setConfigSearch] = useState('');
  const sectionRefs = useRef({});
  const configPanelRef = useRef(null);
  const infiniteScrollRef = useRef(null);
  const tabMenuRef = useRef(null);
  const [highlightedSection, setHighlightedSection] = useState(null);

  const [visibleSectionCount, setVisibleSectionCount] = useState(CONFIG_SECTION_BATCH);
  const [showTabMenu, setShowTabMenu] = useState(false);
  const [showAllButtonGeneratorSections, setShowAllButtonGeneratorSections] = useState(false);
  const [widgetSearch, setWidgetSearch] = useState('');
  const [navFilter, setNavFilter] = useState('all');
  const [pinnedWidgets, setPinnedWidgets] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = window.localStorage.getItem('notion_wiz_pins');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Recent widgets tracking
  const { addRecentWidget } = useRecentWidgets();

  // EXPORT STATES
  const [showExport, setShowExport] = useState(false);
  const getIsDesktop = useCallback(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 1024;
  }, []);
  const [isDesktop, setIsDesktop] = useState(getIsDesktop);
  const [isSidebarOpen, setIsSidebarOpen] = useState(getIsDesktop);
  const [isInspectorOpen, setIsInspectorOpen] = useState(getIsDesktop);
  const [inspectorTab, setInspectorTab] = useState('configure');
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    let previous = getIsDesktop();
    const handleResize = () => {
      const next = getIsDesktop();
      if (next !== previous) {
        previous = next;
        setIsDesktop(next);
        setIsSidebarOpen(next);
        setIsInspectorOpen(next);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getIsDesktop]);

  const { theme, toggleColorMode } = useTheme();
  const isDarkMode = Boolean(theme?.isDark);
  const builderUi = useMemo(() => ({
    page: isDarkMode ? 'bg-[#0B0E12] text-slate-100' : 'bg-slate-50 text-slate-900',
    sidebar: isDarkMode ? 'bg-[#111827] border-white/10' : 'bg-white border-slate-200',
    sidebarHeader: isDarkMode ? 'border-white/10' : 'border-slate-200',
    sidebarMuted: isDarkMode ? 'text-neutral-500' : 'text-slate-400',
    sidebarText: isDarkMode ? 'text-neutral-300' : 'text-slate-600',
    panel: isDarkMode ? 'bg-[#0F1115] border-white/5' : 'bg-white border-slate-200',
    panelHeader: isDarkMode ? 'bg-[#10121A] border-white/10' : 'bg-white border-slate-200',
    panelTop: isDarkMode ? 'bg-[#0A0C12]/95 border-white/10' : 'bg-white/95 border-slate-200',
    card: isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200',
    cardSoft: isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200',
    input: isDarkMode ? 'bg-white/5 border-interactive text-white placeholder:text-neutral-400' : 'bg-slate-100 border-slate-200 text-slate-700 placeholder:text-slate-400',
    chip: isDarkMode ? 'border-interactive text-neutral-300 hover:border-emphasis hover:text-white hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50',
    chipActive: isDarkMode ? 'border-accent text-white bg-purple-500/20 shadow-sm' : 'border-sky-300 text-sky-900 bg-sky-100',
    ghostButton: isDarkMode ? 'border-white/15 text-neutral-200 hover:border-purple-300 hover:text-white' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900',
    muted: isDarkMode ? 'text-neutral-400' : 'text-slate-500',
    mutedStrong: isDarkMode ? 'text-neutral-300' : 'text-slate-600',
    border: isDarkMode ? 'border-white/10' : 'border-slate-200',
  }), [isDarkMode]);

  const debouncedConfig = useDebounce(config, DEBOUNCE_DELAY);
  const effectiveBrandTheme = brandTheme || normalizedGlobalTheme;
  const hasCustomBrandTheme = Boolean(effectiveBrandTheme);
  const customBrandLabel = effectiveBrandTheme?.presetName || effectiveBrandTheme?.name || 'Custom Brand Theme';
  const ActiveWidget = WIDGET_REGISTRY[activeWidgetId];
  const sectionOutline = useMemo(() => {
    if (!ActiveWidget?.sections) return [];
    return ActiveWidget.sections
      .map((section) => {
        const controlCount = ActiveWidget.fields.filter(
          (field) => (field.section || 'general') === section.id
        ).length;
        return { ...section, controlCount };
      })
      .filter((section) => section.controlCount > 0);
  }, [ActiveWidget]);

  useEffect(() => {
    // Load brand fonts: Orbitron (headings) and Montserrat (body)
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Orbitron:wght@400;700&family=Roboto&family=Open+Sans&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    sectionRefs.current = {};
  }, [activeWidgetId]);

  useEffect(() => {
    if (!showTabMenu) return undefined;
    const handleClick = (event) => {
      if (!tabMenuRef.current) return;
      if (!tabMenuRef.current.contains(event.target)) {
        setShowTabMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showTabMenu]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('notion_wiz_pins', JSON.stringify(pinnedWidgets));
    } catch {
      // ignore
    }
  }, [pinnedWidgets]);

  // Update brandTheme when globalBrandTheme changes
  const toggleSection = useCallback((sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, []);

  const isSectionOpen = useCallback((sectionId) => expandedSections[sectionId] === true, [expandedSections]);

  const handleWidgetChange = (id) => {
    setActiveWidgetId(id);
    setShowAllButtonGeneratorSections(false);
    setVisibleSectionCount(CONFIG_SECTION_BATCH);
    const base = WIDGET_REGISTRY[id].defaultConfig;
    const themedConfig = applyBrandToConfig(base, activeBrandId, effectiveBrandTheme);
    setConfig(themedConfig);
    setShowExport(false);
    setWidgetSearch('');
    setInspectorTab('configure');
    if (!isDesktop) {
      setIsSidebarOpen(false);
      setIsInspectorOpen(true);
    }
    
    // Track as recent widget
    const widget = WIDGET_REGISTRY[id];
    if (widget) {
      addRecentWidget(id, widget.label);
    }
  };

  const handleBrandChange = (brandId) => {
    const currentDefault = applyBrandToConfig(
      WIDGET_REGISTRY[activeWidgetId].defaultConfig,
      activeBrandId,
      effectiveBrandTheme
    );
    const hasCustomizations = JSON.stringify(config) !== JSON.stringify(currentDefault);

    if (hasCustomizations && !window.confirm('Applying a brand kit will override your current customizations. Continue?')) {
      return;
    }

    setActiveBrandId(brandId);
    setConfig(prev => applyBrandToConfig(prev, brandId, effectiveBrandTheme));
  };

  // Helper to get nested property value
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  };

  // Helper to set nested property value
  const setNestedValue = (obj, path, value) => {
    const parts = path.split('.');
    const last = parts.pop();
    const target = parts.reduce((acc, part) => {
      if (!acc[part]) acc[part] = {};
      return acc[part];
    }, obj);
    target[last] = value;
    return obj;
  };

  const handleConfigChange = useCallback((key, value) => {
    if (key.includes('.')) {
      setConfig(prev => {
        const newConfig = { ...prev };
        setNestedValue(newConfig, key, value);
        return newConfig;
      });
      return;
    }

    if (key === 'lightMode' || key === 'darkMode') {
      setConfig(prev => ({
        ...prev,
        [key]: { ...prev[key], ...value }
      }));
      return;
    }

    setConfig(prev => {
      let nextValue = value;
      if (typeof prev[key] === 'number' && typeof value === 'string') {
        const parsed = parseInt(value, 10);
        nextValue = Number.isNaN(parsed) ? prev[key] : parsed;
      }
      return { ...prev, [key]: nextValue };
    });
  }, []);

  const handleConfigSearchChange = useCallback((value) => {
    setConfigSearch(value);
    if (value.trim()) {
      setVisibleSectionCount(Number.MAX_SAFE_INTEGER);
    } else {
      setVisibleSectionCount(CONFIG_SECTION_BATCH);
    }
  }, []);

  const syncBrandTheme = useCallback((theme) => {
    const normalized = theme ? normalizeBrandTheme(theme) : null;
    if (normalized) {
      setBrandTheme(normalized);
      setActiveBrandId('custom');
      onBrandThemeUpdate?.(normalized);
      try {
        localStorage.setItem('jazer_global_brand_theme', JSON.stringify(normalized));
        localStorage.setItem('jazer_global_brand_active', 'true');
      } catch {
        // no-op if storage is unavailable
      }
      return;
    }

    setBrandTheme(null);
    setActiveBrandId(prev => (prev === 'custom' ? 'none' : prev));
    onBrandThemeUpdate?.(null);
    try {
        localStorage.removeItem('jazer_global_brand_theme');
        localStorage.removeItem('jazer_global_brand_active');
      } catch {
        // ignore storage errors
      }
  }, [onBrandThemeUpdate]);

  const handleLogoColorsExtracted = useCallback((theme) => {
    if (!theme) {
      syncBrandTheme(null);
      setConfig(prev => {
        if (!prev.brandThemeSnapshot) return prev;
        const next = { ...prev };
        delete next.brandThemeSnapshot;
        return next;
      });
      return;
    }

    const snapshot = normalizeBrandTheme(theme, { appliedAt: new Date().toISOString() });
    if (!snapshot) return;

    // Save brand theme for generating dynamic presets
    syncBrandTheme(snapshot);

    // Apply extracted colors to widget configuration
    const newConfig = {
      ...config,
      brandThemeSnapshot: snapshot
    };
    const backgroundColor = snapshot.backgroundColor || snapshot.background;
    const textColor = snapshot.textColor || snapshot.text;
    const contrastBackground = snapshot.text || snapshot.textColor || '#0B0E12';
    const contrastText = snapshot.background || snapshot.backgroundColor || '#F8F9FF';
    const primaryColor = snapshot.clockColor || snapshot.primary || snapshot.primaryColor;
    const secondaryColor = snapshot.digitColor || snapshot.secondary || snapshot.secondaryColor || primaryColor;
    const accentColor = snapshot.accentColor || snapshot.accent || primaryColor;
    const palette = Array.isArray(snapshot.palette) ? snapshot.palette : [];

    // ===== WIDGETS WITH LIGHTMODE/DARKMODE OBJECTS =====
    if (activeWidgetId === 'clock') {
      newConfig.lightMode = {
        ...newConfig.lightMode,
        textColor,
        panelColor: backgroundColor,
        digitColor: primaryColor,
        clockColor: primaryColor,
        backgroundColor
      };
      newConfig.darkMode = {
        ...newConfig.darkMode,
        textColor: contrastText,
        panelColor: contrastBackground,
        digitColor: secondaryColor,
        clockColor: accentColor,
        backgroundColor: contrastBackground
      };
      newConfig.bgColor = backgroundColor;
    }

    else if (activeWidgetId === 'countdown') {
      newConfig.lightMode = {
        ...newConfig.lightMode,
        textColor,
        panelColor: backgroundColor,
        digitColor: primaryColor,
        backgroundColor
      };
      newConfig.darkMode = {
        ...newConfig.darkMode,
        textColor: contrastText,
        panelColor: contrastBackground,
        digitColor: secondaryColor,
        backgroundColor: contrastBackground
      };
      newConfig.bgColor = backgroundColor;
    }

    else if (activeWidgetId === 'quotes') {
      newConfig.lightMode = {
        ...newConfig.lightMode,
        textColor,
        authorColor: secondaryColor,
        backgroundColor
      };
      newConfig.darkMode = {
        ...newConfig.darkMode,
        textColor: contrastText,
        authorColor: accentColor,
        backgroundColor: contrastBackground
      };
      newConfig.bgColor = backgroundColor;
    }

    // ===== WIDGETS WITH SEPARATE COLOR PROPS =====
    if (activeWidgetId === 'counter') {
      newConfig.lightTextColor = textColor;
      newConfig.darkTextColor = contrastBackground;
      newConfig.bgColor = backgroundColor;
    }

    else if (activeWidgetId === 'weather') {
      newConfig.bgColor = backgroundColor;
      newConfig.textColor = textColor;
      newConfig.accentColor = accentColor;

      // Fully apply to Weather's specific flat fields
      newConfig.textColorLight = textColor;
      newConfig.textColorDark = textColor;
      newConfig.backgroundColor = backgroundColor;
      newConfig.setBackgroundColor = true; // Force override of dynamic gradients

      // Fully apply to Weather's nested theme structure
      // We apply the brand theme to both modes to ensure it persists 
      // regardless of system/appearance settings, satisfying "fully use brand theme"
      newConfig.theme = {
        light: {
          backgroundColor: backgroundColor,
          textColor: textColor
        },
        dark: {
          backgroundColor: backgroundColor,
          textColor: textColor
        }
      };
    }

    else if (activeWidgetId === 'imageGallery') {
      newConfig.bgColor = backgroundColor;
    }

    // ===== BUTTON GENERATOR (SPECIAL CASE) =====
    else if (activeWidgetId === 'newButtonGenerator') {
      // Apply to all buttons using full color palette
      const paletteSource = palette.length > 0 ? palette : [primaryColor, accentColor, textColor].filter(Boolean);
      if (newConfig.buttons && Array.isArray(newConfig.buttons)) {
        newConfig.buttons = newConfig.buttons.map((btn, idx) => ({
          ...btn,
          backgroundColor: paletteSource[idx % paletteSource.length] || primaryColor,
          textColor,
          outlineColor: accentColor,
          hoverBackgroundColor: backgroundColor,
          hoverTextColor: paletteSource[idx % paletteSource.length] || primaryColor
        }));
      }
      newConfig.bgColor = backgroundColor;
    }

    // ===== INLINE WIDGETS =====
    else if (activeWidgetId === 'simpleList') {
      newConfig.bgColor = backgroundColor;
      newConfig.textColor = textColor;
      newConfig.accentColor = accentColor;
    }

    else if (activeWidgetId === 'pomodoro') {
      newConfig.bgColor = backgroundColor;
      newConfig.textColor = textColor;
      newConfig.accentColor = accentColor;
    }

    // ===== FALLBACK FOR ANY FUTURE WIDGETS =====
    else {
      newConfig.bgColor = backgroundColor;
      newConfig.textColor = textColor;
      if (newConfig.accentColor !== undefined) {
        newConfig.accentColor = accentColor;
      }
    }

    setConfig(newConfig);
  }, [activeWidgetId, config, setConfig, syncBrandTheme]);

  const navFilters = useMemo(() => ['all', 'pinned', ...Array.from(new Set(Object.values(WIDGET_CATEGORIES)))], []);

  const filteredWidgets = useMemo(() => {
    const query = widgetSearch.trim().toLowerCase();
    const pinIndex = (id) => pinnedWidgets.indexOf(id);
    return Object.values(WIDGET_REGISTRY)
      .map(w => ({
        ...w,
        category: WIDGET_CATEGORIES[w.id] || 'Other',
        isPinned: pinnedWidgets.includes(w.id)
      }))
      .filter(w => {
        if (!query) return true;
        const haystack = [w.label, w.description].filter(Boolean).map(val => String(val).toLowerCase());
        return haystack.some(text => text.includes(query));
      })
      .filter(w => {
        if (navFilter === 'all') return true;
        if (navFilter === 'pinned') return w.isPinned;
        return w.category === navFilter;
      })
      .sort((a, b) => {
        const aPin = pinIndex(a.id);
        const bPin = pinIndex(b.id);
        if (aPin !== bPin) {
          if (aPin === -1) return 1;
          if (bPin === -1) return -1;
          return aPin - bPin;
        }
        return a.label.localeCompare(b.label);
      });
  }, [widgetSearch, navFilter, pinnedWidgets]);

  const pinnedWidgetList = useMemo(
    () => filteredWidgets.filter((widget) => widget.isPinned),
    [filteredWidgets]
  );
  const unpinnedWidgetList = useMemo(
    () => filteredWidgets.filter((widget) => !widget.isPinned),
    [filteredWidgets]
  );

  const showGroupedList = navFilter === 'all' && !widgetSearch.trim();

  const togglePinned = useCallback((id) => {
    setPinnedWidgets(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  }, []);

  const filterIconMap = {
    all: Layout,
    pinned: Star,
    'Time & Productivity': Clock,
    'Data & Information': BarChart3,
    'Media & Display': ImageIcon,
    'Interactive & Actions': MousePointerClick,
    Other: MoreHorizontal
  };







  const configureSections = useMemo(
    () => sectionOutline.map(section => ({ id: section.id, label: section.label })),
    [sectionOutline]
  );

  const configSectionsRender = useMemo(() => {
    if (!ActiveWidget) {
      return { nodes: [], total: 0 };
    }

    const query = configSearch.trim().toLowerCase();
    const sections = ActiveWidget.sections
      ? ActiveWidget.sections.map(s => s.id)
      : [...new Set(ActiveWidget.fields.map(f => f.section))].filter(Boolean);
    const generalFields = ActiveWidget.fields.filter(f => !f.section);
    if (generalFields.length > 0 && !sections.includes('general')) {
      sections.unshift('general');
    }

    const filterBySearch = (field) => {
      if (!query) return true;
      const haystack = [
        field.label,
        field.name,
        field.placeholder,
        field.section
      ].filter(Boolean).map(val => String(val).toLowerCase());
      return haystack.some(text => text.includes(query));
    };

    const sectionNodes = sections.map(section => {
      const sectionFields = section === 'general'
        ? generalFields
        : ActiveWidget.fields.filter(f => f.section === section);
      if (sectionFields.length === 0) return null;

      let sectionTitle = section;
      let sectionConfig = null;
      if (ActiveWidget.sections) {
        sectionConfig = ActiveWidget.sections.find(s => s.id === section);
        sectionTitle = sectionConfig ? sectionConfig.label : section;
      } else {
        const sectionTitles = {
          time: 'Time Display',
          style: 'Clock Style',
          analog: 'Analog Customization',
          typography: 'Typography',
          background: 'Background',
          interactive: 'Interactive Mode',
          theme: 'Preset Themes',
          appearance: 'Appearance Mode',
          features: 'Additional Features',
          effects: 'Visual Effects',
          event: 'Event Setup',
          units: 'Time Units',
          completion: 'Completion',
          general: 'General Settings'
        };
        sectionTitle = sectionTitles[section] || section;
      }

      const sectionTitleLower = sectionTitle.toLowerCase();
      const descriptionMatches = query && sectionConfig?.description?.toLowerCase().includes(query);
      const notesMatch = query && sectionConfig?.notes?.some(note =>
        [note.title, note.body].filter(Boolean).some(text => text.toLowerCase().includes(query))
      );
      const sectionMatchesSearch = query && (sectionTitleLower.includes(query) || descriptionMatches || notesMatch);

      const isButtonGeneratorGuided = activeWidgetId === 'newButtonGenerator' && !showAllButtonGeneratorSections && !query;
      const gatedSections = {
        macroInput: Boolean(config.macroMode?.enabled || config.inputMode?.enabled),
        cycleToggle: Boolean(config.cycleMode?.enabled || config.toggleMode?.enabled),
        notionIntegration: Boolean(config.notionIntegration?.enabled),
        visuals: Boolean(
          config.visuals?.enableParticleEffects ||
          config.visuals?.activeGlow ||
          config.visuals?.showProgressArc ||
          config.visuals?.badgesEnabled
        ),
        dataAware: Boolean(config.dataAware?.enabled)
      };

      if (isButtonGeneratorGuided && Object.prototype.hasOwnProperty.call(gatedSections, section) && !gatedSections[section]) {
        const enableSection = () => {
          if (section === 'macroInput') handleConfigChange('macroMode.enabled', true);
          if (section === 'cycleToggle') handleConfigChange('toggleMode.enabled', true);
          if (section === 'notionIntegration') handleConfigChange('notionIntegration.enabled', true);
          if (section === 'dataAware') handleConfigChange('dataAware.enabled', true);
          if (section === 'visuals') {
            handleConfigChange('visuals', {
              ...config.visuals,
              enableParticleEffects: true,
              activeGlow: true,
              showProgressArc: true,
              badgesEnabled: true
            });
          }
        };

        return (
          <div
            key={section}
            ref={(el) => { if (el) sectionRefs.current[section] = el; }}
            className={`border rounded-lg overflow-hidden ${builderUi.card} ${highlightedSection === section ? 'ring-2 ring-purple-400' : ''}`}
          >
            <button
              type="button"
              onClick={() => toggleSection(section)}
              className={`w-full px-3 py-2 flex items-center justify-between text-left text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
            >
              <div className="flex flex-col text-left">
                <span className="flex items-center gap-2">
                  <Lock className={`w-4 h-4 ${builderUi.muted}`} />
                  {sectionTitle}
                </span>
                <span className={`text-[11px] font-normal ${builderUi.muted}`}>
                  Hidden while disabled. Enable this upgrade to configure it.
                </span>
              </div>
              <ChevronDown
                className="w-4 h-4 transition-transform"
                style={{ transform: isSectionOpen(section) ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>
            {isSectionOpen(section) && (
              <div className={`p-3 space-y-3 border-t ${builderUi.border}`}>
                <div className={`flex items-start justify-between gap-3 rounded-lg p-3 border ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={`text-xs leading-snug ${builderUi.mutedStrong}`}>
                    Use the expanding Upgrade orb on the preview to turn this on, or enable it here.
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowAllButtonGeneratorSections(true)}
                      className={`text-[11px] px-3 py-1.5 rounded-full border transition ${builderUi.ghostButton}`}
                    >
                      Show
                    </button>
                    <button
                      type="button"
                      onClick={enableSection}
                      className={`text-[11px] px-3 py-1.5 rounded-full border transition ${
                        isDarkMode ? 'border-emerald-300/60 text-emerald-100 bg-emerald-500/10 hover:bg-emerald-500/20' : 'border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                    >
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

      const filteredFields = sectionMatchesSearch ? sectionFields : sectionFields.filter(filterBySearch);
      if (filteredFields.length === 0) return null;

      const open = query ? true : isSectionOpen(section);

      return (
        <div
          key={section}
          ref={(el) => { if (el) sectionRefs.current[section] = el; }}
          className={`border rounded-lg overflow-hidden ${builderUi.card} ${highlightedSection === section ? 'ring-2 ring-purple-400' : ''}`}
        >
          <button
            type="button"
            onClick={() => toggleSection(section)}
            className={`w-full px-3 py-2 flex items-center justify-between text-left text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
          >
            <div className="flex flex-col text-left">
              <span>{sectionTitle}</span>
              {sectionConfig?.description && (
                <span className={`text-[11px] font-normal ${builderUi.muted}`}>{sectionConfig.description}</span>
              )}
            </div>
            <ChevronDown
              className="w-4 h-4 transition-transform"
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>
          {open && (
            <div className={`p-3 space-y-3 border-t ${builderUi.border}`}>
              {sectionConfig?.notes?.length > 0 && (
                <div className={`space-y-2 text-[11px] rounded p-2 border ${
                  isDarkMode ? 'text-neutral-300 bg-white/5 border-white/10' : 'text-slate-600 bg-slate-50 border-slate-200'
                }`}>
                  {sectionConfig.notes.map((note) => (
                    <div key={`${section}-${note.title}`} className="space-y-1">
                      <div className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{note.title}</div>
                      {note.body && <p>{note.body}</p>}
                    </div>
                  ))}
                </div>
              )}
              {filteredFields.map(f => {
                let field = f;
                if (f.name === 'presetTheme' && brandTheme && activeWidgetId === 'clock') {
                  const brandPresets = [
                    { label: '--- Brand-Based Themes ---', value: '__separator__', disabled: true },
                    { label: 'Brand Monochrome', value: 'brand-monochrome' },
                    { label: 'Brand Contrast', value: 'brand-contrast' },
                    { label: 'Brand Vibrant', value: 'brand-vibrant' },
                    { label: 'Brand Professional', value: 'brand-professional' },
                    { label: 'Brand Dark', value: 'brand-dark' },
                    { label: 'Brand Light', value: 'brand-light' },
                    { label: 'Brand Neon', value: 'brand-neon' },
                    { label: 'Brand Minimal', value: 'brand-minimal' }
                  ];
                  field = {
                    ...f,
                    options: [...f.options, ...brandPresets]
                  };
                }

                return (
                  <WidgetField
                    key={f.name}
                    field={field}
                    value={f.name.includes('.') ? getNestedValue(config, f.name) : config[f.name]}
                    onChange={(val) => handleConfigChange(f.name, val)}
                  />
                );
              })}
            </div>
          )}
        </div>
      );
    }).filter(Boolean);

    if (sectionNodes.length === 0) {
      return {
        nodes: [
          <div key="empty" className={`text-xs italic ${builderUi.muted}`}>
            {query ? `No settings match "${configSearch}".` : 'No configurable settings available.'}
          </div>
        ],
        total: 0
      };
    }

    const limitedSections = query ? sectionNodes : sectionNodes.slice(0, visibleSectionCount);

    return {
      nodes: limitedSections,
      total: sectionNodes.length
    };
  }, [
    ActiveWidget,
    activeWidgetId,
    brandTheme,
    config,
    configSearch,
    builderUi,
    handleConfigChange,
    highlightedSection,
    isDarkMode,
    isSectionOpen,
    showAllButtonGeneratorSections,
    toggleSection,
    visibleSectionCount
  ]);

  const { nodes: configSectionNodes, total: totalSectionCount } = configSectionsRender;
  const hasMoreSections = !configSearch.trim() && totalSectionCount > visibleSectionCount;
  useEffect(() => {
    if (configSearch.trim()) return;
    if (visibleSectionCount >= totalSectionCount) return;
    const raf = typeof window !== 'undefined'
      ? window.requestAnimationFrame
      : null;
    const runCheck = () => {
      const panel = configPanelRef.current;
      if (!panel) return;
      if (panel.scrollHeight <= panel.clientHeight + 40) {
        setVisibleSectionCount((prev) => Math.min(prev + CONFIG_SECTION_BATCH, totalSectionCount));
      }
    };

    if (raf) {
      raf(runCheck);
      return () => {};
    }
    runCheck();
  }, [configSearch, totalSectionCount, visibleSectionCount]);

  useEffect(() => {
    if (!hasMoreSections) return undefined;
    const sentinel = infiniteScrollRef.current;
    if (!sentinel) return undefined;
    const root = configPanelRef.current || null;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setVisibleSectionCount((prev) => Math.min(prev + CONFIG_SECTION_BATCH, totalSectionCount));
        }
      },
      {
        root,
        threshold: 0.25
      }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMoreSections, totalSectionCount]);

  const focusSection = useCallback((sectionId) => {
    if (!sectionId || !sectionRefs.current[sectionId]) return false;
    sectionRefs.current[sectionId].scrollIntoView({ behavior: 'smooth', block: 'center' });
    setExpandedSections(prev => ({ ...prev, [sectionId]: true }));
    setHighlightedSection(sectionId);
    setTimeout(() => {
      setHighlightedSection((current) => current === sectionId ? null : current);
    }, 1500);
    return true;
  }, []);

  const sectionTabMap = useMemo(() => ({
    brandControls: 'brand',
    appearanceControls: 'brand'
  }), []);

  const handleCustomizeRequest = useCallback((sectionId) => {
    const targetTab = sectionTabMap[sectionId] || 'configure';
    if (targetTab !== inspectorTab) {
      setInspectorTab(targetTab);
    }
    if (!isDesktop) {
      setIsInspectorOpen(true);
    }

    const attemptFocus = () => {
      const found = focusSection(sectionId);
      if (!found && sectionId && targetTab === 'configure') {
        setVisibleSectionCount(Number.MAX_SAFE_INTEGER);
        if (typeof window !== 'undefined') {
          window.requestAnimationFrame(() => {
            setTimeout(() => focusSection(sectionId), 80);
          });
        }
      } else if (!sectionId && configPanelRef.current) {
        configPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        setTimeout(attemptFocus, 60);
      });
    } else {
      attemptFocus();
    }
  }, [
    focusSection,
    inspectorTab,
    isDesktop,
    sectionTabMap,
    setInspectorTab,
    setIsInspectorOpen,
    setVisibleSectionCount,
    configPanelRef
  ]);

  const registerSectionRef = useCallback((id, el) => {
    if (!id || !el) return;
    sectionRefs.current[id] = el;
  }, []);

  const upgradeItems = useMemo(() => {
    const baseItems = [
      {
        id: 'upgrade-brand',
        label: 'Brand Kit Sync',
        description: 'Apply a global palette and keep widgets consistent.',
        icon: Palette,
        kind: 'navigate',
        cta: 'Open',
        onSelect: () => handleCustomizeRequest('brandControls')
      },
      {
        id: 'upgrade-surface',
        label: 'Surface & Canvas',
        description: 'Tune background, text, and sizing for a cleaner embed.',
        icon: Layout,
        kind: 'navigate',
        cta: 'Open',
        onSelect: () => handleCustomizeRequest('appearanceControls')
      }
    ];

    if (activeWidgetId !== 'newButtonGenerator') {
      return baseItems;
    }

    const toggleItems = [
      {
        id: 'upgrade-hover',
        label: 'Hover Menu',
        description: 'Show hover glow + interaction hints on the widget surface.',
        icon: Eye,
        kind: 'toggle',
        enabled: Boolean(config.showHoverMenu),
        keepOpen: true,
        onToggle: (next) => handleConfigChange('showHoverMenu', next)
      },
      {
        id: 'upgrade-customize-button',
        label: 'Customize Button',
        description: 'Expose quick navigation into the Configure panel.',
        icon: Settings,
        kind: 'toggle',
        enabled: Boolean(config.showCustomizeButton),
        keepOpen: true,
        onToggle: (next) => handleConfigChange('showCustomizeButton', next)
      },
      {
        id: 'upgrade-macro',
        label: 'Macro Mode',
        description: 'Run a sequence of actions from one click.',
        icon: ListIcon,
        kind: 'toggle',
        enabled: Boolean(config.macroMode?.enabled),
        keepOpen: true,
        onToggle: (next) => handleConfigChange('macroMode.enabled', next)
      },
      {
        id: 'upgrade-input',
        label: 'Input Mode',
        description: 'Prompt for a quick note before running actions.',
        icon: Type,
        kind: 'toggle',
        enabled: Boolean(config.inputMode?.enabled),
        keepOpen: true,
        onToggle: (next) => handleConfigChange('inputMode.enabled', next)
      },
      {
        id: 'upgrade-cycle',
        label: 'Cycle Mode',
        description: 'Cycle through presets (Start, Pause, Skip, Complete).',
        icon: RefreshCcw,
        kind: 'toggle',
        enabled: Boolean(config.cycleMode?.enabled),
        keepOpen: true,
        onToggle: (next) => handleConfigChange('cycleMode.enabled', next)
      },
      {
        id: 'upgrade-toggle',
        label: 'Toggle State',
        description: 'Persist an Active/Inactive state with glow + logging.',
        icon: Zap,
        kind: 'toggle',
        enabled: Boolean(config.toggleMode?.enabled),
        keepOpen: true,
        onToggle: (next) => handleConfigChange('toggleMode.enabled', next)
      },
      {
        id: 'upgrade-notion',
        label: 'Notion Integration',
        description: 'Simulate database actions, templates, and two-way conditions.',
        icon: LinkIcon,
        kind: 'toggle',
        enabled: Boolean(config.notionIntegration?.enabled),
        keepOpen: true,
        onToggle: (next) => handleConfigChange('notionIntegration.enabled', next)
      },
      {
        id: 'upgrade-visuals',
        label: 'Premium Visuals',
        description: 'Particles, progress arc, badges, and active glow.',
        icon: Sparkles,
        kind: 'toggle',
        enabled: Boolean(
          config.visuals?.enableParticleEffects ||
          config.visuals?.activeGlow ||
          config.visuals?.showProgressArc ||
          config.visuals?.badgesEnabled
        ),
        keepOpen: true,
        onToggle: (next) => handleConfigChange('visuals', {
          ...config.visuals,
          enableParticleEffects: next,
          activeGlow: next,
          showProgressArc: next,
          badgesEnabled: next
        })
      },
      {
        id: 'upgrade-data-aware',
        label: 'Data-Aware Reactions',
        description: 'Let sample metrics change colors, labels, and status.',
        icon: Activity,
        kind: 'toggle',
        enabled: Boolean(config.dataAware?.enabled),
        keepOpen: true,
        onToggle: (next) => handleConfigChange('dataAware.enabled', next)
      }
    ];

    const jumpItems = [
      {
        id: 'jump-modes',
        label: 'Edit Modes & Macros',
        description: 'Jump straight to macro + input mode settings.',
        icon: CornerDownRight,
        kind: 'navigate',
        cta: 'Jump',
        onSelect: () => handleCustomizeRequest('macroInput')
      },
      {
        id: 'jump-notion',
        label: 'Configure Notion Sync',
        description: 'Database, template, two-way rules, and conditionals.',
        icon: CornerDownRight,
        kind: 'navigate',
        cta: 'Jump',
        onSelect: () => handleCustomizeRequest('notionIntegration')
      }
    ];

    return [...baseItems, ...toggleItems, ...jumpItems];
  }, [activeWidgetId, config, handleConfigChange, handleCustomizeRequest]);

  const handleInspectorTabChange = useCallback((nextTab) => {
    setInspectorTab(nextTab);
    if (!isDesktop) {
      setIsInspectorOpen(true);
    }
  }, [isDesktop, setInspectorTab, setIsInspectorOpen]);

  const sidebarClassName = isDesktop
    ? 'relative w-72 flex-none'
    : `fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`;

  const inspectorClassName = isDesktop
    ? 'relative w-[360px] flex-none'
    : `fixed inset-y-0 right-0 z-40 w-[360px] max-w-[92vw] transform transition-transform duration-300 ${isInspectorOpen ? 'translate-x-0' : 'translate-x-full'}`;

  return (
    <div className={`h-screen overflow-hidden flex flex-col lg:flex-row font-sans ${builderUi.page}`}>
      {!isDesktop && isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          aria-label="Close widget library"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {!isDesktop && isInspectorOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          aria-label="Close inspector"
          onClick={() => setIsInspectorOpen(false)}
        />
      )}

      <BuilderSidebar
        ui={builderUi}
        isDarkMode={isDarkMode}
        onBack={onBack}
        navFilters={navFilters}
        navFilter={navFilter}
        onNavFilterChange={setNavFilter}
        filterIconMap={filterIconMap}
        widgetSearch={widgetSearch}
        onWidgetSearchChange={setWidgetSearch}
        filteredWidgets={filteredWidgets}
        pinnedWidgetList={pinnedWidgetList}
        unpinnedWidgetList={unpinnedWidgetList}
        showGroupedList={showGroupedList}
        onSelectWidget={handleWidgetChange}
        activeWidgetId={activeWidgetId}
        onTogglePinned={togglePinned}
        className={sidebarClassName}
        showClose={!isDesktop}
        onClose={() => setIsSidebarOpen(false)}
      />

      <PreviewCanvas
        ui={builderUi}
        isDarkMode={isDarkMode}
        activeWidgetLabel={ActiveWidget?.label || 'Widget'}
        onOpenLibrary={() => setIsSidebarOpen(true)}
        onOpenInspector={() => setIsInspectorOpen(true)}
        onExport={() => setShowExport(true)}
        onToggleTheme={toggleColorMode}
        isDesktop={isDesktop}
      >
        <ResizablePreviewPanel
          activeBrandId={activeBrandId}
          config={config}
          activeWidgetId={activeWidgetId}
          debouncedConfig={debouncedConfig}
          handleConfigChange={handleConfigChange}
          brandTheme={brandTheme}
          ActiveWidget={ActiveWidget}
          showExport={showExport}
          setShowExport={setShowExport}
          onCustomizeRequest={handleCustomizeRequest}
          upgradeItems={upgradeItems}
        />
      </PreviewCanvas>

      <BuilderInspector
        ui={builderUi}
        isDarkMode={isDarkMode}
        inspectorTab={inspectorTab}
        onTabChange={handleInspectorTabChange}
        contentRef={configPanelRef}
        className={inspectorClassName}
        showClose={!isDesktop}
        onClose={() => setIsInspectorOpen(false)}
      >
        {inspectorTab === 'configure' && (
          <InspectorConfigureTab
            ui={builderUi}
            isDarkMode={isDarkMode}
            activeWidgetLabel={ActiveWidget?.label || 'Widget'}
            configSearch={configSearch}
            onConfigSearchChange={handleConfigSearchChange}
            sectionOutline={sectionOutline}
            highlightedSection={highlightedSection}
            onSectionSelect={handleCustomizeRequest}
            tabSections={configureSections}
            showTabMenu={showTabMenu}
            setShowTabMenu={setShowTabMenu}
            tabMenuRef={tabMenuRef}
            configSectionNodes={configSectionNodes}
            hasMoreSections={hasMoreSections}
            infiniteScrollRef={infiniteScrollRef}
          />
        )}
        {inspectorTab === 'brand' && (
          <InspectorBrandTab
            ui={builderUi}
            isDarkMode={isDarkMode}
            activeBrandId={activeBrandId}
            hasCustomBrandTheme={hasCustomBrandTheme}
            customBrandLabel={customBrandLabel}
            effectiveBrandTheme={effectiveBrandTheme}
            onBrandChange={handleBrandChange}
            onLaunchBrandGenerator={onLaunchBrandGenerator}
            onLogoColorsExtracted={handleLogoColorsExtracted}
            BrandColorPalette={BrandColorPalette}
            BrandLogoUploader={BrandLogoUploader}
            config={config}
            handleConfigChange={handleConfigChange}
            JAZER_BRAND={JAZER_BRAND}
            activeWidgetId={activeWidgetId}
            onRegisterSectionRef={registerSectionRef}
            minFontSize={MIN_FONT_SIZE}
            maxFontSize={MAX_FONT_SIZE}
          />
        )}
        {inspectorTab === 'flow' && (
          <InspectorFlowTab
            ui={builderUi}
            isDarkMode={isDarkMode}
            upgradeItems={upgradeItems}
            isButtonGenerator={activeWidgetId === 'newButtonGenerator'}
            showAllButtonGeneratorSections={showAllButtonGeneratorSections}
            onToggleGuidedSections={setShowAllButtonGeneratorSections}
          />
        )}
      </BuilderInspector>
    </div>

  );
}


// --- FILE: Main.jsx (Entry Point) ---

export default function App() {
  // Embed mode detection
  const search = useMemo(() => new URLSearchParams(window.location.search), []);
  const isEmbedMode = search.get('embed') === '1';
  const urlWidgetId = search.get('widget');
  const urlConfigStr = search.get('config');

  // State management
  const [view, setView] = useState('landing'); // 'landing' | 'builder' | 'brand-generator'
  const [selectedWidgetId, setSelectedWidgetId] = useState('clock');
  const [globalBrandTheme, setGlobalBrandTheme] = useState(() => loadStoredBrandTheme());
  const [returnView, setReturnView] = useState('landing');
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [searchInputRef, setSearchInputRef] = useState(null);
  const { theme } = useTheme();
  const isDarkMode = Boolean(theme?.isDark);
  const appBackground = isDarkMode ? 'var(--jazer-night-black)' : '#F0F9FF';

  const navigateToBuilder = (id) => {
    setSelectedWidgetId(id);
    setView('builder');
  };

  const navigateToBrandGenerator = () => {
    setReturnView(view);
    setView('brand-generator');
  };

  const navigateToHome = () => {
    setView('landing');
  };

  const handleBrandGeneratorBack = useCallback(() => {
    setView(returnView || 'landing');
  }, [returnView]);

  const handleThemeGenerated = (theme) => {
    setGlobalBrandTheme(theme ? normalizeBrandTheme(theme) : null);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'cmd+k': () => {
      // Quick widget switcher - navigate to widget landing page for now
      // TODO: Implement modal quick switcher in future enhancement
      navigateToHome();
    },
    'cmd+e': () => {
      // Open export - only works in builder view
      // This will be handled by the builder component when in that view
      if (view === 'builder') {
        // Export modal trigger will be passed down to builder component
      }
    },
    'cmd+b': () => {
      navigateToBrandGenerator();
    },
    'cmd+/': () => {
      // Focus search input
      if (searchInputRef) {
        searchInputRef.focus();
      }
    },
    '?': (e) => {
      // Don't trigger in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      setShowShortcutsHelp(true);
    },
    'Escape': () => {
      setShowShortcutsHelp(false);
    }
  }, !isEmbedMode); // Disable shortcuts in embed mode

  // Handle embed mode first (before normal app render)
  if (isEmbedMode && urlWidgetId && WIDGET_REGISTRY[urlWidgetId]) {
    const widgetDef = WIDGET_REGISTRY[urlWidgetId];
    let widgetConfig = widgetDef.defaultConfig || {};

    // Decode config from URL if provided
    if (urlConfigStr) {
      const decoded = decodeConfig(urlConfigStr);
      widgetConfig = decoded || widgetConfig;
    }

    const theme = resolveThemeColors(widgetConfig, false);
    const WidgetComponent = widgetDef.Component;

    return (
      <div style={{
        margin: 0,
        padding: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: theme.bg,
        color: theme.text,
        fontFamily: 'sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <div className="w-full h-full">
          <WidgetComponent config={widgetConfig} brandTheme={widgetConfig.brandThemeSnapshot} />
        </div>
      </div>
    );
  }

  const brandLabel = globalBrandTheme?.presetName || globalBrandTheme?.name || 'Custom Brand Theme';
  const builderThemeKey = globalBrandTheme
    ? `${globalBrandTheme.presetName || globalBrandTheme.name || 'custom'}-${globalBrandTheme.appliedAt || globalBrandTheme.backgroundColor || 'base'}`
    : 'none';

  return (
    <ToastProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@400;700&family=Montserrat:wght@400;600&display=swap');
        ${BRAND_KITS.jazer.extraCSS}
      `}</style>

      <div className="min-h-screen flex flex-col" style={{ backgroundColor: appBackground }}>
        {view !== 'builder' && (
          <GlobalNavigation
            currentView={view}
            onNavigateHome={navigateToHome}
            onNavigateBuilder={() => navigateToBuilder(selectedWidgetId || 'clock')}
            onNavigateBrand={navigateToBrandGenerator}
            onOpenHelp={() => setShowShortcutsHelp(true)}
            selectedWidgetId={selectedWidgetId}
            selectedWidgetLabel={WIDGET_REGISTRY[selectedWidgetId]?.label || ''}
            hasBrandTheme={Boolean(globalBrandTheme)}
            brandLabel={brandLabel}
          />
        )}
        <div className="flex-1 w-full">
          {view === 'landing' ? (
            <WidgetErrorBoundary>
              <WidgetLandingPage 
                onSelect={navigateToBuilder} 
                onBrandGenerator={navigateToBrandGenerator}
                setSearchInputRef={setSearchInputRef}
              />
            </WidgetErrorBoundary>
          ) : view === 'brand-generator' ? (
            <WidgetErrorBoundary>
              <BrandThemeGenerator 
                onBack={handleBrandGeneratorBack} 
                onThemeGenerated={handleThemeGenerated}
              />
            </WidgetErrorBoundary>
          ) : (
            <NotionWidgetBuilder
              key={builderThemeKey}
              initialWidgetId={selectedWidgetId}
              onBack={navigateToHome}
              globalBrandTheme={globalBrandTheme}
              onBrandThemeUpdate={handleThemeGenerated}
              onLaunchBrandGenerator={navigateToBrandGenerator}
            />
          )}
        </div>
        
        {/* Keyboard shortcuts help modal */}
        <KeyboardShortcutsHelp 
          isOpen={showShortcutsHelp} 
          onClose={() => setShowShortcutsHelp(false)} 
        />
      </div>
    </ToastProvider>
  );
}

