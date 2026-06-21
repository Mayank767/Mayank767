import fs from 'fs';
import path from 'path';

const NVIDIA_API_KEY = "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";

// Wait function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
  const appJsxPath = path.join(process.cwd(), 'src/App.jsx');
  const appJsxContent = fs.readFileSync(appJsxPath, 'utf8');

  // Regex to extract id, name, desc
  const regex = /{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*desc:\s*'([^']+)'/g;
  const tools = [];
  let match;
  while ((match = regex.exec(appJsxContent)) !== null) {
    tools.push({ id: match[1], name: match[2], desc: match[3] });
  }

  console.log(`Found ${tools.length} tools. Starting generation...`);

  const toolHowToPath = path.join(process.cwd(), 'src/data/toolHowTo.json');
  const faqsPath = path.join(process.cwd(), 'src/data/faqs.js');

  const newHowTo = {};
  const newFaqs = {};

  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    console.log(`[${i+1}/${tools.length}] Generating content for: ${tool.name}`);

    const prompt = `You are an expert SEO copywriter. Write unique, highly engaging content for a web tool named "${tool.name}" which does the following: "${tool.desc}". 
    
Return a valid JSON object strictly matching this format (no markdown code blocks, just raw JSON text without backticks if possible):
{
  "markdown": "# ${tool.name} Online Free\\n\\n<Write a 100-word engaging, completely unique SEO-optimized introduction and 'How to Use' guide in Markdown format. Mention the tool name, its benefits, and assure users it runs safely in the browser without server uploads. DO NOT USE GENERIC BOILERPLATE. Make it sound unique.>",
  "faqs": [
    { "q": "<Unique Question 1 about ${tool.name}>", "a": "<Unique Answer>" },
    { "q": "<Unique Question 2 about ${tool.name}>", "a": "<Unique Answer>" },
    { "q": "<Unique Question 3 about ${tool.name}>", "a": "<Unique Answer>" }
  ]
}`;

    let success = false;
    let attempts = 0;
    while (!success && attempts < 3) {
      try {
        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${NVIDIA_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: "nvidia/nemotron-3-ultra-550b-a55b",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1500
          })
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${await response.text()}`);
        }

        const data = await response.json();
        let content = data.choices[0].message.content.trim();
        
        // Extract json from markdown block if returned
        if (content.startsWith('```json')) {
            content = content.replace(/^```json\n/, '').replace(/\n```$/, '');
        } else if (content.startsWith('```')) {
            content = content.replace(/^```\n/, '').replace(/\n```$/, '');
        }

        const parsed = JSON.parse(content);
        newHowTo[tool.id] = parsed.markdown;
        newFaqs[tool.id] = parsed.faqs;
        success = true;
      } catch (err) {
        attempts++;
        console.error(`Attempt ${attempts} failed for ${tool.name}: ${err.message}`);
        await sleep(2000);
      }
    }

    if (!success) {
      console.log(`Failed to generate for ${tool.name} after 3 attempts. Skipping.`);
    }

    // Rate limit: ~40 RPM -> 1.5 seconds per request. Wait 2.5 seconds to be safe.
    await sleep(2500);
  }

  // Save toolHowTo.json
  fs.writeFileSync(toolHowToPath, JSON.stringify(newHowTo, null, 2), 'utf8');
  console.log('Saved src/data/toolHowTo.json');

  // Save faqs.js
  let faqsFileContent = `export const TOOL_FAQS = {\n`;
  for (const [id, faqs] of Object.entries(newFaqs)) {
    faqsFileContent += `  '${id}': [\n`;
    for (const f of faqs) {
      const safeQ = f.q.replace(/'/g, "\\'");
      const safeA = f.a.replace(/'/g, "\\'");
      faqsFileContent += `    { q: '${safeQ}', a: '${safeA}' },\n`;
    }
    faqsFileContent += `  ],\n`;
  }
  faqsFileContent += `};\n`;
  
  fs.writeFileSync(faqsPath, faqsFileContent, 'utf8');
  console.log('Saved src/data/faqs.js');
  console.log('Done!');
}

run();
