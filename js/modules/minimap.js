/**
 * Minimap Module
 * Document overview and quick navigation
 */

/**
 * Minimap Manager
 */
export class Minimap {
    constructor(options = {}) {
        this.container = options.container || document.getElementById('minimap');
        this.canvas = options.canvas || document.getElementById('minimap-canvas');
        this.viewport = options.viewport || document.getElementById('minimap-viewport');
        this.editor = options.editor;

        this.ctx = this.canvas?.getContext('2d');
        this.scale = 0.1;
        this.lineHeight = 2;
        this.isDragging = false;
        this.isVisible = true;

        // Bind methods for proper cleanup
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.resize = this.resize.bind(this);

        this.renderRequestId = null;
        this.lastContent = '';

        this.init();
    }

    /**
     * Initialize minimap
     */
    init() {
        if (!this.canvas || !this.viewport) return;

        // Mouse events for viewport dragging
        this.viewport.addEventListener('mousedown', this.handleMouseDown);
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);

        // Click on minimap to jump
        this.canvas.addEventListener('click', this.handleClick);

        // Resize observer
        if (typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(() => {
                this.resize();
            });
            this.resizeObserver.observe(this.container);
        }

        window.addEventListener('resize', this.resize);
    }

    /**
     * Clean up resources
     */
    destroy() {
        // Remove event listeners
        this.viewport?.removeEventListener('mousedown', this.handleMouseDown);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        this.canvas?.removeEventListener('click', this.handleClick);
        window.removeEventListener('resize', this.resize);

        // Stop observer
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }

        // Cancel any pending render
        if (this.renderRequestId) {
            cancelAnimationFrame(this.renderRequestId);
        }
    }

    /**
     * Handle mouse down on viewport
     */
    handleMouseDown(e) {
        e.preventDefault();
        this.isDragging = true;
        this.dragStartY = e.clientY;
        this.viewportStartTop = this.viewport.offsetTop;
        this.container.classList.add('dragging');
    }

    /**
     * Handle mouse move
     */
    handleMouseMove(e) {
        if (!this.isDragging) return;

        const deltaY = e.clientY - this.dragStartY;
        const newTop = this.viewportStartTop + deltaY;

        this.setViewportPosition(newTop);
        this.scrollEditorToViewport();
    }

    /**
     * Handle mouse up
     */
    handleMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.container.classList.remove('dragging');
        }
    }

    /**
     * Handle click on minimap
     */
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const y = e.clientY - rect.top;

        // Center viewport on click position
        const viewportHeight = this.viewport.offsetHeight;
        const newTop = y - viewportHeight / 2;

        this.setViewportPosition(newTop);
        this.scrollEditorToViewport();
    }

    /**
     * Set viewport position with bounds checking
     */
    setViewportPosition(top) {
        const maxTop = this.canvas.height - this.viewport.offsetHeight;
        const boundedTop = Math.max(0, Math.min(top, maxTop));
        this.viewport.style.top = `${boundedTop}px`;
    }

    /**
     * Scroll editor based on viewport position
     */
    scrollEditorToViewport() {
        if (!this.editor?.textarea) return;

        const textarea = this.editor.textarea;
        const viewportTop = this.viewport.offsetTop;
        const canvasHeight = this.canvas.height;
        const maxScroll = textarea.scrollHeight - textarea.clientHeight;
        const scrollableHeight = canvasHeight - this.viewport.offsetHeight;

        if (scrollableHeight <= 0) return;

        const percentage = viewportTop / scrollableHeight;
        textarea.scrollTop = percentage * maxScroll;
    }

    /**
     * Update minimap from content
     */
    update(content) {
        if (!this.canvas || !this.ctx || !this.isVisible) return;

        // Avoid unnecessary re-renders
        if (content === this.lastContent) return;
        this.lastContent = content;

        // Disable minimap for extremely large files (>100k chars) to prevent freezing
        if (content.length > 100000) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#888';
            this.ctx.fillText('File too large for minimap', 10, 20);
            return;
        }

        if (this.renderRequestId) {
            cancelAnimationFrame(this.renderRequestId);
        }

        this.renderRequestId = requestAnimationFrame(() => {
            this.resize();
            this.render(content);
            this.renderRequestId = null;
        });
    }

    /**
     * Resize canvas
     */
    resize() {
        if (!this.canvas || !this.container) return;

        const containerRect = this.container.getBoundingClientRect();
        // Only update if dimensions changed
        if (this.canvas.width !== containerRect.width || this.canvas.height !== containerRect.height) {
            this.canvas.width = containerRect.width;
            this.canvas.height = containerRect.height;
            // Force re-render if content exists
            if (this.lastContent) {
                this.render(this.lastContent);
            }
        }
    }

    /**
     * Render minimap content
     */
    render(content) {
        if (!this.ctx || !content) return;

        const { width, height } = this.canvas;

        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);

        // Get theme colors securely (fallback to defaults)
        const style = getComputedStyle(document.documentElement);
        const textColor = style.getPropertyValue('--text-muted').trim() || '#666';
        const headingColor = style.getPropertyValue('--accent-primary').trim() || '#7b68ee';
        const codeColor = style.getPropertyValue('--syntax-string').trim() || '#4ade80';

        // Optimization: Limit line processing for display
        // We map the entire file height to the canvas height

        const lines = content.split('\n');
        const totalLines = lines.length;

        // Calculate scale: How many pixels per line to fit?
        // If totalLines * lineHeight > height, we need to skip some or scale down
        // But standard minimap usually keeps fixed line height and just shows scrollable area.
        // Wait, this minimap implementation seems to fit EVERYTHING into the container height?
        // Looking at scrollEditorToViewport: percentage = viewportTop / (canvasHeight - viewportHeight)
        // It assumes the canvas represents the WHOLE document.

        // So we must scale the rendering if the document is longer than the canvas
        // Or we just draw from top to bottom and let it clip?
        // "y > height" check in original code suggests it clips.
        // For a proper VSCode-like minimap, the canvas should probably just show a view, OR we scale it down.
        // Let's stick to the original behavior but optimized: simple clipping for now.
        // But better: use a scaling factor if file is huge so we see structure?
        // Original code: y += this.lineHeight + 1;

        let y = 0;
        let inCodeBlock = false;
        const lineStep = this.lineHeight + 1;

        // If document is massive, we might skip lines to show overview
        const skipFactor = totalLines * lineStep > height ? Math.ceil((totalLines * lineStep) / height) : 1;

        for (let i = 0; i < totalLines; i += skipFactor) {
            if (y > height) break;

            const line = lines[i];

            // Determine line type and color
            let color = textColor;
            let lineWidth = Math.min(line.length * 0.8, width - 4); // Margin
            let lineThickness = this.lineHeight;

            // Check for code blocks
            if (line.startsWith('```')) {
                inCodeBlock = !inCodeBlock;
                color = codeColor;
            } else if (inCodeBlock) {
                color = codeColor;
            }

            // Check for headings
            const headingMatch = line.match(/^(#{1,6})\s/);
            if (headingMatch) {
                color = headingColor;
                lineThickness = this.lineHeight + (4 - headingMatch[1].length); // Thicker for H1
                lineWidth = Math.min(lineWidth * 1.2, width - 4);
            }

            // Draw line
            if (line.trim().length > 0) {
                this.ctx.fillStyle = color;
                this.ctx.globalAlpha = 0.6;
                this.ctx.fillRect(2, y, lineWidth, lineThickness);
            }

            y += lineStep;
        }

        // Update viewport size
        this.updateViewport();
    }

    /**
     * Update viewport size and position
     */
    updateViewport() {
        if (!this.editor?.textarea || !this.viewport) return;

        const textarea = this.editor.textarea;
        const canvasHeight = this.canvas.height;

        if (textarea.scrollHeight === 0) return;

        // Calculate viewport height as proportion of visible area
        const visibleRatio = textarea.clientHeight / textarea.scrollHeight;
        const viewportHeight = Math.max(20, canvasHeight * visibleRatio);

        this.viewport.style.height = `${viewportHeight}px`;

        // Handle edge case where content fits entirely (avoids division by zero)
        if (textarea.scrollHeight <= textarea.clientHeight) {
            this.viewport.style.top = '0px';
            this.viewport.style.height = `${canvasHeight}px`;
            return;
        }

        // Update position based on scroll
        const scrollRatio = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight);
        const maxViewportTop = canvasHeight - viewportHeight;

        const top = scrollRatio * maxViewportTop;

        if (!this.isDragging) {
            this.viewport.style.top = `${Math.max(0, Math.min(top, maxViewportTop))}px`;
        }
    }

    /**
     * Sync viewport with editor scroll
     */
    syncScroll() {
        if (!this.isDragging) {
            this.renderRequestId = requestAnimationFrame(() => {
                this.updateViewport();
            });
        }
    }

    /**
     * Show/hide minimap
     */
    setVisible(visible) {
        this.isVisible = visible;
        this.container?.classList.toggle('hidden', !visible);
        if (visible && this.lastContent) {
            this.update(this.lastContent);
        }
    }

    /**
     * Toggle visibility
     */
    toggle() {
        this.setVisible(!this.isVisible);
        return this.isVisible;
    }
}

