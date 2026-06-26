const fs = require('fs');
const blogsCode = fs.readFileSync('src/data/blogs.js', 'utf-8');
const blogRegex = /slug:\s*'([^']+)',[\s\S]*?title:\s*'([^']+)',[\s\S]*?excerpt:\s*'([^']+)',[\s\S]*?coverImage:\s*'([^']+)'/g;
const blogs = [];
let bm;
while ((bm = blogRegex.exec(blogsCode)) !== null) {
  blogs.push({ slug: bm[1], title: bm[2], excerpt: bm[3], coverImage: bm[4] });
}
console.log(blogs);
