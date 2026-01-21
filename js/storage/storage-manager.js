/**
 * js/storage/storage-manager.js
 * Responsibility: Handles persistence to LocalStorage and local version history.
 */

const STORAGE_KEY = 'md-editor-content';
const HISTORY_KEY = 'md-editor-history';
const MAX_HISTORY = 10;

export function saveContent(content) {
    localStorage.setItem(STORAGE_KEY, content);
    addToHistory(content);
}

export function loadContent() {
    return localStorage.getItem(STORAGE_KEY) || '';
}

export function addToHistory(content) {
    let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    // Only add if different from the last entry
    if (history.length > 0 && history[0].content === content) return;

    history.unshift({
        content,
        timestamp: new Date().toISOString()
    });

    if (history.length > MAX_HISTORY) {
        history = history.slice(0, MAX_HISTORY);
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getHistory() {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
}
