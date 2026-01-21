/**
 * js/editor/toolbar-actions.js
 * Responsibility: Executes text formatting by dispatching changes to the CodeMirror view.
 */

export function toggleWrap(view, syntax) {
    const { from, to } = view.state.selection.main;
    const selectedText = view.state.sliceDoc(from, to);

    view.dispatch({
        changes: { from, to, insert: `${syntax}${selectedText}${syntax}` },
        selection: { anchor: from + syntax.length, head: to + syntax.length }
    });
    view.focus();
}

export function insertPrefix(view, prefix) {
    const { from } = view.state.selection.main;
    const line = view.state.doc.lineAt(from);

    view.dispatch({
        changes: { from: line.from, to: line.from, insert: prefix },
        selection: { anchor: from + prefix.length }
    });
    view.focus();
}

export function insertSnippet(view, snippet, offset = 0) {
    const { from, to } = view.state.selection.main;
    view.dispatch({
        changes: { from, to, insert: snippet },
        selection: { anchor: from + offset }
    });
    view.focus();
}

export const actions = {
    bold: (view) => toggleWrap(view, '**'),
    italic: (view) => toggleWrap(view, '*'),
    strike: (view) => toggleWrap(view, '~~'),
    h1: (view) => insertPrefix(view, '# '),
    h2: (view) => insertPrefix(view, '## '),
    h3: (view) => insertPrefix(view, '### '),
    ul: (view) => insertPrefix(view, '- '),
    ol: (view) => insertPrefix(view, '1. '),
    task: (view) => insertPrefix(view, '- [ ] '),
    code: (view) => toggleWrap(view, '`'),
    codeblock: (view) => insertSnippet(view, '```\n\n```', 4),
    math: (view) => insertSnippet(view, '$$\n\n$$', 3),
    mermaid: (view) => insertSnippet(view, '\n```mermaid\ngraph TD\n    A[Start] --> B{Is it?}\n    B -- Yes --> C[OK]\n    B -- No --> D[Rethink]\n```\n', 0),
    quote: (view) => insertPrefix(view, '> '),
    hr: (view) => insertSnippet(view, '\n---\n', 5),
    link: (view) => insertSnippet(view, '[Text](https://url)', 1),
    image: (view) => insertSnippet(view, '![Alt](https://image-url)', 2),
    table: (view) => insertSnippet(view, '\n| Col 1 | Col 2 |\n|-------|-------|\n| Val 1 | Val 2 |\n', 4)
};
