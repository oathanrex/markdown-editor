/**
 * Search Module
 * Find and replace functionality with regex support
 */

/**
 * Search Manager
 */
export class Search {
    constructor(options = {}) {
        this.editor = options.editor;
        this.showToast = options.showToast || (() => { }); // Callback for notifications
        this.panel = document.getElementById('find-replace-panel');
        this.findInput = document.getElementById('find-input');
        this.replaceInput = document.getElementById('replace-input');
        this.matchCountEl = document.getElementById('match-count');
        this.caseSensitiveCheck = document.getElementById('find-case-sensitive');
        this.wholeWordCheck = document.getElementById('find-whole-word');
        this.regexCheck = document.getElementById('find-regex');

        this.matches = [];
        this.currentMatchIndex = -1;
        this.isOpen = false;

        this.init();
    }

    /**
     * Initialize search
     */
    init() {
        if (!this.panel) return;

        // Find input events
            this.findInput.addEventListener('input', (e) => {
                try {
                    this.handleFindInput(e);
                } catch (err) {
                    this.showToast('Search error: ' + err.message, 'error');
                }
            });
            this.findInput.addEventListener('keydown', (e) => {
                try {
                    this.handleFindKeydown(e);
                } catch (err) {
                    this.showToast('Search error: ' + err.message, 'error');
                }
            });

        // Replace input events
            this.replaceInput.addEventListener('keydown', (e) => {
                try {
                    this.handleReplaceKeydown(e);
                } catch (err) {
                    this.showToast('Replace error: ' + err.message, 'error');
                }
            });

        // Option changes
            this.caseSensitiveCheck.addEventListener('change', () => {
                try {
                    this.performSearch();
                } catch (err) {
                    this.showToast('Search error: ' + err.message, 'error');
                }
            });
            this.wholeWordCheck.addEventListener('change', () => {
                try {
                    this.performSearch();
                } catch (err) {
                    this.showToast('Search error: ' + err.message, 'error');
                }
            });
            this.regexCheck.addEventListener('change', () => {
                try {
                    this.performSearch();
                } catch (err) {
                    this.showToast('Search error: ' + err.message, 'error');
                }
            });

        // Button events
            document.getElementById('find-prev').addEventListener('click', () => {
                try {
                    this.findPrevious();
                } catch (err) {
                    this.showToast('Find error: ' + err.message, 'error');
                }
            });
            document.getElementById('find-next').addEventListener('click', () => {
                try {
                    this.findNext();
                } catch (err) {
                    this.showToast('Find error: ' + err.message, 'error');
                }
            });
            document.getElementById('replace-one').addEventListener('click', () => {
                try {
                    this.replaceOne();
                } catch (err) {
                    this.showToast('Replace error: ' + err.message, 'error');
                }
            });
            document.getElementById('replace-all').addEventListener('click', () => {
                try {
                    this.replaceAll();
                } catch (err) {
                    this.showToast('Replace error: ' + err.message, 'error');
                }
            });
            document.getElementById('close-find').addEventListener('click', () => {
                try {
                    this.close();
                } catch (err) {
                    this.showToast('Close error: ' + err.message, 'error');
                }
            });
    }

    /**
     * Open search panel
     */
    open() {
        this.panel.hidden = false;
        this.isOpen = true;
        this.findInput.focus();

        // If there's selected text, use it as search query
        if (this.editor) {
            const selection = this.editor.getSelection();
            if (selection) {
                this.findInput.value = selection;
                this.performSearch();
            }
        }

        this.findInput.select();
    }

    /**
     * Close search panel
     */
    close() {
        this.panel.hidden = true;
        this.isOpen = false;
        this.clearHighlights();

        if (this.editor) {
            this.editor.focus();
        }
    }

    /**
     * Toggle search panel
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Handle find input
     */
    handleFindInput() {
        this.performSearch();
    }

    /**
     * Handle find input keydown
     */
    handleFindKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.shiftKey) {
                this.findPrevious();
            } else {
                this.findNext();
            }
        } else if (e.key === 'Escape') {
            this.close();
        }
    }

    /**
     * Handle replace input keydown
     */
    handleReplaceKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.replaceOne();
        } else if (e.key === 'Escape') {
            this.close();
        }
    }

    /**
     * Perform search
     */
    performSearch() {
        const query = this.findInput.value;

        if (!query || !this.editor) {
            this.matches = [];
            this.currentMatchIndex = -1;
            this.updateMatchCount();
            return;
        }

        const content = this.editor.getContent();
        const options = this.getSearchOptions();

        try {
            const regex = this.createSearchRegex(query, options);
            this.matches = [];

            let match;
            while ((match = regex.exec(content)) !== null) {
                this.matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0]
                });

                // Prevent infinite loops with empty matches
                if (match[0].length === 0) {
                    regex.lastIndex++;
                }
            }

            this.currentMatchIndex = this.matches.length > 0 ? 0 : -1;
            this.updateMatchCount();

            if (this.currentMatchIndex >= 0) {
                this.highlightCurrentMatch();
            }
        } catch (e) {
            // Invalid regex
            this.matches = [];
            this.currentMatchIndex = -1;
            this.matchCountEl.textContent = 'Invalid regex';
        }
    }

    /**
     * Get search options
     */
    getSearchOptions() {
        return {
            caseSensitive: this.caseSensitiveCheck.checked,
            wholeWord: this.wholeWordCheck.checked,
            useRegex: this.regexCheck.checked
        };
    }

    /**
     * Create search regex
     */
    createSearchRegex(query, options) {
        let pattern = query;

        if (!options.useRegex) {
            // Escape regex special characters
            pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        if (options.wholeWord) {
            pattern = `\\b${pattern}\\b`;
        }

        const flags = options.caseSensitive ? 'g' : 'gi';
        return new RegExp(pattern, flags);
    }

    /**
     * Update match count display
     */
    updateMatchCount() {
        if (this.matches.length === 0) {
            this.matchCountEl.textContent = 'No results';
        } else {
            this.matchCountEl.textContent = `${this.currentMatchIndex + 1} of ${this.matches.length}`;
        }
    }

    /**
     * Find next match
     */
    findNext() {
        if (this.matches.length === 0) {
            this.performSearch();
            return;
        }

        this.currentMatchIndex = (this.currentMatchIndex + 1) % this.matches.length;
        this.highlightCurrentMatch();
        this.updateMatchCount();
    }

    /**
     * Find previous match
     */
    findPrevious() {
        if (this.matches.length === 0) {
            this.performSearch();
            return;
        }

        this.currentMatchIndex = this.currentMatchIndex <= 0
            ? this.matches.length - 1
            : this.currentMatchIndex - 1;
        this.highlightCurrentMatch();
        this.updateMatchCount();
    }

    /**
     * Highlight current match in editor
     */
    highlightCurrentMatch() {
        if (this.currentMatchIndex < 0 || this.currentMatchIndex >= this.matches.length) return;

        const match = this.matches[this.currentMatchIndex];
        const textarea = this.editor.textarea;

        textarea.focus();
        textarea.setSelectionRange(match.start, match.end);

        // Scroll match into view
        this.scrollMatchIntoView(match.start);
    }

    /**
     * Scroll to show match in editor
     */
    scrollMatchIntoView(offset) {
        const textarea = this.editor.textarea;
        const content = textarea.value;

        // Calculate line number
        const lines = content.substring(0, offset).split('\n');
        const lineNumber = lines.length;

        // Approximate scroll position - handle 'normal' lineHeight
        const computedLineHeight = getComputedStyle(textarea).lineHeight;
        const lineHeight = computedLineHeight === 'normal'
            ? parseInt(getComputedStyle(textarea).fontSize) * 1.2
            : parseInt(computedLineHeight);
        const targetScroll = (lineNumber - 5) * lineHeight;

        textarea.scrollTop = Math.max(0, targetScroll);
    }

    /**
     * Replace current match
     */
    replaceOne() {
        if (this.currentMatchIndex < 0 || this.matches.length === 0) return;

        const match = this.matches[this.currentMatchIndex];
        const replacement = this.replaceInput.value;
        const textarea = this.editor.textarea;
        const content = textarea.value;

        // Replace the match
        const newContent = content.substring(0, match.start) +
            replacement +
            content.substring(match.end);

        textarea.value = newContent;

        // Adjust subsequent match positions
        const lengthDiff = replacement.length - match.text.length;
        this.matches.forEach((m, i) => {
            if (i > this.currentMatchIndex) {
                m.start += lengthDiff;
                m.end += lengthDiff;
            }
        });

        // Remove current match and re-search
        this.matches.splice(this.currentMatchIndex, 1);

        if (this.matches.length === 0) {
            this.currentMatchIndex = -1;
        } else if (this.currentMatchIndex >= this.matches.length) {
            this.currentMatchIndex = 0;
        }

        this.updateMatchCount();

        if (this.currentMatchIndex >= 0) {
            this.highlightCurrentMatch();
        }

        // Trigger editor update
        this.editor.handleInput();
    }

    /**
     * Replace all matches
     */
    replaceAll() {
        if (this.matches.length === 0) return;

        const replacement = this.replaceInput.value;
        const textarea = this.editor.textarea;
        let content = textarea.value;

        // Replace from end to start to preserve positions
        for (let i = this.matches.length - 1; i >= 0; i--) {
            const match = this.matches[i];
            content = content.substring(0, match.start) +
                replacement +
                content.substring(match.end);
        }

        textarea.value = content;

        const count = this.matches.length;
        this.matches = [];
        this.currentMatchIndex = -1;
        this.updateMatchCount();

        // Trigger editor update
        this.editor.handleInput();

        // Show notification
        this.showToast(`Replaced ${count} occurrence${count !== 1 ? 's' : ''}`, 'success');
    }

    /**
     * Clear search highlights
     */
    clearHighlights() {
        this.matches = [];
        this.currentMatchIndex = -1;
    }

    /**
     * Check if search panel is open
     */
    isVisible() {
        return this.isOpen;
    }
}

