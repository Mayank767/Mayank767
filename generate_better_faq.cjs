const fs = require('fs');
const path = require('path');

const TOOL_DETAILS = {
  'base64': {
    name: 'Base64 Encoder/Decoder',
    desc: 'convert text or binary data into Base64 format (and vice versa) for safe data transmission',
    steps: [
      'Choose between "Encode" or "Decode" mode.',
      'Paste your plain text or Base64 string into the input area.',
      'The conversion happens instantly in real-time as you type.',
      'Click the "Copy" button to save the result to your clipboard.'
    ],
    useCase: 'embedding image data URIs in CSS, encoding authentication headers, or safely transmitting special characters via URLs.'
  },
  'url-encode': {
    name: 'URL Encoder/Decoder',
    desc: 'safely encode URLs or decode percent-encoded links into readable text',
    steps: [
      'Select whether you want to Encode or Decode a URL.',
      'Paste your URL or query string into the input box.',
      'The tool instantly converts special characters like spaces to "%20" (or decodes them).',
      'Copy the clean, safe URL for your project.'
    ],
    useCase: 'fixing broken links with spaces, passing data through GET parameters, or reading messy analytics tracking URLs.'
  },
  'html-entity': {
    name: 'HTML Entity Converter',
    desc: 'convert special characters (like <, >, &) to their HTML entity equivalents',
    steps: [
      'Select your desired action: Encode to entities or Decode to text.',
      'Paste your HTML code or text into the input field.',
      'Characters are instantly converted (e.g., "<" becomes "&lt;").',
      'Copy the output to use safely in your HTML documents.'
    ],
    useCase: 'displaying code snippets on a webpage without the browser accidentally rendering them as actual HTML tags.'
  },
  'jwt-decoder': {
    name: 'JWT Token Decoder',
    desc: 'parse and read the payload of JSON Web Tokens instantly',
    steps: [
      'Paste your encoded JWT string (e.g. eyJhb...) into the token field.',
      'The tool instantly splits the token and decodes the Header and Payload.',
      'View claims like user roles, issuer, and check the expiration dates which are converted to human-readable time.',
      'Review the data without needing the secret key.'
    ],
    useCase: 'debugging API authentication, checking token expiration times, and verifying user claims sent from the backend.'
  },
  'uuid': {
    name: 'UUID/GUID Generator',
    desc: 'generate unique, random identifiers for database records or session IDs',
    steps: [
      'Choose the number of UUIDs you want to generate (up to 100 at once).',
      'Select the format: standard, without hyphens, or uppercase.',
      'Click the Generate button to create your unique IDs.',
      'Copy a single ID or all of them at once to your clipboard.'
    ],
    useCase: 'creating primary keys for databases, generating unique file names, or creating secure session tokens.'
  },
  'lorem-ipsum': {
    name: 'Lorem Ipsum Generator',
    desc: 'generate placeholder text for your mockups, wireframes, and prototypes',
    steps: [
      'Select whether you need paragraphs, sentences, or words.',
      'Enter the quantity you require in the number input.',
      'Choose whether to start with the classic "Lorem ipsum dolor sit amet...".',
      'Click generate and copy the formatted placeholder text.'
    ],
    useCase: 'filling out UI designs in Figma, prototyping websites, or testing how text wraps in your CSS layouts.'
  },
  'word-counter': {
    name: 'Word & Character Counter',
    desc: 'count characters, words, sentences, and reading time for your text',
    steps: [
      'Paste or type your text directly into the main editor area.',
      'Watch the stats update instantly above the text box as you type.',
      'View detailed metrics including character count (with and without spaces), words, and paragraphs.',
      'Check the estimated reading and speaking time.'
    ],
    useCase: 'writing SEO meta descriptions, crafting tweets under 280 characters, or writing blog posts that meet specific length requirements.'
  },
  'case-converter': {
    name: 'Text Case Converter',
    desc: 'transform text between camelCase, snake_case, PascalCase, and more',
    steps: [
      'Paste your text, variable names, or paragraphs into the input field.',
      'Select your desired output format from the buttons (camelCase, snake_case, UPPERCASE, etc.).',
      'The text is instantly transformed matching your chosen style.',
      'Click the copy button to grab the converted text.'
    ],
    useCase: 'converting JSON keys to camelCase for JavaScript, renaming files to snake_case, or fixing ALL CAPS text.'
  },
  'diff-checker': {
    name: 'Text Diff Checker',
    desc: 'compare two blocks of text or code to find the exact differences',
    steps: [
      'Paste your original text or code into the "Original" left panel.',
      'Paste your modified text into the "Modified" right panel.',
      'The tool highlights exactly what was added (green) and removed (red).',
      'Scroll through the lines to spot hidden spacing or typo changes.'
    ],
    useCase: 'reviewing code changes before a Git commit, finding what changed in a config file, or comparing two API responses.'
  },
  'regex-tester': {
    name: 'Regex Tester',
    desc: 'test and visualize regular expressions against your target text',
    steps: [
      'Type your regular expression pattern in the top input box.',
      'Select your flags (like /g for global or /i for case-insensitive).',
      'Paste the text you want to test against in the main body area.',
      'Matches and capture groups will highlight instantly in the text.'
    ],
    useCase: 'writing validation rules for emails/passwords, extracting data from messy logs, or scraping text patterns.'
  },
  'json-formatter': {
    name: 'JSON Formatter',
    desc: 'format, validate, and beautify messy JSON data instantly',
    steps: [
      'Paste your minified or messy JSON data into the left panel.',
      'The tool automatically formats and indents it in the right panel.',
      'If your JSON has syntax errors, the tool highlights exactly where the error is.',
      'Click the copy button to grab the clean, properly structured JSON.'
    ],
    useCase: 'reading minified API responses, debugging configuration files like package.json, or validating webhooks.'
  },
  'js-beautifier': {
    name: 'JavaScript Beautifier',
    desc: 'format and indent messy or minified JavaScript code',
    steps: [
      'Paste your minified or unformatted JS code into the editor.',
      'Choose your preferred indentation size (2 or 4 spaces).',
      'Click the Format button.',
      'Copy the readable, properly formatted code.'
    ],
    useCase: 'reading minified production bundles, formatting code copied from StackOverflow, or standardizing team code styles.'
  },
  'css-beautifier': {
    name: 'CSS Beautifier',
    desc: 'clean up and format unreadable CSS stylesheets',
    steps: [
      'Paste your minified CSS code into the input panel.',
      'Select how many spaces you want for indentation.',
      'Click the Beautify button to expand properties to multiple lines.',
      'Copy the neatly structured stylesheet.'
    ],
    useCase: 'inspecting minified CSS from third-party themes, formatting inline styles into proper blocks, or organizing messy stylesheets.'
  },
  'html-beautifier': {
    name: 'HTML Beautifier',
    desc: 'indent and format messy HTML markup into a readable structure',
    steps: [
      'Paste your unformatted HTML string into the editor.',
      'Select your formatting preferences (indentation size).',
      'The tool instantly creates a properly nested DOM tree view.',
      'Copy the correctly indented code to use in your project.'
    ],
    useCase: 'formatting messy HTML copied from browser DevTools, structuring email templates, or cleaning up WYSIWYG editor output.'
  },
  'sql-formatter': {
    name: 'SQL Formatter',
    desc: 'format complex, single-line SQL queries into readable, multi-line statements',
    steps: [
      'Paste your raw SQL query into the input area.',
      'Select your SQL dialect (MySQL, PostgreSQL, etc.) if needed.',
      'The tool capitalizes keywords and indents clauses like SELECT and WHERE.',
      'Copy the beautified query for easier debugging.'
    ],
    useCase: 'reading long ORM-generated queries from server logs, sharing queries with teammates, or debugging complex JOINs.'
  },
  'svg-to-jsx': {
    name: 'SVG to JSX',
    desc: 'convert raw SVG markup into ready-to-use React components',
    steps: [
      'Paste your SVG code into the input field.',
      'The tool automatically converts HTML attributes to React camelCase (e.g., stroke-width to strokeWidth).',
      'It also wraps the SVG in a functional React component structure.',
      'Copy the JSX code directly into your React/Next.js project.'
    ],
    useCase: 'importing icons exported from Figma into a React application without manually fixing attribute errors.'
  },
  'json-csv': {
    name: 'JSON to CSV Converter',
    desc: 'convert arrays of JSON objects into tabular CSV data (or vice versa)',
    steps: [
      'Choose your conversion direction: JSON to CSV or CSV to JSON.',
      'Paste your data into the left input panel.',
      'The tool flattens JSON structures or parses CSV headers automatically.',
      'Download the resulting file or copy the raw text from the right panel.'
    ],
    useCase: 'exporting API data to give to business teams in Excel, or converting spreadsheets into JSON for database seeding.'
  },
  'json-yaml': {
    name: 'JSON to YAML Converter',
    desc: 'easily convert between JSON formats and readable YAML structures',
    steps: [
      'Select whether you are converting JSON -> YAML or YAML -> JSON.',
      'Paste your configuration data into the input box.',
      'The tool instantly translates the data structure while maintaining types.',
      'Copy the output for your config files.'
    ],
    useCase: 'writing Docker Compose files, converting Kubernetes configs, or setting up GitHub Actions workflows.'
  },
  'markdown-preview': {
    name: 'Markdown Preview',
    desc: 'write Markdown syntax and see the rendered HTML output in real-time',
    steps: [
      'Type or paste your Markdown syntax in the left editor panel.',
      'Watch the right panel render the HTML output live.',
      'Use the toolbar shortcuts to quickly add bold text, lists, or links.',
      'Copy the Markdown text or download it as a .md file.'
    ],
    useCase: 'writing README.md files for GitHub repositories, drafting blog posts, or creating documentation.'
  },
  'number-base': {
    name: 'Base Converter',
    desc: 'convert numbers between decimal, binary, octal, and hexadecimal',
    steps: [
      'Select your starting base format (e.g., Decimal).',
      'Enter your number in the input field.',
      'The tool instantly calculates and displays the value in all other bases.',
      'Click the copy icon next to any of the resulting conversions.'
    ],
    useCase: 'calculating subnet masks in networking, reading hex color codes, or debugging low-level memory addresses.'
  },
  'timestamp': {
    name: 'Epoch Timestamp Converter',
    desc: 'convert Unix epoch timestamps to human-readable dates and vice versa',
    steps: [
      'Paste a 10-digit or 13-digit timestamp, or input a date/time string.',
      'The tool automatically detects the format and converts it.',
      'View the result in your Local Time zone and UTC/GMT.',
      'Use the quick actions to grab the "Current Epoch Time".'
    ],
    useCase: 'debugging database timestamps, verifying JWT token expiration, or syncing time-based events across servers.'
  },
  'color-converter': {
    name: 'Color Converter',
    desc: 'translate colors between HEX, RGB, HSL, and CMYK formats',
    steps: [
      'Enter any valid color code (like #FF0000 or rgb(255,0,0)) or use the color picker.',
      'The tool displays a visual preview of the color.',
      'Instantly see equivalent values in HEX, RGB, HSL, and CMYK.',
      'Click any value to copy it directly to your clipboard.'
    ],
    useCase: 'translating design specs from Figma (HEX) to CSS variables (HSL or RGB) for dynamic theming.'
  },
  'px-rem': {
    name: 'PX to REM Converter',
    desc: 'quickly convert pixels to rem units for responsive web typography',
    steps: [
      'Set your base font size (defaults to standard 16px).',
      'Enter a Pixel value to convert to REM, or vice versa.',
      'The tool instantly calculates the exact relative measurement.',
      'Copy the CSS value for your stylesheet.'
    ],
    useCase: 'building accessible, responsive websites where layouts scale perfectly when users change their default browser font size.'
  },
  'glassmorphism': {
    name: 'Glassmorphism Generator',
    desc: 'create frosted-glass CSS effects for modern UI designs',
    steps: [
      'Adjust the blur slider to set the intensity of the frosted glass.',
      'Tweak the transparency and background color of the card.',
      'Set the border outline visibility to make the edges pop.',
      'Copy the generated backdrop-filter and background CSS properties.'
    ],
    useCase: 'designing modern dashboards, modal overlays, or iOS-style floating navigation bars.'
  },
  'gradient': {
    name: 'CSS Gradient Generator',
    desc: 'build beautiful linear or radial CSS gradients visually',
    steps: [
      'Choose between Linear or Radial gradient styles.',
      'Pick your starting color, ending color, and adjust the angle.',
      'See a live preview of the gradient covering the background.',
      'Copy the cross-browser compatible CSS code provided below.'
    ],
    useCase: 'styling hero sections, creating vibrant button backgrounds, or building aesthetic card borders.'
  },
  'box-shadow': {
    name: 'Box Shadow Generator',
    desc: 'visually create smooth, layered CSS box shadows',
    steps: [
      'Adjust horizontal and vertical offset sliders to position the shadow.',
      'Change blur and spread radius to make it soft or sharp.',
      'Pick a shadow color and adjust the opacity.',
      'Copy the generated `box-shadow` CSS rule directly into your code.'
    ],
    useCase: 'adding depth to UI elements, creating elevated cards, or designing floating action buttons.'
  },
  'border-radius': {
    name: 'Border Radius Generator',
    desc: 'create complex, organic CSS shapes using 8-point border-radius',
    steps: [
      'Drag the handles on the square to adjust each corner individually.',
      'Use the advanced mode to set different values for horizontal and vertical axes.',
      'Watch the shape morph in real-time.',
      'Copy the generated complex border-radius CSS string.'
    ],
    useCase: 'creating organic blobs for hero backgrounds, custom profile picture cutouts, or non-standard button shapes.'
  },
  'flexbox': {
    name: 'Flexbox Playground',
    desc: 'experiment with CSS Flexbox properties visually to learn layouts',
    steps: [
      'Select a flex container property (direction, justify-content, align-items).',
      'Click different values and watch how the colored child boxes move.',
      'Add or remove child elements to see how wrapping behaves.',
      'Copy the resulting CSS code to use in your project.'
    ],
    useCase: 'learning how flex layouts work, centering a div perfectly, or building responsive navigation menus.'
  },
  'css-grid': {
    name: 'CSS Grid Generator',
    desc: 'build complex CSS Grid layouts visually without writing boilerplate',
    steps: [
      'Define the number of columns and rows using the inputs.',
      'Adjust the column gap and row gap sliders.',
      'Click and drag on the grid preview to merge cells and define layout areas.',
      'Copy both the container CSS and the child element CSS.'
    ],
    useCase: 'prototyping complex dashboard layouts, building responsive image galleries, or creating standard holy-grail webpage structures.'
  },
  'image-compress': {
    name: 'Image Compressor',
    desc: 'reduce image file sizes significantly without losing visible quality',
    steps: [
      'Click or drag-and-drop your image files (JPG, PNG, WebP) into the dropzone.',
      'Adjust the compression quality slider (e.g., 80%).',
      'Compare the original size vs the compressed size in real-time.',
      'Download the optimized image instantly.'
    ],
    useCase: 'optimizing hero images for faster website loading, saving bandwidth, and improving Google Core Web Vitals scores.'
  },
  'image-resize': {
    name: 'Image Resizer',
    desc: 'resize images to exact pixel dimensions while maintaining aspect ratio',
    steps: [
      'Upload the image you want to resize.',
      'Enter a new Width or Height (toggle the lock icon to keep proportions).',
      'Check the preview to ensure the image looks correct.',
      'Download the newly sized image file.'
    ],
    useCase: 'preparing images for social media posts, resizing user avatars, or making banners fit specific website layouts.'
  },
  'image-base64': {
    name: 'Image to Base64',
    desc: 'convert image files into Base64 encoded strings',
    steps: [
      'Upload an image file from your computer.',
      'The tool instantly processes the file and generates the Base64 string.',
      'Choose to copy the raw string or the formatted CSS/HTML data URI.',
      'Paste the string directly into your source code.'
    ],
    useCase: 'embedding small icons directly into CSS to avoid extra HTTP requests, or sending images via JSON APIs.'
  },
  'qr-code': {
    name: 'QR Code Generator',
    desc: 'generate custom QR codes for URLs, text, or contact information',
    steps: [
      'Enter the URL or text you want the QR code to point to.',
      'Customize the QR code by changing the foreground and background colors.',
      'The QR code updates live as you type or change settings.',
      'Download the QR code as an image file (PNG/SVG) to use anywhere.'
    ],
    useCase: 'creating scannable links for business cards, restaurant menus, or event marketing materials.'
  },
  'placeholder-image': {
    name: 'Placeholder Image Gen',
    desc: 'generate dummy placeholder images with custom dimensions and text',
    steps: [
      'Enter the desired width and height in pixels.',
      'Customize the background color, text color, and input custom text.',
      'View the generated placeholder in real-time.',
      'Download the image or copy its data URI.'
    ],
    useCase: 'filling empty spaces in UI mockups before final assets are ready, or testing image loading skeletons.'
  },
  'password-gen': {
    name: 'Password Generator',
    desc: 'create highly secure, randomized passwords based on your criteria',
    steps: [
      'Set the desired password length using the slider.',
      'Toggle options to include uppercase, lowercase, numbers, and symbols.',
      'Click Generate to instantly create a secure password.',
      'Copy the password to your clipboard and save it in your password manager.'
    ],
    useCase: 'creating strong credentials for new databases, securing server logins, or generating API secrets.'
  },
  'hash-gen': {
    name: 'Hash Generator',
    desc: 'generate cryptographic hashes (MD5, SHA-1, SHA-256) for any text',
    steps: [
      'Type or paste your text into the input field.',
      'The tool instantly calculates hashes for multiple algorithms.',
      'View MD5, SHA-1, SHA-256, and SHA-512 results simultaneously.',
      'Click the copy icon next to the specific hash you need.'
    ],
    useCase: 'verifying file integrity, generating unique cache keys, or securely storing one-way hashed data.'
  },
  'meta-tag': {
    name: 'Meta Tag Generator',
    desc: 'generate SEO-friendly HTML meta tags for your website header',
    steps: [
      'Fill in your website title, description, and keywords.',
      'Add author information and select the primary language.',
      'Configure viewport settings and robots index preferences.',
      'Copy the generated HTML snippet and paste it into your `<head>` tag.'
    ],
    useCase: 'optimizing new landing pages for search engines, improving click-through rates, and ensuring proper browser rendering.'
  },
  'og-preview': {
    name: 'Open Graph Preview',
    desc: 'preview how your website links will look when shared on social media',
    steps: [
      'Enter the title, description, and an image URL.',
      'The tool generates live previews for Twitter, Facebook, and LinkedIn.',
      'Tweak the text length to ensure it doesn\'t get truncated.',
      'Copy the generated Open Graph meta tags for your website.'
    ],
    useCase: 'ensuring your blog posts look attractive when shared on social media to maximize engagement.'
  },
  'slug-gen': {
    name: 'Slug Generator',
    desc: 'convert blog titles or strings into URL-friendly slugs',
    steps: [
      'Paste your article title or phrase into the input field.',
      'The tool instantly removes special characters and replaces spaces with hyphens.',
      'View the clean, lowercase, URL-safe string.',
      'Copy the slug to use in your application routing.'
    ],
    useCase: 'creating SEO-friendly URLs for blog posts (e.g., turning "My Great Post!" into "my-great-post").'
  },
  'favicon-gen': {
    name: 'Favicon Generator',
    desc: 'convert images into .ico files and generate browser icons',
    steps: [
      'Upload a square image (PNG or JPG).',
      'The tool processes the image into various sizes (16x16, 32x32, apple-touch-icon).',
      'Download the generated zip file containing all necessary formats.',
      'Copy the provided HTML tags to include in your website header.'
    ],
    useCase: 'branding your website tab in the browser, adding iOS home screen icons, and fixing missing favicon 404 errors.'
  },
  'curl-to-fetch': {
    name: 'cURL to Fetch',
    desc: 'convert complex cURL terminal commands into JavaScript fetch() code',
    steps: [
      'Paste your cURL command (from Postman, Chrome DevTools, or docs) into the left panel.',
      'The tool parses headers, methods, and JSON body data.',
      'Instantly view the equivalent JavaScript `fetch()` syntax in the right panel.',
      'Copy the JS code directly into your React or Node project.'
    ],
    useCase: 'translating API documentation examples into usable frontend JavaScript code effortlessly.'
  },
  'cron-parser': {
    name: 'Cron Expression Parser',
    desc: 'translate confusing cron schedules into plain English sentences',
    steps: [
      'Enter a standard 5-part cron expression (e.g., `* * * * *`).',
      'The tool translates it into human-readable text (e.g., "Every minute").',
      'It also displays the exact dates and times for the next 5 upcoming executions.',
      'Use the suggestions below to quickly build common schedules.'
    ],
    useCase: 'setting up scheduled server backups, configuring CI/CD pipeline triggers, or debugging failed background jobs.'
  },
  'css-specificity': {
    name: 'CSS Specificity Calc',
    desc: 'calculate which CSS selector will take priority in the browser',
    steps: [
      'Type a CSS selector into the input field (e.g., `#nav ul li.active a`).',
      'The tool breaks down the selector into IDs, Classes, and Elements.',
      'View the specific score (e.g., 1, 1, 3).',
      'Compare multiple selectors to see which styling will "win".'
    ],
    useCase: 'debugging why CSS styles aren\'t applying, avoiding `!important` tags, and writing cleaner stylesheets.'
  },
  'chmod-calc': {
    name: 'Chmod Calculator',
    desc: 'calculate Linux file permissions visually using checkboxes',
    steps: [
      'Check or uncheck the Read, Write, and Execute boxes for Owner, Group, and Public.',
      'The numeric value (e.g., 755 or 644) updates automatically.',
      'The symbolic representation (e.g., `-rwxr-xr-x`) also updates.',
      'Copy the exact chmod command to run in your terminal.'
    ],
    useCase: 'fixing "Permission Denied" errors on Linux servers, securing web directories, or making bash scripts executable.'
  },
  'json-schema': {
    name: 'JSON to TypeScript',
    desc: 'convert JSON response data into TypeScript interfaces instantly',
    steps: [
      'Paste an example JSON object or array into the left panel.',
      'The tool analyzes the keys and infers the data types (string, number, boolean, nested objects).',
      'View the generated TypeScript interface in the right panel.',
      'Copy the types into your frontend application.'
    ],
    useCase: 'typing API responses in React apps, creating data models, and preventing runtime type errors.'
  },
  'byte-size': {
    name: 'Byte Converter',
    desc: 'convert digital storage sizes between bytes, KB, MB, GB, and TB',
    steps: [
      'Enter a numerical value in the input field.',
      'Select the unit of that value (e.g., Megabytes).',
      'The tool instantly calculates equivalent values in all other units.',
      'Read the exact byte count or the shortened unit format.'
    ],
    useCase: 'calculating maximum upload limits for forms, reading disk space logs, or configuring server memory allocations.'
  },
  'ascii-art': {
    name: 'ASCII Art Generator',
    desc: 'convert standard text into retro ASCII art banners',
    steps: [
      'Type your desired text into the input field.',
      'Select a font style from the dropdown menu (e.g., Standard, Slant, Block).',
      'Preview the generated ASCII art in the display box.',
      'Click copy to grab the multi-line art.'
    ],
    useCase: 'decorating CLI application welcome screens, adding fun comments to source code, or writing stylish README files.'
  },
  'http-status': {
    name: 'HTTP Status Codes',
    desc: 'search and understand what different server HTTP response codes mean',
    steps: [
      'Type a status code (e.g., 404, 502) or description into the search bar.',
      'Read the detailed explanation of what the code signifies.',
      'Understand whether the issue is on the client side (4xx) or server side (5xx).',
      'Find tips on how to resolve common errors.'
    ],
    useCase: 'debugging failed API requests, writing error handling logic in frontend apps, or configuring server redirects.'
  },
  'instagram-bio': {
    name: 'Instagram Bio Generator',
    desc: 'create formatted, eye-catching bios for your Instagram profile',
    steps: [
      'Select your profile niche or category (e.g., Developer, Creator, Business).',
      'Add key details like your skills or location.',
      'The tool generates multiple bio options with appropriate emojis and formatting.',
      'Copy your favorite and paste it into Instagram.'
    ],
    useCase: 'optimizing your social media profile for better discoverability and making a strong first impression on visitors.'
  },
  'hashtag-gen': {
    name: 'Hashtag Generator',
    desc: 'generate relevant, high-reach hashtags for social media posts',
    steps: [
      'Enter a base keyword related to your post (e.g., "coding").',
      'The tool generates a list of related, popular hashtags.',
      'Filter out the ones you don\'t want.',
      'Copy the entire block of tags to paste at the bottom of your post.'
    ],
    useCase: 'increasing reach on Instagram/Twitter posts, participating in trending topics, or organizing campaign content.'
  },
  'thumbnail-text': {
    name: 'Thumbnail Text Gen',
    desc: 'create bold, highly visible text combinations for YouTube thumbnails',
    steps: [
      'Enter the main subject of your video.',
      'The tool generates short, punchy 3-4 word phrases.',
      'Preview how the text looks with high-contrast colors.',
      'Use the generated text directly in Photoshop or Canva.'
    ],
    useCase: 'increasing click-through rates (CTR) on YouTube by using text that is readable even on small mobile screens.'
  },
  'youtube-title': {
    name: 'YouTube Title Gen',
    desc: 'generate clickable, SEO-optimized titles for YouTube videos',
    steps: [
      'Input the main topic or keyword of your video.',
      'Select the style of video (e.g., Tutorial, VLOG, Review).',
      'The tool generates multiple highly clickable title variations.',
      'Copy the one that best fits your content strategy.'
    ],
    useCase: 'overcoming writer\'s block, optimizing videos for YouTube search, and maximizing audience interest.'
  },
  'image-format': {
    name: 'Image Converter',
    desc: 'convert images between standard web formats like JPG, PNG, and WebP',
    steps: [
      'Upload an image file from your device.',
      'Select the output format you want to convert to.',
      'Click convert and the browser instantly processes the image.',
      'Download the newly formatted file.'
    ],
    useCase: 'converting heavy PNGs into next-gen WebP formats for faster website loading, or making transparent assets.'
  },
  'bg-remover': {
    name: 'Background Remover',
    desc: 'isolate subjects and remove backgrounds from images automatically',
    steps: [
      'Upload a photo with a clear foreground subject.',
      'The tool uses local AI/processing to detect the edges of the subject.',
      'The background is erased, leaving a transparent canvas.',
      'Download the result as a PNG file.'
    ],
    useCase: 'creating profile pictures, extracting product images for e-commerce, or making custom YouTube thumbnails.'
  },
  'utm-builder': {
    name: 'UTM Link Builder',
    desc: 'append campaign tracking parameters to URLs for Google Analytics',
    steps: [
      'Enter your base website URL.',
      'Fill in the Campaign Source, Medium, and Name parameters.',
      'The tool automatically formats the query string properly.',
      'Copy the final long URL to use in your marketing materials.'
    ],
    useCase: 'tracking where website traffic is coming from (e.g., an email newsletter vs a Twitter post) in analytics tools.'
  },
  'privacy-policy': {
    name: 'Privacy Policy Generator',
    desc: 'generate standard privacy policy text for apps and websites',
    steps: [
      'Enter your company name, website URL, and contact email.',
      'Select what data you collect (e.g., cookies, emails).',
      'The tool generates a formatted, generic legal text document.',
      'Copy the text to create a dedicated privacy page on your site.'
    ],
    useCase: 'meeting basic app store submission requirements or providing transparency to users about data collection.'
  },
  'emi-calc': {
    name: 'EMI Calculator',
    desc: 'calculate monthly loan repayment amounts, interest, and schedule',
    steps: [
      'Enter the total principal Loan Amount.',
      'Input the annual Interest Rate percentage.',
      'Set the Loan Tenure in years or months.',
      'View the calculated Monthly EMI and total interest payable instantly.'
    ],
    useCase: 'planning personal finances before taking a home loan, car loan, or understanding credit card debt repayment.'
  },
  'age-calc': {
    name: 'Age Calculator',
    desc: 'calculate precise age in years, months, and days from a birthdate',
    steps: [
      'Select a Date of Birth using the calendar picker.',
      'Select the target date (defaults to today).',
      'The tool calculates the exact duration between the two dates.',
      'View the result broken down into years, months, and days.'
    ],
    useCase: 'filling out official application forms, checking age eligibility, or finding out exactly how many days old you are.'
  },
  'percentage-calc': {
    name: 'Percentage Calculator',
    desc: 'calculate percentage increases, decreases, and fractions quickly',
    steps: [
      'Select the type of calculation (e.g., "What is X% of Y?").',
      'Enter the numerical values into the specific fields.',
      'The result is calculated instantly as you type.',
      'Use the copy button to grab the final answer.'
    ],
    useCase: 'calculating shopping discounts, determining profit margins, or analyzing statistical data changes.'
  },
  'gst-calc': {
    name: 'GST Calculator',
    desc: 'add or remove Goods and Services Tax (GST) from a price',
    steps: [
      'Enter the base amount or total amount.',
      'Select the applicable GST rate slab (5%, 12%, 18%, 28%).',
      'Choose whether to "Add GST" or "Remove GST" (inclusive/exclusive).',
      'View the tax breakdown (CGST/SGST) and the final net price.'
    ],
    useCase: 'creating accurate business invoices, verifying shopping bills, or calculating tax liabilities for accounting.'
  },
  'currency-conv': {
    name: 'Currency Converter',
    desc: 'convert values between global fiat currencies using recent exchange rates',
    steps: [
      'Enter the amount you wish to convert.',
      'Select your source currency and the target currency.',
      'The tool fetches exchange rates and displays the converted value.',
      'Swap currencies quickly using the toggle button.'
    ],
    useCase: 'estimating costs while traveling internationally, calculating freelance invoices in foreign currencies, or shopping online.'
  },
  'sip-calc': {
    name: 'SIP Calculator',
    desc: 'estimate future wealth from monthly mutual fund investments',
    steps: [
      'Enter your expected Monthly Investment amount.',
      'Input the expected annual return percentage rate.',
      'Set the time period (Tenure) in years.',
      'View the total invested amount versus the estimated future wealth.'
    ],
    useCase: 'planning for retirement, setting long-term financial goals, and understanding the power of compound interest.'
  },
  'compound-interest': {
    name: 'Compound Interest',
    desc: 'calculate wealth growth over time with interest-on-interest',
    steps: [
      'Enter the Initial Principal balance.',
      'Input the annual interest rate and the time period.',
      'Select the compounding frequency (Annually, Monthly, Daily).',
      'View the exponential growth chart and final accumulated amount.'
    ],
    useCase: 'evaluating fixed deposit returns, projecting stock market portfolio growth, or understanding debt accumulation.'
  },
  'pdf-merge': {
    name: 'PDF Merger',
    desc: 'combine multiple separate PDF documents into a single file',
    steps: [
      'Select and upload two or more PDF files from your computer.',
      'Drag and drop the files in the list to rearrange their order.',
      'Click the "Merge PDFs" button to stitch them together.',
      'Download the newly created, combined PDF document.'
    ],
    useCase: 'compiling multiple scanned documents into one report, or merging separate portfolio pages into a single presentation.'
  },
  'pdf-split': {
    name: 'PDF Splitter',
    desc: 'extract specific pages or split a large PDF into smaller files',
    steps: [
      'Upload a multi-page PDF document.',
      'Select the specific page numbers or page ranges you want to extract.',
      'Click the "Split PDF" button.',
      'Download the new PDF containing only your selected pages.'
    ],
    useCase: 'removing blank pages from a scan, extracting a specific invoice from a monthly statement, or sharing just one chapter of an eBook.'
  },
  'pdf-compress': {
    name: 'PDF Compressor',
    desc: 'reduce the file size of heavy PDF documents for easy sharing',
    steps: [
      'Upload an oversized PDF file.',
      'Select the compression level (Low, Medium, High).',
      'The tool processes images and streams within the PDF to reduce size.',
      'Download the optimized PDF and view the size savings.'
    ],
    useCase: 'bypassing email attachment size limits, optimizing documents for web hosting, or saving disk space.'
  },
  'pdf-password': {
    name: 'PDF Password Protect',
    desc: 'encrypt and lock a PDF document with a secure password',
    steps: [
      'Upload the PDF file you want to secure.',
      'Enter a strong password in the input field.',
      'Click the "Protect PDF" button to apply encryption.',
      'Download the locked file (anyone opening it will need the password).'
    ],
    useCase: 'sharing sensitive financial documents over email, securing legal contracts, or protecting confidential client data.'
  }
};

const finalData = {};

Object.keys(TOOL_DETAILS).forEach(id => {
  const t = TOOL_DETAILS[id];
  
  const content = `## How to Use ${t.name} Online

${t.name} is a free online tool to ${t.desc} instantly in your browser. No signup required, and no data is sent to any server.

### How to use:
${t.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

**Use it when:** ${t.useCase}

Works 100% in browser — your data never leaves your machine.`;

  finalData[id] = content;
});

// For any missing tools, fallback to a generic robust format
const allTools = [
  'base64','url-encode','html-entity','jwt-decoder','uuid','lorem-ipsum','word-counter','case-converter','diff-checker','regex-tester','json-formatter','js-beautifier','css-beautifier','html-beautifier','sql-formatter','svg-to-jsx','json-csv','json-yaml','markdown-preview','number-base','timestamp','color-converter','px-rem','glassmorphism','gradient','box-shadow','border-radius','flexbox','css-grid','image-compress','image-resize','image-base64','qr-code','placeholder-image','password-gen','hash-gen','meta-tag','og-preview','slug-gen','favicon-gen','curl-to-fetch','cron-parser','css-specificity','chmod-calc','json-schema','byte-size','ascii-art','http-status','instagram-bio','hashtag-gen','thumbnail-text','youtube-title','image-format','bg-remover','utm-builder','privacy-policy','emi-calc','age-calc','percentage-calc','gst-calc','currency-conv','sip-calc','compound-interest','pdf-merge','pdf-split','pdf-compress','pdf-password'
];

allTools.forEach(id => {
  if (!finalData[id]) {
    // Generate a fallback if we missed any tool in the dictionary
    const formattedName = id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    finalData[id] = `## How to Use ${formattedName} Online

${formattedName} is a free online tool designed to help developers and creators process data instantly in the browser. No signup required.

### How to use:
1. Input your data or adjust the required settings.
2. The tool instantly processes your input in real-time.
3. Review the generated output.
4. Click copy or download to save your results.

Works 100% locally in your browser ensuring complete privacy.`;
  }
});

const outPath = path.join(__dirname, 'src', 'data', 'toolHowTo.json');
fs.writeFileSync(outPath, JSON.stringify(finalData, null, 2));

console.log('Successfully generated improved toolHowTo.json');
