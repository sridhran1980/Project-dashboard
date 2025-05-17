// convert.cjs
const fs = require('fs');
const path = require('path');

// Configuration options
const config = {
    baseStyles: {
        enabled: true,
        styles: {
            '*': {
                margin: '0',
                padding: '0',
                boxSizing: 'border-box',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
            },
            'html, body, #root': {
                width: '100%',
                height: '100%',
                margin: '0',
                padding: '0',
                position: 'relative',
                lineHeight: '1.5',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
            }
        }
    },
    rootContainer: {
        enabled: true,
        styles: {
            minHeight: '100vh',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
        }
    },
    fonts: {
        googleFonts: {
            enabled: true,
            weights: ['400', '500', '600'],
            display: 'swap',
            preload: true
        },
        localFonts: {
            enabled: false,
            fonts: []
        }
    },
    mediaQueries: {
        enabled: true,
        breakpoints: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px'
        }
    },
    cssVariables: {
        enabled: true,
        prefix: '--app',
        colors: {
            primary: '#000000',
            secondary: '#ffffff'
        },
        spacing: {
            base: '4px',
            container: '1200px'
        }
    },
    transforms: {
        enabled: true,
        support3D: true,
        supportPerspective: true
    },
    animations: {
        enabled: true,
        defaultDuration: '300ms',
        defaultTiming: 'ease-in-out'
    }
};

// Get input filename from command line args
const inputFilename = process.argv[2] || 'minimal.jsx';
const inputFilePath = path.join(__dirname, inputFilename);

if (!fs.existsSync(inputFilePath)) {
    console.error(`Input file "${inputFilename}" not found.`);
    process.exit(1);
}

const inputJSX = fs.readFileSync(inputFilePath, 'utf-8');

// Utility to convert camelCase JS style keys to kebab-case CSS keys
function toKebabCase(str) {
    return str.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
}

// Extract font families from the input JSX
function extractFontFamilies(jsx) {
    const fontFamilyRegex = /fontFamily:\s*['"]([^'"]+)['"]/g;
    const fonts = new Set();
    let match;
    while ((match = fontFamilyRegex.exec(jsx)) !== null) {
        fonts.add(match[1]);
    }
    return Array.from(fonts);
}

// Enhanced font import generation
function generateFontImport(fonts) {
    if (fonts.length === 0) return '';

    let cssOutput = '';

    // Google Fonts
    if (config.fonts.googleFonts.enabled) {
        const fontFamilies = fonts.map(font => {
            return font.replace(/\s+/g, '+');
        }).join('&family=');

        cssOutput += `@import url('https://fonts.googleapis.com/css2?family=${fontFamilies}:wght@${config.fonts.googleFonts.weights.join(';')}&display=${config.fonts.googleFonts.display}');\n\n`;
    }

    // Local Fonts
    if (config.fonts.localFonts.enabled) {
        config.fonts.localFonts.fonts.forEach(font => {
            cssOutput += `@font-face {\n`;
            cssOutput += `  font-family: '${font.family}';\n`;
            cssOutput += `  src: ${font.src};\n`;
            cssOutput += `  font-weight: ${font.weight};\n`;
            cssOutput += `  font-style: ${font.style || 'normal'};\n`;
            cssOutput += `  font-display: ${font.display || 'swap'};\n`;
            cssOutput += `}\n\n`;
        });
    }

    return cssOutput;
}

// Generate CSS variables
function generateCSSVariables() {
    if (!config.cssVariables.enabled) return '';

    let cssOutput = `:root {\n`;

    // Colors
    Object.entries(config.cssVariables.colors).forEach(([name, value]) => {
        cssOutput += `  ${config.cssVariables.prefix}-color-${name}: ${value};\n`;
    });

    // Spacing
    Object.entries(config.cssVariables.spacing).forEach(([name, value]) => {
        cssOutput += `  ${config.cssVariables.prefix}-spacing-${name}: ${value};\n`;
    });

    cssOutput += `}\n\n`;
    return cssOutput;
}

// Generate media queries
function generateMediaQueries() {
    if (!config.mediaQueries.enabled) return '';

    let cssOutput = '';
    Object.entries(config.mediaQueries.breakpoints).forEach(([name, value]) => {
        cssOutput += `@media (min-width: ${value}) {\n`;
        cssOutput += `  .container {\n`;
        cssOutput += `    max-width: ${value};\n`;
        cssOutput += `  }\n`;
        cssOutput += `}\n\n`;
    });
    return cssOutput;
}

// Parse JSX and extract inline styles, convert to classNames

// We'll use a simple regex-based approach for this prototype.
// It matches style={{ ... }} objects, extracts style props, and replaces with className.

// This is a basic approach and assumes styles are simple objects without nested or dynamic values.

let styleCount = 0;
const stylesMap = new Map();

function parseStyleObject(styleStr) {
    const styles = {};
    // Split by comma, but not inside rgba() or other function calls
    const props = styleStr.split(/,(?![^{}]*})(?![^(]*\))/).map(s => s.trim()).filter(Boolean);

    props.forEach(prop => {
        const colonIndex = prop.indexOf(':');
        if (colonIndex === -1) return;
        let key = prop.slice(0, colonIndex).trim();
        let value = prop.slice(colonIndex + 1).trim();

        // Remove quotes from value if any
        value = value.replace(/^["']|["']$/g, '');

        // Convert camelCase key to kebab-case
        const cssKey = toKebabCase(key);

        // Special handling for box-shadow
        if (cssKey === 'box-shadow') {
            // Keep the value exactly as is since it's already properly formatted
            styles[cssKey] = value;
        } else {
            // Add units to numeric values where appropriate
            if (!isNaN(value) && value !== '') {
                if (['width', 'height', 'top', 'left', 'right', 'bottom', 'padding', 'padding-top',
                    'padding-bottom', 'padding-left', 'padding-right', 'margin', 'margin-top',
                    'margin-bottom', 'margin-left', 'margin-right', 'gap', 'border-radius'].includes(cssKey)) {
                    value = `${value}px`;
                } else if (['font-size'].includes(cssKey)) {
                    value = `${value}px`;
                }
            }
            styles[cssKey] = value;
        }
    });

    return styles;
}

function styleObjToCss(styles) {
    return Object.entries(styles)
        .map(([k, v]) => `${k}: ${v}`)
        .join(';\n  ');
}

// Regex to find all occurrences of style={{ ... }}
const styleRegex = /style=\{\{([^}]+)\}\}/g;

let cssOutput = '';
let jsxOutput = inputJSX;

// First, let's clean up any existing component declarations in the input
jsxOutput = jsxOutput.replace(/export\s+default\s+function\s+\w+\s*\([^)]*\)\s*{/g, '');
jsxOutput = jsxOutput.replace(/import\s+.*?;?\n?/g, '');
jsxOutput = jsxOutput.replace(/return\s*\(/g, '');
jsxOutput = jsxOutput.replace(/\)\s*;?\s*}/g, '');
jsxOutput = jsxOutput.replace(/\/\/.*$/gm, ''); // Remove single-line comments
jsxOutput = jsxOutput.replace(/^\s*[\r\n]/gm, ''); // Remove empty lines

jsxOutput = jsxOutput.replace(styleRegex, (match, styleContent) => {
    // styleContent is the string inside {{ ... }}
    const stylesObj = parseStyleObject(styleContent);

    // Check if we already have this style
    let existingClass = null;
    for (const [className, styleObj] of stylesMap.entries()) {
        // Simple shallow compare:
        if (JSON.stringify(styleObj) === JSON.stringify(stylesObj)) {
            existingClass = className;
            break;
        }
    }

    if (!existingClass) {
        const className = `style_${styleCount++}`;
        stylesMap.set(className, stylesObj);
        existingClass = className;
    }

    return `className="${existingClass}"`;
});

// Extract font families from input
const fonts = extractFontFamilies(inputJSX);

// Generate CSS file content
cssOutput = generateFontImport(fonts);
cssOutput += generateCSSVariables();
cssOutput += generateMediaQueries();

// Add base styles if enabled
if (config.baseStyles.enabled) {
    for (const [selector, styles] of Object.entries(config.baseStyles.styles)) {
        const cssRules = Object.entries(styles)
            .map(([k, v]) => `${toKebabCase(k)}: ${v}`)
            .join(';\n  ');
        cssOutput += `${selector} {\n  ${cssRules};\n}\n\n`;
    }
}

// Add root container styles if enabled
if (config.rootContainer.enabled) {
    const cssRules = Object.entries(config.rootContainer.styles)
        .map(([k, v]) => `${toKebabCase(k)}: ${v}`)
        .join(';\n  ');
    cssOutput += `.style_0 {\n  ${cssRules};\n}\n\n`;
}

for (const [className, styleObj] of stylesMap.entries()) {
    // Handle flex display
    if (styleObj.display === 'inline-flex') {
        styleObj.display = 'flex';
    }

    // Handle absolute positioning
    if (styleObj.position === 'absolute') {
        // Convert left/top to percentage if they're large numbers
        if (styleObj.left && parseInt(styleObj.left) > 100) {
            styleObj.left = '50%';
            styleObj.transform = 'translateX(-50%)';
        }
        if (styleObj.top && parseInt(styleObj.top) > 100) {
            styleObj.top = '50%';
            styleObj.transform = styleObj.transform ?
                styleObj.transform + ' translateY(-50%)' :
                'translateY(-50%)';
        }
    }

    const cssRules = styleObjToCss(styleObj);
    cssOutput += `.${className} {\n  ${cssRules};\n}\n\n`;
}

// Write CSS output file
fs.writeFileSync(path.join(__dirname, 'styles.css'), cssOutput, 'utf-8');

// Prepare ConvertedComponent.jsx content
const componentContent = `import React from 'react';
import './styles.css';

export default function ConvertedComponent() {
  return (
${jsxOutput.trim()}
  );
}
`;

// Write ConvertedComponent.jsx
fs.writeFileSync(path.join(__dirname, 'ConvertedComponent.jsx'), componentContent, 'utf-8');

// Prepare App.js content
const appContent = `import React from 'react';
import ConvertedComponent from './ConvertedComponent';

export default function App() {
  return <ConvertedComponent />;
}
`;

// Write App.js
fs.writeFileSync(path.join(__dirname, 'App.js'), appContent, 'utf-8');

console.log('Conversion complete!');
console.log('Generated files in current directory:');
console.log('- styles.css');
console.log('- ConvertedComponent.jsx');
console.log('- App.js');


