/* eslint-env node */
/* eslint-disable no-useless-escape */
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

// Generate URL-friendly slug from title
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Safely extract plain text from Notion rich_text array
function getPlainText(richTextArr) {
  if (!richTextArr || !Array.isArray(richTextArr) || richTextArr.length === 0) return '';
  return richTextArr.map(t => t.plain_text || '').join('');
}

// Extract title from page properties (handles both "Title" and "Name" columns)
function getTitle(properties) {
  return getPlainText(properties.Title?.title) || getPlainText(properties.Name?.title) || 'Untitled';
}

// Extract slug — use Slug column if exists, otherwise generate from title
function getSlug(properties) {
  const slugProp = getPlainText(properties.Slug?.rich_text);
  if (slugProp) return slugProp;
  return slugify(getTitle(properties));
}

// Extract date with formatting
function getDate(properties, createdTime) {
  const raw = properties.Date?.date?.start || createdTime?.split('T')[0] || '';
  if (!raw) return '';
  try {
    return new Date(raw).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    return raw;
  }
}

// Map a Notion page to a blog post object (without content)
function pageToPost(page) {
  const props = page.properties;
  return {
    id: page.id,
    title: getTitle(props),
    slug: getSlug(props),
    author: getPlainText(props.Author?.rich_text) || 'ZeroApiTools Team',
    date: getDate(props, page.created_time),
    excerpt: getPlainText(props.Excerpt?.rich_text) || '',
    coverImage:
      page.cover?.external?.url ||
      page.cover?.file?.url ||
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  };
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId || !process.env.NOTION_API_KEY) {
      return res.status(500).json({
        error: 'Notion integration is not configured. Set NOTION_API_KEY and NOTION_DATABASE_ID in Vercel.',
      });
    }

    const { slug } = req.query;

    if (slug) {
      // ── Single blog post mode ──
      // Query all posts and find by generated slug (since Slug column may not exist)
      const response = await notion.databases.query({
        database_id: databaseId,
        sorts: [{ property: 'Date', direction: 'descending' }],
      });

      const allPosts = response.results.map(pageToPost);
      const matchedPost = allPosts.find(p => p.slug === slug);

      if (!matchedPost) {
        return res.status(404).json({ error: 'Blog not found' });
      }

      // Find the original Notion page to fetch content
      const page = response.results.find(p => p.id === matchedPost.id);

      // Convert page content to Markdown
      const mdblocks = await n2m.pageToMarkdown(page.id);
      const mdString = n2m.toMarkdownString(mdblocks);
      matchedPost.content = mdString.parent || mdString;

      // Auto-generate excerpt if not set
      if (!matchedPost.excerpt && matchedPost.content) {
        // Take first 200 chars of content, strip markdown
        matchedPost.excerpt = matchedPost.content
          .replace(/[#*`>\[\]!()-]/g, '')
          .replace(/\n+/g, ' ')
          .trim()
          .slice(0, 200) + '...';
      }

      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
      return res.status(200).json(matchedPost);

    } else {
      // ── Blog list mode ──
      // Build query — use Status filter only if Status property exists
      const queryOptions = {
        database_id: databaseId,
        sorts: [{ property: 'Date', direction: 'descending' }],
      };

      // Try with Status filter first, fall back to no filter
      let response;
      try {
        response = await notion.databases.query({
          ...queryOptions,
          filter: {
            property: 'Status',
            status: { equals: 'Published' },
          },
        });
      } catch {
        // Status property doesn't exist — query without filter
        response = await notion.databases.query(queryOptions);
      }

      const blogs = response.results.map(pageToPost);

      // Auto-generate excerpts for posts that don't have one
      for (const blog of blogs) {
        if (!blog.excerpt) {
          try {
            const mdblocks = await n2m.pageToMarkdown(blog.id);
            const mdString = n2m.toMarkdownString(mdblocks);
            const content = mdString.parent || mdString;
            blog.excerpt = content
              .replace(/[#*`>\[\]!()-]/g, '')
              .replace(/\n+/g, ' ')
              .trim()
              .slice(0, 200) + '...';
          } catch {
            blog.excerpt = 'Click to read more...';
          }
        }
      }

      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
      return res.status(200).json(blogs);
    }
  } catch (error) {
    console.error('Notion API Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch blogs from Notion',
      message: error?.message || 'Unknown error',
    });
  }
}
