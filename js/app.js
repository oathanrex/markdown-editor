/**
 * Main Application
 * Initializes and coordinates all modules
 */

import { Storage } from './modules/storage.js';
import { Parser } from './modules/parser.js';
import { Encryption } from './modules/encryption.js';
import { History } from './modules/history.js';
import { Editor } from './modules/editor.js';
import { Preview } from './modules/preview.js';
import { Tabs } from './modules/tabs.js';
import { Search } from './modules/search.js';
import { TOC } from './modules/toc.js';
import { Minimap } from './modules/minimap.js';
import { Export } from './modules/export.js';
import { Themes } from './modules/themes.js';
import { Shortcuts } from './modules/shortcuts.js';
import { Accessibility } from './modules/accessibility.js';
import { Performance } from './modules/performance.js';

/**
 * Main Application
 * Initializes and coordinates all modules
 */

/**
 * Main Application Class
 */
export class App {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
        this.autoSaveInterval = null;
        this.settings = {
            autoSaveInterval: 10000,
            snapshotInterval: 300000,
            fontSize: 14,
            tabSize: 4,
            showLineNumbers: true,
            showMinimap: true,
            wordWrap: true,
            encryptionEnabled: false
        };
    }

    /**
     * Initialize the application
     */
    async init() {
        console.log('Initializing Markdown Editor...');

        try {
            // Initialize modules in order
            await this.initStorage();
            this.initParser();
            this.initEncryption();
            this.initHistory();
            this.initEditor();
            this.initPreview();
            this.initTabs();
            this.initSearch();
            this.initTOC();
            this.initMinimap();
            this.initExport();
            this.initThemes();
            this.initShortcuts();
            this.initAccessibility();
            this.initPerformance();

            // Load settings
            await this.loadSettings();

            // Load documents
            await this.loadDocuments();

            // Setup event listeners
            this.setupEventListeners();

            // Setup auto-save
            this.setupAutoSave();

            // Register service worker
            this.registerServiceWorker();

            this.isInitialized = true;
            console.log('Markdown Editor initialized successfully');

        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showToast('Failed to initialize application', 'error');
        }
    }

    /**
     * Initialize Storage
     */
    async initStorage() {
        this.modules.storage = new Storage();
        await this.modules.storage.ready();
    }

    /**
     * Initialize Parser
     */
    initParser() {
        this.modules.parser = new Parser();
    }

    /**
     * Initialize Encryption
     */
    initEncryption() {
        this.modules.encryption = new Encryption();
    }

    /**
     * Initialize History
     */
    initHistory() {
        this.modules.history = new History(
            this.modules.storage,
            this.modules.encryption
        );
    }

    /**
     * Initialize Editor
     */
    initEditor() {
        this.modules.editor = new Editor({
            textarea: document.getElementById('editor-textarea'),
            lineNumbers: document.getElementById('line-numbers'),
            onChange: this.handleEditorChange.bind(this),
            onCursorChange: this.handleCursorChange.bind(this)
        });
    }

    /**
     * Initialize Preview
     */
    initPreview() {
        this.modules.preview = new Preview({
            container: document.getElementById('preview-content'),
            parser: this.modules.parser
        });
    }

    /**
     * Initialize Tabs
     */
    initTabs() {
        this.modules.tabs = new Tabs({
            container: document.getElementById('tabs-container'),
            storage: this.modules.storage,
            onTabChange: this.handleTabChange.bind(this),
            onTabClose: this.handleTabClose.bind(this)
        });
    }

    /**
     * Initialize Search
     */
    initSearch() {
        this.modules.search = new Search({
            editor: this.modules.editor,
            showToast: (msg, type) => this.showToast(msg, type)
        });
    }

    /**
     * Initialize TOC
     */
    initTOC() {
        this.modules.toc = new TOC({
            container: document.getElementById('toc-list'),
            parser: this.modules.parser,
            onNavigate: this.handleTOCNavigate.bind(this)
        });
    }

    /**
     * Initialize Minimap
     */
    initMinimap() {
        this.modules.minimap = new Minimap({
            container: document.getElementById('minimap'),
            canvas: document.getElementById('minimap-canvas'),
            viewport: document.getElementById('minimap-viewport'),
            editor: this.modules.editor
        });
    }

    /**
     * Initialize Export
     */
    initExport() {
        this.modules.export = new Export({
            parser: this.modules.parser,
            getContent: () => this.modules.editor.getContent(),
            getHTML: () => this.modules.preview.getHTML(),
            setContent: (content, title) => this.importContent(content, title),
            getDocumentTitle: () => this.modules.tabs.getActiveTab()?.title || 'document',
            showToast: (msg, type) => this.showToast(msg, type)
        });
    }

    /**
     * Initialize Themes
     */
    initThemes() {
        this.modules.themes = new Themes({
            storage: this.modules.storage,
            onThemeChange: (theme) => {
                this.modules.preview.updateTheme(theme);
            }
        });
    }

    /**
     * Initialize Shortcuts
     */
    initShortcuts() {
        this.modules.shortcuts = new Shortcuts({
            app: this,
            editor: this.modules.editor,
            search: this.modules.search,
            tabs: this.modules.tabs
        });
    }

    /**
     * Initialize Accessibility
     */
    initAccessibility() {
        this.modules.accessibility = new Accessibility();
    }

    /**
     * Initialize Performance utilities
     */
    initPerformance() {
        this.modules.performance = new Performance();
    }

    /**
     * Load settings from storage
     */
    async loadSettings() {
        const savedSettings = await this.modules.storage.getAllSettings();
        this.settings = { ...this.settings, ...savedSettings };

        // Apply settings
        this.applySettings();
    }

    /**
     * Apply current settings
     */
    applySettings() {
        // Font size
        const editor = document.getElementById('editor-textarea');
        if (editor) {
            editor.style.fontSize = `${this.settings.fontSize}px`;
        }

        // Tab size
        this.modules.editor.setTabSize(this.settings.tabSize);

        // Line numbers
        const lineNumbers = document.getElementById('line-numbers');
        if (lineNumbers) {
            lineNumbers.classList.toggle('hidden', !this.settings.showLineNumbers);
        }

        // Minimap
        this.modules.minimap?.setVisible(this.settings.showMinimap);

        // Word wrap
        if (!this.settings.wordWrap) {
            this.modules.editor.toggleWordWrap();
        }

        // Update settings UI
        this.updateSettingsUI();
    }

    /**
     * Update settings UI elements
     */
    updateSettingsUI() {
        const fontSizeInput = document.getElementById('font-size');
        const fontSizeValue = document.getElementById('font-size-value');
        if (fontSizeInput && fontSizeValue) {
            fontSizeInput.value = this.settings.fontSize;
            fontSizeValue.textContent = `${this.settings.fontSize} px`;
        }

        const tabSizeSelect = document.getElementById('tab-size');
        if (tabSizeSelect) {
            tabSizeSelect.value = this.settings.tabSize;
        }

        const showLineNumbers = document.getElementById('show-line-numbers');
        if (showLineNumbers) {
            showLineNumbers.checked = this.settings.showLineNumbers;
        }

        const showMinimap = document.getElementById('show-minimap');
        if (showMinimap) {
            showMinimap.checked = this.settings.showMinimap;
        }

        const autoSaveInterval = document.getElementById('auto-save-interval');
        if (autoSaveInterval) {
            autoSaveInterval.value = this.settings.autoSaveInterval;
        }

        const snapshotInterval = document.getElementById('snapshot-interval');
        if (snapshotInterval) {
            snapshotInterval.value = this.settings.snapshotInterval;
        }

        const enableEncryption = document.getElementById('enable-encryption');
        if (enableEncryption) {
            enableEncryption.checked = this.settings.encryptionEnabled;
        }
    }

    /**
     * Load documents from storage
     */
    async loadDocuments() {
        await this.modules.tabs.loadFromStorage();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Global error handler (restored)
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled rejection:', event.reason);
            this.showToast('An error occurred', 'error');
        });

        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.showToast('An error occurred', 'error');
        });

        // View mode buttons
        document.getElementById('view-editor')?.addEventListener('click', () => this.setViewMode('editor'));
        document.getElementById('view-split')?.addEventListener('click', () => this.setViewMode('split'));
        document.getElementById('view-preview')?.addEventListener('click', () => this.setViewMode('preview'));

        // Zen mode
        document.getElementById('zen-mode-btn')?.addEventListener('click', () => this.toggleZenMode());

        // Menu toggle (mobile)
        document.getElementById('menu-toggle')?.addEventListener('click', () => this.toggleSidebar());

        // Sidebar close
        document.getElementById('sidebar-close')?.addEventListener('click', () => this.toggleSidebar());

        // Modal Close Buttons (Critical Fix)
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = btn.closest('.modal');
                if (modal) modal.hidden = true;
            });
        });

        // Close modal on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
                    modal.hidden = true;
                }
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal:not([hidden])').forEach(modal => {
                    modal.hidden = true;
                });
            }
        });

        // Format buttons
        document.querySelectorAll('.format-btn[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                if (action === 'link') {
                    this.openModal('link-modal');
                } else if (action === 'image') {
                    this.openModal('image-modal');
                } else if (action === 'table') {
                    this.openModal('table-modal');
                } else if (action === 'emoji') {
                    this.openEmojiPicker();
                } else {
                    this.modules.editor.applyFormat(action);
                }
            });
        });

        // Word wrap toggle
        document.getElementById('word-wrap-btn')?.addEventListener('click', (e) => {
            const wrapped = this.modules.editor.toggleWordWrap();
            e.currentTarget.classList.toggle('active', wrapped);
            this.settings.wordWrap = wrapped;
            this.modules.storage.saveSetting('wordWrap', wrapped);
        });

        // Find/Replace button
        document.getElementById('find-replace-btn')?.addEventListener('click', () => {
            this.modules.search.toggle();
        });

        // Import button
        document.getElementById('import-btn')?.addEventListener('click', () => {
            this.openModal('import-modal');
        });

        // Export button
        document.getElementById('export-btn')?.addEventListener('click', () => {
            this.openModal('export-modal');
        });

        // History button
        document.getElementById('history-btn')?.addEventListener('click', () => {
            this.openHistoryModal();
        });

        // Settings button
        document.getElementById('settings-btn')?.addEventListener('click', () => {
            this.openModal('settings-modal');
        });

        // Settings changes
        this.setupSettingsListeners();

        // Modal buttons
        this.setupModalButtons();

        // Scroll sync
        this.setupScrollSync();

        // Resize handle
        this.setupResizeHandle();

        // Window events
        window.addEventListener('beforeunload', (e) => {
            const activeTab = this.modules.tabs.getActiveTab();
            if (activeTab?.unsaved) {
                e.preventDefault();
                e.returnValue = '';
            }
        });

        // Global drag and drop
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        document.addEventListener('drop', (e) => {
            e.preventDefault();
            if (e.dataTransfer.files.length > 0) {
                this.modules.export.handleFiles(e.dataTransfer.files);
            }
        });
    }

    /**
     * Setup settings event listeners
     */
    setupSettingsListeners() {
        // Font size
        const fontSizeInput = document.getElementById('font-size');
        if (fontSizeInput) {
            fontSizeInput.addEventListener('input', (e) => {
                const size = parseInt(e.target.value);
                this.settings.fontSize = size;
                document.getElementById('font-size-value').textContent = `${size}px`;
                document.getElementById('editor-textarea').style.fontSize = `${size}px`;
                this.modules.storage.saveSetting('fontSize', size);
            });
        }

        // Font family
        const fontFamilySelect = document.getElementById('font-family');
        if (fontFamilySelect) {
            fontFamilySelect.addEventListener('change', (e) => {
                document.getElementById('editor-textarea').style.fontFamily = e.target.value;
                this.modules.storage.saveSetting('fontFamily', e.target.value);
            });
        }

        // Tab size
        const tabSizeSelect = document.getElementById('tab-size');
        if (tabSizeSelect) {
            tabSizeSelect.addEventListener('change', (e) => {
                const size = parseInt(e.target.value);
                this.settings.tabSize = size;
                this.modules.editor.setTabSize(size);
                this.modules.storage.saveSetting('tabSize', size);
            });
        }

        // Show line numbers
        const showLineNumbers = document.getElementById('show-line-numbers');
        if (showLineNumbers) {
            showLineNumbers.addEventListener('change', (e) => {
                this.settings.showLineNumbers = e.target.checked;
                document.getElementById('line-numbers').classList.toggle('hidden', !e.target.checked);
                this.modules.storage.saveSetting('showLineNumbers', e.target.checked);
            });
        }

        // Show minimap
        const showMinimap = document.getElementById('show-minimap');
        if (showMinimap) {
            showMinimap.addEventListener('change', (e) => {
                this.settings.showMinimap = e.target.checked;
                this.modules.minimap.setVisible(e.target.checked);
                this.modules.storage.saveSetting('showMinimap', e.target.checked);
            });
        }

        // Auto-save interval
        const autoSaveInterval = document.getElementById('auto-save-interval');
        if (autoSaveInterval) {
            autoSaveInterval.addEventListener('change', (e) => {
                this.settings.autoSaveInterval = parseInt(e.target.value);
                this.setupAutoSave();
                this.modules.storage.saveSetting('autoSaveInterval', this.settings.autoSaveInterval);
            });
        }

        // Snapshot interval
        const snapshotInterval = document.getElementById('snapshot-interval');
        if (snapshotInterval) {
            snapshotInterval.addEventListener('change', (e) => {
                this.settings.snapshotInterval = parseInt(e.target.value);
                this.modules.history.setSnapshotInterval(this.settings.snapshotInterval);
                this.modules.storage.saveSetting('snapshotInterval', this.settings.snapshotInterval);
            });
        }

        // Encryption toggle
        const enableEncryption = document.getElementById('enable-encryption');
        const encryptionSettings = document.getElementById('encryption-settings');
        if (enableEncryption && encryptionSettings) {
            enableEncryption.addEventListener('change', (e) => {
                encryptionSettings.hidden = !e.target.checked;
                this.settings.encryptionEnabled = e.target.checked;
                this.modules.storage.saveSetting('encryptionEnabled', e.target.checked);
            });
        }

        // Set passphrase button
        const setPassphraseBtn = document.getElementById('set-passphrase-btn');
        if (setPassphraseBtn) {
            setPassphraseBtn.addEventListener('click', async () => {
                const passphrase = document.getElementById('encryption-passphrase').value;
                const confirm = document.getElementById('encryption-passphrase-confirm').value;

                if (passphrase !== confirm) {
                    this.showToast('Passphrases do not match', 'error');
                    return;
                }

                try {
                    await this.modules.encryption.setPassphrase(passphrase);
                    this.showToast('Encryption passphrase set', 'success');
                } catch (error) {
                    this.showToast(error.message, 'error');
                }
            });
        }

        // Export all button
        document.getElementById('export-all-btn')?.addEventListener('click', async () => {
            const data = await this.modules.storage.exportAllData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `markdown - editor - backup - ${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            this.showToast('Backup exported', 'success');
        });

        // Clear data button
        document.getElementById('clear-data-btn')?.addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete all data? This cannot be undone.')) {
                await this.modules.storage.clearAllData();
                location.reload();
            }
        });
    }

    /**
     * Setup modal button listeners
     */
    setupModalButtons() {
        // Link modal
        document.getElementById('insert-link-btn')?.addEventListener('click', () => {
            const text = document.getElementById('link-text').value || 'link';
            const url = document.getElementById('link-url').value || 'https://';
            this.modules.editor.insertText(`[${text}](${url})`);
            this.closeModal('link-modal');
        });

        // Image modal
        document.getElementById('insert-image-btn')?.addEventListener('click', () => {
            const alt = document.getElementById('image-alt').value || 'image';
            const url = document.getElementById('image-url').value || '';
            this.modules.editor.insertText(`![${alt}](${url})`);
            this.closeModal('image-modal');
        });

        // Table modal
        document.getElementById('insert-table-btn')?.addEventListener('click', () => {
            const rows = parseInt(document.getElementById('table-rows').value) || 3;
            const cols = parseInt(document.getElementById('table-cols').value) || 3;
            const table = this.generateTable(rows, cols);
            this.modules.editor.insertText(table);
            this.closeModal('table-modal');
        });

        // History modal buttons
        document.getElementById('restore-version-btn')?.addEventListener('click', () => {
            this.restoreSelectedVersion();
        });

        document.getElementById('compare-versions-btn')?.addEventListener('click', () => {
            this.compareSelectedVersions();
        });
    }

    /**
     * Setup scroll sync between editor and preview
     */
    setupScrollSync() {
        const editor = document.getElementById('editor-textarea');
        const preview = document.getElementById('preview-content');

        if (!editor || !preview) return;

        let isEditorScrolling = false;
        let isPreviewScrolling = false;

        const syncEditorToPreview = this.modules.performance.throttle(() => {
            if (isPreviewScrolling) return;
            isEditorScrolling = true;

            const percentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
            this.modules.preview.syncScroll(percentage);
            this.modules.minimap?.syncScroll();

            setTimeout(() => isEditorScrolling = false, 100);
        }, 16);

        const syncPreviewToEditor = this.modules.performance.throttle(() => {
            if (isEditorScrolling) return;
            isPreviewScrolling = true;

            const percentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
            editor.scrollTop = percentage * (editor.scrollHeight - editor.clientHeight);

            setTimeout(() => isPreviewScrolling = false, 100);
        }, 16);

        editor.addEventListener('scroll', syncEditorToPreview);
        preview.addEventListener('scroll', syncPreviewToEditor);
    }

    /**
     * Setup resize handle for split view
     */
    setupResizeHandle() {
        const handle = document.getElementById('resize-handle');
        const editorPane = document.getElementById('editor-pane');
        const previewPane = document.getElementById('preview-pane');

        if (!handle || !editorPane || !previewPane) return;

        let isResizing = false;
        let startX = 0;
        let startEditorWidth = 0;

        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startEditorWidth = editorPane.offsetWidth;
            handle.classList.add('active');
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const delta = e.clientX - startX;
            const newWidth = startEditorWidth + delta;
            const containerWidth = editorPane.parentElement.offsetWidth;
            const minWidth = 300;
            const maxWidth = containerWidth - 300;

            if (newWidth >= minWidth && newWidth <= maxWidth) {
                const percentage = (newWidth / containerWidth) * 100;
                editorPane.style.flex = `0 0 ${percentage}% `;
                previewPane.style.flex = `1`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                handle.classList.remove('active');
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        });
    }

    /**
     * Setup auto-save
     */
    setupAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }

        this.autoSaveInterval = setInterval(() => {
            this.saveCurrentDocument();
        }, this.settings.autoSaveInterval);
    }

    /**
     * Handle editor content change
     */
    handleEditorChange(content) {
        // Update preview
        this.modules.preview.render(content);

        // Update TOC
        this.modules.toc.update(content);

        // Update minimap
        this.modules.minimap?.update(content);

        // Update tab content and mark as unsaved
        const activeTab = this.modules.tabs.getActiveTab();
        if (activeTab) {
            this.modules.tabs.updateTabContent(activeTab.id, content);
            this.modules.tabs.setUnsaved(activeTab.id, true);
        }

        // Update word/char count
        this.updateCounts(content);

        // Update save status
        this.updateSaveStatus('unsaved');
    }

    /**
     * Handle cursor position change
     */
    handleCursorChange(position) {
        const cursorEl = document.getElementById('cursor-position');
        if (cursorEl) {
            cursorEl.textContent = `Ln ${position.line}, Col ${position.column} `;
        }
    }

    /**
     * Handle tab change
     */
    async handleTabChange(tab) {
        // Check if content needs to be loaded (lazy loading)
        if (tab.content === null) {
            try {
                this.showToast('Loading document...', 'info');
                const doc = await this.modules.storage.getDocument(tab.id);
                if (doc) {
                    tab.content = doc.content || '';
                    this.modules.tabs.updateTabContent(tab.id, tab.content);
                    this.modules.editor.setReadOnly(false); // Ensure editable
                } else {
                    this.showToast('Critical: Failed to load document content!', 'error');
                    // Do NOT set tab.content to empty string to avoid accidental overwrite
                    this.modules.editor.setContent('⚠️ Error: Could not load document content from storage.\n\nPlease reload the page or check the console errors.\n\nDo not try to save this file as it may overwrite your data.');
                    this.modules.editor.setReadOnly(true);
                    return; // Stop processing
                }
            } catch (error) {
                console.error('Error loading document:', error);
                this.showToast('Error loading document: ' + error.message, 'error');
                this.modules.editor.setContent('⚠️ Error: Could not load document content.\n\n' + error.message);
                this.modules.editor.setReadOnly(true);
                return; // Stop processing
            }
        } else {
            this.modules.editor.setReadOnly(false); // Ensure editable if content is already loaded
        }

        // Set editor content
        this.modules.editor.setContent(tab.content || '');

        // Start auto-snapshots for this document
        this.modules.history.startAutoSnapshot(tab.id, () => this.modules.editor.getContent());

        // Update UI
        this.updateSaveStatus(tab.unsaved ? 'unsaved' : 'saved');
    }

    /**
     * Handle tab close
     */
    handleTabClose(tab) {
        // Stop auto-snapshots
        this.modules.history.stopAutoSnapshot(tab.id);
    }

    /**
     * Handle TOC navigation
     */
    handleTOCNavigate(id) {
        // Scroll preview to heading
        this.modules.preview.scrollToHeading(id);

        // Find heading in editor and scroll there too
        const content = this.modules.editor.getContent();
        const lines = content.split('\n');
        let lineNumber = 0;

        for (let i = 0; i < lines.length; i++) {
            const match = lines[i].match(/^#{1,6}\s+(.+)$/);
            if (match) {
                const headingId = this.modules.parser.slugify(match[1]);
                if (headingId === id) {
                    lineNumber = i + 1;
                    break;
                }
            }
        }

        if (lineNumber > 0) {
            this.modules.editor.scrollToLine(lineNumber);
        }
    }

    /**
     * Update word and character counts
     */
    updateCounts(content) {
        const wordCount = this.modules.parser.getWordCount(content);
        const charCount = this.modules.parser.getCharCount(content);

        document.getElementById('word-count').textContent = `${wordCount} word${wordCount !== 1 ? 's' : ''} `;
        document.getElementById('char-count').textContent = `${charCount} character${charCount !== 1 ? 's' : ''} `;
    }

    /**
     * Update save status indicator
     */
    updateSaveStatus(status) {
        const statusEl = document.getElementById('save-status');
        if (!statusEl) return;

        statusEl.className = '';

        switch (status) {
            case 'saving':
                statusEl.textContent = 'Saving...';
                statusEl.classList.add('saving');
                break;
            case 'saved':
                statusEl.textContent = 'Saved';
                statusEl.classList.add('saved');
                break;
            case 'error':
                statusEl.textContent = 'Save failed';
                statusEl.classList.add('error');
                break;
            default:
                statusEl.textContent = 'Unsaved';
        }
    }

    /**
     * Save current document
     */
    async saveCurrentDocument() {
        const activeTab = this.modules.tabs.getActiveTab();
        if (!activeTab) return;

        this.updateSaveStatus('saving');

        try {
            const content = this.modules.editor.getContent();

            // Encrypt if enabled
            let saveContent = content;
            let isEncrypted = false;

            if (this.settings.encryptionEnabled && this.modules.encryption.isUnlocked) {
                saveContent = await this.modules.encryption.encrypt(content);
                isEncrypted = true;
            }

            await this.modules.storage.saveDocument({
                id: activeTab.id,
                title: activeTab.title,
                content: saveContent,
                encrypted: isEncrypted,
                createdAt: activeTab.createdAt
            });

            this.modules.tabs.setUnsaved(activeTab.id, false);
            this.updateSaveStatus('saved');

        } catch (error) {
            console.error('Save failed:', error);
            this.updateSaveStatus('error');
            this.showToast('Failed to save document', 'error');
        }
    }

    /**
     * Import content into new document
     */
    async importContent(content, title) {
        await this.modules.tabs.createTab({
            title: title || 'Imported',
            content: content
        });
    }

    /**
     * Set view mode
     */
    setViewMode(mode) {
        const editorPane = document.getElementById('editor-pane');
        const previewPane = document.getElementById('preview-pane');
        const resizeHandle = document.getElementById('resize-handle');

        // Update button states
        document.querySelectorAll('.btn-group .toolbar-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });

        const activeBtn = document.getElementById(`view-${mode}`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.setAttribute('aria-pressed', 'true');
        }

        // Apply view mode
        switch (mode) {
            case 'editor':
                editorPane.style.display = 'flex';
                previewPane.style.display = 'none';
                resizeHandle.style.display = 'none';
                break;
            case 'preview':
                editorPane.style.display = 'none';
                previewPane.style.display = 'flex';
                resizeHandle.style.display = 'none';
                break;
            case 'split':
            default:
                editorPane.style.display = 'flex';
                previewPane.style.display = 'flex';
                resizeHandle.style.display = 'block';
                editorPane.style.flex = '1';
                previewPane.style.flex = '1';
                break;
        }

        document.body.setAttribute('data-view', mode);
    }

    /**
     * Toggle zen mode
     */
    toggleZenMode() {
        document.body.classList.toggle('zen-mode');
        const btn = document.getElementById('zen-mode-btn');
        const isZen = document.body.classList.contains('zen-mode');
        btn?.setAttribute('aria-pressed', isZen);

        if (isZen) {
            // Enter fullscreen if supported
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(() => { });
            }
        } else {
            if (document.exitFullscreen && document.fullscreenElement) {
                document.exitFullscreen().catch(() => { });
            }
        }
    }

    /**
     * Toggle sidebar
     */
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar?.classList.toggle('collapsed');
        sidebar?.classList.toggle('open');

        const btn = document.getElementById('menu-toggle');
        const isOpen = sidebar?.classList.contains('open') || !sidebar?.classList.contains('collapsed');
        btn?.setAttribute('aria-expanded', isOpen);
    }

    /**
     * Open modal
     */
    openModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.hidden = false;
        }
    }

    /**
     * Close modal
     */
    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.hidden = true;
        }
    }

    /**
     * Open emoji picker
     */
    openEmojiPicker() {
        const modal = document.getElementById('emoji-modal');
        const grid = document.getElementById('emoji-grid');

        if (!modal || !grid) return;

        // Populate emoji grid
        const emojis = Object.entries(this.modules.parser.emojiMap);
        grid.innerHTML = emojis.map(([name, emoji]) =>
            `<button class="emoji-item" data-emoji=":${name}:" title="${name}">${emoji}</button>`
        ).join('');

        // Add click handlers
        grid.querySelectorAll('.emoji-item').forEach(btn => {
            btn.addEventListener('click', () => {
                this.modules.editor.insertText(btn.dataset.emoji);
                modal.hidden = true;
            });
        });

        // Filter emojis on search
        const search = document.getElementById('emoji-search');
        if (search) {
            search.value = '';
            search.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                grid.querySelectorAll('.emoji-item').forEach(btn => {
                    const name = btn.title.toLowerCase();
                    btn.style.display = name.includes(query) ? '' : 'none';
                });
            });
        }

        modal.hidden = false;
        search?.focus();
    }

    /**
     * Open history modal
     */
    async openHistoryModal() {
        const modal = document.getElementById('history-modal');
        const list = document.getElementById('history-list');
        const preview = document.getElementById('history-preview');
        const restoreBtn = document.getElementById('restore-version-btn');
        const compareBtn = document.getElementById('compare-versions-btn');

        if (!modal || !list) return;

        const activeTab = this.modules.tabs.getActiveTab();
        if (!activeTab) return;

        // Load snapshots
        const snapshots = await this.modules.history.getSnapshots(activeTab.id);

        if (snapshots.length === 0) {
            list.innerHTML = '<li class="placeholder-text">No snapshots yet</li>';
        } else {
            list.innerHTML = snapshots.map(snapshot => {
                const { date, time } = this.modules.history.formatSnapshotDate(snapshot.createdAt);
                const size = this.modules.history.formatSize(snapshot.size);
                return `
                <li class="history-item" data-id="${snapshot.id}" role="option" tabindex="0">
                    <div class="history-item-date">${date}</div>
                    <div class="history-item-time">${time}</div>
                    <div class="history-item-size">${size}</div>
                </li>
                `;
            }).join('');

            // Add click handlers
            list.querySelectorAll('.history-item').forEach(item => {
                item.addEventListener('click', async (e) => {
                    // Toggle selection
                    const wasSelected = item.classList.contains('selected');
                    // Multi-select with ctrl/cmd key
                    if (!e.ctrlKey && !e.metaKey) {
                        list.querySelectorAll('.history-item').forEach(i => i.classList.remove('selected'));
                    }

                    item.classList.toggle('selected', !wasSelected);

                    // Update preview
                    const selectedItems = list.querySelectorAll('.history-item.selected');
                    restoreBtn.disabled = selectedItems.length !== 1;
                    compareBtn.disabled = selectedItems.length !== 2;

                    if (selectedItems.length === 1) {
                        try {
                            const content = await this.modules.history.getSnapshotContent(item.dataset.id);
                            preview.textContent = content;
                        } catch (error) {
                            preview.textContent = 'Failed to load snapshot';
                        }
                    } else {
                        preview.innerHTML = '<p class="placeholder-text">Select a version to preview</p>';
                    }
                });
            });
        }

        restoreBtn.disabled = true;
        compareBtn.disabled = true;
        preview.innerHTML = '<p class="placeholder-text">Select a version to preview</p>';

        modal.hidden = false;
    }

    /**
     * Restore selected version
     */
    async restoreSelectedVersion() {
        const list = document.getElementById('history-list');
        const selected = list.querySelector('.history-item.selected');

        if (!selected) return;

        const activeTab = this.modules.tabs.getActiveTab();
        if (!activeTab) return;

        try {
            const content = await this.modules.history.restoreSnapshot(activeTab.id, selected.dataset.id);
            this.modules.editor.setContent(content);
            this.closeModal('history-modal');
            this.showToast('Version restored', 'success');
        } catch (error) {
            console.error('Restore failed:', error);
            this.showToast('Failed to restore version', 'error');
        }
    }

    /**
     * Compare selected versions
     */
    async compareSelectedVersions() {
        const list = document.getElementById('history-list');
        const selected = list.querySelectorAll('.history-item.selected');

        if (selected.length !== 2) return;

        try {
            const [older, newer] = await Promise.all([
                this.modules.history.getSnapshotContent(selected[0].dataset.id),
                this.modules.history.getSnapshotContent(selected[1].dataset.id)
            ]);

            const diff = this.modules.diff || new MarkdownEditor.Diff();
            const diffOperations = diff.computeDiff(older, newer);
            const diffHtml = diff.renderDiff(diffOperations);

            document.getElementById('diff-container').innerHTML = diffHtml;
            this.openModal('diff-modal');
        } catch (error) {
            console.error('Compare failed:', error);
            this.showToast('Failed to compare versions', 'error');
        }
    }

    /**
     * Generate markdown table
     */
    generateTable(rows, cols) {
        let table = '\n';

        // Header row
        table += '| ' + Array(cols).fill('Header').map((h, i) => `${h} ${i + 1} `).join(' | ') + ' |\n';

        // Separator row
        table += '| ' + Array(cols).fill('---').join(' | ') + ' |\n';

        // Data rows
        for (let r = 0; r < rows - 1; r++) {
            table += '| ' + Array(cols).fill('Cell').join(' | ') + ' |\n';
        }

        return table + '\n';
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type} `;
        toast.textContent = message;

        container.appendChild(toast);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Register service worker for PWA
     */
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('sw.js');
                console.log('Service Worker registered:', registration.scope);
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }
}

// Create and initialize app
// Create and initialize app
const app = new App();
window.MarkdownEditor = { App: app }; // Optional compatibility

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app.init();
    });
} else {
    app.init();
}