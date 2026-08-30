// @ts-nocheck
/**
 * Preview Module
 * Handles Markdown preview rendering with scroll sync
 * @module Preview
 */

/**
 * Preview Manager
 */

// GitHub-style octicons for the code block copy button
const ICON_COPY = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg>';
const ICON_CHECK = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L1.97 9.03a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg>';

export class Preview {
    constructor(options = {}) {
        this.container = options.container || document.getElementById('preview-content');
        this.parser = options.parser;
        this.renderDelay = options.renderDelay || 150;
        this.renderTimeout = null;
        this.lastContent = '';
        this.scrollSyncEnabled = true;
        this.mermaidInitialized = false;

        this.init();
    }

    /**
     * Initialize preview
     */
    init() {
        if (!this.container) return;

        // Initialize Mermaid if available
        this.initMermaid();

        // Set up copy button handlers
        this.container.addEventListener('click', this.handleClick.bind(this));
    }

    /**
     * Initialize Mermaid diagrams
     */
    initMermaid() {
        if (typeof mermaid !== 'undefined' && !this.mermaidInitialized) {
            mermaid.initialize({
                startOnLoad: false,
                theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default',
                securityLevel: 'strict',
                fontFamily: 'inherit'
            });
            this.mermaidInitialized = true;
        }
    }

    /**
     * Render Markdown content with debouncing
     * @param {string} content - Markdown content
     */
    render(content) {
        if (this.renderTimeout) {
            clearTimeout(this.renderTimeout);
        }

        this.renderTimeout = setTimeout(() => {
            this.doRender(content);
        }, this.renderDelay);
    }

    /**
     * Perform the actual rendering
     * @param {string} content - Markdown content
     */
    doRender(content) {
        if (!this.container || !this.parser) return;

        // Skip if content hasn't changed
        if (content === this.lastContent) return;
        this.lastContent = content;

        // Parse Markdown to HTML
        let html = this.parser.parse(content);

        // Set content
        this.container.innerHTML = html;

        // Post-process
        this.postProcess();
    }

    /**
     * Post-process rendered content
     */
    postProcess() {
        // Syntax highlighting for code blocks
        this.highlightCode();

        // Render math equations
        this.renderMath();

        // Render Mermaid diagrams
        this.renderMermaidDiagrams();

        // Add copy buttons to code blocks
        this.addCopyButtons();
    }

    /**
     * Highlight code blocks with highlight.js
     */
    highlightCode() {
        if (typeof hljs === 'undefined') return;

        this.container.querySelectorAll('pre code').forEach(block => {
            // Skip if already highlighted
            if (block.classList.contains('hljs')) return;

            hljs.highlightElement(block);
        });
    }

    /**
     * Render math equations with KaTeX
     */
    renderMath() {
        if (typeof katex === 'undefined') return;

        // Block math
        this.container.querySelectorAll('.math-block').forEach(el => {
            const tex = el.getAttribute('data-math');
            if (tex) {
                try {
                    katex.render(tex, el, {
                        displayMode: true,
                        throwOnError: false,
                        trust: false
                    });
                } catch (e) {
                    el.innerHTML = `<span class="math-error">Math error: ${e.message}</span>`;
                }
            }
        });

        // Inline math
        this.container.querySelectorAll('.math-inline').forEach(el => {
            const tex = el.getAttribute('data-math');
            if (tex) {
                try {
                    katex.render(tex, el, {
                        displayMode: false,
                        throwOnError: false,
                        trust: false
                    });
                } catch (e) {
                    el.innerHTML = `<span class="math-error">${e.message}</span>`;
                }
            }
        });
    }

    /**
     * Render Mermaid diagrams
     */
    async renderMermaidDiagrams() {
        if (typeof mermaid === 'undefined') return;

        const diagrams = this.container.querySelectorAll('.mermaid[data-mermaid]');

        for (const el of diagrams) {
            const code = el.getAttribute('data-mermaid');
            if (!code) continue;

            try {
                const id = el.id || `mermaid-${Date.now()}`;
                const { svg } = await mermaid.render(id + '-svg', code);
                el.innerHTML = svg;
                el.removeAttribute('data-mermaid');
            } catch (e) {
                el.innerHTML = `<div class="mermaid-error">Diagram error: ${e.message}</div>`;
            }
        }
    }

    /**
     * Add copy buttons to code blocks
     */
    addCopyButtons() {
        this.container.querySelectorAll('.code-block-wrapper').forEach(wrapper => {
            const btn = wrapper.querySelector('.copy-code-btn');
            if (!btn) return;

            // Remove existing listeners
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        });
    }

    /**
     * Handle click events in preview
     */
    handleClick(e) {
        // Handle copy button clicks (closest() so clicks on the SVG icon work)
        const copyBtn = e.target.closest('.copy-code-btn');
        if (copyBtn) {
            this.copyCode(copyBtn);
            return;
        }

        // Handle heading anchor clicks
        if (e.target.classList.contains('heading-anchor')) {
            e.preventDefault();
            const id = e.target.getAttribute('href').slice(1);
            const heading = document.getElementById(id);
            if (heading) {
                heading.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }

        // Handle checkbox clicks for task lists
        if (e.target.type === 'checkbox' && e.target.closest('.task-list-item')) {
            // Prevent toggling (read-only in preview)
            e.preventDefault();
        }
    }

    /**
     * Copy code block content
     */
    async copyCode(button) {
        const wrapper = button.closest('.code-block-wrapper');
        const code = wrapper?.querySelector('code');

        if (!code) return;

        const showCopied = () => {
            button.classList.add('copied');
            button.innerHTML = ICON_CHECK;
            button.setAttribute('aria-label', 'Copied!');
            setTimeout(() => {
                button.classList.remove('copied');
                button.innerHTML = ICON_COPY;
                button.setAttribute('aria-label', 'Copy code');
            }, 2000);
        };

        try {
            await navigator.clipboard.writeText(code.textContent);
            showCopied();
        } catch (err) {
            // Fallback for non-secure contexts (e.g. file://) or old browsers
            try {
                const range = document.createRange();
                range.selectNodeContents(code);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                document.execCommand('copy');
                selection.removeAllRanges();
                showCopied();
            } catch (fallbackErr) {
                console.error('Failed to copy:', fallbackErr);
                button.setAttribute('aria-label', 'Copy failed');
            }
        }
    }

    /**
     * Enable/disable scroll sync
     */
    setScrollSync(enabled) {
        this.scrollSyncEnabled = enabled;
    }

    /**
     * Sync scroll position from editor
     * @param {number} percentage - Scroll percentage (0-1)
     */
    syncScroll(percentage) {
        if (!this.scrollSyncEnabled || !this.container) return;

        const maxScroll = this.container.scrollHeight - this.container.clientHeight;
        if (maxScroll <= 0 || !Number.isFinite(percentage)) return;
        this.container.scrollTop = maxScroll * percentage;
    }

    /**
     * Get scroll percentage
     */
    getScrollPercentage() {
        if (!this.container) return 0;

        const maxScroll = this.container.scrollHeight - this.container.clientHeight;
        if (maxScroll <= 0) return 0;

        return this.container.scrollTop / maxScroll;
    }

    /**
     * Scroll to heading by ID
     */
    scrollToHeading(id) {
        const heading = this.container.querySelector(`#${id}`);
        if (heading) {
            heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Get rendered HTML
     */
    getHTML() {
        return this.container.innerHTML;
    }

    /**
     * Update theme for Mermaid
     */
    updateTheme(theme) {
        if (typeof mermaid !== 'undefined') {
            mermaid.initialize({
                theme: theme === 'dark' ? 'dark' : theme === 'high-contrast' ? 'dark' : 'default'
            });
        }

        // Update highlight.js theme
        const hljsLink = document.getElementById('hljs-theme');
        if (hljsLink) {
            if (theme === 'light') {
                hljsLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
            } else {
                hljsLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';
            }
            // Dynamic stylesheet swaps are sensitive to stale SW/CDN variants;
            // drop SRI on runtime theme toggle to avoid false-negative integrity failures.
            hljsLink.removeAttribute('integrity');
            hljsLink.setAttribute('crossorigin', 'anonymous');
            hljsLink.setAttribute('referrerpolicy', 'no-referrer');
        }

        // Re-render to apply theme changes
        if (this.lastContent) {
            this.doRender(this.lastContent);
        }
    }

    /**
     * Clear preview
     */
    clear() {
        this.container.innerHTML = '';
        this.lastContent = '';
    }
}

