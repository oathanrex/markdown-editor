/**
 * js/editor/shortcuts.js
 * Responsibility: Maps keyboard combinations to application and editor commands.
 */

import { actions } from './toolbar-actions.js';

export function initShortcuts(view, handlers) {
    window.addEventListener('keydown', (e) => {
        const isMod = (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey);

        if (isMod) {
            switch (e.key.toLowerCase()) {
                case 'b':
                    e.preventDefault();
                    actions.bold(view);
                    break;
                case 'i':
                    e.preventDefault();
                    actions.italic(view);
                    break;
                case 's':
                    e.preventDefault();
                    handlers.onSave();
                    break;
                case 'f':
                    e.preventDefault();
                    handlers.onFind();
                    break;
                case 'h':
                    if (!e.shiftKey) { // Ctrl+H for replace
                        e.preventDefault();
                        handlers.onReplace();
                    }
                    break;
            }
        }
    });
}
