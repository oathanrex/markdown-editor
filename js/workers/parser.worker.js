/**
 * Parser Web Worker
 * Offloads heavy parsing to a separate thread
 */

// Simple markdown parser for worker (subset of main parser)
class WorkerParser {
    constructor() {
        this.emojiMap = {
            'smile': '😄', 'heart': '❤️', 'thumbsup': '👍', 'star': '⭐',
            'fire': '🔥', 'check': '✔️', 'x': '❌', 'warning': '⚠️'
        };
    }

    parse(markdown) {
        if (!markdown) return '';

        let html = markdown;

        // Basic transformations
        html = this.escapeHtml(html);
        html = this.parseBlocks(html);
        html = this.parseInline(html);

        return html;
    }

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

    parseBlocks(text) {
        const lines = text.split('\n');
        let html = '';
        let inCodeBlock = false;
        let codeContent = '';
        let codeLang = '';

        for (let line of lines) {
            // Code blocks
            if (line.startsWith('```')) {
                if (inCodeBlock) {
                    html += `<pre><code class="language-${codeLang}">${codeContent}</code></pre>`;
                    codeContent = '';
                    inCodeBlock = false;
                } else {
                    inCodeBlock = true;
                    codeLang = line.slice(3).trim();
                }
                continue;
            }

            if (inCodeBlock) {
                codeContent += line + '\n';
                continue;
            }

            // Headings
            const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
            if (headingMatch) {
                const level = headingMatch[1].length;
                html += `<h${level}>${headingMatch[2]}</h${level}>`;
                continue;
            }

            // Horizontal rules
            if (/^[-*_]{3,}$/.test(line.trim())) {
                html += '<hr>';
                continue;
            }

            // Paragraphs
            if (line.trim()) {
                html += `<p>${line}</p>`;
            }
        }

        return html;
    }

    parseInline(text) {
        // Bold
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        // Italic
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
        // Code
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        // Links
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

        return text;
    }

    getWordCount(text) {
        return text.trim().split(/\s+/).filter(w => w.length > 0).length;
    }
}

const parser = new WorkerParser();

// Handle messages from main thread
self.onmessage = function (e) {
    const { type, id, data } = e.data;

    switch (type) {
        case 'parse':
            const html = parser.parse(data);
            self.postMessage({ type: 'parsed', id, data: html });
            break;

        case 'wordCount':
            const count = parser.getWordCount(data);
            self.postMessage({ type: 'wordCount', id, data: count });
            break;

        default:
            console.warn('Unknown worker message type:', type);
    }
};