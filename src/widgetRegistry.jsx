/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import {
  Clock, Quote, Timer,
  Image as ImageIcon,
  Hash, Hourglass,
  List as ListIcon,
  CloudSun,
  MousePointerClick
} from 'lucide-react';

import { counterConfig } from './widgets/counter-widget/config';
import { CounterWidget } from './widgets/counter-widget/CounterWidget';
import { generateHTML as generateCounterHTML, generateScript as generateCounterScript } from './widgets/counter-widget/export';

import { imageGalleryConfig } from './widgets/image-gallery-widget/config';
import { ImageGalleryWidget } from './widgets/image-gallery-widget/ImageGalleryWidget';
import { generateHTML as generateImageGalleryHTML, generateScript as generateImageGalleryScript } from './widgets/image-gallery-widget/export';

import { quotesConfig } from './widgets/quotes-widget/config';
import { QuotesWidget } from './widgets/quotes-widget/QuotesWidget';
import { generateHTML as generateQuotesHTML, generateScript as generateQuotesScript } from './widgets/quotes-widget/export';

import { weatherConfig } from './widgets/weather-widget/config';
import { WeatherWidget } from './widgets/weather-widget/WeatherWidget';
import { generateWeatherHTML, generateWeatherScript } from './widgets/weather-widget/export';

import { clockConfig } from './widgets/clock-widget/config';
import { ClockWidget } from './widgets/clock-widget/ClockWidget';
import { generateClockHTML, generateClockScript } from './widgets/clock-widget/export';

import { countdownConfig } from './widgets/countdown-widget/config';
import { CountdownWidget } from './widgets/countdown-widget/CountdownWidget';
import { generateHTML as generateCountdownHTML, generateScript as generateCountdownScript } from './widgets/countdown-widget/export';

import { ButtonGeneratorWidget } from './widgets/new-button-generator-widget/ButtonGeneratorWidget';
import { newButtonGeneratorConfig } from './widgets/new-button-generator-widget/config';
import { generateHTML as generateButtonHTML, generateScript as generateButtonScript } from './widgets/new-button-generator-widget/export';

import { JAZER_BRAND } from './constants';
import { escapeHTML } from './utils/helpers';

export const WIDGET_CATEGORIES = {
  clock: 'Time & Productivity',
  countdown: 'Time & Productivity',
  pomodoro: 'Time & Productivity',
  simpleList: 'Time & Productivity',
  weather: 'Data & Information',
  quotes: 'Data & Information',
  counter: 'Interactive',
  newButtonGenerator: 'Interactive',
  imageGallery: 'Media'
};

export const WIDGET_REGISTRY = {
  clock: {
    ...clockConfig,
    icon: <Clock className="w-4 h-4" />,
    Component: ClockWidget,
    generateHTML: generateClockHTML,
    generateScript: generateClockScript
  },
  weather: {
    ...weatherConfig,
    icon: <CloudSun className="w-4 h-4" />,
    Component: WeatherWidget,
    generateHTML: generateWeatherHTML,
    generateScript: generateWeatherScript
  },
  countdown: {
    ...countdownConfig,
    icon: <Hourglass className="w-4 h-4" />,
    Component: CountdownWidget,
    generateHTML: generateCountdownHTML,
    generateScript: generateCountdownScript
  },
  counter: {
    ...counterConfig,
    icon: <Hash className="w-4 h-4" />,
    Component: CounterWidget,
    generateHTML: generateCounterHTML,
    generateScript: generateCounterScript
  },
  imageGallery: {
    ...imageGalleryConfig,
    icon: <ImageIcon className="w-4 h-4" />,
    Component: ImageGalleryWidget,
    generateHTML: generateImageGalleryHTML,
    generateScript: generateImageGalleryScript
  },
  newButtonGenerator: {
    ...newButtonGeneratorConfig,
    icon: <MousePointerClick className="w-4 h-4" />,
    Component: ButtonGeneratorWidget,
    generateHTML: generateButtonHTML,
    generateScript: generateButtonScript
  },
  quotes: {
    ...quotesConfig,
    icon: <Quote className="w-4 h-4" />,
    Component: QuotesWidget,
    generateHTML: generateQuotesHTML,
    generateScript: generateQuotesScript
  },
  simpleList: {
    id: 'simpleList',
    label: 'List',
    icon: <ListIcon className="w-4 h-4" />,
    defaultConfig: { title: 'To Do', items: 'Task 1\nTask 2', accentColor: JAZER_BRAND.colors.cosmicBlue, textColor: JAZER_BRAND.colors.graphite, bgColor: JAZER_BRAND.colors.stardustWhite },
    fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'items', label: 'Items', type: 'textarea' }, { name: 'accentColor', label: 'Accent', type: 'color' }],
    Component: ({ config }) => {
      const items = (config.items || '').split('\n').filter(Boolean);
      return (
        <div className="h-full w-full p-6 overflow-y-auto" style={{ background: config.bgColor, color: config.textColor }}>
          <h3 className="font-bold mb-4 pb-2 border-b-2 text-lg" style={{ borderColor: config.accentColor }}>{config.title}</h3>
          <ul className="space-y-2">
            {items.map((it, i) => (
              <li key={i} className="flex gap-2 items-center">
                <div className="w-4 h-4 border rounded" style={{ borderColor: config.accentColor }}></div>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    },
    generateHTML: (config) => `
      <div style="padding:24px; height:100%; overflow-y:auto; background:${config.bgColor}; color:${config.textColor};">
        <h3 style="font-weight:bold; margin-bottom:16px; padding-bottom:8px; border-bottom:2px solid ${config.accentColor};">${escapeHTML(config.title)}</h3>
        <ul style="list-style:none; padding:0; margin:0;">
          ${(config.items || '').split('\n').filter(Boolean).map(i => `<li style="display:flex; gap:12px; margin-bottom:8px; cursor:pointer; align-items:center;" onclick="this.style.opacity = this.style.opacity === '0.5' ? '1' : '0.5'"><div style="width:16px; height:16px; border:2px solid ${config.accentColor}; border-radius:4px;"></div><span>${escapeHTML(i)}</span></li>`).join('')}
        </ul>
      </div>
    `,
    generateScript: () => ``
  },
  pomodoro: {
    id: 'pomodoro',
    label: 'Pomodoro',
    icon: <Timer className="w-4 h-4" />,
    defaultConfig: { workTime: 25, breakTime: 5, accentColor: JAZER_BRAND.colors.neonPink, textColor: JAZER_BRAND.colors.graphite, bgColor: JAZER_BRAND.colors.stardustWhite },
    fields: [{ name: 'workTime', label: 'Work', type: 'number' }, { name: 'breakTime', label: 'Break', type: 'number' }, { name: 'accentColor', label: 'Color', type: 'color' }],
    Component: ({ config }) => {
      const workMinutes = Math.max(1, parseInt(config.workTime, 10) || 25);
      const breakMinutes = Math.max(1, parseInt(config.breakTime, 10) || 5);
      const workSeconds = workMinutes * 60;
      const breakSeconds = breakMinutes * 60;
      const [remaining, setRemaining] = useState(workSeconds);
      const [isRunning, setIsRunning] = useState(false);
      const [isWorkPhase, setIsWorkPhase] = useState(true);
      const phaseRef = useRef(isWorkPhase);

      useEffect(() => {
        phaseRef.current = isWorkPhase;
      }, [isWorkPhase]);

      useEffect(() => {
        setIsRunning(false);
        setIsWorkPhase(true);
        phaseRef.current = true;
        setRemaining(workSeconds);
      }, [workSeconds, breakSeconds]);

      useEffect(() => {
        if (!isRunning) return undefined;
        const interval = setInterval(() => {
          setRemaining((prev) => {
            if (prev > 1) {
              return prev - 1;
            }
            const nextPhaseIsWork = !phaseRef.current;
            phaseRef.current = nextPhaseIsWork;
            setIsWorkPhase(nextPhaseIsWork);
            return nextPhaseIsWork ? workSeconds : breakSeconds;
          });
        }, 1000);
        return () => clearInterval(interval);
      }, [isRunning, workSeconds, breakSeconds]);

      const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
      };

      const toggleTimer = () => {
        setIsRunning((prev) => !prev);
      };

      const resetTimer = () => {
        setIsRunning(false);
        setIsWorkPhase(true);
        phaseRef.current = true;
        setRemaining(workSeconds);
      };

      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center" style={{ background: config.bgColor, color: config.textColor }}>
          <div className="text-sm font-semibold uppercase tracking-widest" style={{ color: config.accentColor }}>
            {isWorkPhase ? 'Work' : 'Break'} Session
          </div>
          <div className="text-5xl font-bold tabular-nums">{formatTime(remaining)}</div>
          <div className="flex gap-3">
            <button
              className="px-6 py-2 rounded-full text-white font-semibold"
              style={{ background: config.accentColor }}
              onClick={toggleTimer}
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              className="px-6 py-2 rounded-full border font-semibold"
              style={{ borderColor: config.accentColor, color: config.accentColor }}
              onClick={resetTimer}
            >
              Reset
            </button>
          </div>
        </div>
      );
    },
    generateHTML: (config) => `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:16px; text-align:center;">
        <div id="phase" style="font-size:14px; font-weight:600; text-transform:uppercase; letter-spacing:0.2em; color:${config.accentColor};">Work Session</div>
        <div id="timer" style="font-size:48px; font-weight:bold; margin-bottom:8px; font-family:'Courier New', monospace;">${String(config.workTime).padStart(2, '0')}:00</div>
        <div style="display:flex; gap:12px;">
          <button onclick="togglePomodoro()" id="btn" style="background:${config.accentColor}; color:white; border:none; padding:10px 24px; border-radius:999px; font-weight:bold; cursor:pointer;">Start</button>
          <button onclick="resetPomodoro()" style="background:transparent; color:${config.accentColor}; border:2px solid ${config.accentColor}; padding:10px 24px; border-radius:999px; font-weight:bold; cursor:pointer;">Reset</button>
        </div>
      </div>
    `,
    generateScript: (config) => `
      (function() {
        const workMinutes = Math.max(1, parseInt(${JSON.stringify(config.workTime)}, 10) || 25);
        const breakMinutes = Math.max(1, parseInt(${JSON.stringify(config.breakTime)}, 10) || 5);
        const workSeconds = workMinutes * 60;
        const breakSeconds = breakMinutes * 60;
        let remaining = workSeconds;
        let isRunning = false;
        let isWorkPhase = true;
        let timerId = null;
        const timerEl = document.getElementById('timer');
        const phaseEl = document.getElementById('phase');
        const btn = document.getElementById('btn');

        function format(seconds) {
          const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
          const secs = (seconds % 60).toString().padStart(2, '0');
          return mins + ':' + secs;
        }

        function updateDisplay() {
          timerEl.textContent = format(remaining);
          phaseEl.textContent = (isWorkPhase ? 'Work' : 'Break') + ' Session';
        }

        function switchPhase() {
          isWorkPhase = !isWorkPhase;
          remaining = isWorkPhase ? workSeconds : breakSeconds;
          updateDisplay();
        }

        function tick() {
          if (remaining > 0) {
            remaining -= 1;
            updateDisplay();
          } else {
            switchPhase();
          }
        }

        window.togglePomodoro = function togglePomodoro() {
          isRunning = !isRunning;
          btn.textContent = isRunning ? 'Pause' : 'Start';
          if (isRunning) {
            timerId = setInterval(tick, 1000);
          } else if (timerId) {
            clearInterval(timerId);
            timerId = null;
          }
        };

        window.resetPomodoro = function resetPomodoro() {
          if (timerId) {
            clearInterval(timerId);
            timerId = null;
          }
          isRunning = false;
          isWorkPhase = true;
          remaining = workSeconds;
          btn.textContent = 'Start';
          updateDisplay();
        };

        updateDisplay();
      })();
    `
  },
};
