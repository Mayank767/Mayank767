export const TOOL_FAQS = {
  'jwt-decoder': [
    { q: 'What is a JSON Web Token (JWT)?', a: 'A JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. It is commonly used for authentication and authorization in web applications.' },
    { q: 'Does this decoder verify the token signature?', a: 'No, this tool only decodes the Base64Url encoded Header and Payload sections so you can inspect their contents. It does not verify the cryptographic signature.' },
    { q: 'Is it safe to paste my JWT here?', a: 'Yes. The JWT Decoder runs entirely locally in your browser. Your token is never uploaded, logged, or sent to any server, ensuring your sensitive data remains private.' },
    { q: 'Why do I see numbers for the iat and exp fields?', a: 'These fields represent the "Issued At" and "Expiration" times in Unix timestamp format. Our decoder automatically converts these numbers into human-readable dates for you.' },
  ],
  'url-encode': [
    { q: 'What is URL encoding?', a: 'URL encoding (or percent-encoding) is a mechanism for converting characters that cannot be safely transmitted over the internet into a universally accepted format, like turning a space into %20.' },
    { q: 'What is the difference between encodeURI and encodeURIComponent?', a: 'encodeURI is used for full URLs and ignores characters like ?, /, and &. encodeURIComponent encodes everything, making it perfect for individual query string parameters.' },
    { q: 'Is this URL Encoder free?', a: 'Yes! Our URL Encoder & Decoder is completely free to use with no hidden fees or account registration required.' },
    { q: 'Are my URLs sent to a server?', a: 'No. All processing happens locally in your browser via JavaScript. Your URLs, tokens, and data remain strictly on your device.' },
  ],
  'api-tester': [
    { q: 'What is an API Tester online?', a: 'An online API tester is a browser-based tool that lets you send HTTP requests (GET, POST, PUT, DELETE) to REST API endpoints and inspect the responses without installing heavy desktop software like Postman.' },
    { q: 'Can I test local APIs (localhost) with this tool?', a: 'Yes, but since this tool runs entirely in your browser, your local development server must have CORS (Cross-Origin Resource Sharing) enabled by returning the Access-Control-Allow-Origin: * header.' },
    { q: 'Are my API keys and request payloads secure?', a: 'Absolutely. The tool executes 100% locally on your machine. Your API keys, Bearer tokens, and request data never touch our servers.' },
    { q: 'Is this API Tester free to use?', a: 'Yes! It is completely free with no signup required. You can start sending requests and configuring custom headers immediately.' },
  ],
  'sip-calc': [
    { q: 'What is a SIP Calculator?', a: 'A SIP (Systematic Investment Plan) Calculator helps you estimate returns on monthly mutual fund investments over time using compound interest.' },
    { q: 'How is SIP return calculated?', a: 'SIP returns are calculated using the formula: FV = P × [(1+r)^n – 1] / r × (1+r), where P is monthly investment, r is monthly rate of return, and n is total months.' },
    { q: 'Is this SIP Calculator free?', a: 'Yes! ZeroApiTools SIP Calculator is 100% free and runs entirely in your browser. No signup required.' },
    { q: 'What is a good monthly SIP amount?', a: 'It depends on your financial goals. Even ₹500/month can grow significantly over 10-20 years due to compounding. Financial advisors recommend investing 20-30% of income.' },
    { q: 'Is my financial data safe?', a: 'Absolutely. All calculations happen locally in your browser. No data is sent to any server.' },
  ],
  'compound-interest': [
    { q: 'What is Compound Interest?', a: 'Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. It makes your money grow faster than simple interest.' },
    { q: 'How is Compound Interest calculated?', a: 'The formula is A = P(1 + r/n)^(nt), where P = principal, r = annual rate, n = compounding frequency per year, t = time in years.' },
    { q: 'What is the difference between simple and compound interest?', a: 'Simple interest is calculated only on the principal amount. Compound interest is calculated on principal + accumulated interest, resulting in faster growth.' },
    { q: 'Which compounding frequency is best?', a: 'More frequent compounding (daily > monthly > quarterly > yearly) results in slightly higher returns due to interest-on-interest effect.' },
    { q: 'Is this calculator accurate?', a: 'Yes, this calculator uses the standard compound interest formula and provides accurate results. All processing happens in your browser.' },
  ],
  'emi-calc': [
    { q: 'What is EMI?', a: 'EMI (Equated Monthly Installment) is a fixed payment amount made by a borrower to a lender on a specified date each month to repay a loan.' },
    { q: 'How is EMI calculated?', a: 'EMI = P × r × (1+r)^n / ((1+r)^n – 1), where P = principal loan amount, r = monthly interest rate, n = total number of months.' },
    { q: 'Is this EMI Calculator free to use?', a: 'Yes, completely free! No registration needed. Your data stays in your browser.' },
    { q: 'Can I see the full amortization schedule?', a: 'Yes! Click "Show Table" to see month-by-month breakdown of principal, interest, and remaining balance.' },
  ],
  'instagram-bio': [
    { q: 'What is an Instagram Bio Generator?', a: 'It helps you create attractive, creative Instagram bios with emojis and formatting that fit within Instagram\'s 150 character limit.' },
    { q: 'How many characters can an Instagram bio have?', a: 'Instagram allows a maximum of 150 characters in your bio. Our generator shows a live character count.' },
    { q: 'Can I customize the generated bios?', a: 'Yes! You can mix and match different bio lines, edit the text, and create your own unique combination.' },
    { q: 'Is this tool free?', a: 'Yes, 100% free with no signup required. Generate unlimited bios!' },
  ],
  'youtube-title': [
    { q: 'What makes a good YouTube title?', a: 'A good YouTube title is 60-70 characters, includes keywords, creates curiosity, and uses power words. Our generator follows all these best practices.' },
    { q: 'How does the YouTube Title Generator work?', a: 'Enter your topic and select a style. The tool generates multiple title variations using proven templates that drive clicks and views.' },
    { q: 'What is the YouTube title character limit?', a: 'YouTube allows up to 100 characters, but titles are truncated at ~70 characters in search results. Aim for 60-70 characters for best visibility.' },
    { q: 'Is this tool free?', a: 'Yes! Generate unlimited YouTube titles for free, no account needed.' },
  ],
  'hashtag-gen': [
    { q: 'How many hashtags should I use on Instagram?', a: 'Instagram allows up to 30 hashtags per post. Research suggests 11-15 relevant hashtags perform best for reach.' },
    { q: 'What are niche hashtags?', a: 'Niche hashtags have lower competition (under 500K posts) and help your content reach a more targeted audience. Our generator color-codes hashtags by competition level.' },
    { q: 'Can I generate hashtags for different platforms?', a: 'Yes! Our generator supports Instagram, Twitter/X, LinkedIn, and TikTok with platform-specific hashtag recommendations.' },
    { q: 'Is this Hashtag Generator free?', a: 'Yes, completely free! Generate unlimited hashtags with no signup required.' },
  ],
  'thumbnail-text': [
    { q: 'What is a Thumbnail Text Generator?', a: 'It helps you create short, attention-grabbing text overlays for YouTube thumbnails that drive clicks and views.' },
    { q: 'How many words should thumbnail text have?', a: 'Effective thumbnail text is typically 2-5 words. Keep it short, bold, and readable even on small screens.' },
    { q: 'Is this tool free?', a: 'Yes! Generate unlimited thumbnail text ideas with color suggestions, completely free.' },
  ],
  'json-formatter': [
    { q: 'What is a JSON Formatter online?', a: 'A JSON Formatter online (also called a JSON Beautifier) takes raw, minified JSON and adds proper indentation, line breaks, and syntax highlighting, making API responses and config files instantly readable.' },
    { q: 'How do I use a JSON Beautifier for free?', a: 'Paste your minified JSON into ZeroApiTools\' free JSON Formatter, click Beautify, and get clean, indented JSON in one click. No signup, no upload — it runs 100% in your browser.' },
    { q: 'Is my JSON data safe when using this formatter?', a: 'Absolutely. All formatting and validation happens in your browser using JavaScript. Your JSON data is never transmitted to any server.' },
    { q: 'Can this JSON Formatter validate syntax errors?', a: 'Yes! The formatter simultaneously validates your JSON and highlights syntax errors like missing commas, unclosed brackets, or invalid values, showing you exactly where the problem is.' },
  ],
  'base64': [
    { q: 'What is Base64 encoding and when should I use it?', a: 'Base64 is a binary-to-text encoding scheme that converts data into ASCII characters. Use it for embedding images as data URIs in CSS, encoding Basic Auth headers, or safely transmitting binary data in JSON.' },
    { q: 'How do I encode or decode Base64 online for free?', a: 'Use ZeroApiTools\' free Base64 Encoder Decoder — paste your text to encode, or paste a Base64 string to decode. The result appears instantly with no signup or server upload required.' },
    { q: 'Is Base64 a secure encryption method?', a: 'No. Base64 is an encoding scheme, NOT encryption. It can be decoded by anyone instantly. Never use it to protect sensitive passwords or private data.' },
    { q: 'What is the difference between a Base64 encoder and decoder?', a: 'A Base64 encoder converts plain text or binary data into a Base64 string. A decoder reverses this — converting the Base64 string back into the original text. ZeroApiTools does both in one tool.' },
  ],
  'image-compress': [
    { q: 'How does a browser-based image compressor work?', a: 'It uses your browser\'s native Canvas API to re-encode images at a lower quality level, significantly reducing file size while maintaining acceptable visual quality — without uploading anything to a server.' },
    { q: 'How do I compress an image online for free without uploading it?', a: 'Open ZeroApiTools\' Image Compressor, drag and drop your image, adjust the quality slider, and download the compressed file. Your image never leaves your device.' },
    { q: 'What image formats does this compressor support?', a: 'The compressor supports JPEG, PNG, and WebP formats. You can also convert between formats (e.g., PNG to WebP) during the compression process for maximum optimization.' },
    { q: 'How much can I compress an image without losing quality?', a: 'For most photos, 70-85% quality setting reduces file size by 40-70% with no visible difference. For web use, WebP format at 80% quality is the gold standard.' },
  ],
  'pdf-merge': [
    { q: 'Can I merge PDFs for free?', a: 'Yes! ZeroApiTools PDF Merger is 100% free and processes files entirely in your browser.' },
    { q: 'Are my PDF files safe?', a: 'Absolutely. No files are uploaded to any server. All merging happens locally on your device.' },
    { q: 'Is there a file size limit?', a: 'Since processing happens in your browser, it depends on your device\'s memory. Most modern devices can handle files up to 50-100MB easily.' },
  ],
  'gst-calc': [
    { q: 'What is GST?', a: 'GST (Goods and Services Tax) is an indirect tax in India that replaced multiple state and central taxes. It has slabs of 5%, 12%, 18%, and 28%.' },
    { q: 'How to calculate GST?', a: 'GST Amount = (Original Price × GST Rate) / 100. For inclusive calculation: Original Price = Price / (1 + GST Rate/100).' },
    { q: 'What is CGST and SGST?', a: 'CGST (Central GST) and SGST (State GST) are equal halves of the total GST for intra-state transactions. For interstate, IGST applies.' },
  ],
  'html-entity': [
    { q: 'What is an HTML Entity?', a: 'HTML entities are used to display reserved characters (like <, >, &) or invisible characters in HTML. They start with an ampersand (&) and end with a semicolon (;).' },
    { q: 'How does the converter work?', a: 'It replaces special characters with their corresponding HTML entities for encode, and vice versa for decode. All processing happens locally in your browser.' },
  ],

  // ── Keyword-targeted FAQs for AnswerThePublic "Not Covered" tools ──
  'regex-tester': [
    { q: 'What is a regex tester online?', a: 'A regex tester online (regular expression tester) lets you write a pattern and test it against any text in real time, showing live match highlights and capture groups — right in your browser.' },
    { q: 'Is this regex tester free for beginners?', a: 'Yes! ZeroApiTools\' Regex Tester is 100% free with no signup. It\'s designed for beginners with live highlighting and flag toggles, but powerful enough for experienced developers.' },
    { q: 'What regex engine does this tester use?', a: 'It uses JavaScript\'s built-in RegExp engine — perfect for testing patterns for frontend validation, Node.js scripts, and browser-based string matching.' },
    { q: 'Is my test data uploaded to a server?', a: 'No. Everything runs entirely in your browser. Your regex patterns and test strings are never sent anywhere.' },
  ],

  'gradient': [
    { q: 'What is a CSS generator online?', a: 'A CSS generator online is a visual tool that lets you configure CSS properties (like gradients, shadows, or flexbox) through sliders and pickers, then generates the copy-paste CSS code for you.' },
    { q: 'Is this CSS gradient generator free?', a: 'Yes — completely free, no signup. ZeroApiTools also includes a CSS Box Shadow Generator, Flexbox Generator, Border Radius Generator, and Glassmorphism Generator, all free.' },
    { q: 'Does the generated CSS work in all browsers?', a: 'Yes. The generated gradient CSS includes standard syntax that works in all modern browsers including Chrome, Firefox, Safari, and Edge.' },
    { q: 'Can I use this for Tailwind CSS?', a: 'Yes. The generated standard CSS can be adapted into Tailwind\'s arbitrary value syntax, e.g., `bg-[linear-gradient(to_right,#f00,#00f)]`.' },
  ],

  'curl-to-fetch': [
    { q: 'What is a cURL converter online?', a: 'A cURL converter online parses a cURL terminal command and converts it into equivalent JavaScript fetch(), Axios, or other HTTP library code — saving you time when working with API documentation.' },
    { q: 'How do I convert cURL to JavaScript?', a: 'Paste your cURL command into ZeroApiTools\' free cURL to JavaScript converter and get the equivalent fetch() or Axios code instantly. No signup, no upload.' },
    { q: 'What cURL flags are supported?', a: 'The converter supports -X (method), -H (headers), -d/--data (body), --user (Basic Auth), -b (cookies), and most common cURL options used in API testing.' },
    { q: 'Is my API data safe when using this converter?', a: 'Yes. The conversion happens entirely in your browser using JavaScript. Your cURL commands, headers, and API keys never leave your device.' },
  ],

  'html-beautifier': [
    { q: 'What is an HTML formatter online?', a: 'An HTML formatter (HTML beautifier) takes minified or poorly indented HTML and adds correct indentation and line breaks, making the DOM structure clear and readable.' },
    { q: 'Is this HTML formatter free with no upload?', a: 'Yes. ZeroApiTools\' HTML Formatter is completely free and runs 100% in your browser. Your HTML code is never uploaded to any server.' },
    { q: 'Can I also minify HTML with this tool?', a: 'Yes! The tool works both ways — click Minify to remove all whitespace and produce a compact, production-ready HTML string.' },
    { q: 'What is the difference between an HTML formatter and a validator?', a: 'An HTML formatter adds indentation and improves readability. An HTML validator checks whether your markup is standards-compliant (proper tags, attributes, nesting). This tool focuses on formatting.' },
  ],

  'chmod-calc': [
    { q: 'What is a chmod calculator in Linux?', a: 'A chmod calculator helps you compute Linux file permission values visually — you check read/write/execute for Owner, Group, and Others, and instantly get the numeric value (like 755 or 644) for the chmod command.' },
    { q: 'What does chmod 755 mean?', a: 'chmod 755 means the Owner has full read+write+execute permissions (7), while Group and Others have read+execute only (5). It\'s the standard permission for web server scripts and public directories.' },
    { q: 'What does chmod 644 mean?', a: 'chmod 644 gives the Owner read+write access (6) and Group/Others read-only access (4). It\'s the standard for web files like HTML, CSS, and images that should not be executed.' },
    { q: 'Is this Linux file permission calculator free?', a: 'Yes — completely free, no signup. Toggle permissions visually and instantly get the numeric chmod value and symbolic notation. Runs 100% in your browser.' },
  ],

  'markdown-preview': [
    { q: 'What is a Markdown editor online?', a: 'A Markdown editor online is a split-pane tool where you write Markdown syntax on the left (like # Heading, **bold**, - list) and see the rendered HTML output on the right, updated live as you type.' },
    { q: 'Is this Markdown editor free?', a: 'Yes — 100% free, no signup, no upload. ZeroApiTools\' Markdown Editor runs entirely in your browser and supports all standard CommonMark syntax.' },
    { q: 'Can I use this as a free README editor?', a: 'Absolutely. This is the perfect tool for writing GitHub README.md files — write your Markdown and preview exactly how it will render before you commit.' },
    { q: 'What Markdown syntax is supported?', a: 'All standard CommonMark Markdown: headings (#), bold (**), italic (*), links, images, ordered/unordered lists, blockquotes, fenced code blocks (```), and tables.' },
  ],

  'password-gen': [
    { q: 'Is this password generator secure?', a: 'Yes. Passwords are generated using your browser\'s cryptographic crypto.getRandomValues() API — the most secure source of randomness available in a browser. No password is ever sent to a server.' },
    { q: 'How long should a strong password be?', a: 'Security experts recommend at least 16 characters combining uppercase, lowercase, numbers, and symbols. For critical accounts like banking or email, use 24+ characters.' },
    { q: 'Are generated passwords stored anywhere?', a: 'No. Password generation is 100% local. Your passwords are never stored, logged, or transmitted. They exist only in your browser tab and are gone when you close it.' },
    { q: 'Is this password generator free with no signup?', a: 'Yes — completely free, no account, no limits. Generate unlimited strong passwords directly in your browser.' },
  ],

  'js-beautifier': [
    { q: 'What is a code beautifier online?', a: 'A code beautifier (code formatter) takes minified or messy source code and reformats it with consistent indentation, line breaks, and spacing — making it readable and maintainable.' },
    { q: 'What is the difference between a code beautifier and a code minifier?', a: 'A beautifier expands code with whitespace and indentation for readability. A minifier removes all unnecessary characters to shrink file size for production performance. This tool does both.' },
    { q: 'Does this JS beautifier upload my code?', a: 'No. All formatting and minification runs in your browser using JavaScript. Your code never leaves your device — especially important for proprietary or sensitive code.' },
    { q: 'Is this JavaScript code beautifier free?', a: 'Yes — 100% free, no signup. Paste any JavaScript code and instantly beautify or minify it in one click.' },
  ],

  'diff-checker': [
    { q: 'What is a text diff checker online?', a: 'A text diff checker compares two blocks of text line-by-line and highlights exactly what changed — additions in green, deletions in red. It\'s essential for code reviews, config comparisons, and catching subtle changes.' },
    { q: 'Is this text diff checker free and private?', a: 'Yes — completely free and 100% private. The comparison runs entirely in your browser. Your text is never sent to any server or stored.' },
    { q: 'Can I compare code files with this tool?', a: 'Yes. It works for any plain text — JavaScript, HTML, CSS, JSON, YAML, SQL, or prose. Just paste the contents of two files to see what changed.' },
    { q: 'Does this diff checker show line numbers?', a: 'Yes. The diff output shows line-by-line comparison with clear visual distinction between unchanged lines, added lines (green), and removed lines (red).' },
  ],

  'flexbox': [
    { q: 'What is a CSS Flexbox generator online?', a: 'A CSS Flexbox generator is a visual playground where you click flex container properties like justify-content, align-items, and flex-direction, see items rearrange live, and copy the generated CSS instantly.' },
    { q: 'Is this Flexbox generator free?', a: 'Yes — 100% free, no signup. The Flexbox Playground runs entirely in your browser with no limits.' },
    { q: 'What is the difference between justify-content and align-items?', a: 'justify-content aligns items along the main axis (horizontal for row). align-items aligns along the cross axis (vertical for row). Use the playground to see the visual difference instantly.' },
    { q: 'Can I learn Flexbox with this tool?', a: 'Absolutely — it\'s one of the best free tools to learn CSS Flexbox visually. Click each property value and watch the child elements move in real time to understand exactly what each property does.' },
  ],

  'uuid': [
    { q: 'What is a UUID generator online?', a: 'A UUID generator creates random, RFC 4122-compliant Version 4 UUIDs (Universally Unique Identifiers) — 128-bit identifiers used as database primary keys, session tokens, and file names.' },
    { q: 'Is a UUID the same as a GUID?', a: 'Yes. GUID (Globally Unique Identifier) is Microsoft\'s term for UUID. They follow the same standard and are fully interchangeable in format and usage.' },
    { q: 'Are generated UUIDs truly unique?', a: 'Version 4 UUIDs use 122 bits of randomness. The probability of a collision is 1 in 5.3×10³⁶ — effectively zero. Every generated UUID can be safely treated as globally unique.' },
    { q: 'Is this UUID generator free with no signup?', a: 'Yes — 100% free. Generate 1 to 100 UUIDs at once in standard, no-hyphen, or uppercase formats. Runs entirely in your browser.' },
  ],

  'cron-parser': [
    { q: 'What is a cron expression generator online?', a: 'A cron expression generator/parser translates 5-field cron syntax (like 0 9 * * 1-5) into plain English (e.g., "Every weekday at 9:00 AM") and shows upcoming execution times.' },
    { q: 'What does * * * * * mean in cron?', a: '* * * * * means "every minute". The five fields are: Minute (0-59), Hour (0-23), Day of Month (1-31), Month (1-12), Day of Week (0-7). An asterisk (*) means "every" for that field.' },
    { q: 'What is the difference between 0 * * * * and */5 * * * *?', a: '0 * * * * runs once per hour at minute 0. */5 * * * * runs every 5 minutes. The / operator means "every N units" — so */5 means "every 5th minute".' },
    { q: 'Is this cron expression parser free?', a: 'Yes — 100% free, no signup. Parse and generate cron expressions instantly in your browser with plain English translation and next-run timestamps.' },
  ],

  'css-beautifier': [
    { q: 'What is a CSS beautifier online?', a: 'A CSS beautifier (CSS formatter) takes minified or unstructured CSS and adds proper indentation, line breaks between properties, and consistent formatting — making stylesheets readable and maintainable.' },
    { q: 'Is this CSS code minifier free?', a: 'Yes — 100% free, no signup. This tool works both as a CSS beautifier and CSS minifier. Minify mode removes all whitespace to reduce file size for production.' },
    { q: 'Does this CSS beautifier upload my code?', a: 'No. All formatting happens in your browser. Your CSS code is never uploaded to any server — safe for proprietary stylesheets.' },
    { q: 'Can I use this to format SCSS or Sass?', a: 'This tool is optimized for standard CSS. For SCSS/Sass, the beautification may work partially since SCSS is a superset of CSS, but nested rules may not format perfectly.' },
  ],
};

export const GENERIC_FAQS = [
  { q: 'Is this tool free to use?', a: 'Yes! All tools on ZeroApiTools are 100% free with no signup required.' },
  { q: 'Is my data safe?', a: 'Absolutely. All processing happens locally in your browser. No data is ever sent to any server.' },
  { q: 'Does this tool work on mobile?', a: 'Yes! ZeroApiTools is fully responsive and works on all devices — desktop, tablet, and mobile.' },
];