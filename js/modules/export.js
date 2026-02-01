/**
 * Export Module
 * Handles importing and exporting documents
 */

/**
 * Export Manager
 */
export class Export {
    constructor(options = {}) {
        this.parser = options.parser;
        this.getContent = options.getContent;
        this.getHTML = options.getHTML;
        this.setContent = options.setContent;
        this.getDocumentTitle = options.getDocumentTitle;
        this.showToastCallback = options.showToast;

        this.init();
    }

    /**
     * Initialize export module
     */
    init() {
        this.setupDropZone();
        this.setupFileInput();
        this.setupExportButtons();
        this.setupClipboardButtons();
    }

    /**
     * Setup drop zone for file import
     */
    setupDropZone() {
        const dropZone = document.getElementById('drop-zone');
        if (!dropZone) return;

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');

            const files = e.dataTransfer.files;
            this.handleFiles(files);
        });

        dropZone.addEventListener('click', () => {
            document.getElementById('file-input').click();
        });

        dropZone.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                document.getElementById('file-input').click();
            }
        });
    }

    /**
     * Setup file input
     */
    setupFileInput() {
        const fileInput = document.getElementById('file-input');
        if (!fileInput) return;

        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
            fileInput.value = '';
        });
    }

    /**
     * Setup export buttons
     */
    setupExportButtons() {
        const exportOptions = document.querySelectorAll('.export-option');
        exportOptions.forEach(option => {
            option.addEventListener('click', () => {
                const format = option.dataset.format;
                this.exportDocument(format);
            });
        });
    }

    /**
     * Setup clipboard buttons
     */
    setupClipboardButtons() {
        const copyMdBtn = document.getElementById('copy-markdown-btn');
        const copyHtmlBtn = document.getElementById('copy-html-btn');

        if (copyMdBtn) {
            copyMdBtn.addEventListener('click', () => this.copyToClipboard('markdown'));
        }

        if (copyHtmlBtn) {
            copyHtmlBtn.addEventListener('click', () => this.copyToClipboard('html'));
        }
    }

    /**
     * Handle imported files
     */
    async handleFiles(files) {
        for (const file of files) {
            await this.importFile(file);
        }

        // Close import modal
        const modal = document.getElementById('import-modal');
        if (modal) modal.hidden = true;
    }

    /**
     * Import a file
     */
    async importFile(file) {
        const extension = file.name.split('.').pop().toLowerCase();

        if (!['md', 'txt', 'html', 'htm'].includes(extension)) {
            this.showToast('Unsupported file type', 'error');
            return;
        }

        try {
            const content = await this.readFile(file);
            let markdown = content;

            // Convert HTML to Markdown if needed
            if (extension === 'html' || extension === 'htm') {
                markdown = this.htmlToMarkdown(content);
            }

            // Create new document or set content
            if (this.setContent) {
                this.setContent(markdown, file.name.replace(/\.[^/.]+$/, ''));
            }

            this.showToast(`Imported ${file.name}`, 'success');
        } catch (error) {
            console.error('Import error:', error);
            this.showToast('Failed to import file', 'error');
        }
    }

    /**
     * Read file content
     */
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    /**
     * Convert HTML to Markdown
     */
    htmlToMarkdown(html) {
        // Create a temporary container
        const container = document.createElement('div');
        container.innerHTML = html;

        // Remove script and style elements
        container.querySelectorAll('script, style').forEach(el => el.remove());

        // Convert elements
        let markdown = '';

        const processNode = (node, depth = 0) => {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent;
            }

            if (node.nodeType !== Node.ELEMENT_NODE) {
                return '';
            }

            const tag = node.tagName.toLowerCase();
            const children = Array.from(node.childNodes).map(n => processNode(n, depth)).join('');

            switch (tag) {
                case 'h1': return `# ${children}\n\n`;
                case 'h2': return `## ${children}\n\n`;
                case 'h3': return `### ${children}\n\n`;
                case 'h4': return `#### ${children}\n\n`;
                case 'h5': return `##### ${children}\n\n`;
                case 'h6': return `###### ${children}\n\n`;
                case 'p': return `${children}\n\n`;
                case 'br': return '\n';
                case 'hr': return '\n---\n\n';
                case 'strong':
                case 'b': return `**${children}**`;
                case 'em':
                case 'i': return `*${children}*`;
                case 'del':
                case 's': return `~~${children}~~`;
                case 'code':
                    if (node.parentElement?.tagName.toLowerCase() === 'pre') {
                        return children;
                    }
                    return `\`${children}\``;
                case 'pre':
                    const codeEl = node.querySelector('code');
                    const lang = codeEl?.className.match(/language-(\w+)/)?.[1] || '';
                    return `\`\`\`${lang}\n${children}\n\`\`\`\n\n`;
                case 'blockquote':
                    return children.split('\n').map(line => `> ${line}`).join('\n') + '\n\n';
                case 'ul':
                    return children + '\n';
                case 'ol':
                    let olIndex = 1;
                    return Array.from(node.children).map(li => {
                        const text = processNode(li, depth);
                        return `${olIndex++}. ${text}`;
                    }).join('\n') + '\n\n';
                case 'li':
                    const parent = node.parentElement?.tagName.toLowerCase();
                    if (parent === 'ol') return children.trim();
                    return `- ${children.trim()}\n`;
                case 'a':
                    const href = node.getAttribute('href') || '';
                    return `[${children}](${href})`;
                case 'img':
                    const src = node.getAttribute('src') || '';
                    const alt = node.getAttribute('alt') || '';
                    return `![${alt}](${src})`;
                case 'table':
                    return this.convertTable(node) + '\n\n';
                case 'div':
                case 'span':
                case 'article':
                case 'section':
                case 'main':
                case 'header':
                case 'footer':
                    return children;
                default:
                    return children;
            }
        };

        markdown = processNode(container);

        // Clean up extra whitespace
        markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();

        return markdown;
    }

    /**
     * Convert HTML table to Markdown
     */
    convertTable(table) {
        const rows = table.querySelectorAll('tr');
        if (rows.length === 0) return '';

        let md = '';
        let isHeader = true;

        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('th, td');
            const cellTexts = Array.from(cells).map(cell => cell.textContent.trim());

            md += '| ' + cellTexts.join(' | ') + ' |\n';

            // Add separator after header
            if (isHeader && row.querySelector('th')) {
                md += '| ' + cellTexts.map(() => '---').join(' | ') + ' |\n';
                isHeader = false;
            } else if (index === 0) {
                md += '| ' + cellTexts.map(() => '---').join(' | ') + ' |\n';
            }
        });

        return md;
    }

    /**
     * Export document in specified format
     */
    exportDocument(format) {
        const content = this.getContent ? this.getContent() : '';
        const title = this.getDocumentTitle ? this.getDocumentTitle() : 'document';

        switch (format) {
            case 'md':
                this.downloadFile(`${title}.md`, content, 'text/markdown');
                break;
            case 'html':
                const html = this.generateStandaloneHTML(content, title);
                this.downloadFile(`${title}.html`, html, 'text/html');
                break;
            case 'pdf':
                this.printDocument();
                break;
        }

        // Close export modal
        const modal = document.getElementById('export-modal');
        if (modal) modal.hidden = true;
    }

    /**
     * Generate standalone HTML document
     */
    generateStandaloneHTML(markdown, title) {
        const renderedHTML = this.parser ? this.parser.parse(markdown) : markdown;

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(title)}</title>
    <style>
        :root {
            --text-color: #1a1a1a;
            --bg-color: #ffffff;
            --code-bg: #f5f5f5;
            --border-color: #e0e0e0;
            --link-color: #6366f1;
        }
        
        @media (prefers-color-scheme: dark) {
            :root {
                --text-color: #e8e8e8;
                --bg-color: #1a1a2e;
                --code-bg: #0d0d1a;
                --border-color: #2a2a4e;
                --link-color: #7b68ee;
            }
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 16px;
            line-height: 1.7;
            color: var(--text-color);
            background: var(--bg-color);
            padding: 2rem;
            max-width: 800px;
            margin: 0 auto;
        }
        
        h1, h2, h3, h4, h5, h6 {
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            font-weight: 600;
            line-height: 1.25;
        }
        
        h1 { font-size: 2em; border-bottom: 1px solid var(--border-color); padding-bottom: 0.3em; }
        h2 { font-size: 1.5em; border-bottom: 1px solid var(--border-color); padding-bottom: 0.3em; }
        h3 { font-size: 1.25em; }
        
        p { margin-bottom: 1em; }
        
        a {
            color: var(--link-color);
            text-decoration: none;
        }
        
        a:hover { text-decoration: underline; }
        
        code {
            font-family: 'JetBrains Mono', 'Fira Code', monospace;
            font-size: 0.9em;
            background: var(--code-bg);
            padding: 0.2em 0.4em;
            border-radius: 4px;
        }
        
        pre {
            background: var(--code-bg);
            padding: 1rem;
            border-radius: 8px;
            overflow-x: auto;
            margin-bottom: 1em;
        }
        
        pre code {
            padding: 0;
            background: none;
        }
        
        blockquote {
            border-left: 4px solid var(--link-color);
            padding-left: 1rem;
            margin: 1rem 0;
            color: inherit;
            opacity: 0.8;
        }
        
        ul, ol {
            padding-left: 2em;
            margin-bottom: 1em;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1em;
        }
        
        th, td {
            border: 1px solid var(--border-color);
            padding: 0.5rem;
            text-align: left;
        }
        
        th {
            background: var(--code-bg);
            font-weight: 600;
        }
        
        img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
        }
        
        hr {
            border: none;
            border-top: 2px solid var(--border-color);
            margin: 2rem 0;
        }
        
        .heading-anchor { display: none; }
        .copy-code-btn { display: none; }
        .code-language { display: none; }
    </style>
</head>
<body>
    <article class="markdown-body">
        ${renderedHTML}
    </article>
</body>
</html>`;
    }

    /**
     * Download file
     */
    downloadFile(filename, content, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        this.showToast(`Downloaded ${filename}`, 'success');
    }

    /**
     * Print document
     */
    printDocument() {
        window.print();
    }

    /**
     * Copy to clipboard
     */
    async copyToClipboard(format) {
        let content;

        if (format === 'markdown') {
            content = this.getContent ? this.getContent() : '';
        } else if (format === 'html') {
            content = this.getHTML ? this.getHTML() : '';
        }

        try {
            await navigator.clipboard.writeText(content);
            this.showToast('Copied to clipboard', 'success');
        } catch (error) {
            console.error('Copy failed:', error);
            this.showToast('Failed to copy', 'error');
        }
    }

    /**
     * Escape HTML
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return text.replace(/[&<>"']/g, char => map[char]);
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        if (this.showToastCallback) {
            this.showToastCallback(message, type);
        }
    }
}

