/**
 * Shortcuts Module
 * Keyboard shortcut handling
 */

/**
 * Keyboard Shortcuts Manager
 */
export class Shortcuts {
    constructor(options = {}) {
        this.app = options.app;
        this.editor = options.editor;
        this.search = options.search;
        this.tabs = options.tabs;

        this.shortcuts = new Map();
        this.enabled = true;

        this.init();
    }

    /**
     * Initialize shortcuts
     */
    init() {
        // Register default shortcuts
        this.registerDefaults();

        // Global keyboard listener
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    /**
     * Register default shortcuts
     */
    registerDefaults() {
        // Formatting
        this.register('ctrl+b', () => this.editor?.applyFormat('bold'), 'Bold');
        this.register('ctrl+i', () => this.editor?.applyFormat('italic'), 'Italic');
        this.register('ctrl+`', () => this.editor?.applyFormat('code'), 'Inline code');
        this.register('ctrl+shift+s', () => this.editor?.applyFormat('strikethrough'), 'Strikethrough');

        // Headings
        this.register('ctrl+1', () => this.editor?.applyFormat('h1'), 'Heading 1');
        this.register('ctrl+2', () => this.editor?.applyFormat('h2'), 'Heading 2');
        this.register('ctrl+3', () => this.editor?.applyFormat('h3'), 'Heading 3');
        this.register('ctrl+4', () => this.editor?.applyFormat('h4'), 'Heading 4');
        this.register('ctrl+5', () => this.editor?.applyFormat('h5'), 'Heading 5');
        this.register('ctrl+6', () => this.editor?.applyFormat('h6'), 'Heading 6');

        // Lists
        this.register('ctrl+shift+u', () => this.editor?.applyFormat('ul'), 'Bullet list');
        this.register('ctrl+shift+o', () => this.editor?.applyFormat('ol'), 'Numbered list');
        this.register('ctrl+shift+t', () => this.editor?.applyFormat('tasklist'), 'Task list');

        // Other formatting
        this.register('ctrl+shift+q', () => this.editor?.applyFormat('quote'), 'Blockquote');
        this.register('ctrl+shift+c', () => this.editor?.applyFormat('codeblock'), 'Code block');
        this.register('ctrl+k', () => this.openLinkModal(), 'Insert link');
        this.register('ctrl+shift+i', () => this.openImageModal(), 'Insert image');
        this.register('ctrl+shift+h', () => this.editor?.applyFormat('hr'), 'Horizontal rule');

        // File operations
        this.register('ctrl+n', () => this.tabs?.createTab(), 'New document');
        this.register('ctrl+s', () => this.app?.saveCurrentDocument(), 'Save');
        this.register('ctrl+o', () => this.openImportModal(), 'Open file');

        // Search
        this.register('ctrl+f', () => this.search?.open(), 'Find');
        this.register('ctrl+h', () => this.search?.open(), 'Find and replace');
        this.register('escape', () => this.handleEscape(), 'Close panel');

        // Navigation
        this.register('ctrl+tab', () => this.tabs?.nextTab(), 'Next tab');
        this.register('ctrl+shift+tab', () => this.tabs?.previousTab(), 'Previous tab');
        this.register('ctrl+w', () => this.closeCurrentTab(), 'Close tab');

        // View
        this.register('f11', () => this.app?.toggleZenMode(), 'Zen mode');
        this.register('ctrl+\\', () => this.app?.toggleSidebar(), 'Toggle sidebar');

        // Help
        this.register('shift+?', () => this.openShortcutsModal(), 'Show shortcuts');
        this.register('f1', () => this.openShortcutsModal(), 'Show shortcuts');
    }

    /**
     * Register a keyboard shortcut
     */
    register(keys, callback, description = '') {
        const normalizedKeys = this.normalizeKeys(keys);
        this.shortcuts.set(normalizedKeys, { callback, description });
    }

    /**
     * Unregister a keyboard shortcut
     */
    unregister(keys) {
        const normalizedKeys = this.normalizeKeys(keys);
        this.shortcuts.delete(normalizedKeys);
    }

    /**
     * Normalize key combination string
     */
    normalizeKeys(keys) {
        return keys.toLowerCase()
            .replace(/\s+/g, '')
            .split('+')
            .sort((a, b) => {
                // Order: ctrl, alt, shift, meta, then the key
                const order = ['ctrl', 'alt', 'shift', 'meta'];
                const aIndex = order.indexOf(a);
                const bIndex = order.indexOf(b);
                if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                if (aIndex !== -1) return -1;
                if (bIndex !== -1) return 1;
                return a.localeCompare(b);
            })
            .join('+');
    }

    /**
     * Handle keydown event
     */
    handleKeydown(e) {
        if (!this.enabled) return;

        // Build key combination
        const keys = [];
        if (e.ctrlKey || e.metaKey) keys.push('ctrl');
        if (e.altKey) keys.push('alt');
        if (e.shiftKey) keys.push('shift');

        // Get the key
        let key = e.key.toLowerCase();
        if (key === ' ') key = 'space';
        if (key === 'escape') key = 'escape';

        // Don't add modifier keys as the main key
        if (!['control', 'alt', 'shift', 'meta'].includes(key)) {
            keys.push(key);
        }

        const keyCombo = keys.join('+');
        const shortcut = this.shortcuts.get(keyCombo);

        if (shortcut) {
            // Check if focus is in an input that should handle the key
            const activeEl = document.activeElement;
            const isInput = activeEl?.tagName === 'INPUT' ||
                activeEl?.tagName === 'SELECT' ||
                (activeEl?.tagName === 'TEXTAREA' && activeEl.id !== 'editor-textarea');

            // Allow certain shortcuts even in inputs
            const allowInInputs = ['escape', 'ctrl+s', 'ctrl+n', 'ctrl+w', 'f1', 'f11'];

            if (isInput && !allowInInputs.includes(keyCombo)) {
                return;
            }

            e.preventDefault();
            shortcut.callback();
        }
    }

    /**
     * Handle Escape key
     */
    handleEscape() {
        // Close modals first
        const openModal = document.querySelector('.modal:not([hidden])');
        if (openModal) {
            openModal.hidden = true;
            return;
        }

        // Close search panel
        if (this.search?.isVisible()) {
            this.search.close();
            return;
        }

        // Exit zen mode
        if (document.body.classList.contains('zen-mode')) {
            this.app?.toggleZenMode();
        }
    }

    /**
     * Open link modal
     */
    openLinkModal() {
        const modal = document.getElementById('link-modal');
        if (modal) {
            modal.hidden = false;
            const textInput = document.getElementById('link-text');
            if (textInput) {
                textInput.value = this.editor?.getSelection() || '';
                textInput.focus();
            }
        }
    }

    /**
     * Open image modal
     */
    openImageModal() {
        const modal = document.getElementById('image-modal');
        if (modal) {
            modal.hidden = false;
            document.getElementById('image-alt')?.focus();
        }
    }

    /**
     * Open import modal
     */
    openImportModal() {
        const modal = document.getElementById('import-modal');
        if (modal) modal.hidden = false;
    }

    /**
     * Open shortcuts modal
     */
    openShortcutsModal() {
        const modal = document.getElementById('shortcuts-modal');
        if (modal) modal.hidden = false;
    }

    /**
     * Close current tab
     */
    closeCurrentTab() {
        const activeTab = this.tabs?.getActiveTab();
        if (activeTab) {
            this.tabs.closeTab(activeTab.id);
        }
    }

    /**
     * Enable shortcuts
     */
    enable() {
        this.enabled = true;
    }

    /**
     * Disable shortcuts
     */
    disable() {
        this.enabled = false;
    }

    /**
     * Get all registered shortcuts
     */
    getAll() {
        const shortcuts = [];
        this.shortcuts.forEach((value, key) => {
            shortcuts.push({
                keys: key,
                description: value.description
            });
        });
        return shortcuts;
    }
}

