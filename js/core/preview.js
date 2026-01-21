/**
 * js/core/preview.js
 * Responsibility: Handles markdown parsing, sanitization, and complex rendering.
 * Hardened: Added library availability checks and error boundaries.
 */

export async function renderMarkdown(content) {
    if (!window.marked) {
        console.warn("Marked.js not loaded yet.");
        return `<pre>${content}</pre>`;
    }

    try {
        marked.setOptions({
            gfm: true,
            breaks: true,
            headerIds: true,
            mangle: false
        });

        let html = marked.parse(content || '');

        if (window.DOMPurify) {
            html = DOMPurify.sanitize(html);
        }

        return html;
    } catch (err) {
        console.error("Markdown parsing error:", err);
        return `<div class="error">Error parsing markdown: ${err.message}</div>`;
    }
}

export async function postProcess(container) {
    if (!container) return;

    // 1. Math Rendering (KaTeX)
    if (window.renderMathInElement) {
        try {
            renderMathInElement(container, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true }
                ],
                throwOnError: false
            });
        } catch (e) {
            console.error("KaTeX error:", e);
        }
    }

    // 2. Diagram Rendering (Mermaid)
    if (window.mermaid) {
        try {
            mermaid.initialize({ startOnLoad: false, theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default' });
            const diagrams = container.querySelectorAll('.language-mermaid');

            for (const el of diagrams) {
                // Remove existing processed attribute if re-rendering
                el.removeAttribute('data-processed');
                // Ensure it's a div not pre code for better rendering support if needed, though run handles nodes
            }

            if (diagrams.length > 0) {
                // Filter out obviously incomplete diagrams (e.g., just "graph")
                const validDiagrams = Array.from(diagrams).filter(el => {
                    const code = el.innerText.trim();
                    return code.length > 5 && !code.match(/^\s*graph\s*$/i);
                });

                if (validDiagrams.length > 0) {
                    await mermaid.run({
                        nodes: validDiagrams,
                        suppressErrors: true
                    }).catch(e => {
                        console.warn("Mermaid run error:", e);
                        validDiagrams.forEach(el => {
                            if (!el.getAttribute('data-processed')) {
                                el.innerHTML = `<div style="color:var(--text-error, #cf222e); background: rgba(255,0,0,0.05); padding: 8px; border-radius: 4px; border: 1px solid rgba(255,0,0,0.1); font-family:monospace; font-size: 0.85rem;">Diagram Syntax Error</div>`;
                            }
                        });
                    });
                }
            }
        } catch (e) {
            console.warn("Mermaid rendering failed:", e);
        }
    }

    // 3. Syntax Highlighting (Prism)
    if (window.Prism) {
        try {
            Prism.highlightAllUnder(container);
        } catch (e) {
            console.error("Prism error:", e);
        }
    }

    // 4. Inject Copy Buttons
    try {
        container.querySelectorAll('pre').forEach(pre => {
            // Prevent duplicate buttons
            if (pre.querySelector('.copy-code-btn')) return;

            // Only add to pre that has code (ignore mermaid or non-code blocks if any)
            // Mermaid blocks usually are div.mermaid, but checking just in case
            if (pre.classList.contains('mermaid')) return;

            const button = document.createElement('button');
            button.className = 'copy-code-btn';
            button.setAttribute('aria-label', 'Copy code');
            button.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy
            `;

            button.addEventListener('click', async () => {
                const code = pre.querySelector('code');
                const text = code ? code.innerText : pre.innerText;

                try {
                    await navigator.clipboard.writeText(text);

                    // Feedback
                    button.classList.add('copied');
                    button.innerHTML = `
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Copied!
                    `;

                    setTimeout(() => {
                        button.classList.remove('copied');
                        button.innerHTML = `
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            Copy
                        `;
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                    button.textContent = 'Error';
                }
            });

            pre.appendChild(button);
        });
    } catch (e) {
        console.error("Error adding copy buttons:", e);
    }
}
