const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src/App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

const seoData = {
  'json-formatter': { title: 'JSON Formatter & Validator Online Free | ZeroApiTools' },
  'base64': { title: 'Base64 Encoder Decoder Online Free | ZeroApiTools' },
  'jwt-decoder': { title: 'JWT Token Decoder Online — Read JWT Payload Free | ZeroApiTools' },
  'regex-tester': { title: 'Regex Tester Online — Test Regular Expressions Free | ZeroApiTools' },
  'markdown-preview': { title: 'Markdown Preview Online — Live Editor Free | ZeroApiTools' },
  'sql-formatter': { title: 'SQL Formatter & Beautifier Online Free | ZeroApiTools' },
  'curl-to-fetch': { title: 'cURL to Fetch Converter Online Free | ZeroApiTools' },
  'chmod-calc': { title: 'Chmod Calculator Online — Linux Permissions Free | ZeroApiTools' },
  'cron-parser': { title: 'Cron Expression Parser & Tester Online Free | ZeroApiTools' },
  'css-specificity': { title: 'CSS Specificity Calculator Online Free | ZeroApiTools' },
  'gradient': { title: 'CSS Gradient Generator Online Free | ZeroApiTools' },
  'flexbox': { title: 'CSS Flexbox Generator Online Free | ZeroApiTools' },
  'css-grid': { title: 'CSS Grid Generator Online Free | ZeroApiTools' },
  'box-shadow': { title: 'CSS Box Shadow Generator Online Free | ZeroApiTools' },
  'color-converter': { title: 'Color Picker & Converter Online Free | ZeroApiTools' },
  'image-compress': { title: 'Image Compressor Online Free — No Upload | ZeroApiTools' },
  'image-resize': { title: 'Image Resizer Online Free — No Upload | ZeroApiTools' },
  'qr-code': { title: 'QR Code Generator Online Free | ZeroApiTools' },
  'url-encode': { title: 'URL Encoder Decoder Online Free | ZeroApiTools' },
  'hash-gen': { title: 'MD5 SHA256 Hash Generator Online Free | ZeroApiTools' },
  'password-gen': { title: 'Strong Password Generator Online Free | ZeroApiTools' },
  'uuid': { title: 'UUID Generator Online Free | ZeroApiTools' },
  'lorem-ipsum': { title: 'Lorem Ipsum Generator Online Free | ZeroApiTools' },
  'word-counter': { title: 'Word Counter & Character Counter Online Free | ZeroApiTools' },
  'case-converter': { title: 'Text Case Converter Online Free | ZeroApiTools' },
  'ascii-art': { title: 'ASCII Art Generator Online Free | ZeroApiTools' },
  'privacy-policy': { title: 'Privacy Policy Generator Online Free | ZeroApiTools' },
  'gst-calc': { title: 'GST Calculator Online India Free | ZeroApiTools' },
  'sip-calc': { title: 'SIP Calculator Online India Free | ZeroApiTools' },
  'age-calc': { title: 'Age Calculator Online Free | ZeroApiTools' },
  'emi-calc': { title: 'EMI Loan Calculator Online India Free | ZeroApiTools' },
  'percentage-calc': { title: 'Percentage Calculator Online Free | ZeroApiTools' },
  'currency-conv': { title: 'Currency Converter Online Free — Live Rates | ZeroApiTools' },
  'json-schema': { title: 'JSON Schema Generator Online Free | ZeroApiTools' },
};

// Replace tools in the array
const regex = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*desc:\s*'([^']+)',([^}]+)\}/g;

content = content.replace(regex, (match, id, name, desc, rest) => {
  let title = seoData[id]?.title || `${name} Online Free | ZeroApiTools`;
  
  // Format description
  // Remove trailing period from original desc
  let cleanDesc = desc.replace(/\.$/, '');
  let newDesc = `${cleanDesc}. Free online tool, no signup required, works in browser. | ZeroApiTools`;
  
  // Add seoTitle and seoDesc
  // Check if they already exist to avoid duplicates
  if (rest.includes('seoTitle:')) return match;
  
  return `{ id: '${id}', name: '${name}', desc: '${desc}', seoTitle: '${title.replace(/'/g, "\\'")}', seoDesc: '${newDesc.replace(/'/g, "\\'")}',${rest}}`;
});

// Replace document.title logic
content = content.replace(
  /document\.title = `\$\{tool\.name\} - ZeroApiTools \| Free Developer Tools`;/g,
  `document.title = tool.seoTitle || \`\${tool.name} - ZeroApiTools | Free Developer Tools\`;`
);

// Replace meta description logic
content = content.replace(
  /if \(metaDesc\) metaDesc\.content = tool\.desc;/g,
  `if (metaDesc) metaDesc.content = tool.seoDesc || tool.desc;`
);

// Replace H1 logic
content = content.replace(
  /<h1 className="tool-title">\{activeTool\.icon\} \{activeTool\.name\}<\/h1>/g,
  `<h1 className="tool-title">{activeTool.icon} {activeTool.seoTitle ? activeTool.seoTitle.split(' | ')[0] : activeTool.name}</h1>`
);

fs.writeFileSync(appPath, content, 'utf8');
console.log('App.jsx updated successfully.');
