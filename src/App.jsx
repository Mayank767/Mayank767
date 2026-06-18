import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './components/Landing';
import ToolFaq from './components/ToolFaq';
import RelatedTools from './components/layout/RelatedTools';
import About from './components/legal/About';
import Privacy from './components/legal/Privacy';
import Terms from './components/legal/Terms';
import { BlogList, BlogPost } from './components/blog/BlogViews';
// Text tools
const Base64Tool = React.lazy(() => import('./components/text/Base64Tool'));
const UrlEncodeTool = React.lazy(() => import('./components/text/UrlEncodeTool'));
const HtmlEntityTool = React.lazy(() => import('./components/text/HtmlEntityTool'));
const JwtDecoder = React.lazy(() => import('./components/text/JwtDecoder'));
const UuidGenerator = React.lazy(() => import('./components/text/UuidGenerator'));
const LoremIpsumGenerator = React.lazy(() => import('./components/text/LoremIpsumGenerator'));
const WordCounter = React.lazy(() => import('./components/text/WordCounter'));
const CaseConverter = React.lazy(() => import('./components/text/CaseConverter'));
const DiffChecker = React.lazy(() => import('./components/text/DiffChecker'));
const RegexTester = React.lazy(() => import('./components/text/RegexTester'));
const PrivacyPolicyGenerator = React.lazy(() => import('./components/text/PrivacyPolicyGenerator'));

// Code tools
const JsonFormatter = React.lazy(() => import('./components/code/JsonFormatter'));
const JsBeautifier = React.lazy(() => import('./components/code/JsBeautifier'));
const CssBeautifier = React.lazy(() => import('./components/code/CssBeautifier'));
const HtmlBeautifier = React.lazy(() => import('./components/code/HtmlBeautifier'));
const SqlFormatter = React.lazy(() => import('./components/code/SqlFormatter'));
const SvgToJsx = React.lazy(() => import('./components/code/SvgToJsx'));

// Converters
const JsonCsvTool = React.lazy(() => import('./components/converters/JsonCsvTool'));
const JsonYamlTool = React.lazy(() => import('./components/converters/JsonYamlTool'));
const MarkdownPreview = React.lazy(() => import('./components/converters/MarkdownPreview'));
const NumberBaseTool = React.lazy(() => import('./components/converters/NumberBaseTool'));
const TimestampTool = React.lazy(() => import('./components/converters/TimestampTool'));
const ColorConverter = React.lazy(() => import('./components/converters/ColorConverter'));
const PxRemConverter = React.lazy(() => import('./components/converters/PxRemConverter'));

// CSS Generators
const GlassmorphismGen = React.lazy(() => import('./components/css-generators/GlassmorphismGen'));
const GradientGenerator = React.lazy(() => import('./components/css-generators/GradientGenerator'));
const BoxShadowGen = React.lazy(() => import('./components/css-generators/BoxShadowGen'));
const BorderRadiusGen = React.lazy(() => import('./components/css-generators/BorderRadiusGen'));
const FlexboxPlayground = React.lazy(() => import('./components/css-generators/FlexboxPlayground'));
const CssGridGenerator = React.lazy(() => import('./components/css-generators/CssGridGenerator'));

// Image tools
const ImageCompressor = React.lazy(() => import('./components/image/ImageCompressor'));
const ImageResizer = React.lazy(() => import('./components/image/ImageResizer'));
const ImageToBase64 = React.lazy(() => import('./components/image/ImageToBase64'));
const QrCodeGenerator = React.lazy(() => import('./components/image/QrCodeGenerator'));
const PlaceholderImageGen = React.lazy(() => import('./components/image/PlaceholderImageGen'));
const ImageFormatConverter = React.lazy(() => import('./components/image/ImageFormatConverter'));

// Security
const PasswordGenerator = React.lazy(() => import('./components/security/PasswordGenerator'));
const HashGenerator = React.lazy(() => import('./components/security/HashGenerator'));

// SEO
const MetaTagGenerator = React.lazy(() => import('./components/seo/MetaTagGenerator'));
const OgPreview = React.lazy(() => import('./components/seo/OgPreview'));
const SlugGenerator = React.lazy(() => import('./components/seo/SlugGenerator'));
const FaviconGenerator = React.lazy(() => import('./components/seo/FaviconGenerator'));
const UtmBuilder = React.lazy(() => import('./components/seo/UtmBuilder'));

// Unique tools
const CurlToFetch = React.lazy(() => import('./components/unique/CurlToFetch'));
const CronParser = React.lazy(() => import('./components/unique/CronParser'));
const CssSpecificity = React.lazy(() => import('./components/unique/CssSpecificity'));
const ChmodCalculator = React.lazy(() => import('./components/unique/ChmodCalculator'));
const JsonSchemaGen = React.lazy(() => import('./components/unique/JsonSchemaGen'));
const ByteSize = React.lazy(() => import('./components/unique/ByteSize'));
const AsciiArt = React.lazy(() => import('./components/unique/AsciiArt'));
const HttpStatusRef = React.lazy(() => import('./components/unique/HttpStatusRef'));
const InstagramBioGen = React.lazy(() => import('./components/unique/InstagramBioGen'));
const HashtagGen = React.lazy(() => import('./components/unique/HashtagGen'));
const ThumbnailTextGen = React.lazy(() => import('./components/unique/ThumbnailTextGen'));
const YoutubeTitleGen = React.lazy(() => import('./components/unique/YoutubeTitleGen'));

// Calculator tools
const EmiCalculator = React.lazy(() => import('./components/calculators/EmiCalculator'));
const AgeCalculator = React.lazy(() => import('./components/calculators/AgeCalculator'));
const PercentageCalculator = React.lazy(() => import('./components/calculators/PercentageCalculator'));
const GstCalculator = React.lazy(() => import('./components/calculators/GstCalculator'));
const CurrencyConverter = React.lazy(() => import('./components/calculators/CurrencyConverter'));
const SipCalculator = React.lazy(() => import('./components/calculators/SipCalculator'));
const CompoundInterestCalc = React.lazy(() => import('./components/calculators/CompoundInterestCalc'));

// PDF tools
const PdfMerge = React.lazy(() => import('./components/pdf/PdfMerge'));
const PdfSplit = React.lazy(() => import('./components/pdf/PdfSplit'));
const PdfCompress = React.lazy(() => import('./components/pdf/PdfCompress'));
const PdfPassword = React.lazy(() => import('./components/pdf/PdfPassword'));

// ─────────────────────────────────────────
// App Context — shared state across components
// ─────────────────────────────────────────
export const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

// ─────────────────────────────────────────
// TOOL REGISTRY
// ─────────────────────────────────────────
export const TOOLS = [
  // Text & String
  { id: 'base64', name: 'Base64 Encode/Decode', desc: 'Securely convert text to Base64 and back locally in your browser. 100% private.', seoTitle: 'Base64 Encoder Decoder Online Free — No Upload | ZeroApiTools', seoDesc: 'Free base64 encoder decoder online. Encode text to Base64 or decode Base64 strings instantly in your browser. No signup, no data upload, 100% private. | ZeroApiTools', icon: '🔤', category: 'text', component: Base64Tool, sample: 'Hello, World! 🌍' },
  { id: 'url-encode', name: 'URL Encode/Decode', desc: 'Encode & decode URL components', seoTitle: 'URL Encoder Decoder Online Free | ZeroApiTools', seoDesc: 'Encode & decode URL components. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '🔗', category: 'text', component: UrlEncodeTool, sample: 'https://example.com/search?q=hello world&lang=en' },
  { id: 'html-entity', name: 'HTML Entity Encode/Decode', desc: 'Convert HTML special characters', seoTitle: 'HTML Entity Encode/Decode Online Free | ZeroApiTools', seoDesc: 'Convert HTML special characters. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '📄', category: 'text', component: HtmlEntityTool, sample: '<h1>Hello & "World"</h1>' },
  { id: 'jwt-decoder', name: 'JWT Decoder', desc: 'Decode JWT tokens offline. Header, payload & expiry. No server upload.', seoTitle: 'JWT Token Decoder Online Free — Read JWT Payload | ZeroApiTools', seoDesc: 'Free JWT token reader online. Decode JWT tokens — see header, payload & expiry instantly. No server upload, works offline in browser. No signup required. | ZeroApiTools', icon: '🎟️', category: 'text', component: JwtDecoder, sample: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
  { id: 'uuid', name: 'UUID Generator', desc: 'Generate random v4 UUIDs in bulk', seoTitle: 'UUID Generator Online Free — Bulk v4 UUID | ZeroApiTools', seoDesc: 'Free UUID generator online. Generate random v4 UUIDs in bulk instantly — no signup, no API, works 100% in your browser. | ZeroApiTools', icon: '🆔', category: 'text', component: UuidGenerator, sample: '5' },
  { id: 'lorem-ipsum', name: 'Lorem Ipsum Generator', desc: 'Generate placeholder text for designs', seoTitle: 'Lorem Ipsum Generator Online Free | ZeroApiTools', seoDesc: 'Generate placeholder text for designs. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '📝', category: 'text', component: LoremIpsumGenerator, sample: '3' },
  { id: 'word-counter', name: 'Word & Character Counter', desc: 'Count words, characters, sentences & reading time', seoTitle: 'Word Counter & Character Counter Online Free | ZeroApiTools', seoDesc: 'Count words, characters, sentences & reading time. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '🔢', category: 'text', component: WordCounter, sample: 'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.' },
  { id: 'case-converter', name: 'Case Converter', desc: 'Convert text to any case — camel, snake, kebab & more', seoTitle: 'Text Case Converter Online Free | ZeroApiTools', seoDesc: 'Convert text to any case — camel, snake, kebab & more. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '🔠', category: 'text', component: CaseConverter, sample: 'Hello World From ZeroApiTools' },
  { id: 'diff-checker', name: 'Text Diff Checker', desc: 'Compare two texts and highlight differences', seoTitle: 'Text Diff Checker Online Free — Compare & Highlight | ZeroApiTools', seoDesc: 'Free text diff checker online. Compare two texts side-by-side and highlight differences instantly. No signup, no upload, works in your browser. | ZeroApiTools', icon: '📊', category: 'text', component: DiffChecker, sample: 'The quick brown fox\njumps over the lazy dog\nHello World' },
  { id: 'regex-tester', name: 'Regex Tester', desc: 'Test regular expressions with live match highlighting', seoTitle: 'Regex Tester Online Free — Regular Expression Tester | ZeroApiTools', seoDesc: 'Free regex tester online for beginners & pros. Test regular expressions with live match highlighting. Supports all JS regex flags. No signup, works in browser. | ZeroApiTools', icon: '🔍', category: 'text', component: RegexTester, sample: 'hello@example.com, test@gmail.com, invalid-email' },

  // Code Formatters
  { id: 'json-formatter', name: 'JSON Formatter & Validator', desc: 'Beautify, minify & validate JSON data', seoTitle: 'JSON Formatter Online Free — JSON Beautifier & Validator | ZeroApiTools', seoDesc: 'Free JSON formatter & beautifier online. Beautify, minify, and validate JSON data instantly in your browser. No signup, no upload, 100% client-side. | ZeroApiTools', icon: '{ }', category: 'code', component: JsonFormatter, sample: '{"name":"John","age":30,"city":"Mumbai","skills":["JS","React","Node"]}' },
  { id: 'js-beautifier', name: 'JS Beautifier / Minifier', desc: 'Format or compress JavaScript code', seoTitle: 'JavaScript Beautifier & Code Minifier Online Free | ZeroApiTools', seoDesc: 'Free JavaScript code beautifier & minifier online. Format messy JS or minify for production instantly. No signup, no server upload, works in browser. | ZeroApiTools', icon: '⚡', category: 'code', component: JsBeautifier },
  { id: 'css-beautifier', name: 'CSS Beautifier / Minifier', desc: 'Format or compress CSS stylesheets', seoTitle: 'CSS Beautifier & Code Minifier Online Free | ZeroApiTools', seoDesc: 'Free CSS beautifier & minifier online. Format and compress CSS stylesheets instantly in your browser. No signup, no upload. | ZeroApiTools', icon: '🎨', category: 'code', component: CssBeautifier },
  { id: 'html-beautifier', name: 'HTML Beautifier / Minifier', desc: 'Format or compress HTML markup', seoTitle: 'HTML Formatter & Beautifier Online Free — No Upload | ZeroApiTools', seoDesc: 'Free HTML formatter & beautifier online. Format, indent, or minify HTML markup instantly in your browser. No signup, no upload. | ZeroApiTools', icon: '🌐', category: 'code', component: HtmlBeautifier },
  { id: 'sql-formatter', name: 'SQL Formatter', desc: 'Beautify SQL queries with proper indentation', seoTitle: 'SQL Formatter & Beautifier Online Free | ZeroApiTools', seoDesc: 'Beautify SQL queries with proper indentation. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '🗄️', category: 'code', component: SqlFormatter, sample: 'SELECT u.id,u.name,u.email,o.total FROM users u LEFT JOIN orders o ON u.id=o.user_id WHERE u.active=1 ORDER BY o.total DESC LIMIT 10' },
  { id: 'svg-to-jsx', name: 'SVG to JSX Converter', desc: 'Convert SVG markup to React JSX syntax', seoTitle: 'SVG to JSX Converter Online Free | ZeroApiTools', seoDesc: 'Convert SVG markup to React JSX syntax. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '⚛️', category: 'code', component: SvgToJsx },

  // Converters
  { id: 'json-csv', name: 'JSON ↔ CSV', desc: 'Convert between JSON arrays and CSV format', seoTitle: 'JSON ↔ CSV Online Free | ZeroApiTools', seoDesc: 'Convert between JSON arrays and CSV format. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '📋', category: 'converter', component: JsonCsvTool },
  { id: 'json-yaml', name: 'JSON ↔ YAML', desc: 'Convert between JSON and YAML format', seoTitle: 'JSON ↔ YAML Online Free | ZeroApiTools', seoDesc: 'Convert between JSON and YAML format. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '🔄', category: 'converter', component: JsonYamlTool },
  { id: 'markdown-preview', name: 'Markdown Preview', desc: 'Write Markdown and see live rendered output', seoTitle: 'Markdown Editor & Preview Online Free | ZeroApiTools', seoDesc: 'Free markdown editor online with live preview. Write Markdown and see the rendered output instantly — no signup, no server, works in browser. | ZeroApiTools', icon: '📑', category: 'converter', component: MarkdownPreview },
  { id: 'number-base', name: 'Number Base Converter', desc: 'Convert between Binary, Octal, Decimal & Hex', seoTitle: 'Number Base Converter Online Free | ZeroApiTools', seoDesc: 'Convert between Binary, Octal, Decimal & Hex. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '🔢', category: 'converter', component: NumberBaseTool },
  { id: 'timestamp', name: 'Unix Timestamp Converter', desc: 'Convert between Unix timestamps and dates', seoTitle: 'Unix Timestamp Converter Online Free | ZeroApiTools', seoDesc: 'Convert between Unix timestamps and dates. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '⏰', category: 'converter', component: TimestampTool },
  { id: 'color-converter', name: 'Color Converter', desc: 'Convert between HEX, RGB, HSL color formats', seoTitle: 'Color Picker & Converter Online Free | ZeroApiTools', seoDesc: 'Convert between HEX, RGB, HSL color formats. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '🎨', category: 'converter', component: ColorConverter },
  { id: 'px-rem', name: 'px ↔ rem Converter', desc: 'Convert between px and rem with custom base size', seoTitle: 'px ↔ rem Converter Online Free | ZeroApiTools', seoDesc: 'Convert between px and rem with custom base size. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '📐', category: 'converter', component: PxRemConverter },

  // CSS Generators
  { id: 'glassmorphism', name: 'Glassmorphism Generator', desc: 'Generate glass-effect CSS with live preview', seoTitle: 'Glassmorphism Generator Online Free | ZeroApiTools', seoDesc: 'Generate glass-effect CSS with live preview. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '🪟', category: 'css', component: GlassmorphismGen },
  { id: 'gradient', name: 'Gradient Generator', desc: 'Build linear & radial gradients visually', seoTitle: 'CSS Generator Online Free — Gradient Generator | ZeroApiTools', seoDesc: 'Free CSS generator online. Build beautiful linear & radial CSS gradients visually and copy the code instantly. No signup, no upload. | ZeroApiTools', icon: '🌈', category: 'css', component: GradientGenerator },
  { id: 'box-shadow', name: 'Box Shadow Generator', desc: 'Design box shadows with visual editor', seoTitle: 'CSS Box Shadow Generator Online Free — Visual Editor | ZeroApiTools', seoDesc: 'Free CSS box shadow generator online. Design beautiful box shadows visually and copy the CSS code instantly. No signup, no upload. | ZeroApiTools', icon: '🔲', category: 'css', component: BoxShadowGen },
  { id: 'border-radius', name: 'Border Radius Generator', desc: 'Fine-tune all 4 corners independently', seoTitle: 'Border Radius Generator Online Free | ZeroApiTools', seoDesc: 'Fine-tune all 4 corners independently. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '⬜', category: 'css', component: BorderRadiusGen },
  { id: 'flexbox', name: 'Flexbox Playground', desc: 'Experiment with flexbox properties visually', seoTitle: 'CSS Flexbox Generator Online Free — Flexbox Playground | ZeroApiTools', seoDesc: 'Free CSS flexbox generator online. Experiment with all flexbox properties visually and get the CSS code instantly. No signup, works in browser. | ZeroApiTools', icon: '📦', category: 'css', component: FlexboxPlayground },
  { id: 'css-grid', name: 'CSS Grid Generator', desc: 'Build grid layouts and get the CSS code', seoTitle: 'CSS Grid Generator Online Free | ZeroApiTools', seoDesc: 'Build grid layouts and get the CSS code. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '🔳', category: 'css', component: CssGridGenerator },

  // Image Tools
  { id: 'image-compress', name: 'Image Compressor', desc: 'Compress & convert images to WebP locally in your browser without uploading to a server.', seoTitle: 'Image Compressor Online Free — Compress Image in Browser | ZeroApiTools', seoDesc: 'Free image compressor online. Compress images in your browser without uploading to any server. Reduce JPEG, PNG, WebP size by up to 80%. No signup required. | ZeroApiTools', icon: '🗜️', category: 'image', component: ImageCompressor },
  { id: 'image-resize', name: 'Image Resizer', desc: 'Resize images to custom dimensions', seoTitle: 'Image Resizer Online Free — No Upload | ZeroApiTools', seoDesc: 'Resize images to custom dimensions. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '📏', category: 'image', component: ImageResizer },
  { id: 'image-base64', name: 'Image to Base64', desc: 'Convert images to Base64 data URIs', seoTitle: 'Image to Base64 Online Free | ZeroApiTools', seoDesc: 'Convert images to Base64 data URIs. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '🖼️', category: 'image', component: ImageToBase64 },
  { id: 'qr-code', name: 'QR Code Generator', desc: 'Generate QR codes from any text or URL', seoTitle: 'QR Code Generator Online Free | ZeroApiTools', seoDesc: 'Generate QR codes from any text or URL. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '📱', category: 'image', component: QrCodeGenerator },
  { id: 'placeholder-image', name: 'Placeholder Image', desc: 'Generate colored placeholder images with text', seoTitle: 'Placeholder Image Online Free | ZeroApiTools', seoDesc: 'Generate colored placeholder images with text. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '🏞️', category: 'image', component: PlaceholderImageGen },

  // Security
  { id: 'password-gen', name: 'Password Generator', desc: 'Generate strong, secure passwords locally. Your passwords never leave your device.', seoTitle: 'Password Generator Online Free — Secure & No Signup | ZeroApiTools', seoDesc: 'Free password generator online. Generate strong, secure passwords instantly in your browser. Your passwords never leave your device — no signup, no tracking. | ZeroApiTools', icon: '🔐', category: 'security', component: PasswordGenerator },
  { id: 'hash-gen', name: 'Hash Generator', desc: 'Generate SHA-1, SHA-256, SHA-512 hashes', seoTitle: 'MD5 SHA256 Hash Generator Online Free | ZeroApiTools', seoDesc: 'Generate SHA-1, SHA-256, SHA-512 hashes. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '🛡️', category: 'security', component: HashGenerator },

  // SEO & Web
  { id: 'meta-tag', name: 'Meta Tag Generator', desc: 'Generate HTML meta tags for SEO', seoTitle: 'Meta Tag Generator Online Free | ZeroApiTools', seoDesc: 'Generate HTML meta tags for SEO. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '🏷️', category: 'seo', component: MetaTagGenerator },
  { id: 'og-preview', name: 'Open Graph Preview', desc: 'Preview social media sharing cards', seoTitle: 'Open Graph Preview Online Free | ZeroApiTools', seoDesc: 'Preview social media sharing cards. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '👁️', category: 'seo', component: OgPreview },
  { id: 'slug-gen', name: 'Slug Generator', desc: 'Convert text to URL-friendly slugs', seoTitle: 'Slug Generator Online Free | ZeroApiTools', seoDesc: 'Convert text to URL-friendly slugs. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '🔗', category: 'seo', component: SlugGenerator },
  { id: 'favicon-gen', name: 'Favicon Generator', desc: 'Create favicons from text or emoji', seoTitle: 'Favicon Generator Online Free | ZeroApiTools', seoDesc: 'Create favicons from text or emoji. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '⭐', category: 'seo', component: FaviconGenerator },

  // Unique Tools
  { id: 'curl-to-fetch', name: 'cURL → Fetch Converter', desc: 'Convert cURL commands to JS fetch() or axios', seoTitle: 'cURL Converter Online Free — cURL to JavaScript & Fetch | ZeroApiTools', seoDesc: 'Free cURL converter online for API testing. Convert cURL commands to JavaScript fetch() or Axios instantly. No signup, no upload, works in browser. | ZeroApiTools', icon: '🔁', category: 'unique', component: CurlToFetch, sample: "curl -X POST https://api.example.com/users -H 'Content-Type: application/json' -d '{\"name\":\"John\"}'" },
  { id: 'cron-parser', name: 'Cron Expression Parser & Generator', desc: 'Decode cron schedules in plain English + next runs', seoTitle: 'Cron Expression Generator & Parser Online Free | ZeroApiTools', seoDesc: 'Free cron expression generator & tester online. Decode cron schedules to plain English and see next run times instantly. No signup, works in browser. | ZeroApiTools', icon: '⏱️', category: 'unique', component: CronParser, sample: '0 9 * * 1-5' },
  { id: 'css-specificity', name: 'CSS Specificity Calculator', desc: 'Calculate & compare CSS selector specificity', seoTitle: 'CSS Specificity Calculator Online Free | ZeroApiTools', seoDesc: 'Calculate & compare CSS selector specificity. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '🎯', category: 'unique', component: CssSpecificity, sample: '#main .container > p:hover' },
  { id: 'chmod-calc', name: 'Chmod Calculator', desc: 'Visual Linux file permissions calculator', seoTitle: 'Chmod Calculator Linux — File Permission Calculator Online Free | ZeroApiTools', seoDesc: 'Free chmod calculator online. Visual Linux file permission calculator — toggle read/write/execute for Owner, Group & Others and get the numeric chmod value instantly. | ZeroApiTools', icon: '🔒', category: 'unique', component: ChmodCalculator },
  { id: 'json-schema', name: 'JSON Schema Generator', desc: 'Auto-generate JSON Schema from any JSON', seoTitle: 'JSON Schema Generator Online Free | ZeroApiTools', seoDesc: 'Auto-generate JSON Schema from any JSON. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '📐', category: 'unique', component: JsonSchemaGen, sample: '{"name":"Alice","age":28,"email":"alice@example.com","tags":["dev","react"]}' },
  { id: 'byte-size', name: 'Byte Size Calculator', desc: 'String size in UTF-8, UTF-16, UTF-32 bytes', seoTitle: 'Byte Size Calculator Online Free | ZeroApiTools', seoDesc: 'String size in UTF-8, UTF-16, UTF-32 bytes. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '📦', category: 'unique', component: ByteSize, sample: 'Hello, 世界! 🚀' },
  { id: 'ascii-art', name: 'ASCII Art Generator', desc: 'Convert text to ASCII art with multiple fonts', seoTitle: 'ASCII Art Generator Online Free | ZeroApiTools', seoDesc: 'Convert text to ASCII art with multiple fonts. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '🔡', category: 'unique', component: AsciiArt, sample: 'WEB' },
  { id: 'http-status', name: 'HTTP Status Codes', desc: 'Complete reference for all HTTP status codes', seoTitle: 'HTTP Status Codes Online Free | ZeroApiTools', seoDesc: 'Complete reference for all HTTP status codes. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '📡', category: 'unique', component: HttpStatusRef },
  { id: 'instagram-bio', name: 'Instagram Bio Generator', desc: 'Generate aesthetic Instagram bios with emojis', seoTitle: 'Instagram Bio Generator Online Free | ZeroApiTools', seoDesc: 'Generate aesthetic Instagram bios with emojis. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '✨', category: 'unique', component: InstagramBioGen },
  { id: 'hashtag-gen', name: 'Hashtag Generator', desc: 'Find popular and niche hashtags for social media', seoTitle: 'Hashtag Generator Online Free | ZeroApiTools', seoDesc: 'Find popular and niche hashtags for social media. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '#️⃣', category: 'unique', component: HashtagGen, sample: 'travel' },
  { id: 'thumbnail-text', name: 'Thumbnail Text Generator', desc: 'Create catchy text overlays for video thumbnails', seoTitle: 'Thumbnail Text Generator Online Free | ZeroApiTools', seoDesc: 'Create catchy text overlays for video thumbnails. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '🖼️', category: 'unique', component: ThumbnailTextGen, sample: 'React hooks tutorial' },
  { id: 'youtube-title', name: 'YouTube Title Generator', desc: 'Generate catchy YouTube titles with proven templates', seoTitle: 'YouTube Title Generator Online Free | ZeroApiTools', seoDesc: 'Generate catchy YouTube titles with proven templates. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '▶️', category: 'unique', component: YoutubeTitleGen, sample: 'React hooks tutorial' },

  // Image (new)
  { id: 'image-format', name: 'Image Format Converter', desc: 'Convert images between JPEG, PNG, WebP formats', seoTitle: 'Image Format Converter Online Free | ZeroApiTools', seoDesc: 'Convert images between JPEG, PNG, WebP formats. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '🔀', category: 'image', component: ImageFormatConverter },

  // SEO (new)
  { id: 'utm-builder', name: 'UTM Link Builder', desc: 'Build UTM tracking links for Google Analytics', seoTitle: 'UTM Link Builder Online Free | ZeroApiTools', seoDesc: 'Build UTM tracking links for Google Analytics. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '📊', category: 'seo', component: UtmBuilder },

  // Text (new)
  { id: 'privacy-policy', name: 'Privacy Policy Generator', desc: 'Generate Privacy Policy & Terms of Service for your site', seoTitle: 'Privacy Policy Generator Online Free | ZeroApiTools', seoDesc: 'Generate Privacy Policy & Terms of Service for your site. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '📋', category: 'text', component: PrivacyPolicyGenerator },

  // Calculators (new category)
  { id: 'emi-calc', name: 'EMI / Loan Calculator', desc: 'Calculate monthly EMI with full amortization schedule', seoTitle: 'EMI Calculator with Formula Breakdown & Amortization | ZeroApiTools', seoDesc: 'Calculate monthly EMI with full amortization schedule. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '🏦', category: 'calculator', component: EmiCalculator },
  { id: 'age-calc', name: 'Age Calculator', desc: 'Calculate exact age in years, months & days', seoTitle: 'Age Calculator Online Free | ZeroApiTools', seoDesc: 'Calculate exact age in years, months & days. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '🎂', category: 'calculator', component: AgeCalculator },
  { id: 'percentage-calc', name: 'Percentage Calculator', desc: 'Calculate percentages, changes & ratios instantly', seoTitle: 'Percentage Calculator Online Free | ZeroApiTools', seoDesc: 'Calculate percentages, changes & ratios instantly. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '💯', category: 'calculator', component: PercentageCalculator },
  { id: 'gst-calc', name: 'GST Calculator', desc: 'Add or extract GST with CGST & SGST breakdown', seoTitle: 'GST Calculator Online India Free | ZeroApiTools', seoDesc: 'Add or extract GST with CGST & SGST breakdown. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '🧾', category: 'calculator', component: GstCalculator },
  { id: 'currency-conv', name: 'Currency Converter', desc: 'Real-time currency conversion for 20+ currencies', seoTitle: 'Currency Converter Online Free — Live Rates | ZeroApiTools', seoDesc: 'Real-time currency conversion for 20+ currencies. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '💱', category: 'calculator', component: CurrencyConverter },
  { id: 'sip-calc', name: 'SIP Calculator', desc: 'Calculate mutual fund SIP returns with compounding', seoTitle: 'SIP Calculator Online India Free | ZeroApiTools', seoDesc: 'Calculate mutual fund SIP returns with compounding. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '📈', category: 'calculator', component: SipCalculator },
  { id: 'compound-interest', name: 'Compound Interest Calculator', desc: 'Calculate compound interest with yearly breakdown', seoTitle: 'Compound Interest Calculator Online Free | ZeroApiTools', seoDesc: 'Calculate compound interest with yearly breakdown. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '💰', category: 'calculator', component: CompoundInterestCalc },

  // PDF tools (new category)
  { id: 'pdf-merge', name: 'PDF Merge', desc: 'Combine multiple PDF files into one document', seoTitle: 'PDF Merge Online Free | ZeroApiTools', seoDesc: 'Combine multiple PDF files into one document. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '📎', category: 'pdf', component: PdfMerge },
  { id: 'pdf-split', name: 'PDF Splitter', desc: 'Extract specific pages from a PDF file', seoTitle: 'PDF Splitter Online Free | ZeroApiTools', seoDesc: 'Extract specific pages from a PDF file. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '✂️', category: 'pdf', component: PdfSplit },
  { id: 'pdf-compress', name: 'PDF Compressor', desc: 'Reduce PDF file size securely. 100% private, no files are uploaded to any server.', seoTitle: 'PDF Compressor Online Free | ZeroApiTools', seoDesc: 'Reduce PDF file size securely. 100% private, no files are uploaded to any server. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '🗜️', category: 'pdf', component: PdfCompress },
  { id: 'pdf-password', name: 'PDF Password Lock', desc: 'Lock or unlock PDF files with a password', seoTitle: 'PDF Password Lock Online Free | ZeroApiTools', seoDesc: 'Lock or unlock PDF files with a password. Free online tool, no signup required, works in browser. | ZeroApiTools', icon: '🔐', category: 'pdf', component: PdfPassword },
];

export const CATEGORIES = [
  { id: 'all', name: 'All Tools', icon: '🛠️' },
  { id: 'text', name: 'Text & String', icon: '📝' },
  { id: 'code', name: 'Code', icon: '💻' },
  { id: 'converter', name: 'Converters', icon: '🔄' },
  { id: 'calculator', name: 'Calculators', icon: '🧮' },
  { id: 'css', name: 'CSS Generators', icon: '🎨' },
  { id: 'image', name: 'Image', icon: '🖼️' },
  { id: 'pdf', name: 'PDF Tools', icon: '📄' },
  { id: 'security', name: 'Security', icon: '🔒' },
  { id: 'seo', name: 'SEO & Web', icon: '🌐' },
  { id: 'unique', name: '✨ Unique', icon: '🚀' },
];

// ─────────────────────────────────────────
// localStorage helpers
// ─────────────────────────────────────────
function lsGet(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ─────────────────────────────────────────
// Main App
// ─────────────────────────────────────────
function App() {
  // Dark/Light mode
  const [darkMode, setDarkMode] = useState(() => lsGet('wu-dark', true));

  // Current tool — path-based URL routing
  const [currentTool, setCurrentTool] = useState(() => {
    const path = window.location.pathname.replace(/^\/+/, '');
    if (path === 'blog' || path.startsWith('blog-post/')) return path;
    return TOOLS.find(t => t.id === path)?.id || null;
  });

  // Favorites
  const [favorites, setFavorites] = useState(() => lsGet('wu-favorites', []));

  // Recently used (last 8)
  const [recents, setRecents] = useState(() => lsGet('wu-recents', []));

  // Usage counters
  const [usageCount, setUsageCount] = useState(() => lsGet('wu-usage', {}));

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Apply dark/light mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    lsSet('wu-dark', darkMode);
  }, [darkMode]);

  // Sync URL path with current tool and inject SEO tags
  useEffect(() => {
    if (['about', 'privacy', 'terms'].includes(currentTool)) {
      window.history.pushState(null, '', `/${currentTool}`);
      const titles = {
        about: 'About Us - ZeroApiTools | Free Developer Tools',
        privacy: 'Privacy Policy - ZeroApiTools',
        terms: 'Terms of Service - ZeroApiTools',
      };
      document.title = titles[currentTool];
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.content = `Read the ${titles[currentTool]} for ZeroApiTools. 100% Free & Open Source Developer Tools.`;
    } else if (currentTool === 'blog') {
      window.history.pushState(null, '', '/blog');
      document.title = 'Developer Blog - ZeroApiTools | Free Developer Tools';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.content = 'Insights, guides, and tutorials generated for developers.';
    } else if (currentTool?.startsWith('blog-post/')) {
      window.history.pushState(null, '', `/${currentTool}`);
      document.title = 'Article - ZeroApiTools | Free Developer Tools';
    } else if (currentTool) {
      const tool = TOOLS.find(t => t.id === currentTool);
      if (tool) {
        window.history.pushState(null, '', `/${currentTool}`);
        document.title = tool.seoTitle || `${tool.name} - ZeroApiTools | Free Developer Tools`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.content = tool.seoDesc || tool.desc;
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.href = `https://zeroapitools.vercel.app/${currentTool}`;
        
        // GEO Dynamic Schema Injection
        let schemaScript = document.getElementById('geo-schema');
        if (!schemaScript) {
          schemaScript = document.createElement('script');
          schemaScript.id = 'geo-schema';
          schemaScript.type = 'application/ld+json';
          document.head.appendChild(schemaScript);
        }
        schemaScript.textContent = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": `${tool.name} by ZeroApiTools`,
          "url": `https://zeroapitools.vercel.app/${currentTool}`,
          "description": tool.desc,
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Any (Web Browser)",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        });

        // Breadcrumb Dynamic Schema Injection
        let breadcrumbScript = document.getElementById('breadcrumb-schema');
        if (!breadcrumbScript) {
          breadcrumbScript = document.createElement('script');
          breadcrumbScript.id = 'breadcrumb-schema';
          breadcrumbScript.type = 'application/ld+json';
          document.head.appendChild(breadcrumbScript);
        }
        const categoryMatch = CATEGORIES.find(c => c.id === tool.category) || { name: 'Tools' };
        breadcrumbScript.textContent = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://zeroapitools.vercel.app/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": categoryMatch.name,
              "item": `https://zeroapitools.vercel.app/?cat=${tool.category}`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": tool.name,
              "item": `https://zeroapitools.vercel.app/${currentTool}`
            }
          ]
        });
      }
    } else {
      window.history.pushState(null, '', '/');
      document.title = 'ZeroApiTools: Free In-Browser Developer Utilities';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.content = `Access ${TOOLS.length}+ free developer tools that run entirely in your browser. JSON Formatter, Base64, Image Compressor & more. 100% private, no signup, no API.`;
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.href = 'https://zeroapitools.vercel.app/';
      
      let schemaScript = document.getElementById('geo-schema');
      if (schemaScript) {
        schemaScript.textContent = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "ZeroApiTools",
          "url": "https://zeroapitools.vercel.app/",
          "description": `${TOOLS.length}+ free browser-based developer tools. No API, no uploads, 100% client-side.`,
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        });
      }
    }
  }, [currentTool]);

  // Handle browser back/forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/+/, '');
      if (['about', 'privacy', 'terms', 'blog'].includes(path) || path.startsWith('blog-post/')) {
        setCurrentTool(path);
      } else {
        setCurrentTool(TOOLS.find(t => t.id === path)?.id || null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('✅ Copied to clipboard!');
    } catch {
      showToast('Failed to copy', 'error');
    }
  }, [showToast]);

  const selectTool = useCallback((toolId) => {
    setCurrentTool(toolId);
    if (toolId !== 'blog' && !toolId?.startsWith('blog-post/')) {
      // Track recents
      setRecents(prev => {
        const next = [toolId, ...prev.filter(id => id !== toolId)].slice(0, 8);
        lsSet('wu-recents', next);
        return next;
      });
      // Track usage count
      setUsageCount(prev => {
        const next = { ...prev, [toolId]: (prev[toolId] || 0) + 1 };
        lsSet('wu-usage', next);
        return next;
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goHome = useCallback(() => setCurrentTool(null), []);

  const toggleFavorite = useCallback((toolId) => {
    setFavorites(prev => {
      const next = prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId];
      lsSet('wu-favorites', next);
      return next;
    });
  }, []);

  const shareTool = useCallback((toolId) => {
    const url = `${window.location.origin}/${toolId}`;
    copyToClipboard(url);
    showToast('🔗 Link copied! Share it with anyone.');
  }, [copyToClipboard, showToast]);

  // History per tool
  const addToHistory = useCallback((toolId, entry) => {
    const key = `wu-history-${toolId}`;
    const prev = lsGet(key, []);
    const next = [entry, ...prev.filter(e => e !== entry)].slice(0, 5);
    lsSet(key, next);
  }, []);

  const getHistory = useCallback((toolId) => {
    return lsGet(`wu-history-${toolId}`, []);
  }, []);

  const activeTool = TOOLS.find(t => t.id === currentTool);
  const ActiveComponent = activeTool?.component;
  const [sampleKey, setSampleKey] = useState(0);

  const contextValue = {
    darkMode, setDarkMode,
    favorites, toggleFavorite,
    recents, usageCount,
    selectTool, goHome,
    shareTool,
    copyToClipboard, showToast,
    addToHistory, getHistory,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <Navbar currentTool={currentTool} onGoHome={goHome} onSelectTool={selectTool} />

      <main>
      {currentTool === 'about' ? (
        <About />
      ) : currentTool === 'privacy' ? (
        <Privacy />
      ) : currentTool === 'terms' ? (
        <Terms />
      ) : currentTool === 'blog' ? (
        <BlogList onNavigate={(page, slug) => selectTool(slug ? `blog-post/${slug}` : page)} />
      ) : currentTool?.startsWith('blog-post/') ? (
        <BlogPost slug={currentTool.replace('blog-post/', '')} onNavigate={(page, slug) => selectTool(slug ? `blog-post/${slug}` : page)} />
      ) : currentTool && ActiveComponent ? (
        <div className="tool-page animate-in">
          <div className="tool-header">
            <div className="tool-header-left">
              <h1 className="tool-title">{activeTool.icon} {activeTool.seoTitle ? activeTool.seoTitle.split(' | ')[0] : activeTool.name}</h1>
              <p className="tool-description">{activeTool.desc}</p>
            </div>
            <div className="tool-header-actions">
              {activeTool.sample && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSampleKey(k => k + 1)}
                  title="Load example data"
                >
                  💡 Try Example
                </button>
              )}
              <button
                className={`btn btn-ghost btn-sm favorite-btn ${favorites.includes(currentTool) ? 'active' : ''}`}
                onClick={() => toggleFavorite(currentTool)}
                title={favorites.includes(currentTool) ? 'Remove from favorites' : 'Add to favorites'}
              >
                {favorites.includes(currentTool) ? '⭐' : '☆'} {favorites.includes(currentTool) ? 'Saved' : 'Save'}
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => shareTool(currentTool)}
                title="Copy shareable link"
              >
                🔗 Share
              </button>
            </div>
          </div>
          <div className="tool-body">
            <React.Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading tool...</div>}>
              <ActiveComponent
                key={`${currentTool}-${sampleKey}`}
                copyToClipboard={copyToClipboard}
                showToast={showToast}
                addToHistory={(entry) => addToHistory(currentTool, entry)}
                getHistory={() => getHistory(currentTool)}
                sampleData={sampleKey > 0 ? activeTool.sample : undefined}
              />
              <div style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>🔒</span>
                <span><strong>100% Client-Side JS Execution</strong> — Zero Data Retained. No server uploads.</span>
              </div>
            </React.Suspense>
          </div>
          <ToolFaq toolId={currentTool} />
          <RelatedTools 
            currentToolId={currentTool} 
            onSelect={selectTool} 
            favorites={favorites} 
            toggleFavorite={toggleFavorite} 
            usageCount={usageCount} 
          />
        </div>
      ) : (
        <Landing />
      )}
      </main>

      <Footer />

      {/* Toast Container */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(t => (
            <div key={t.id} className={`toast ${t.type}`}>
              {t.message}
            </div>
          ))}
        </div>
      )}
    </AppContext.Provider>
  );
}

export default App;
