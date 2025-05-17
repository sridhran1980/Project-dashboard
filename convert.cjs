const fs = require('fs');
const path = require('path');

const inputJSXPath = path.join(__dirname, 'input.jsx'); // Your Figma JSX input
const outputJSXPath = path.join(__dirname, 'ConvertedComponent.jsx');
const outputCSSPath = path.join(__dirname, 'styles.css');

const cssRaw = `
.style_0 {
width: 100%;
height: 100vh;
position: relative;
background: #FFF4F8;
overflow: hidden;
}

.style_1 {
width: 1440px;
padding-top: 40px;
padding-bottom: 24px;
padding-left: 64px;
padding-right: 64px;
left: 288px;
top: 120px;
position: absolute;
justify-content: flex-start;
align-items: flex-start;
display: inline-flex;
flex-direction: column;
gap: 10px;
}

.style_2 {
width: 1171px;
justify-content: flex-start;
align-items: center;
display: flex;
gap: 10px;
}

.style_3 {
color: #2C2C2C;
font-size: 32px;
font-family: Poppins;
font-weight: 600;
word-wrap: break-word;
}

.style_4 {
width: 1440px;
padding-top: 24px;
padding-bottom: 32px;
left: 288px;
top: 232px;
position: absolute;
flex-direction: column;
justify-content: flex-start;
align-items: flex-start;
gap: 36px;
display: inline-flex;
}

.style_5 {
width: 1440px;
padding-left: 64px;
padding-right: 64px;
justify-content: flex-start;
align-items: center;
gap: 51px;
display: inline-flex;
}

.style_6 {
width: 403px;
padding-top: 32px;
padding-bottom: 32px;
padding-left: 32px;
padding-right: 32px;
background: white;
box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.25);
border-radius: 16px;
flex-direction: column;
justify-content: flex-start;
align-items: flex-start;
gap: 24px;
display: inline-flex;
}

.style_7 {
align-self: stretch;
flex-direction: column;
justify-content: center;
align-items: center;
gap: 16px;
display: flex;
}

.style_8 {
align-self: stretch;
flex-direction: column;
justify-content: flex-start;
align-items: center;
gap: 12px;
display: flex;
}

.style_9 {
align-self: stretch;
justify-content: center;
align-items: center;
gap: 10px;
display: inline-flex;
}

.style_10 {
color: #423D3D;
font-size: 24px;
font-family: Poppins;
font-weight: 600;
word-wrap: break-word;
}

.style_11 {
color: #8377F7;
font-size: 16px;
font-family: Poppins;
font-weight: 500;
word-wrap: break-word;
}
`;

// Hardcoding the JSX output for now — you can extend this later to parse inputJSX dynamically
const jsxOutput = `
import React from 'react';
import './styles.css';

export default function ConvertedComponent() {
  return (
    <div className="style_0">
      <div className="style_1">
        <div className="style_2">
          <div className="style_3">Overview</div>
        </div>
      </div>

      <div className="style_4">
        <div className="style_5">
          <div className="style_6">
            <div className="style_7">
              <div className="style_8">
                <div className="style_9">
                  <div className="style_10">Batch Files Count</div>
                </div>
              </div>
              <div className="style_11">
                The number of batch files processed today
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

// Write CSS file
fs.writeFileSync(outputCSSPath, cssRaw.trim(), 'utf-8');
// Write React component JSX file
fs.writeFileSync(outputJSXPath, jsxOutput.trim(), 'utf-8');

console.log('Conversion complete. Files generated:');
console.log('- styles.css');
console.log('- ConvertedComponent.jsx');
