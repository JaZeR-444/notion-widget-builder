import { MousePointerClick } from 'lucide-react';
import { jazerNeonTheme } from '../../theme/jazerNeonTheme'; // Import jazerNeonTheme

const initialButton = {
  id: 'initial',
  label: 'Button',
  icon: '✨',
  hideIcon: false,
  url: 'https://indify.co',
  bgColor: '#8B5CF6', // Electric Purple
  bgOpacity: 100,
  outlineColor: '#8B5CF6',
  textColor: '#F8F9FF', // Stardust White
  enableHoverHighlight: true,
  hoverBgColor: '#A78BFA', // Ultraviolet
  hoverTextColor: '#F8F9FF',
  size: 'medium',
  rounding: 'round',
};

export const newButtonGeneratorConfig = {
  id: 'newButtonGenerator',
  label: 'Button Generator',
  icon: 'MousePointerClick',
  description: 'Create customizable buttons with advanced styling and actions.',

  defaultConfig: {
    buttons: [initialButton],
    layout: 'horizontal', // 'horizontal', 'vertical', 'full-width'
    alignment: 'center',  // 'left', 'center', 'right', 'space-evenly'
    useTransparentBackground: false,
    setBackgroundColor: true,
    backgroundColor: jazerNeonTheme.colors.stardustWhite, // Default widget background
    appearanceMode: 'system', // 'none', 'system', 'light', 'dark'
    showHoverMenu: true,
    showCustomizeButton: true,
  },

  fields: [
    // Global Widget Settings
    { name: 'useTransparentBackground', label: 'Transparent Widget Background', type: 'boolean', section: 'global' },
    { name: 'setBackgroundColor', label: 'Set Widget Background Color', type: 'boolean', section: 'global' },
    { name: 'backgroundColor', label: 'Widget Background Color', type: 'color', section: 'global' },
    {
      name: 'appearanceMode', label: 'Dark/Light Appearance', type: 'select', section: 'global', options: [
        { label: 'Do Nothing', value: 'none' },
        { label: 'Use System Setting', value: 'system' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' }
      ]
    },
    { name: 'showHoverMenu', label: 'Show Hover Menu', type: 'boolean', section: 'global' },
    { name: 'showCustomizeButton', label: 'Show Customize Button', type: 'boolean', section: 'global' },

    // Button Layout
    {
      name: 'layout', label: 'Button Layout', type: 'select', section: 'layout', options: [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
        { label: 'Full Width', value: 'full-width' }
      ]
    },
    {
      name: 'alignment', label: 'Button Alignment', type: 'select', section: 'layout', options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
        { label: 'Space Evenly', value: 'space-evenly' }
      ]
    },

    // Note: Individual button fields are handled dynamically within the Component
  ],
};
