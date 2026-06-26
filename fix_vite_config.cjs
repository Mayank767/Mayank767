const fs = require('fs');
const path = require('path');

let content = fs.readFileSync('vite.config.js', 'utf-8');

// The file has literal backslashes because of over-escaping.
// Let's replace `\\` before backticks and dollar signs.

content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');
content = content.replace(/\\\//g, '/');

fs.writeFileSync('vite.config.js', content, 'utf-8');
console.log('Fixed escaping in vite.config.js');
