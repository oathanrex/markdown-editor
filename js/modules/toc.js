/**
 * TOC Module
 * Table of Contents generation and navigation
 */

/**
 * Table of Contents Manager
 */
export class TOC {
    constructor(options = {}) {
        this.container = options.container || document.getElementById('toc-list');
        this.parser = options.parser;
        this.onNavigate = options.onNavigate;

        this.headings = [];
        this.activeHeadingId = null;
    }

    /**
     * Update TOC from markdown content
     */
    update(markdown) {
        if (!this.parser || !this.container) return;

        // Extract headings
        this.headings = this.parser.extractHeadings(markdown);

        // Render TOC
        this.render();
    }

    /**
     * Render TOC list
     */
    render() {
        if (!this.container) return;

        if (this.headings.length === 0) {
            this.container.innerHTML = '<li class="toc-empty">No headings found</li>';
            return;
        }

        let html = '';

        this.headings.forEach((heading, index) => {
            html += `
                    <li class="toc-item" data-level="${heading.level}" data-index="${index}">
                        <a href="#${heading.id}" class="toc-link" data-id="${heading.id}">
                            ${this.escapeHtml(heading.text)}
                        </a>
                    </li>
                `;
        });

        this.container.innerHTML = html;

        // Add click handlers
        this.container.querySelectorAll('.toc-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const id = link.dataset.id;
                this.navigateTo(id);
            });
        });
    }

    /**
     * Navigate to heading
     */
    navigateTo(id) {
        this.setActive(id);

        if (this.onNavigate) {
            this.onNavigate(id);
        }
    }

    /**
     * Set active heading
     */
    setActive(id) {
        this.activeHeadingId = id;

        this.container.querySelectorAll('.toc-link').forEach(link => {
            link.classList.toggle('active', link.dataset.id === id);
        });
    }

    /**
     * Update active heading based on scroll position
     */
    updateActiveFromScroll(scrollTop, headingElements) {
        if (!headingElements || headingElements.length === 0) return;

        // Find the heading closest to the top of the viewport
        let activeId = null;
        let minDistance = Infinity;

        headingElements.forEach((el, index) => {
            const distance = Math.abs(el.offsetTop - scrollTop - 100);
            if (distance < minDistance && el.offsetTop <= scrollTop + 150) {
                minDistance = distance;
                activeId = el.id;
            }
        });

        if (activeId && activeId !== this.activeHeadingId) {
            this.setActive(activeId);
        }
    }

    /**
     * Get headings
     */
    getHeadings() {
        return [...this.headings];
    }

    /**
     * Clear TOC
     */
    clear() {
        this.headings = [];
        this.activeHeadingId = null;
        if (this.container) {
            this.container.innerHTML = '';
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
}

