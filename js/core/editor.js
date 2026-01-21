/**
 * js/core/editor.js
 * Responsibility: Initializes and configures CodeMirror 6 for markdown editing.
 * Hardened: Supports dynamic theme switching and robust scroll info.
 */

import { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection, dropCursor, highlightSpecialChars, highlightActiveLineGutter } from 'https://esm.sh/@codemirror/view@6.23.0';
import { EditorState, Compartment } from 'https://esm.sh/@codemirror/state@6.4.0';
import { markdown } from 'https://esm.sh/@codemirror/lang-markdown@6.2.3';
import { oneDark } from 'https://esm.sh/@codemirror/theme-one-dark@6.1.2';
import { defaultKeymap, history, historyKeymap } from 'https://esm.sh/@codemirror/commands@6.6.0';
import { searchKeymap, highlightSelectionMatches } from 'https://esm.sh/@codemirror/search@6.5.6';
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from 'https://esm.sh/@codemirror/autocomplete@6.16.3';

let editor;
const themeCompartment = new Compartment();

export function initEditor(container, initialContent, onUpdate) {
    if (!container) return null;

    const updateListener = EditorView.updateListener.of((update) => {
        if (update.docChanged) {
            onUpdate(update.state.doc.toString());
        }
    });

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Manual setup to ensure singleton instances of Extension classes
    const extensions = [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        markdown(),

        // Keymaps
        keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...searchKeymap,
            ...historyKeymap,
            ...completionKeymap
        ]),

        // Functional components
        autocompletion(),
        closeBrackets(),
        highlightSelectionMatches(),
        highlightActiveLine(),

        // App Logic
        updateListener,
        EditorView.lineWrapping,
        themeCompartment.of(isDark ? oneDark : []),
        EditorView.theme({
            "&": { height: "100%" },
            ".cm-scroller": { overflow: "auto" }
        })
    ];

    const startState = EditorState.create({
        doc: initialContent,
        extensions: extensions
    });

    editor = new EditorView({
        state: startState,
        parent: container
    });

    return editor;
}

export function setTheme(isDark) {
    if (!editor) return;
    editor.dispatch({
        effects: themeCompartment.reconfigure(isDark ? oneDark : [])
    });
}

export function setEditorContent(content) {
    if (!editor) return;
    const current = editor.state.doc.toString();
    if (current === content) return;

    editor.dispatch({
        changes: { from: 0, to: editor.state.doc.length, insert: content }
    });
}

export function getEditorContent() {
    return editor ? editor.state.doc.toString() : '';
}

export function focusEditor() {
    if (editor) editor.focus();
}

export function getScrollInfo() {
    if (!editor) return { top: 0, height: 0, client: 0 };
    const scroller = editor.scrollDOM;
    return {
        top: scroller.scrollTop,
        height: scroller.scrollHeight,
        client: scroller.clientHeight
    };
}
