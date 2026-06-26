const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Remove the React.lazy imports for all tools.
// They start with "// Text tools" and end before "// ─────────────────────────────────────────" (App Context)

const toolsImportsStart = content.indexOf('// Text tools');
const appContextStart = content.indexOf('// ─────────────────────────────────────────\n// App Context');

if (toolsImportsStart !== -1 && appContextStart !== -1) {
  content = content.slice(0, toolsImportsStart) + 
            "import { TOOLS, CATEGORIES } from './data/toolsList';\n\n" + 
            content.slice(appContextStart);
}

// 2. Remove the TOOLS array
const toolsStart = content.indexOf('export const TOOLS = [');
const categoriesStart = content.indexOf('export const CATEGORIES = [');

if (toolsStart !== -1 && categoriesStart !== -1) {
  // Find where CATEGORIES ends. It's `];\n` or similar.
  const categoriesEndStr = "  { id: 'unique', name: 'Unique Tools', icon: '🔥' },\n];\n";
  const categoriesEnd = content.indexOf(categoriesEndStr);
  
  if (categoriesEnd !== -1) {
    const end = categoriesEnd + categoriesEndStr.length;
    // We already imported TOOLS and CATEGORIES at the top, so just remove the definitions
    content = content.slice(0, toolsStart) + content.slice(end);
  }
}

// 3. Add toolName={activeTool?.name} to ToolFaq
content = content.replace('<ToolFaq toolId={currentTool} />', '<ToolFaq toolId={currentTool} toolName={activeTool?.name} />');

// 4. Add allTools={TOOLS} to RelatedTools
content = content.replace(
  '<RelatedTools \n            currentToolId={currentTool} \n            onSelect={selectTool}',
  '<RelatedTools \n            currentToolId={currentTool} \n            allTools={TOOLS}\n            onSelect={selectTool}'
);

fs.writeFileSync('src/App.jsx', content, 'utf8');
console.log('App.jsx updated successfully!');
