/**
 * js/core/state.js
 * Responsibility: Manages centralized application state and settings.
 */

export const state = {
    content: '',
    fileName: 'untitled.md',
    lastSaved: null,
    settings: {
        autosave: true,
        autosaveInterval: 30000,
        linenumbers: true,
        previewTheme: 'github',
        editorTheme: 'light',
        fontSize: 14,
        fontFamily: "'Fira Code', monospace",
        lineHeight: 1.6,
        wordWrap: true,
        syncScroll: true
    },
    ui: {
        isSidebarOpen: true,
        activeTab: 'editor',
        isZenMode: false
    }
};

export const listeners = [];

export function subscribe(callback) {
    listeners.push(callback);
}

export function updateState(newState) {
    Object.assign(state, newState);
    notify();
}

export function updateSetting(key, value) {
    state.settings[key] = value;
    notify();
}

function notify() {
    listeners.forEach(cb => cb(state));
}
