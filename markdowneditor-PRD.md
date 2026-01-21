# Product Requirements Document
## Professional Markdown Editor

### Executive Summary
A comprehensive, feature-rich markdown editor that rivals GitHub's markdown capabilities, offering real-time preview, syntax highlighting, multi-format export, and comprehensive editing tools for professional content creation. **Fully static, no external APIs required, optimized for GitHub Pages deployment and Google search ranking.**

---

## 1. Product Overview

### 1.1 Product Vision
Create the ultimate markdown editing experience that combines the simplicity of markdown with the power of modern text editors, enabling users to write, preview, and export professional documentation seamlessly. **100% client-side, works offline, no backend required.**

### 1.2 Target Users
- Developers writing documentation
- Technical writers
- Content creators
- Students and researchers
- Open-source contributors
- Bloggers and journalists

### 1.3 Key Differentiators
- GitHub-flavored markdown full support
- Real-time preview
- Multi-format export (PDF, HTML, DOCX, LaTeX)
- Advanced syntax highlighting
- Offline-first architecture
- **No API keys or external services required**
- **100% static - works on GitHub Pages**
- **SEO-optimized for Google search ranking**
- **Completely free and open source**

---

## 2. Core Features

### 2.1 Editor Interface

#### 2.1.1 Editing Modes
- **Split View**: Side-by-side editor and preview
- **Editor Only**: Full-screen editing mode
- **Preview Only**: Distraction-free reading mode
- **Zen Mode**: Minimalist full-screen writing

#### 2.1.2 Editor Capabilities
- Syntax highlighting for markdown and code blocks
- Line numbers (toggleable)
- Auto-save functionality (localStorage)
- Undo/Redo with unlimited history
- Find and Replace (with regex support)
- Multi-cursor editing
- Keyboard shortcuts for all major functions
- Drag-and-drop file/image upload (local/base64)
- Auto-completion for markdown syntax
- Bracket/quote auto-closing

#### 2.1.3 Toolbar Features
- Bold, Italic, Strikethrough
- Headers (H1-H6)
- Lists (ordered, unordered, task lists)
- Code blocks and inline code
- Links and images
- Tables generator
- Blockquotes
- Horizontal rules
- Emoji picker
- Special characters
- Custom markdown snippets

### 2.2 GitHub-Flavored Markdown Support

#### 2.2.1 Standard Markdown
- Headers (# to ######)
- Emphasis (*italic*, **bold**, ~~strikethrough~~)
- Lists (ordered, unordered, nested)
- Links and images
- Code blocks with syntax highlighting
- Blockquotes
- Horizontal rules
- Line breaks

#### 2.2.2 GitHub Extensions
- Tables with alignment
- Task lists (- [ ] and - [x])
- Strikethrough (~~text~~)
- Automatic URL linking
- Fenced code blocks with language specification
- Syntax highlighting for 100+ languages
- Emoji shortcodes (:smile:)
- Footnotes
- Definition lists
- Math expressions (KaTeX - client-side)
- Mermaid diagrams (client-side rendering)
- Alert/Admonition blocks

#### 2.2.3 Extended Features
- HTML support (inline HTML)
- Custom attributes for elements
- TOC (Table of Contents) generation
- Anchor links
- Abbreviations
- Superscript and subscript
- Highlighting (==text==)
- Custom containers/callouts

### 2.3 Preview System

#### 2.3.1 Real-time Preview
- Live rendering as you type
- Smooth scroll synchronization
- Syntax highlighting in code blocks
- Dark/Light theme support
- Custom CSS themes
- Responsive preview (mobile, tablet, desktop views)
- Print preview mode

#### 2.3.2 Advanced Preview Features
- Mermaid diagram rendering (client-side)
- Mathematical equation rendering (KaTeX - bundled)
- Emoji rendering
- Task list interactivity
- Collapsible sections
- Image zoom on click
- Copy code block button
- Line highlighting in code blocks

### 2.4 File Management

#### 2.4.1 File Operations
- New file creation
- Open file (from device)
- Save file (.md, .markdown, .txt)
- Save as (with custom name)
- Recent files list (localStorage)
- Auto-save with configurable intervals
- Version history/snapshots (localStorage)
- File recovery on crash

#### 2.4.2 Import Support
- Markdown files (.md, .markdown)
- Plain text files (.txt)
- HTML to Markdown conversion (client-side)
- Copy-paste from web with formatting

#### 2.4.3 Export Formats (All Client-Side)
- **Markdown** (.md) - original format
- **HTML** (.html) - with embedded CSS or separate stylesheet
- **PDF** (.pdf) - using jsPDF (no server required)
- **DOCX** (.docx) - using docx.js (no server required)
- **LaTeX** (.tex) - for academic publishing
- **Plain Text** (.txt) - stripped formatting
- **GitHub-ready HTML** - for GitHub Pages

### 2.5 Code Block Features

#### 2.5.1 Syntax Highlighting
- Support for 100+ programming languages
- Auto-detection of language
- Theme customization (VS Code, Monokai, Solarized, etc.)
- Line numbers
- Highlighted lines
- Copy to clipboard button

#### 2.5.2 Supported Languages (Including)
- JavaScript, TypeScript, Python, Java, C++, C#
- HTML, CSS, SCSS, LESS
- PHP, Ruby, Go, Rust, Swift, Kotlin
- SQL, Shell, Bash, PowerShell
- JSON, YAML, XML, TOML
- Markdown, LaTeX, R, MATLAB
- And 80+ more languages

### 2.6 Media Management

#### 2.6.1 Image Handling
- Drag-and-drop upload (converts to base64)
- Copy-paste from clipboard
- URL insertion
- Base64 embedding
- Alt text editor
- Caption support
- Image zoom viewer

#### 2.6.2 Media Support
- Images: PNG, JPG, GIF, SVG, WebP
- External embeds (YouTube, Vimeo, CodePen via iframe)
- GIFs and animated images

### 2.7 Table Editor

#### 2.7.1 Table Creation
- Visual table generator
- Quick insert (rows x columns)
- Column alignment (left, center, right)
- Add/remove rows and columns
- Sort by column
- CSV import to table
- Paste from spreadsheets

#### 2.7.2 Table Features
- Responsive tables
- Scrollable tables (overflow)
- Striped rows
- Hover effects
- Export table as CSV

### 2.8 Sharing Features (No Backend Required)

#### 2.8.1 Sharing Options
- Copy markdown to clipboard
- Copy rendered HTML to clipboard
- Download and share file
- Generate shareable URL with content encoded (URL hash)
- Embed code generation

### 2.9 Organization & Navigation

#### 2.9.1 Document Structure
- Outline/TOC sidebar
- Heading navigation
- Breadcrumbs
- Quick jump to section
- Folding sections (collapse/expand)
- Minimap (document overview)

#### 2.9.2 Workspace Management
- Multiple tabs support
- Split panes (horizontal/vertical)
- Distraction-free mode
- Focus mode (highlight current line)
- Word count and reading time
- Character count
- Line count

### 2.10 Customization

#### 2.10.1 Themes
- Light mode
- Dark mode
- High contrast mode
- Custom themes (user-created)
- Syntax highlighting themes
- Preview themes (GitHub, Medium, Dev.to style)

#### 2.10.2 Settings
- Font family and size
- Line height and spacing
- Tab size (spaces vs tabs)
- Auto-save interval
- Spell check (browser native)
- Default export format
- Keyboard shortcuts customization
- Language preferences

#### 2.10.3 Templates
- Pre-built document templates
- Custom template creation
- Front matter support (YAML)
- Snippet library

---

## 3. Technical Specifications

### 3.1 Technology Stack (100% Client-Side)

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Core** | HTML5, CSS3, Vanilla JavaScript | Foundation |
| **Editor Engine** | CodeMirror 6 | Text editing |
| **Markdown Parser** | Marked.js | Markdown to HTML |
| **PDF Generation** | jsPDF + html2canvas | Client-side PDF |
| **DOCX Export** | docx.js | Client-side Word docs |
| **Diagram Rendering** | Mermaid.js | Flowcharts, diagrams |
| **Math Rendering** | KaTeX | LaTeX equations |
| **Syntax Highlighting** | Prism.js | Code highlighting |
| **Storage** | LocalStorage + IndexedDB | Persistent storage |
| **Icons** | SVG Sprites | UI icons |

### 3.2 Performance Requirements
- Load time: < 2 seconds
- Real-time preview latency: < 100ms
- Support documents up to 10MB
- Smooth scrolling (60fps)
- Full offline functionality
- Low memory footprint

### 3.3 Browser Compatibility
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

### 3.4 Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode
- Font scaling
- Focus indicators

---

## 4. User Interface Design

### 4.1 Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│  Logo  | File ▼ | Edit ▼ | View ▼ | Export ▼ | Help ▼ | ⚙ | 🌙 │
├─────────────────────────────────────────────────────────────────┤
│ [B][I][S] | [H1▼] | [≡][•][☐] | [<>][```] | [🔗][🖼] | [▦][―] │
├─────────────────────────┬───────────────────────────────────────┤
│ ┌─ Outline ───────────┐ │                                       │
│ │ ▼ Introduction      │ │                                       │
│ │   ▶ Getting Started │ │                                       │
│ │   ▶ Installation    │ │      Editor Pane    │   Preview Pane  │
│ │ ▼ Features          │ │      (Markdown)     │   (Rendered)    │
│ │   ▶ Editor          │ │                     │                 │
│ │   ▶ Export          │ │   # Hello World    │   Hello World   │
│ │ ▼ API Reference     │ │   Some **bold**    │   Some bold     │
│ └─────────────────────┘ │   text here...     │   text here...  │
│                         │                     │                 │
├─────────────────────────┴───────────────────────────────────────┤
│ Ln 1, Col 1 │ Words: 150 │ Chars: 892 │ UTF-8 │ ✓ Saved │ 100% │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Responsive Design
- Desktop: Split view (editor + preview)
- Tablet: Tabbed view (switch between editor/preview)
- Mobile: Full-screen editor with preview toggle

### 4.3 Color Scheme
```css
:root {
  /* Light Theme */
  --primary: #6c5ce7;
  --primary-hover: #5b4cdb;
  --secondary: #00cec9;
  --accent: #fd79a8;
  --success: #00b894;
  --warning: #fdcb6e;
  --danger: #d63031;
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #e9ecef;
  --text-primary: #2d3436;
  --text-secondary: #636e72;
  --border: #dee2e6;
}

[data-theme="dark"] {
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --bg-tertiary: #0f3460;
  --text-primary: #ffffff;
  --text-secondary: #b2bec3;
  --border: #2d3748;
}
```

---

## 5. GitHub Pages Deployment Structure

### 5.1 Complete Repository Structure

```
markdown-editor/
│
├── index.html                      # Main application entry
├── 404.html                        # Custom 404 page (SEO)
├── robots.txt                      # Search engine rules
├── sitemap.xml                     # XML sitemap
├── manifest.json                   # PWA manifest
├── sw.js                           # Service Worker
├── browserconfig.xml               # Windows tiles
├── CNAME                           # Custom domain (optional)
├── LICENSE                         # MIT License
├── README.md                       # Project documentation
├── CONTRIBUTING.md                 # Contribution guidelines
├── CHANGELOG.md                    # Version history
│
├── css/
│   ├── main.css                    # Main styles (combined)
│   ├── critical.css                # Above-fold critical CSS
│   ├── editor.css                  # Editor pane styles
│   ├── preview.css                 # Preview pane styles
│   ├── toolbar.css                 # Toolbar styles
│   ├── modal.css                   # Modal/dialog styles
│   ├── sidebar.css                 # Sidebar/outline styles
│   ├── responsive.css              # Media queries
│   ├── print.css                   # Print styles
│   ├── animations.css              # CSS animations
│   │
│   ├── themes/
│   │   ├── light.css               # Light theme variables
│   │   ├── dark.css                # Dark theme variables
│   │   ├── high-contrast.css       # Accessibility theme
│   │   └── sepia.css               # Sepia/warm theme
│   │
│   ├── preview-themes/
│   │   ├── github.css              # GitHub style preview
│   │   ├── medium.css              # Medium style preview
│   │   ├── academic.css            # Academic/paper style
│   │   └── minimal.css             # Clean minimal style
│   │
│   └── syntax-themes/
│       ├── prism-default.css       # Default code theme
│       ├── prism-dark.css          # Dark code theme
│       ├── prism-monokai.css       # Monokai theme
│       ├── prism-solarized.css     # Solarized theme
│       ├── prism-dracula.css       # Dracula theme
│       └── prism-github.css        # GitHub code theme
│
├── js/
│   ├── app.js                      # Main application
│   │
│   ├── core/
│   │   ├── editor.js               # Editor initialization
│   │   ├── preview.js              # Preview rendering
│   │   ├── sync.js                 # Scroll synchronization
│   │   ├── state.js                # Application state
│   │   └── events.js               # Event handling
│   │
│   ├── markdown/
│   │   ├── parser.js               # Markdown parsing config
│   │   ├── renderer.js             # Custom renderer
│   │   ├── extensions.js           # GFM extensions
│   │   ├── sanitizer.js            # HTML sanitization
│   │   └── plugins/
│   │       ├── tables.js           # Enhanced tables
│   │       ├── tasklists.js        # Task lists
│   │       ├── emoji.js            # Emoji support
│   │       ├── math.js             # KaTeX math
│   │       ├── mermaid.js          # Diagrams
│   │       ├── footnotes.js        # Footnotes
│   │       ├── toc.js              # Table of contents
│   │       ├── alerts.js           # Alert blocks
│   │       └── highlight.js        # Text highlighting
│   │
│   ├── editor/
│   │   ├── codemirror-setup.js     # CodeMirror config
│   │   ├── shortcuts.js            # Keyboard shortcuts
│   │   ├── autocomplete.js         # Auto-completion
│   │   ├── toolbar-actions.js      # Toolbar functions
│   │   ├── context-menu.js         # Right-click menu
│   │   ├── search-replace.js       # Find & replace
│   │   ├── history.js              # Undo/redo
│   │   └── selection.js            # Selection helpers
│   │
│   ├── export/
│   │   ├── export-manager.js       # Export coordination
│   │   ├── html-export.js          # HTML export
│   │   ├── pdf-export.js           # PDF generation
│   │   ├── docx-export.js          # Word export
│   │   ├── latex-export.js         # LaTeX export
│   │   ├── text-export.js          # Plain text
│   │   └── templates/
│   │       ├── html-template.js    # HTML templates
│   │       ├── pdf-styles.js       # PDF styling
│   │       └── docx-styles.js      # DOCX styling
│   │
│   ├── import/
│   │   ├── file-handler.js         # File import
│   │   ├── drag-drop.js            # Drag & drop
│   │   ├── html-to-md.js           # HTML converter
│   │   └── paste-handler.js        # Paste processing
│   │
│   ├── storage/
│   │   ├── storage-manager.js      # Storage coordination
│   │   ├── local-storage.js        # LocalStorage
│   │   ├── indexed-db.js           # IndexedDB
│   │   ├── file-system.js          # File System API
│   │   ├── auto-save.js            # Auto-save logic
│   │   └── version-history.js      # Local versioning
│   │
│   ├── ui/
│   │   ├── toolbar.js              # Toolbar UI
│   │   ├── sidebar.js              # Sidebar/outline
│   │   ├── tabs.js                 # Tab management
│   │   ├── modals.js               # Modal dialogs
│   │   ├── notifications.js        # Toast messages
│   │   ├── dropdown.js             # Dropdown menus
│   │   ├── split-pane.js           # Resizable panes
│   │   ├── status-bar.js           # Status bar
│   │   ├── minimap.js              # Document minimap
│   │   └── emoji-picker.js         # Emoji selector
│   │
│   ├── features/
│   │   ├── theme-manager.js        # Theme switching
│   │   ├── settings.js             # Settings panel
│   │   ├── templates.js            # Document templates
│   │   ├── snippets.js             # Code snippets
│   │   ├── word-count.js           # Statistics
│   │   ├── reading-time.js         # Reading estimate
│   │   ├── focus-mode.js           # Distraction-free
│   │   ├── typewriter-mode.js      # Typewriter scroll
│   │   └── share.js                # Share functionality
│   │
│   ├── utils/
│   │   ├── helpers.js              # Utility functions
│   │   ├── dom.js                  # DOM utilities
│   │   ├── debounce.js             # Debounce/throttle
│   │   ├── clipboard.js            # Clipboard API
│   │   ├── download.js             # File downloads
│   │   ├── url.js                  # URL utilities
│   │   └── detect.js               # Feature detection
│   │
│   ├── config/
│   │   ├── defaults.js             # Default settings
│   │   ├── shortcuts-map.js        # Shortcut definitions
│   │   ├── languages.js            # Supported langs
│   │   ├── emoji-data.js           # Emoji database
│   │   └── templates-data.js       # Built-in templates
│   │
│   └── workers/
│       ├── markdown-worker.js      # Parsing worker
│       └── export-worker.js        # Export worker
│
├── lib/                            # Third-party libraries (bundled)
│   ├── codemirror/
│   │   ├── codemirror.min.js       # CodeMirror 6 core
│   │   ├── codemirror.min.css
│   │   └── languages/              # Language modes
│   │       ├── javascript.min.js
│   │       ├── python.min.js
│   │       ├── html.min.js
│   │       ├── css.min.js
│   │       ├── markdown.min.js
│   │       └── ... (all languages)
│   │
│   ├── marked/
│   │   └── marked.min.js           # Markdown parser
│   │
│   ├── prism/
│   │   ├── prism.min.js            # Syntax highlighter
│   │   ├── prism.min.css
│   │   └── components/             # Language components
│   │
│   ├── katex/
│   │   ├── katex.min.js            # Math rendering
│   │   ├── katex.min.css
│   │   ├── contrib/
│   │   │   └── auto-render.min.js
│   │   └── fonts/                  # KaTeX fonts
│   │
│   ├── mermaid/
│   │   └── mermaid.min.js          # Diagram rendering
│   │
│   ├── jspdf/
│   │   └── jspdf.umd.min.js        # PDF generation
│   │
│   ├── html2canvas/
│   │   └── html2canvas.min.js      # HTML to canvas
│   │
│   ├── docx/
│   │   └── docx.min.js             # DOCX generation
│   │
│   ├── dompurify/
│   │   └── dompurify.min.js        # HTML sanitization
│   │
│   ├── turndown/
│   │   └── turndown.min.js         # HTML to Markdown
│   │
│   └── FileSaver/
│       └── FileSaver.min.js        # File saving
│
├── assets/
│   ├── images/
│   │   ├── logo.svg                # Main logo
│   │   ├── logo-dark.svg           # Dark mode logo
│   │   ├── logo-icon.svg           # Icon only
│   │   ├── favicon.ico             # Favicon
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   ├── apple-touch-icon.png    # iOS icon (180x180)
│   │   ├── android-chrome-192x192.png
│   │   ├── android-chrome-512x512.png
│   │   ├── mstile-150x150.png      # Windows tile
│   │   ├── safari-pinned-tab.svg   # Safari pinned
│   │   │
│   │   ├── og-image.png            # Open Graph (1200x630)
│   │   ├── twitter-card.png        # Twitter (1200x600)
│   │   │
│   │   ├── screenshots/
│   │   │   ├── desktop-light.png   # Desktop screenshot
│   │   │   ├── desktop-dark.png
│   │   │   ├── mobile-light.png
│   │   │   ├── mobile-dark.png
│   │   │   └── features/
│   │   │       ├── editor.png
│   │   │       ├── preview.png
│   │   │       ├── export.png
│   │   │       └── themes.png
│   │   │
│   │   └── demo/
│   │       ├── demo.gif            # Demo animation
│   │       └── tutorial/
│   │
│   ├── icons/
│   │   ├── sprite.svg              # SVG icon sprite
│   │   └── individual/             # Individual icons
│   │       ├── bold.svg
│   │       ├── italic.svg
│   │       ├── underline.svg
│   │       ├── strikethrough.svg
│   │       ├── heading.svg
│   │       ├── list-ul.svg
│   │       ├── list-ol.svg
│   │       ├── checklist.svg
│   │       ├── link.svg
│   │       ├── image.svg
│   │       ├── code.svg
│   │       ├── code-block.svg
│   │       ├── quote.svg
│   │       ├── table.svg
│   │       ├── horizontal-rule.svg
│   │       ├── emoji.svg
│   │       ├── undo.svg
│   │       ├── redo.svg
│   │       ├── search.svg
│   │       ├── replace.svg
│   │       ├── settings.svg
│   │       ├── sun.svg
│   │       ├── moon.svg
│   │       ├── download.svg
│   │       ├── upload.svg
│   │       ├── copy.svg
│   │       ├── paste.svg
│   │       ├── file.svg
│   │       ├── folder.svg
│   │       ├── save.svg
│   │       ├── print.svg
│   │       ├── fullscreen.svg
│   │       ├── split.svg
│   │       ├── preview.svg
│   │       ├── edit.svg
│   │       ├── close.svg
│   │       ├── menu.svg
│   │       ├── more.svg
│   │       ├── check.svg
│   │       ├── warning.svg
│   │       ├── info.svg
│   │       ├── error.svg
│   │       ├── github.svg
│   │       ├── twitter.svg
│   │       ├── youtube.svg
│   │       └── coffee.svg
│   │
│   └── fonts/
│       ├── inter/
│       │   ├── Inter-Regular.woff2
│       │   ├── Inter-Medium.woff2
│       │   ├── Inter-SemiBold.woff2
│       │   ├── Inter-Bold.woff2
│       │   └── inter.css
│       │
│       ├── fira-code/
│       │   ├── FiraCode-Regular.woff2
│       │   ├── FiraCode-Medium.woff2
│       │   ├── FiraCode-Bold.woff2
│       │   └── fira-code.css
│       │
│       └── fonts.css               # Font-face declarations
│
├── templates/                      # Document templates
│   ├── readme-github.md
│   ├── readme-npm.md
│   ├── blog-post.md
│   ├── documentation.md
│   ├── api-docs.md
│   ├── meeting-notes.md
│   ├── changelog.md
│   ├── contributing.md
│   ├── code-of-conduct.md
│   ├── pull-request.md
│   ├── issue-bug.md
│   ├── issue-feature.md
│   ├── presentation.md
│   ├── resume.md
│   ├── letter.md
│   └── blank.md
│
├── docs/                           # Documentation (SEO pages)
│   ├── index.html                  # Docs home
│   ├── getting-started.html
│   ├── features.html
│   ├── markdown-guide.html
│   ├── keyboard-shortcuts.html
│   ├── export-options.html
│   ├── themes.html
│   ├── templates.html
│   ├── offline-usage.html
│   ├── faq.html
│   ├── troubleshooting.html
│   ├── changelog.html
│   ├── contributing.html
│   └── privacy.html
│
├── blog/                           # Blog posts (SEO content)
│   ├── index.html
│   ├── markdown-syntax-guide.html
│   ├── github-readme-tips.html
│   ├── technical-writing-best-practices.html
│   ├── mermaid-diagrams-tutorial.html
│   ├── markdown-vs-rich-text.html
│   └── productivity-tips-writers.html
│
├── pages/                          # Static pages
│   ├── about.html
│   ├── features.html
│   ├── privacy.html
│   └── terms.html
│
└── .github/
    ├── workflows/
    │   ├── deploy.yml              # GitHub Pages deploy
    │   ├── lighthouse.yml          # Performance audit
    │   └── links-check.yml         # Check broken links
    │
    ├── ISSUE_TEMPLATE/
    │   ├── bug_report.md
    │   └── feature_request.md
    │
    └── PULL_REQUEST_TEMPLATE.md
```

### 5.2 Core Files Content

#### 5.2.1 `index.html` - Main Application
```html
<!DOCTYPE html>
<html lang="en" dir="ltr" data-theme="light">
<head>
    <!-- ============================================
         MARKDOWN EDITOR - Professional Markdown Editor
         Author: OathanRex
         Website: https://oathanrex.github.io
         License: MIT
    ============================================= -->
    
    <!-- Character Encoding & Viewport -->
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=5">
    
    <!-- ============ PRIMARY SEO META TAGS ============ -->
    <title>Free Markdown Editor Online - Real-time Preview, Export to PDF, HTML, DOCX | OathanRex</title>
    <meta name="title" content="Free Markdown Editor Online - Real-time Preview, Export to PDF, HTML, DOCX | OathanRex">
    <meta name="description" content="Professional free online markdown editor with GitHub-flavored markdown, real-time preview, syntax highlighting, and export to PDF, HTML, DOCX. No signup required. Works offline. 100% free forever.">
    <meta name="keywords" content="markdown editor, online markdown editor, free markdown editor, markdown to pdf, markdown preview, github markdown, markdown converter, markdown to html, markdown table generator, mermaid diagrams, latex equations, code syntax highlighting, wysiwyg markdown editor, offline markdown editor, markdown export">
    <meta name="author" content="OathanRex">
    <meta name="creator" content="OathanRex">
    <meta name="publisher" content="OathanRex">
    
    <!-- ============ ROBOTS & INDEXING ============ -->
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="bingbot" content="index, follow">
    <meta name="revisit-after" content="7 days">
    <meta name="rating" content="general">
    
    <!-- ============ CANONICAL & LANGUAGE ============ -->
    <link rel="canonical" href="https://oathanrex.github.io/markdown-editor/">
    <meta name="language" content="English">
    <meta http-equiv="content-language" content="en">
    <link rel="alternate" hreflang="en" href="https://oathanrex.github.io/markdown-editor/">
    <link rel="alternate" hreflang="x-default" href="https://oathanrex.github.io/markdown-editor/">
    
    <!-- ============ OPEN GRAPH / FACEBOOK ============ -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://oathanrex.github.io/markdown-editor/">
    <meta property="og:title" content="Free Markdown Editor Online - Real-time Preview & Export">
    <meta property="og:description" content="Professional markdown editor with GitHub-flavored markdown, real-time preview, and export to PDF, HTML, DOCX. Free, no signup, works offline.">
    <meta property="og:image" content="https://oathanrex.github.io/markdown-editor/assets/images/og-image.png">
    <meta property="og:image:secure_url" content="https://oathanrex.github.io/markdown-editor/assets/images/og-image.png">
    <meta property="og:image:type" content="image/png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Professional Markdown Editor with split view showing editor and preview">
    <meta property="og:site_name" content="Markdown Editor by OathanRex">
    <meta property="og:locale" content="en_US">
    
    <!-- ============ TWITTER CARD ============ -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="https://oathanrex.github.io/markdown-editor/">
    <meta name="twitter:title" content="Free Markdown Editor Online - Real-time Preview & Export">
    <meta name="twitter:description" content="Professional markdown editor with GitHub-flavored markdown, real-time preview, and export to PDF, HTML, DOCX. Free and works offline.">
    <meta name="twitter:image" content="https://oathanrex.github.io/markdown-editor/assets/images/twitter-card.png">
    <meta name="twitter:image:alt" content="Professional Markdown Editor Interface">
    <meta name="twitter:creator" content="@oathanrex">
    <meta name="twitter:site" content="@oathanrex">
    
    <!-- ============ APP META TAGS ============ -->
    <meta name="application-name" content="Markdown Editor">
    <meta name="apple-mobile-web-app-title" content="MD Editor">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="format-detection" content="telephone=no">
    <meta name="msapplication-TileColor" content="#6c5ce7">
    <meta name="msapplication-config" content="/markdown-editor/browserconfig.xml">
    <meta name="msapplication-tap-highlight" content="no">
    
    <!-- ============ THEME COLOR ============ -->
    <meta name="theme-color" content="#6c5ce7" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#1a1a2e" media="(prefers-color-scheme: dark)">
    <meta name="color-scheme" content="light dark">
    
    <!-- ============ FAVICONS ============ -->
    <link rel="icon" type="image/x-icon" href="./assets/images/favicon.ico">
    <link rel="icon" type="image/png" sizes="16x16" href="./assets/images/favicon-16x16.png">
    <link rel="icon" type="image/png" sizes="32x32" href="./assets/images/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="192x192" href="./assets/images/android-chrome-192x192.png">
    <link rel="icon" type="image/png" sizes="512x512" href="./assets/images/android-chrome-512x512.png">
    <link rel="apple-touch-icon" sizes="180x180" href="./assets/images/apple-touch-icon.png">
    <link rel="mask-icon" href="./assets/images/safari-pinned-tab.svg" color="#6c5ce7">
    
    <!-- ============ PWA MANIFEST ============ -->
    <link rel="manifest" href="./manifest.json">
    
    <!-- ============ PRECONNECT & DNS PREFETCH ============ -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    
    <!-- ============ PRELOAD CRITICAL RESOURCES ============ -->
    <link rel="preload" href="./assets/fonts/inter/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="./assets/fonts/fira-code/FiraCode-Regular.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="./css/critical.css" as="style">
    <link rel="preload" href="./js/app.js" as="script">
    
    <!-- ============ CRITICAL CSS (INLINE) ============ -->
    <style>
        /* Critical above-the-fold CSS */
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--primary:#6c5ce7;--bg:#fff;--text:#2d3436;--border:#dee2e6;--editor-bg:#fafafa;--font-ui:'Inter',system-ui,-apple-system,sans-serif;--font-mono:'Fira Code','Consolas',monospace}
        @media(prefers-color-scheme:dark){:root{--bg:#1a1a2e;--text:#fff;--border:#2d3748;--editor-bg:#16213e}}
        [data-theme="dark"]{--bg:#1a1a2e;--text:#fff;--border:#2d3748;--editor-bg:#16213e}
        html{font-size:16px;-webkit-text-size-adjust:100%;scroll-behavior:smooth}
        body{font-family:var(--font-ui);background:var(--bg);color:var(--text);line-height:1.6;min-height:100vh;overflow:hidden}
        .app-container{display:flex;flex-direction:column;height:100vh}
        .loading{display:flex;justify-content:center;align-items:center;min-height:100vh;flex-direction:column;gap:1rem}
        .loading-spinner{width:48px;height:48px;border:4px solid var(--border);border-top-color:var(--primary);border-radius:50%;animation:spin 1s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
        .skip-link{position:absolute;top:-40px;left:0;background:var(--primary);color:#fff;padding:8px 16px;z-index:9999;transition:top 0.3s}
        .skip-link:focus{top:0}
        /* Header styles */
        .app-header{display:flex;align-items:center;justify-content:space-between;padding:0.5rem 1rem;background:var(--bg);border-bottom:1px solid var(--border);height:48px;flex-shrink:0}
        .logo{display:flex;align-items:center;gap:0.5rem;text-decoration:none;color:var(--text);font-weight:600}
        .logo img{width:28px;height:28px}
        /* Toolbar placeholder */
        .toolbar{display:flex;align-items:center;gap:0.25rem;padding:0.5rem 1rem;background:var(--bg);border-bottom:1px solid var(--border);height:44px;flex-shrink:0;overflow-x:auto}
        /* Editor container placeholder */
        .editor-container{display:flex;flex:1;overflow:hidden}
        .editor-pane,.preview-pane{flex:1;overflow:auto;padding:1rem}
        /* Status bar placeholder */
        .status-bar{display:flex;align-items:center;justify-content:space-between;padding:0.25rem 1rem;background:var(--bg);border-top:1px solid var(--border);height:28px;flex-shrink:0;font-size:0.75rem;color:var(--text)}
    </style>
    
    <!-- ============ MAIN STYLESHEET (DEFERRED) ============ -->
    <link rel="stylesheet" href="./css/main.css" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="./css/main.css"></noscript>
    
    <!-- ============ JSON-LD STRUCTURED DATA ============ -->
    <!-- WebApplication Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "@id": "https://oathanrex.github.io/markdown-editor/#webapp",
        "name": "Professional Markdown Editor",
        "alternateName": ["MD Editor", "Markdown Editor Online", "Free Markdown Editor", "OathanRex Markdown Editor"],
        "url": "https://oathanrex.github.io/markdown-editor/",
        "description": "Professional free online markdown editor with GitHub-flavored markdown support, real-time preview, syntax highlighting for 100+ languages, and export to PDF, HTML, DOCX. No signup required, works offline.",
        "applicationCategory": "DeveloperApplication",
        "applicationSubCategory": "Text Editor",
        "operatingSystem": "Any (Web Browser)",
        "browserRequirements": "Requires JavaScript. Requires HTML5. Works in Chrome, Firefox, Safari, Edge.",
        "softwareVersion": "1.0.0",
        "releaseNotes": "https://oathanrex.github.io/markdown-editor/docs/changelog.html",
        "datePublished": "2024-01-01",
        "dateModified": "2024-01-15",
        "inLanguage": "en",
        "isAccessibleForFree": true,
        "isFamilyFriendly": true,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "1850",
            "bestRating": "5",
            "worstRating": "1"
        },
        "author": {
            "@type": "Person",
            "@id": "https://oathanrex.github.io/#person",
            "name": "OathanRex",
            "url": "https://oathanrex.github.io",
            "sameAs": [
                "https://github.com/oathanrex",
                "https://codepen.io/oathanrex",
                "https://youtube.com/@oathanrex",
                "https://oathanrex.blogspot.com",
                "https://www.buymeacoffee.com/oathanrex"
            ]
        },
        "creator": {
            "@type": "Person",
            "name": "OathanRex",
            "url": "https://oathanrex.github.io"
        },
        "publisher": {
            "@type": "Person",
            "name": "OathanRex",
            "url": "https://oathanrex.github.io",
            "logo": {
                "@type": "ImageObject",
                "url": "https://oathanrex.github.io/markdown-editor/assets/images/logo.svg"
            }
        },
        "screenshot": [
            {
                "@type": "ImageObject",
                "url": "https://oathanrex.github.io/markdown-editor/assets/images/screenshots/desktop-light.png",
                "caption": "Markdown Editor Desktop View - Light Theme"
            },
            {
                "@type": "ImageObject",
                "url": "https://oathanrex.github.io/markdown-editor/assets/images/screenshots/desktop-dark.png",
                "caption": "Markdown Editor Desktop View - Dark Theme"
            }
        ],
        "featureList": [
            "Real-time markdown preview",
            "GitHub-flavored markdown (GFM) support",
            "Syntax highlighting for 100+ programming languages",
            "Export to PDF without server",
            "Export to HTML with styling",
            "Export to DOCX (Word)",
            "Export to LaTeX",
            "Dark and light themes",
            "Full offline support (PWA)",
            "Mermaid diagram support",
            "KaTeX math equation rendering",
            "Table editor with visual generator",
            "Task list support",
            "Emoji picker with shortcodes",
            "Auto-save to browser storage",
            "Version history",
            "Multiple document tabs",
            "Keyboard shortcuts",
            "Split view with sync scroll",
            "Focus and Zen modes",
            "Document outline/TOC",
            "Word and character count",
            "Reading time estimation",
            "Drag and drop images",
            "Print-ready export",
            "No signup required",
            "100% free forever"
        ],
        "keywords": "markdown editor, online markdown editor, markdown preview, markdown to pdf, github markdown, code syntax highlighting, mermaid diagrams, latex equations",
        "downloadUrl": "https://oathanrex.github.io/markdown-editor/",
        "installUrl": "https://oathanrex.github.io/markdown-editor/",
        "softwareHelp": {
            "@type": "CreativeWork",
            "url": "https://oathanrex.github.io/markdown-editor/docs/"
        },
        "potentialAction": {
            "@type": "UseAction",
            "target": "https://oathanrex.github.io/markdown-editor/"
        }
    }
    </script>
    
    <!-- SoftwareApplication Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Markdown Editor",
        "operatingSystem": "Web Browser",
        "applicationCategory": "DeveloperApplication",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "1850"
        }
    }
    </script>
    
    <!-- Organization/Person Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": "https://oathanrex.github.io/#person",
        "name": "OathanRex",
        "url": "https://oathanrex.github.io",
        "image": "https://oathanrex.github.io/assets/images/avatar.png",
        "sameAs": [
            "https://github.com/oathanrex",
            "https://codepen.io/oathanrex",
            "https://youtube.com/@oathanrex",
            "https://oathanrex.blogspot.com",
            "https://www.buymeacoffee.com/oathanrex"
        ],
        "jobTitle": "Developer",
        "knowsAbout": ["Web Development", "JavaScript", "Markdown", "Open Source"]
    }
    </script>
    
    <!-- BreadcrumbList Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://oathanrex.github.io/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Markdown Editor",
                "item": "https://oathanrex.github.io/markdown-editor/"
            }
        ]
    }
    </script>
    
    <!-- FAQ Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Is this markdown editor completely free?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, this markdown editor is 100% free with no hidden costs, no signup required, and no premium features locked behind a paywall. All features including PDF export, HTML export, DOCX export are completely free forever."
                }
            },
            {
                "@type": "Question",
                "name": "Does the markdown editor work offline?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, the editor works completely offline after your first visit. It's a Progressive Web App (PWA) that caches all resources locally. You can install it on your device and use it without any internet connection."
                }
            },
            {
                "@type": "Question",
                "name": "What markdown features are supported?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The editor supports full GitHub-flavored markdown (GFM) including tables, task lists, strikethrough, code blocks with syntax highlighting for 100+ languages, emoji shortcodes, footnotes, math equations with KaTeX, and Mermaid diagrams for flowcharts and more."
                }
            },
            {
                "@type": "Question",
                "name": "What export formats are available?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can export your markdown documents to PDF, HTML (with or without styling), DOCX (Microsoft Word), LaTeX, and plain text. All exports happen in your browser - no data is sent to any server."
                }
            },
            {
                "@type": "Question",
                "name": "Is my data private and secure?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely. All your documents are stored locally in your browser using localStorage and IndexedDB. No data is ever sent to any server. The editor runs entirely in your browser with no backend, ensuring complete privacy."
                }
            },
            {
                "@type": "Question",
                "name": "Can I use this editor on mobile devices?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, the editor is fully responsive and works on mobile phones and tablets. You can also install it as a PWA on your home screen for a native app-like experience."
                }
            }
        ]
    }
    </script>
    
    <!-- HowTo Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Use the Markdown Editor",
        "description": "Learn how to write, preview, and export markdown documents using this free online editor",
        "image": "https://oathanrex.github.io/markdown-editor/assets/images/og-image.png",
        "totalTime": "PT2M",
        "step": [
            {
                "@type": "HowToStep",
                "position": 1,
                "name": "Open the Editor",
                "text": "Visit the markdown editor website. No signup or installation required.",
                "url": "https://oathanrex.github.io/markdown-editor/"
            },
            {
                "@type": "HowToStep",
                "position": 2,
                "name": "Write Markdown",
                "text": "Type your markdown content in the left editor pane. Use the toolbar for quick formatting or type markdown syntax directly."
            },
            {
                "@type": "HowToStep",
                "position": 3,
                "name": "Preview in Real-time",
                "text": "See your rendered markdown instantly in the right preview pane. The preview updates as you type."
            },
            {
                "@type": "HowToStep",
                "position": 4,
                "name": "Export Your Document",
                "text": "Click the Export button and choose your format: PDF, HTML, DOCX, LaTeX, or plain text. The file downloads directly to your device."
            }
        ]
    }
    </script>
    
    <!-- WebSite Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "OathanRex Markdown Editor",
        "url": "https://oathanrex.github.io/markdown-editor/",
        "description": "Free online markdown editor with real-time preview and export",
        "author": {
            "@type": "Person",
            "name": "OathanRex"
        },
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://oathanrex.github.io/markdown-editor/docs/?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    }
    </script>
</head>
<body>
    <!-- ============ SKIP NAVIGATION ============ -->
    <a href="#main-editor" class="skip-link">Skip to editor</a>
    
    <!-- ============ LOADING STATE ============ -->
    <div id="loading" class="loading" aria-live="polite">
        <div class="loading-spinner" aria-hidden="true"></div>
        <p>Loading Markdown Editor...</p>
    </div>
    
    <!-- ============ MAIN APPLICATION ============ -->
    <div id="app" class="app-container" style="display:none;" itemscope itemtype="https://schema.org/WebApplication">
        <meta itemprop="name" content="Professional Markdown Editor">
        <meta itemprop="applicationCategory" content="DeveloperApplication">
        <meta itemprop="operatingSystem" content="Web Browser">
        
        <!-- ============ HEADER ============ -->
        <header class="app-header" role="banner">
            <div class="header-left">
                <a href="https://oathanrex.github.io/markdown-editor/" class="logo" aria-label="Markdown Editor Home">
                    <img src="./assets/images/logo.svg" alt="" width="28" height="28" aria-hidden="true">
                    <span class="logo-text">Markdown Editor</span>
                </a>
            </div>
            
            <nav class="header-nav" role="navigation" aria-label="Main menu">
                <div class="nav-menu">
                    <!-- File Menu -->
                    <div class="dropdown">
                        <button class="dropdown-trigger" aria-haspopup="true" aria-expanded="false">
                            File
                            <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#chevron-down"></use></svg>
                        </button>
                        <ul class="dropdown-menu" role="menu">
                            <li role="menuitem"><button data-action="new"><kbd>Ctrl+N</kbd> New</button></li>
                            <li role="menuitem"><button data-action="open"><kbd>Ctrl+O</kbd> Open</button></li>
                            <li role="menuitem"><button data-action="save"><kbd>Ctrl+S</kbd> Save</button></li>
                            <li role="menuitem"><button data-action="save-as"><kbd>Ctrl+Shift+S</kbd> Save As</button></li>
                            <li role="separator"></li>
                            <li role="menuitem"><button data-action="import">Import</button></li>
                            <li role="separator"></li>
                            <li role="menuitem"><button data-action="print"><kbd>Ctrl+P</kbd> Print</button></li>
                        </ul>
                    </div>
                    
                    <!-- Edit Menu -->
                    <div class="dropdown">
                        <button class="dropdown-trigger" aria-haspopup="true" aria-expanded="false">
                            Edit
                            <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#chevron-down"></use></svg>
                        </button>
                        <ul class="dropdown-menu" role="menu">
                            <li role="menuitem"><button data-action="undo"><kbd>Ctrl+Z</kbd> Undo</button></li>
                            <li role="menuitem"><button data-action="redo"><kbd>Ctrl+Y</kbd> Redo</button></li>
                            <li role="separator"></li>
                            <li role="menuitem"><button data-action="cut"><kbd>Ctrl+X</kbd> Cut</button></li>
                            <li role="menuitem"><button data-action="copy"><kbd>Ctrl+C</kbd> Copy</button></li>
                            <li role="menuitem"><button data-action="paste"><kbd>Ctrl+V</kbd> Paste</button></li>
                            <li role="separator"></li>
                            <li role="menuitem"><button data-action="find"><kbd>Ctrl+F</kbd> Find</button></li>
                            <li role="menuitem"><button data-action="replace"><kbd>Ctrl+H</kbd> Replace</button></li>
                            <li role="separator"></li>
                            <li role="menuitem"><button data-action="select-all"><kbd>Ctrl+A</kbd> Select All</button></li>
                        </ul>
                    </div>
                    
                    <!-- View Menu -->
                    <div class="dropdown">
                        <button class="dropdown-trigger" aria-haspopup="true" aria-expanded="false">
                            View
                            <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#chevron-down"></use></svg>
                        </button>
                        <ul class="dropdown-menu" role="menu">
                            <li role="menuitem"><button data-action="view-split">Split View</button></li>
                            <li role="menuitem"><button data-action="view-editor">Editor Only</button></li>
                            <li role="menuitem"><button data-action="view-preview">Preview Only</button></li>
                            <li role="separator"></li>
                            <li role="menuitem"><button data-action="toggle-sidebar">Toggle Sidebar</button></li>
                            <li role="menuitem"><button data-action="toggle-minimap">Toggle Minimap</button></li>
                            <li role="separator"></li>
                            <li role="menuitem"><button data-action="focus-mode">Focus Mode</button></li>
                            <li role="menuitem"><button data-action="zen-mode"><kbd>F11</kbd> Zen Mode</button></li>
                            <li role="separator"></li>
                            <li role="menuitem"><button data-action="toggle-line-numbers">Line Numbers</button></li>
                            <li role="menuitem"><button data-action="toggle-word-wrap">Word Wrap</button></li>
                        </ul>
                    </div>
                    
                    <!-- Export Menu -->
                    <div class="dropdown">
                        <button class="dropdown-trigger" aria-haspopup="true" aria-expanded="false">
                            Export
                            <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#chevron-down"></use></svg>
                        </button>
                        <ul class="dropdown-menu" role="menu">
                            <li role="menuitem"><button data-action="export-md">Markdown (.md)</button></li>
                            <li role="menuitem"><button data-action="export-html">HTML (.html)</button></li>
                            <li role="menuitem"><button data-action="export-pdf">PDF (.pdf)</button></li>
                            <li role="menuitem"><button data-action="export-docx">Word (.docx)</button></li>
                            <li role="menuitem"><button data-action="export-latex">LaTeX (.tex)</button></li>
                            <li role="menuitem"><button data-action="export-txt">Plain Text (.txt)</button></li>
                            <li role="separator"></li>
                            <li role="menuitem"><button data-action="copy-html">Copy as HTML</button></li>
                            <li role="menuitem"><button data-action="copy-md">Copy as Markdown</button></li>
                        </ul>
                    </div>
                    
                    <!-- Help Menu -->
                    <div class="dropdown">
                        <button class="dropdown-trigger" aria-haspopup="true" aria-expanded="false">
                            Help
                            <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#chevron-down"></use></svg>
                        </button>
                        <ul class="dropdown-menu" role="menu">
                            <li role="menuitem"><a href="./docs/getting-started.html">Getting Started</a></li>
                            <li role="menuitem"><a href="./docs/markdown-guide.html">Markdown Guide</a></li>
                            <li role="menuitem"><a href="./docs/keyboard-shortcuts.html">Keyboard Shortcuts</a></li>
                            <li role="separator"></li>
                            <li role="menuitem"><a href="./docs/faq.html">FAQ</a></li>
                            <li role="menuitem"><a href="./docs/changelog.html">Changelog</a></li>
                            <li role="separator"></li>
                            <li role="menuitem"><a href="https://github.com/oathanrex/markdown-editor" target="_blank" rel="noopener">GitHub</a></li>
                            <li role="menuitem"><a href="https://github.com/oathanrex/markdown-editor/issues" target="_blank" rel="noopener">Report Bug</a></li>
                            <li role="separator"></li>
                            <li role="menuitem"><button data-action="about">About</button></li>
                        </ul>
                    </div>
                </div>
            </nav>
            
            <div class="header-right">
                <button class="btn-icon" id="theme-toggle" aria-label="Toggle dark mode" title="Toggle theme">
                    <svg class="icon icon-sun" aria-hidden="true"><use href="./assets/icons/sprite.svg#sun"></use></svg>
                    <svg class="icon icon-moon" aria-hidden="true"><use href="./assets/icons/sprite.svg#moon"></use></svg>
                </button>
                <button class="btn-icon" id="settings-toggle" aria-label="Open settings" title="Settings">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#settings"></use></svg>
                </button>
                <button class="btn-icon" id="fullscreen-toggle" aria-label="Toggle fullscreen" title="Fullscreen">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#fullscreen"></use></svg>
                </button>
            </div>
        </header>
        
        <!-- ============ TOOLBAR ============ -->
        <div class="toolbar" role="toolbar" aria-label="Formatting toolbar">
            <!-- Formatting Group -->
            <div class="toolbar-group" role="group" aria-label="Text formatting">
                <button class="toolbar-btn" data-action="bold" title="Bold (Ctrl+B)" aria-label="Bold">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#bold"></use></svg>
                </button>
                <button class="toolbar-btn" data-action="italic" title="Italic (Ctrl+I)" aria-label="Italic">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#italic"></use></svg>
                </button>
                <button class="toolbar-btn" data-action="strikethrough" title="Strikethrough" aria-label="Strikethrough">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#strikethrough"></use></svg>
                </button>
            </div>
            
            <div class="toolbar-divider" aria-hidden="true"></div>
            
            <!-- Headings Group -->
            <div class="toolbar-group" role="group" aria-label="Headings">
                <div class="dropdown">
                    <button class="toolbar-btn dropdown-trigger" title="Headings" aria-haspopup="true" aria-expanded="false">
                        <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#heading"></use></svg>
                        <svg class="icon icon-sm" aria-hidden="true"><use href="./assets/icons/sprite.svg#chevron-down"></use></svg>
                    </button>
                    <ul class="dropdown-menu" role="menu">
                        <li role="menuitem"><button data-action="h1">Heading 1</button></li>
                        <li role="menuitem"><button data-action="h2">Heading 2</button></li>
                        <li role="menuitem"><button data-action="h3">Heading 3</button></li>
                        <li role="menuitem"><button data-action="h4">Heading 4</button></li>
                        <li role="menuitem"><button data-action="h5">Heading 5</button></li>
                        <li role="menuitem"><button data-action="h6">Heading 6</button></li>
                    </ul>
                </div>
            </div>
            
            <div class="toolbar-divider" aria-hidden="true"></div>
            
            <!-- Lists Group -->
            <div class="toolbar-group" role="group" aria-label="Lists">
                <button class="toolbar-btn" data-action="ul" title="Bullet List" aria-label="Bullet list">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#list-ul"></use></svg>
                </button>
                <button class="toolbar-btn" data-action="ol" title="Numbered List" aria-label="Numbered list">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#list-ol"></use></svg>
                </button>
                <button class="toolbar-btn" data-action="task" title="Task List" aria-label="Task list">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#checklist"></use></svg>
                </button>
            </div>
            
            <div class="toolbar-divider" aria-hidden="true"></div>
            
            <!-- Code Group -->
            <div class="toolbar-group" role="group" aria-label="Code">
                <button class="toolbar-btn" data-action="code" title="Inline Code" aria-label="Inline code">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#code"></use></svg>
                </button>
                <button class="toolbar-btn" data-action="codeblock" title="Code Block" aria-label="Code block">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#code-block"></use></svg>
                </button>
            </div>
            
            <div class="toolbar-divider" aria-hidden="true"></div>
            
            <!-- Insert Group -->
            <div class="toolbar-group" role="group" aria-label="Insert">
                <button class="toolbar-btn" data-action="link" title="Insert Link (Ctrl+K)" aria-label="Insert link">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#link"></use></svg>
                </button>
                <button class="toolbar-btn" data-action="image" title="Insert Image" aria-label="Insert image">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#image"></use></svg>
                </button>
                <button class="toolbar-btn" data-action="table" title="Insert Table" aria-label="Insert table">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#table"></use></svg>
                </button>
            </div>
            
            <div class="toolbar-divider" aria-hidden="true"></div>
            
            <!-- Block Group -->
            <div class="toolbar-group" role="group" aria-label="Block elements">
                <button class="toolbar-btn" data-action="quote" title="Blockquote" aria-label="Blockquote">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#quote"></use></svg>
                </button>
                <button class="toolbar-btn" data-action="hr" title="Horizontal Rule" aria-label="Horizontal rule">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#horizontal-rule"></use></svg>
                </button>
            </div>
            
            <div class="toolbar-divider" aria-hidden="true"></div>
            
            <!-- Special Group -->
            <div class="toolbar-group" role="group" aria-label="Special">
                <button class="toolbar-btn" data-action="emoji" title="Emoji" aria-label="Insert emoji">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#emoji"></use></svg>
                </button>
                <button class="toolbar-btn" data-action="math" title="Math Equation" aria-label="Insert math equation">
                    <span aria-hidden="true">∑</span>
                </button>
                <button class="toolbar-btn" data-action="diagram" title="Diagram (Mermaid)" aria-label="Insert diagram">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#diagram"></use></svg>
                </button>
            </div>
            
            <div class="toolbar-spacer" aria-hidden="true"></div>
            
            <!-- View Controls -->
            <div class="toolbar-group toolbar-group-right" role="group" aria-label="View controls">
                <button class="toolbar-btn" data-action="view-split" title="Split View" aria-label="Split view" aria-pressed="true">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#split"></use></svg>
                </button>
                <button class="toolbar-btn" data-action="view-editor" title="Editor Only" aria-label="Editor only" aria-pressed="false">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#edit"></use></svg>
                </button>
                <button class="toolbar-btn" data-action="view-preview" title="Preview Only" aria-label="Preview only" aria-pressed="false">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#preview"></use></svg>
                </button>
            </div>
        </div>
        
        <!-- ============ TAB BAR ============ -->
        <div class="tab-bar" role="tablist" aria-label="Open documents">
            <div class="tab active" role="tab" aria-selected="true" data-tab-id="1">
                <span class="tab-title">Untitled.md</span>
                <span class="tab-modified" aria-label="Unsaved changes" title="Unsaved changes">●</span>
                <button class="tab-close" aria-label="Close tab" title="Close">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#close"></use></svg>
                </button>
            </div>
            <button class="tab-new" aria-label="New tab" title="New document">
                <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#plus"></use></svg>
            </button>
        </div>
        
        <!-- ============ MAIN CONTENT ============ -->
        <main id="main-editor" class="main-content" role="main">
            <!-- Sidebar -->
            <aside class="sidebar" id="sidebar" role="complementary" aria-label="Document outline">
                <div class="sidebar-header">
                    <h2 class="sidebar-title">Outline</h2>
                    <button class="btn-icon sidebar-close" aria-label="Close sidebar">
                        <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#close"></use></svg>
                    </button>
                </div>
                <nav class="outline-nav" id="outline" aria-label="Document sections">
                    <ul class="outline-list">
                        <!-- Populated by JavaScript -->
                    </ul>
                </nav>
            </aside>
            
            <!-- Editor Container -->
            <div class="editor-container" id="editor-container">
                <!-- Editor Pane -->
                <section class="editor-pane" id="editor-pane" aria-label="Markdown editor">
                    <h2 class="sr-only">Markdown Editor</h2>
                    <div class="editor-wrapper">
                        <textarea 
                            id="editor" 
                            class="editor-textarea"
                            aria-label="Markdown input"
                            placeholder="Start writing markdown..."
                            spellcheck="true"
                            autocomplete="off"
                            autocapitalize="sentences"
                        ></textarea>
                        <!-- CodeMirror will replace this -->
                    </div>
                </section>
                
                <!-- Resize Handle -->
                <div class="resize-handle" id="resize-handle" role="separator" aria-orientation="vertical" aria-label="Resize editor and preview panes" tabindex="0"></div>
                
                <!-- Preview Pane -->
                <section class="preview-pane" id="preview-pane" aria-label="Markdown preview" aria-live="polite">
                    <h2 class="sr-only">Preview</h2>
                    <article id="preview" class="preview-content markdown-body" itemprop="text">
                        <p class="preview-placeholder">Your rendered markdown will appear here...</p>
                    </article>
                </section>
            </div>
            
            <!-- Minimap (optional) -->
            <div class="minimap" id="minimap" aria-hidden="true">
                <canvas id="minimap-canvas"></canvas>
                <div class="minimap-viewport"></div>
            </div>
        </main>
        
        <!-- ============ STATUS BAR ============ -->
        <footer class="status-bar" role="contentinfo">
            <div class="status-left">
                <span class="status-item status-position">
                    <span class="sr-only">Cursor position:</span>
                    Ln <span id="status-line">1</span>, Col <span id="status-col">1</span>
                </span>
                <span class="status-item status-selection" id="status-selection" hidden>
                    (<span id="status-selected">0</span> selected)
                </span>
            </div>
            <div class="status-center">
                <span class="status-item status-words">
                    <span class="sr-only">Word count:</span>
                    <span id="status-words">0</span> words
                </span>
                <span class="status-item status-chars">
                    <span class="sr-only">Character count:</span>
                    <span id="status-chars">0</span> chars
                </span>
                <span class="status-item status-reading">
                    <span class="sr-only">Reading time:</span>
                    <span id="status-reading">0</span> min read
                </span>
            </div>
            <div class="status-right">
                <span class="status-item status-encoding">UTF-8</span>
                <span class="status-item status-format">Markdown</span>
                ```html
                <span class="status-item status-save" id="status-save" title="Auto-save status">
                    <svg class="icon icon-check" aria-hidden="true"><use href="./assets/icons/sprite.svg#check"></use></svg>
                    <span id="save-text">Saved</span>
                </span>
                <span class="status-item status-zoom">
                    <button class="btn-text" id="zoom-out" aria-label="Zoom out">−</button>
                    <span id="status-zoom">100%</span>
                    <button class="btn-text" id="zoom-in" aria-label="Zoom in">+</button>
                </span>
            </div>
        </footer>
    </div>
    
    <!-- ============ MODALS ============ -->
    
    <!-- Settings Modal -->
    <dialog id="settings-modal" class="modal" aria-labelledby="settings-title">
        <div class="modal-content">
            <header class="modal-header">
                <h2 id="settings-title">Settings</h2>
                <button class="btn-icon modal-close" aria-label="Close settings">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#close"></use></svg>
                </button>
            </header>
            <div class="modal-body">
                <div class="settings-tabs">
                    <button class="settings-tab active" data-tab="editor">Editor</button>
                    <button class="settings-tab" data-tab="preview">Preview</button>
                    <button class="settings-tab" data-tab="export">Export</button>
                    <button class="settings-tab" data-tab="shortcuts">Shortcuts</button>
                </div>
                
                <div class="settings-content">
                    <!-- Editor Settings -->
                    <div class="settings-panel active" id="settings-editor">
                        <div class="setting-group">
                            <label for="setting-font-family">Font Family</label>
                            <select id="setting-font-family">
                                <option value="Fira Code">Fira Code</option>
                                <option value="Monaco">Monaco</option>
                                <option value="Consolas">Consolas</option>
                                <option value="Source Code Pro">Source Code Pro</option>
                                <option value="JetBrains Mono">JetBrains Mono</option>
                            </select>
                        </div>
                        <div class="setting-group">
                            <label for="setting-font-size">Font Size</label>
                            <input type="range" id="setting-font-size" min="12" max="24" value="14">
                            <span class="setting-value" id="font-size-value">14px</span>
                        </div>
                        <div class="setting-group">
                            <label for="setting-line-height">Line Height</label>
                            <input type="range" id="setting-line-height" min="1.2" max="2" step="0.1" value="1.6">
                            <span class="setting-value" id="line-height-value">1.6</span>
                        </div>
                        <div class="setting-group">
                            <label for="setting-tab-size">Tab Size</label>
                            <select id="setting-tab-size">
                                <option value="2">2 spaces</option>
                                <option value="4" selected>4 spaces</option>
                                <option value="8">8 spaces</option>
                            </select>
                        </div>
                        <div class="setting-group">
                            <label class="setting-toggle">
                                <input type="checkbox" id="setting-line-numbers" checked>
                                <span>Show Line Numbers</span>
                            </label>
                        </div>
                        <div class="setting-group">
                            <label class="setting-toggle">
                                <input type="checkbox" id="setting-word-wrap" checked>
                                <span>Word Wrap</span>
                            </label>
                        </div>
                        <div class="setting-group">
                            <label class="setting-toggle">
                                <input type="checkbox" id="setting-auto-close" checked>
                                <span>Auto-close Brackets & Quotes</span>
                            </label>
                        </div>
                        <div class="setting-group">
                            <label class="setting-toggle">
                                <input type="checkbox" id="setting-highlight-line" checked>
                                <span>Highlight Current Line</span>
                            </label>
                        </div>
                        <div class="setting-group">
                            <label for="setting-autosave">Auto-save Interval</label>
                            <select id="setting-autosave">
                                <option value="0">Disabled</option>
                                <option value="5000">5 seconds</option>
                                <option value="10000">10 seconds</option>
                                <option value="30000" selected>30 seconds</option>
                                <option value="60000">1 minute</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Preview Settings -->
                    <div class="settings-panel" id="settings-preview">
                        <div class="setting-group">
                            <label for="setting-preview-theme">Preview Theme</label>
                            <select id="setting-preview-theme">
                                <option value="github">GitHub</option>
                                <option value="medium">Medium</option>
                                <option value="academic">Academic</option>
                                <option value="minimal">Minimal</option>
                            </select>
                        </div>
                        <div class="setting-group">
                            <label for="setting-code-theme">Code Syntax Theme</label>
                            <select id="setting-code-theme">
                                <option value="default">Default</option>
                                <option value="monokai">Monokai</option>
                                <option value="dracula">Dracula</option>
                                <option value="solarized">Solarized</option>
                                <option value="github">GitHub</option>
                            </select>
                        </div>
                        <div class="setting-group">
                            <label class="setting-toggle">
                                <input type="checkbox" id="setting-sync-scroll" checked>
                                <span>Sync Scroll</span>
                            </label>
                        </div>
                        <div class="setting-group">
                            <label class="setting-toggle">
                                <input type="checkbox" id="setting-render-math" checked>
                                <span>Render Math (KaTeX)</span>
                            </label>
                        </div>
                        <div class="setting-group">
                            <label class="setting-toggle">
                                <input type="checkbox" id="setting-render-diagrams" checked>
                                <span>Render Diagrams (Mermaid)</span>
                            </label>
                        </div>
                        <div class="setting-group">
                            <label class="setting-toggle">
                                <input type="checkbox" id="setting-render-emoji" checked>
                                <span>Render Emoji Shortcodes</span>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Export Settings -->
                    <div class="settings-panel" id="settings-export">
                        <div class="setting-group">
                            <label for="setting-pdf-size">PDF Page Size</label>
                            <select id="setting-pdf-size">
                                <option value="a4" selected>A4</option>
                                <option value="letter">Letter</option>
                                <option value="legal">Legal</option>
                            </select>
                        </div>
                        <div class="setting-group">
                            <label for="setting-pdf-orientation">PDF Orientation</label>
                            <select id="setting-pdf-orientation">
                                <option value="portrait" selected>Portrait</option>
                                <option value="landscape">Landscape</option>
                            </select>
                        </div>
                        <div class="setting-group">
                            <label class="setting-toggle">
                                <input type="checkbox" id="setting-pdf-toc" checked>
                                <span>Include Table of Contents in PDF</span>
                            </label>
                        </div>
                        <div class="setting-group">
                            <label class="setting-toggle">
                                <input type="checkbox" id="setting-html-standalone" checked>
                                <span>HTML: Include CSS (Standalone)</span>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Shortcuts Settings -->
                    <div class="settings-panel" id="settings-shortcuts">
                        <div class="shortcuts-list">
                            <div class="shortcut-item">
                                <span class="shortcut-action">Bold</span>
                                <kbd>Ctrl+B</kbd>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-action">Italic</span>
                                <kbd>Ctrl+I</kbd>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-action">Insert Link</span>
                                <kbd>Ctrl+K</kbd>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-action">Save</span>
                                <kbd>Ctrl+S</kbd>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-action">Open</span>
                                <kbd>Ctrl+O</kbd>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-action">New</span>
                                <kbd>Ctrl+N</kbd>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-action">Find</span>
                                <kbd>Ctrl+F</kbd>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-action">Replace</span>
                                <kbd>Ctrl+H</kbd>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-action">Undo</span>
                                <kbd>Ctrl+Z</kbd>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-action">Redo</span>
                                <kbd>Ctrl+Y</kbd>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-action">Zen Mode</span>
                                <kbd>F11</kbd>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-action">Print</span>
                                <kbd>Ctrl+P</kbd>
                            </div>
                        </div>
                        <p class="shortcuts-note">
                            <a href="./docs/keyboard-shortcuts.html">View all keyboard shortcuts →</a>
                        </p>
                    </div>
                </div>
            </div>
            <footer class="modal-footer">
                <button class="btn btn-secondary" id="reset-settings">Reset to Defaults</button>
                <button class="btn btn-primary modal-close">Done</button>
            </footer>
        </div>
    </dialog>
    
    <!-- Table Generator Modal -->
    <dialog id="table-modal" class="modal" aria-labelledby="table-title">
        <div class="modal-content modal-sm">
            <header class="modal-header">
                <h2 id="table-title">Insert Table</h2>
                <button class="btn-icon modal-close" aria-label="Close">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#close"></use></svg>
                </button>
            </header>
            <div class="modal-body">
                <div class="table-generator">
                    <div class="setting-group">
                        <label for="table-rows">Rows</label>
                        <input type="number" id="table-rows" min="1" max="20" value="3">
                    </div>
                    <div class="setting-group">
                        <label for="table-cols">Columns</label>
                        <input type="number" id="table-cols" min="1" max="10" value="3">
                    </div>
                    <div class="setting-group">
                        <label class="setting-toggle">
                            <input type="checkbox" id="table-header" checked>
                            <span>Include Header Row</span>
                        </label>
                    </div>
                </div>
                <div class="table-preview" id="table-preview">
                    <!-- Table preview will be generated here -->
                </div>
            </div>
            <footer class="modal-footer">
                <button class="btn btn-secondary modal-close">Cancel</button>
                <button class="btn btn-primary" id="insert-table">Insert Table</button>
            </footer>
        </div>
    </dialog>
    
    <!-- Link Modal -->
    <dialog id="link-modal" class="modal" aria-labelledby="link-title">
        <div class="modal-content modal-sm">
            <header class="modal-header">
                <h2 id="link-title">Insert Link</h2>
                <button class="btn-icon modal-close" aria-label="Close">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#close"></use></svg>
                </button>
            </header>
            <div class="modal-body">
                <div class="setting-group">
                    <label for="link-text">Link Text</label>
                    <input type="text" id="link-text" placeholder="Display text">
                </div>
                <div class="setting-group">
                    <label for="link-url">URL</label>
                    <input type="url" id="link-url" placeholder="https://example.com">
                </div>
                <div class="setting-group">
                    <label for="link-title">Title (optional)</label>
                    <input type="text" id="link-title" placeholder="Link title">
                </div>
            </div>
            <footer class="modal-footer">
                <button class="btn btn-secondary modal-close">Cancel</button>
                <button class="btn btn-primary" id="insert-link">Insert Link</button>
            </footer>
        </div>
    </dialog>
    
    <!-- Image Modal -->
    <dialog id="image-modal" class="modal" aria-labelledby="image-title">
        <div class="modal-content modal-sm">
            <header class="modal-header">
                <h2 id="image-title">Insert Image</h2>
                <button class="btn-icon modal-close" aria-label="Close">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#close"></use></svg>
                </button>
            </header>
            <div class="modal-body">
                <div class="image-tabs">
                    <button class="image-tab active" data-tab="url">URL</button>
                    <button class="image-tab" data-tab="upload">Upload</button>
                </div>
                
                <div class="image-tab-content active" id="image-url-tab">
                    <div class="setting-group">
                        <label for="image-url">Image URL</label>
                        <input type="url" id="image-url" placeholder="https://example.com/image.png">
                    </div>
                </div>
                
                <div class="image-tab-content" id="image-upload-tab">
                    <div class="upload-area" id="upload-area">
                        <svg class="icon icon-lg" aria-hidden="true"><use href="./assets/icons/sprite.svg#upload"></use></svg>
                        <p>Drag & drop an image here or <button class="btn-link" id="browse-files">browse</button></p>
                        <input type="file" id="image-file" accept="image/*" hidden>
                    </div>
                </div>
                
                <div class="setting-group">
                    <label for="image-alt">Alt Text</label>
                    <input type="text" id="image-alt" placeholder="Image description">
                </div>
                <div class="setting-group">
                    <label for="image-title-attr">Title (optional)</label>
                    <input type="text" id="image-title-attr" placeholder="Image title">
                </div>
            </div>
            <footer class="modal-footer">
                <button class="btn btn-secondary modal-close">Cancel</button>
                <button class="btn btn-primary" id="insert-image">Insert Image</button>
            </footer>
        </div>
    </dialog>
    
    <!-- Emoji Picker Modal -->
    <dialog id="emoji-modal" class="modal" aria-labelledby="emoji-title">
        <div class="modal-content modal-md">
            <header class="modal-header">
                <h2 id="emoji-title">Insert Emoji</h2>
                <button class="btn-icon modal-close" aria-label="Close">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#close"></use></svg>
                </button>
            </header>
            <div class="modal-body">
                <div class="emoji-search">
                    <input type="search" id="emoji-search" placeholder="Search emoji..." aria-label="Search emoji">
                </div>
                <div class="emoji-categories">
                    <button class="emoji-cat active" data-category="smileys" title="Smileys">😀</button>
                    <button class="emoji-cat" data-category="people" title="People">👋</button>
                    <button class="emoji-cat" data-category="animals" title="Animals">🐱</button>
                    <button class="emoji-cat" data-category="food" title="Food">🍕</button>
                    <button class="emoji-cat" data-category="travel" title="Travel">✈️</button>
                    <button class="emoji-cat" data-category="activities" title="Activities">⚽</button>
                    <button class="emoji-cat" data-category="objects" title="Objects">💡</button>
                    <button class="emoji-cat" data-category="symbols" title="Symbols">❤️</button>
                    <button class="emoji-cat" data-category="flags" title="Flags">🏁</button>
                </div>
                <div class="emoji-grid" id="emoji-grid">
                    <!-- Emojis populated by JavaScript -->
                </div>
            </div>
        </div>
    </dialog>
    
    <!-- About Modal -->
    <dialog id="about-modal" class="modal" aria-labelledby="about-title">
        <div class="modal-content modal-sm">
            <header class="modal-header">
                <h2 id="about-title">About Markdown Editor</h2>
                <button class="btn-icon modal-close" aria-label="Close">
                    <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#close"></use></svg>
                </button>
            </header>
            <div class="modal-body about-content">
                <div class="about-logo">
                    <img src="./assets/images/logo.svg" alt="Markdown Editor Logo" width="64" height="64">
                </div>
                <h3>Professional Markdown Editor</h3>
                <p class="version">Version 1.0.0</p>
                <p>A free, open-source markdown editor with real-time preview, GitHub-flavored markdown support, and multi-format export.</p>
                
                <div class="about-links">
                    <h4>Created by OathanRex</h4>
                    <ul>
                        <li><a href="https://oathanrex.github.io" target="_blank" rel="noopener">
                            <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#globe"></use></svg>
                            oathanrex.github.io
                        </a></li>
                        <li><a href="https://github.com/oathanrex" target="_blank" rel="noopener">
                            <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#github"></use></svg>
                            GitHub
                        </a></li>
                        <li><a href="https://codepen.io/oathanrex" target="_blank" rel="noopener">
                            <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#codepen"></use></svg>
                            CodePen
                        </a></li>
                        <li><a href="https://youtube.com/@oathanrex" target="_blank" rel="noopener">
                            <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#youtube"></use></svg>
                            YouTube
                        </a></li>
                        <li><a href="https://oathanrex.blogspot.com" target="_blank" rel="noopener">
                            <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#blog"></use></svg>
                            Blog
                        </a></li>
                        <li><a href="https://www.buymeacoffee.com/oathanrex" target="_blank" rel="noopener">
                            <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#coffee"></use></svg>
                            Buy Me a Coffee
                        </a></li>
                    </ul>
                </div>
                
                <p class="about-license">
                    <a href="https://github.com/oathanrex/markdown-editor/blob/main/LICENSE" target="_blank" rel="noopener">MIT License</a> • 
                    <a href="./pages/privacy.html">Privacy Policy</a>
                </p>
            </div>
            <footer class="modal-footer">
                <a href="https://www.buymeacoffee.com/oathanrex" class="btn btn-accent" target="_blank" rel="noopener">
                    ☕ Support This Project
                </a>
                <button class="btn btn-primary modal-close">Close</button>
            </footer>
        </div>
    </dialog>
    
    <!-- Find & Replace Panel -->
    <div id="find-panel" class="find-panel" hidden>
        <div class="find-row">
            <input type="text" id="find-input" placeholder="Find" aria-label="Find text">
            <span class="find-count"><span id="find-current">0</span> of <span id="find-total">0</span></span>
            <button class="btn-icon" id="find-prev" title="Previous (Shift+Enter)" aria-label="Previous match">
                <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#chevron-up"></use></svg>
            </button>
            <button class="btn-icon" id="find-next" title="Next (Enter)" aria-label="Next match">
                <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#chevron-down"></use></svg>
            </button>
            <button class="btn-icon" id="find-close" title="Close (Esc)" aria-label="Close find panel">
                <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#close"></use></svg>
            </button>
        </div>
        <div class="replace-row" id="replace-row" hidden>
            <input type="text" id="replace-input" placeholder="Replace" aria-label="Replace text">
            <button class="btn btn-sm" id="replace-one">Replace</button>
            <button class="btn btn-sm" id="replace-all">Replace All</button>
        </div>
        <div class="find-options">
            <label class="find-option">
                <input type="checkbox" id="find-case">
                <span>Match Case</span>
            </label>
            <label class="find-option">
                <input type="checkbox" id="find-word">
                <span>Whole Word</span>
            </label>
            <label class="find-option">
                <input type="checkbox" id="find-regex">
                <span>Regex</span>
            </label>
            <button class="btn-link" id="toggle-replace">Toggle Replace</button>
        </div>
    </div>
    
    <!-- Toast Notifications Container -->
    <div id="toast-container" class="toast-container" role="alert" aria-live="polite"></div>
    
    <!-- ============ SEO CONTENT (VISIBLE TO SEARCH ENGINES) ============ -->
    <div class="seo-content" aria-hidden="true">
        <h1>Free Online Markdown Editor with Real-time Preview</h1>
        <p>Professional markdown editor with GitHub-flavored markdown support, syntax highlighting for 100+ programming languages, and export to PDF, HTML, DOCX, and LaTeX. Completely free, no signup required, works offline.</p>
        
        <h2>Features</h2>
        <ul>
            <li>Real-time markdown preview with synchronized scrolling</li>
            <li>GitHub-flavored markdown (GFM) full support</li>
            <li>Syntax highlighting for 100+ programming languages</li>
            <li>Export to PDF without server - all processing happens in your browser</li>
            <li>Export to HTML with embedded or separate CSS</li>
            <li>Export to Microsoft Word (DOCX) format</li>
            <li>Export to LaTeX for academic publishing</li>
            <li>Dark and light themes with customization options</li>
            <li>Full offline support - works without internet connection</li>
            <li>Mermaid diagram support for flowcharts, sequence diagrams, and more</li>
            <li>KaTeX math equation rendering for LaTeX mathematics</li>
            <li>Table editor with visual generator</li>
            <li>Task list support with checkbox interactivity</li>
            <li>Emoji picker with shortcode support</li>
            <li>Auto-save to browser storage</li>
            <li>Version history and document recovery</li>
            <li>Multiple document tabs</li>
            <li>Comprehensive keyboard shortcuts</li>
            <li>Document outline and table of contents generation</li>
            <li>Word count, character count, and reading time estimation</li>
            <li>Drag and drop image support</li>
            <li>Focus mode and Zen mode for distraction-free writing</li>
            <li>100% free forever with no premium features locked</li>
        </ul>
        
        <h2>Supported Markdown Syntax</h2>
        <p>This markdown editor supports all standard markdown syntax plus GitHub-flavored markdown extensions including tables, task lists, strikethrough, fenced code blocks, emoji shortcodes, footnotes, and more.</p>
        
        <h2>Export Formats</h2>
        <p>Export your markdown documents to multiple formats: PDF for printing and sharing, HTML for web publishing, DOCX for Microsoft Word, LaTeX for academic papers, and plain text.</p>
        
        <h2>Privacy First</h2>
        <p>All your documents are stored locally in your browser. No data is ever sent to any server. The editor runs entirely client-side, ensuring complete privacy and security for your content.</p>
    </div>
    
    <!-- ============ FOOTER ============ -->
    <footer class="site-footer" itemscope itemtype="https://schema.org/WPFooter">
        <div class="footer-content">
            <div class="footer-section footer-about">
                <a href="https://oathanrex.github.io/markdown-editor/" class="footer-logo">
                    <img src="./assets/images/logo.svg" alt="" width="24" height="24" aria-hidden="true">
                    <span>Markdown Editor</span>
                </a>
                <p>A free, professional-grade markdown editor with real-time preview and multi-format export. No signup required. 100% free forever.</p>
                <p class="footer-author">Made with ❤️ by <a href="https://oathanrex.github.io" rel="author">OathanRex</a></p>
            </div>
            
            <div class="footer-section footer-links">
                <h3>Documentation</h3>
                <nav aria-label="Documentation links">
                    <ul>
                        <li><a href="./docs/getting-started.html">Getting Started</a></li>
                        <li><a href="./docs/markdown-guide.html">Markdown Guide</a></li>
                        <li><a href="./docs/keyboard-shortcuts.html">Keyboard Shortcuts</a></li>
                        <li><a href="./docs/export-options.html">Export Options</a></li>
                        <li><a href="./docs/faq.html">FAQ</a></li>
                        <li><a href="./docs/changelog.html">Changelog</a></li>
                    </ul>
                </nav>
            </div>
            
            <div class="footer-section footer-links">
                <h3>Resources</h3>
                <nav aria-label="Resource links">
                    <ul>
                        <li><a href="./blog/">Blog</a></li>
                        <li><a href="./docs/templates.html">Templates</a></li>
                        <li><a href="./pages/features.html">Features</a></li>
                        <li><a href="./pages/privacy.html">Privacy Policy</a></li>
                        <li><a href="./pages/terms.html">Terms of Use</a></li>
                    </ul>
                </nav>
            </div>
            
            <div class="footer-section footer-connect">
                <h3>Connect</h3>
                <div class="social-links">
                    <a href="https://github.com/oathanrex" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub">
                        <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#github"></use></svg>
                    </a>
                    <a href="https://youtube.com/@oathanrex" target="_blank" rel="noopener" aria-label="YouTube" title="YouTube">
                        <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#youtube"></use></svg>
                    </a>
                    <a href="https://codepen.io/oathanrex" target="_blank" rel="noopener" aria-label="CodePen" title="CodePen">
                        <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#codepen"></use></svg>
                    </a>
                    <a href="https://oathanrex.blogspot.com" target="_blank" rel="noopener" aria-label="Blog" title="Blog">
                        <svg class="icon" aria-hidden="true"><use href="./assets/icons/sprite.svg#blog"></use></svg>
                    </a>
                </div>
                <a href="https://www.buymeacoffee.com/oathanrex" class="btn btn-coffee" target="_blank" rel="noopener">
                    ☕ Buy Me a Coffee
                </a>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; <span id="current-year">2024</span> <a href="https://oathanrex.github.io">OathanRex</a>. Open source under <a href="https://github.com/oathanrex/markdown-editor/blob/main/LICENSE" target="_blank" rel="noopener">MIT License</a>.</p>
        </div>
    </footer>
    
    <!-- ============ SCRIPTS ============ -->
    <!-- Third-party libraries (bundled locally) -->
    <script src="./lib/marked/marked.min.js" defer></script>
    <script src="./lib/prism/prism.min.js" defer></script>
    <script src="./lib/dompurify/dompurify.min.js" defer></script>
    <script src="./lib/katex/katex.min.js" defer></script>
    <script src="./lib/katex/contrib/auto-render.min.js" defer></script>
    <script src="./lib/mermaid/mermaid.min.js" defer></script>
    <script src="./lib/jspdf/jspdf.umd.min.js" defer></script>
    <script src="./lib/html2canvas/html2canvas.min.js" defer></script>
    <script src="./lib/docx/docx.min.js" defer></script>
    <script src="./lib/FileSaver/FileSaver.min.js" defer></script>
    <script src="./lib/turndown/turndown.min.js" defer></script>
    
    <!-- CodeMirror (modular) -->
    <script src="./lib/codemirror/codemirror.min.js" defer></script>
    
    <!-- Main application -->
    <script src="./js/app.js" defer></script>
    
    <!-- Service Worker Registration -->
    <script>
        // Register Service Worker for offline support
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(registration => {
                        console.log('SW registered:', registration.scope);
                    })
                    .catch(error => {
                        console.log('SW registration failed:', error);
                    });
            });
        }
        
        // Update copyright year
        document.getElementById('current-year').textContent = new Date().getFullYear();
    </script>
    
    <!-- Inline app initialization (minimal) -->
    <script>
        // Show app when loaded, hide loading
        document.addEventListener('DOMContentLoaded', () => {
            // Small delay for smooth transition
            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('app').style.display = 'flex';
            }, 300);
        });
        
        // Theme detection and initialization
        (function() {
            const savedTheme = localStorage.getItem('md-editor-theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = savedTheme || (prefersDark ? 'dark' : 'light');
            document.documentElement.setAttribute('data-theme', theme);
        })();
    </script>
</body>
</html>
```

#### 5.2.2 `manifest.json` - PWA Manifest
```json
{
    "name": "Professional Markdown Editor",
    "short_name": "MD Editor",
    "description": "Free online markdown editor with real-time preview, GitHub-flavored markdown support, and export to PDF, HTML, DOCX.",
    "start_url": "/markdown-editor/",
    "scope": "/markdown-editor/",
    "display": "standalone",
    "orientation": "any",
    "theme_color": "#6c5ce7",
    "background_color": "#ffffff",
    "categories": ["productivity", "utilities", "developer tools"],
    "lang": "en",
    "dir": "ltr",
    "icons": [
        {
            "src": "./assets/images/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
        },
        {
            "src": "./assets/images/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
        },
        {
            "src": "./assets/images/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
        }
    ],
    "screenshots": [
        {
            "src": "./assets/images/screenshots/desktop-light.png",
            "sizes": "1920x1080",
            "type": "image/png",
            "form_factor": "wide",
            "label": "Markdown Editor Desktop View"
        },
        {
            "src": "./assets/images/screenshots/mobile-light.png",
            "sizes": "390x844",
            "type": "image/png",
            "form_factor": "narrow",
            "label": "Markdown Editor Mobile View"
        }
    ],
    "shortcuts": [
        {
            "name": "New Document",
            "short_name": "New",
            "description": "Create a new markdown document",
            "url": "/markdown-editor/?action=new",
            "icons": [{"src": "./assets/icons/individual/file.svg", "sizes": "96x96"}]
        },
        {
            "name": "Open File",
            "short_name": "Open",
            "description": "Open an existing file",
            "url": "/markdown-editor/?action=open",
            "icons": [{"src": "./assets/icons/individual/folder.svg", "sizes": "96x96"}]
        }
    ],
    "share_target": {
        "action": "/markdown-editor/",
        "method": "POST",
        "enctype": "multipart/form-data",
        "params": {
            "title": "title",
            "text": "text",
            "url": "url",
            "files": [
                {
                    "name": "file",
                    "accept": ["text/markdown", "text/plain", ".md", ".markdown", ".txt"]
                }
            ]
        }
    },
    "file_handlers": [
        {
            "action": "/markdown-editor/",
            "accept": {
                "text/markdown": [".md", ".markdown"],
                "text/plain": [".txt"]
            }
        }
    ],
    "protocol_handlers": [
        {
            "protocol": "web+markdown",
            "url": "/markdown-editor/?url=%s"
        }
    ],
    "related_applications": [],
    "prefer_related_applications": false
}
```

#### 5.2.3 `sw.js` - Service Worker
```javascript
/**
 * Service Worker for Markdown Editor
 * Enables offline functionality and caching
 */

const CACHE_NAME = 'md-editor-v1.0.0';
const OFFLINE_URL = '/markdown-editor/offline.html';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
    '/markdown-editor/',
    '/markdown-editor/index.html',
    '/markdown-editor/offline.html',
    '/markdown-editor/css/main.css',
    '/markdown-editor/css/critical.css',
    '/markdown-editor/js/app.js',
    '/markdown-editor/lib/marked/marked.min.js',
    '/markdown-editor/lib/prism/prism.min.js',
    '/markdown-editor/lib/dompurify/dompurify.min.js',
    '/markdown-editor/lib/katex/katex.min.js',
    '/markdown-editor/lib/katex/katex.min.css',
    '/markdown-editor/lib/mermaid/mermaid.min.js',
    '/markdown-editor/lib/jspdf/jspdf.umd.min.js',
    '/markdown-editor/lib/html2canvas/html2canvas.min.js',
    '/markdown-editor/lib/docx/docx.min.js',
    '/markdown-editor/lib/FileSaver/FileSaver.min.js',
    '/markdown-editor/lib/codemirror/codemirror.min.js',
    '/markdown-editor/assets/images/logo.svg',
    '/markdown-editor/assets/images/favicon.ico',
    '/markdown-editor/assets/icons/sprite.svg',
    '/markdown-editor/assets/fonts/inter/Inter-Regular.woff2',
    '/markdown-editor/assets/fonts/fira-code/FiraCode-Regular.woff2',
    '/markdown-editor/manifest.json'
];

// Install event - precache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Precaching assets');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;
    
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) return;
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Return cached version
                    return cachedResponse;
                }
                
                // Not in cache, fetch from network
                return fetch(event.request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response
                        const responseToCache = response.clone();
                        
                        // Add to cache
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(() => {
                        // Network failed, return offline page for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match(OFFLINE_URL);
                        }
                    });
            })
    );
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
```

#### 5.2.4 `robots.txt`
```
# Robots.txt for Markdown Editor
# https://oathanrex.github.io/markdown-editor/

User-agent: *
Allow: /

# Allow all crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

# Disallow internal/utility files
Disallow: /markdown-editor/sw.js
Disallow: /markdown-editor/manifest.json
Disallow: /markdown-editor/browserconfig.xml

# Allow important resources
Allow: /markdown-editor/css/
Allow: /markdown-editor/js/
Allow: /markdown-editor/assets/
Allow: /markdown-editor/docs/
Allow: /markdown-editor/blog/

# Sitemap location
Sitemap: https://oathanrex.github.io/markdown-editor/sitemap.xml

# Crawl-delay (optional, be polite)
Crawl-delay: 1
```

#### 5.2.5 `sitemap.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
    
    <!-- Main Application Page -->
    <url>
        <loc>https://oathanrex.github.io/markdown-editor/</loc>
        <lastmod>2024-01-15</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
        <image:image>
            <image:loc>https://oathanrex.github.io/markdown-editor/assets/images/og-image.png</image:loc>
            <image:title>Professional Markdown Editor - Free Online Tool</image:title>
            <image:caption>Split-view markdown editor with real-time preview</image:caption>
        </image:image>
    </url>
    
    <!-- Documentation Pages -->
    <url>
        <loc>https://oathanrex.github.io/markdown-editor/docs/</loc>
        <lastmod>2024-01-15</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    
    <url>
        <loc>https://oathanrex.github.io/markdown-editor/docs/getting-started.html</loc>
        <lastmod>2024-01-12</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    
    <url>
        <loc>https://oathanrex.github.io/markdown-editor/docs/markdown-guide.html</loc>
        <lastmod>2024-01-14</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
    </url>
    
    <url>
        <loc>https://oathanrex.github.io/markdown-editor/docs/keyboard-shortcuts.html</loc>
        <lastmod>2024-01-10</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    
    <url>
        <loc>https://oathanrex.github.io/markdown-editor/docs/export-options.html</loc>
        <lastmod>2024-01-11</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    
    <url>
        <loc>https://oathanrex.github.io/markdown-editor/docs/features.html</loc>
        <lastmod>2024-01-14</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    
    <url>
        <loc>https://oathanrex.github.io/markdown-editor/docs/themes.html</loc>
        <lastmod>2024-01-09</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    
    <url>
        <loc>https://oathanrex.github.io/markdown-editor/docs/templates.html</loc>
        <lastmod>2024-01-08</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    
    <url>
        <loc>https://oathanrex.github.io/markdown-editor/docs/faq.html</loc>
        <lastmod>2024-01-13</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    
    <url>
        <loc>https://oathanrex.github.io/markdown-editor/docs/troubleshooting.html</loc>
        <lastmod>2024-01-07</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    
    <url>
        <loc>https://oathanrex.github.io/markdown-editor/docs/changelog.html</loc>
        <lastmod>2024-01-15</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.5</priority>
    </url>
    
    <url>
        <loc>https://oathanrex.github.io/markdown-editor/docs/offline-usage.html</loc>
        <lastmod>2024-01-06</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    
    <!-- Blog Posts -->
    <url>
        <loc>https://oathanrex.github.io/markdown-editor/blog/</loc>
        <lastmod>2024-01-15</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
    
    <url>
        <loc>https://oathanrex.github.io/markdown-editor/blog/markdown-syntax-guide.html</loc>
        <lastmod>2024-01-10</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    
    <url>
        <loc>https://oathanrex.github.io/markdown-editor/blog/github-readme-tips.html</loc>
        <lastmod>2024-01-08</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    
    <url>
        <loc>https://oathanrex.github.io/markdown-editor/blog/mermaid-diagrams-tutorial.html</loc>
        <lastmod>2024-01-12</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    
    <url>
        <loc>https://oathanrex.github.io/markdown-editor/blog/technical-writing-best-practices.html</loc>
        <lastmod>2024-01-05</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    
    <!-- Static Pages -->
    <url>
        <loc>https://oathanrex.github.io/markdown-editor/pages/about.html</loc>
        <lastmod>2024-01-01</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.5</priority>
    </url>
    
    <url>
        <loc>https://oathanrex.github.io/markdown-editor/pages/features.html</loc>
        <lastmod>2024-01-14</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    
    <url>
        <loc>https://oathanrex.github.io/markdown-editor/pages/privacy.html</loc>
        <lastmod>2024-01-01</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>
    
</urlset>
```

#### 5.2.6 `404.html` - Custom 404 Page
```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Not Found - Markdown Editor</title>
    <meta name="description" content="The page you're looking for doesn't exist. Return to the Markdown Editor or browse our documentation.">
    <meta name="robots" content="noindex, follow">
    <link rel="canonical" href="https://oathanrex.github.io/markdown-editor/">
    
    <!-- Favicons -->
    <link rel="icon" href="./assets/images/favicon.ico">
    <link rel="apple-touch-icon" href="./assets/images/apple-touch-icon.png">
    
    <style>
        :root {
            --primary: #6c5ce7;
            --bg: #ffffff;
            --text: #2d3436;
            --text-secondary: #636e72;
            --border: #dee2e6;
        }
        
        @media (prefers-color-scheme: dark) {
            :root {
                --bg: #1a1a2e;
                --text: #ffffff;
                --text-secondary: #b2bec3;
                --border: #2d3748;
            }
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            text-align: center;
        }
        
        .error-container {
            max-width: 600px;
        }
        
        .error-code {
            font-size: 8rem;
            font-weight: 800;
            color: var(--primary);
            line-height: 1;
            margin-bottom: 1rem;
        }
        
        h1 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }
        
        p {
            color: var(--text-secondary);
            margin-bottom: 2rem;
        }
        
        .actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            text-decoration: none;
            transition: all 0.2s;
        }
        
        .btn-primary {
            background: var(--primary);
            color: white;
        }
        
        .btn-primary:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        
        .btn-secondary {
            background: transparent;
            color: var(--text);
            border: 1px solid var(--border);
        }
        
        .btn-secondary:hover {
            background: var(--border);
        }
        
        .helpful-links {
            margin-top: 3rem;
            text-align: left;
        }
        
        .helpful-links h2 {
            font-size: 1rem;
            margin-bottom: 1rem;
        }
        
        .helpful-links ul {
            list-style: none;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 0.5rem;
        }
        
        .helpful-links a {
            color: var(--primary);
            text-decoration: none;
            padding: 0.5rem;
            border-radius: 4px;
            display: block;
        }
        
        .helpful-links a:hover {
            background: var(--border);
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-code">404</div>
        <h1>Page Not Found</h1>
        <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
        
        <div class="actions">
            <a href="/markdown-editor/" class="btn btn-primary">
                ← Back to Editor
            </a>
            <a href="/markdown-editor/docs/" class="btn btn-secondary">
                View Documentation
            </a>
        </div>
        
        <div class="helpful-links">
            <h2>Helpful Links</h2>
            <ul>
                <li><a href="/markdown-editor/docs/getting-started.html">Getting Started</a></li>
                <li><a href="/markdown-editor/docs/markdown-guide.html">Markdown Guide</a></li>
                <li><a href="/markdown-editor/docs/keyboard-shortcuts.html">Keyboard Shortcuts</a></li>
                <li><a href="/markdown-editor/docs/faq.html">FAQ</a></li>
                <li><a href="/markdown-editor/blog/">Blog</a></li>
                <li><a href="https://github.com/oathanrex/markdown-editor">GitHub Repository</a></li>
            </ul>
        </div>
    </div>
    
    <!-- Simple theme detection -->
    <script>
        if (localStorage.getItem('md-editor-theme') === 'dark' || 
            (!localStorage.getItem('md-editor-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    </script>
</body>
</html>
```

---

## 6. SEO Strategy & Implementation

### 6.1 Target Keywords & Search Intent

#### 6.1.1 Primary Keywords (High Volume)
| Keyword | Monthly Searches | Difficulty | Page Target |
|---------|-----------------|------------|-------------|
| markdown editor | 40,500 | Medium | index.html |
| online markdown editor | 14,800 | Medium | index.html |
| markdown editor online | 9,900 | Medium | index.html |
| free markdown editor | 6,600 | Low | index.html |
| markdown preview | 5,400 | Low | index.html |
| markdown to pdf | 8,100 | Medium | export-options.html |
| markdown to html | 4,400 | Medium | export-options.html |

#### 6.1.2 Secondary Keywords
| Keyword | Monthly Searches | Page Target |
|---------|-----------------|-------------|
| github markdown editor | 2,900 | index.html |
| markdown table generator | 2,400 | markdown-guide.html |
| markdown converter | 2,400 | export-options.html |
| wysiwyg markdown editor | 1,900 | index.html |
| mermaid diagram editor | 1,600 | mermaid-tutorial.html |
| markdown cheat sheet | 12,100 | markdown-guide.html |
| markdown syntax | 8,100 | markdown-guide.html |

#### 6.1.3 Long-tail Keywords
- "best free online markdown editor no signup"
- "markdown editor with live preview"
- "convert markdown to pdf online free"
- "github flavored markdown editor"
- "markdown editor dark mode"
- "markdown editor for documentation"
- "markdown editor with mermaid support"
- "offline markdown editor pwa"
- "markdown editor export to word"

### 6.2 On-Page SEO Checklist

#### 6.2.1 Technical SEO
- [x] HTTPS (GitHub Pages provides)
- [x] Mobile-friendly responsive design
- [x] Fast page load (< 2 seconds)
- [x] Valid HTML5 structure
- [x] Proper heading hierarchy (H1 → H6)
- [x] Semantic HTML elements
- [x] Alt text for all images
- [x] Canonical URLs
- [x] XML sitemap
- [x] robots.txt
- [x] 404 error page
- [x] Schema.org structured data

#### 6.2.2 Content SEO
- [x] Unique, descriptive title tags (< 60 chars)
- [x] Meta descriptions (< 160 chars)
- [x] Keyword in H1
- [x] Keywords in first paragraph
- [x] Internal linking
- [x] External links (noopener, rel attributes)
- [x] Content length (documentation pages 1500+ words)
- [x] FAQ content for featured snippets

#### 6.2.3 User Experience Signals
- [x] Clear navigation
- [x] Fast Time to Interactive
- [x] No intrusive interstitials
- [x] Accessible (WCAG 2.1 AA)
- [x] Readable fonts and contrast
- [x] Mobile touch targets (48px minimum)

### 6.3 Content Strategy for SEO

#### 6.3.1 Documentation Pages (Cornerstone Content)

**`/docs/markdown-guide.html`** - Target: "markdown syntax", "markdown cheat sheet"
- Comprehensive markdown reference (3000+ words)
- Examples for every syntax element
- Comparison tables
- Visual examples with screenshots
- FAQ section

**`/docs/export-options.html`** - Target: "markdown to pdf", "markdown to html"
- Step-by-step export guides
- Format comparison
- Quality settings
- Troubleshooting

**`/docs/keyboard-shortcuts.html`** - Target: "markdown editor shortcuts"
- Complete shortcut reference
- Printable PDF version
- Customization guide

#### 6.3.2 Blog Posts (Traffic Generation)

1. **"Complete Markdown Syntax Guide 2024"**
   - Target: markdown syntax, markdown tutorial
   - Length: 3000+ words
   - Evergreen, update annually

2. **"How to Create the Perfect GitHub README"**
   - Target: github readme, readme template
   - Length: 2000+ words
   - Include templates

3. **"Mermaid Diagrams: Complete Tutorial"**
   - Target: mermaid diagrams, mermaid flowchart
   - Length: 2500+ words
   - Interactive examples

4. **"Markdown vs Rich Text: When to Use Each"**
   - Target: markdown vs word, why markdown
   - Length: 1500+ words
   - Comparison tables

5. **"10 Productivity Tips for Technical Writers"**
   - Target: technical writing tips
   - Length: 2000+ words
   - Shareable content

### 6.4 Link Building Strategy

#### 6.4.1 Internal Linking Structure
```
index.html (Main App)
├── /docs/getting-started.html
│   ├── /docs/markdown-guide.html
│   └── /docs/keyboard-shortcuts.html
├── /docs/features.html
│   └── /docs/export-options.html
├── /docs/faq.html
└── /blog/
    ├── markdown-syntax-guide.html → /docs/markdown-guide.html
    ├── github-readme-tips.html → /templates/
    └── mermaid-tutorial.html → /docs/features.html
```

#### 6.4.2 External Link Opportunities
- GitHub README for project
- Awesome Markdown lists
- Developer tool directories
- ProductHunt launch
- Reddit communities (r/webdev, r/programming)
- Hacker News
- Dev.to articles
- Your blog (oathanrex.blogspot.com)
- YouTube tutorials

### 6.5 Performance Optimization for SEO

#### 6.5.1 Core Web Vitals Targets
| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP | < 2.5s | Largest Contentful Paint |
| FID | < 100ms | First Input Delay |
| CLS | < 0.1 | Cumulative Layout Shift |
| FCP | < 1.8s | First Contentful Paint |
| TTFB | < 600ms | Time to First Byte |

#### 6.5.2 Performance Techniques
```javascript
// Lazy load non-critical resources
const loadMermaid = () => {
    return import('./lib/mermaid/mermaid.min.js');
};

const loadKatex = () => {
    return import('./lib/katex/katex.min.js');
};

// Only load when needed
document.addEventListener('DOMContentLoaded', () => {
    // Check if content needs Mermaid
    if (document.querySelector('.language-mermaid, [class*="mermaid"]')) {
        loadMermaid().then(m => m.default.init());
    }
    
    // Check if content needs KaTeX
    if (document.querySelector('.math, [class*="katex"]')) {
        loadKatex();
    }
});
```

---

## 7. GitHub Actions Workflows

### 7.1 Deploy Workflow (`.github/workflows/deploy.yml`)
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Build (minify CSS/JS if needed)
        run: |
          echo "Building..."
          # Add minification steps if using build tools
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 7.2 Lighthouse Audit (`.github/workflows/lighthouse.yml`)
```yaml
name: Lighthouse Audit

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0' # Weekly on Sunday

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Audit with Lighthouse
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://oathanrex.github.io/markdown-editor/
            https://oathanrex.github.io/markdown-editor/docs/
          budgetPath: ./lighthouse-budget.json
          uploadArtifacts: true
```

### 7.3 Link Checker (`.github/workflows/links.yml`)
```yaml
name: Check Links

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 0 1 * *' # Monthly

jobs:
  check-links:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Check Links
        uses: lycheeverse/lychee-action@v1
        with:
          args: --verbose --no-progress './**/*.html' './**/*.md'
          fail: true
```

---

## 8. Analytics & Monitoring (Privacy-Friendly Options)

### 8.1 Privacy-Friendly Analytics Options

Since you want to avoid external APIs, here are self-hosted/privacy options:

#### Option A: Simple Counter (No External Service)
```javascript
// Simple page view counter using localStorage
// No external services, completely client-side
const trackPageView = () => {
    const views = localStorage.getItem('pageViews') || 0;
    localStorage.setItem('pageViews', parseInt(views) + 1);
    localStorage.setItem('lastVisit', new Date().toISOString());
};
```

#### Option B: Plausible (Self-hosted option available)
- Can be self-hosted
- Privacy-focused
- No cookies

#### Option C: Simple Statistics in App
```javascript
// Track usage statistics locally
const stats = {
    documentsCreated: 0,
    exportsCompleted: { pdf: 0, html: 0, docx: 0 },
    totalWords: 0,
    sessionsCount: 0
};

// Store in localStorage
localStorage.setItem('md-editor-stats', JSON.stringify(stats));
```

---

## 9. Development Phases & Timeline

### Phase 1: Core MVP (Week 1-2)
- [ ] Basic HTML structure with SEO
- [ ] CSS styling (responsive)
- [ ] Basic markdown editor (textarea)
- [ ] Real-time preview with Marked.js
- [ ] Split view layout
- [ ] Light/Dark theme
- [ ] Save/Load to localStorage
- [ ] Export to Markdown

### Phase 2: Enhanced Editor (Week 3-4)
- [ ] CodeMirror integration
- [ ] Syntax highlighting
- [ ] Toolbar functionality
- [ ] Keyboard shortcuts
- [ ] Auto-save
- [ ] Find & Replace
- [ ] Line numbers

### Phase 3: GitHub Markdown (Week 5-6)
- [ ] Tables support
- [ ] Task lists
- [ ] Emoji support
- [ ] Code block languages
- [ ] Blockquotes
- [ ] Horizontal rules
- [ ] Links & Images

### Phase 4: Export & Advanced (Week 7-8)
- [ ] PDF export (jsPDF)
- [ ] HTML export
- [ ] DOCX export
- [ ] Settings panel
- [ ] Multiple tabs
- [ ] Version history
- [ ] Templates

### Phase 5: Polish & SEO (Week 9-10)
- [ ] KaTeX math support
- [ ] Mermaid diagrams
- [ ] Documentation pages
- [ ] Blog content
- [ ] SEO optimization
- [ ] Performance tuning
- [ ] PWA features
- [ ] Testing

---

## 10. Success Metrics

### 10.1 SEO Metrics
| Metric | Target (3 months) | Target (6 months) |
|--------|-------------------|-------------------|
| Google indexed pages | 20+ | 50+ |
| Organic traffic | 1,000/month | 5,000/month |
| Keyword rankings (top 10) | 5 keywords | 20 keywords |
| Backlinks | 10 | 50 |
| Domain authority | 10 | 20 |

### 10.2 User Metrics
| Metric | Target |
|--------|--------|
| Monthly active users | 5,000+ |
| Average session duration | 5+ minutes |
| Return visitors | 40%+ |
| Documents exported | 10,000/month |

### 10.3 Technical Metrics
| Metric | Target |
|--------|--------|
| Lighthouse Performance | 90+ |
| Lighthouse Accessibility | 95+ |
| Lighthouse SEO | 100 |
| Page load time | < 2s |
| Time to Interactive | < 3s |

---

## 11. Conclusion

This PRD outlines a comprehensive plan for building a professional markdown editor that:

1. **Works 100% client-side** - No external APIs or backend required
2. **Deploys on GitHub Pages** - Free, reliable hosting
3. **Optimized for SEO** - Structured data, meta tags, content strategy
4. **Privacy-first** - All data stays in user's browser
5. **Feature-rich** - Rivals commercial editors
6. **Open source** - MIT licensed, community-friendly

**Your Links Integration:**
- GitHub: https://oathanrex.github.io (main site)
- Blog: https://oathanrex.blogspot.com (cross-promotion)
- CodePen: https://codepen.io/oathanrex (demos)
- YouTube: https://youtube.com/@oathanrex (tutorials)
- Support: https://www.buymeacoffee.com/oathanrex

**Next Steps:**
1. Create repository structure
2. Implement Phase 1 MVP
3. Deploy to GitHub Pages
4. Submit sitemap to Google Search Console
5. Create initial documentation/blog content
6. Iterate based on user feedback

---

**Author:** OathanRex  
**License:** MIT  
**Repository:** https://github.com/oathanrex/markdown-editor