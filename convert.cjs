// convert.js
const fs = require('fs');
const path = require('path');
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

// Read the input JSX file (adjust path as needed)
const inputPath = path.resolve(__dirname, 'input.jsx');
const jsxCode = fs.readFileSync(inputPath, 'utf-8');

// Parse JSX code to AST
const ast = babelParser.parse(jsxCode, {
    sourceType: 'module',
    plugins: ['jsx'],
});

// Prepare to collect styles
let styleIndex = 0;
const stylesMap = new Map();

// Helper: convert JS style object keys to CSS property names
function toKebabCase(str) {
    return str.replace(/[A-Z]/g, (match) => '-' + match.toLowerCase());
}

// Traverse AST, find inline style attributes and replace them with classNames
traverse(ast, {
    JSXAttribute(path) {
        if (path.node.name.name === 'style') {
            const styleValue = path.node.value.expression; // object expression

            if (styleValue.type === 'ObjectExpression') {
                // Convert style object to CSS string
                let cssString = '';
                styleValue.properties.forEach((prop) => {
                    const key = prop.key.name || prop.key.value;
                    let value = '';
                    if (prop.value.type === 'StringLiteral') {
                        value = prop.value.value;
                    } else if (prop.value.type === 'NumericLiteral') {
                        value = prop.value.value.toString();
                    } else {
                        value = generate(prop.value).code;
                    }
                    cssString += `${toKebabCase(key)}: ${value};\n`;
                });

                // Deduplicate styles
                let className = null;
                for (const [key, val] of stylesMap.entries()) {
                    if (val === cssString) {
                        className = key;
                        break;
                    }
                }
                if (!className) {
                    className = `style_${styleIndex++}`;
                    stylesMap.set(className, cssString);
                }

                // Replace inline style attribute with className attribute
                path.replaceWithSourceString(`className="${className}"`);
            }
        }
    },
});

// Extract JSX from default export function if present
let returnJSX = null;
traverse(ast, {
    ExportDefaultDeclaration(path) {
        const decl = path.node.declaration;

        if (decl.type === 'FunctionDeclaration') {
            path.traverse({
                ReturnStatement(returnPath) {
                    if (
                        returnPath.node.argument &&
                        (returnPath.node.argument.type === 'JSXElement' ||
                            returnPath.node.argument.type === 'JSXFragment')
                    ) {
                        returnJSX = returnPath.node.argument;
                    }
                },
            });
        } else if (decl.type === 'ArrowFunctionExpression') {
            if (decl.body.type === 'JSXElement' || decl.body.type === 'JSXFragment') {
                returnJSX = decl.body;
            } else if (decl.body.type === 'BlockStatement') {
                decl.body.body.forEach((stmt) => {
                    if (
                        stmt.type === 'ReturnStatement' &&
                        (stmt.argument.type === 'JSXElement' || stmt.argument.type === 'JSXFragment')
                    ) {
                        returnJSX = stmt.argument;
                    }
                });
            }
        }
    },
});

// If no default export function with JSX found, try to extract any JSX from file (handle raw JSX-only input)
if (!returnJSX) {
    traverse(ast, {
        JSXElement(path) {
            // Take the first JSX element found at root level (you can tweak logic here)
            if (!returnJSX) {
                returnJSX = path.node;
            }
        },
    });
}

if (!returnJSX) {
    console.error('Could not find JSX in the input file.');
    process.exit(1);
}

// Generate JSX code only for the returned JSX element
const jsxOnlyCode = generate(returnJSX, { retainLines: true }).code;

// Generate CSS output
const cssLines = [];
for (const [className, cssContent] of stylesMap.entries()) {
    cssLines.push(`.${className} {\n${cssContent}}\n`);
}
const cssOutput = cssLines.join('\n');

const outputDir = path.resolve(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Write CSS file
fs.writeFileSync(path.join(outputDir, 'styles.css'), cssOutput, 'utf-8');

// Wrap JSX in a proper React component function and export default
const componentCode = `import React from 'react';
import './styles.css';

export default function ConvertedComponent() {
  return (
    ${jsxOnlyCode}
  );
}
`;

fs.writeFileSync(path.join(outputDir, 'ConvertedComponent.js'), componentCode, 'utf-8');

// Write App.js to import and render the component
const appJsCode = `import React from 'react';
import ConvertedComponent from './ConvertedComponent';

export default function App() {
  return (
    <div>
      <ConvertedComponent />
    </div>
  );
}
`;

fs.writeFileSync(path.join(outputDir, 'App.js'), appJsCode, 'utf-8');

console.log('Conversion done. Files generated in /output:');
console.log('- styles.css');
console.log('- ConvertedComponent.js');
console.log('- App.js');
