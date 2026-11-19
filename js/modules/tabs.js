/**
 * Tabs Module
 * Multi-document tab management
 */

export const DEFAULT_STARTER_GUIDE = `# ⚡ AI Markdown Studio & Universal Document Bridge
> **Paste raw outputs from Claude, ChatGPT, or DeepSeek to instantly format, visualize architecture diagrams, and export executive-ready PDFs, Word docs, and clean GitHub Markdown.**

---

### 🎯 Why Developers & Writers Use This Space

Every day, you copy complex Markdown from AI assistants—PRDs, API specs, schemas, and reports. But raw Markdown full of backticks and asterisks isn't presentable to clients, executives, or teammates.

**This studio bridges that gap with 4 core superpowers:**

| Capability | What It Does For You | Action / Shortcut |
| :--- | :--- | :--- |
| **🤖 AI Output Formatter** | Paste raw Claude / ChatGPT markdown -> Instant executive formatting | \`Ctrl + V\` anywhere |
| **📊 Architecture Diagrams** | Live Mermaid.js rendering for system flows, sequence diagrams, and ERDs | \` \`\`\`mermaid \` blocks |
| **📥 Drag & Drop Ingestion** | Drop any \`.docx\`, \`.pdf\`, \`.xlsx\`, or \`.csv\` directly into clean Markdown | Drag files into editor |
| **📤 1-Click Multi-Export** | Export print-styled PDF, Word \`.docx\`, raw \`.html\`, or clean \`.md\` | Click **Export** in toolbar |
| **🔒 Enterprise Zero-Leak** | 100% Client-Side. No server uploads. Proprietary code & NDAs stay in RAM | IndexedDB + AES-256 |

---

### 🛠️ Interactive Feature Playground (Live Preview)

#### 1. System Architecture & Flowcharts (Mermaid.js)
Visualize your AI-generated architecture diagrams instantly:

\`\`\`mermaid
flowchart LR
    A[🤖 AI Assistant\\nClaude / ChatGPT] -->|Raw Markdown| B(⚡ Markdown Editor Studio)
    B -->|Client-Side Parse| C{Format & Enhance}
    C -->|Visual Diagrams| D[Mermaid / KaTeX]
    C -->|Tables & Alerts| E[GFM Clean Tables]
    C -->|Instant Export| F[📄 PDF / 📝 Word / 🌐 HTML]
\`\`\`

#### 2. GitHub-Grade Callouts & Alerts
Highlight critical implementation details or warnings:

> [!TIP]
> **Pro Tip for Developers:** Paste your AI prompt responses directly into this editor. Press **F11** for Zen Mode to focus purely on refining your document.

> [!IMPORTANT]
> **Privacy Guarantee:** Unlike online file converters that store your uploads on cloud servers, this editor parses everything locally in your browser via WebAssembly and JavaScript engines.

> [!WARNING]
> Always verify database migration commands and API keys before executing them in production.

#### 3. Mathematical & Algorithmic Proofs (KaTeX)
Render complex formulas and data science notations:

The standard Gaussian distribution probability density function:
$$ f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2} $$

Time complexity: $O(N \\log N)$ with space bound $S(N) \\le O(K)$.

#### 4. Live Technical Data Matrix
Clean, responsive tables with automatic column alignment:

| Component | Technology | Target Latency | Client-Side Security |
| :--- | :---: | :---: | :--- |
| **Markdown Parser** | Custom GFM Engine | \`< 2ms\` | Zero network transmission |
| **Office Ingestion** | Mammoth.js + SheetJS | \`< 50ms\` | Local ArrayBuffer memory |
| **PDF Extraction** | Mozilla PDF.js | \`< 120ms\` | Isolated Web Worker |
| **Document Storage** | IndexedDB + AES-256 | Instant | Local browser sandbox |

#### 5. Code Blocks with Filenames & 1-Click Copy
Syntax-highlighted code snippets ready for documentation:

\`\`\`python title="audit_pipeline.py"
import asyncio
from dataclasses import dataclass

@dataclass
class AuditResult:
    score: float
    passed: bool
    remediation_plan: list[str]

async def run_document_audit(markdown_content: str) -> AuditResult:
    """Analyze AI markdown output for structure, headings, and completeness."""
    lines = markdown_content.splitlines()
    has_headings = any(line.startswith('#') for line in lines)
    return AuditResult(score=98.5, passed=has_headings, remediation_plan=["Ready for PDF export"])
\`\`\`

#### 6. Actionable Task Management
Track your workflow milestones:
- [x] Copy raw research and implementation spec from Claude / ChatGPT
- [x] Review Mermaid architecture diagrams and KaTeX formulas
- [ ] Drag & drop supporting Excel data sheet (\`.xlsx\`) to auto-generate comparison table
- [ ] Click **Export** -> **Export as PDF** for executive presentation

---

### ⌨️ Power-User Keyboard Shortcuts

- \`Ctrl + B\` : **Bold**
- \`Ctrl + I\` : *Italics*
- \`Ctrl + K\` : Insert Link
- \`Ctrl + F\` : Find & Replace Panel
- \`Ctrl + S\` : Force Instant Save
- \`F11\` : Fullscreen Zen Mode (Distraction-Free)

*👉 **Ready to begin?** Select all (\`Ctrl + A\`), press \`Backspace\`, and paste your AI output or drag your first file to start!*
`;

/**
 * Tab Manager
 */
export class Tabs {
    constructor(options = {}) {
        this.container = options.container || document.getElementById('tabs-container');
        this.storage = options.storage;
        this.onTabChange = options.onTabChange;
        this.onTabClose = options.onTabClose;

        this.tabs = [];
        this.activeTabId = null;
        this.closeConfirmModalPromise = null;

        this.init();
    }

    /**
     * Initialize tabs
     */
    init() {
        // New tab button
        const newTabBtn = document.getElementById('new-tab-btn');
        if (newTabBtn) {
            newTabBtn.addEventListener('click', () => this.createTab());
        }

        // Keyboard navigation
        this.container.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    /**
     * Handle keyboard navigation
     */
    handleKeydown(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            const currentIndex = this.tabs.findIndex(t => t.id === this.activeTabId);
            let newIndex;

            if (e.key === 'ArrowLeft') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : this.tabs.length - 1;
            } else {
                newIndex = currentIndex < this.tabs.length - 1 ? currentIndex + 1 : 0;
            }

            this.activateTab(this.tabs[newIndex].id);
        }
    }

    /**
     * Create a new tab
     */
    async createTab(document = null) {
        const id = document?.id || `doc-${Date.now()}`;
        const title = document?.title || 'Untitled';
        // content is null if lazy loaded (document exists but content is undefined)
        // content is '' if new document (document is null)
        const content = document ? (document.content !== undefined ? document.content : null) : '';

        const tab = {
            id,
            title,
            content,
            encrypted: !!document?.encrypted,
            unsaved: false,
            createdAt: document?.createdAt || new Date().toISOString()
        };

        this.tabs.push(tab);
        this.renderTab(tab);
        this.activateTab(id);

        // Save to storage if new
        if (!document && this.storage) {
            await this.storage.saveDocument({
                id,
                title,
                content,
                createdAt: tab.createdAt
            });
        }

        return tab;
    }

    /**
     * Render a tab element
     */
    renderTab(tab) {
        const tabEl = document.createElement('div');
        tabEl.className = 'tab';
        tabEl.dataset.id = tab.id;
        tabEl.setAttribute('role', 'tab');
        tabEl.setAttribute('tabindex', '0');
        tabEl.setAttribute('aria-selected', 'false');

        tabEl.innerHTML = `
                <span class="tab-title">${this.escapeHtml(tab.title)}</span>
                <button class="tab-close" aria-label="Close tab">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            `;

        // Tab click
        tabEl.addEventListener('click', (e) => {
            if (!e.target.closest('.tab-close')) {
                this.activateTab(tab.id);
            }
        });

        // Close button
        tabEl.querySelector('.tab-close').addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeTab(tab.id);
        });

        // Double-click to rename
        tabEl.addEventListener('dblclick', () => {
            this.renameTab(tab.id);
        });

        this.container.appendChild(tabEl);
    }

    /**
     * Activate a tab
     */
    activateTab(id) {
        const tab = this.tabs.find(t => t.id === id);
        if (!tab) return;

        // Update active state
        this.activeTabId = id;

        // Update UI
        this.container.querySelectorAll('.tab').forEach(el => {
            const isActive = el.dataset.id === id;
            el.classList.toggle('active', isActive);
            el.setAttribute('aria-selected', isActive);
        });

        // Callback
        if (this.onTabChange) {
            this.onTabChange(tab);
        }
    }

    /**
     * Close a tab
     */
    async closeTab(id) {
        const tabIndex = this.tabs.findIndex(t => t.id === id);
        if (tabIndex === -1) return;

        const tab = this.tabs[tabIndex];

        // Confirm if unsaved
        if (tab.unsaved) {
            const confirmed = await this.confirmCloseTab(tab);
            if (!confirmed) return;
        }

        if (this.storage) {
            try {
                await this.storage.deleteDocument(id);
            } catch (error) {
                console.error('Failed to delete document:', error);
                return;
            }
        }

        // Remove tab
        this.tabs.splice(tabIndex, 1);

        // Remove from DOM
        const tabEl = this.container.querySelector(`[data-id="${id}"]`);
        if (tabEl) tabEl.remove();

        // Callback
        if (this.onTabClose) {
            this.onTabClose(tab);
        }

        // Activate another tab or create new one
        if (this.tabs.length === 0) {
            await this.createTab();
        } else if (this.activeTabId === id) {
            const newIndex = Math.min(tabIndex, this.tabs.length - 1);
            this.activateTab(this.tabs[newIndex].id);
        }
    }

    /**
     * Confirm tab close for unsaved document using modal dialog
     */
    async confirmCloseTab(tab) {
        const modal = this.getOrCreateCloseConfirmModal();
        const titleEl = modal.querySelector('[data-close-title]');
        if (titleEl) {
            titleEl.textContent = tab.title || 'Untitled';
        }

        modal.hidden = false;

        if (!this.closeConfirmModalPromise) {
            this.closeConfirmModalPromise = new Promise((resolve) => {
                const cleanup = () => {
                    const cancelBtn = modal.querySelector('#confirm-close-tab-cancel');
                    const closeBtn = modal.querySelector('#confirm-close-tab-x');
                    const confirmBtn = modal.querySelector('#confirm-close-tab-confirm');
                    const backdrop = modal.querySelector('.modal-backdrop');
                    const escHandler = (e) => {
                        if (e.key === 'Escape') {
                            finish(false);
                        }
                    };

                    cancelBtn?.removeEventListener('click', onCancel);
                    closeBtn?.removeEventListener('click', onCancel);
                    backdrop?.removeEventListener('click', onCancel);
                    confirmBtn?.removeEventListener('click', onConfirm);
                    document.removeEventListener('keydown', escHandler);
                };

                const finish = (value) => {
                    cleanup();
                    modal.hidden = true;
                    this.closeConfirmModalPromise = null;
                    resolve(value);
                };

                const onCancel = () => finish(false);
                const onConfirm = () => finish(true);
                const cancelBtn = modal.querySelector('#confirm-close-tab-cancel');
                const closeBtn = modal.querySelector('#confirm-close-tab-x');
                const confirmBtn = modal.querySelector('#confirm-close-tab-confirm');
                const backdrop = modal.querySelector('.modal-backdrop');
                const escHandler = (e) => {
                    if (e.key === 'Escape') {
                        finish(false);
                    }
                };

                cancelBtn?.addEventListener('click', onCancel);
                closeBtn?.addEventListener('click', onCancel);
                backdrop?.addEventListener('click', onCancel);
                confirmBtn?.addEventListener('click', onConfirm);
                document.addEventListener('keydown', escHandler);
            });
        }

        return this.closeConfirmModalPromise;
    }

    /**
     * Build close-confirm modal once and reuse it
     */
    getOrCreateCloseConfirmModal() {
        let modal = document.getElementById('confirm-close-tab-modal');
        if (modal) return modal;

        modal = document.createElement('div');
        modal.id = 'confirm-close-tab-modal';
        modal.className = 'modal modal-small';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'confirm-close-tab-title');
        modal.hidden = true;
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="confirm-close-tab-title">Close Unsaved Document?</h2>
                    <button id="confirm-close-tab-x" class="modal-close" aria-label="Close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <p>
                        <strong data-close-title>Untitled</strong> has unsaved changes.
                        Are you sure you want to close and delete it?
                    </p>
                    <div class="modal-actions" style="display:flex; gap:0.5rem; justify-content:flex-end; margin-top:1rem;">
                        <button id="confirm-close-tab-cancel" class="btn">Cancel</button>
                        <button id="confirm-close-tab-confirm" class="btn btn-danger">Close & Delete</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        return modal;
    }

    /**
     * Rename a tab
     */
    renameTab(id) {
        const tab = this.tabs.find(t => t.id === id);
        if (!tab) return;

        const tabEl = this.container.querySelector(`[data-id="${id}"]`);
        const titleEl = tabEl.querySelector('.tab-title');

        const input = document.createElement('input');
        input.type = 'text';
        input.value = tab.title;
        input.className = 'tab-title-input';
        input.style.cssText = 'width: 100%; border: none; background: transparent; color: inherit; font: inherit; outline: none;';

        const finishRename = async () => {
            const newTitle = input.value.trim() || 'Untitled';
            tab.title = newTitle;
            titleEl.textContent = newTitle;
            input.replaceWith(titleEl);

            // Save to storage
            if (this.storage) {
                const doc = await this.storage.getDocument(id);
                if (doc) {
                    doc.title = newTitle;
                    await this.storage.saveDocument(doc);
                }
            }
        };

        input.addEventListener('blur', finishRename);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                input.blur();
            } else if (e.key === 'Escape') {
                input.value = tab.title;
                input.blur();
            }
        });

        titleEl.replaceWith(input);
        input.focus();
        input.select();
    }

    /**
     * Update tab content
     */
    updateTabContent(id, content) {
        const tab = this.tabs.find(t => t.id === id);
        if (tab) {
            tab.content = content;
        }
    }

    /**
     * Mark tab as unsaved
     */
    setUnsaved(id, unsaved = true) {
        const tab = this.tabs.find(t => t.id === id);
        if (!tab) return;

        tab.unsaved = unsaved;

        const tabEl = this.container.querySelector(`[data-id="${id}"]`);
        if (tabEl) {
            tabEl.classList.toggle('tab-unsaved', unsaved);
        }
    }

    /**
     * Get active tab
     */
    getActiveTab() {
        return this.tabs.find(t => t.id === this.activeTabId);
    }

    /**
     * Get tab by ID
     */
    getTab(id) {
        return this.tabs.find(t => t.id === id);
    }

    /**
     * Get all tabs
     */
    getAllTabs() {
        return [...this.tabs];
    }

    /**
     * Load tabs from storage
     */
    async loadFromStorage() {
        if (!this.storage) return;

        const documents = await this.storage.getAllDocuments();

        if (documents.length === 0) {
            // Create default tab with rich AI workflow starter guide
            await this.createTab({
                title: 'Welcome & AI Cheatsheet',
                content: DEFAULT_STARTER_GUIDE
            });
        } else {
            // Load existing documents
            for (const doc of documents) {
                await this.createTab(doc);
            }
        }
    }

    /**
     * Switch to next tab
     */
    nextTab() {
        const currentIndex = this.tabs.findIndex(t => t.id === this.activeTabId);
        const nextIndex = (currentIndex + 1) % this.tabs.length;
        this.activateTab(this.tabs[nextIndex].id);
    }

    /**
     * Switch to previous tab
     */
    previousTab() {
        const currentIndex = this.tabs.findIndex(t => t.id === this.activeTabId);
        const prevIndex = currentIndex === 0 ? this.tabs.length - 1 : currentIndex - 1;
        this.activateTab(this.tabs[prevIndex].id);
    }

    /**
     * Escape HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

