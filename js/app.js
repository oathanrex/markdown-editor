/**
 * js/app.js
 * Responsibility: Application bootstrap, event wiring, and orchestration.
 * Hardened: Robust scroll sync, theme state management, and error boundaries.
 */

import { state, subscribe, updateState } from './core/state.js';
import { initEditor, getScrollInfo, setTheme, setEditorContent } from './core/editor.js';
import { renderMarkdown, postProcess } from './core/preview.js';
import { actions, insertSnippet } from './editor/toolbar-actions.js';
import { initShortcuts } from './editor/shortcuts.js';
import { saveContent, loadContent } from './storage/storage-manager.js';
import { initModals, setupSettings, populateEmojis } from './ui/modals.js';
import { toast } from './ui/toast.js';
import { generateOutline } from './ui/sidebar.js';
import { exportManager } from './export/export-manager.js';

document.addEventListener('DOMContentLoaded', async () => {
    // DOM Elements with defensive checks
    const editorContainer = document.getElementById('cm-editor');
    const previewContainer = document.getElementById('preview-content');
    const previewPane = document.getElementById('preview-pane');
    const loadingOverlay = document.getElementById('loading');
    const appContainer = document.getElementById('app');
    const outlineContainer = document.getElementById('outline-content');
    const syncStatus = document.getElementById('sync-status');

    try {
        if (!editorContainer || !previewContainer || !appContainer) {
            throw new Error("Critical UI elements missing.");
        }

        // 1. Initialize UI Elements
        const { openModal, closeModal } = initModals();
        setupSettings();

        // 2. Load initial state
        const initialContent = loadContent() || '# Hello World\n\nWelcome to your professional Markdown Editor.';
        let lastSavedContent = initialContent;

        // 3. Initialize Editor
        const editor = initEditor(editorContainer, initialContent, (newContent) => {
            updateState({ content: newContent });
        });

        if (!editor) {
            throw new Error("Failed to initialize editor engine.");
        }

        populateEmojis(document.getElementById('emoji-list'), (emoji) => {
            insertSnippet(editor, emoji);
            closeModal();
        });

        // 4. State Subscription (Debounced rendering)
        let renderTimer;
        subscribe(async (newState) => {
            if (syncStatus) syncStatus.textContent = newState.content === lastSavedContent ? 'All changes saved' : 'Unsaved changes';

            clearTimeout(renderTimer);
            renderTimer = setTimeout(async () => {
                const rawHtml = await renderMarkdown(newState.content);
                if (previewContainer) {
                    previewContainer.innerHTML = rawHtml;
                    await postProcess(previewContainer);
                }
                updateStats(newState.content, editor);
                if (outlineContainer) {
                    generateOutline(newState.content, outlineContainer, (line) => {
                        try {
                            const linePos = editor.state.doc.line(line + 1);
                            editor.dispatch({ selection: { anchor: linePos.from }, scrollIntoView: true });
                        } catch (e) {
                            console.warn("Could not jump to heading line:", line);
                        }
                    });
                }
            }, 100);
        });

        // 5. Toolbar Event Delegation
        document.querySelector('.toolbar')?.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-cmd]');
            if (btn) {
                const cmd = btn.getAttribute('data-cmd');
                if (['table', 'link', 'image', 'emoji'].includes(cmd)) {
                    openModal(`${cmd}-modal`);
                } else if (actions[cmd]) {
                    actions[cmd](editor);
                }
            }
        });

        // 6. Modal Specific Logic (Harden inputs)
        document.getElementById('confirm-table')?.addEventListener('click', () => {
            const rows = Math.min(100, Math.max(1, document.getElementById('table-rows').value || 1));
            const cols = Math.min(20, Math.max(1, document.getElementById('table-cols').value || 1));
            const header = document.getElementById('table-header').checked;
            let table = '\n';
            for (let r = 0; r < rows; r++) {
                table += '| ' + Array(parseInt(cols)).fill('   ').join(' | ') + ' |\n';
                if (r === 0 && header) {
                    table += '| ' + Array(parseInt(cols)).fill('---').join(' | ') + ' |\n';
                }
            }
            insertSnippet(editor, table);
            closeModal();
        });

        document.getElementById('confirm-link')?.addEventListener('click', () => {
            const text = document.getElementById('link-text').value || 'link';
            const url = document.getElementById('link-url').value || 'https://';
            insertSnippet(editor, `[${text}](${url})`);
            closeModal();
        });

        document.getElementById('confirm-image')?.addEventListener('click', () => {
            const alt = document.getElementById('image-alt').value || 'alt';
            const url = document.getElementById('image-url').value || 'https://';
            insertSnippet(editor, `![${alt}](${url})`);
            closeModal();
        });

        document.getElementById('settings-toggle')?.addEventListener('click', () => openModal('settings-modal'));

        // 7. Navigation / Menu Handlers
        document.querySelectorAll('.menu-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const parent = trigger.parentElement;
                const wasActive = parent.classList.contains('active');

                // Close all first
                document.querySelectorAll('.menu-item.active').forEach(m => m.classList.remove('active'));

                if (!wasActive) parent.classList.add('active');
            });
        });

        document.addEventListener('click', () => {
            document.querySelectorAll('.menu-item.active').forEach(m => m.classList.remove('active'));
        });

        document.querySelectorAll('.app-nav button[data-action]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const action = btn.getAttribute('data-action');
                // Close menu immediately on click
                btn.closest('.menu-item')?.classList.remove('active');

                try {
                    switch (action) {
                        case 'new':
                            if (confirm('Create new document? Unsaved changes will be lost.')) {
                                updateState({ content: '', fileName: 'untitled.md' });
                                setEditorContent('');
                            }
                            break;
                        case 'open':
                        case 'import':
                            document.getElementById('import-input')?.click();
                            break;
                        case 'save':
                            saveContent(state.content);
                            lastSavedContent = state.content;
                            if (syncStatus) syncStatus.textContent = 'All changes saved';
                            toast.success('Saved to local storage');
                            break;
                        case 'export-pdf':
                            toast.info('Generating PDF...');
                            await exportManager.pdf(previewContainer, state.fileName.replace(/\.[^/.]+$/, "") + '.pdf');
                            toast.success('PDF Exported');
                            break;
                        case 'export-html':
                            exportManager.html(state.content, previewContainer.innerHTML, state.fileName.replace(/\.[^/.]+$/, "") + '.html');
                            toast.success('HTML Exported');
                            break;
                        case 'export-docx':
                            toast.info('Generating DOCX...');
                            await exportManager.docx(state.content, state.fileName.replace(/\.[^/.]+$/, "") + '.docx');
                            toast.success('DOCX Exported');
                            break;
                        case 'export-latex':
                            exportManager.latex(state.content, state.fileName.replace(/\.[^/.]+$/, "") + '.tex');
                            toast.success('LaTeX Exported');
                            break;
                    }
                } catch (err) {
                    toast.error(`Export failed: ${err.message}`);
                    console.error(err);
                }
            });
        });

        // 8. File Import Logic
        const importInput = document.getElementById('import-input');
        const handleFile = (file) => {
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                updateState({ content, fileName: file.name });
                setEditorContent(content);
                lastSavedContent = content;
                toast.success(`Imported ${file.name}`);
            };
            reader.onerror = () => toast.error("File could not be read.");
            reader.readAsText(file);
        };

        importInput?.addEventListener('change', (e) => {
            if (e.target.files.length > 0) handleFile(e.target.files[0]);
        });

        // 9. Drag and Drop Support (Window level)
        window.addEventListener('dragover', (e) => e.preventDefault());
        window.addEventListener('drop', (e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            const validExtensions = ['.md', '.markdown', '.txt'];
            if (file && validExtensions.some(ext => file.name.endsWith(ext))) {
                handleFile(file);
            }
        });

        // 10. Keyboard Shortcuts
        initShortcuts(editor, {
            onSave: () => {
                saveContent(state.content);
                lastSavedContent = state.content;
                if (syncStatus) syncStatus.textContent = 'All changes saved';
                toast.success('Document saved locally');
            },
            onFind: () => toast.info('Find feature: Use Ctrl+F (standard editor find)'),
            onReplace: () => toast.info('Replace feature: Use Ctrl+H')
        });

        // 11. Auto-save Loop (Dirty checked)
        setInterval(() => {
            if (state.settings.autosave && state.content !== lastSavedContent) {
                saveContent(state.content);
                lastSavedContent = state.content;
                if (syncStatus) syncStatus.textContent = 'All changes saved';
            }
        }, state.settings.autosaveInterval);

        // 12. Robust Scroll Synchronization
        const cmScroller = editor.scrollDOM;
        let syncSource = null; // 'cm' | 'preview' | null

        cmScroller.addEventListener('scroll', () => {
            if (!state.settings.syncScroll || syncSource === 'preview') return;
            syncSource = 'cm';
            const scrollInfo = getScrollInfo();
            const maxScroll = scrollInfo.height - scrollInfo.client;
            if (maxScroll > 0) {
                const percentage = scrollInfo.top / maxScroll;
                previewPane.scrollTop = percentage * (previewPane.scrollHeight - previewPane.clientHeight);
            }
            setTimeout(() => { if (syncSource === 'cm') syncSource = null; }, 50);
        });

        previewPane?.addEventListener('scroll', () => {
            if (!state.settings.syncScroll || syncSource === 'cm') return;
            syncSource = 'preview';
            const maxScroll = previewPane.scrollHeight - previewPane.clientHeight;
            if (maxScroll > 0) {
                const percentage = previewPane.scrollTop / maxScroll;
                cmScroller.scrollTop = percentage * (cmScroller.scrollHeight - cmScroller.clientHeight);
            }
            setTimeout(() => { if (syncSource === 'preview') syncSource = null; }, 50);
        });

        // 13. Resizer Logic
        const resizer = document.getElementById('resizer');
        const splitView = document.getElementById('split-view');
        let isResizing = false;

        resizer?.addEventListener('mousedown', () => { isResizing = true; document.body.style.cursor = 'col-resize'; });
        document.addEventListener('mousemove', (e) => {
            if (!isResizing || !splitView) return;
            const rect = splitView.getBoundingClientRect();
            const offset = e.clientX - rect.left;
            const percentage = (offset / rect.width) * 100;
            if (percentage > 5 && percentage < 95) {
                document.getElementById('editor-pane').style.flex = `0 0 ${percentage}%`;
            }
        });
        document.addEventListener('mouseup', () => { isResizing = false; document.body.style.cursor = 'default'; });

        // 14. Theme Toggle & Initial Sync
        const themeBtn = document.getElementById('theme-toggle');
        const syncTheme = (theme) => {
            const isDark = theme === 'dark';
            document.documentElement.setAttribute('data-theme', theme);
            setTheme(isDark);
            localStorage.setItem('md-editor-theme', theme);
        };

        themeBtn?.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            syncTheme(newTheme);
            toast.info(`Theme switched to ${newTheme} mode`);
        });

        // Sync theme on load
        const savedTheme = localStorage.getItem('md-editor-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        syncTheme(savedTheme);

        // Final Init
        updateState({ content: initialContent });

        // 15. Service Worker Registration
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(reg => console.log('SW Registered', reg.scope))
                    .catch(err => console.error('SW Failed', err));
            });
        }

    } catch (err) {
        console.error("Initialization Error:", err);
        alert("Initialization failed: " + err.message); // Fallback alert
        toast.error("Critical Error: " + err.message);
    } finally {
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        if (appContainer) appContainer.style.display = 'flex';
    }
});

function updateStats(content, view) {
    if (!view) return;
    const words = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;

    try {
        const pos = view.state.selection.main.head;
        const line = view.state.doc.lineAt(pos);
        const col = pos - line.from + 1;

        const wordCountEl = document.getElementById('word-count');
        const posInfoEl = document.getElementById('pos-info');
        const readingTimeEl = document.getElementById('reading-time');

        if (wordCountEl) wordCountEl.textContent = `${words} words`;
        if (posInfoEl) posInfoEl.textContent = `Ln ${line.number}, Col ${col}`;

        const readingTime = Math.max(1, Math.ceil(words / 200));
        if (readingTimeEl) readingTimeEl.textContent = `${readingTime} min read`;
    } catch (e) {
        console.warn("Failed to update status bar stats:", e);
    }
}
