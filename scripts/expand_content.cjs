const fs = require('fs');
const path = require('path');

const appFile = fs.readFileSync(path.join(__dirname, '../src/App.jsx'), 'utf-8');
const toolHowToFile = path.join(__dirname, '../src/data/toolHowTo.json');
const toolHowTo = require(toolHowToFile);

// Extract TOOLS array
const toolsMatch = appFile.match(/export const TOOLS = \[([\s\S]*?)\];/);
if (!toolsMatch) {
  console.error("Could not find TOOLS array");
  process.exit(1);
}

// Very basic parsing to get id, name, desc, seoTitle, seoDesc
const toolsText = toolsMatch[1];
const regex = /{ id: '([^']+)', name: '([^']+)', desc: '([^']+)'(?:, seoTitle: '([^']+)')?(?:, seoDesc: '([^']+)')?/g;
let match;
const tools = [];

while ((match = regex.exec(toolsText)) !== null) {
  tools.push({
    id: match[1],
    name: match[2],
    desc: match[3],
    seoTitle: match[4] || match[2],
    seoDesc: match[5] || match[3]
  });
}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const introTemplates = [
  "ZeroApiTools provides a powerful and completely free **{name} Online** that runs directly in your browser. If you need to {descLower}, this is the perfect utility for you. No software installation, no registration, and absolutely no data is ever uploaded to our servers.",
  "Looking for a fast and secure way to {descLower}? Our free **{name}** works 100% locally in your web browser. This means you get instant results without compromising your privacy or creating an account.",
  "The **{name} Online** is a developer-friendly, entirely free tool designed to help you {descLower} in seconds. Because it processes everything client-side, your data remains secure on your device.",
  "Welcome to the ultimate free **{name}**. Whether you are a professional developer or just someone needing to quickly {descLower}, this online utility requires no signup and processes everything safely in your browser."
];

const whatIsTemplates = [
  "A {name} is an essential digital utility that allows you to {descLower} efficiently. It eliminates the need for manual calculations or complex software, giving you accurate results instantly.",
  "In simple terms, a {name} is an online application designed to {descLower}. It streamlines your workflow, saving you time and effort while ensuring high accuracy.",
  "If you've ever wondered how to {descLower} without installing heavy applications, a {name} is your answer. It is a lightweight, web-based solution for this exact problem."
];

const howToTemplates = [
  "1. Open the tool and locate the primary input area.\n2. Provide your data or configure the settings according to your needs.\n3. The tool will instantly process your request.\n4. Copy or download the final output directly to your device.",
  "1. Simply paste your input into the provided field.\n2. Tweak any available options to customize the result.\n3. Watch as the tool magically generates the output in real-time.\n4. Click the copy button to grab your results.",
  "1. Start by entering the required information into the tool.\n2. The system automatically detects and calculates the necessary changes.\n3. Review the preview or output generated on the screen.\n4. Save your work by copying the text or downloading the file."
];

const faqTemplates = [
  "### Is this {name} safe to use?\nYes! All processing happens locally within your browser using JavaScript. Your data is never transmitted to any external server, ensuring 100% privacy.\n\n### Is it really free?\nAbsolutely. ZeroApiTools is committed to providing high-quality tools like the {name} for free, forever. There are no hidden fees or premium subscriptions.",
  "### Do I need to create an account?\nNo, you can use the {name} immediately without any registration or login required. We value your time and privacy.\n\n### Can I use this on my mobile phone?\nYes, this tool is fully responsive. You can {descLower} directly from your smartphone, tablet, or desktop browser with ease.",
  "### Does this tool upload my data to a server?\nNever. The {name} runs entirely client-side. This means the code executes on your own machine, making it incredibly fast and totally secure.\n\n### What are the limits?\nThere are no artificial usage limits. You can use the {name} as many times as you want, completely free of charge."
];

let updatedCount = 0;

tools.forEach(tool => {
  const currentContent = toolHowTo[tool.id];
  
  // If content is missing or starts with "## How to Use" (the short format)
  if (!currentContent || currentContent.startsWith("## How to Use")) {
    const descLower = tool.desc.toLowerCase().replace(/\.$/, '');
    
    const intro = getRandom(introTemplates).replace(/{name}/g, tool.name).replace(/{descLower}/g, descLower);
    const whatIs = getRandom(whatIsTemplates).replace(/{name}/g, tool.name).replace(/{descLower}/g, descLower);
    const howTo = getRandom(howToTemplates);
    const faq = getRandom(faqTemplates).replace(/{name}/g, tool.name).replace(/{descLower}/g, descLower);
    
    const newContent = `# ${tool.name} Online Free

${intro}

## What is a ${tool.name}?

${whatIs}

## How to Use the ${tool.name}?

Using our tool is incredibly simple and requires no technical expertise:
${howTo}

${faq}`;

    toolHowTo[tool.id] = newContent;
    updatedCount++;
  }
});

fs.writeFileSync(toolHowToFile, JSON.stringify(toolHowTo, null, 2));
console.log(`Updated ${updatedCount} tools with rich content.`);
