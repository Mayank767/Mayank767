const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'blog', 'BlogViews.jsx');
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

// Find start and end of MOCK_BLOGS
let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('const MOCK_BLOGS = [')) {
    startIdx = i;
  }
  if (lines[i].startsWith('export function BlogList')) {
    endIdx = i;
    break;
  }
}

if (startIdx !== -1 && endIdx !== -1) {
  // Extract lines for MOCK_BLOGS (from startIdx to endIdx - 1)
  // But wait, there might be empty lines before 'export function BlogList'.
  // Let's find the closing '];' of MOCK_BLOGS.
  let actualEnd = endIdx - 1;
  while (actualEnd > startIdx && !lines[actualEnd].trim().endsWith('];')) {
    actualEnd--;
  }
  
  if (lines[actualEnd].trim() !== '];') {
    // If it doesn't end with '];', let's just use the line before 'export function'
    actualEnd = endIdx - 1;
  }

  const mockBlogsLines = lines.slice(startIdx, actualEnd + 1);
  const blogsContent = 'export ' + mockBlogsLines.join('\n');
  
  const dataDir = path.join(__dirname, 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(dataDir, 'blogs.js'), blogsContent, 'utf-8');
  
  const newBlogViewsLines = [
    ...lines.slice(0, startIdx),
    "import { MOCK_BLOGS } from '../../data/blogs.js';",
    "",
    ...lines.slice(actualEnd + 1)
  ];
  
  fs.writeFileSync(filePath, newBlogViewsLines.join('\n'), 'utf-8');
  console.log('Successfully extracted MOCK_BLOGS to src/data/blogs.js and updated BlogViews.jsx');
} else {
  console.log('Could not find boundaries.');
  console.log('startIdx', startIdx, 'endIdx', endIdx);
}
