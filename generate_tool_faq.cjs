const fs = require('fs');

const appContent = fs.readFileSync('src/App.jsx', 'utf8');
const toolsMatch = appContent.match(/export const TOOLS = (\[[\s\S]*?\]);/);
if (!toolsMatch) {
  console.error("Could not find TOOLS array.");
  process.exit(1);
}

const rawToolsStr = toolsMatch[1];
const tools = [];
const regex = /{[\s\S]*?id:\s*'([^']+)'[\s\S]*?name:\s*'([^']+)'[\s\S]*?desc:\s*'((?:[^'\\]|\\.)*)'/g;

let match;
while ((match = regex.exec(rawToolsStr)) !== null) {
  tools.push({ id: match[1], name: match[2], desc: match[3] });
}

console.log(`Found ${tools.length} tools.`);

const faqs = {};

tools.forEach(tool => {
  // Use generic templates based on the tool name to generate naturally varying text
  const step1 = tool.name.toLowerCase().includes('json') ? 'Paste your data in the input panel'
    : tool.name.toLowerCase().includes('image') ? 'Upload or drop your image into the dropzone'
    : tool.name.toLowerCase().includes('pdf') ? 'Select the PDF file from your device'
    : tool.name.toLowerCase().includes('css') || tool.name.toLowerCase().includes('html') ? 'Enter your code in the editor'
    : 'Enter your input in the designated field';

  const actionVerb = tool.name.toLowerCase().includes('format') ? 'Format'
    : tool.name.toLowerCase().includes('encode') || tool.name.toLowerCase().includes('decode') ? 'Convert'
    : tool.name.toLowerCase().includes('compress') ? 'Compress'
    : tool.name.toLowerCase().includes('generate') ? 'Generate'
    : 'Process';

  const step2 = `Click the "${actionVerb}" button`;
  
  const step3 = tool.name.toLowerCase().includes('image') || tool.name.toLowerCase().includes('pdf') ? 'Download the processed file instantly'
    : 'Copy the result with a single click';

  const useCase = tool.name.toLowerCase().includes('json') ? `debugging API responses or cleaning up configuration files`
    : tool.name.toLowerCase().includes('base64') ? `safely encoding data strings or embedding assets`
    : tool.name.toLowerCase().includes('css') ? `optimizing stylesheets for production`
    : tool.name.toLowerCase().includes('image') ? `reducing file sizes for faster website loading`
    : tool.name.toLowerCase().includes('pdf') ? `managing documents securely without uploading them`
    : `completing repetitive developer tasks quickly`;

  // We are creating a string that contains the markdown.
  const content = `## How to Use ${tool.name} Online

${tool.name} is a free online tool to ${tool.desc.toLowerCase().replace(/\.$/, '')} instantly in your browser. No signup required, and no data is sent to any server.

How to use:
1. ${step1}
2. ${step2}
3. ${step3}

Use it when you are ${useCase}.

Works 100% in browser — your data never leaves your machine.`;

  faqs[tool.id] = content;
});

fs.writeFileSync('src/data/toolHowTo.json', JSON.stringify(faqs, null, 2));
console.log('Saved to src/data/toolHowTo.json');
