/**
 * Parser Module
 * Handles Markdown parsing with GFM support, emoji, math, and Mermaid
 */

/**
 * Markdown Parser with GitHub Flavored Markdown support
 */
export class Parser {
    constructor() {
        // Emoji map (subset - full map would be much larger)
        this.emojiMap = {
            'smile': '😄', 'laughing': '😆', 'blush': '😊', 'smiley': '😃',
            'relaxed': '☺️', 'smirk': '😏', 'heart_eyes': '😍', 'kissing_heart': '😘',
            'kissing_closed_eyes': '😚', 'flushed': '😳', 'relieved': '😌', 'satisfied': '😆',
            'grin': '😁', 'wink': '😉', 'stuck_out_tongue_winking_eye': '😜',
            'stuck_out_tongue_closed_eyes': '😝', 'grinning': '😀', 'kissing': '😗',
            'kissing_smiling_eyes': '😙', 'stuck_out_tongue': '😛', 'sleeping': '😴',
            'worried': '😟', 'frowning': '😦', 'anguished': '😧', 'open_mouth': '😮',
            'grimacing': '😬', 'confused': '😕', 'hushed': '😯', 'expressionless': '😑',
            'unamused': '😒', 'sweat_smile': '😅', 'sweat': '😓', 'disappointed_relieved': '😥',
            'weary': '😩', 'pensive': '😔', 'disappointed': '😞', 'confounded': '😖',
            'fearful': '😨', 'cold_sweat': '😰', 'persevere': '😣', 'cry': '😢',
            'sob': '😭', 'joy': '😂', 'astonished': '😲', 'scream': '😱',
            'tired_face': '😫', 'angry': '😠', 'rage': '😡', 'triumph': '😤',
            'sleepy': '😪', 'yum': '😋', 'mask': '😷', 'sunglasses': '😎',
            'dizzy_face': '😵', 'imp': '👿', 'smiling_imp': '😈', 'neutral_face': '😐',
            'no_mouth': '😶', 'innocent': '😇', 'alien': '👽', 'yellow_heart': '💛',
            'blue_heart': '💙', 'purple_heart': '💜', 'heart': '❤️', 'green_heart': '💚',
            'broken_heart': '💔', 'heartbeat': '💓', 'heartpulse': '💗', 'two_hearts': '💕',
            'revolving_hearts': '💞', 'cupid': '💘', 'sparkling_heart': '💖', 'sparkles': '✨',
            'star': '⭐', 'star2': '🌟', 'dizzy': '💫', 'boom': '💥', 'collision': '💥',
            'anger': '💢', 'exclamation': '❗', 'question': '❓', 'grey_exclamation': '❕',
            'grey_question': '❔', 'zzz': '💤', 'dash': '💨', 'sweat_drops': '💦',
            'notes': '🎶', 'musical_note': '🎵', 'fire': '🔥', 'hankey': '💩',
            'poop': '💩', 'shit': '💩', 'thumbsup': '👍', '+1': '👍', 'thumbsdown': '👎',
            '-1': '👎', 'ok_hand': '👌', 'punch': '👊', 'fist': '✊', 'v': '✌️',
            'wave': '👋', 'hand': '✋', 'raised_hand': '✋', 'open_hands': '👐',
            'point_up': '☝️', 'point_down': '👇', 'point_left': '👈', 'point_right': '👉',
            'raised_hands': '🙌', 'pray': '🙏', 'point_up_2': '👆', 'clap': '👏',
            'muscle': '💪', 'metal': '🤘', 'fu': '🖕', 'runner': '🏃', 'running': '🏃',
            'couple': '👫', 'family': '👪', 'two_men_holding_hands': '👬',
            'two_women_holding_hands': '👭', 'dancer': '💃', 'dancers': '👯',
            'ok_woman': '🙆', 'no_good': '🙅', 'information_desk_person': '💁',
            'raising_hand': '🙋', 'bride_with_veil': '👰', 'person_with_pouting_face': '🙎',
            'person_frowning': '🙍', 'bow': '🙇', 'couplekiss': '💏', 'couple_with_heart': '💑',
            'massage': '💆', 'haircut': '💇', 'nail_care': '💅', 'boy': '👦', 'girl': '👧',
            'woman': '👩', 'man': '👨', 'baby': '👶', 'older_woman': '👵', 'older_man': '👴',
            'cop': '👮', 'angel': '👼', 'princess': '👸', 'guardsman': '💂',
            'rocket': '🚀', 'airplane': '✈️', 'balloon': '🎈', 'tada': '🎉',
            'gift': '🎁', 'christmas_tree': '🎄', 'santa': '🎅', 'camera': '📷',
            'video_camera': '📹', 'computer': '💻', 'tv': '📺', 'iphone': '📱',
            'phone': '☎️', 'telephone': '☎️', 'email': '📧', 'envelope': '✉️',
            'memo': '📝', 'pencil': '📝', 'book': '📖', 'books': '📚',
            'art': '🎨', 'movie_camera': '🎥', 'microphone': '🎤', 'headphones': '🎧',
            'musical_score': '🎼', 'violin': '🎻', 'video_game': '🎮', 'space_invader': '👾',
            'dart': '🎯', 'game_die': '🎲', 'slot_machine': '🎰', 'bowling': '🎳',
            'warning': '⚠️', 'check': '✔️', 'x': '❌', 'heavy_check_mark': '✔️',
            'heavy_multiplication_x': '✖️', 'copyright': '©️', 'registered': '®️',
            'tm': '™️', 'hash': '#️⃣', 'keycap_ten': '🔟', 'zero': '0️⃣', 'one': '1️⃣',
            'two': '2️⃣', 'three': '3️⃣', 'four': '4️⃣', 'five': '5️⃣', 'six': '6️⃣',
            'seven': '7️⃣', 'eight': '8️⃣', 'nine': '9️⃣', 'arrow_up': '⬆️',
            'arrow_down': '⬇️', 'arrow_left': '⬅️', 'arrow_right': '➡️',
            'white_check_mark': '✅', 'clock1': '🕐', 'clock2': '🕑', 'clock3': '🕒'
        };

        // Regex patterns for parsing
        this.patterns = {
            // Block patterns
            heading: /^(#{1,6})\s+(.+)$/,
            codeBlock: /^```(\w*)\n([\s\S]*?)```$/,
            codeBlockStart: /^```(\w*)$/,
            codeBlockEnd: /^```$/,
            blockquote: /^>\s?(.*)$/,
            horizontalRule: /^(?:---+|___+|\*\*\*+)$/,
            unorderedList: /^(\s*)[-*+]\s+(.+)$/,
            orderedList: /^(\s*)(\d+)\.\s+(.+)$/,
            taskList: /^(\s*)[-*+]\s+\[([ xX])\]\s+(.+)$/,
            table: /^\|(.+)\|$/,
            tableSeparator: /^\|[\s-:|]+\|$/,

            // Inline patterns
            bold: /\*\*(.+?)\*\*|__(.+?)__/g,
            italic: /\*([^\*\n]{1,1000}?)\*|_([^_\n]{1,1000}?)_/g, // Fixed: ReDoS protection
            strikethrough: /~~(.+?)~~/g,
            inlineCode: /`([^`]+)`/g,
            link: /\[([^\]]+)\]\(([^)]+)\)/g,
            image: /!\[([^\]]*)\]\(([^)]+)\)/g,
            autolink: /<(https?:\/\/[^>]+)>/g,
            email: /<([^@\s]+@[^>\s]+)>/g,
            emoji: /:([a-z0-9_+-]+):/gi,

            // Math patterns
            mathBlock: /\$\$\n?([\s\S]+?)\n?\$\$/g,
            mathInline: /\$([^\$\n]+)\$/g,

            // Mermaid
            mermaidBlock: /^```mermaid\n([\s\S]*?)```$/
        };

        this.mermaidId = 0;
    }

    /**
     * Parse Markdown to HTML
     * @param {string} markdown - Raw markdown text
     * @returns {string} - Rendered HTML
     */
    parse(markdown) {
        if (!markdown || typeof markdown !== 'string') {
            return '';
        }

        // Security: Limit document size to prevent DoS
        const MAX_SIZE = 10 * 1024 * 1024; // 10MB
        if (new Blob([markdown]).size > MAX_SIZE) {
            console.error('Document too large');
            return '<div class="error">Document exceeds maximum size (10MB)</div>';
        }

        // Normalize line endings
        markdown = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        // Parse block elements
        let html = this.parseBlocks(markdown);

        // Sanitize HTML to prevent XSS
        html = this.sanitize(html);

        return html;
    }

    /**
     * Parse block-level elements
     * @param {string} markdown 
     * @returns {string}
     */
    parseBlocks(markdown) {
        const lines = markdown.split('\n');
        let html = '';
        let i = 0;
        let inCodeBlock = false;
        let codeBlockLang = '';
        let codeBlockContent = '';
        let inTable = false;
        let tableRows = [];
        let inBlockquote = false;
        let blockquoteContent = '';
        let inList = false;
        let listItems = [];
        let listType = '';
        let listIndent = 0;

        while (i < lines.length) {
            const line = lines[i];
            const currentLineIndex = i; // usage for data-source-line

            // Handle code blocks
            if (this.patterns.codeBlockStart.test(line) && !inCodeBlock) {
                // Flush pending
                html += this.flushBlockquote(inBlockquote, blockquoteContent);
                inBlockquote = false;
                blockquoteContent = '';
                html += this.flushList(inList, listItems, listType);
                inList = false;
                listItems = [];

                inCodeBlock = true;
                codeBlockLang = line.match(this.patterns.codeBlockStart)[1] || '';
                codeBlockContent = '';
                // Store start line for the block
                this.currentBlockStartLine = currentLineIndex;
                i++;
                continue;
            }

            if (this.patterns.codeBlockEnd.test(line) && inCodeBlock) {
                // Check if it's mermaid
                if (codeBlockLang.toLowerCase() === 'mermaid') {
                    html += this.renderMermaid(codeBlockContent.trim(), this.currentBlockStartLine);
                } else {
                    html += this.renderCodeBlock(codeBlockContent, codeBlockLang, this.currentBlockStartLine);
                }
                inCodeBlock = false;
                codeBlockLang = '';
                codeBlockContent = '';
                i++;
                continue;
            }

            if (inCodeBlock) {
                codeBlockContent += (codeBlockContent ? '\n' : '') + line;
                i++;
                continue;
            }

            // Handle tables
            if (this.patterns.table.test(line)) {
                html += this.flushBlockquote(inBlockquote, blockquoteContent);
                inBlockquote = false;
                blockquoteContent = '';
                html += this.flushList(inList, listItems, listType);
                inList = false;
                listItems = [];

                if (!inTable) {
                    inTable = true;
                    tableRows = [];
                    this.currentBlockStartLine = currentLineIndex;
                }
                tableRows.push(line);
                i++;
                continue;
            } else if (inTable) {
                html += this.renderTable(tableRows, this.currentBlockStartLine);
                inTable = false;
                tableRows = [];
            }

            // Handle blockquotes
            if (this.patterns.blockquote.test(line)) {
                html += this.flushList(inList, listItems, listType);
                inList = false;
                listItems = [];

                const match = line.match(this.patterns.blockquote);
                // If starting new blockquote, track line
                if (!inBlockquote) {
                    this.currentBlockStartLine = currentLineIndex;
                }
                blockquoteContent += (blockquoteContent ? '\n' : '') + match[1];
                inBlockquote = true;
                i++;
                continue;
            } else if (inBlockquote) {
                html += this.flushBlockquote(true, blockquoteContent, this.currentBlockStartLine);
                inBlockquote = false;
                blockquoteContent = '';
            }

            // Handle headings
            if (this.patterns.heading.test(line)) {
                html += this.flushList(inList, listItems, listType);
                inList = false;
                listItems = [];

                const match = line.match(this.patterns.heading);
                const level = match[1].length;
                const text = this.parseInline(match[2]);
                const id = this.slugify(match[2]);
                html += `<h${level} id="${id}" data-source-line="${currentLineIndex}"><a class="heading-anchor" href="#${id}">#</a>${text}</h${level}>`;
                i++;
                continue;
            }

            // Handle horizontal rules
            if (this.patterns.horizontalRule.test(line.trim())) {
                html += this.flushList(inList, listItems, listType);
                inList = false;
                listItems = [];
                html += `<hr data-source-line="${currentLineIndex}">`;
                i++;
                continue;
            }

            // Handle task lists
            const taskMatch = line.match(this.patterns.taskList);
            if (taskMatch) {
                if (!inList || listType !== 'task') {
                    html += this.flushList(inList, listItems, listType);
                    inList = true;
                    listType = 'task';
                    listItems = [];
                }
                const checked = taskMatch[2].toLowerCase() === 'x';
                listItems.push({
                    indent: taskMatch[1].length,
                    content: taskMatch[3],
                    checked: checked,
                    line: currentLineIndex
                });
                i++;
                continue;
            }

            // Handle unordered lists
            const ulMatch = line.match(this.patterns.unorderedList);
            if (ulMatch && !this.patterns.taskList.test(line)) {
                if (!inList || listType !== 'ul') {
                    html += this.flushList(inList, listItems, listType);
                    inList = true;
                    listType = 'ul';
                    listItems = [];
                }
                listItems.push({
                    indent: ulMatch[1].length,
                    content: ulMatch[2],
                    line: currentLineIndex
                });
                i++;
                continue;
            }

            // Handle ordered lists
            const olMatch = line.match(this.patterns.orderedList);
            if (olMatch) {
                if (!inList || listType !== 'ol') {
                    html += this.flushList(inList, listItems, listType);
                    inList = true;
                    listType = 'ol';
                    listItems = [];
                }
                listItems.push({
                    indent: olMatch[1].length,
                    content: olMatch[3],
                    number: parseInt(olMatch[2]),
                    line: currentLineIndex
                });
                i++;
                continue;
            }

            // Flush list if we hit a non-list line
            if (inList) {
                html += this.flushList(inList, listItems, listType);
                inList = false;
                listItems = [];
            }

            // Handle empty lines
            if (line.trim() === '') {
                i++;
                continue;
            }

            // Handle paragraphs
            let paragraph = line;
            const paragraphStartLine = currentLineIndex;
            while (i + 1 < lines.length &&
                lines[i + 1].trim() !== '' &&
                !this.isBlockElement(lines[i + 1])) {
                i++;
                paragraph += ' ' + lines[i];
            }
            html += `<p data-source-line="${paragraphStartLine}">${this.parseInline(paragraph)}</p>`;
            i++;
        }

        // Flush remaining content
        if (inCodeBlock) {
            html += this.renderCodeBlock(codeBlockContent, codeBlockLang, this.currentBlockStartLine);
        }
        if (inTable) {
            html += this.renderTable(tableRows, this.currentBlockStartLine);
        }
        if (inBlockquote) {
            html += this.flushBlockquote(true, blockquoteContent, this.currentBlockStartLine);
        }
        if (inList) {
            html += this.flushList(true, listItems, listType);
        }

        return html;
    }

    /**
     * Check if a line is a block element
     */
    isBlockElement(line) {
        return this.patterns.heading.test(line) ||
            this.patterns.codeBlockStart.test(line) ||
            this.patterns.blockquote.test(line) ||
            this.patterns.horizontalRule.test(line.trim()) ||
            this.patterns.unorderedList.test(line) ||
            this.patterns.orderedList.test(line) ||
            this.patterns.table.test(line) ||
            this.patterns.taskList.test(line);
    }

    /**
     * Parse inline elements
     */
    parseInline(text) {
        if (!text) return '';

        // Escape HTML first
        text = this.escapeHtml(text);

        // Process math first (before other transformations)
        text = this.parseMathInline(text);

        // Images (before links to prevent conflict)
        text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

        // Links
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        // Autolinks
        text = text.replace(/&lt;(https?:\/\/[^&]+)&gt;/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');

        // Bold
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');

        // Italic (careful not to match inside words with underscores)
        text = text.replace(/(?<!\w)\*([^*]+)\*(?!\w)/g, '<em>$1</em>');
        text = text.replace(/(?<!\w)_([^_]+)_(?!\w)/g, '<em>$1</em>');

        // Strikethrough
        text = text.replace(/~~(.+?)~~/g, '<del>$1</del>');

        // Inline code (after escaping HTML)
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Emoji
        text = text.replace(/:([a-z0-9_+-]+):/gi, (match, name) => {
            const emoji = this.emojiMap[name.toLowerCase()];
            return emoji || match;
        });

        // Line breaks (two spaces at end of line)
        text = text.replace(/  $/gm, '<br>');

        return text;
    }

    /**
     * Parse inline math
     */
    parseMathInline(text) {
        // Block math ($$...$$)
        text = text.replace(/\$\$([^$]+)\$\$/g, (match, math) => {
            return `<span class="math-block" data-math="${this.escapeHtml(math)}">${this.escapeHtml(math)}</span>`;
        });

        // Inline math ($...$)
        text = text.replace(/\$([^$\n]+)\$/g, (match, math) => {
            return `<span class="math-inline" data-math="${this.escapeHtml(math)}">${this.escapeHtml(math)}</span>`;
        });

        return text;
    }

    /**
     * Render code block with syntax highlighting
     */
    /**
     * Render code block with syntax highlighting
     */
    renderCodeBlock(code, language, line) {
        const langClass = language ? `language-${language}` : '';
        const langLabel = language ? `<span class="code-language">${language}</span>` : '';
        const escapedCode = this.escapeHtml(code);
        const lineAttr = line !== undefined ? ` data-source-line="${line}"` : '';

        return `<div class="code-block-wrapper"${lineAttr}>
                ${langLabel}
                <button class="copy-code-btn" type="button" aria-label="Copy code">Copy</button>
                <pre><code class="${langClass}">${escapedCode}</code></pre>
            </div>`;
    }

    /**
     * Render Mermaid diagram placeholder
     */
    renderMermaid(code, line) {
        const id = `mermaid-${++this.mermaidId}`;
        const lineAttr = line !== undefined ? ` data-source-line="${line}"` : '';
        return `<div class="mermaid" id="${id}" data-mermaid="${this.escapeHtml(code)}"${lineAttr}>${this.escapeHtml(code)}</div>`;
    }

    /**
     * Render table
     */
    renderTable(rows, line) {
        if (rows.length < 2) return '';

        const lineAttr = line !== undefined ? ` data-source-line="${line}"` : '';
        let html = `<table${lineAttr}>`;
        let isHeader = true;
        let alignments = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            // Check if this is the separator row
            if (this.patterns.tableSeparator.test(row)) {
                // Parse alignments
                const cells = row.slice(1, -1).split('|');
                alignments = cells.map(cell => {
                    cell = cell.trim();
                    if (cell.startsWith(':') && cell.endsWith(':')) return 'center';
                    if (cell.endsWith(':')) return 'right';
                    return 'left';
                });
                isHeader = false;
                continue;
            }

            const cells = row.slice(1, -1).split('|').map(c => c.trim());
            const tag = isHeader ? 'th' : 'td';

            if (isHeader) {
                html += '<thead><tr>';
            } else if (i === 2 || (i === 1 && !this.patterns.tableSeparator.test(rows[1]))) {
                html += '<tbody>';
            }

            html += '<tr>';
            cells.forEach((cell, j) => {
                const align = alignments[j] ? ` style="text-align: ${alignments[j]}"` : '';
                html += `<${tag}${align}>${this.parseInline(cell)}</${tag}>`;
            });
            html += '</tr>';

            if (isHeader && this.patterns.tableSeparator.test(rows[i + 1] || '')) {
                html += '</thead>';
            }
        }

        html += '</tbody></table>';
        return html;
    }

    /**
     * Flush blockquote content
     */
    flushBlockquote(inBlockquote, content, line) {
        if (!inBlockquote || !content) return '';
        const innerHtml = this.parseBlocks(content);
        const lineAttr = line !== undefined ? ` data-source-line="${line}"` : '';
        return `<blockquote${lineAttr}>${innerHtml}</blockquote>`;
    }

    /**
     * Flush list content
     */
    flushList(inList, items, type) {
        if (!inList || items.length === 0) return '';

        const tag = type === 'ol' ? 'ol' : 'ul';
        const lineAttr = items[0]?.line !== undefined ? ` data-source-line="${items[0].line}"` : '';
        let html = `<${tag}${lineAttr}>`;

        items.forEach(item => {
            if (type === 'task') {
                const checked = item.checked ? ' checked' : '';
                html += `<li class="task-list-item"><input type="checkbox"${checked} disabled> ${this.parseInline(item.content)}</li>`;
            } else {
                html += `<li>${this.parseInline(item.content)}</li>`;
            }
        });

        html += `</${tag}>`;
        return html;
    }

    /**
     * Create URL-friendly slug from text
     */
    slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * Escape HTML special characters
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
     * Sanitize HTML to prevent XSS
     */
    sanitize(html) {
        if (typeof DOMPurify !== 'undefined') {
            return DOMPurify.sanitize(html, {
                ADD_TAGS: ['mermaid', 'math-inline', 'math-block'],
                ADD_ATTR: ['data-math', 'data-mermaid', 'target', 'rel', 'class', 'id', 'data-source-line'],
                ALLOW_DATA_ATTR: true,
                FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
                FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 'onmouseenter', 'onmouseleave']
            });
        }

        // Fallback: Strip dangerous content when DOMPurify is unavailable
        console.warn('DOMPurify unavailable - using fallback sanitization');
        return html
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/<style[\s\S]*?<\/style>/gi, '')
            .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
            .replace(/<object[\s\S]*?<\/object>/gi, '')
            .replace(/<embed[\s\S]*?>/gi, '')
            .replace(/on\w+\s*=/gi, 'data-blocked-event=')
            .replace(/javascript:/gi, 'blocked:');
    }

    /**
     * Extract headings for TOC
     */
    extractHeadings(markdown) {
        const headings = [];
        const lines = markdown.split('\n');

        lines.forEach(line => {
            const match = line.match(this.patterns.heading);
            if (match) {
                headings.push({
                    level: match[1].length,
                    text: match[2].replace(/[*_`~]/g, ''),
                    id: this.slugify(match[2])
                });
            }
        });
        return headings;
    }

    /**
     * Get word count from markdown
     */
    getWordCount(markdown) {
        const text = markdown
            .replace(/```[\s\S]*?```/g, '') // Remove code blocks
            .replace(/`[^`]+`/g, '') // Remove inline code
            .replace(/!?\[([^\]]*)\]\([^)]+\)/g, '$1') // Links/images to text
            .replace(/[#*_~`>|]/g, '') // Remove markdown symbols
            .trim();

        if (!text) return 0;
        return text.split(/\s+/).filter(word => word.length > 0).length;
    }

    /**
     * Get character count
     */
    getCharCount(markdown) {
        return markdown.length;
    }
}

