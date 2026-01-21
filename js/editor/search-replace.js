/**
 * js/editor/search-replace.js
 * Responsibility: Implements find and replace logic interacting with CodeMirror 6.
 */

// Since we are not using the full CM6 Search extension to keep it lightweight,
// we implement a search logic using the State API.

export function findText(view, query, options = {}) {
    if (!query) return null;

    const { doc } = view.state;
    const text = doc.toString();
    const flags = (options.caseSensitive ? '' : 'i') + (options.regex ? '' : '');

    let regex;
    try {
        const pattern = options.regex ? query : query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        regex = new RegExp(pattern, flags + 'g');
    } catch (e) {
        return null; // Invalid regex
    }

    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        matches.push({ from: match.index, to: match.index + match[0].length });
    }

    return matches;
}

export function replaceAll(view, query, replacement, options = {}) {
    const matches = findText(view, query, options);
    if (!matches || matches.length === 0) return;

    const changes = matches.map(m => ({ from: m.from, to: m.to, insert: replacement }));
    view.dispatch({ changes });
}
