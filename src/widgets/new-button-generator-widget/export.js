import { jazerNeonTheme } from '../../theme/jazerNeonTheme'; // Import jazerNeonTheme

const escapeHTML = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>'"]/,
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag]));
};

export const generateHTML = (config) => {
  const widgetBg = config.useTransparentBackground ? 'transparent' : config.backgroundColor;

  const getButtonStyle = (button) => {
    const borderRadius = button.rounding === 'none' ? '0px' :
      button.rounding === 'slight' ? '8px' : '9999px';
    const sizePadding = button.size === 'small' ? '8px 16px' :
      button.size === 'large' ? '16px 32px' : '12px 24px';
    const fontSize = button.size === 'small' ? '0.875rem' :
      button.size === 'large' ? '1.25rem' : '1rem';
    const outlineWidth = button.outlineColor === 'transparent' ? '0px' : '1px';

    let buttonCss = `
          background-color: ${button.bgColor}${button.bgOpacity < 100 ? Math.round(255 * (button.bgOpacity / 100)).toString(16).padStart(2, '0') : ''};
          color: ${button.textColor};
          border: ${outlineWidth} solid ${button.outlineColor};
          border-radius: ${borderRadius};
          padding: ${sizePadding};
          font-size: ${fontSize};
          font-family: inherit; // Use inherited font, can be configured later
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          cursor: pointer;
          flex-shrink: 0; // Prevent shrinking in horizontal layout
          width: ${config.layout === 'full-width' ? '100%' : 'auto'};
          text-align: center;
          box-shadow: 0 0 ${jazerNeonTheme.effects.glowBlur} rgba(0,0,0,0.2);
          transition: all 0.2s ease-in-out;
      `;

    if (button.enableHoverHighlight) {
      buttonCss += `
          &:hover {
              background-color: ${button.hoverBgColor};
              color: ${button.hoverTextColor};
          }
        `;
    }
    return buttonCss;
  };

  const containerStyle = `
      display: flex;
      gap: 16px;
      flex-wrap: ${config.layout === 'vertical' ? 'nowrap' : 'wrap'};
      flex-direction: ${config.layout === 'vertical' ? 'column' : 'row'};
      justify-content: ${config.alignment === 'space-evenly' ? 'space-evenly' :
      config.alignment === 'center' ? 'center' :
        config.alignment === 'left' ? 'flex-start' : 'flex-end'};
      width: ${config.layout === 'full-width' ? '100%' : 'auto'};
      height: 100%;
      align-items: ${config.layout === 'full-width' && config.alignment === 'center' ? 'center' :
      config.layout === 'full-width' && config.alignment === 'left' ? 'flex-start' :
        config.layout === 'full-width' && config.alignment === 'right' ? 'flex-end' :
          'initial'}; /* Adjusted for full-width alignment */
  `;

  return `
    <div style="
      display: flex; 
      align-items: center; 
      justify-content: center; 
      height: 100vh; 
      width: 100vw; 
      background: ${widgetBg};
      padding: 16px;
      box-sizing: border-box;
    ">
      <div style="${containerStyle}">
        ${config.buttons.map(button => `
          <a href="${escapeHTML(button.url)}" target="_blank" rel="noopener noreferrer" 
             style="${getButtonStyle(button)}"
             class="generated-button"
          >
            ${!button.hideIcon ? escapeHTML(button.icon) : ''}
            <span>${escapeHTML(button.label)}</span>
          </a>
        `).join('')}
      </div>
      <style>
        .generated-button:hover {
            background-color: var(--hover-bg);
            color: var(--hover-text);
        }
      </style>
    </div>
  `;
};

export const generateScript = () => {
  // For simplicity, no specific dynamic script needed beyond HTML for static buttons
  return '';
};
