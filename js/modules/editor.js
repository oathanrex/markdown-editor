/**
 * Editor Module
 * Handles the text editor functionality
 */

/**
 * Editor Manager
 */
export class Editor {
    constructor(options = {}) {
        this.textarea = options.textarea || document.getElementById('editor-textarea');
        this.lineNumbers = options.lineNumbers || document.getElementById('line-numbers');
        this.onChangeCallback = options.onChange || null;
        this.onCursorChangeCallback = options.onCursorChange || null;

        this.wordWrap = true;
        this.tabSize = 4;
        this.undoStack = [];
        this.redoStack = [];
        this.maxUndoSize = 100;
        this.lastContent = '';
        this.isComposing = false;
        this.currentActiveLine = null;

        // Store bound handlers for cleanup
        this.boundHandlers = {};

        this.init();
    }

    /**
     * Cleanup and destroy editor instance
     */
    destroy() {
        if (this.textarea) {
            // Remove all event listeners
            Object.entries(this.boundHandlers).forEach(([event, handler]) => {
                this.textarea.removeEventListener(event, handler);
            });
        }

        // Clear memory
        this.undoStack = [];
        this.redoStack = [];
        this.lastContent = '';
        this.textarea = null;
        this.lineNumbers = null;
        this.boundHandlers = {};
    }

    /**
     * Initialize editor
     */
    init() {
        if (!this.textarea) return;

        // Store bound handlers for proper cleanup
        this.boundHandlers = {
            input: this.handleInput.bind(this),
            keydown: this.handleKeyDown.bind(this),
            scroll: this.handleScroll.bind(this),
            click: this.handleCursorChange.bind(this),
            keyup: this.handleCursorChange.bind(this),
            compositionstart: () => this.isComposing = true,
            compositionend: () => {
                this.isComposing = false;
                this.handleInput();
            }
        };

        // Set up event listeners using stored handlers
        Object.entries(this.boundHandlers).forEach(([event, handler]) => {
            this.textarea.addEventListener(event, handler);
        });

        // Initial line numbers update
        this.updateLineNumbers();

        // Store initial content for undo
        this.lastContent = this.textarea.value;
    }

    /**
     * Handle input event
     */
    handleInput() {
        if (this.isComposing) return;

        const content = this.textarea.value;

        // Update undo stack
        if (content !== this.lastContent) {
            this.pushUndo(this.lastContent);
            this.lastContent = content;
            this.redoStack = [];
        }

        // Update line numbers
        this.updateLineNumbers();

        // Call change callback
        if (this.onChangeCallback) {
            this.onChangeCallback(content);
        }
    }

    /**
     * Handle keydown event
     */
    handleKeyDown(e) {
        // Tab key handling
        if (e.key === 'Tab') {
            e.preventDefault();
            if (e.shiftKey) {
                this.outdent();
            } else {
                this.indent();
            }
            return;
        }

        // Enter key - auto-continue lists
        if (e.key === 'Enter' && !e.shiftKey) {
            const handled = this.handleEnterKey(e);
            if (handled) return;
        }

        // Undo/Redo
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                this.undo();
                return;
            }
            if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
                e.preventDefault();
                this.redo();
                return;
            }
        }
    }

    /**
     * Handle Enter key for list continuation
     */
    handleEnterKey(e) {
        const { selectionStart, value } = this.textarea;
        const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
        const currentLine = value.substring(lineStart, selectionStart);

        // Check for list patterns
        const patterns = [
            { regex: /^(\s*)[-*+]\s+\[[ xX]\]\s*$/, empty: true, prefix: (m) => '' },
            { regex: /^(\s*)[-*+]\s+\[[ xX]\]\s+(.+)$/, empty: false, prefix: (m) => `${m[1]}- [ ] ` },
            { regex: /^(\s*)[-*+]\s*$/, empty: true, prefix: (m) => '' },
            { regex: /^(\s*)[-*+]\s+(.+)$/, empty: false, prefix: (m) => `${m[1]}- ` },
            { regex: /^(\s*)(\d+)\.\s*$/, empty: true, prefix: (m) => '' },
            { regex: /^(\s*)(\d+)\.\s+(.+)$/, empty: false, prefix: (m) => `${m[1]}${parseInt(m[2]) + 1}. ` },
            { regex: /^(\s*)>\s*$/, empty: true, prefix: (m) => '' },
            { regex: /^(\s*)>\s+(.*)$/, empty: false, prefix: (m) => `${m[1]}> ` }
        ];

        for (const pattern of patterns) {
            const match = currentLine.match(pattern.regex);
            if (match) {
                e.preventDefault();

                if (pattern.empty) {
                    // Remove the empty list marker
                    const newValue = value.substring(0, lineStart) +
                        value.substring(selectionStart);
                    this.textarea.value = newValue;
                    this.textarea.selectionStart = this.textarea.selectionEnd = lineStart;
                } else {
                    // Continue the list
                    const prefix = pattern.prefix(match);
                    this.insertText('\n' + prefix);
                }

                this.handleInput();
                return true;
            }
        }

        return false;
    }

    /**
     * Handle scroll event
     */
    handleScroll() {
        if (this.lineNumbers) {
            this.lineNumbers.scrollTop = this.textarea.scrollTop;
        }
    }

    /**
     * Handle cursor change
     */
    handleCursorChange() {
        if (this.onCursorChangeCallback) {
            const pos = this.getCursorPosition();
            this.onCursorChangeCallback(pos);
        }

        // Update active line number
        this.updateActiveLineNumber();
    }

    /**
     * Get cursor position (line and column)
     */
    getCursorPosition() {
        const { selectionStart, value } = this.textarea;
        const lines = value.substring(0, selectionStart).split('\n');
        return {
            line: lines.length,
            column: lines[lines.length - 1].length + 1,
            offset: selectionStart
        };
    }

    /**
     * Set cursor position
     */
    setCursorPosition(offset) {
        this.textarea.selectionStart = this.textarea.selectionEnd = offset;
        this.textarea.focus();
    }

    /**
     * Update line numbers display (Incremental)
     */
    updateLineNumbers() {
        if (!this.lineNumbers) return;

        const lines = this.textarea.value.split('\n');
        const lineCount = lines.length;
        const currentCount = this.lineNumbers.children.length;

        if (lineCount === currentCount) return;

        if (lineCount > currentCount) {
            // Add new lines
            const fragment = document.createDocumentFragment();
            for (let i = currentCount + 1; i <= lineCount; i++) {
                const div = document.createElement('div');
                div.className = 'line-number';
                div.textContent = i;
                fragment.appendChild(div);
            }
            this.lineNumbers.appendChild(fragment);
        } else {
            // Remove extra lines
            while (this.lineNumbers.children.length > lineCount) {
                this.lineNumbers.lastElementChild.remove();
            }
        }
    }

    /**
     * Update active line number highlighting (O(1))
     */
    updateActiveLineNumber() {
        if (!this.lineNumbers) return;

        const { line } = this.getCursorPosition();

        // Remove active class from previous line
        if (this.currentActiveLine && this.currentActiveLine !== line) {
            const prevEl = this.lineNumbers.children[this.currentActiveLine - 1];
            if (prevEl) prevEl.classList.remove('active');
        }

        // Add active class to current line
        const currEl = this.lineNumbers.children[line - 1];
        if (currEl) {
            currEl.classList.add('active');
            this.currentActiveLine = line;
        }
    }

    /**
     * Insert text at cursor position
     */
    insertText(text) {
        const { selectionStart, selectionEnd, value } = this.textarea;

        this.textarea.value = value.substring(0, selectionStart) +
            text +
            value.substring(selectionEnd);

        const newPos = selectionStart + text.length;
        this.textarea.selectionStart = this.textarea.selectionEnd = newPos;
        this.textarea.focus();
        this.handleInput();
    }

    /**
     * Wrap selected text with prefix and suffix
     */
    wrapSelection(prefix, suffix = prefix) {
        const { selectionStart, selectionEnd, value } = this.textarea;
        const selectedText = value.substring(selectionStart, selectionEnd);

        // Check if already wrapped
        const before = value.substring(selectionStart - prefix.length, selectionStart);
        const after = value.substring(selectionEnd, selectionEnd + suffix.length);

        if (before === prefix && after === suffix) {
            // Unwrap
            this.textarea.value = value.substring(0, selectionStart - prefix.length) +
                selectedText +
                value.substring(selectionEnd + suffix.length);
            this.textarea.selectionStart = selectionStart - prefix.length;
            this.textarea.selectionEnd = selectionEnd - prefix.length;
        } else {
            // Wrap
            this.textarea.value = value.substring(0, selectionStart) +
                prefix + selectedText + suffix +
                value.substring(selectionEnd);
            this.textarea.selectionStart = selectionStart + prefix.length;
            this.textarea.selectionEnd = selectionEnd + prefix.length;
        }

        this.textarea.focus();
        this.handleInput();
    }

    /**
     * Prefix selected lines
     */
    prefixLines(prefix) {
        const { selectionStart, selectionEnd, value } = this.textarea;

        // Find line boundaries
        let lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
        let lineEnd = value.indexOf('\n', selectionEnd);
        if (lineEnd === -1) lineEnd = value.length;

        const selectedLines = value.substring(lineStart, lineEnd);
        const lines = selectedLines.split('\n');

        // Check if all lines already have prefix
        const allPrefixed = lines.every(line => line.startsWith(prefix));

        let newLines;
        if (allPrefixed) {
            // Remove prefix
            newLines = lines.map(line => line.substring(prefix.length));
        } else {
            // Add prefix
            newLines = lines.map(line => prefix + line);
        }

        const newText = newLines.join('\n');
        this.textarea.value = value.substring(0, lineStart) + newText + value.substring(lineEnd);

        // Adjust selection
        const lengthDiff = newText.length - selectedLines.length;
        this.textarea.selectionStart = lineStart;
        this.textarea.selectionEnd = lineEnd + lengthDiff;

        this.textarea.focus();
        this.handleInput();
    }

    /**
     * Indent selected text
     */
    indent() {
        const spaces = ' '.repeat(this.tabSize);
        this.prefixLines(spaces);
    }

    /**
     * Outdent selected text
     */
    outdent() {
        const { selectionStart, selectionEnd, value } = this.textarea;

        let lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
        let lineEnd = value.indexOf('\n', selectionEnd);
        if (lineEnd === -1) lineEnd = value.length;

        const selectedLines = value.substring(lineStart, lineEnd);
        const lines = selectedLines.split('\n');
        const spaces = ' '.repeat(this.tabSize);

        const newLines = lines.map(line => {
            if (line.startsWith(spaces)) {
                return line.substring(this.tabSize);
            } else if (line.startsWith('\t')) {
                return line.substring(1);
            }
            return line.replace(/^[ ]{1,4}/, '');
        });

        const newText = newLines.join('\n');
        this.textarea.value = value.substring(0, lineStart) + newText + value.substring(lineEnd);

        this.textarea.focus();
        this.handleInput();
    }

    /**
     * Apply formatting action
     */
    applyFormat(action) {
        switch (action) {
            case 'bold':
                this.wrapSelection('**');
                break;
            case 'italic':
                this.wrapSelection('*');
                break;
            case 'strikethrough':
                this.wrapSelection('~~');
                break;
            case 'code':
                this.wrapSelection('`');
                break;
            case 'h1':
                this.prefixLines('# ');
                break;
            case 'h2':
                this.prefixLines('## ');
                break;
            case 'h3':
                this.prefixLines('### ');
                break;
            case 'h4':
                this.prefixLines('#### ');
                break;
            case 'h5':
                this.prefixLines('##### ');
                break;
            case 'h6':
                this.prefixLines('###### ');
                break;
            case 'ul':
                this.prefixLines('- ');
                break;
            case 'ol':
                this.insertOrderedList();
                break;
            case 'tasklist':
                this.prefixLines('- [ ] ');
                break;
            case 'quote':
                this.prefixLines('> ');
                break;
            case 'hr':
                this.insertText('\n---\n');
                break;
            case 'codeblock':
                this.insertCodeBlock();
                break;
            case 'math':
                this.insertMathBlock();
                break;
            case 'mermaid':
                this.insertMermaidBlock();
                break;
        }
    }

    /**
     * Insert ordered list
     */
    insertOrderedList() {
        const { selectionStart, selectionEnd, value } = this.textarea;

        let lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
        let lineEnd = value.indexOf('\n', selectionEnd);
        if (lineEnd === -1) lineEnd = value.length;

        const selectedLines = value.substring(lineStart, lineEnd);
        const lines = selectedLines.split('\n');

        const newLines = lines.map((line, index) => {
            // Check if already numbered
            if (/^\d+\.\s/.test(line)) {
                return line.replace(/^\d+\.\s/, '');
            }
            return `${index + 1}. ${line}`;
        });

        const newText = newLines.join('\n');
        this.textarea.value = value.substring(0, lineStart) + newText + value.substring(lineEnd);

        this.textarea.focus();
        this.handleInput();
    }

    /**
     * Insert code block
     */
    insertCodeBlock() {
        const { selectionStart, selectionEnd, value } = this.textarea;
        const selectedText = value.substring(selectionStart, selectionEnd);

        const codeBlock = '```\n' + (selectedText || 'code here') + '\n```';

        this.textarea.value = value.substring(0, selectionStart) +
            codeBlock +
            value.substring(selectionEnd);

        // Position cursor inside code block
        this.textarea.selectionStart = selectionStart + 4;
        this.textarea.selectionEnd = selectionStart + 4 + (selectedText || 'code here').length;

        this.textarea.focus();
        this.handleInput();
    }

    /**
     * Insert math block
     */
    insertMathBlock() {
        const { selectionStart, selectionEnd, value } = this.textarea;
        const selectedText = value.substring(selectionStart, selectionEnd);

        const mathBlock = '$$\n' + (selectedText || 'E = mc^2') + '\n$$';

        this.textarea.value = value.substring(0, selectionStart) +
            mathBlock +
            value.substring(selectionEnd);

        this.textarea.selectionStart = selectionStart + 3;
        this.textarea.selectionEnd = selectionStart + 3 + (selectedText || 'E = mc^2').length;

        this.textarea.focus();
        this.handleInput();
    }

    /**
     * Insert Mermaid diagram block
     */
    insertMermaidBlock() {
        const template = `\`\`\`mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
\`\`\``;
        this.insertText(template);
    }

    /**
     * Push state to undo stack
     */
    pushUndo(content) {
        this.undoStack.push({
            content,
            selectionStart: this.textarea.selectionStart,
            selectionEnd: this.textarea.selectionEnd
        });

        if (this.undoStack.length > this.maxUndoSize) {
            this.undoStack.shift();
        }
    }

    /**
     * Undo last change
     */
    undo() {
        if (this.undoStack.length === 0) return;

        const state = this.undoStack.pop();

        this.redoStack.push({
            content: this.textarea.value,
            selectionStart: this.textarea.selectionStart,
            selectionEnd: this.textarea.selectionEnd
        });

        this.textarea.value = state.content;
        this.textarea.selectionStart = state.selectionStart;
        this.textarea.selectionEnd = state.selectionEnd;
        this.lastContent = state.content;

        this.handleInput();
    }

    /**
     * Redo last undone change
     */
    redo() {
        if (this.redoStack.length === 0) return;

        const state = this.redoStack.pop();

        this.undoStack.push({
            content: this.textarea.value,
            selectionStart: this.textarea.selectionStart,
            selectionEnd: this.textarea.selectionEnd
        });

        this.textarea.value = state.content;
        this.textarea.selectionStart = state.selectionStart;
        this.textarea.selectionEnd = state.selectionEnd;
        this.lastContent = state.content;

        this.handleInput();
    }

    /**
     * Get editor content
     */
    getContent() {
        return this.textarea.value;
    }

    /**
     * Set editor content
     */
    setContent(content, options = {}) {
        const { silent = false } = options;
        this.textarea.value = content;
        this.lastContent = content;
        this.undoStack = [];
        this.redoStack = [];
        this.updateLineNumbers();

        if (!silent && this.onChangeCallback) {
            this.onChangeCallback(content);
        }
    }

    /**
     * Toggle word wrap
     */
    toggleWordWrap() {
        this.wordWrap = !this.wordWrap;
        this.textarea.classList.toggle('no-wrap', !this.wordWrap);
        return this.wordWrap;
    }

    /**
     * Set tab size
     */
    setTabSize(size) {
        this.tabSize = parseInt(size) || 4;
        this.textarea.style.tabSize = this.tabSize;
    }

    /**
     * Focus the editor
     */
    focus() {
        this.textarea.focus();
    }

    /**
     * Get selected text
     */
    getSelection() {
        const { selectionStart, selectionEnd, value } = this.textarea;
        return value.substring(selectionStart, selectionEnd);
    }

    /**
     * Replace selected text
     */
    replaceSelection(text) {
        const { selectionStart, selectionEnd, value } = this.textarea;

        this.textarea.value = value.substring(0, selectionStart) +
            text +
            value.substring(selectionEnd);

        this.textarea.selectionStart = selectionStart;
        this.textarea.selectionEnd = selectionStart + text.length;

        this.handleInput();
    }

    /**
     * Scroll to line
     */
    scrollToLine(lineNumber) {
        const lines = this.textarea.value.split('\n');
        let offset = 0;

        for (let i = 0; i < lineNumber - 1 && i < lines.length; i++) {
            offset += lines[i].length + 1;
        }

        this.setCursorPosition(offset);

        // Calculate approximate scroll position - handle 'normal' lineHeight
        const computedLineHeight = getComputedStyle(this.textarea).lineHeight;
        const lineHeight = computedLineHeight === 'normal'
            ? parseInt(getComputedStyle(this.textarea).fontSize) * 1.2
            : parseInt(computedLineHeight);
        this.textarea.scrollTop = (lineNumber - 5) * lineHeight;
    }
    /**
     * Set read-only mode
     */
    setReadOnly(readOnly) {
        this.textarea.readOnly = readOnly;
        this.textarea.classList.toggle('read-only', readOnly);
    }
}

